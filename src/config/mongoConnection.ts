import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = "mongodb+srv://admin:admin69@cluster0.tc6pjmp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export const connectMongoDatabase = async() => {
    try{

        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected");

    }catch(error: any){
        console.log(`Error connecting MongoDB : Error => ${error.getMessage()}`)
    }

}

