<script setup>
import { docsHighlights, docsSections } from "../../data/docs";
import DocSection from "../docs/DocSection.vue";
import SubpageHero from "../portal/SubpageHero.vue";
</script>

<template>
  <SubpageHero
    eyebrow="Developer Docs"
    title="开发文档"
    desc="查接口、跑命令、接 SDK、编排 Agent 工具，把华为云开放能力接入你的应用和自动化系统。"
  >
    <template #aside>
      <div class="subpage-stat-grid" aria-label="文档重点">
        <article v-for="[title, desc] in docsHighlights" :key="title">
          <strong>{{ title }}</strong>
          <span>{{ desc }}</span>
        </article>
      </div>
    </template>
  </SubpageHero>

  <section class="docs-layout container" aria-label="开发文档内容">
    <aside class="docs-sidebar">
      <a v-for="section in docsSections" :key="section.id" :href="`#${section.id}`">{{ section.title }}</a>
    </aside>
    <div class="doc-content" id="docContent">
      <DocSection v-for="section in docsSections" :key="section.id" :section="section" />
    </div>
  </section>
</template>
