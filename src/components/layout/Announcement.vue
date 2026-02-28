<template>
  <transition name="slide-down">
    <div
      class="announcement-wrapper"
      :class="{ collapsed: isCollapsed }"
      v-if="announcements.length > 0 && !isClosed"
      ref="wrapperRef"
    >
      <div class="announcement-bar">
        <div class="container">
          <div class="announcement-content">
          <Icon name="megaphone" :size="20" class="announcement-icon" />

          <div class="announcement-slider" role="status" aria-live="polite">
            <transition-group name="slide-vertical">
              <div
                v-for="(announcement, index) in announcements"
                v-show="index === currentIndex"
                :key="announcement.id"
                class="announcement-text"
              >
                {{ announcement.content }}
              </div>
            </transition-group>
          </div>

          <div v-if="announcements.length > 1" class="announcement-indicators">
            <span
              v-for="(announcement, index) in announcements"
              :key="announcement.id"
              class="indicator"
              :class="{ active: index === currentIndex }"
              @click="goToSlide(index)"
            ></span>
          </div>

          <button class="close-btn" @click="closeAnnouncement" title="关闭公告">
            <Icon name="close" :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { throttle } from '@/utils/throttle'
import Icon from '@/components/common/Icon.vue'

const appStore = useAppStore()
const announcements = computed(() => appStore.announcements)

// 监听公告数据变化，数据加载完成后启动自动播放
watch(
  () => announcements.value.length,
  (newLength, oldLength) => {
    // 当公告数量从0或1变为多条时，且未被用户关闭，启动自动播放
    if (newLength > 1 && (oldLength === undefined || oldLength <= 1) && !isClosed.value) {
      startAutoPlay()
    }
  },
  { immediate: false }
)

const currentIndex = ref(0)
const isClosed = ref(false)
const isCollapsed = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
let autoPlayTimer: number | null = null

// 切换到指定的公告
const goToSlide = (index: number) => {
  currentIndex.value = index
  resetAutoPlay()
}

// 自动播放下一条
const nextSlide = () => {
  if (announcements.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % announcements.value.length
}

// 启动自动播放
const startAutoPlay = () => {
  if (announcements.value.length <= 1) return
  autoPlayTimer = window.setInterval(() => {
    nextSlide()
  }, 5000) // 每5秒切换一次
}

// 重置自动播放
const resetAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  startAutoPlay()
}

// 关闭公告栏
const closeAnnouncement = () => {
  isClosed.value = true
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  // 将关闭状态保存到 sessionStorage，页面刷新后重新显示
  sessionStorage.setItem('announcement-closed', 'true')
}

// 处理滚动 - 实现折叠效果
const handleScroll = () => {
  const scrollY = window.scrollY
  const threshold = 10 // 开始折叠的滚动阈值

  if (scrollY > threshold) {
    isCollapsed.value = true
  } else {
    isCollapsed.value = false
  }
}

const throttledScroll = throttle(handleScroll, 16)

onMounted(() => {
  // 检查是否已经关闭过
  const closed = sessionStorage.getItem('announcement-closed')
  if (closed === 'true') {
    isClosed.value = true
  } else {
    startAutoPlay()
  }

  // 监听滚动
  window.addEventListener('scroll', throttledScroll, { passive: true })
  // 初始检查
  handleScroll()
})

onBeforeUnmount(() => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
  }
  window.removeEventListener('scroll', throttledScroll)
})
</script>

<style scoped>
/* 包装容器 - 用于实现折叠效果 */
.announcement-wrapper {
  position: sticky;
  top: var(--header-height); /* 紧贴导航栏下方 */
  z-index: 50;
  overflow: hidden;
  /* 使用 transform 实现高性能动画 */
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

/* 折叠状态 - 收起到导航栏下方 */
.announcement-wrapper.collapsed {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.announcement-bar {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  padding: var(--spacing-sm) 0;
}

html[data-theme="dark"] .announcement-bar,
[data-theme="dark"] .announcement-bar {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #fef3c7;
}

.announcement-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
}

.announcement-icon {
  flex-shrink: 0;
}

.announcement-slider {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.announcement-text {
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.5;
  position: absolute;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.announcement-indicators {
  display: flex;
  gap: 6px;
  margin-left: var(--spacing-sm);
  margin-right: var(--spacing-sm);
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(120, 53, 15, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

html[data-theme="dark"] .indicator,
[data-theme="dark"] .indicator {
  background: rgba(254, 243, 199, 0.3);
}

.indicator.active {
  background: #78350f;
  width: 20px;
  border-radius: 3px;
}

html[data-theme="dark"] .indicator.active,
[data-theme="dark"] .indicator.active {
  background: #fef3c7;
}

.indicator:hover {
  opacity: 0.8;
}

.close-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(120, 53, 15, 0.1);
  border: none;
  border-radius: 6px;
  color: #78350f;
  cursor: pointer;
  transition: all 0.2s ease;
}

html[data-theme="dark"] .close-btn,
[data-theme="dark"] .close-btn {
  background: rgba(254, 243, 199, 0.15);
  color: #fef3c7;
}

.close-btn:hover {
  background: rgba(120, 53, 15, 0.2);
  transform: scale(1.05);
}

html[data-theme="dark"] .close-btn:hover,
[data-theme="dark"] .close-btn:hover {
  background: rgba(254, 243, 199, 0.25);
}

/* 公告栏展开收起动画 - 折叠效果 */
.slide-down-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.3s ease;
}

.slide-down-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* 公告垂直切换动画 */
.slide-vertical-enter-active {
  transition: all 0.5s ease;
}

.slide-vertical-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}

.slide-vertical-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-vertical-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .announcement-text {
    font-size: var(--text-xs);
  }

  .announcement-indicators {
    display: none;
  }

  .close-btn {
    width: 28px;
    height: 28px;
  }

  .close-btn svg {
    width: 16px;
    height: 16px;
  }
}
</style>
