<script setup>
import { computed, ref } from "vue";

import { roadmapGuideTopics } from "../../data/roadmaps";
import { isExternalUrl } from "../../utils/icons";

const pluginMarketUrl = "https://marketplace.visualstudio.com/search?term=Huawei%20Cloud&target=VSCode&category=All%20categories&sortBy=Relevance";

const props = defineProps({
  roadmap: {
    type: Object,
    required: true
  }
});

const activeView = ref(getInitialView());
const selectedTopic = ref(null);
const selectedImage = ref(null);

const roadmapLayouts = {
  "agent-worker": {
    backHref: "ai-agent-roadmap.html",
    areaLabel: "基于华为云部署专属 Agent 路线图",
    viewBox: "0 0 920 772",
    connectors: [
      "M459 74 L459 568",
      "M564 74 L632 74 L632 54 L700 54",
      "M564 74 L632 74 L632 101 L700 101",
      "M564 210 L632 210 L632 164 L700 164",
      "M564 210 L632 210 L632 211 L700 211",
      "M564 210 L632 210 L632 258 L700 258",
      "M564 210 L632 210 L632 305 L700 305",
      "M354 350 L292 350 L292 350 L236 350"
    ],
    architectureShellClass: "roadmap-arch-shell",
    architectureFlow: [
      { text: "用户 / 飞书", className: "arch-box" },
      { text: "WebSocket", className: "arch-arrow" },
      { text: "Hermes Gateway", className: "arch-box" },
      { text: "AI 模型", className: "arch-box" }
    ],
    architectureNodes: [
      { key: "architecture-client", className: "s-arch-client", label: "飞书客户端", detail: "群聊 / 私聊", summary: "用户在飞书群聊或私聊里触发 Agent 对话。" },
      { key: "architecture-websocket", className: "s-websocket", label: "WebSocket", detail: "长连接，无需公网", arrow: "◄────►", summary: "Hermes Gateway 通过 WebSocket 与飞书保持消息通道。" },
      { key: "architecture-hermes-gateway", className: "s-hermes-gateway", label: "Hermes Gateway", detail: "消息收发调度", summary: "云端服务负责消息接入、模型调用和回复调度。" },
      { key: "architecture-ai-model", className: "s-ai-model", label: "AI 模型", detail: "ModelArts / glm-5.1", summary: "模型服务完成语义理解与回复生成。" }
    ],
    mainNodes: [
      { key: "prepare", className: "n-prepare", stepIndex: 0, dashed: true },
      { key: "resources", className: "n-buy", stepIndex: 1 },
      { key: "install", className: "n-install", stepIndex: 2 },
      { key: "feishu", className: "n-feishu", stepIndex: 3 },
      { key: "usage", className: "n-use", stepIndex: 4 }
    ],
    sideNodes: [
      { key: "guide-huawei-account", className: "s-huawei-account", label: "IAM", summary: "华为云账号、区域、项目和权限准备。" },
      { key: "guide-feishu", className: "s-feishu", label: "飞书账号", summary: "飞书开放平台入口和机器人配置准备。" },
      { key: "guide-ecs", className: "s-ecs", label: "ECS", summary: "云端 Agent 的运行环境。" },
      { key: "guide-security", className: "s-security", label: "安全组", summary: "放通必要端口并限制访问来源。" },
      { key: "guide-eip", className: "s-eip", label: "EIP", summary: "远程访问 ECS 的公网入口。" },
      { key: "guide-public-credential", className: "s-public-credential", label: "公网 IP / root 密码", summary: "登录 ECS 并完成初始化安装。" },
      { key: "guide-hermes", className: "s-hermes-script", label: "Hermes 脚本", summary: "安装 Hermes 并执行 setup。" }
    ],
    scenarios: ["ECS 可登录", "Hermes 可启动", "飞书可连接", "Agent 有回复"]
  },
  "security-alert": {
    backHref: "ai-agent-roadmap.html",
    areaLabel: "基于 CTS 构建安全组告警 Agent 路线图",
    viewBox: "0 0 920 772",
    connectors: [
      "M459 74 L459 568",
      "M564 74 L632 74 L632 54 L700 54",
      "M564 74 L632 74 L632 101 L700 101",
      "M354 210 L292 210 L292 190 L236 190",
      "M354 210 L292 210 L292 237 L236 237",
      "M354 418 L292 418 L292 398 L236 398",
      "M354 418 L292 418 L292 445 L236 445",
      "M564 350 L700 350",
      "M564 398 L632 398 L632 475 L700 475",
      "M564 398 L632 398 L632 522 L700 522",
      "M564 548 L632 548 L632 569 L700 569",
      "M564 548 L632 548 L632 616 L700 616"
    ],
    architectureFlow: [
      { text: "CTS", className: "arch-box" },
      { text: "->", className: "arch-arrow" },
      { text: "LTS", className: "arch-box" },
      { text: "->", className: "arch-arrow" },
      { text: "飞书告警", className: "arch-box" }
    ],
    mainNodes: [
      { key: "prepare", className: "node-prepare", stepIndex: 0, dashed: true },
      { key: "cts", className: "node-cts", stepIndex: 1 },
      { key: "rules", className: "node-rules", stepIndex: 2 },
      { key: "function", className: "node-function", stepIndex: 3 },
      { key: "verify", className: "node-verify", stepIndex: 4 }
    ],
    sideNodes: [
      { key: "guide-huawei-account", className: "node-guide-huawei-account", label: "IAM", summary: "账号、项目、区域和权限准备。" },
      { key: "guide-feishu", className: "node-guide-feishu", label: "飞书机器人", summary: "接收安全告警卡片的群机器人。" },
      { key: "guide-cts", className: "node-guide-cts", label: "CTS", summary: "安全组操作审计事件来源。" },
      { key: "guide-lts", className: "node-guide-lts", label: "LTS", summary: "关键词规则和告警历史。" },
      { key: "guide-smn", className: "node-guide-smn", label: "SMN", summary: "告警消息路由。" },
      { key: "guide-function", className: "node-guide-function", label: "FunctionGraph", guideKey: "guide-functiongraph", summary: "格式化飞书卡片并转发。" },
      { key: "guide-security", className: "node-guide-security", label: "安全组红线", guideKey: "guide-security-alert-rules", summary: "高危端口和全网段开放规则。" },
      { key: "guide-subscription", className: "node-guide-subscription", label: "订阅函数", summary: "SMN 主题订阅 FunctionGraph。" },
      { key: "guide-template", className: "node-guide-template", label: "通知模板", guideKey: "guide-alert-template", summary: "把告警 JSON 转为飞书卡片。" },
      { key: "guide-cost", className: "node-guide-cost", label: "成本估算", summary: "日志、通知和函数调用成本控制。" },
      { key: "guide-troubleshoot", className: "node-guide-troubleshoot", label: "故障排查", summary: "按日志、告警、投递和函数逐层定位。" }
    ],
    scenarios: ["飞书收到告警", "7 条规则运行中", "成本估算", "故障排查"]
  },
  "static-site": {
    backHref: "ai-agent-roadmap.html",
    areaLabel: "基于 OBS 部署 Web 网站路线图",
    viewBox: "0 0 920 820",
    connectors: [
      "M459 74 L459 604",
      "M564 74 L632 74 L632 54 L700 54",
      "M564 74 L632 74 L632 101 L700 101",
      "M564 180 L700 180",
      "M564 180 L632 180 L632 210 L700 210",
      "M354 286 L292 286 L292 286 L236 286",
      "M564 392 L632 392 L632 392 L700 392",
      "M354 498 L292 498 L292 478 L236 478",
      "M354 498 L292 498 L292 525 L236 525",
      "M564 604 L632 604 L632 584 L700 584",
      "M564 604 L632 604 L632 631 L700 631"
    ],
    architectureFlow: [
      { text: "DNS", className: "arch-box" },
      { text: "->", className: "arch-arrow" },
      { text: "CDN", className: "arch-box" },
      { text: "->", className: "arch-arrow" },
      { text: "OBS", className: "arch-box" }
    ],
    mainNodes: [
      { key: "prepare", className: "node-prepare", stepIndex: 0, dashed: true },
      { key: "obs", className: "node-obs", stepIndex: 1 },
      { key: "cdn", className: "node-cdn", stepIndex: 2 },
      { key: "dns", className: "node-dns", stepIndex: 3 },
      { key: "upload", className: "node-upload", stepIndex: 4, title: "上传网站文件" },
      { key: "verify", className: "node-verify", stepIndex: 5, title: "刷新与验证" }
    ],
    sideNodes: [
      { key: "guide-huawei-account", className: "node-guide-huawei-account", label: "IAM", summary: "账号和上传凭证准备。" },
      { key: "guide-domain", className: "node-guide-domain", label: "自定义域名", summary: "用于绑定 CDN 的访问入口。" },
      { key: "guide-obs", className: "node-guide-obs", label: "OBS", summary: "静态文件托管源站。" },
      { key: "guide-index", className: "node-guide-index", label: "默认首页", summary: "OBS 静态网站入口页面。" },
      { key: "guide-cdn", className: "node-guide-cdn", label: "CDN", summary: "加速分发和缓存配置。" },
      { key: "guide-dns", className: "node-guide-dns", label: "DNS", summary: "CNAME 解析配置。" },
      { key: "guide-obsutil", className: "node-guide-obsutil", label: "文件上传", summary: "上传本地静态网站文件。" },
      { key: "guide-path", className: "node-guide-path", label: "内容类型", summary: "HTML、Markdown 和静态资源 Content-Type。" },
      { key: "guide-refresh", className: "node-guide-refresh", label: "CDN 刷新", summary: "发布后刷新缓存。" },
      { key: "guide-cache", className: "node-guide-cache", label: "Cache-Control", summary: "HTML 短缓存，静态资源长缓存。" }
    ],
    scenarios: ["DNS 解析生效", "CDN 可访问", "OBS 托管正常", "完整链路验证"]
  },
  "oauth2-login": {
    backHref: "ai-agent-roadmap.html",
    areaLabel: "基于华为云部署 OAuth2 登录服务路线图",
    viewBox: "0 0 920 900",
    connectors: [
      "M459 74 L459 654",
      "M564 74 L632 74 L632 54 L700 54",
      "M564 74 L632 74 L632 101 L700 101",
      "M564 190 L632 190 L632 170 L700 170",
      "M564 190 L632 190 L632 217 L700 217",
      "M354 306 L292 306 L292 286 L236 286",
      "M354 306 L292 306 L292 333 L236 333",
      "M564 422 L700 422",
      "M354 538 L292 538 L292 518 L236 518",
      "M354 538 L292 538 L292 565 L236 565",
      "M564 654 L632 654 L632 634 L700 634",
      "M564 654 L632 654 L632 681 L700 681",
      "M564 654 L632 654 L632 728 L700 728"
    ],
    architectureFlow: [
      { text: "App", sub: "浏览器/应用", className: "arch-box" },
      { text: "->", className: "arch-arrow" },
      { text: "ECS", sub: "Node.js Express", className: "arch-box arch-wide" },
      { text: "->", className: "arch-arrow" },
      { text: "RDS", sub: "MySQL", className: "arch-box" }
    ],
    mainNodes: [
      { key: "prepare", className: "node-prepare", stepIndex: 0, dashed: true },
      { key: "rds", className: "node-rds", stepIndex: 1 },
      { key: "function", className: "node-function", stepIndex: 2 },
      { key: "trigger", className: "node-trigger", stepIndex: 3 },
      { key: "test", className: "node-test", stepIndex: 4 },
      { key: "frontend", className: "node-frontend", stepIndex: 5 }
    ],
    sideNodes: [
      { key: "guide-huawei-account", className: "node-guide-huawei-account", label: "IAM", summary: "账号、区域和权限准备。" },
      { key: "guide-api-tool", className: "node-guide-api-tool", label: "API 调试工具", summary: "浏览器或 curl 调试接口。" },
      { key: "guide-rds", className: "node-guide-rds", label: "RDS", summary: "MySQL 实例和内网地址。" },
      { key: "guide-mysql", className: "node-guide-mysql", label: "MySQL 建表", summary: "OAuth 客户端表和用户表。" },
      { key: "guide-function", className: "node-guide-function", label: "ECS", guideKey: "guide-ecs", summary: "OAuth2 Server 运行环境。" },
      { key: "guide-env", className: "node-guide-env", label: "安全组", guideKey: "guide-security", summary: "放通 SSH 和测试端口。" },
      { key: "guide-node", className: "node-guide-node", label: "Node.js", summary: "Express 服务运行时。" },
      { key: "guide-token", className: "node-guide-token", label: "JWT Token", summary: "签发、刷新和撤销策略。" },
      { key: "guide-curl", className: "node-guide-curl", label: "浏览器 / curl", summary: "端到端接口验证工具。" },
      { key: "guide-app", className: "node-guide-app", label: "systemd", summary: "服务开机自启。" },
      { key: "guide-extend", className: "node-guide-extend", label: "进阶扩展", summary: "HTTPS、短信验证码、日志审计。" },
      { key: "guide-logs", className: "node-guide-logs", label: "LTS 日志审计", summary: "登录服务访问日志与异常审计。" }
    ],
    scenarios: ["健康检查", "用户注册", "Token 签发", "用户信息"]
  }
};

