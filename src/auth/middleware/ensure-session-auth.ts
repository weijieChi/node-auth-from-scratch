import type { Request, Response, NextFunction } from "express";
import { container } from "../../di/container.js";
import { AppError } from "../../errors/app-error.js";

/**
 * Session authentication middleware
 *
 * 職責：
 * - 從 cookie 讀取 sid
 * - 驗證 session 是否存在 / 是否過期
 * - 掛載 req.user
 * - 視需要延長 session（sliding expiration）
 */

export async function ensureSessionAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const sid = req.cookies?.sid;
    if(!sid) {
      return next(new AppError("Unauthenticated", 401));
    }
    // ✅ 一次查出 session + user，並完成過期檢查， session 延期檢查
    const session = await container.session.services.getValidSessionWithUser(sid);
    if(!session) {
      return next(new AppError("session expired or invalid", 401));
    }
    req.user = session.user; 
    return next();
  } catch (err) {
    next(err);
  }
}
