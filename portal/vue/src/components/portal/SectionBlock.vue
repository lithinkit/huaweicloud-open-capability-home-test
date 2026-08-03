<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  centered: {
    type: Boolean,
    default: true
  },
  tint: {
    type: Boolean,
    default: false
  },
  headClass: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <section class="section" :class="{ 'section-tint': tint }" :id="id">
    <div class="container por-container">
      <div class="section-head" :class="[{ centered }, headClass]">
        <h2>{{ title }}</h2>
        <p>{{ desc }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
