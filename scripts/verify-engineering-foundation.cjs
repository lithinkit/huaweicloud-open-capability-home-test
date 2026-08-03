const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const packagePath = path.join(repoRoot, "package.json");
const legacySourceDir = path.join(repoRoot, "portal", "src");
const vueDir = path.join(repoRoot, "portal", "vue");
const outputDir = path.join(repoRoot, "portal", "public");

const requiredScripts = ["dev", "build", "preview"];
const removedLegacyPaths = [
  "styles.css",
  "script.js"
];
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
  "docs.html",
  "icons.html",
];

function fail(message) {
  console.error(`Verification failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`cannot read valid JSON from ${path.relative(repoRoot, filePath)} (${error.message})`);
  }
}

function normalize(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function listFiles(dirPath, rootPath = dirPath) {
  if (!fs.existsSync(dirPath)) {
    fail(`${path.relative(repoRoot, dirPath)} does not exist`);
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(absolutePath, rootPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(normalize(path.relative(rootPath, absolutePath)));
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

const packageJson = readJson(packagePath);

for (const scriptName of requiredScripts) {
  if (!packageJson.scripts || typeof packageJson.scripts[scriptName] !== "string" || packageJson.scripts[scriptName].trim() === "") {
    fail(`package.json is missing a usable "${scriptName}" script`);
  }
}

if (!/\bvite\b/.test(packageJson.scripts.dev) || !/vite\.config\.mjs/.test(packageJson.scripts.dev)) {
  fail('package.json "dev" script must run Vite through vite.config.mjs');
}

if (packageJson.scripts.build !== "vite build --config vite.config.mjs") {
  fail('package.json "build" script must run the Vue/Vite build directly');
}

if (!/\bvite preview\b/.test(packageJson.scripts.preview) || !/vite\.config\.mjs/.test(packageJson.scripts.preview)) {
  fail('package.json "preview" script must run Vite preview through vite.config.mjs');
}

if (!packageJson.dependencies?.vue || !packageJson.devDependencies?.vite || !packageJson.devDependencies?.["@vitejs/plugin-vue"]) {
  fail("package.json must declare Vue, Vite, and @vitejs/plugin-vue dependencies");
}

if (fs.existsSync(legacySourceDir)) {
  fail("portal/src should not exist after the Vue-only migration");
}

const requiredVueFiles = [
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
  "docs.html",
  "src/main.js",
  "src/App.vue",
  "src/data/cases.js",
  "src/data/home.js",
  "src/data/docs.js",
  "src/data/roadmaps.js",
  "src/components/SiteHeader.vue",
  "src/components/portal/SubpageHero.vue",
  "src/components/cases/CaseGrid.vue",
  "src/components/cases/CaseDetailCard.vue",
  "src/components/docs/DocSection.vue",
  "src/components/icons/IconLibraryGrid.vue",
  "src/components/roadmap/AgentFriendlyPanel.vue",
  "src/components/roadmap/RoadmapDetail.vue",
  "src/components/roadmap/RoadmapIndex.vue",
  "src/components/roadmap/RoadmapStepList.vue",
  "src/components/pages/ActivityPage.vue",
  "src/components/pages/CaseDetailPage.vue",
  "src/components/pages/CasesPage.vue",
  "src/components/pages/CommunityPage.vue",
  "src/components/pages/HomePage.vue",
  "src/components/pages/RoadmapPage.vue",
  "src/components/pages/IconsPage.vue",
  "src/components/pages/DocsPage.vue",
  "src/components/pages/OpenDataPage.vue",
  "src/components/HomeHero.vue",
  "src/components/CaseStudies.vue",
  "src/components/CapabilityShowcase.vue",
  "src/components/AgentConnect.vue",
  "src/components/CommunityLinks.vue",
  "src/components/portal/SectionBlock.vue",
  "src/components/portal/CopyButton.vue",
  "src/components/portal/PortalLinkButton.vue",
  "src/styles/tokens.css",
  "src/styles/home.css"
];

for (const relativePath of requiredVueFiles) {
  const absolutePath = path.join(vueDir, ...relativePath.split("/"));
  if (!fs.existsSync(absolutePath)) {
    fail(`missing Vue portal source file ${path.relative(repoRoot, absolutePath)}`);
  }
}

const vueShell = fs.readFileSync(path.join(vueDir, "index.html"), "utf8");

if (!vueShell.includes('<div id="app"></div>') || !vueShell.includes('src="/src/main.js"')) {
  fail("portal/vue/index.html must mount the Vue app through /src/main.js");
}

const viteConfig = fs.readFileSync(path.join(repoRoot, "vite.config.mjs"), "utf8");

if (/legacy/i.test(viteConfig) || /portal.*src/s.test(viteConfig)) {
  fail("vite.config.mjs must not include a legacy static fallback");
}

const vueSourceTexts = [
  fs.readFileSync(path.join(vueDir, "src", "data", "home.js"), "utf8"),
  fs.readFileSync(path.join(vueDir, "src", "components", "CaseStudies.vue"), "utf8")
];

for (const text of vueSourceTexts) {
  if (/\b(?:script|styles)\.(?:js|css)\b/.test(text)) {
    fail("Vue source still links to legacy HTML pages");
  }
}

const outputFiles = listFiles(outputDir);
const homeOutputPath = path.join(outputDir, "index.html");

if (!fs.existsSync(homeOutputPath)) {
  fail("portal/public/index.html is missing the Vue homepage output");
}

const homeOutput = fs.readFileSync(homeOutputPath, "utf8");

if (!homeOutput.includes('<div id="app"></div>')) {
  fail("portal/public/index.html does not mount the Vue app");
}

if (!homeOutput.includes("vue-assets")) {
  fail("portal/public/index.html does not reference the Vite vue-assets bundle");
}

if (homeOutput.includes('data-page="home"')) {
  fail("portal/public/index.html still looks like the legacy static homepage");
}

for (const relativePath of routePages) {
  const outputPath = path.join(outputDir, relativePath);
  if (!fs.existsSync(outputPath)) {
    fail(`portal/public is missing migrated Vue route ${relativePath}`);
  }

  const output = fs.readFileSync(outputPath, "utf8");
  if (!output.includes('<div id="app"></div>') || !output.includes("vue-assets")) {
    fail(`portal/public/${relativePath} is not a Vue/Vite page output`);
  }
}

if (!fs.existsSync(path.join(vueDir, "public", "icons", "manifest.v1.json"))) {
  fail("Vue public assets are missing icons/manifest.v1.json");
}

if (!fs.existsSync(path.join(outputDir, "icons", "manifest.v1.json"))) {
  fail("portal/public is missing the icons manifest");
}

for (const relativePath of removedLegacyPaths) {
  if (outputFiles.includes(relativePath)) {
    fail(`portal/public still contains legacy output ${relativePath}`);
  }
}

console.log(`Verified Vue-only portal output with ${outputFiles.length} publishable files.`);
