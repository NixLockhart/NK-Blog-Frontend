<template>
  <div class="article-card-skeleton">
    <!-- 封面占位 -->
    <SkeletonBlock width="100%" height="200px" rounded="0" />
    <!-- 内容区 -->
    <div class="skeleton-body">
      <!-- 标题 2 行 -->
      <SkeletonBlock width="90%" height="20px" />
      <SkeletonBlock width="60%" height="20px" />
      <!-- 摘要 3 行 -->
      <div class="skeleton-summary">
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="70%" height="14px" />
      </div>
      <!-- meta 行 -->
      <div class="skeleton-meta">
        <SkeletonBlock width="80px" height="12px" />
        <SkeletonBlock width="60px" height="12px" />
        <SkeletonBlock width="50px" height="12px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'
</script>

<style scoped>
.article-card-skeleton {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-body {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.skeleton-meta {
  display: flex;
  gap: var(--spacing-base);
  margin-top: 4px;
}
</style>
