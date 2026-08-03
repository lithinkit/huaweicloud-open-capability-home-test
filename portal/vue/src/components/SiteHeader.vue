<script setup>
import { navLinks } from "../data/home";

defineProps({
  activePage: {
    type: String,
    default: "home"
  }
});
</script>

<template>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="华为云开放能力首页">
      <span class="brand-mark" aria-hidden="true">
        <span class="brand-node"></span>
        <span class="brand-node"></span>
        <span class="brand-node"></span>
      </span>
      <span>华为云开放能力</span>
    </a>
    <nav class="nav-links" aria-label="主导航">
      <a
        v-for="[label, href, key] in navLinks"
        :key="href"
        :href="href"
        :aria-current="activePage === key ? 'page' : undefined"
      >{{ label }}</a>
    </nav>
  </header>
</template>
