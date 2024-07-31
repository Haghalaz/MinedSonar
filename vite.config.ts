import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: [
      { find: "@sounds", replacement: "/src/assets/sounds" },
      { find: "@utils", replacement: "/src/utils" },
      { find: "@store", replacement: "/src/store" },
      { find: "@constants", replacement: "/src/constants" },
      { find: "@atoms", replacement: "/src/components/atoms" },
      { find: "@molecules", replacement: "/src/components/molecules" },
      { find: "@organisms", replacement: "/src/components/organisms" },
    ],
  },
});
