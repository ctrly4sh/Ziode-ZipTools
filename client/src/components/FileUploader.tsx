import React, { useCallback, useState } from "react";
import { Info, Upload } from "lucide-react";
import axios from "axios";

interface FileUploaderProps {
  onFilesSelected: (files: FileList, compressionType: string) => void;
}

export function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionType, setCompressionType] = useState("zip"); // Default compression type
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // To display selected files

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const { files } = e.dataTransfer;
      if (files && files.length > 0) {
        handleFileSelection(files);
      }
    },
    [compressionType]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        handleFileSelection(files);
      }
    },
    [compressionType]
  );

  const handleFileSelection = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds the 50MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFilesSelected(files, compressionType); // Notify parent
      uploadFiles(validFiles); // Trigger upload
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setError(null); // Clear any previous error

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("zips", file); // Match backend's field name
      });
      formData.append("compressionType", compressionType);

      const response = await axios.post(
        "http://localhost:8900/api/zipUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Receive ZIP file as a blob
        }
      );

      // Trigger download
      const downloadUrl = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = compressionType === "zip" ? "compressed_files.zip" : "compressed_files.tar";
      a.click();
      window.URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during upload.";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompressionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompressionType(e.target.value); // Update the selected compression type
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed
        ${isDragging ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-gray-700 bg-gray-800/50"}
        transition-colors backdrop-blur-sm
        hover:border-fuchsia-500/50`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex z-5 flex-col items-center text-center p-6">
        <Upload className="w-12 h-12 text-fuchsia-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Drag and drop files here</h3>
        <p className="text-gray-400 mb-4">or click to select files (max 50MB)</p>

        <div className="mt-4 relative">
          <div className="flex items-center mb-2">
            <Info className="w-6 h-6 text-fuchsia-500 mr-2" />
            <span className="text-gray-300 font-bold text-xl">
              Default type is ZIP. Change if needed.
            </span>
          </div>
          <label htmlFor="compression" className="text-gray-300 block">
            Select Compression Type:
          </label>
        </div>
        <div className="z-50 text-white px-2 py-1 border border-1 border-fuchsia-500 rounded w-24 mx-auto">
            <select
              id="compression"
              value={compressionType}
              onChange={handleCompressionChange}
              className="bg-gray-600"
            >
              <option value="zip">ZIP</option>
              <option value="tar">TAR</option>
              <option value="gzip">GZIP</option>
            </select>
          </div>

        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Select files to upload"
        />
        {isUploading && <p className="text-blue-500">Uploading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-gray-300 mb-2">Selected Files:</h4>
            {selectedFiles.map((file) => (
              <p key={file.name} className="text-gray-300">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
