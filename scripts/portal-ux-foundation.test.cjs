const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function cssSelectorPattern(selector) {
  return selector
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
}

function readCssRule(source, selector) {
  const match = source.match(new RegExp(`(?:^|[}\\r\\n])\\s*${cssSelectorPattern(selector)}\\s*\\{([\\s\\S]*?)\\}`, "m"));

  assert.ok(match, `${selector} rule should exist`);

  return match[1];
}

function readCssRules(source, selector) {
  const matches = [...source.matchAll(new RegExp(`(?:^|[}\\r\\n])\\s*${cssSelectorPattern(selector)}\\s*\\{([\\s\\S]*?)\\}`, "gm"))];

  assert.ok(matches.length > 0, `${selector} rule should exist`);

  return matches.map((match) => match[1]);
}

function readLastCssRule(source, selector) {
  const rules = readCssRules(source, selector);

  return rules[rules.length - 1];
}

function readCssRuleAfter(source, selector, anchor) {
  const anchorIndex = source.indexOf(anchor);

  assert.ok(anchorIndex >= 0, `${anchor} anchor should exist`);

  return readCssRule(source.slice(anchorIndex + anchor.length), selector);
}

test("PortalUI color and typography tokens follow the Huawei Cloud UX baseline", () => {
  const tokens = readProjectFile("portal/vue/src/styles/tokens.css");
  const homeStyles = readProjectFile("portal/vue/src/styles/home.css");

  const colorTokens = [
    ["--por-color-background-primary", "#191919"],
    ["--por-color-background-disabled", "rgba(var(--por-base-color-rgb-black), 0.05)"],
    ["--por-color-background-gray-1", "#fafafa"],
    ["--por-color-background-white", "#ffffff"],
    ["--por-color-text-primary", "#191919"],
    ["--por-color-text-secondary", "#595959"],
    ["--por-color-text-button", "#1476ff"],
    ["--por-color-text-weak", "#808080"],
    ["--por-color-text-disabled", "#c2c2c2"],
    ["--por-color-function-error", "#f23030"],
    ["--por-color-function-warning", "#ff8800"],
    ["--por-color-function-success", "#5cb300"],
    ["--por-color-function-info", "#1476ff"]
  ];

  for (const [token, value] of colorTokens) {
    assert.match(tokens, new RegExp(`${token}:\\s*${value.replace(/[()]/g, "\\$&")}`, "i"), `${token} should be ${value}`);
  }

  assert.match(tokens, /--por-base-font-family:\s*[^;]*HuaweiSans[^;]*PingFang SC[^;]*Microsoft YaHei/);
  assert.match(tokens, /--por-base-font-weight-lighter:\s*100/);
  assert.match(tokens, /--por-base-font-weight-normal:\s*400/);
  assert.match(tokens, /--por-base-font-weight-bold:\s*700/);
  assert.match(homeStyles, /font-family:\s*var\(--por-base-font-family\)/);
});

