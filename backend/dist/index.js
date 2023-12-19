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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./db/connect"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routers_1 = __importDefault(require("./routers"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import bodyParser from "body-parser";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
//middleware
app.use((0, cors_1.default)({ origin: "https://chat-bot-v1-4eip.onrender.com", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
//remove before in production
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1", routers_1.default);
app.get("/", (req, res) => {
    res.send("backend deployment is live");
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server is running on http://localhost:${PORT}`);
        yield (0, connect_1.default)(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.log(error);
    }
}));
