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

  const handleClearCanvas = () => {
    setCanvasKey((prev) => prev + 1);
    setGeneratedCode("");
  };

  const generateCodeFromElements = (elements) => {
    const bodyElements = elements.map((el) => {
      const style = `position: absolute; left: ${el.left}px; top: ${el.top}px;`;
      switch (el.type) {
        case "Text":
          return `<p style="${style}">${el.content || "Editable Text"}</p>`;
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Generated Page</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: white;
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
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 text-gray-800">
        <h1 className="text-3xl font-bold text-center text-indigo-700 py-2 z-10 relative">
          No-Code Website Builder
        </h1>

        {/* Toggle Buttons */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-2 left-2 bg-white/70 hover:bg-white text-gray-800 px-3 py-1 rounded shadow z-20"
        >
          {showSidebar ? "Hide" : "Show"} Sidebar
        </button>
        <button
          onClick={() => setShowCodePanel(!showCodePanel)}
          className="absolute top-2 right-2 bg-white/70 hover:bg-white text-gray-800 px-3 py-1 rounded shadow z-20"
        >
          {showCodePanel ? "Hide" : "Show"} Code
        </button>

        {/* Fullscreen Canvas */}
        <div className="absolute top-[60px] bottom-[80px] left-0 right-0 z-0">
          <Canvas key={canvasKey} onElementsChange={generateCodeFromElements} />
        </div>

        {/* Sidebar Overlay */}
        {showSidebar && (
          <div className="absolute top-[60px] bottom-[80px] left-0 w-[250px] bg-white border-r z-20 overflow-auto shadow-md">
            <Sidebar />
          </div>
        )}

        {/* Code Panel Overlay */}
        {showCodePanel && (
          <div className="absolute top-[60px] bottom-[80px] right-0 w-[300px] bg-white border-l z-20 overflow-auto shadow-md">
            <CodePanel code={generatedCode} />
          </div>
        )}

        {/* Toolbar Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white">
          <Toolbar clearCanvas={handleClearCanvas} />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
