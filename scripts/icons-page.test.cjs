const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const portalSrc = path.join(repoRoot, "portal", "src");
const vueIconsPage = path.join(repoRoot, "portal", "vue", "src", "components", "pages", "IconsPage.vue");
const vueIconsGrid = path.join(repoRoot, "portal", "vue", "src", "components", "icons", "IconLibraryGrid.vue");
const vueIconsManifest = path.join(repoRoot, "portal", "vue", "public", "icons", "manifest.v1.json");
const vueHomeCss = path.join(repoRoot, "portal", "vue", "src", "styles", "home.css");
const codeArtsLogo = path.join(repoRoot, "portal", "vue", "public", "icons", "assets", "logo", "codeartsdoer.svg");
const officialCategories = new Set([
  "人工智能",
  "计算",
  "存储",
  "网络",
  "安全",
  "容器与中间件",
  "数据库",
  "大数据",
  "CDN与边缘计算",
  "媒体服务",
  "开发工具",
  "企业应用",
  "运维管理与迁移",
  "华为混合云",
]);

test("icons library is migrated into the Vue portal", () => {
  assert.equal(fs.existsSync(portalSrc), false, "portal/src should not remain after the Vue-only migration");
  assert.equal(fs.existsSync(vueIconsPage), true, "Vue icons page component should exist");
  assert.equal(fs.existsSync(vueIconsGrid), true, "Vue icons grid component should exist");
  assert.equal(fs.existsSync(vueIconsManifest), true, "icons manifest should be available to Vite public assets");

  const pageSource = fs.readFileSync(vueIconsPage, "utf8");
  const gridSource = fs.readFileSync(vueIconsGrid, "utf8");
  const manifest = JSON.parse(fs.readFileSync(vueIconsManifest, "utf8"));

  assert.match(pageSource, /iconSearch/);
  assert.match(pageSource, /IconLibraryGrid/);
  assert.match(pageSource, /iconsCopyStatus/);
  assert.match(pageSource, /manifest\.v1\.json/);
  assert.doesNotMatch(pageSource, /id="iconsSummary"/, "icons page should not render the hero summary stat block");
  assert.doesNotMatch(pageSource, /subpage-stat-grid/, "icons page should not render top summary statistic cards");
  assert.match(gridSource, /iconsGrid/);
  assert.match(gridSource, /download/);
  assert.match(gridSource, /copy/);
  assert.ok(Array.isArray(manifest.icons), "icons manifest should expose an icons array");
  assert.ok(manifest.icons.length > 100, "icons manifest should include the service logo catalog");
});

test("icons manifest assigns every product to a Huawei Cloud product category", () => {
  const manifest = JSON.parse(fs.readFileSync(vueIconsManifest, "utf8"));
  const uncategorized = manifest.icons.filter((entry) => !String(entry.category || "").trim());
  const unknownCategories = manifest.icons.filter((entry) => !officialCategories.has(entry.category));
  const missingCategoryTags = manifest.icons.filter((entry) => !entry.tags?.includes(entry.category));

  assert.deepEqual(
    uncategorized.map((entry) => entry.id),
    [],
    "all icons should have a category instead of falling into 未分类"
  );
  assert.deepEqual(
    unknownCategories.map((entry) => `${entry.id}:${entry.category}`),
    [],
    "icon categories should match the product categories from huaweicloud.com/product"
  );
  assert.deepEqual(
    missingCategoryTags.map((entry) => entry.id),
    [],
    "icon tags should include the resolved product category"
  );
});

test("CodeArts code-agent logo is cropped to the visible mark", () => {
  const manifest = JSON.parse(fs.readFileSync(vueIconsManifest, "utf8"));
  const entry = manifest.icons.find((icon) => icon.id === "codeartsdoer");
  const homeCss = fs.readFileSync(vueHomeCss, "utf8");
  const logoSource = fs.readFileSync(codeArtsLogo, "utf8");

  assert.equal(entry.name, "华为云码道（CodeArts）代码智能体");
  assert.equal(entry.logo.local_path, "icons/assets/logo/codeartsdoer.svg");
  assert.match(homeCss, /\.icon-logo-box img\s*\{[\s\S]*\n\s{2}width:\s*42px;[\s\S]*\n\s{2}height:\s*42px;/);
  assert.match(logoSource, /viewBox="4 4 16 16"/);
  assert.doesNotMatch(logoSource, /viewBox="0 0 24 24"/);
});
