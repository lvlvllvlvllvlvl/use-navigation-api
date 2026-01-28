import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        default: fileURLToPath(new URL("default.html", import.meta.url)),
        scoped: fileURLToPath(new URL("scoped.html", import.meta.url)),
      },
    },
  },
});
