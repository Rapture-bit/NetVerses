import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    allowedHosts: ["netverses.com", "help.netverses.com"],
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      ignored: ["**/node_modules/**", "**/dist/**"],
      interval: 100,
    },
    compress: true,
    port: 5173,
    strictPort: true,
    https: false,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
