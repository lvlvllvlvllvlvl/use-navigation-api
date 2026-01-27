import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
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
});
