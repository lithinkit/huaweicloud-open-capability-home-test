<script setup>
import { computed, ref } from "vue";

import { capabilities } from "../data/home";
import { isExternalUrl } from "../utils/icons";
import SectionBlock from "./portal/SectionBlock.vue";

const activeIndex = ref(0);
const active = computed(() => capabilities[activeIndex.value]);
const isPluginIntegration = computed(() => Boolean(active.value.workflow));
const isInterfaceOpen = computed(() => active.value.tab === "接口开放");
</script>

<template>
  <SectionBlock
    id="capabilities"
    title="全栈开放能力，贯通开发全流程"
    desc="连接插件、API 与 SDK/KooCLI/Terraform，帮助开发者及其 Agent 快速调用云服务并沉淀到工程流程。"
    tint
  >
    <div class="capability-shell">
      <div class="capability-tabs" role="tablist" aria-label="开放能力分类">
        <button
          v-for="(item, index) in capabilities"
          :key="item.tab"
          type="button"
          role="tab"
          :class="{ active: index === activeIndex }"
          :aria-selected="index === activeIndex"
          @click="activeIndex = index"
        >
          {{ item.tab }}
        </button>
      </div>
      <div class="capability-panel">
        <div class="capability-intro">
          <h3>{{ active.title }}</h3>
          <p>{{ active.desc }}</p>
        </div>
        <div class="capability-body">
          <article v-if="isPluginIntegration" class="plugin-workflow-card">
            <div class="plugin-card-head">
              <span>HuaweiCloud Devkit 接入流程</span>
            </div>
            <div class="plugin-flow" aria-label="插件集成工作过程">
              <div v-for="([title, desc], index) in active.workflow" :key="title" class="plugin-step">
                <b>{{ index + 1 }}</b>
                <strong>{{ title }}</strong>
                <span>{{ desc }}</span>
              </div>
            </div>
          </article>
          <div v-else class="capability-grid" :class="{ 'marketplace-grid': isInterfaceOpen }">
            <article
              v-for="item in active.items"
              :key="item[0]"
              class="capability-item"
              :class="{
                'marketplace-card': isInterfaceOpen,
                'marketplace-card-wide': isInterfaceOpen && item[0] === 'API Explorer'
              }"
            >
              <template v-if="isInterfaceOpen">
                <div class="marketplace-card-copy">
                  <strong>{{ item[0] }}</strong>
                  <span>{{ item[1] }}</span>
                </div>
                <div class="marketplace-card-stat">
                  <small>{{ item[4] }}</small>
                  <b>{{ item[3] }}</b>
                </div>
                <div class="marketplace-card-foot">
                  <a :href="item[2]" :target="isExternalUrl(item[2]) ? '_blank' : undefined" :rel="isExternalUrl(item[2]) ? 'noreferrer' : undefined">开放文档</a>
                </div>
              </template>
              <template v-else>
                <strong>{{ item[0] }}</strong>
                <span>{{ item[1] }}</span>
                <a :href="item[2]" target="_blank" rel="noreferrer">开放文档</a>
              </template>
            </article>
          </div>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>
