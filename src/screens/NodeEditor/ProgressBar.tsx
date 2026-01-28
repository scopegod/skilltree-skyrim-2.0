import { useMemo, useState, useEffect } from "react";
import type { SkillNode } from "./types";

type Props = {
  nodes: SkillNode[];
};

export default function ProgressBar({ nodes }: Props) {
  const [showCompletionText, setShowCompletionText] = useState(false);

  // Compute progress dynamically
  const { progressPercent, level, allCompleted } = useMemo(() => {
    const nonRootNodes = nodes.filter((n) => !n.isRoot);
    const total = nonRootNodes.length;
    const completed = nonRootNodes.filter((n) => n.status === "completed").length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    const lvl = total > 0 ? Math.floor((completed / total) * 100) : 0;
    const allDone = total > 0 && completed === total;
    return { completedCount: completed, totalCount: total, progressPercent: percent, level: lvl, allCompleted: allDone };
  }, [nodes]);

  // Show celebration if all non-root nodes are completed
  useEffect(() => {
    if (allCompleted) {
      setShowCompletionText(true);
      const timer = setTimeout(() => setShowCompletionText(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [allCompleted]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "350px",
          textAlign: "center",
          color: "#f5f3ce",
          zIndex: 1000,
          pointerEvents: "none",
          fontFamily: "'Cinzel', serif",
        }}
      >
        {/* Level or Mastery Display */}
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: 400,
            textShadow: "0 0 4px #f5f3ce",
            color: allCompleted ? "#ff8c00" : "#f5f3ce",
            animation: allCompleted ? "flashMastery 1s infinite alternate" : "none",
          }}
        >
          {allCompleted ? "SKILL MASTERY" : `LEVEL ${level}`}
        </div>

        {/* XP / Progress Bar */}
        <div
          style={{
            marginTop: "6px",
            height: "16px",
            width: "100%",
            border: "2px solid #f5f3ce",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#00000088",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #f5f3ce, #e0c36e)",
              boxShadow: "0 0 8px #f5f3ce, 0 0 16px #e0c36e",
              transition: "width 0.3s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Completion Celebration */}
      {showCompletionText && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 999,
            pointerEvents: "none",
            color: "#ffd700",
            fontSize: "6rem",
            fontWeight: "bold",
            fontFamily: "'Cinzel Decorative', serif",
            textShadow: "0 0 20px #ffd700, 0 0 40px #ffb800",
            animation: "completionFade 3s forwards",
          }}
        >
          SKILL TREE COMPLETED
        </div>
      )}

      <style>{`
        @keyframes completionFade {
          0% { opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1.2); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }

        @keyframes flashMastery {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
