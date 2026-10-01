import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/weather': {
         target: 'https://weather-project-k72v.onrender.com',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api\/weather/, '')
      },
      '/api/speakbetter': {
         target: 'https://speakbetter-lgfr.onrender.com',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api\/speakbetter/, '')
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
