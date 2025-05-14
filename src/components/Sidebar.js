import React, { useState } from "react";
import { useDrag } from "react-dnd";

const ElementButton = ({ type }) => {
    const [, drag] = useDrag(() => ({
        type: "element",
        item: { type },
    }));

    return (
        <div
            ref={drag}
            className="cursor-move bg-indigo-200 dark:bg-indigo-600 p-2 rounded mb-2 text-center text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500"
        >
            {type}
        </div>
    );
};

function Sidebar() {
    const [visible] = useState(true);

    return (
        <div className="h-full p-2">
            {/* Heading */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow mt-2">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Drag-n-Drop</h2>
            </div>

            {/* Element Buttons */}
            {visible && (
                <div className="space-y-2 mt-4">
                    {"Text Image Button Video Container".split(" ").map((type) => (
                        <ElementButton key={type} type={type} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Sidebar;