const layout = computed(() => roadmapLayouts[props.roadmap.id] || roadmapLayouts["agent-worker"]);
const mapCanvasStyle = computed(() => {
  const viewBoxHeight = Number(layout.value.viewBox.split(/\s+/)[3]);

  return {
    "--roadmap-svg-height": `${Number.isFinite(viewBoxHeight) ? viewBoxHeight : 900}px`
  };
});

const mainNodes = computed(() => layout.value.mainNodes.map(node => buildMainNode(node)));
const sideNodes = computed(() => layout.value.sideNodes.map(node => buildSideNode(node)));
const mobileSideNodeGroups = computed(() => distributeSideNodesForMobile(sideNodes.value, mainNodes.value.length));
const architectureNodes = computed(() => (layout.value.architectureNodes || []).map(node => buildArchitectureNode(node)));
const architectureTopic = computed(() => {
  const guide = roadmapGuideTopics[`${props.roadmap.id}-architecture`];

  return {
    key: "architecture",
    title: guide?.title || "架构图",
    summary: guide?.summary || props.roadmap.summary,
    intro: guide?.intro,
    checklist: guide?.checklist || [`核心服务：${props.roadmap.services.join(" / ")}`, props.roadmap.outcome],
    learn: guide?.learn || [],
    resources: guide?.resources || props.roadmap.services,
    sections: guide?.sections || [],
    command: guide?.command,
    sources: guide?.sources || [],
    assistant: guide?.assistant,
    diagram: props.roadmap.id === "agent-worker" ? "agent-worker" : null
  };
});
const selectedScreenshots = computed(() => selectedTopic.value?.screenshots || []);

