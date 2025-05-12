import React, { useState } from "react";
import { useDrag } from "react-dnd";

const ElementButton = ({ type }) => {
    const [, drag] = useDrag(() => ({
        type: "element",
        item: { type },
    }));

    return (
        <div ref={drag} className="cursor-move bg-indigo-200 p-2 rounded mb-2 text-center">
            {type}
        </div>
    );
};

function Sidebar() {
    const [visible, setVisible] = useState(true);

    return (
        <div className="h-full">
            {visible && (
                <div className="space-y-2 mt-2">
                    {["Text", "Image", "Button", "Video", "Container"].map((type) => (
                        <ElementButton key={type} type={type} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Sidebar;
