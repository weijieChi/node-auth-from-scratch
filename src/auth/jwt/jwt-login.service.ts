import { AppError } from "../../errors/app-error.js";
import { JwtService } from "./jwt.service.js";
import { JwtRepository } from "./jwt.repository.js";
import { HashHelper } from "../../utils/hash.js";
import type { PrismaClient } from "../../generated/prisma/client.js";

export class JwtLoginService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly jwtRepository: JwtRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await HashHelper.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // access token
    const accessToken = this.jwtService.signAccessToken(user.id);

    // refresh token
    const { token: refreshToken, payload } = this.jwtService.signRefreshToken(
      user.id,
      user.securityStamp,
    );

    await this.jwtRepository.createRefreshToken({
      userId: user.id,
      jti: payload.jti,
      securityStamp: payload.securityStamp,
      expiresAt: new Date(payload.exp * 1000),
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}
