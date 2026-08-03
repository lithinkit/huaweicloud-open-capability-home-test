const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("all legacy public pages are Vue routes with page components", () => {
  const app = readProjectFile("portal/vue/src/App.vue");
  const viteConfig = readProjectFile("vite.config.mjs");
  const pages = [
    ["activity.html", "ActivityPage"],
    ["cases.html", "CasesPage"],
    ["case-detail.html", "CaseDetailPage"],
    ["community.html", "CommunityPage"],
    ["open-data.html", "OpenDataPage"],
    ["docs.html", "DocsPage"],
    ["icons.html", "IconsPage"],
    ["ai-agent-roadmap.html", "RoadmapPage"],
    ["ai-agent-worker.html", "RoadmapPage"],
    ["cts-security-alert-agent.html", "RoadmapPage"],
    ["dns-cdn-obs-static-site.html", "RoadmapPage"],
    ["oauth2-login-service.html", "RoadmapPage"]
  ];

  for (const [page, component] of pages) {
    assert.equal(fs.existsSync(path.join(repoRoot, "portal", "vue", page)), true, `${page} should exist as a Vue HTML entry`);
    assert.match(viteConfig, new RegExp(page.replace(".html", "")), `${page} should be configured as a Vite input`);
    assert.match(app, new RegExp(`<${component}`), `${component} should be routed by App.vue`);
  }
});

test("legacy case list and detail capabilities are represented as Vue data and components", () => {
  const casesData = readProjectFile("portal/vue/src/data/cases.js");
  const caseGrid = readProjectFile("portal/vue/src/components/cases/CaseGrid.vue");
  const detailCard = readProjectFile("portal/vue/src/components/cases/CaseDetailCard.vue");

  for (const id of ["codearts", "vpc", "email", "skills"]) {
    assert.match(casesData, new RegExp(`id:\\s*"${id}"`), `${id} case should be migrated`);
  }

  for (const field of ["source", "diagram", "steps", "abilities", "outcome"]) {
    assert.match(casesData, new RegExp(`${field}:`), `case data should keep ${field}`);
  }

  assert.match(caseGrid, /case-detail\.html\?case=/);
  assert.match(detailCard, /查看原始案例/);
  assert.match(detailCard, /Agent 任务链路/);
  assert.match(detailCard, /开放能力组合/);
});

test("docs, icons, and roadmap interactive behavior is componentized", () => {
  const docSection = readProjectFile("portal/vue/src/components/docs/DocSection.vue");
  const iconsPage = readProjectFile("portal/vue/src/components/pages/IconsPage.vue");
  const iconGrid = readProjectFile("portal/vue/src/components/icons/IconLibraryGrid.vue");
  const roadmapDetail = readProjectFile("portal/vue/src/components/roadmap/RoadmapDetail.vue");
  const roadmapSteps = readProjectFile("portal/vue/src/components/roadmap/RoadmapStepList.vue");
  const agentPanel = readProjectFile("portal/vue/src/components/roadmap/AgentFriendlyPanel.vue");
  const roadmapsData = readProjectFile("portal/vue/src/data/roadmaps.js");

  assert.match(docSection, /CopyButton/);
  assert.match(iconsPage, /iconsCopyStatus/);
  assert.match(iconGrid, /download/);
  assert.match(iconGrid, /copy/);
  assert.match(roadmapDetail, /activeView/);
  assert.match(roadmapDetail, /drawer-screenshot/);
  assert.match(roadmapSteps, /activeStep/);
  assert.match(agentPanel, /Agent 友好版/);
  assert.match(roadmapsData, /screenshots:/);
});

test("roadmap pages preserve the main-branch knowledge path UX structure", () => {
  const roadmapPage = readProjectFile("portal/vue/src/components/pages/RoadmapPage.vue");
  const roadmapIndex = readProjectFile("portal/vue/src/components/roadmap/RoadmapIndex.vue");
  const roadmapDetail = readProjectFile("portal/vue/src/components/roadmap/RoadmapDetail.vue");
  const roadmapStyles = readProjectFile("portal/vue/src/styles/home.css");

  assert.doesNotMatch(roadmapPage, /SubpageHero/, "roadmap pages should not use the redesigned generic subpage hero");

  for (const className of ["roadmap-section", "roadmap-heading", "roadmap-board", "roadmap-list", "roadmap-item", "roadmap-link"]) {
    assert.match(roadmapIndex, new RegExp(className), `roadmap index should keep .${className}`);
    assert.match(roadmapStyles, new RegExp(`\\.${className}\\b`), `roadmap styles should keep .${className}`);
  }

  for (const className of [
    "plugin-strip",
    "hero-card",
    "tabs",
    "roadmap-area",
    "map-canvas",
    "connector-svg",
    "road-node",
    "s-arch-client",
    "s-websocket",
    "s-hermes-gateway",
    "s-ai-model",
    "scenario-strip",
    "mobile-roadmap",
    "drawer-layer",
    "drawer-architecture",
    "drawer-screenshot",
    "image-preview-layer",
    "agent-document",
    "markdown-body"
  ]) {
    assert.match(roadmapDetail, new RegExp(className), `roadmap detail should keep .${className}`);
    assert.match(roadmapStyles, new RegExp(`\\.${className}\\b`), `roadmap styles should keep .${className}`);
  }

  for (const stateName of ["activeView", "selectedTopic", "selectedImage", "architectureNodes", "architectureTopic"]) {
    assert.match(roadmapDetail, new RegExp(stateName), `roadmap detail should keep ${stateName} interaction state`);
  }

  assert.match(roadmapDetail, /URLSearchParams/, "roadmap detail should keep ?view=agent deep-link behavior");
  assert.match(roadmapDetail, /history\.replaceState/, "roadmap detail should keep tab URL synchronization");
});

test("legacy media assets used by Vue roadmap pages are migrated to Vue public assets", () => {
  const expectedAssets = [
    "portal/vue/public/assets/agent-open-platform-hero.png",
    "portal/vue/public/assets/open-platform-animation-preview.png",
    "portal/vue/public/images/agent-screenshots/1784872881539_image.png",
    "portal/vue/public/images/cts-security-alert/1785162901076_image.png",
    "portal/vue/public/images/obs-web-site/1785484495425_image.png"
  ];

  for (const relativePath of expectedAssets) {
    assert.equal(fs.existsSync(path.join(repoRoot, relativePath)), true, `${relativePath} should be migrated`);
  }
});
