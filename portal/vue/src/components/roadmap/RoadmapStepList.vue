<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
  },
  activeStep: {
    type: Number,
    required: true
  }
});

defineEmits(["select"]);
</script>

<template>
  <div class="roadmap-step-list" aria-label="路线图步骤">
    <button
      v-for="(step, index) in steps"
      :key="step.title"
      type="button"
      class="roadmap-step-button"
      :class="{ active: activeStep === index }"
      @click="$emit('select', index)"
    >
      <span class="step-index">{{ index + 1 }}</span>
      <span>
        <strong>{{ step.title }}</strong>
        <small>{{ step.summary }}</small>
      </span>
    </button>
  </div>
</template>
