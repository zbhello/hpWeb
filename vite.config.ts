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
  server: {
    port: 5173,
    proxy: {
      "/equip": {
        target: "http://124.220.63.221:8080",
        changeOrigin: true,
      },
    },
  },
});
