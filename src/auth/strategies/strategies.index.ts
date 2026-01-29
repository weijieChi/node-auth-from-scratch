import passport from "passport";
import { container } from "../../di/container.js";
import { createLocalStrategy } from "./local.strategy.js";

// ✅ 關鍵這一行（一定要），註冊 passport local serializeUser / deserializeUser
import "./passport.session.js";

// local
passport.use("local", createLocalStrategy(container.userRepository));

// 之後你會加：
// import "./jwt.strategy.js"
// import "./oauth.google.strategy.js"
