import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  // Generate stars for background
  const numStars = 150;
  const stars = Array.from({ length: numStars }, (_, ) => ({
    top: Math.random() * 100 + "%",
    left: Math.random() * 100 + "%",
    size: Math.random() * 2 + 1,
  }));

  const handleLevelUp = () => {
    navigate("/hub"); // Navigate to Constellation Hub
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: "#02040f",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        flexDirection: "column",
        textAlign: "center",
        color: "white",
      }}
    >
      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
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

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Welcome text */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ fontSize: "3rem", marginBottom: "2rem", textTransform: "uppercase" }}
      >
        Welcome
      </motion.h1>

      {/* Level Up button */}
      <motion.button
        onClick={handleLevelUp}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: "1rem 2rem",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#88c0ff",
          color: "#02040f",
        }}
      >
        LEVEL UP
      </motion.button>
    </motion.div>
  );
}
