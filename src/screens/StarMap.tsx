import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, } from "framer-motion";
import type { SkillNode } from "./NodeEditor/types";

type Constellation = {
  title: string;
  nodes: SkillNode[];
};

export default function StarMap() {
  const navigate = useNavigate();
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  // const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCursor, _setSelectedCursor] = useState<string>("default");
  const [stars] = useState(() =>
    Array.from({ length: 100 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }))
  );

  // Load constellations from localStorage
  const loadConstellations = () => {
    const allKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("constellation_")
    );

    const loaded: Constellation[] = allKeys.map((key) => {
      const nodes: SkillNode[] =
        JSON.parse(localStorage.getItem(key) || "[]") || [];
      const title = key.replace("constellation_", "");
      return { title, nodes };
    });

    setConstellations(loaded);
  };

  useEffect(() => {
    loadConstellations();

    const handleFocus = () => loadConstellations();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const saveConstellations = (updated: Constellation[]) => {
    setConstellations(updated);
    updated.forEach((c) =>
      localStorage.setItem(`constellation_${c.title}`, JSON.stringify(c.nodes))
    );
  };

  const goToNewConstellation = () => {
    navigate("/hub");
  };

  const openConstellation = (c: Constellation) => {
    if (deleteMode) {
      const updated = constellations.filter((con) => con.title !== c.title);
      saveConstellations(updated);
      localStorage.removeItem(`constellation_${c.title}`);
      return;
    }
    navigate("/editor", { state: { skillTitle: c.title, nodes: c.nodes } });
  };

  const calculateProgress = (nodes: SkillNode[]) => {
    const nonRoot = nodes.filter((n) => !n.isRoot);
    if (!nonRoot.length) return 0;
    const completed = nonRoot.filter((n) => n.status === "completed").length;
    return Math.floor((completed / nonRoot.length) * 100);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflowX: "auto",
        padding: "2rem",
        backgroundColor: "#02040f",
        position: "relative",
        fontFamily: "'Cinzel', serif",
        cursor: selectedCursor === "default" ? "default" : "none",
      }}
    >
      {/* Starry background */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: star.opacity,
            animation: "twinkle 2s infinite alternate",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Delete mode toggle */}
      <button
        onClick={() => setDeleteMode(!deleteMode)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "0.5rem 1rem",
          zIndex: 1000,
          backgroundColor: deleteMode ? "#ff5555" : "#444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {deleteMode ? "Exit Delete Mode" : "Delete Constellation"}
      </button>

      {/* Settings Button replaced with Coming Soon */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#111",
          border: "2px solid #f5f3ce",
          color: "#f5f3ce",
          fontSize: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "default",
          zIndex: 1000,
        }}
      >
        Coming Soon...
      </div>

      {/* Constellation cards */}
      {constellations.map((c) => {
        const progress = calculateProgress(c.nodes);
        return (
          <motion.div
            key={c.title}
            onClick={() => openConstellation(c)}
            style={{
              width: "220px",
              minWidth: "220px",
              marginRight: "1rem",
              padding: "1rem",
              backgroundColor: "#111",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 style={{ color: "#f5f3ce", marginBottom: "0.25rem" }}>
              {c.title}
            </h3>

            <svg
              width="180"
              height="120"
              viewBox="0 0 200 100"
              style={{ backgroundColor: "#02040f" }}
            >
              {c.nodes.map((n) =>
                n.parentId !== null ? (
                  <line
                    key={`line-${n.id}`}
                    x1={(c.nodes.find((p) => p.id === n.parentId)?.x ?? 0)}
                    y1={(c.nodes.find((p) => p.id === n.parentId)?.y ?? 0)}
                    x2={n.x}
                    y2={n.y}
                    stroke="#8e44ad"
                    strokeWidth={2}
                  />
                ) : null
              )}
              {c.nodes.map((n) => (
                <circle
                  key={`node-${n.id}`}
                  cx={n.x * 0.3}
                  cy={n.y * 0.3}
                  r={5}
                  fill="#f5f3ce"
                />
              ))}
            </svg>

            {/* Mini progress bar */}
            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                marginTop: "0.5rem",
                backgroundColor: "#00000055",
                border: "1px solid #f5f3ce",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #f5f3ce, #e0c36e)",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>

            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.85rem",
                color: "#b48ead",
              }}
            >
              LEVEL {progress}
            </p>
          </motion.div>
        );
      })}

      {/* Add new constellation */}
      <div
        style={{
          width: "220px",
          minWidth: "220px",
          padding: "1rem",
          backgroundColor: "#111",
          borderRadius: "12px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => goToNewConstellation()}
      >
        <h3 style={{ color: "#f5f3ce", fontSize: "2rem" }}>+</h3>
        <p style={{ color: "#b48ead" }}>New Constellation</p>
      </div>

      {/* Custom cursor overlay (still inactive) */}
      {selectedCursor !== "default" && (
        <img
          // src={`/cursors/${selectedCursor}.png`}
          // alt="cursor"
          // style={{
          //   position: "fixed",
          //   left: mousePos.x,
          //   top: mousePos.y,
          //   width: "32px",
          //   height: "32px",
          //   pointerEvents: "none",
          //   transform: "translate(-50%, -50%)",
          //   zIndex: 2000,
          // }}
        />
      )}
    </div>
  );
}
