import React, { useEffect, useState } from 'react';
import EditorNavbar from '../components/EditorNavbar';
import Editor from '@monaco-editor/react';
import { MdLightMode } from 'react-icons/md';
import { AiOutlineExpandAlt } from "react-icons/ai";
import { backendUrl } from '../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CodeEditor = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { projectID } = useParams();

  const changeTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  const run = () => {
    const html = htmlCode || "";
    const css = `<style>${cssCode || ""}</style>`;
    const js = `<script>${jsCode || ""}</script>`;
    const iframe = document.getElementById("iframe");
    if (iframe) {
      iframe.srcdoc = html + css + js;
    }
  };

  useEffect(() => {
    run();
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/getProject`,
          {
            userId: localStorage.getItem("userId"),
            projId: projectID,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          const { htmlCode, cssCode, jsCode } = response.data.project;
          setHtmlCode(htmlCode || "<h1>Hello World</h1>");
          setCssCode(cssCode || "body { background-color: #f4f4f4; }");
          setJsCode(jsCode || "");
        } else {
          console.error("Failed to fetch project details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();

        try {
          const response = await axios.post(
            `${backendUrl}/api/user/updateProject`,
            {
              userId: localStorage.getItem("userId"),
              projId: projectID,
              htmlCode,
              cssCode,
              jsCode,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            alert("Project saved successfully");
          } else {
            alert("Something went wrong: " + response.data.message);
          }
        } catch (err) {
          console.error("Error saving project:", err);
          alert("Failed to save project. Please try again.");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <EditorNavbar />
      <div className="flex">
        <div className={`left ${isExpanded ? "w-full" : "w-1/2"}`}>
          <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]">
            <div className="tabs flex items-center gap-2">
              <div onClick={() => setTab("html")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">HTML</div>
              <div onClick={() => setTab("css")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">CSS</div>
              <div onClick={() => setTab("js")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">JavaScript</div>
            </div>
            <div className="flex items-center gap-2">
              <i className="text-[20px] cursor-pointer" onClick={changeTheme}><MdLightMode /></i>
              <i className="text-[20px] cursor-pointer" onClick={() => setIsExpanded((prev) => !prev)}><AiOutlineExpandAlt /></i>
            </div>
          </div>

          {tab === "html" ? (
            <Editor
              onChange={(value) => setHtmlCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="html"
              value={htmlCode}
            />
          ) : tab === "css" ? (
            <Editor
              onChange={(value) => setCssCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="css"
              value={cssCode}
            />
          ) : (
            <Editor
              onChange={(value) => setJsCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="javascript"
              value={jsCode}
            />
          )}
        </div>

        {!isExpanded && (
          <iframe
            id="iframe"
            className="w-1/2 min-h-[82vh] bg-[#fff] text-black"
            title="output"
          />
        )}
      </div>
    </>
  );
};

export default CodeEditor;
