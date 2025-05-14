import React from "react";

function CodePanel({ code }) {
    const handleDownload = () => {
        if (!code) return;

        const blob = new Blob([code], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "generated-page.html";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow mt-2">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Generated Code</h2>
                    <button
                        onClick={handleDownload}
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                        Download HTML
                    </button>
                </div>
                <pre className="bg-white dark:bg-gray-800 p-2 rounded border text-sm overflow-auto whitespace-pre-wrap text-gray-800 dark:text-gray-100">
                    {code || "Drag and drop elements to see generated HTML here."}
                </pre>
            </div>
        </div>
    );
}

export default CodePanel;
