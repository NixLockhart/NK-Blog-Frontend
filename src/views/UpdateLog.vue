<template>
  <div class="update-log-page">
    <PageHeader title="更新日志" subtitle="记录每一次进步" />

    <TimelineSkeleton v-if="loading" />
    <div v-else-if="logs.length === 0" class="empty-state">
      <Icon name="calendar" :size="48" class="empty-icon" />
      <p>暂无更新日志</p>
    </div>
    <div v-else class="timeline">
      <div
        v-for="(log, index) in logs"
        :key="log.id"
        class="timeline-item"
        :class="{
          'is-major': log.isMajor === 1,
          'is-pending': log.isPending,
          'is-latest': index === 0 && !log.isPending
        }"
      >
        <div class="timeline-marker">
          <span class="marker-inner"></span>
        </div>
        <div class="timeline-content" :class="{ 'is-expanded': isExpanded(log.id) }">
          <div class="log-header" @click="toggleExpand(log.id)">
            <div class="log-title-section">
              <h3 class="log-version">
                <span class="version-tag" :class="{ 'major-tag': log.isMajor === 1, 'pending-tag': log.isPending }">
                  {{ log.version }}
                </span>
                <span v-if="log.isPending" class="status-badge pending-badge">待发布</span>
                <span v-else-if="index === 0 && !log.isPending" class="status-badge latest-badge">最新</span>
                <span v-if="log.isMajor === 1" class="status-badge major-badge">重大更新</span>
              </h3>
              <p v-if="log.title" class="log-title-text">{{ log.title }}</p>
            </div>
            <div class="log-meta">
              <span class="log-date">
                <Icon name="calendar" :size="14" />
                {{ formatDate(log.releaseDate) }}
              </span>
              <button
                class="expand-btn"
                :class="{ expanded: isExpanded(log.id) }"
                :aria-expanded="isExpanded(log.id)"
                :aria-controls="`log-content-${log.id}`"
                :aria-label="isExpanded(log.id) ? '折叠' : '展开'"
              >
                <Icon name="chevron-down" :size="18" />
              </button>
            </div>
          </div>

          <transition name="collapse">
            <div v-show="isExpanded(log.id)" :id="`log-content-${log.id}`" class="log-content update-log-content" role="region" v-html="renderLogContent(log)"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { configApi } from '@/api/config'
import type { UpdateLog } from '@/types'
import { useMarkdown } from '@/composables/useMarkdown'
import TimelineSkeleton from '@/components/skeleton/TimelineSkeleton.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import Icon from '@/components/common/Icon.vue'
import dayjs from 'dayjs'

const { renderUpdateLog } = useMarkdown()

const logs = ref<UpdateLog[]>([])
const loading = ref(false)
const expandedIds = ref<Set<number>>(new Set())

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const isExpanded = (id: number) => {
  return expandedIds.value.has(id)
}

const toggleExpand = (id: number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  // 触发响应式更新
  expandedIds.value = new Set(expandedIds.value)
}

const renderLogContent = (log: UpdateLog) => {
  return renderUpdateLog(log.content)
}

const loadLogs = async () => {
  loading.value = true
  try {
    logs.value = await configApi.getUpdateLogs()

    // 默认展开第一个非待发布的（最新的）
    const firstPublished = logs.value.find(log => !log.isPending)
    if (firstPublished) {
      expandedIds.value.add(firstPublished.id)
    }
  } catch (error) {
    console.error('加载更新日志失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
/* ==================== 页面容器 ==================== */
.update-log-page {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-xl);
}

/* ==================== 空状态 ==================== */
.empty-state {
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  text-align: center;
  color: var(--color-text-tertiary);
}

.empty-icon {
  display: block;
  margin: 0 auto var(--spacing-base);
  opacity: 0.4;
}

.empty-state p {
  margin: 0;
  font-size: var(--text-sm);
}

/* ==================== 时间轴 ==================== */
.timeline {
  position: relative;
  padding-left: 40px;
}

/* 时间轴竖线：渐变淡出 */
.timeline::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--color-primary) 0%,
    var(--color-border) 30%,
    var(--color-border) 85%,
    transparent 100%
  );
  border-radius: 1px;
}

