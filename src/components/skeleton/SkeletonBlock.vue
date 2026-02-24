<template>
  <div
    class="skeleton-block"
    :style="{
      width: width,
      height: height,
      borderRadius: rounded
    }"
  ></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  rounded?: string
}>(), {
  width: '100%',
  height: '16px',
  rounded: 'var(--radius-base)'
})
</script>

<style scoped>
.skeleton-block {
  background-color: var(--color-bg-tertiary);
  position: relative;
  overflow: hidden;
}

.skeleton-block::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
