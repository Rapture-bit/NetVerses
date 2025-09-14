import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
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
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
