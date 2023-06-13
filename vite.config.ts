import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { terser } from "rollup-plugin-terser";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: "terser",
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        }),
      ],
    },
  },
});