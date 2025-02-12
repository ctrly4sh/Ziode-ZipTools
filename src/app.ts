import express, { Application } from "express";
import { connectMongoDatabase } from "./config/mongoConnection";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import imageRoutes from "./routes/imageRoutes"
app.use('/api', imageRoutes)

const PORT = process.env.PORT || 3000;

connectMongoDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at localhost:${PORT}`);
  });
}).catch((error: any) => {
    console.error(`MongoDB error resulted in server connection: ${error.getMessage()}`); 
});
 