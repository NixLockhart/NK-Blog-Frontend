<template>
  <div class="detail-skeleton">
    <!-- 左栏：文章内容 -->
    <div class="detail-skeleton-content">
      <!-- 标题 -->
      <SkeletonBlock width="70%" height="32px" rounded="var(--radius-base)" />
      <!-- meta 行 -->
      <div class="detail-skeleton-meta">
        <SkeletonBlock width="100px" height="14px" />
        <SkeletonBlock width="70px" height="14px" />
        <SkeletonBlock width="70px" height="14px" />
        <SkeletonBlock width="50px" height="22px" rounded="var(--radius-sm)" />
      </div>
      <!-- 封面图 -->
      <SkeletonBlock width="100%" height="300px" rounded="var(--radius-md)" />
      <!-- 正文段落 -->
      <div class="detail-skeleton-body">
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="85%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="60%" height="14px" />
        <div class="detail-skeleton-gap"></div>
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="90%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="45%" height="14px" />
      </div>
    </div>
    <!-- 右栏：目录 -->
    <div class="detail-skeleton-sidebar">
      <div class="detail-skeleton-toc">
        <SkeletonBlock width="60px" height="18px" />
        <div class="detail-skeleton-toc-items">
          <SkeletonBlock width="80%" height="14px" />
          <SkeletonBlock width="65%" height="14px" />
          <SkeletonBlock width="90%" height="14px" />
          <SkeletonBlock width="50%" height="14px" />
          <SkeletonBlock width="75%" height="14px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'
</script>

<style scoped>
.detail-skeleton {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--spacing-xl);
}

.detail-skeleton-content {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.detail-skeleton-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-sm);
}

.detail-skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: var(--spacing-sm);
}

.detail-skeleton-gap {
  height: var(--spacing-base);
}

.detail-skeleton-sidebar {
  position: sticky;
  top: 96px;
  height: fit-content;
  align-self: start;
}

.detail-skeleton-toc {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.detail-skeleton-toc-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-left: var(--spacing-sm);
}

@media (max-width: 1024px) {
  .detail-skeleton {
    grid-template-columns: 1fr;
  }

  .detail-skeleton-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .detail-skeleton-content {
    padding: var(--spacing-base) var(--spacing-sm);
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
</style>
