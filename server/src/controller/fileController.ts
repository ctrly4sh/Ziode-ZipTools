import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as tar from "tar"; // Correct import for tar module
import zlib from "zlib";
import archiver from "archiver";

// Health check route
export const getHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "Server health okay ✅😃",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to remove directory asynchronously
async function removeDirectory(directoryPath: string) {
  try {
    // Ensure directory is empty before removing
    const files = await fs.promises.readdir(directoryPath);
    if (files.length === 0) {
      await fs.promises.rm(directoryPath, { recursive: true, force: true });
      console.log(`Successfully removed: ${directoryPath}`);
    } else {
      console.log(`Directory ${directoryPath} is not empty. Skipping deletion.`);
    }
  } catch (error) {
    console.error(`Error removing directory ${directoryPath}:`, error);
  }
}

export const zipUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if files were uploaded
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ success: false, message: "No file(s) uploaded" });
      return;
    }

    // Get compression type from request body (default to ZIP)
    const compressionType = (req.body.compressionType || "zip").toLowerCase();
    console.log('Compression Type:', compressionType); // For debugging

    // Create a unique session directory
    const sessionID = `session-${Date.now()}`;
    const uploadDir = path.join(__dirname, "uploads", sessionID);
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save uploaded files to the session directory
    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      const filePath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
    }

    // Compress files based on the compression type
    let compressedFilePath: string;
    switch (compressionType) {
      case "zip":
        compressedFilePath = path.join(uploadDir, "compressed_files.zip");
        await createZipArchive(uploadDir, compressedFilePath, files);
        break;

      case "tar":
        compressedFilePath = path.join(uploadDir, "compressed_files.tar");
        await createTarArchive(uploadDir, compressedFilePath, files);
        break;

      case "gzip":
        if (files.length !== 1) {
          throw new Error("GZIP compression supports only one file at a time.");
        }
        compressedFilePath = path.join(uploadDir, "compressed_files.gz");
        await createGzipArchive(uploadDir, compressedFilePath, files[0].originalname);
        break;

      default:
        throw new Error("Unsupported compression type. Supported types: zip, tar, gzip.");
    }

    // Send the compressed file for download
    res.download(compressedFilePath, `compressed_files.${compressionType}`, async (err) => {
      // Clean up the session directory after the file is downloaded
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ success: false, message: "Failed to send the compressed file." });
      } else {
        // Ensure directory is clean before removing
        await removeDirectory(uploadDir);
        await removeDirectory(compressedFilePath);
      }
    });
  } catch (error: any) {
    console.error("Error in zipUpload:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to create a ZIP archive
const createZipArchive = async (directory: string, outputPath: string, files: Express.Multer.File[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 5 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    for (const file of files) {
      const filePath = path.join(directory, file.originalname);
      archive.file(filePath, { name: file.originalname });
    }
    archive.finalize();
  });
};

// Helper function to create a TAR archive
const createTarArchive = async (directory: string, outputPath: string, files: Express.Multer.File[]): Promise<void> => {
  const filePaths = files.map((file) => path.join(directory, file.originalname));

  try {
    await tar.create(
      {
        file: outputPath, // The output path where the TAR file will be saved
        cwd: directory,   // The directory where the files are located
      },
      filePaths // The array of file paths to be included in the TAR
    );
  } catch (error: any) {
    throw new Error(`Error creating TAR archive: ${error.message}`);
  }
};

// Helper function to create a GZIP archive
const createGzipArchive = async (directory: string, outputPath: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const inputFilePath = path.join(directory, fileName);
    const output = fs.createWriteStream(outputPath);
    const gzip = zlib.createGzip();

    output.on("finish", () => resolve());
    output.on("error", (err) => reject(err));

    fs.createReadStream(inputFilePath)
      .pipe(gzip)
      .pipe(output);
  });
};
