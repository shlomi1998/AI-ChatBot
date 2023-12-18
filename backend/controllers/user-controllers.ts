import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../utils/constants";

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.status(201).json({ message: "OK", users });
  } catch (error) {
    res.status(500).json({ message: "ERROR", caches: error });
  }
};
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    //create token and store in cookie

    res.clearCookie(COOKIE_NAME, {
      path: "/", //All paths
      httpOnly: true, //Does not give requests from the client
      signed: true, //Checking that the cookies were not damaged
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      signed: true,
    });
    res.status(201).json({ message: "OK", name: user.name ,email: user.email });
  } catch (error: any) {
    res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    //create token and store in cookie

    res.clearCookie(COOKIE_NAME, {
      path: "/", //All paths
      httpOnly: true, //Does not give requests from the client
      signed: true, //Checking that the cookies were not damaged
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      expires: expires,
      httpOnly: true,
      signed: true,
    });

    res.status(200).json({ message: "OK", name: user.name ,email: user.email});
  } catch (error: any) {
    res.status(500).json({ message: "ERROR", cause: error.message });
  }
};


export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error:any) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    
    res.clearCookie(COOKIE_NAME, {
      path: "/", //All paths
      httpOnly: true, //Does not give requests from the client
      signed: true, //Checking that the cookies were not damaged
    });
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error:any) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
