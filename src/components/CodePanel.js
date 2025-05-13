import React from "react";

function CodePanel({ code }) {
    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code)
            .then(() => {
                alert("Copied to clipboard!");
            })
            .catch((err) => {
                console.error("Copy failed:", err);
            });
    };

    return (
        <div className="h-full">
            <div className="bg-gray-100 p-4 rounded shadow mt-2">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Generated Code</h2>
                    <button
                        onClick={handleCopy}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        Copy
                    </button>
                </div>
                <pre className="bg-white p-2 rounded border text-sm overflow-auto whitespace-pre-wrap">
                    {code || "Drag and drop elements to see generated HTML here."}
                </pre>
            </div>
        </div>
    );
}

export default CodePanel;
