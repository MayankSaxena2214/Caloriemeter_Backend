import express from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

export const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/logout",isAuthenticated,logout);
