<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="case-grid por-row">
    <a
      v-for="item in items"
      :key="item.id"
      class="case-card por-col-6 por-col-sm-12 por-col-xs-24"
      :href="`case-detail.html?case=${item.id}`"
      :aria-label="`${item.title} 案例详情`"
    >
      <i class="case-card-icon" :data-lucide="item.icon" aria-hidden="true"></i>
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
    </a>
  </div>
</template>
