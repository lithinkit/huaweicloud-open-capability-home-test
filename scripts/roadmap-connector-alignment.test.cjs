const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractRule(source, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  assert.ok(match, `${selector} rule should exist`);
  return match[1];
}

test("roadmap connector overlay keeps SVG coordinates aligned with node positions", () => {
  const roadmapDetail = readProjectFile("portal/vue/src/components/roadmap/RoadmapDetail.vue");
  const roadmapStyles = readProjectFile("portal/vue/src/styles/home.css");
  const connectorSvgRule = extractRule(roadmapStyles, ".connector-svg");

  const viewBoxHeights = [...roadmapDetail.matchAll(/viewBox:\s*"0 0 920 (\d+)"/g)]
    .map((match) => Number(match[1]));

  assert.ok(new Set(viewBoxHeights).size > 1, "roadmap layouts should keep their own coordinate heights");
  assert.match(roadmapDetail, /--roadmap-svg-height/, "map canvas should expose the active layout height to CSS");
  assert.match(connectorSvgRule, /height:\s*var\(--roadmap-svg-height[^)]*\)/, "connector SVG height should follow the active viewBox height");
  assert.doesNotMatch(connectorSvgRule, /height:\s*\d+px/, "connector SVG should not use one fixed height for every roadmap");
});
