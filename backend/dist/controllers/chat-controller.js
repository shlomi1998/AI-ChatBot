"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.sendChatsToUser = exports.generateChatCompletion = void 0;
const User_1 = __importDefault(require("../models/User"));
// import { configureOpenAI } from "../config/openai-config";
const openai_1 = __importDefault(require("openai"));
const generateChatCompletion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }
    try {
        const user = yield User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not found or token malfunctioned" });
        }
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // const config: any = configureOpenAI();
        const openai = new openai_1.default({
            apiKey: process.env.OPEN_AI_SECRET,
        });
        const chatResponse = yield openai.chat.completions
            .create({
            model: "gpt-4",
            messages: chats,
        });
        console.log(chatResponse.choices[0].message);
        user.chats.push(chatResponse.choices[0].message);
        yield user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.error("Error details:", error.message, error.stack);
        if (error.response) {
            console.error("API response error:", error.response.data);
        }
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
exports.generateChatCompletion = generateChatCompletion;
const sendChatsToUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user token check
        const user = yield User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
});
exports.sendChatsToUser = sendChatsToUser;
const deleteChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user token check
        const user = yield User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        yield user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
});
exports.deleteChats = deleteChats;
