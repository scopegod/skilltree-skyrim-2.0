import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import type { SkillNode, NodeStatus } from "./types";
import Node from "./Node";
import Toolbar from "./Toolbar";
import ProgressBar from "./ProgressBar";


export default function NodeEditor() {
  const location = useLocation();
  const { skillTitle } = location.state || { skillTitle: "NEW SKILL" };

const savedNodes = JSON.parse(
  localStorage.getItem(`constellation_${skillTitle}`) || "null"
);

const [nodes, setNodes] = useState<SkillNode[]>(savedNodes ?? [
  {
    id: 0,
    x: 100,
    y: 150,
    title: skillTitle.toUpperCase(),
    description: "",
    parentId: null,
    childrenIds: [1],
    status: "completed",
    isRoot: true,
    code: "0",
  },
  {
    id: 1,
    x: 250,
    y: 150,
    title: "NEW SKILL",
    description: "",
    parentId: 0,
    childrenIds: [],
    status: "unlockable",
    isRoot: false,
    code: "0a",
  }, 
]);
const isNewConstellation = !savedNodes;
/* =======================
   PERSIST NODE STATE
======================= */
useEffect(() => {
  // Save nodes to localStorage keyed by skillTitle
  localStorage.setItem(`constellation_${skillTitle}`, JSON.stringify(nodes));
}, [nodes, skillTitle]);



  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(isNewConstellation);
  const [branchMode, setBranchMode] = useState(false);
/* =======================
   HUB BUTTON
======================= */
const navigate = useNavigate();

  const [branchStart, setBranchStart] = useState<{
    x: number;
    y: number;
    parentId: number;
  } | null>(null);

  const [branchEnd, setBranchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  const [stars] = useState(
    Array.from({ length: 100 }, () => ({
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1,
    }))
  );
  

  /* =======================
     NODE OPERATIONS
  ======================== */

  const generateNodeCode = (parentId: number | null) => {
    if (parentId === null) {
      const rootSiblings = nodes.filter(
        (n) => n.parentId === null && !n.isRoot
      );
      return `${rootSiblings.length + 1}`;
    } else {
      const siblings = nodes.filter((n) => n.parentId === parentId);
      return `${
        nodes.find((n) => n.id === parentId)?.code || ""
      }${String.fromCharCode(97 + siblings.length)}`;
    }
  };

  const addSkill = () => {
    const lastId = nodes.length ? Math.max(...nodes.map((n) => n.id)) : 0;
    const lastNode = nodes[nodes.length - 1];

    const newNode: SkillNode = {
      id: lastId + 1,
      x: lastNode.x + 150,
      y: lastNode.y,
      title: "NEW SKILL",
      description: "",
      parentId: null,
      childrenIds: [],
      status: "locked",
      isRoot: false,
      code: generateNodeCode(null),
    };

    setNodes([...nodes, newNode]);
  };

  const deleteSkill = (id: number) => {
    const node = nodes.find((n) => n.id === id);
    if (!node || node.isRoot) return;

    setNodes((prev) =>
      prev
        .filter((n) => n.id !== id)
        .map((n) =>
          n.parentId === id
            ? { ...n, parentId: null, code: generateNodeCode(null) }
            : n
        )
    );
  };

  const startBranch = (parentId: number, x: number, y: number) => {
    setBranchStart({ parentId, x, y });
    setBranchEnd({ x, y });
  };

  const updateBranchLine = (x: number, y: number) => {
    if (!branchStart) return;
    setBranchEnd({ x, y });
  };

const finishBranch = (childId: number) => {
  if (!branchStart) return;

  setNodes((prev) =>
    prev.map((n) => {
      // Update the child node's parentId and code
      if (n.id === childId) {
        return {
          ...n,
          parentId: branchStart.parentId,
          code: generateNodeCode(branchStart.parentId),
        };
      }

      // Ensure parent node's childrenIds includes this child
      if (n.id === branchStart.parentId) {
        return {
          ...n,
          childrenIds: Array.from(new Set([...n.childrenIds, childId])),
        };
      }

      return n;
    })
  );

  setBranchStart(null);
  setBranchEnd(null);
};

/* =======================
   PROGRESSIVE UNLOCK
======================= */
const handleNodeClick = (node: SkillNode) => {
  if (deleteMode) {
    deleteSkill(node.id);
    return;
  }

  // Only allow unlocking if node is unlockable or root
  if (!editMode && (node.status === "unlockable" || node.isRoot)) {
    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.id === node.id
          ? { ...n, status: "completed" as NodeStatus } // mark clicked node completed
          : n
      );

      // Recursive unlock function
      const unlockChildren = (parentId: number) => {
        updated.forEach((n) => {
          if (n.parentId === parentId && n.status === "locked") {
            n.status = "unlockable" as NodeStatus;
          }
        });
      };

      unlockChildren(node.id);

      return [...updated];
    });
  }
};


