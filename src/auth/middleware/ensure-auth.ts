import type { Request, Response, NextFunction } from "express";
import { ensureSessionAuth } from "./ensure-session-auth.js";
import { AppError } from "../../errors/app-error.js";
// import { ensureJwtAuth } from "./ensure-jwt-auth.js"; // 未來

export async function ensureAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // import { ensureJwtAuth } from "./ensure-jwt-auth.js"; // 未來
  // Session fallback
  if(req.cookies?.sid) {
    return ensureSessionAuth(req, res, next);
  }

  return next(new AppError("Unauthenticated", 401));
}