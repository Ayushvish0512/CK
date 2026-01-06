import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
<<<<<<< HEAD
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
=======
  base: "/",
});
>>>>>>> d0084ce86efeeabad5875a2e4a936ef85130604b
