<template>
  <div class="timeline-skeleton">
    <div v-for="i in 4" :key="i" class="timeline-skeleton-item">
      <div class="timeline-skeleton-marker">
        <span class="timeline-skeleton-marker-inner"></span>
      </div>
      <div class="timeline-skeleton-content">
        <div class="timeline-skeleton-header">
          <div class="timeline-skeleton-title-section">
            <div class="timeline-skeleton-version-row">
              <SkeletonBlock width="90px" height="24px" rounded="var(--radius-full)" />
              <SkeletonBlock width="44px" height="18px" rounded="var(--radius-full)" />
            </div>
            <SkeletonBlock v-if="i % 2 === 0" width="140px" height="14px" />
          </div>
          <div class="timeline-skeleton-meta">
            <SkeletonBlock width="95px" height="14px" />
            <SkeletonBlock width="30px" height="30px" rounded="50%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue'
</script>

<style scoped>
.timeline-skeleton {
  position: relative;
  padding-left: 40px;
}

.timeline-skeleton::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--color-bg-tertiary) 0%,
    var(--color-border) 30%,
    var(--color-border) 85%,
    transparent 100%
  );
  border-radius: 1px;
}

.timeline-skeleton-item {
  position: relative;
  padding-bottom: var(--spacing-lg);
}

.timeline-skeleton-item:last-child {
  padding-bottom: 0;
}

.timeline-skeleton-marker {
  position: absolute;
  left: -31px;
  top: 20px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--color-bg);
  border: 2px solid var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.timeline-skeleton-marker-inner {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-bg-tertiary);
}

.timeline-skeleton-content {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.timeline-skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-md);
  gap: var(--spacing-base);
  min-height: 48px;
}

.timeline-skeleton-title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.timeline-skeleton-version-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.timeline-skeleton-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .timeline-skeleton {
    padding-left: 28px;
  }

  .timeline-skeleton::before {
    left: 6px;
  }

  .timeline-skeleton-marker {
    left: -22px;
    width: 12px;
    height: 12px;
    top: 18px;
  }

  .timeline-skeleton-marker-inner {
    width: 4px;
    height: 4px;
  }

  .timeline-skeleton-item {
    padding-bottom: var(--spacing-base);
  }

  .timeline-skeleton-content {
    border-radius: var(--radius-md);
  }

  .timeline-skeleton-header {
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-sm) var(--spacing-base);
    gap: var(--spacing-sm);
    min-height: auto;
  }

  .timeline-skeleton-meta {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 380px) {
  .timeline-skeleton {
    padding-left: 22px;
  }

  .timeline-skeleton::before {
    left: 4px;
  }

  .timeline-skeleton-marker {
    left: -18px;
    width: 10px;
    height: 10px;
  }

  .timeline-skeleton-marker-inner {
    width: 4px;
    height: 4px;
  }

  .timeline-skeleton-header {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
