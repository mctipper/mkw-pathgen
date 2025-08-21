import { defineConfig } from "vite";
import { version } from "./package.json";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  base: '/mkw-pathgen/',
  server: {
    host: true,
    port: 5173,
    strictPort: true
  }
});