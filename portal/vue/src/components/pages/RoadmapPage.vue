<script setup>
import { computed } from "vue";

import { getRoadmapByPage, roadmapList } from "../../data/roadmaps";
import RoadmapDetail from "../roadmap/RoadmapDetail.vue";
import RoadmapIndex from "../roadmap/RoadmapIndex.vue";

const props = defineProps({
  pageName: {
    type: String,
    required: true
  }
});

const selectedRoadmap = computed(() => getRoadmapByPage(props.pageName));
</script>

<template>
  <template v-if="!selectedRoadmap">
    <RoadmapIndex :items="roadmapList" />
  </template>
  <RoadmapDetail v-else :roadmap="selectedRoadmap" />
</template>
