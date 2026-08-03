const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("roadmap data restores the shared capability guide catalog", () => {
  const roadmapsData = readProjectFile("portal/vue/src/data/roadmaps.js");

  assert.match(roadmapsData, /export const capabilityCatalog/, "capability catalog should be shared from roadmap data");

  for (const service of ["IAM", "CTS", "LTS", "SMN", "FunctionGraph", "DNS", "CDN", "OBS", "RDS", "APIG", "ECS", "EIP", "VPC", "Node.js"]) {
    assert.match(roadmapsData, new RegExp(`name:\\s*"${service.replace(".", "\\.")}`), `${service} should have a restored guide entry`);
  }

  for (const resourceType of ["Skills", "CLI", "API", "SDK", "MCP"]) {
    assert.match(roadmapsData, new RegExp(`type:\\s*"${resourceType}"`), `guide resources should include ${resourceType}`);
  }

  for (const skill of [
    "huawei-cloud-iam-query Skill",
    "huawei-cloud-monitoring-query Skill",
    "huawei-cloud-functiongraph-function-create Skill",
    "huawei-cloud-network-query Skill",
    "huawei-cloud-storage-query Skill",
    "huawei-cloud-computing-query Skill",
    "huawei-cloud-eip-cost-optimizer Skill"
  ]) {
    assert.match(roadmapsData, new RegExp(skill), `${skill} should be restored`);
  }
});

test("roadmap side nodes open restored guide copy instead of placeholders", () => {
  const roadmapsData = readProjectFile("portal/vue/src/data/roadmaps.js");
  const roadmapDetail = readProjectFile("portal/vue/src/components/roadmap/RoadmapDetail.vue");

  for (const guideKey of [
    "guide-huawei-account",
    "guide-security-alert-rules",
    "guide-refresh",
    "guide-token"
  ]) {
    assert.match(roadmapsData, new RegExp(`"${guideKey}"`), `${guideKey} should map to a detailed guide`);
  }

  for (const heading of ["你将学会", "免费资源", "知识拓展", "云宝助手"]) {
    assert.match(roadmapDetail, new RegExp(heading), `drawer should render ${heading}`);
  }

  assert.match(roadmapDetail, /selectedTopic\.learn/, "drawer should render guide learning outcomes");
  assert.match(roadmapDetail, /resource\.href/, "drawer resources should be linked");
  assert.match(roadmapDetail, /selectedTopic\.sections/, "drawer should render guide knowledge sections");
  assert.match(roadmapDetail, /mobileSideNodeGroups/, "mobile roadmap should distribute every restored side node");
  assert.doesNotMatch(roadmapDetail, /sideNodes\.slice\(index \* 2/, "mobile roadmap should not hide overflow side nodes");
  assert.doesNotMatch(roadmapDetail, /保留主分支路线图中的能力入口/);
  assert.doesNotMatch(roadmapDetail, /迁移为 Vue 节点抽屉/);
});
