import React from "react";
import type { SkillNode } from "./types";

interface Props {
  addSkill: () => void;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  skillTreeCompleted: boolean;
  startEditTree: () => void;

  // NEW
  branchMode: boolean;
  setBranchMode: React.Dispatch<React.SetStateAction<boolean>>;
  submitTree: () => void;

  nodes: SkillNode[];
}

const Toolbar: React.FC<Props> = ({
  addSkill,
  deleteMode,
  setDeleteMode,
  editMode,
  setEditMode,
  skillTreeCompleted,
  startEditTree,
  branchMode,
  setBranchMode,
  submitTree,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        display: "flex",
        gap: "10px",
        zIndex: 10,
      }}
    >
      {/* EDIT MODE CONTROLS */}
      {editMode && !skillTreeCompleted && (
        <>
          {/* Add Skill */}
          <button
            onClick={addSkill}
            style={buttonStyle("#2ecc71")}
          >
            Add Skill
          </button>

          {/* Add Branch */}
          <button
            onClick={() => setBranchMode(!branchMode)}
            style={buttonStyle(branchMode ? "#8e44ad" : "#34495e")}
          >
            {branchMode ? "Branching…" : "Add Branch"}
          </button>

          {/* Delete Mode */}
          <button
            onClick={() => setDeleteMode(!deleteMode)}
            style={buttonStyle(deleteMode ? "#e74c3c" : "#7f8c8d")}
          >
            {deleteMode ? "Deleting…" : "Delete"}
          </button>

          {/* Submit Tree */}
          <button
            onClick={submitTree}
            style={buttonStyle("#f1c40f", "#000")}
          >
            Submit Tree
          </button>
        </>
      )}

      {/* COMPLETE MODE */}
      {!editMode && skillTreeCompleted && (
        <button
          onClick={startEditTree}
          style={buttonStyle("#9b59b6")}
        >
          Edit Tree
        </button>
      )}

      {/* ENTER EDIT MODE */}
      {!editMode && !skillTreeCompleted && (
        <button
          onClick={() => setEditMode(true)}
          style={buttonStyle("#3498db")}
        >
          Edit Mode
        </button>
      )}
    </div>
  );
};

const buttonStyle = (
  bg: string,
  color: string = "white"
): React.CSSProperties => ({
  padding: "0.45rem 0.9rem",
  backgroundColor: bg,
  color,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: "0.75rem",
});

export default Toolbar;