test("page action buttons follow the PortalUI black pill style", () => {
  const tokens = readProjectFile("portal/vue/src/styles/tokens.css");
  const homeStyles = readProjectFile("portal/vue/src/styles/home.css");

  assert.match(tokens, /--por-button-radius:\s*999px/);
  assert.match(tokens, /--por-button-height-default:\s*44px/);
  assert.match(tokens, /--por-button-padding-default:\s*0 28px/);

  const primaryButton = readCssRule(homeStyles, ".primary-btn");
  const secondaryButton = readCssRuleAfter(homeStyles, ".secondary-btn", ".primary-btn:hover");
  const primaryLink = readCssRule(homeStyles, ".primary-link,\n.icons-actions .primary-link");
  const iconsPrimaryLink = readCssRule(homeStyles, ".icons-actions .primary-link");
  const iconActionButton = readCssRule(homeStyles, ".icon-card-button,\n.icon-card-icon-button");
  const copySnippetButton = readCssRule(homeStyles, ".copy-snippet");
  const roadmapDownloadButton = readCssRule(homeStyles, ".strip-download-button");
  const activeCarouselButton = readCssRule(homeStyles, ".dots button.active");

  assert.match(homeStyles, /\.primary-btn,\s*\.secondary-btn\s*\{[\s\S]*?min-height:\s*var\(--por-button-height-default\)/);
  assert.match(homeStyles, /\.primary-btn,\s*\.secondary-btn\s*\{[\s\S]*?padding:\s*var\(--por-button-padding-default\)/);
  assert.match(homeStyles, /\.primary-btn,\s*\.secondary-btn\s*\{[\s\S]*?border-radius:\s*var\(--por-button-radius\)/);

  assert.match(primaryButton, /color:\s*var\(--por-color-text-white\)/);
  assert.match(primaryButton, /background:\s*var\(--por-color-background-primary\)/);
  assert.match(primaryButton, /border:\s*1px solid var\(--por-color-border-primary\)/);

  assert.match(secondaryButton, /color:\s*var\(--por-color-text-primary\)/);
  assert.match(secondaryButton, /background:\s*var\(--por-color-background-white\)/);
  assert.match(secondaryButton, /border:\s*1px solid var\(--por-color-border-primary\)/);

  assert.match(primaryLink, /background:\s*var\(--por-color-background-primary\)/);
  assert.match(primaryLink, /border-color:\s*var\(--por-color-border-primary\)/);
  assert.match(iconsPrimaryLink, /background:\s*var\(--por-color-background-primary\)/);
  assert.match(iconsPrimaryLink, /border-color:\s*var\(--por-color-border-primary\)/);
  assert.match(iconActionButton, /border-radius:\s*var\(--por-button-radius\)/);
  assert.match(copySnippetButton, /border:\s*1px solid var\(--por-color-border-primary\)/);
  assert.match(copySnippetButton, /border-radius:\s*var\(--por-button-radius\)/);
  assert.match(roadmapDownloadButton, /border-radius:\s*var\(--por-button-radius\)/);
  assert.match(activeCarouselButton, /background:\s*var\(--por-color-background-primary\)/);
});

test("homepage text accents avoid Huawei red after the visual refresh", () => {
  const homeStyles = readProjectFile("portal/vue/src/styles/home.css");

  assert.doesNotMatch(homeStyles, /(?:^|[;{\r\n])\s*color:\s*var\(--por-color-brand-red\)/, "brand red should not be used as a font color");
  assert.doesNotMatch(homeStyles, /(?:^|[;{\r\n])\s*color:\s*#c7000b/i, "raw Huawei red should not be used as a font color");
  assert.doesNotMatch(homeStyles, /(?:^|[;{\r\n])\s*color:\s*var\(--huawei-red\)/, "roadmap Huawei red should not be used as a font color");

  const textLink = readLastCssRule(homeStyles, ".text-link");
  assert.match(textLink, /color:\s*var\(--por-color-action-blue\)/, "text links should use the PortalUI action color");

  const activeTabs = readCssRule(homeStyles, ".capability-tabs button.active,\n.capability-tabs button:hover");
  assert.match(activeTabs, /color:\s*var\(--por-color-text-primary\)/, "active tabs should use black text");
  assert.match(activeTabs, /border-color:\s*var\(--por-color-border-primary\)/, "active tabs should use a black underline");
});

test("homepage case cards use the AgentArts whole-card card UX", () => {
  const caseGrid = readProjectFile("portal/vue/src/components/cases/CaseGrid.vue");
  const homeStyles = readProjectFile("portal/vue/src/styles/home.css");

  assert.match(caseGrid, /<a\s[\s\S]*class="case-card por-col-6 por-col-sm-12 por-col-xs-24"/, "case card itself should be the link target");
  assert.match(caseGrid, /:href="`case-detail\.html\?case=\$\{item\.id\}`"/, "case cards should keep detail navigation");
  assert.match(caseGrid, /:data-lucide="item\.icon"/, "case cards should render their leading icon");
  assert.doesNotMatch(caseGrid, /查看详情/, "case cards should not render a separate detail link");
  assert.doesNotMatch(caseGrid, /tag-row/, "case cards should not use chip rows in the listing");

  const caseCard = readCssRule(homeStyles, ".case-card");
  const caseCardIcon = readCssRule(homeStyles, ".case-card-icon");

  assert.match(caseCard, /display:\s*grid/);
  assert.match(caseCard, /align-content:\s*start/);
  assert.match(caseCard, /text-decoration:\s*none/);
  assert.match(caseCardIcon, /width:\s*48px/);
  assert.match(caseCardIcon, /height:\s*48px/);
  assert.match(caseCardIcon, /stroke-width:\s*1\.8/);
});

test("site header remains fixed during vertical page scroll", () => {
  const homeStyles = readProjectFile("portal/vue/src/styles/home.css");
  const siteHeader = readCssRule(homeStyles, ".site-header");
  const main = readCssRule(homeStyles, "main");

  assert.match(homeStyles, /--site-header-height:\s*72px/);
  assert.match(siteHeader, /position:\s*fixed/);
  assert.match(siteHeader, /top:\s*0/);
  assert.match(siteHeader, /right:\s*0/);
  assert.match(siteHeader, /left:\s*0/);
  assert.match(siteHeader, /height:\s*var\(--site-header-height\)/);
  assert.match(main, /padding-top:\s*var\(--site-header-height\)/);
  assert.match(homeStyles, /@media \(max-width: 760px\)[\s\S]*--site-header-height:\s*104px/);
  assert.match(homeStyles, /@media \(max-width: 430px\)[\s\S]*--site-header-height:\s*96px/);
});

test("PortalUI text utility classes expose the documented type scale", () => {
  const tokens = readProjectFile("portal/vue/src/styles/tokens.css");

  const textClasses = [
    ["por-text-title-t1", "60px", "84px"],
    ["por-text-title-t2", "48px", "72px"],
    ["por-text-title-t3", "40px", "60px"],
    ["por-text-body-t1", "18px", "28px"],
    ["por-text-body-t2", "16px", "24px"],
    ["por-text-body-t3", "14px", "22px"]
  ];

  for (const [className, fontSize, lineHeight] of textClasses) {
    const classPattern = new RegExp(`\\.${className}\\s*\\{[\\s\\S]*?font-size:\\s*${fontSize}[\\s\\S]*?line-height:\\s*${lineHeight}`, "m");
    assert.match(tokens, classPattern, `.${className} should expose ${fontSize}/${lineHeight}`);
  }
});

test("PortalUI icon foundation normalizes app icons to por-icon classes", () => {
  const tokens = readProjectFile("portal/vue/src/styles/tokens.css");
  const iconUtils = readProjectFile("portal/vue/src/utils/icons.js");

  assert.match(tokens, /\.por-icon\s*\{/);
  assert.match(tokens, /\.icons-product-md\s*\{/);
  assert.match(iconUtils, /preparePortalIcons/);
  assert.match(iconUtils, /classList\.add\("por-icon"/);
  assert.match(iconUtils, /por-icon-\$\{normalizePortalIconName/);
});

test("PortalUI grid exposes 24-column responsive row and column utilities", () => {
  const tokens = readProjectFile("portal/vue/src/styles/tokens.css");
  const sectionBlock = readProjectFile("portal/vue/src/components/portal/SectionBlock.vue");
  const caseGrid = readProjectFile("portal/vue/src/components/cases/CaseGrid.vue");

  assert.match(tokens, /\.por-row\s*\{/);
  assert.match(tokens, /\.por-col\s*\{/);

  for (const prefix of ["", "lg-", "md-", "sm-", "xs-"]) {
    assert.match(tokens, new RegExp(`\\.por-col-${prefix}1\\s*\\{\\s*--por-col-span`), `por-col-${prefix}1 should exist`);
    assert.match(tokens, new RegExp(`\\.por-col-${prefix}24\\s*\\{\\s*--por-col-span`), `por-col-${prefix}24 should exist`);
  }

  for (const width of ["1600px", "1280px", "1024px", "768px"]) {
    assert.match(tokens, new RegExp(`@media \\(max-width: ${width}\\)`), `grid should include ${width} breakpoint`);
  }

  assert.match(sectionBlock, /class="container por-container"/);
  assert.match(caseGrid, /class="case-grid por-row"/);
});
