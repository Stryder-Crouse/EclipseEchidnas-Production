import React, { useEffect, useState } from "react";
import "../css/ImportFile.css";
import fileSizeCalculator from "../components/fileSizeCalculator.tsx";
import ExitButton from "../components/ExitButton.tsx";
import ExportCSVButton from "../components/importCSV/ExportCSV-Button.tsx";

export default function ImportNodeFile() {
  // setting background photo
  useEffect(() => {
    // set background to first floor on component load
    document.body.style.backgroundImage =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);

  //Setting states in able to handle intake of file names (start and selected)
  const [getCSVFile, setCSVFile] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // When clicking save, console saves the file we took in
  // NEEDS TO BE WORKED INTO THE DATABASE
  const handleClick = () => {
    console.log(getCSVFile);
    const file = new File(getCSVFile, "filename.jpeg");
    console.log(file);
  };

  //Event Changer to set the files
  // THIS NEEDS TO BE WORKED INTO DATABASE
  const handleCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCSVFile([file]);
      setSelectedFile(file);
    }
  };

  return (
    <form className="dropzone-box">
      <h2>Import Node .CSV File</h2>
      <p>Attach node files to this window</p>
      <div className="dropzone-area">
        {/* This is an SVG file for the file icon */}
        <div className="file-upload-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          </svg>
        </div>
        <p>Click to upload or drag and drop</p>
        <input
          type="file"
          required
          id="upload-file"
          name="uploaded-file"
          accept={".csv"}
          onChange={handleCSVFile}
        />
        <p className="message">
          {selectedFile
            ? `Selected File: ${selectedFile.name} (${fileSizeCalculator(
                selectedFile.size,
              )})`
            : "No Files Selected"}
        </p>
      </div>
      <div className="dropzone-actions">
        <button type="reset">Cancel</button>
        <button id="submit-button" type="submit" onClick={handleClick}>
          Save
        </button>
        {/* NEED THIS WORKING FOR DATABASE */}
        <ExportCSVButton />
      </div>
      <ExitButton />
    </form>
  );
}
