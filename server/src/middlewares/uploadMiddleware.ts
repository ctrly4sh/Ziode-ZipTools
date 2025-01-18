import multer, { Multer } from "multer";
import path from "path";
import { Request } from "express";

// Multer storage config: Use memory storage to keep files in memory
const storage = multer.memoryStorage(); 

// File filter: Accept only ZIP files
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const fileType = path.extname(file.originalname).toLowerCase();
  
  // // Allows only zip files
  // if (fileType !== ".zip") {
  //   const error = new Error("Invalid file type. Only ZIP files are allowed.") as any;
  //   return callback(error, false); // Reject the file
  // }

  // Accept the file
  callback(null, true);
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 10 * 1024 * 1024 }, // Uncomment if you want to limit file size
});

export default upload;
