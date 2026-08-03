<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <article class="case-detail-card">
    <div class="case-detail-head">
      <div>
        <p class="eyebrow">{{ item.type }}</p>
        <h1>{{ item.title }}</h1>
        <p>{{ item.outcome }}</p>
        <div class="tag-row">
          <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
        </div>
        <a class="text-link" :href="item.source" target="_blank" rel="noreferrer">查看原始案例</a>
      </div>
      <div class="detail-diagram" aria-label="案例链路图">
        <div v-for="(node, index) in item.diagram" :key="node">
          <b>{{ index + 1 }}</b>
          <span>{{ node }}</span>
        </div>
      </div>
    </div>
    <div class="case-detail-body">
      <article>
        <h2>Agent 任务链路</h2>
        <ul>
          <li v-for="step in item.steps" :key="step">{{ step }}</li>
        </ul>
      </article>
      <article>
        <h2>开放能力组合</h2>
        <ul>
          <li v-for="ability in item.abilities" :key="ability">{{ ability }}</li>
        </ul>
      </article>
      <article>
        <h2>适用扩展</h2>
        <p>可将该案例沉淀为团队 Skill、MCP 工具或 KooCLI 脚本模板，并在开发文档中补充权限、审计和回滚策略。</p>
      </article>
    </div>
  </article>
</template>
