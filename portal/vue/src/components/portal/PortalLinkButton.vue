<script setup>
import { computed } from "vue";

import { isExternalUrl } from "../../utils/icons";

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: "secondary"
  }
});

const classes = computed(() => (props.variant === "primary" ? "primary-btn" : "secondary-btn"));
const isExternal = computed(() => isExternalUrl(props.href));
</script>

<template>
  <a
    :class="classes"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noreferrer' : undefined"
  >
    <slot />
  </a>
</template>
