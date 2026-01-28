import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import WelcomeScreen from "./screens/WelcomeScreen";
import ConstellationHub from "./screens/ConstellationHub";
import NodeEditor from "./screens/NodeEditor";
import StarMap from "./screens/StarMap";


function App() {
  useEffect(() => {
    const cursor = localStorage.getItem("cursor") || "sword";

    const cursorMap: Record<string, string> = {
      sword: "/cursors/greatsword.png",
      staff: "/cursors/staff.png",
      star: "/cursors/star.png",
    };

    const selected = cursorMap[cursor] || cursorMap.sword;

    document.body.style.cursor = `url(${selected}) 16 16, auto`;
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/hub" element={<ConstellationHub />} />
        <Route path="/editor" element={<NodeEditor />} />
        <Route path="/starmap" element={<StarMap />} />
      </Routes>
    </Router>
  );
}

export default App;
