<script setup>
import { ref } from "vue";

import { agentSteps } from "../data/home";
import CopyButton from "./portal/CopyButton.vue";
import SectionBlock from "./portal/SectionBlock.vue";

const status = ref("");
</script>

<template>
  <SectionBlock
    id="tools"
    title="让您的Agent通过插件快速连接华为云"
    desc="把提示词复制给您的 Agent，即可完成插件安装并开始调用华为云能力。"
  >
    <div class="agent-console" aria-label="Agent 插件连接华为云">
      <article v-for="[step, title, desc, command, label] in agentSteps" :key="step" class="agent-plugin-step">
        <span class="step-label">{{ step }}</span>
        <h3>{{ title }}</h3>
        <p>{{ desc }}</p>
        <div class="agent-prompt-box">
          <code>{{ command }}</code>
          <CopyButton :text="command" :label="label" message="提示词已复制，可以直接发给您的 Agent。" @copied="status = $event" />
        </div>
      </article>
    </div>
    <p class="agent-copy-status" role="status">{{ status }}</p>
  </SectionBlock>
</template>
