import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import "../css/ImportFile.css";

/**
 * formatBytes()
 * @param bytes
 *  - amount of space the file has
 * @param decimals
 *  - we keep the space limited to 2 decimals
 */
function formatBytes(bytes: number, decimals = 2): string {
  // Base case when the size is 0
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  //Array of possible sizes (should be to bytes, kb, mb, worst case gb)
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Calculate appropriate size unit index based on the file size
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate formatted size with the specified number of decimals
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

let loadedLocations = false;

export default function ImportNodeFile() {
  // setting background photo
  useEffect(() => {
    // set background to first floor on component load
    document.body.style.backgroundImage =
      "url(/src/images/backgroundHospitalImage.jpg)";
  }, []);


    useEffect(() => {
        //make sure it only runs once (useEffect is called twice in development)
        if (!loadedLocations) {
            loadedLocations = true;
        }
    }, []);

    const navigate = useNavigate();


    //Setting states in able to handle intake of file names (start and selected)
  const [getCVSFile, setCSVFile] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // When clicking save, console saves the file we took in
  // THIS NEEDS TO BE WORKED INTO THE DATABASE
  const handleClick = () => {
    console.log(getCVSFile);
    const file = new File(getCVSFile, "filename.jpeg");
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
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
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
                      ? `Selected File: ${selectedFile.name} (${formatBytes(
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
              <button className={"export"}>Export Current</button>
          </div>
          <button
              className={"xout"}
              onClick={() => {
                  //make sure locations can be loaded again once we comeback
                  loadedLocations = false; //CHANGE TO USESTATE effect (should reset on page load)
                  navigate("/");
              }}
          >
              X
          </button>
      </form>
  );
}
