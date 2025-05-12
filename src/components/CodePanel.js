import React from "react";

function CodePanel() {
    return (
        <div className="h-full">
            <div className="bg-gray-100 p-4 rounded shadow mt-2">
                <h2 className="text-lg font-semibold mb-2">Generated Code</h2>
                <pre className="bg-white p-2 rounded border text-sm">
                    {"Generated HTML/CSS will appear here."}
                </pre>
            </div>
        </div>
    );
}

export default CodePanel;
