<script setup>
defineProps({
  entries: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(["copy"]);

function resolveIconSrc(entry) {
  const localPath = entry.logo?.local_path;
  return localPath ? new URL(`./${localPath}`, window.location.href).href : "";
}

function architectureLabel(entry) {
  if (entry.architecture?.status === "available") {
    return "架构图标已提供";
  }
  if (entry.architecture?.status === "deprecated") {
    return "架构图标已废弃";
  }
  return "架构图标设计中";
}

function limitedTags(entry) {
  return [
    entry.category,
    entry.subcategory,
    ...(Array.isArray(entry.aliases) ? entry.aliases.slice(0, 2) : [])
  ].filter(Boolean).slice(0, 4);
}
</script>

<template>
  <div class="icons-grid" id="iconsGrid">
    <article v-for="entry in entries" :key="entry.id" class="icon-card">
      <div class="icon-logo-box">
        <img v-if="resolveIconSrc(entry)" :src="resolveIconSrc(entry)" :alt="`${entry.name} Logo`" loading="lazy" />
        <i v-else data-lucide="box" aria-hidden="true"></i>
      </div>
      <div class="icon-card-body">
        <h2>{{ entry.name }}</h2>
        <p>{{ entry.description || "华为云官网公开产品 Logo" }}</p>
        <div class="icon-card-meta">
          <code>{{ entry.id }}</code>
          <span>{{ architectureLabel(entry) }}</span>
        </div>
        <div class="chip-row">
          <span v-for="tag in limitedTags(entry)" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <div class="icon-card-actions">
        <a v-if="entry.logo?.local_path" class="icon-card-button" :href="resolveIconSrc(entry)" download>
          <i data-lucide="download" aria-hidden="true"></i>
          <span>Logo</span>
        </a>
        <button v-if="entry.logo?.local_path" class="icon-card-icon-button copy" type="button" @click="emit('copy', entry.logo.local_path)">
          <i data-lucide="copy" aria-hidden="true"></i>
          <span>复制路径</span>
        </button>
        <a v-if="entry.product_url" class="icon-card-icon-button" :href="entry.product_url" target="_blank" rel="noreferrer">
          <i data-lucide="external-link" aria-hidden="true"></i>
          <span>产品页</span>
        </a>
      </div>
    </article>
  </div>
</template>
