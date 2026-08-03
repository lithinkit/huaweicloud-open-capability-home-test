<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <section class="roadmap-section" aria-labelledby="roadmapTitle">
    <div class="container">
      <div class="roadmap-heading">
        <h1 id="roadmapTitle">Developer Roadmaps</h1>
        <p>基于华为云开放能力的 实践案例，从专属 Agent、安全告警、静态网站到 OAuth2 登录服务，快速进入可落地路线。</p>
      </div>
      <div class="roadmap-board">
        <article class="roadmap-group">
          <div class="roadmap-list">
            <a v-for="item in items" :key="item.id" class="roadmap-item" :href="item.href">
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
              <span class="roadmap-link">查看路线</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
