<script setup>
const emit = defineEmits(["copied"]);

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

async function copyText() {
  try {
    await navigator.clipboard.writeText(props.text);
    emit("copied", props.message);
  } catch (error) {
    emit("copied", "当前浏览器未开放剪贴板权限，请手动选择内容复制。");
  }
}
</script>

<template>
  <button class="copy-snippet" type="button" :aria-label="label" @click="copyText">
    <i data-lucide="copy" aria-hidden="true"></i>
  </button>
</template>
