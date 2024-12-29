import { catchAsyncHandler } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/user.model.js";


export const registerUser=catchAsyncHandler(async(req,res,next)=>{
    let {email,password,name}=req.body;
    if(!email || !password || !name){
        return next(new ErrorHandler("Email, password and name are mandatory",400));
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return next(new ErrorHandler("User already exists , Kindly login",400));
    }
    const user=await User.create({
        email,
        password,
        name
    });
    return res.status(200).json({
        success:true,
        message:"User registered successfully",
        user
    })
});

export const loginUser=catchAsyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new ErrorHandler("Email and password is mandatory",400));
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new ErrorHandler("User with this email does not exist",400));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Password is incorrect",400));
    }
    const token=await user.getAccessToken();
    res.cookie("token",token,{
        maxAge:60*24*60*60*1000,  //60 days
        httpOnly:true
    });
    return res.status(200).json({
        success:true,
        message:"User logged in successfully",
        user,
        token
    })
});

export const logout=catchAsyncHandler(async(req,res,next)=>{
    //clear the cookies
    res.cookie("token","",{
        maxAge:0,  //60 days
        httpOnly:true
    });

    return res.status(200).json({
        success:true,
        message:"User logged successfully"
    })
})