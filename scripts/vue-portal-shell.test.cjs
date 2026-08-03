const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const portalSrc = path.join(repoRoot, "portal", "src");
const portalPublic = path.join(repoRoot, "portal", "public");
const routePages = [
  "index.html",
  "activity.html",
  "ai-agent-roadmap.html",
  "ai-agent-worker.html",
  "case-detail.html",
  "cases.html",
  "community.html",
  "cts-security-alert-agent.html",
  "dns-cdn-obs-static-site.html",
  "open-data.html",
  "oauth2-login-service.html",
  "icons.html",
  "docs.html"
];

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("package scripts run the Vue and Vite portal workflow", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));

  assert.match(packageJson.scripts.dev, /\bvite\b/);
  assert.match(packageJson.scripts.dev, /vite\.config\.mjs/);
  assert.equal(packageJson.scripts.build, "vite build --config vite.config.mjs");
  assert.match(packageJson.scripts.preview, /\bvite preview\b/);
  assert.match(packageJson.scripts.preview, /vite\.config\.mjs/);
  assert.match(packageJson.engines.node, />=18/);

  assert.ok(packageJson.dependencies?.vue, "Vue should be a runtime dependency");
  assert.ok(packageJson.devDependencies?.vite, "Vite should be a development dependency");
  assert.ok(packageJson.devDependencies?.["@vitejs/plugin-vue"], "Vue SFC support should be configured");
});

test("Vue is the only portal source tree", () => {
  assert.equal(fs.existsSync(portalSrc), false, "legacy portal/src should be removed");

  for (const page of routePages) {
    const shell = readProjectFile(`portal/vue/${page}`);
    assert.match(shell, /<div id="app"><\/div>/, `${page} should mount the Vue app`);
    assert.match(shell, /src="\/src\/main\.js"/, `${page} should use the Vue entry`);
  }

  const viteConfig = readProjectFile("vite.config.mjs");
  const app = readProjectFile("portal/vue/src/App.vue");
  const homePage = readProjectFile("portal/vue/src/components/pages/HomePage.vue");
  const homeData = readProjectFile("portal/vue/src/data/home.js");
  const caseGrid = readProjectFile("portal/vue/src/components/cases/CaseGrid.vue");

  assert.match(viteConfig, /portal/);
  assert.match(viteConfig, /vue/);
  assert.doesNotMatch(viteConfig, /legacy/i);
  assert.doesNotMatch(viteConfig, /portal.*src/s);
  assert.match(viteConfig, /vue-assets/);
  assert.match(viteConfig, /ai-agent-roadmap/);
  assert.match(viteConfig, /icons/);
  assert.match(viteConfig, /docs/);
  assert.match(viteConfig, /case-detail/);
  assert.match(viteConfig, /activity/);
  assert.match(viteConfig, /community/);
  assert.match(app, /<SiteHeader/);
  assert.match(app, /<HomePage/);
  assert.match(app, /<RoadmapPage/);
  assert.match(app, /<IconsPage/);
  assert.match(app, /<DocsPage/);
  assert.match(app, /<CasesPage/);
  assert.match(app, /<CaseDetailPage/);
  assert.match(app, /<ActivityPage/);
  assert.match(app, /<CommunityPage/);
  assert.match(app, /<OpenDataPage/);
  assert.match(homePage, /<HomeHero/);
  assert.match(homePage, /<CapabilityShowcase/);
  assert.match(homeData, /ai-agent-roadmap\.html/);
  assert.match(homeData, /icons\.html/);
  assert.match(homeData, /docs\.html/);
  assert.match(homeData, /cases\.html/);
  assert.match(caseGrid, /case-detail\.html\?case=/);
});

test("Vue-only build output exposes the migrated pages without legacy scripts", () => {
  const indexHtml = readProjectFile("portal/public/index.html");

  assert.match(indexHtml, /<div id="app"><\/div>/);
  assert.match(indexHtml, /vue-assets/);
  assert.doesNotMatch(indexHtml, /data-page="home"/);

  for (const page of routePages) {
    const html = readProjectFile(`portal/public/${page}`);
    assert.match(html, /<div id="app"><\/div>/, `${page} should be emitted by Vite`);
    assert.match(html, /vue-assets/, `${page} should reference the Vite bundle`);
  }

  for (const relativePath of ["styles.css", "script.js"]) {
    assert.equal(fs.existsSync(path.join(portalPublic, relativePath)), false, `${relativePath} should not be published from legacy source`);
  }

  assert.equal(fs.existsSync(path.join(portalPublic, "icons", "manifest.v1.json")), true, "icons manifest should be published as Vue public data");
  assert.equal(fs.existsSync(path.join(portalPublic, "server.cjs")), false, "development server should not be published");
  assert.equal(fs.existsSync(path.join(portalPublic, "generate-homepage-scroll-gif.ps1")), false, "development helper scripts should not be published");
});
