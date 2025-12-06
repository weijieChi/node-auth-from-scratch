import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.services";
import { UserController } from "../controllers/user.controller";

export const createUserModule = () => {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  return {
    userRepository,
    userService,
    userController,
  };
};
