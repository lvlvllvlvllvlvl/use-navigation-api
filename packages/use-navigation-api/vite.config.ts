import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "unplugin-dts/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "useNavigationAPI",
      fileName: (format) => `use-navigation-api.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Add any peer dependencies here
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [react(), dts({ tsconfigPath: "./tsconfig.app.json" })],
});
