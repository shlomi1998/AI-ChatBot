"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_routes_1 = require("./user-routes");
var chat_routes_1 = require("./chat-routes");
var appRouter = (0, express_1.Router)();
appRouter.use("/user", user_routes_1.default); //domain/api/v1/user
appRouter.use("/chat", chat_routes_1.default); //domain/api/v1/chats
exports.default = appRouter;
