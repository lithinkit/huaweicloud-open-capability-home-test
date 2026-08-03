<script setup>
import { communityRepos } from "../../data/home";
import { isExternalUrl } from "../../utils/icons";
import SubpageHero from "../portal/SubpageHero.vue";
</script>

<template>
  <SubpageHero
    eyebrow="华为云开源社区"
    title="让开放能力在社区里持续生长"
    desc="查看开发者样例、插件拓展和开源协作等内容，让团队把 Agent 能力沉淀成可复用的工具、模板和最佳实践。"
  />
  <section class="container page-section community-cards">
    <article v-for="repo in communityRepos" :key="repo.href" class="repo-card">
      <i :data-lucide="repo.icon" aria-hidden="true"></i>
      <h2>{{ repo.title }}</h2>
      <p>{{ repo.desc }}</p>
      <a :href="repo.href" :target="isExternalUrl(repo.href) ? '_blank' : undefined" :rel="isExternalUrl(repo.href) ? 'noreferrer' : undefined">{{ repo.label }}</a>
    </article>
  </section>
</template>
