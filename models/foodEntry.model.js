import mongoose from "mongoose";

const foodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodItem: { type: String, required: true },
    calories: { type: Number, required: true },
    date: { 
        type: Date, 
        required: true,
        default:Date.now,
     },
     mealType:{
        type:String,
        enum:["Breakfast","Dinner","Lunch","Other"],
        required:true,
     }
  },
  { timestamps: true }
);

export const FoodEntry = mongoose.model("FoodEntry", foodEntrySchema);
