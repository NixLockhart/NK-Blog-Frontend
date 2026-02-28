<template>
  <!-- Overlay 骨架 -->
  <div v-if="variant === 'overlay'" class="skeleton-overlay">
    <SkeletonBlock width="100%" height="100%" rounded="0" />
    <div class="skeleton-overlay-content">
      <SkeletonBlock width="50px" height="16px" />
      <SkeletonBlock width="80%" height="18px" />
      <div class="skeleton-overlay-meta">
        <SkeletonBlock width="70px" height="12px" />
        <SkeletonBlock width="40px" height="12px" />
      </div>
    </div>
  </div>

  <!-- Horizontal 骨架 -->
  <div v-else-if="variant === 'horizontal'" class="skeleton-horizontal">
    <SkeletonBlock width="240px" height="100%" rounded="0" class="skeleton-horizontal-cover" />
    <div class="skeleton-horizontal-body">
      <SkeletonBlock width="85%" height="20px" />
      <SkeletonBlock width="55%" height="20px" />
      <div class="skeleton-horizontal-summary">
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="75%" height="14px" />
      </div>
      <div class="skeleton-horizontal-meta">
        <SkeletonBlock width="80px" height="12px" />
        <SkeletonBlock width="60px" height="12px" />
        <SkeletonBlock width="50px" height="12px" />
      </div>
    </div>
  </div>

  <!-- Vertical 骨架（默认） -->
  <div v-else class="article-card-skeleton">
    <SkeletonBlock width="100%" height="200px" rounded="0" />
    <div class="skeleton-body">
      <SkeletonBlock width="90%" height="20px" />
      <SkeletonBlock width="60%" height="20px" />
      <div class="skeleton-summary">
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="100%" height="14px" />
        <SkeletonBlock width="70%" height="14px" />
      </div>
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

withDefaults(defineProps<{
  variant?: 'vertical' | 'overlay' | 'horizontal'
}>(), {
  variant: 'vertical'
})
</script>

<style scoped>
/* ==================== Vertical 骨架 ==================== */
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

/* ==================== Overlay 骨架 ==================== */
.skeleton-overlay {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-bg-tertiary);
}

.skeleton-overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.skeleton-overlay-meta {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: 2px;
}

/* ==================== Horizontal 骨架 ==================== */
.skeleton-horizontal {
  display: flex;
  flex-direction: row;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: 180px;
}

.skeleton-horizontal-cover {
  flex-shrink: 0;
}

.skeleton-horizontal-body {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-sm);
}

.skeleton-horizontal-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.skeleton-horizontal-meta {
  display: flex;
  gap: var(--spacing-base);
  margin-top: 4px;
}

/* ==================== 移动端 ==================== */
@media (max-width: 768px) {
  .skeleton-horizontal {
    flex-direction: column;
    min-height: auto;
  }

  .skeleton-horizontal-cover {
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
  }

  .skeleton-horizontal-body {
    padding: var(--spacing-base);
  }
}
</style>
