<script setup>
import SubpageHero from "../portal/SubpageHero.vue";
</script>

<template>
  <SubpageHero
    eyebrow="暂未开放"
    title="开放平台数据运营中心暂未开放"
    desc="该页面正在调整中，稍后将以新的数据运营中心形式开放。"
  >
    <template #aside>
      <div class="roadmap-outcome">
        <strong>当前状态</strong>
        <span>保留旧入口，使用 Vue 渲染禁用状态，不再发布旧静态 HTML。</span>
      </div>
    </template>
  </SubpageHero>
  <section class="container page-section">
    <a class="primary-btn inline-action" href="index.html">返回首页</a>
  </section>
</template>
