import React from "react";
import logo from "../images/logo.png";
import { FiDownload } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";  
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom"; 

const EditiorNavbar = ({ projectName, htmlCode, cssCode, jsCode }) => {
  const navigate = useNavigate(); 

  const handleDownload = async () => {
    try {
      const zip = new JSZip();

      // Adding files to the zip
      zip.file(`${projectName || "index"}.html`, htmlCode || "");
      zip.file("styles.css", cssCode || "");
      zip.file("script.js", jsCode || "");

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Trigger file download
      saveAs(content, `${projectName || "project"}.zip`);
    } catch (error) {
      console.error("Error generating zip file:", error);
      alert("Failed to download project files. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/");  
  };

  return (
    <div className="EditiorNavbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
      {/* Back Button aligned to the left */}
      <i
        onClick={handleBack}
        className="p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px] mr-4"
        title="Back to Home"
      >
        <IoIosArrowBack />
      </i>

      {/* Logo */}
      <div className="logo">
        <img className="w-[150px]  rounded-full border border-gray-300 " src={logo} alt="Logo" />
      </div>

      {/* Download Button */}
      <i
        onClick={handleDownload}
        className="p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]"
        title="Download Project"
      >
        <FiDownload />
      </i>
    </div>
  );
};

export default EditiorNavbar;
