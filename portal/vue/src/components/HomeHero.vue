<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { banners } from "../data/home";
import PortalLinkButton from "./portal/PortalLinkButton.vue";

const activeIndex = ref(0);
const activeBanner = computed(() => banners[activeIndex.value]);
let timer;

function selectBanner(index) {
  activeIndex.value = index;
  startBannerAuto();
}

function startBannerAuto() {
  window.clearInterval(timer);
  timer = window.setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % banners.length;
  }, 5600);
}

onMounted(startBannerAuto);
onBeforeUnmount(() => window.clearInterval(timer));
</script>

<template>
  <section class="hero" id="cognition" aria-label="认知 Banner 轮播">
    <div class="hero-media" aria-hidden="true"></div>
    <div class="container hero-inner">
      <div class="hero-slogan">
        <h1>让您的Agent，即刻协同无界</h1>
      </div>
      <div class="banner-card" aria-label="开放平台推荐内容">
        <div class="banner-content">
          <h2>{{ activeBanner.title }}</h2>
          <p id="bannerDesc">{{ activeBanner.desc }}</p>
          <div class="button-row">
            <PortalLinkButton
              v-for="[label, href, variant] in activeBanner.actions"
              :key="`${label}-${href}`"
              :href="href"
              :variant="variant"
            >
              {{ label }}
            </PortalLinkButton>
          </div>
        </div>
        <div class="banner-visual" aria-hidden="true">
          <div class="banner-preview">
            <div class="terminal-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <code>{{ activeBanner.code }}</code>
          </div>
          <div class="visual-stack">
            <article v-for="[iconName, label] in activeBanner.visual" :key="label">
              <i :data-lucide="iconName"></i>
              <span>{{ label }}</span>
            </article>
          </div>
        </div>
        <div class="banner-controls">
          <div class="dots" aria-label="Banner 分页">
            <button
              v-for="(_, index) in banners"
              :key="index"
              type="button"
              :class="{ active: index === activeIndex }"
              :aria-label="`切换到第 ${index + 1} 张`"
              @click="selectBanner(index)"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
