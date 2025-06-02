"use client"; // Required for client-side interactivity
import { useState, ChangeEvent } from "react";
import "./style.css";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Create preview if it's an image
    if (file && file.type.startsWith("images/pic.jpg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Example: Upload to API route
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload File
        </label>
        <hr />
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <hr />

      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Preview</h3>
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 max-h-60 rounded-md"
          />
        </div>
      )}
      <hr />
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm">
            <span className="font-medium">Selected file:</span>{" "}
            {selectedFile.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">File size:</span>{" "}
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm">
            <span className="font-medium">File type:</span> {selectedFile.type}
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="px-4 py-2 bg-blue-600 text-white rounded-md
          hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Upload File
      </button>
    </div>
  );
}
