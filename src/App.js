import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import Toolbar from "./components/Toolbar";

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [canvasKey, setCanvasKey] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleClearCanvas = () => {
    setCanvasKey((prev) => prev + 1);
    setGeneratedCode("");
  };

  const generateCodeFromElements = (elements) => {
    const scale = 100 / 72;

    const bodyElements = elements.map((el) => {
      const scaledLeft = Math.round(el.left * scale);
      const scaledTop = Math.round(el.top * scale);

      const style = `position: absolute; left: ${scaledLeft}px; top: ${scaledTop}px;`;

      switch (el.type) {
        case "Text":
          return `<p style="${style} font-size: 16px; font-family: sans-serif;">${el.content || "Editable Text"}</p>`;
        case "Image":
          return `<div style="${style} max-width: 200px; border: 1px dashed gray; padding: 10px;">[Image Placeholder]</div>`;
        case "Video":
          return `<div style="${style} max-width: 200px; border: 1px dashed gray; padding: 10px;">[Video Placeholder]</div>`;
        case "Button":
          return `<button style="${style} padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px;">${el.content || "Click Me"}</button>`;
        case "Container":
          return `<div style="${style} background-color: #e5e7eb; padding: 16px;">${el.content || "Container"}</div>`;
        default:
          return "";
      }
    }).join("\n");

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generated Page</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      width: 100vw;
      height: 100vh;
      position: relative;
      background: white;
      overflow: hidden;
    }
  </style>
</head>
<body>
${bodyElements}
</body>
</html>`;

    setGeneratedCode(fullHTML);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${darkMode ? "dark" : ""}`}>
        <div className="relative flex flex-col h-screen w-screen bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] text-gray-800 dark:text-gray-100">
          {/* Header - Top 10% */}
          <div className="h-[10%] flex items-center justify-center px-4 relative z-10">
            <h1 className="text-2xl font-bold text-indigo-700 dark:text-white text-center">
              WebWeaver: A No-Code Website Builder
            </h1>
          </div>

          {/* Canvas Row - Middle 80% */}
          <div className="relative h-[80%] flex justify-center items-center">
            <div className="w-[80%] h-full z-10">
              <Canvas key={canvasKey} onElementsChange={generateCodeFromElements} />
            </div>
          </div>

          {/* Toolbar - Bottom 10% */}
          <div className="h-[10%]">
            <Toolbar
              clearCanvas={handleClearCanvas}
              toggleDarkMode={() => setDarkMode((prev) => !prev)}
              isDarkMode={darkMode}
            />
          </div>

          {/* Sidebar Toggle */}
          {showSidebar ? (
            <button
              onClick={() => setShowSidebar(false)}
              className="fixed top-1/2 left-[250px] transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-l shadow z-30"
            >
              ←
            </button>
          ) : (
            <button
              onClick={() => setShowSidebar(true)}
              className="fixed top-1/2 left-2 transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded shadow z-30"
            >
              → Elements
            </button>
          )}

          {/* Code Panel Toggle */}
          {showCodePanel ? (
            <button
              onClick={() => setShowCodePanel(false)}
              className="fixed top-1/2 right-[300px] transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-r shadow z-30"
            >
              →
            </button>
          ) : (
            <button
              onClick={() => setShowCodePanel(true)}
              className="fixed top-1/2 right-2 transform -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded shadow z-30"
            >
              Code ←
            </button>
          )}

          {/* Sidebar Panel */}
          {showSidebar && (
            <div className="fixed top-0 bottom-0 left-0 w-[250px] bg-white dark:bg-gray-800 z-20 shadow-md border-r-[1.5px] border-gray-400 dark:border-gray-600 shadow-inner overflow-hidden">
              <Sidebar />
            </div>
          )}

          {/* Code Panel */}
          {showCodePanel && (
            <div className="fixed top-0 bottom-0 right-0 w-[300px] bg-white dark:bg-gray-800 z-20 shadow-md border-l-[1.5px] border-gray-400 dark:border-gray-600 shadow-inner overflow-hidden">
              <CodePanel code={generatedCode} />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