/* ==================== 时间轴条目 ==================== */
.timeline-item {
  position: relative;
  padding-bottom: var(--spacing-lg);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* ==================== 时间轴圆点 ==================== */
.timeline-marker {
  position: absolute;
  left: -31px;
  top: 20px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--color-bg);
  border: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.marker-inner {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-primary);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 最新条目：脉冲动画 */
.timeline-item.is-latest .timeline-marker {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.timeline-item.is-latest .marker-inner {
  animation: marker-pulse 2.5s ease-in-out infinite;
}

@keyframes marker-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.7); }
}

/* 重大更新圆点 */
.timeline-item.is-major .timeline-marker {
  width: 18px;
  height: 18px;
  left: -33px;
  top: 18px;
  border: 2px solid #f59e0b;
  background-color: var(--color-bg);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15), 0 0 12px rgba(245, 158, 11, 0.1);
}

.timeline-item.is-major .marker-inner {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
}

/* 待发布圆点 */
.timeline-item.is-pending .timeline-marker {
  border-color: var(--color-text-tertiary);
  border-style: dashed;
}

.timeline-item.is-pending .marker-inner {
  background-color: var(--color-text-tertiary);
  opacity: 0.5;
}

/* ==================== 卡片容器 ==================== */
.timeline-content {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.timeline-content:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.timeline-content.is-expanded {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-md);
}

/* ==================== 卡片头部 ==================== */
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) var(--spacing-md);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  gap: var(--spacing-base);
  min-height: 48px;
}

.log-header:hover {
  background-color: var(--color-bg-secondary);
}

.log-title-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-version {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

/* ==================== 版本标签 ==================== */
.version-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  flex-shrink: 0;
  line-height: 1.5;
}

.version-tag.major-tag {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}

.version-tag.pending-tag {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* ==================== 状态徽章 ==================== */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  flex-shrink: 0;
  line-height: 1.5;
}

.pending-badge {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.major-badge {
  background-color: #fef3c7;
  color: #92400e;
}

.latest-badge {
  background-color: #dbeafe;
  color: #1e40af;
}

/* 暗色主题徽章适配 */
:root[data-theme='dark'] .major-badge {
  background-color: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

:root[data-theme='dark'] .latest-badge {
  background-color: rgba(96, 165, 250, 0.15);
  color: #93bbfd;
}

.log-title-text {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==================== 日期和展开按钮 ==================== */
.log-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.log-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.log-date svg {
  opacity: 0.6;
  flex-shrink: 0;
}

.expand-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border: none;
  border-radius: 50%;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.expand-btn:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-primary);
}

.expand-btn svg {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.expand-btn.expanded {
  background-color: var(--color-primary);
  color: #fff;
}

.expand-btn.expanded:hover {
  opacity: 0.85;
}

.expand-btn.expanded svg {
  transform: rotate(180deg);
}

/* ==================== 展开内容区 ==================== */
.log-content {
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.8;
  border-top: 1px dashed var(--color-border);
  position: relative;
}

/* 内容区顶部渐变装饰线 */
.log-content::before {
  content: '';
  position: absolute;
  top: -1px;
  left: var(--spacing-md);
  right: var(--spacing-md);
  height: 1px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary), transparent);
  opacity: 0.3;
}

/* ==================== 折叠动画 ==================== */
.collapse-enter-active {
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease 0.05s;
  max-height: 5000px;
  overflow: hidden;
}

.collapse-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
  max-height: 5000px;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ==================== 更新日志内容样式 ==================== */
.update-log-content :deep(h1),
.update-log-content :deep(h2),
.update-log-content :deep(h3) {
  margin-top: var(--spacing-base);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  font-weight: 600;
}

.update-log-content :deep(h1) {
  font-size: var(--text-lg);
  color: var(--color-primary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

.update-log-content :deep(h2) {
  font-size: var(--text-base);
  color: var(--color-text);
}

.update-log-content :deep(h3) {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.update-log-content :deep(p) {
  margin: var(--spacing-xs) 0;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.update-log-content :deep(ul),
.update-log-content :deep(ol) {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
}

.update-log-content :deep(li) {
  margin: 6px 0;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.update-log-content :deep(ul) {
  list-style-type: none;
  padding-left: var(--spacing-base);
}

.update-log-content :deep(ul > li) {
  position: relative;
  padding-left: var(--spacing-base);
}

.update-log-content :deep(ul > li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-primary);
  opacity: 0.7;
}

.update-log-content :deep(ol) {
  list-style-type: decimal;
}

.update-log-content :deep(ol > li)::marker {
  color: var(--color-primary);
  font-weight: 600;
}

.update-log-content :deep(code) {
  background-color: var(--color-bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--color-secondary);
  border: 1px solid var(--color-border);
}

.update-log-content :deep(pre) {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-base);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--spacing-sm) 0;
  border: 1px solid var(--color-border);
}

.update-log-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: var(--color-text);
  border: none;
  font-size: var(--text-sm);
}

.update-log-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  margin: var(--spacing-sm) 0;
  color: var(--color-text-secondary);
  font-style: italic;
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.update-log-content :deep(strong) {
  font-weight: 600;
  color: var(--color-text);
}

.update-log-content :deep(em) {
  font-style: italic;
  color: var(--color-text-secondary);
}

.update-log-content :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.update-log-content :deep(a:hover) {
  border-bottom-color: var(--color-primary);
}

.update-log-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: var(--spacing-base) 0;
}

