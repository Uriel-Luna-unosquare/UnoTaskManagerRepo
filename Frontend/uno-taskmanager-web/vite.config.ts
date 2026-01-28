import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mui/material/utils": "@mui/material/node/utils/index.js",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
  },
  optimizeDeps: {
    include: ["@mui/x-date-pickers", "@mui/material"],
  },
});