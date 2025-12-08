import { createUserModule } from "./user.module.js";
import { prisma } from '../libs/prisma.js'
// 未來還可以加入 postModule、fileModule...
// import { createPostModule } from "./post.module.js";

export const container = {
  prisma,
  ...createUserModule(prisma),
  // ...createPostModule(),
  // ...createFileModule(),
};