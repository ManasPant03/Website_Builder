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

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        const canvas = document.getElementById("canvas-area");
        const canvasRect = canvas.getBoundingClientRect();
        setContextMenu({
            id,
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        });
        selectedElementId.current = id;
    };


    const handleLockUnlock = () => {
        const id = selectedElementId.current;
        setElements((prev) =>
            prev.map((el) =>
                el.id === id
                    ? { ...el, locked: !el.locked }
                    : el
            )
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
            prev.map((el) => (el.id === id ? { ...el, file: fileUrl } : el))
        );
    };

    // Add drag functionality for rearranging
    const handleDragStart = (e, id) => {
        const element = elements.find((el) => el.id === id);
        if (!element.locked) {
            const { clientX: startX, clientY: startY } = e;
            const offsetX = e.clientX - element.left;
            const offsetY = e.clientY - element.top;

            const handleMouseMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                setElements((prev) =>
                    prev.map((el) =>
                        el.id === id
                            ? { ...el, left: moveEvent.clientX - offsetX, top: moveEvent.clientY - offsetY }
                            : el
                    )
                );
            };

            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
    };

    return (
        <div
            ref={drop}
            id="canvas-area"
            className="relative w-full h-full bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] overflow-hidden"
        >
            {/* Draggable Elements */}
            {elements.map((el) => (
                <div
                    key={el.id}
                    onContextMenu={(e) => handleContextMenu(e, el.id)}
                    onMouseDown={(e) => handleDragStart(e, el.id)}
                    style={{ left: el.left, top: el.top }}
                    className="absolute border p-2 bg-gray-100 cursor-move hover:ring-2 hover:ring-indigo-400 transition-all"
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

            {/* Right-click Context Menu */}
            {contextMenu && (
                <ul
                    className="absolute bg-white border rounded shadow-md text-sm z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLockUnlock}
                    >
                        {elements.find((el) => el.id === selectedElementId.current)?.locked
                            ? "Unlock"
                            : "Lock"}
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
