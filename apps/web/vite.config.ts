import path from "node:path";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { UserConfig } from "vite";

const viteConfig: UserConfig = {
  plugins: [tanstackRouter(), react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4000",
      "/health": "http://localhost:4000",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          )
            return "react";
          if (id.includes("node_modules/@tanstack/react-router"))
            return "router";
          if (id.includes("node_modules/@mui")) return "mui";
          if (
            id.includes("node_modules/formik") ||
            id.includes("node_modules/yup")
          )
            return "forms";
          return undefined;
        },
      },
    },
  },
};

export default viteConfig;
