import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "@radix-ui/react-avatar"],
          utils: ["jwt-decode", "clsx", "tailwind-merge"],
          sui: ["@mysten/sui/client", "@mysten/sui/keypairs/ed25519"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: "0.0.0.0",
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      "@mysten/sui/client",
      "@mysten/sui/keypairs/ed25519",
      "@mysten/sui/transactions",
      "@mysten/sui/utils",
    ],
    esbuildOptions: {
      target: "es2020",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
});
