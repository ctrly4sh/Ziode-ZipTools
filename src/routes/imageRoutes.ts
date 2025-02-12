import express, { Router } from "express";
import { getHealth } from "../controller/imageController";

const router: Router = express.Router();

router.get('/health', getHealth);
router.post('/upload' uploadImage)

export default router;