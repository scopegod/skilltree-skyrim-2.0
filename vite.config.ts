import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/skilltree-skyrim-2.0/", // <- Add this
});
