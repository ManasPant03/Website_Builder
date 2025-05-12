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
                onClick={() => alert("Load Design clicked")}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
                Load Design
            </button>
            <button
                onClick={() => alert("Delete Design clicked")}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md"
            >
                Delete Design
            </button>
            <button
                onClick={() => alert("Delete Saved Design clicked")}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
                Delete Saved Design
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
