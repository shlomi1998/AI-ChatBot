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
exports.userLogout = exports.verifyUser = exports.userLogin = exports.userSignup = exports.getAllUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = require("bcrypt");
const token_manager_1 = require("../utils/token-manager");
const constants_1 = require("../utils/constants");
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(201).json({ message: "OK", users });
    }
    catch (error) {
        res.status(500).json({ message: "ERROR", caches: error });
    }
});
exports.getAllUser = getAllUser;
const userSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
        });
        yield user.save();
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        res.cookie(constants_1.COOKIE_NAME, token, {
            path: "/",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            signed: true,
        });
        res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordCorrect = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Incorrect password" });
        }
        const token = (0, token_manager_1.createToken)(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days
        res.cookie(constants_1.COOKIE_NAME, token, {
            path: "/",
            expires: expires,
            httpOnly: true,
            signed: true,
        });
        res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        res.status(500).json({ message: "ERROR", cause: error.message });
    }
});
exports.userLogin = userLogin;
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user token check
        const user = yield User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
});
exports.verifyUser = verifyUser;
const userLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user token check
        const user = yield User_1.default.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        res.clearCookie(constants_1.COOKIE_NAME, {
            path: "/", //All paths
            httpOnly: true, //Does not give requests from the client
            signed: true, //Checking that the cookies were not damaged
        });
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
});
exports.userLogout = userLogout;
