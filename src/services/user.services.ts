import type { IUserRepository } from "../repositories/user.repository.interface.ts";
import { HashHelper } from "../utils/hash.js";
import type { RegisterDTO, LoginDTO } from "../types/user.ts";
import type { User } from "../generated/prisma/client.js"

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: RegisterDTO): Promise<User> {
    const exists = await this.userRepository.findByUsername(data.name);
    if (exists) throw new Error("Username already exists");

    const hashed = await HashHelper.hashPassword(data.password);
    return this.userRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashed,
    });
  }

  async login(data: LoginDTO) {
    const user = await this.userRepository.findByUsername(data.name);
    if (!user) throw new Error("User not found!");

    const match = await HashHelper.compare(data.password, user.password);
    if (!match) throw new Error("Invalid password!");

    return user;
  }
}
