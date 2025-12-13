import { transports } from "winston";
import { logFormat } from "./formats.js";

export const fileTransport = new transports.File({
  filename: "./logs/app.log.json",
  level: "info",
  format: logFormat,
});
