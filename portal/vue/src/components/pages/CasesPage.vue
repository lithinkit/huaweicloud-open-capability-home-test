<script setup>
import CaseGrid from "../cases/CaseGrid.vue";
import SubpageHero from "../portal/SubpageHero.vue";
import { cases } from "../../data/cases";
</script>

<template>
  <SubpageHero
    eyebrow="参考案例"
    title="从任务路径理解开放能力如何落地"
    desc="每个案例都拆成目标、Agent 调用链路、可复用开放能力和下一步操作，帮助开发者快速迁移到自己的业务场景。"
  />
  <section class="container page-section">
    <CaseGrid :items="cases" />
  </section>
</template>
