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
  const [canvasKey, setCanvasKey] = useState(0); // for resetting canvas

  const handleClearCanvas = () => {
    setCanvasKey((prev) => prev + 1); // reset Canvas component
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative h-screen overflow-hidden bg-gradient-to-tr from-indigo-100 via-white to-cyan-100 text-gray-800">
        <h1 className="text-3xl font-bold text-center text-indigo-700 py-2">
          No-Code Website Builder
        </h1>

        {/* Transparent Toggle Buttons */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-2 left-2 bg-white/50 hover:bg-white/70 text-gray-700 px-3 py-1 rounded shadow"
        >
          {showSidebar ? "Hide" : "Show"} Sidebar
        </button>
        <button
          onClick={() => setShowCodePanel(!showCodePanel)}
          className="absolute top-2 right-2 bg-white/50 hover:bg-white/70 text-gray-700 px-3 py-1 rounded shadow"
        >
          {showCodePanel ? "Hide" : "Show"} Code
        </button>

        <div className="flex h-[calc(100vh-112px)]">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-1/6 min-w-[200px] border-r bg-white overflow-auto">
              <Sidebar />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-white">
            <Canvas key={canvasKey} />
          </div>

          {/* Code Panel */}
          {showCodePanel && (
            <div className="w-1/4 min-w-[250px] border-l bg-white overflow-auto">
              <CodePanel />
            </div>
          )}
        </div>

        {/* Toolbar */}
        <Toolbar clearCanvas={handleClearCanvas} />
      </div>
    </DndProvider>
  );
}

export default App;
