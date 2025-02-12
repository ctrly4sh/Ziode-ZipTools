import {Request, Response} from "express"
import multer from "multer";
import AWS from "aws-sdk";
import {v4 as uuid} from "uuid";
import imageModel from "../models/imageModel";
import dotenv from "dotenv";

export const getHealth = (req: Request, res: Response): any => {
    return res.status(201).json({
        success: true,
        message: "Server Health okay ✅"
    });
};

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

const s3 = new AWS.S3({
    accessKeyId:accessKeyId,
    secretAccessKey:secretAccessKey,
    region:region
})

export const imageUpload = async(req: Request, res: Response) => {
    
}

