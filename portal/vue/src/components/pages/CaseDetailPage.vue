<script setup>
import { computed, onMounted, watchEffect } from "vue";

import CaseDetailCard from "../cases/CaseDetailCard.vue";
import { getCaseById } from "../../data/cases";

const caseId = computed(() => new URLSearchParams(window.location.search).get("case") || "codearts");
const selectedCase = computed(() => getCaseById(caseId.value));

onMounted(() => {
  watchEffect(() => {
    document.title = `${selectedCase.value.title} - 华为云开放能力`;
  });
});
</script>

<template>
  <section class="container page-section">
    <a class="page-back-link" href="cases.html">返回参考案例</a>
    <CaseDetailCard :item="selectedCase" />
  </section>
</template>