// =========="submittree"

const submitTree = () => {
  setNodes((prev) => {
    // Step 1: lock everything except root
    const updated = prev.map((n) =>
      n.isRoot
        ? { ...n, status: "completed" as NodeStatus }
        : { ...n, status: "locked" as NodeStatus }
    );

    // Step 2: unlock children of COMPLETED nodes
    const unlockChildren = (parentNode: SkillNode) => {
      parentNode.childrenIds.forEach((childId) => {
        const child = updated.find((n) => n.id === childId);
        if (child && child.status === "locked") {
          child.status = "unlockable" as NodeStatus;
        }
      });
    };

    updated.forEach((node) => {
      if (node.status === "completed") {
        unlockChildren(node);
      }
    });

    return [...updated];
  });

  setEditMode(false);
  setBranchMode(false);
  setDeleteMode(false);
};

const startEditTree = () => {
  setEditMode(true);
  setBranchMode(false);
  setDeleteMode(false);
};


  /* =======================
     RENDER
  ======================== */

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#02040f",
        overflow: "auto",
        position: "relative",
        cursor: deleteMode ? "crosshair" : "default",
      }}
    >
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size + "px",
            height: star.size + "px",
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: 0.8,
            animation: "twinkle 2s infinite alternate",
          }}
        />
        
      ))}
      {/* =======================
    HUB BUTTON
======================= */}
<div
  onClick={() => navigate("/starmap")}


  style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: "50%",
    border: "2px solid #f5f3ce",
    transition: "transform 0.2s, background-color 0.2s",
  }}
  title="Back to Constellation Hub"
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f5f3ce"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <circle cx="6" cy="6" r="1.5" />
    <circle cx="18" cy="6" r="1.5" />
    <circle cx="6" cy="18" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
    <line x1="12" y1="12" x2="6" y2="6" />
    <line x1="12" y1="12" x2="18" y2="6" />
    <line x1="12" y1="12" x2="6" y2="18" />
    <line x1="12" y1="12" x2="18" y2="18" />
  </svg>
</div>

<ProgressBar nodes={nodes} />

      <Toolbar
        addSkill={addSkill}
        deleteMode={deleteMode}
        setDeleteMode={setDeleteMode}
        editMode={editMode}
        setEditMode={setEditMode}
        skillTreeCompleted={!editMode}
        startEditTree={startEditTree}
        branchMode={branchMode}
        setBranchMode={setBranchMode}
        submitTree={submitTree}
        nodes={nodes}
      />

      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {nodes.map((node) => {
          if (node.parentId === null) return null;
          const parent = nodes.find((n) => n.id === node.parentId);
          if (!parent) return null;

          return (
            <line
              key={`${node.id}-${parent.id}`}
              x1={parent.x + 30}
              y1={parent.y + 30}
              x2={node.x + 30}
              y2={node.y + 30}
              stroke="#8e44ad"
              strokeWidth={2}
            />
          );
        })}

        {branchStart && branchEnd && (
          <line
            x1={branchStart.x}
            y1={branchStart.y}
            x2={branchEnd.x}
            y2={branchEnd.y}
            stroke="#7f8c8d"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          editMode={editMode}
          skillTreeCompleted={!editMode}
          deleteMode={deleteMode}
          setNodes={setNodes}
          handleNodeClick={() => handleNodeClick(node)}
          branchMode={branchMode}
          startBranch={startBranch}
          updateBranchLine={updateBranchLine}
          finishBranch={finishBranch}
        />
      ))}
     
    </div>
  );
}
