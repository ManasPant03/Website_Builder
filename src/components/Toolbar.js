import React from "react";

function Toolbar({ clearCanvas }) {
    return (
        <div className="mt-2 p-4 flex justify-center space-x-4 bg-white shadow-md">
            <button
                onClick={() => alert("Save Design clicked")}
                className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
                Save Design
            </button>
            <button
                onClick={() => console.log("View Saved Design clicked")}
                className="bg-purple-500 text-white py-2 px-4 rounded-md"
            >
                View Saved Design
            </button>
            <button
                onClick={clearCanvas}
                className="bg-gray-700 text-white py-2 px-4 rounded-md"
            >
                Clear Canvas
            </button>
        </div>
    );
}

export default Toolbar;
