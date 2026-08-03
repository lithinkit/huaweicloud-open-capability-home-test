import path from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const vueRoot = path.resolve(repoRoot, "portal", "vue");
const routePages = [
  "index",
  "activity",
  "ai-agent-roadmap",
  "ai-agent-worker",
  "case-detail",
  "cases",
  "community",
  "cts-security-alert-agent",
  "dns-cdn-obs-static-site",
  "open-data",
  "oauth2-login-service",
  "icons",
  "docs"
];

export default defineConfig({
  root: vueRoot,
  base: "./",
  plugins: [vue()],
  build: {
    outDir: path.resolve(repoRoot, "portal", "public"),
    emptyOutDir: true,
    assetsDir: "vue-assets",
    rollupOptions: {
      input: Object.fromEntries(
        routePages.map((page) => [
          page,
          path.resolve(vueRoot, page === "index" ? "index.html" : `${page}.html`)
        ])
      )
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5176
  },
  preview: {
    host: "127.0.0.1",
    port: 4176
  }
});
