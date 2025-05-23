import React from "react";

function Toolbar({ clearCanvas, toggleDarkMode, isDarkMode }) {
    return (
        <div className="h-full flex items-center justify-center space-x-6 px-6 bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm">
            <button
                onClick={() => alert("Save Design clicked")}
                className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md"
            >
                Save Design
            </button>
            <button
                onClick={() => console.log("View Saved Design clicked")}
                className="bg-purple-500 text-white py-2 px-4 rounded-md shadow-md"
            >
                View Saved Design
            </button>
            <button
                onClick={toggleDarkMode}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md"
            >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
                onClick={clearCanvas}
                className="bg-gray-700 text-white py-2 px-4 rounded-md shadow-md"
            >
                Clear Canvas
            </button>
        </div>
    );
}

export default Toolbar;
