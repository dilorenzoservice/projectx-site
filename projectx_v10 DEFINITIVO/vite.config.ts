import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    // Aumenta il limite di warning per chunk grandi
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor React — cambia raramente, cachato a lungo
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Supabase — libreria grande, separata
          "vendor-supabase": ["@supabase/supabase-js"],
          // UI Radix — solo i componenti effettivamente usati
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-tooltip",
          ],
          // Admin — caricato solo da /admin, non dal pubblico
          "admin": [
            "./src/pages/admin/AdminDashboard",
            "./src/pages/admin/AdminMessaggi",
            "./src/pages/admin/AdminPrezzi",
            "./src/pages/admin/AdminGalleria",
            "./src/pages/admin/AdminContenuti",
            "./src/pages/admin/AdminImpostazioni",
          ],
        },
      },
    },
  },
}));
