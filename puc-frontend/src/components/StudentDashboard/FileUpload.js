import React, { useState } from "react";
import { uploadFile } from "../../api"; // correct import path

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await uploadFile(formData);

      setMessage(res.data?.message || "File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
