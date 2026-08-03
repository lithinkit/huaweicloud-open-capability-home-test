<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
});
</script>

<template>
  <section class="subpage-hero">
    <div class="container subpage-hero-inner">
      <div>
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p>{{ desc }}</p>
      </div>
      <slot name="aside" />
    </div>
  </section>
</template>
