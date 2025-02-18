import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4100",
      "/uploads": "http://localhost:4100",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { pdfjs: ["pdfjs-dist"], gsap: ["gsap"] },
      },
    },
  },
});
