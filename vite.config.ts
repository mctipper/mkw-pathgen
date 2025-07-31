import { defineConfig } from "vite";

export default defineConfig({
  base: '/mkw-pathgen/',
  server: {
    host: true,
    port: 5173,
    strictPort: true
  }
});