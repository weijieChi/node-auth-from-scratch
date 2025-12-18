/**
 * server.ts
 *
 * 負責：
 * - 應用程式啟動
 * - 監聽 OS / Node.js process 事件
 * - 記錄 application lifecycle log
 * - graceful shutdown
 */

import http from "http";
import { app } from "./app.js";
import { logger } from "./logger/index.js"; // 在 server.ts 啟動 Log
// HTTP server instance（為了之後能 close）
const PORT = process.env.PORT || 5000;
let server: http.Server;

/**
 * ============================
 * Process-level error handlers
 * ============================
 * 這一段一定要在最外層、最早註冊
 */

// Promise 沒有被 catch（致命）
process.on("unhandledRejection", (reason) => {
  logger.error("UnhandledRejection Promise Reject", { reason });
  // 狀態可能已經不可信，直接退出，交給 process manager 重啟
  process.exit(1);
});

// 同步錯誤沒被 try/catch（致命）
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", err);
  process.exit(1);
});

/**
 * ============================
 * 🧯 Graceful shutdown handlers
 * ============================
 * 正常關機（Docker / K8s / PM2 / Ctrl+C）
 */

async function shutdown(signal: string) {
  logger.warn(`Received ${signal}, starting graceful shutdown...`);

  // 1️⃣ 停止接收新的 HTTP 連線
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info("HTTP server closed.");
        resolve();
      });
    });
  }

  // 結束 process
  logger.info("Shutdown complete, exiting process.");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/**
 * ============================
 * 🚀 Application bootstrap
 * ============================
 */

async function bootstrap() {
  try {
    logger.info("Starting application...");

    // 啟動 HTTP server
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // 啟動階段失敗，屬於致命錯誤
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

// ⭐ 啟動應用
bootstrap();