.update-log-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-sm) 0;
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.update-log-content :deep(th),
.update-log-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs) var(--spacing-sm);
  text-align: left;
}

.update-log-content :deep(th) {
  background-color: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text);
}

.update-log-content :deep(td) {
  color: var(--color-text-secondary);
}

.update-log-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: var(--spacing-sm) 0;
}

/* ==================== 移动端适配 ==================== */
@media (max-width: 768px) {
  .update-log-page {
    padding: var(--spacing-base) var(--spacing-sm) var(--spacing-lg);
  }

  /* 时间轴左移贴近边缘 */
  .timeline {
    padding-left: 28px;
  }

  .timeline::before {
    left: 6px;
  }

  .timeline-marker {
    left: -22px;
    width: 12px;
    height: 12px;
    top: 18px;
  }

  .marker-inner {
    width: 4px;
    height: 4px;
  }

  .timeline-item.is-major .timeline-marker {
    width: 14px;
    height: 14px;
    left: -23px;
    top: 17px;
  }

  .timeline-item.is-major .marker-inner {
    width: 6px;
    height: 6px;
  }

  .timeline-item {
    padding-bottom: var(--spacing-base);
  }

  /* 卡片移动端样式 */
  .timeline-content {
    border-radius: var(--radius-md);
  }

  .timeline-content.is-expanded {
    box-shadow: 0 0 0 1px var(--color-primary), var(--shadow-sm);
  }

  /* 头部纵向布局 */
  .log-header {
    padding: var(--spacing-sm) var(--spacing-base);
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
    min-height: auto;
  }

  .log-title-section {
    width: 100%;
    gap: 2px;
  }

  .log-version {
    font-size: var(--text-sm);
    gap: 6px;
  }

  .version-tag {
    font-size: var(--text-xs);
    padding: 2px 8px;
  }

  .status-badge {
    font-size: 10px;
    padding: 1px 6px;
  }

  .log-title-text {
    font-size: var(--text-xs);
  }

  /* 日期行和展开按钮并排 */
  .log-meta {
    width: 100%;
    justify-content: space-between;
    padding-top: 2px;
  }

  .log-date {
    font-size: 11px;
  }

  .expand-btn {
    width: 28px;
    height: 28px;
  }

  .expand-btn svg {
    width: 14px;
    height: 14px;
  }

  /* 内容区紧凑间距 */
  .log-content {
    padding: var(--spacing-sm) var(--spacing-base) var(--spacing-base);
  }

  .log-content::before {
    left: var(--spacing-base);
    right: var(--spacing-base);
  }

  .update-log-content :deep(ul) {
    padding-left: var(--spacing-sm);
  }

  .update-log-content :deep(ol) {
    padding-left: var(--spacing-base);
  }

  .update-log-content :deep(pre) {
    padding: var(--spacing-sm);
    font-size: var(--text-xs);
  }

  .update-log-content :deep(blockquote) {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

/* 超小屏幕 */
@media (max-width: 380px) {
  .update-log-page {
    padding: var(--spacing-sm) var(--spacing-xs) var(--spacing-base);
  }

  .timeline {
    padding-left: 22px;
  }

  .timeline::before {
    left: 4px;
  }

  .timeline-marker {
    left: -18px;
    width: 10px;
    height: 10px;
  }

  .marker-inner {
    width: 4px;
    height: 4px;
  }

  .timeline-item.is-major .timeline-marker {
    width: 12px;
    height: 12px;
    left: -19px;
  }

  .log-header {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .log-content {
    padding: var(--spacing-xs) var(--spacing-sm) var(--spacing-sm);
  }

  .log-content::before {
    left: var(--spacing-sm);
    right: var(--spacing-sm);
  }
}
</style>
