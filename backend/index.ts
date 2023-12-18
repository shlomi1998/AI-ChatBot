import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect";
import cors from "cors";
import morgan from "morgan";
import appRouter from "./routers";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

//middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove before in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
});