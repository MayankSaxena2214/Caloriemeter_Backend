import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createFoodEntry, deleteFoodEntry, getMyFood } from "../controllers/foodEntry.controller.js";

export const foodEntryRouter=express.Router();

foodEntryRouter.post("/create",isAuthenticated,createFoodEntry);
foodEntryRouter.delete("/delete/:foodEntryId",isAuthenticated,deleteFoodEntry)
foodEntryRouter.get("/my-food",isAuthenticated,getMyFood);
