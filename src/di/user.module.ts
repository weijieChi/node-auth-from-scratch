import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.services.js";
import { UserController } from "../controllers/user.controller.js";
import { PrismaClient } from "@prisma/client";

export const createUserModule = (prisma: PrismaClient) => {
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  return {
    userRepository,
    userService,
    userController,
  };
};