function buildMainNode(node) {
  const step = props.roadmap.steps[node.stepIndex] || {};
  return {
    ...node,
    title: node.title || step.title,
    summary: node.summary || step.summary,
    intro: step.intro,
    checklist: step.checklist || [],
    config: step.config || [],
    learn: step.learn || [],
    command: step.command,
    resources: step.resources || [],
    sections: step.sections || [],
    sources: step.sources || [],
    assistant: step.assistant,
    screenshots: step.screenshots || []
  };
}

function buildSideNode(node) {
  const guide = roadmapGuideTopics[node.guideKey || node.key];

  if (guide) {
    return {
      ...node,
      ...guide,
      key: node.key,
      label: node.label,
      title: guide.title || node.label,
      summary: guide.summary || guide.intro || node.summary,
      intro: guide.intro || node.summary,
      checklist: guide.checklist || []
    };
  }

  return {
    ...node,
    title: node.label,
    summary: node.summary,
    intro: node.summary,
    checklist: node.summary ? [node.summary] : [],
    resources: []
  };
}

function buildArchitectureNode(node) {
  const guide = roadmapGuideTopics[node.guideKey || node.key];

  if (guide) {
    return {
      ...node,
      ...guide,
      key: node.key,
      label: node.label,
      title: guide.title || node.label,
      summary: guide.summary || guide.intro || node.summary,
      intro: guide.intro || node.summary,
      checklist: guide.checklist || [node.summary, node.detail].filter(Boolean)
    };
  }

  return {
    ...node,
    title: node.label,
    summary: node.summary,
    intro: node.summary,
    checklist: [node.summary, node.detail].filter(Boolean),
    resources: [node.label]
  };
}

