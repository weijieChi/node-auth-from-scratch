import type { User } from "../generated/prisma/client.js"

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}

/*
Omit<User, "id">:
忽視或刪除 User type 的 id 的 key 值，如果沒有在 User type 定義 id 則沒有作用
*/