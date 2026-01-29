import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        default: fileURLToPath(new URL("default.html", import.meta.url)),
        scoped: fileURLToPath(new URL("scoped.html", import.meta.url)),
        memory: fileURLToPath(new URL("memory.html", import.meta.url)),
        nested: fileURLToPath(new URL("nested.html", import.meta.url)),
        peers: fileURLToPath(new URL("peers.html", import.meta.url)),
      },
    },
  },
});