function distributeSideNodesForMobile(nodes, groupCount) {
  if (!groupCount) {
    return [];
  }

  const groups = Array.from({ length: groupCount }, () => []);
  nodes.forEach((node, index) => {
    const groupIndex = Math.min(Math.floor((index * groupCount) / nodes.length), groupCount - 1);
    groups[groupIndex].push(node);
  });

  return groups;
}

function getResourceKey(resource) {
  return typeof resource === "string" ? resource : `${resource.type}-${resource.name}`;
}

function getSourceKey(source) {
  return `${source.label}-${source.href}`;
}

function getInitialView() {
  if (typeof window === "undefined") {
    return "roadmap";
  }

  return new URLSearchParams(window.location.search).get("view") === "agent" ? "agent" : "roadmap";
}

function openTopic(topic) {
  selectedTopic.value = topic;
  selectedImage.value = null;
}

function closeDrawer() {
  selectedTopic.value = null;
  selectedImage.value = null;
}

function setView(nextView) {
  activeView.value = nextView;
  closeDrawer();

  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = nextView === "agent" ? "?view=agent" : window.location.pathname;
  window.history.replaceState(null, "", nextUrl);
}
</script>

<template>
  <div class="page-shell roadmap-detail-shell" :data-roadmap-id="roadmap.id">
    <div class="page-content">
      <section class="plugin-strip">
        <span>插件</span>
        <strong>安装华为云插件，快速完成以下任务</strong>
        <a class="strip-download-button" :href="pluginMarketUrl" target="_blank" rel="noreferrer">安装插件 -></a>
      </section>

      <section class="hero-card">
        <div class="hero-tools">
          <a :href="layout.backHref">← 全部路线图</a>
        </div>
        <h1>{{ roadmap.title }}</h1>
        <p class="subtitle">{{ roadmap.subtitle }}</p>
        <div class="tabs" role="tablist" aria-label="路线图视图">
          <button
            class="roadmap-tab"
            :class="{ current: activeView === 'roadmap' }"
            type="button"
            data-view="roadmap"
            :aria-selected="activeView === 'roadmap'"
            @click="setView('roadmap')"
          >路线图</button>
          <button
            class="roadmap-tab"
            :class="{ current: activeView === 'agent' }"
            type="button"
            data-view="agent"
            :aria-selected="activeView === 'agent'"
            @click="setView('agent')"
          >Agent 友好版</button>
        </div>
      </section>

      <section v-show="activeView === 'roadmap'" id="roadmapView">
        <section class="roadmap-area" :aria-label="layout.areaLabel">
          <div class="map-canvas" :style="mapCanvasStyle">
            <svg class="connector-svg" :viewBox="layout.viewBox" aria-hidden="true">
              <path class="connector-main" :d="layout.connectors[0]"></path>
              <path v-for="connector in layout.connectors.slice(1)" :key="connector" class="connector-branch" :d="connector"></path>
            </svg>

            <button class="road-node n-arch" type="button" data-node="architecture" @click="openTopic(architectureTopic)">架构图</button>
            <div :class="layout.architectureShellClass || 'arch-shell'" aria-hidden="true"></div>
            <template v-if="architectureNodes.length">
              <button
                v-for="node in architectureNodes"
                :key="node.key"
                class="road-node"
                :class="node.className"
                type="button"
                :data-node="node.key"
                @click="openTopic(node)"
              >
                <span class="roadmap-arch-label">
                  {{ node.label }}
                  <small v-if="node.arrow" class="roadmap-arch-arrow">{{ node.arrow }}</small>
                  <small v-if="node.detail">{{ node.detail }}</small>
                </span>
              </button>
            </template>
            <div v-else class="arch-flow" aria-hidden="true">
              <template v-for="item in layout.architectureFlow" :key="`${item.className}-${item.text}`">
                <div :class="item.className">{{ item.text }}<small v-if="item.sub">{{ item.sub }}</small></div>
              </template>
            </div>

            <button
              v-for="node in mainNodes"
              :key="node.key"
              class="road-node main"
              :class="[node.className, { dashed: node.dashed }]"
              type="button"
              :data-node="node.key"
              @click="openTopic(node)"
            >{{ node.title }}</button>

            <button
              v-for="node in sideNodes"
              :key="node.key"
              class="road-node side"
              :class="node.className"
              type="button"
              :data-node="node.key"
              @click="openTopic(node)"
            >{{ node.label }}</button>
          </div>

          <section class="mobile-roadmap" aria-label="移动端路线图">
            <div class="mobile-roadmap-list">
              <article v-for="(node, index) in mainNodes" :key="node.key" class="mobile-step">
                <span class="mobile-step-index">{{ index + 1 }}</span>
                <div class="mobile-step-card" :class="{ dashed: node.dashed }">
                  <button class="mobile-step-main" type="button" @click="openTopic(node)">
                    <span>阶段</span>
                    <strong>{{ node.title }}</strong>
                    <small>{{ node.summary }}</small>
                  </button>
                  <div v-if="mobileSideNodeGroups[index]?.length" class="mobile-step-branches" :aria-label="`${node.title} 关联能力`">
                    <button
                      v-for="side in mobileSideNodeGroups[index]"
                      :key="side.key"
                      type="button"
                      @click="openTopic(side)"
                    >{{ side.label }}</button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>

        <section class="scenario-strip">
          <h2>可验证场景</h2>
          <button v-for="scenario in layout.scenarios" :key="scenario" type="button" aria-disabled="true">{{ scenario }}</button>
        </section>
      </section>

      <section v-show="activeView === 'agent'" id="agentView" class="agent-friendly-page">
        <article class="agent-document markdown-body">
          <h1>{{ roadmap.title }}</h1>
          <p>目标：{{ roadmap.outcome }}</p>
          <h2>路线图总览</h2>
          <ol>
            <li v-for="step in roadmap.steps" :key="step.title">{{ step.title }}：{{ step.summary }}</li>
          </ol>
          <h2>输入信息</h2>
          <div class="markdown-table-wrap">
            <table>
              <thead>
                <tr><th>信息</th><th>用途</th></tr>
              </thead>
              <tbody>
                <tr v-for="service in roadmap.services" :key="service"><td>{{ service }}</td><td>支撑 {{ roadmap.title }} 的关键开放能力。</td></tr>
              </tbody>
            </table>
          </div>
          <template v-for="step in roadmap.steps" :key="step.title">
            <h2>{{ step.title }}</h2>
            <p>{{ step.summary }}</p>
            <ul>
              <li v-for="item in step.checklist" :key="item">{{ item }}</li>
            </ul>
            <div v-if="step.config?.length" class="markdown-table-wrap">
              <table>
                <thead>
                  <tr><th>项目</th><th>要求</th><th>说明</th></tr>
                </thead>
                <tbody>
                  <tr v-for="item in step.config" :key="item.label">
                    <td>{{ item.label }}</td>
                    <td>{{ item.value }}</td>
                    <td>{{ item.note || "" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <pre v-if="step.command">{{ step.command }}</pre>
            <template v-if="step.sections?.length">
              <article v-for="section in step.sections" :key="section.title">
                <h3>{{ section.title }}</h3>
                <p>{{ section.body }}</p>
              </article>
            </template>
            <div v-if="step.screenshots?.length" class="drawer-screenshots">
              <figure v-for="shot in step.screenshots" :key="shot.src" class="drawer-screenshot">
                <button class="drawer-screenshot-button" type="button" @click="selectedImage = shot">
                  <img :src="shot.src" :alt="shot.caption" loading="lazy" />
                </button>
                <figcaption>{{ shot.caption }}</figcaption>
              </figure>
            </div>
          </template>
        </article>
      </section>
    </div>

    <div v-if="selectedTopic" class="drawer-layer" role="dialog" aria-modal="true">
      <button class="drawer-backdrop" type="button" aria-label="关闭详情" @click="closeDrawer"></button>
      <aside class="drawer" aria-label="路线节点详情">
        <div class="drawer-head">
          <div>
            <span class="eyebrow">{{ selectedTopic.key?.startsWith("guide") ? "能力" : "路线图" }}</span>
            <h2>{{ selectedTopic.title }}</h2>
            <p v-if="selectedTopic.summary" class="drawer-summary">{{ selectedTopic.summary }}</p>
          </div>
          <button class="close-button" type="button" aria-label="关闭" @click="closeDrawer">x</button>
        </div>

        <section v-if="selectedTopic.checklist?.length" class="drawer-section">
          <h3>完成清单</h3>
          <ul>
            <li v-for="item in selectedTopic.checklist" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="selectedTopic.config?.length" class="drawer-section">
          <h3>推荐配置</h3>
          <dl class="drawer-config-list">
            <div v-for="item in selectedTopic.config" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>
                <strong>{{ item.value }}</strong>
                <small v-if="item.note">{{ item.note }}</small>
              </dd>
            </div>
          </dl>
        </section>

        <section v-if="selectedTopic.learn?.length" class="drawer-section">
          <h3>你将学会</h3>
          <ul>
            <li v-for="item in selectedTopic.learn" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="selectedTopic.diagram === 'agent-worker'" class="drawer-section">
          <h3>架构示意</h3>
          <div class="drawer-architecture">
            <div class="drawer-arch-client">
              <strong>飞书客户端</strong>
              <span>群聊 / 私聊</span>
            </div>
            <div class="drawer-arch-link" aria-label="WebSocket 长连接">
              <strong>WebSocket</strong>
              <span>◄──────────────►</span>
              <small>长连接，无需公网</small>
            </div>
            <div class="drawer-arch-gateway">
              <div class="drawer-arch-gateway-head">
                <strong>Hermes Gateway</strong>
                <span>消息收发调度</span>
              </div>
              <div class="drawer-arch-model">
                <strong>AI 模型</strong>
                <span>ModelArts / glm-5.1</span>
              </div>
            </div>
          </div>
          <div class="drawer-arch-flow">
            <h4>数据流</h4>
            <ol>
              <li>用户在飞书发消息，Hermes Gateway 通过 WebSocket 接收。</li>
              <li>Gateway 调用 AI 模型生成回复，并通过飞书 API 发送回复。</li>
            </ol>
          </div>
        </section>

        <section v-if="selectedTopic.resources?.length" class="drawer-section">
          <h3>{{ selectedTopic.key?.startsWith("guide") || selectedTopic.learn?.length ? "免费资源" : "关联能力" }}</h3>
          <div class="drawer-resource-grid">
            <template v-for="resource in selectedTopic.resources" :key="getResourceKey(resource)">
              <a
                v-if="typeof resource !== 'string' && resource.href"
                class="drawer-resource-card"
                :href="resource.href"
                :target="isExternalUrl(resource.href) ? '_blank' : undefined"
                :rel="isExternalUrl(resource.href) ? 'noreferrer' : undefined"
              >
                <span>{{ resource.type }}</span>
                <strong>{{ resource.name }}</strong>
                <small v-if="resource.note">{{ resource.note }}</small>
              </a>
              <div v-else class="drawer-resource-card" aria-disabled="true">
                <span>{{ typeof resource === "string" ? "能力" : resource.type }}</span>
                <strong>{{ typeof resource === "string" ? resource : resource.name }}</strong>
                <small v-if="typeof resource !== 'string' && resource.note">{{ resource.note }}</small>
              </div>
            </template>
          </div>
        </section>

        <section v-if="selectedTopic.sections?.length" class="drawer-section">
          <h3>知识拓展</h3>
          <div class="drawer-article-list">
            <article v-for="section in selectedTopic.sections" :key="section.title">
              <h4>{{ section.title }}</h4>
              <p>{{ section.body }}</p>
              <ul v-if="section.items?.length">
                <li v-for="item in section.items" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>

        <section v-if="selectedTopic.command" class="drawer-section">
          <h3>关键命令</h3>
          <pre>{{ selectedTopic.command }}</pre>
        </section>

        <section v-if="selectedTopic.sources?.length" class="drawer-section">
          <h3>参考文档</h3>
          <div class="drawer-source-list">
            <a
              v-for="source in selectedTopic.sources"
              :key="getSourceKey(source)"
              :href="source.href"
              :target="isExternalUrl(source.href) ? '_blank' : undefined"
              :rel="isExternalUrl(source.href) ? 'noreferrer' : undefined"
            >{{ source.label }}</a>
          </div>
        </section>

        <section v-if="selectedTopic.assistant" class="drawer-section">
          <h3>云宝助手</h3>
          <a class="drawer-assistant-link" :href="selectedTopic.assistant" target="_blank" rel="noreferrer">打开云宝助手</a>
        </section>

        <section v-if="selectedScreenshots.length" class="drawer-section">
          <h3>截图</h3>
          <div class="drawer-screenshots">
            <figure v-for="shot in selectedScreenshots" :key="shot.src" class="drawer-screenshot">
              <button class="drawer-screenshot-button" type="button" @click.stop="selectedImage = shot">
                <img :src="shot.src" :alt="shot.caption" loading="lazy" />
              </button>
              <figcaption>{{ shot.caption }}</figcaption>
            </figure>
          </div>
        </section>
      </aside>
    </div>

    <div v-if="selectedImage" class="image-preview-layer" role="dialog" aria-modal="true" :aria-label="selectedImage.caption">
      <button class="image-preview-backdrop" type="button" aria-label="关闭预览" @click="selectedImage = null"></button>
      <figure class="image-preview-card">
        <button class="image-preview-close" type="button" aria-label="关闭预览" @click="selectedImage = null">x</button>
        <img :src="selectedImage.src" :alt="selectedImage.caption" />
        <figcaption>{{ selectedImage.caption }}</figcaption>
      </figure>
    </div>
  </div>
</template>
