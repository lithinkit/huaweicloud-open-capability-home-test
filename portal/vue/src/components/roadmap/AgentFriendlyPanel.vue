<script setup>
defineProps({
  roadmap: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <aside class="agent-doc-panel">
    <span class="eyebrow">Agent 友好版</span>
    <h2>可交给 Agent 执行的摘要</h2>
    <p v-for="item in roadmap.agentDoc" :key="item">{{ item }}</p>
    <div class="chip-row">
      <span v-for="service in roadmap.services" :key="service">{{ service }}</span>
    </div>
  </aside>
</template>
