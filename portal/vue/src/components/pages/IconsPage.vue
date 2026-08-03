<script setup>
import { computed, onMounted, ref, watch } from "vue";

import IconLibraryGrid from "../icons/IconLibraryGrid.vue";
import SubpageHero from "../portal/SubpageHero.vue";

const iconSearch = ref("");
const selectedCategory = ref("all");
const icons = ref([]);
const loadError = ref("");
const page = ref(1);
const iconsCopyStatus = ref("");
const pageSize = 24;

const categories = computed(() => {
  const counts = new Map();
  icons.value.forEach((entry) => {
    const category = entry.category || "未分类";
    counts.set(category, (counts.get(category) || 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1]);
});

const filteredIcons = computed(() => {
  const keyword = iconSearch.value.trim().toLowerCase();
  return icons.value.filter((entry) => {
    const category = entry.category || "未分类";
    const inCategory = selectedCategory.value === "all" || category === selectedCategory.value;
    const haystack = [
      entry.id,
      entry.name,
      entry.category,
      entry.subcategory,
      entry.description,
      ...(entry.aliases || []),
      ...(entry.tags || [])
    ].filter(Boolean).join(" ").toLowerCase();

    return inCategory && (!keyword || haystack.includes(keyword));
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredIcons.value.length / pageSize)));
const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredIcons.value.slice(start, start + pageSize);
});

const pageNumbers = computed(() => {
  const pages = [];
  const start = Math.max(1, page.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let index = start; index <= end; index += 1) {
    pages.push(index);
  }
  return pages;
});

function selectCategory(category) {
  selectedCategory.value = category;
  page.value = 1;
}

async function loadIcons() {
  try {
    const manifestUrl = new URL("./icons/manifest.v1.json", window.location.href).href;
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const manifest = await response.json();
    icons.value = Array.isArray(manifest.icons) ? manifest.icons : [];
  } catch (error) {
    loadError.value = `Icons manifest 加载失败：${error.message}`;
  }
}

async function copyIconPath(text) {
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    iconsCopyStatus.value = "资产路径已复制。";
  } catch (error) {
    iconsCopyStatus.value = "当前浏览器未开放剪贴板权限，请手动选择路径复制。";
  }
}

watch(filteredIcons, () => {
  if (page.value > totalPages.value) {
    page.value = totalPages.value;
  }
});

onMounted(loadIcons);
</script>

<template>
  <SubpageHero
    eyebrow="Huawei Cloud Icons"
    title="华为云 Icons 库"
    desc="收录华为云官网公开产品 Logo，并为架构图标、Manifest、第三方工具和 Agent 接入保留统一资产契约。"
  />

  <section class="icons-workbench container">
    <div class="icons-actions">
      <a class="primary-link" href="icons/manifest.v1.json" target="_blank" rel="noreferrer">查看 Manifest</a>
      <a href="https://www.huaweicloud.com/product/" target="_blank" rel="noreferrer">官网产品源</a>
    </div>
    <div class="icons-toolbar">
      <label class="search-field" for="iconSearch">
        <i data-lucide="search" aria-hidden="true"></i>
        <input id="iconSearch" v-model="iconSearch" type="search" placeholder="搜索云服务、缩写、分类或标签" />
      </label>
      <div class="icons-tabs" id="iconsCategoryTabs" role="tablist" aria-label="Icons 分类">
        <button type="button" :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">
          全部 <span>{{ icons.length }}</span>
        </button>
        <button
          v-for="[category, count] in categories"
          :key="category"
          type="button"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }} <span>{{ count }}</span>
        </button>
      </div>
    </div>

    <p class="agent-copy-status" id="iconsCopyStatus" role="status">{{ iconsCopyStatus }}</p>
    <div v-if="loadError" class="icons-empty">{{ loadError }}</div>
    <div v-else-if="icons.length === 0" class="icons-empty">正在加载 Icons manifest...</div>
    <div v-else-if="pageItems.length === 0" class="icons-empty">没有匹配的图标，请换一个关键词。</div>
    <IconLibraryGrid v-else :entries="pageItems" @copy="copyIconPath" />

    <nav v-if="totalPages > 1" class="icons-pagination" id="iconsPagination" aria-label="Icons 分页">
      <button type="button" :disabled="page === 1" @click="page -= 1">上一页</button>
      <button
        v-for="item in pageNumbers"
        :key="item"
        type="button"
        :class="{ active: item === page }"
        :aria-current="item === page ? 'page' : undefined"
        @click="page = item"
      >{{ item }}</button>
      <button type="button" :disabled="page === totalPages" @click="page += 1">下一页</button>
    </nav>
  </section>

  <section class="container icons-tooling" aria-labelledby="iconsToolingTitle">
    <div class="section-head">
      <h2 id="iconsToolingTitle">工具复用入口</h2>
      <p>第一版页面直接消费同一份 Manifest；后续 CLI、MCP、PPT 或 draw.io 导入包也应从这份结构化资产契约生成。</p>
    </div>
    <div class="icons-tool-grid">
      <article>
        <i data-lucide="file-json" aria-hidden="true"></i>
        <h3>Manifest</h3>
        <p><code>icons/manifest.v1.json</code></p>
      </article>
      <article>
        <i data-lucide="folder-down" aria-hidden="true"></i>
        <h3>静态资产 URL</h3>
        <p><code>icons/assets/logo/{id}.png</code></p>
      </article>
      <article>
        <i data-lucide="boxes" aria-hidden="true"></i>
        <h3>架构图标</h3>
        <p>按产品 ID 预留 <code>architecture</code> 字段，当前状态为 planned。</p>
      </article>
    </div>
  </section>
</template>
