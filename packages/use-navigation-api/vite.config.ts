import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "unplugin-dts/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "useNavigationAPI",
      fileName: (format) => `use-navigation-api.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json" }),
    tsconfigPaths(),
  ],
});
