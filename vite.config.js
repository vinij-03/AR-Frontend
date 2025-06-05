import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "./", // 👈 Ensures assets load correctly on network
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 👈 Enables access via local IP like 10.140.1.29
    port: 5173, // Optional, default is 5173
  },
});
