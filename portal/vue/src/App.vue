<script setup>
import { computed, onMounted, onUpdated } from "vue";

import ActivityPage from "./components/pages/ActivityPage.vue";
import CaseDetailPage from "./components/pages/CaseDetailPage.vue";
import CasesPage from "./components/pages/CasesPage.vue";
import CommunityPage from "./components/pages/CommunityPage.vue";
import DocsPage from "./components/pages/DocsPage.vue";
import HomePage from "./components/pages/HomePage.vue";
import IconsPage from "./components/pages/IconsPage.vue";
import OpenDataPage from "./components/pages/OpenDataPage.vue";
import RoadmapPage from "./components/pages/RoadmapPage.vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteHeader from "./components/SiteHeader.vue";
import { refreshLucideIcons } from "./utils/icons";

const roadmapPages = new Set([
  "ai-agent-roadmap.html",
  "ai-agent-worker.html",
  "cts-security-alert-agent.html",
  "dns-cdn-obs-static-site.html",
  "oauth2-login-service.html"
]);

const pageName = computed(() => {
  const pathName = window.location.pathname.split("/").pop();
  return pathName || "index.html";
});

const activePage = computed(() => {
  if (pageName.value === "docs.html") {
    return "docs";
  }

  if (pageName.value === "icons.html") {
    return "icons";
  }

  if (pageName.value === "activity.html") {
    return "activity";
  }

  if (pageName.value === "cases.html") {
    return "cases";
  }

  if (pageName.value === "case-detail.html") {
    return "case-detail";
  }

  if (pageName.value === "community.html") {
    return "community";
  }

  if (pageName.value === "open-data.html") {
    return "open-data";
  }

  if (roadmapPages.has(pageName.value)) {
    return "roadmap";
  }

  return "home";
});

onMounted(refreshLucideIcons);
onUpdated(refreshLucideIcons);
</script>

<template>
  <SiteHeader :active-page="activePage" />
  <main>
    <HomePage v-if="activePage === 'home'" />
    <RoadmapPage v-else-if="activePage === 'roadmap'" :page-name="pageName" />
    <IconsPage v-else-if="activePage === 'icons'" />
    <DocsPage v-else-if="activePage === 'docs'" />
    <ActivityPage v-else-if="activePage === 'activity'" />
    <CasesPage v-else-if="activePage === 'cases'" />
    <CaseDetailPage v-else-if="activePage === 'case-detail'" />
    <CommunityPage v-else-if="activePage === 'community'" />
    <OpenDataPage v-else-if="activePage === 'open-data'" />
  </main>
  <SiteFooter />
</template>
