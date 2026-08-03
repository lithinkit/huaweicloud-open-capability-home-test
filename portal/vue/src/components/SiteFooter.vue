<script setup>
import { footerColumns, footerLegal } from "../data/home";
import { isExternalUrl } from "../utils/icons";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container por-container site-footer-inner">
      <div class="footer-brand">
        <a class="brand" href="index.html" aria-label="华为云开放能力首页">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-node"></span>
            <span class="brand-node"></span>
            <span class="brand-node"></span>
          </span>
          <span>华为云开放能力</span>
        </a>
        <p class="footer-tagline">
          AI 开发者空间与全栈开放能力，支持插件、接口、生态一站接入华为云。
        </p>
        <div class="footer-social">
          <a
            href="https://github.com/huaweicloud"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 开源"
          >
            <i data-lucide="github" aria-hidden="true"></i>
          </a>
          <a
            href="https://gitcode.com/huaweicloud"
            target="_blank"
            rel="noreferrer"
            aria-label="GitCode 开源"
          >
            <i data-lucide="code-2" aria-hidden="true"></i>
          </a>
          <a
            href="https://bbs.huaweicloud.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="开发者社区"
          >
            <i data-lucide="messages-square" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <nav class="footer-cols" aria-label="页脚导航">
        <div v-for="col in footerColumns" :key="col.title" class="footer-col">
          <h2>{{ col.title }}</h2>
          <ul>
            <li v-for="[label, href] in col.links" :key="href + label">
              <a
                :href="href"
                :target="isExternalUrl(href) ? '_blank' : undefined"
                :rel="isExternalUrl(href) ? 'noreferrer' : undefined"
              >{{ label }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <div class="container por-container footer-bottom-inner">
        <p>© {{ year }} 华为云开放能力</p>
        <ul class="footer-legal">
          <li v-for="[label, href] in footerLegal" :key="href + label">
            <a :href="href" target="_blank" rel="noreferrer">{{ label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
