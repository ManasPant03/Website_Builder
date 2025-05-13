import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { FaLock } from "react-icons/fa";

function Canvas({ onElementsChange }) {
    const [elements, setElements] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const selectedElementId = useRef(null);
    const wasDraggedRef = useRef(false); // 👈 new flag to detect drag

    const updateElements = (updater) => {
        setElements((prev) => {
            const newElements = typeof updater === "function" ? updater(prev) : updater;
            if (onElementsChange) onElementsChange(newElements);
            return newElements;
        });
    };

    const [, drop] = useDrop(() => ({
        accept: "element",
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            const canvas = document.getElementById("canvas-area");
            const canvasRect = canvas.getBoundingClientRect();
            const canvasWidth = canvasRect.width;
            const canvasHeight = canvasRect.height;

            let x = offset.x - canvasRect.left;
            let y = offset.y - canvasRect.top;

            const elementWidth = 100;
            const elementHeight = 50;
            x = Math.max(0, Math.min(x, canvasWidth - elementWidth));
            y = Math.max(0, Math.min(y, canvasHeight - elementHeight));

            updateElements((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    type: item.type,
                    left: x,
                    top: y,
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
        updateElements((prev) =>
            prev.map((el) =>
                el.id === id ? { ...el, locked: !el.locked } : el
            )
        );
        setContextMenu(null);
    };

    const handleDelete = () => {
        const id = selectedElementId.current;
        updateElements((prev) => prev.filter((el) => el.id !== id));
        setContextMenu(null);
    };

    const handleFileUpload = (e, id) => {
        const file = e.target.files[0];
        const fileUrl = file ? URL.createObjectURL(file) : null;
        updateElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, file: fileUrl } : el))
        );
    };

    const handleDragStart = (e, id) => {
        const element = elements.find((el) => el.id === id);
        if (!element || element.locked) return;

        wasDraggedRef.current = false;
        const offsetX = e.clientX - element.left;
        const offsetY = e.clientY - element.top;

        const handleMouseMove = (moveEvent) => {
            wasDraggedRef.current = true;

            const canvas = document.getElementById("canvas-area");
            const canvasRect = canvas.getBoundingClientRect();
            const canvasWidth = canvasRect.width;
            const canvasHeight = canvasRect.height;

            let newLeft = moveEvent.clientX - offsetX;
            let newTop = moveEvent.clientY - offsetY;

            const elementWidth = 100;
            const elementHeight = 50;
            newLeft = Math.max(0, Math.min(newLeft, canvasWidth - elementWidth));
            newTop = Math.max(0, Math.min(newTop, canvasHeight - elementHeight));

            updateElements((prev) =>
                prev.map((el) =>
                    el.id === id ? { ...el, left: newLeft, top: newTop } : el
                )
            );
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleClick = (e) => {
        if (wasDraggedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            wasDraggedRef.current = false;
            return;
        }

        console.log("Click: not dragged");
        // TODO: future logic for selecting an element
    };

    return (
        <div
            ref={drop}
            id="canvas-area"
            className="relative w-full h-full bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] overflow-hidden"
        >
            {elements.map((el) => (
                <div
                    key={el.id}
                    onContextMenu={(e) => handleContextMenu(e, el.id)}
                    onMouseDown={(e) => handleDragStart(e, el.id)}
                    onClick={handleClick}
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
                                <img
                                    src={el.file}
                                    alt="Uploaded"
                                    className="max-w-[200px]"
                                />
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
