import React, { useRef, useEffect, useState } from "react";
import type { SkillNode } from "./types";

interface Props {
  node: SkillNode;
  editMode: boolean;
  skillTreeCompleted: boolean;
  setNodes: React.Dispatch<React.SetStateAction<SkillNode[]>>;
  handleNodeClick: () => void;
  deleteMode: boolean;

  // Branch mode props
  branchMode: boolean;
  startBranch: (parentId: number, x: number, y: number) => void;
  updateBranchLine: (x: number, y: number) => void;
  finishBranch: (childId: number) => void;
}

const Node: React.FC<Props> = ({
  node,
  editMode,
  //skillTreeCompleted,
  setNodes,
  handleNodeClick,
  deleteMode,
  branchMode,
  startBranch,
  updateBranchLine,
  finishBranch,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description ?? "");

  // Sync local state if node updates externally
  useEffect(() => {
    setTitle(node.title);
    setDescription(node.description ?? "");
  }, [node.title, node.description]);

  // Determine color based on status
  const getColor = () => {
    if (node.isRoot || node.status === "completed") return "#8e44ad";
    if (node.status === "unlockable") return "#3498db";
    return "#7f8c8d";
  };

  /* =======================
     Drag & Branch logic
  ======================== */

  const onMouseDown = (e: React.MouseEvent) => {
    if (!editMode || node.isRoot || isEditing) return;
    if (e.button !== 0) return;

    if (branchMode) {
      const rect = nodeRef.current?.getBoundingClientRect();
      if (rect) {
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        startBranch(node.id, x, y);
      }
      return;
    }

    setDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    setDragging(false);
    if (!branchMode) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetNodeDiv = elements.find(
      (el) => el instanceof HTMLDivElement && el.dataset.nodeId
    ) as HTMLDivElement | undefined;

    if (targetNodeDiv) {
      const childId = parseInt(targetNodeDiv.dataset.nodeId!);
      if (childId !== node.id) {
        finishBranch(childId);
      }
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging && !branchMode && editMode && nodeRef.current) {
      const parent = nodeRef.current.offsetParent as HTMLElement;
      if (!parent) return;

      const newX =
        e.clientX - offset.x - parent.getBoundingClientRect().left;
      const newY =
        e.clientY - offset.y - parent.getBoundingClientRect().top;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, x: newX, y: newY } : n
        )
      );
    } else if (branchMode) {
      updateBranchLine(e.clientX, e.clientY);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  /* =======================
     Edit submit
  ======================== */

  const submitEdits = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === node.id
          ? { ...n, title: title || "Unnamed Skill", description }
          : n
      )
    );
    setIsEditing(false);
  };

  /* =======================
     Click handling
  ======================== */

  const handleClick = () => {
    if (!editMode && !node.isRoot) {
      handleNodeClick();
      return;
    }

    if (!editMode || node.isRoot) return;

    if (deleteMode) {
      setNodes((prev) => prev.filter((n) => n.id !== node.id));
      return;
    }

    setIsEditing(true);
  };

  /* =======================
     Render
  ======================== */

  return (
    <div
      ref={nodeRef}
      data-node-id={node.id}
      onMouseDown={onMouseDown}
      onClick={handleClick}
      style={{
        position: "absolute",
        top: node.y,
        left: node.x,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${getColor()} 0%, #000 70%)`,
        cursor:
          editMode && !node.isRoot && !isEditing
            ? branchMode
              ? "crosshair"
              : "grab"
            : "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        userSelect: "none",
        boxShadow: `0 0 18px ${getColor()}`,
        textAlign: "center",
        padding: "6px",
      }}
      title={node.title}
    >
      {isEditing ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            width: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Skill title"
            autoFocus
            style={{
              fontSize: "0.7rem",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "1px solid #aaa",
            }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{
              fontSize: "0.6rem",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "1px solid #aaa",
              resize: "none",
            }}
          />
          <button
            onClick={submitEdits}
            style={{
              fontSize: "0.6rem",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <span
          style={{
            fontSize: "0.8rem",
            pointerEvents: "none",
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.5px",
            textShadow: "1px 1px 2px #000",
            color: "white",
          }}
        >
          {node.title}
        </span>
      )}
    </div>
  );
};

export default Node;
