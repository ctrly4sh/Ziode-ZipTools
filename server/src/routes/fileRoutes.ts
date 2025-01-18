import express from "express";
import upload from "../middlewares/uploadMiddleware";
import { zipUpload, getHealth } from "../controller/fileController";

const router = express.Router();

router.get("/health", getHealth);
router.post("/zipUpload" ,upload.array("zips" , 10), zipUpload);
export default router;
