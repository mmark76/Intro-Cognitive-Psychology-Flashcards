import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const basePath = "/Intro-Cognitive-Psychology-Flashcards/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Cognitive Psychology Study",
        short_name: "CogPsych Study",
        description: "Local-first study app for cognitive psychology chapters and flashcards.",
        theme_color: "#172554",
        background_color: "#f8fafc",
        display: "standalone",
        start_url: basePath,
        scope: basePath,
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
    }),
  ],
});
