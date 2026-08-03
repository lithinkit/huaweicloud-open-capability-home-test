<script setup>
import { cases } from "../data/cases";
import CaseGrid from "./cases/CaseGrid.vue";
import SectionBlock from "./portal/SectionBlock.vue";
</script>

<template>
  <SectionBlock
    id="scenes"
    title="基于开放能力的优秀参考案例"
    desc="从 Agentic DevOps、VPC 自动化、邮件助手到 Skills 检索，提炼 Agent 如何调用华为云插件、接口与工具链完成真实任务。"
    head-class="cases-head"
  >
    <CaseGrid :items="cases" />
  </SectionBlock>
</template>
