import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import { userRouter } from "./routes/user.routes.js";
import { foodEntryRouter } from "./routes/foodEntry.router.js";

dotenv.config({
    path:"./config/.env"
});

const app=express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

dbConnection();
//routes set up
app.use("/api/v1/user",userRouter);
app.use("/api/v1/food",foodEntryRouter);

const port=process.env.PORT || 4040;

app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`App is listening on the port ${port}`);
});

