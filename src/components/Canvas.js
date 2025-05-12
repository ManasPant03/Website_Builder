import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { FaLock } from "react-icons/fa";

function Canvas() {
    const [elements, setElements] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const selectedElementId = useRef(null);

    const [, drop] = useDrop(() => ({
        accept: "element",
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            const canvas = document.getElementById("canvas-area");
            const canvasRect = canvas.getBoundingClientRect();

            const x = offset.x - canvasRect.left;
            const y = offset.y - canvasRect.top;

            setElements((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: item.type,
                    left: x - 50,
                    top: y - 25,
                    locked: false,
                    content: "",
                    file: null,
                },
            ]);
        },
    }));

    const handleDrag = (e, id) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        const elementIndex = elements.findIndex(el => el.id === id);
        if (elements[elementIndex].locked) return;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            setElements((prev) =>
                prev.map((el) =>
                    el.id === id
                        ? { ...el, left: el.left + dx, top: el.top + dy }
                        : el
                )
            );

            document.removeEventListener("mousemove", handleMouseMove);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenu({
            id,
            x: e.clientX,
            y: e.clientY,
        });
        selectedElementId.current = id;
    };

    const handleLock = () => {
        const id = selectedElementId.current;
        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, locked: true } : el))
        );
        setContextMenu(null);
    };

    const handleDelete = () => {
        const id = selectedElementId.current;
        setElements((prev) => prev.filter((el) => el.id !== id));
        setContextMenu(null);
    };

    const handleFileUpload = (e, id) => {
        const file = e.target.files[0];
        const fileUrl = file ? URL.createObjectURL(file) : null;
        setElements((prev) =>
            prev.map((el) =>
                el.id === id ? { ...el, file: fileUrl } : el
            )
        );
    };

    return (
        <div
            ref={drop}
            id="canvas-area"
            className="relative w-full h-full border border-gray-400 bg-gray-50 overflow-hidden"
        >
            {elements.map((el) => (
                <div
                    key={el.id}
                    onMouseDown={(e) => handleDrag(e, el.id)}
                    onContextMenu={(e) => handleContextMenu(e, el.id)}
                    style={{ left: el.left, top: el.top }}
                    className="absolute border p-2 bg-gray-100 cursor-move"
                >
                    {el.type === "Text" && (
                        <p
                            contentEditable={!el.locked}
                            suppressContentEditableWarning
                            className="outline-none"
                        >
                            {el.content || "Editable Text"}
                        </p>
                    )}
                    {el.type === "Image" && (
                        <>
                            {el.file ? (
                                <img src={el.file} alt="Uploaded" className="max-w-[200px]" />
                            ) : (
                                !el.locked && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, el.id)}
                                    />
                                )
                            )}
                        </>
                    )}
                    {el.type === "Video" && (
                        <>
                            {el.file ? (
                                <video controls className="max-w-[200px]">
                                    <source src={el.file} />
                                </video>
                            ) : (
                                !el.locked && (
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileUpload(e, el.id)}
                                    />
                                )
                            )}
                        </>
                    )}
                    {el.type === "Button" && (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            {el.content || "Click Me"}
                        </button>
                    )}
                    {el.type === "Container" && (
                        <div className="bg-gray-200 p-4">
                            {el.content || "Container"}
                        </div>
                    )}
                    {el.locked && (
                        <div className="absolute bottom-0 right-0 p-1 text-gray-500">
                            <FaLock size={12} />
                        </div>
                    )}
                </div>
            ))}

            {contextMenu && (
                <ul
                    className="absolute bg-white border rounded shadow-md text-sm z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLock}
                    >
                        Lock
                    </li>
                    <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleDelete}
                    >
                        Delete
                    </li>
                </ul>
            )}
        </div>
    );
}

export default Canvas;
