import mongoose from "mongoose";

export const dbConnection=async()=>{
    await mongoose.connect(process.env.MONGODB_URL,{
        dbName:"Calorie"
    })
    .then((result)=>{
        console.log(`Mongodb connected`);
    })
    .catch((error)=>{
        console.log(`Error in connecting mongodb ${error}`);
    })
}