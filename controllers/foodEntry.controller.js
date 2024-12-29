import axios from "axios";
import { catchAsyncHandler } from "../middlewares/catchAsyncErrors.js";
import { FoodEntry } from "../models/foodEntry.model.js";
import { ErrorHandler } from "../middlewares/error.js";
import mongoose from "mongoose";

export const createFoodEntry = catchAsyncHandler(async (req, res, next) => {
    let { foodItem, mealType, date } = req.body; // Allow passing a specific date if needed
    const userId = req.user.id;

    console.log(mealType)
    if (!foodItem || !mealType) {
        return res.status(400).json({
            success: false,
            message: "Food item and meal type are required",
        });
    }
    if(!["Breakfast","Dinner","Lunch","Other"].includes(mealType)){
        return next(new ErrorHandler(`Mealtype can be ["Breakfast","Dinner","Lunch","Other"]`,400));
    }
    const foodEntryData = {
        foodItem,
        mealType,
        userId,
        date: date || new Date(), // Use current date if not provided
    };

    // Fetching calories from Nutritionix API (Uncomment this in production)
    // const { data } = await axios.post(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
    //     query: foodItem,
    // }, {
    //     headers: {
    //         "x-app-id": process.env.NUTRITIONIX_APP_ID,
    //         "x-app-key": process.env.NUTRITIONIX_APP_KEY,
    //     },
    // });
    // foodEntryData.calories = data.foods[0]?.nf_calories || 0;

    // Generating random calorie data (Temporary)
    const randomCalories = Math.floor(Math.random() * 100);
    foodEntryData.calories = randomCalories;

    // Save the food entry
    const foodEntry = await FoodEntry.create(foodEntryData);

    return res.status(201).json({
        success: true,
        message: "Item added successfully",
        foodEntry,
    });
});

export const deleteFoodEntry=catchAsyncHandler(async(req,res,next)=>{
    const {foodEntryId}=req.params;
    console.log(foodEntryId)
    if(!foodEntryId){
        return next(new ErrorHandler("Id not found",404));
    }
    const foodEntry=await FoodEntry.findOne({
        _id:new mongoose.Types.ObjectId(foodEntryId),
        userId:new mongoose.Types.ObjectId(req.user.id)
    })
    if(!foodEntry){
        return next(new ErrorHandler("Food entry with this id not found",404));
    }
    await foodEntry.deleteOne();
    return res.status(200).json({
        success:true,
        message:"Food entry deleted successfyll"
    })
});
export const getMyFood = catchAsyncHandler(async (req, res, next) => {
    let { search, date } = req.query;

    const filter = { userId: new mongoose.Types.ObjectId(req.user.id) };

    if (search) {
        filter.$or = [
            { foodItem: { $regex: search, $options: "i" } },
            { mealType: { $regex: search, $options: "i" } },
        ];
    }

    if (date) {
        const parsedDate = new Date(date);
        filter.date = {
            $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
            $lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
        };
    }

    const result = await FoodEntry.aggregate([
        {
            $facet: {
                totalFoodEntry: [
                    { $match: filter },
                    { $count: "count" },
                ],
                foods: [
                    { $match: filter },
                ],
            },
        },
    ]);

    const data = result[0] || {};
    const totalFoodEntry = data.totalFoodEntry?.[0]?.count || 0;
    const foods = data.foods || [];

    return res.status(200).json({
        success: true,
        totalFoodEntry,
        foods,
    });
});
