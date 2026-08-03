<script setup>
import { isExternalUrl } from "../../utils/icons";
import CopyButton from "../portal/CopyButton.vue";

defineProps({
  section: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section :id="section.id" class="doc-section">
    <div class="doc-section-head">
      <span>开放能力</span>
      <h2>{{ section.title }}</h2>
      <p>{{ section.summary }}</p>
    </div>
    <ul class="doc-bullet-list">
      <li v-for="item in section.bullets" :key="item">{{ item }}</li>
    </ul>
    <div v-if="section.command" class="doc-command-block doc-command-with-copy">
      <code>{{ section.command }}</code>
      <CopyButton :text="section.command" label="复制命令" message="命令已复制。" />
    </div>
    <div v-if="section.actions?.length" class="doc-actions">
      <a
        v-for="[label, href] in section.actions"
        :key="`${label}-${href}`"
        :href="href || undefined"
        :target="href && isExternalUrl(href) ? '_blank' : undefined"
        :rel="href && isExternalUrl(href) ? 'noreferrer' : undefined"
        :aria-disabled="href ? undefined : 'true'"
      >{{ label }}</a>
    </div>
  </section>
</template>
