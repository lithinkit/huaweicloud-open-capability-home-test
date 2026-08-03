<script setup>
import { communityRepos } from "../data/home";
import { isExternalUrl } from "../utils/icons";
import SectionBlock from "./portal/SectionBlock.vue";
</script>

<template>
  <SectionBlock
    id="community"
    title="华为云开源社区"
    desc="连接 GitHub 与 GitCode 两个开源代码仓，获取工具链、示例项目、实践教程与社区协作入口。"
    head-class="community-heading"
  >
    <div class="community-cards">
      <article v-for="repo in communityRepos" :key="repo.href" class="repo-card">
        <i :data-lucide="repo.icon" aria-hidden="true"></i>
        <h2>{{ repo.title }}</h2>
        <p>{{ repo.desc }}</p>
        <a :href="repo.href" :target="isExternalUrl(repo.href) ? '_blank' : undefined" :rel="isExternalUrl(repo.href) ? 'noreferrer' : undefined">{{ repo.label }}</a>
      </article>
    </div>
  </SectionBlock>
</template>
