import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ConstellationHub() {
  const navigate = useNavigate();

  const [skillTitle, setSkillTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  // Background stars
  const [stars] = useState(() =>
    Array.from({ length: 120 }, () => ({
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.3,
    }))
  );

  const handleClickText = () => {
    setEditing(true);
    setShowJourney(false);
    setShowNextButton(false);
  };

  const handleSkillSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setEditing(false);

    if (!skillTitle.trim()) {
      setSkillTitle("UNTITLED CONSTELLATION");
    }

    setShowJourney(true);
  };

  useEffect(() => {
    if (showJourney) {
      const timer = setTimeout(() => setShowNextButton(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [showJourney]);

  const goToNodeEditor = () => {
    const key = `constellation_${skillTitle}`;
    const existing = localStorage.getItem(key);

    if (!existing) {
      const defaultNodes = [
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
          x: 260,
          y: 150,
          title: "NEW NODE",
          description: "",
          parentId: 0,
          childrenIds: [],
          status: "unlockable",
          isRoot: false,
          code: "0a",
        },
      ];

      localStorage.setItem(key, JSON.stringify(defaultNodes));
    }

    navigate("/editor", { state: { skillTitle } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#02040f",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Cinzel', serif",
      }}
    >
      {/* Starfield */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: star.opacity,
            animation: "twinkle 3s infinite alternate",
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.4); }
        }
      `}</style>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Title */}
        {editing ? (
          <form onSubmit={handleSkillSubmit}>
            <input
              autoFocus
              value={skillTitle}
              onChange={(e) => setSkillTitle(e.target.value)}
              onBlur={handleSkillSubmit}
              style={{
                fontSize: "2.1rem",
                textAlign: "center",
                color: "#f9fafb",
                backgroundColor: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "8px",
                padding: "0.4rem 0.7rem",
                outline: "none",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontFamily: "'Cinzel', serif",
              }}
            />
          </form>
        ) : (
          <p
            onClick={handleClickText}
            style={{
              fontSize: "2.3rem",
              color: "#e5e7eb",
              cursor: "pointer",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              maxWidth: "600px",
              textShadow:
                "0 0 14px rgba(180,142,173,0.6), 0 0 30px rgba(180,142,173,0.25)",
            }}
          >
            {skillTitle || "CLICK TO NAME YOUR PATH"}
          </p>
        )}

        {/* Journey indicator */}
        <AnimatePresence>
          {showJourney && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "1.4rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Empty bar */}
              <div
                style={{
                  width: "280px",
                  height: "10px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              />

              {/* Zero indicator */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.6],
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{
                  marginTop: "0.6rem",
                  fontSize: "1.4rem",
                  color: "#c4b5fd",
                  letterSpacing: "0.2em",
                  textShadow: "0 0 14px rgba(196,181,253,0.8)",
                }}
              >
                0
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter constellation */}
        <AnimatePresence>
          {showNextButton && (
            <>
              <motion.div
                onClick={goToNodeEditor}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.15, 1],
                }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  marginTop: "2.2rem",
                  cursor: "pointer",
                  background:
                    "radial-gradient(circle, rgba(216,180,254,1) 0%, rgba(139,92,246,0.85) 42%, rgba(0,0,0,0) 72%)",
                  boxShadow:
                    "0 0 32px rgba(196,181,253,0.9), inset 0 0 20px rgba(255,255,255,0.2)",
                }}
              />
              <p
                style={{
                  marginTop: "0.8rem",
                  color: "#c4b5fd",
                  fontSize: "0.75rem",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
              >
                Enter Constellation
              </p>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
