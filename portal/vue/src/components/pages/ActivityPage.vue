<script setup>
import SubpageHero from "../portal/SubpageHero.vue";

const metrics = [
  "插件安装量：反映开发者在 IDE 与本地环境中的接入活跃度。",
  "KooCLI 命令调用量：反映云资源查询、脚本化运维与 Agent 命令生成的使用热度。",
  "MCP 工具调用量：反映 Agent 通过工具协议调用开放能力的扩展情况。",
  "API 调用量：反映云服务接口在应用集成和自动化流程中的持续使用。",
  "Explorer 调试量：反映开发者定位接口、验证参数与生成样例的频率。",
  "SDK 下载量：反映开放能力进入工程开发链路的转化情况。"
];

const topAbilities = ["OBS", "ECS", "FunctionGraph", "ModelArts", "GaussDB"];
</script>

<template>
  <SubpageHero
    eyebrow="开放能力活跃中"
    title="开放能力活跃中"
    desc="开发者与 Agent 正在通过接口、工具和插件持续调用华为云开放能力。"
  />
  <section class="container page-section activity-grid">
    <article class="doc-section">
      <h2>核心指标</h2>
      <ul class="doc-bullet-list">
        <li v-for="item in metrics" :key="item">{{ item }}</li>
      </ul>
    </article>
    <article class="doc-section">
      <h2>热门能力 Top 5</h2>
      <ol class="rank-list">
        <li v-for="item in topAbilities" :key="item">{{ item }}</li>
      </ol>
    </article>
  </section>
</template>
