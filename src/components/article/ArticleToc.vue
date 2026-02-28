<template>
  <div class="article-toc-wrapper" v-if="tocItems.length > 0">
    <!-- PC端侧边栏显示 -->
    <div class="article-toc">
      <div class="toc-header">
        <div class="toc-icon">
          <Icon name="toc-list" :size="16" />
        </div>
        <h3 class="toc-title">目录</h3>
        <span class="toc-count">{{ tocItems.length }}</span>
      </div>
      <div class="toc-content">
        <!-- 进度指示条 -->
        <div class="toc-progress">
          <div class="toc-progress-bar" :style="{ height: progressHeight }"></div>
        </div>
        <ul class="toc-list">
          <li
            v-for="item in tocItems"
            :key="item.id"
            :class="[
              'toc-item',
              `level-${item.level}`,
              { active: activeId === item.id }
            ]"
          >
            <a :href="`#${item.id}`" @click.prevent="scrollToHeading(item.id)">
              <span class="toc-indicator"></span>
              <span class="toc-text">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 移动端悬浮按钮 -->
    <div class="mobile-toc">
      <!-- 悬浮按钮 -->
      <button class="mobile-toc-btn" @click="toggleMobileToc" :class="{ active: showMobileToc }">
        <Icon name="menu" :size="20" />
      </button>

      <!-- 移动端目录列表 -->
      <transition name="slide">
        <div v-show="showMobileToc" class="mobile-toc-panel">
          <div class="mobile-toc-header">
            <div class="mobile-toc-header-left">
              <div class="mobile-toc-icon">
                <Icon name="toc-list" :size="16" />
              </div>
              <h3 class="mobile-toc-title">目录</h3>
              <span class="mobile-toc-count">{{ tocItems.length }}</span>
            </div>
            <button class="mobile-toc-close" @click="closeMobileToc">
              <Icon name="close" :size="20" />
            </button>
          </div>
          <div class="mobile-toc-content">
            <!-- 进度指示条 -->
            <div class="mobile-toc-progress">
              <div class="mobile-toc-progress-bar" :style="{ height: progressHeight }"></div>
            </div>
            <ul class="mobile-toc-list">
              <li
                v-for="item in tocItems"
                :key="item.id"
                :class="[
                  'mobile-toc-item',
                  `level-${item.level}`,
                  { active: activeId === item.id }
                ]"
              >
                <a :href="`#${item.id}`" @click.prevent="scrollToHeadingMobile(item.id)">
                  <span class="mobile-toc-indicator"></span>
                  <span class="mobile-toc-text">{{ item.title }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </transition>

      <!-- 遮罩层 -->
      <transition name="fade">
        <div v-show="showMobileToc" class="mobile-toc-overlay" @click="closeMobileToc"></div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { throttle } from '@/utils/throttle'
import Icon from '@/components/common/Icon.vue'

const props = defineProps<{
  toc: Array<{id: string, level: number, title: string}>
}>()

const tocItems = ref(props.toc || [])
const showMobileToc = ref(false)
const activeId = ref('')
const progressHeight = ref('0%')

watch(() => props.toc, (newToc) => {
  tocItems.value = newToc
  // 重新初始化时更新活动项
  if (newToc.length > 0) {
    updateActiveHeading()
  }
})

// 滚动时更新当前活动的标题
const updateActiveHeading = () => {
  const headings = tocItems.value.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
  })).filter(h => h.element)

  if (headings.length === 0) return

  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight

  // 计算阅读进度
  const progress = Math.min((scrollTop / (docHeight - windowHeight)) * 100, 100)
  progressHeight.value = `${progress}%`

  // 找到当前可见的标题
  let currentId = headings[0]?.id || ''
  const offset = 100 // 偏移量，用于提前高亮

  for (const heading of headings) {
    if (heading.element) {
      const rect = heading.element.getBoundingClientRect()
      if (rect.top <= offset) {
        currentId = heading.id
      }
    }
  }

  activeId.value = currentId
}

const throttledUpdate = throttle(updateActiveHeading, 50)

onMounted(() => {
  window.addEventListener('scroll', throttledUpdate)
  // 初始化时执行一次
  setTimeout(updateActiveHeading, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledUpdate)
})

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // 顶部偏移量
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
    activeId.value = id
  }
}

const scrollToHeadingMobile = (id: string) => {
  scrollToHeading(id)
  // 跳转后自动关闭移动端目录
  closeMobileToc()
}

const toggleMobileToc = () => {
  showMobileToc.value = !showMobileToc.value
}

const closeMobileToc = () => {
  showMobileToc.value = false
}
</script>

<style scoped>
/* === PC端侧边栏样式 === */
.article-toc {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  max-height: calc(100vh - 120px); /* 视口高度 - 导航栏 - 间距 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;
}

.article-toc:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.toc-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
}

.toc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--radius-sm);
  color: white;
}

.toc-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  flex: 1;
}

.toc-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.toc-content {
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm) 0;
}

/* 自定义滚动条 */
.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

/* 进度条 */
.toc-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--color-border);
}

.toc-progress-bar {
  width: 100%;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  transition: height 0.1s ease-out;
  border-radius: 0 0 2px 2px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  position: relative;
  transition: all 0.2s ease;
}

.toc-item a {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  padding-left: var(--spacing-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  line-height: 1.5;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  margin-left: 3px;
}

.toc-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-border);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.toc-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 悬停效果 */
.toc-item a:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.toc-item a:hover .toc-indicator {
  background-color: var(--color-primary);
  transform: scale(1.2);
}

/* 活动状态 */
.toc-item.active a {
  color: var(--color-primary);
  font-weight: 500;
  border-left-color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb, 102, 126, 234), 0.08);
}

.toc-item.active .toc-indicator {
  background-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 102, 126, 234), 0.2);
  transform: scale(1.3);
}

/* 层级缩进 */
.toc-item.level-1 a {
  padding-left: var(--spacing-base);
}

.toc-item.level-2 a {
  padding-left: calc(var(--spacing-base) + var(--spacing-md));
}

.toc-item.level-2 .toc-indicator {
  width: 5px;
  height: 5px;
}

.toc-item.level-3 a {
  padding-left: calc(var(--spacing-base) + var(--spacing-md) * 2);
}

.toc-item.level-3 .toc-indicator {
  width: 4px;
  height: 4px;
}

/* === 移动端悬浮按钮样式 === */
.mobile-toc {
  display: none;
}

/* === 移动端响应式 === */
@media (max-width: 1024px) {
  /* 隐藏PC端侧边栏 */
  .article-toc {
    display: none;
  }

  /* 显示移动端悬浮按钮 */
  .mobile-toc {
    display: block;
    position: fixed;
    /* 与回到顶部按钮对齐：回到顶部在 bottom: var(--spacing-lg)，目录按钮在其上方 */
    bottom: calc(var(--spacing-lg) + 48px + var(--spacing-sm));
    right: var(--spacing-lg);
    z-index: 100;
  }

  /* 悬浮按钮 - 与回到顶部按钮保持相同尺寸 */
  .mobile-toc-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    color: white;
    border: none;
    box-shadow: var(--shadow-lg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-base);
  }

  .mobile-toc-btn:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }

  .mobile-toc-btn:active,
  .mobile-toc-btn.active {
    transform: translateY(-2px);
  }

  /* 遮罩层 */
  .mobile-toc-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 98;
  }

  /* 移动端目录面板 */
  .mobile-toc-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 85%;
    max-width: 320px;
    background-color: var(--color-bg);
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
    z-index: 99;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* 移动端目录头部 */
  .mobile-toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-base) var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
    flex-shrink: 0;
  }

  .mobile-toc-header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .mobile-toc-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    border-radius: var(--radius-sm);
    color: white;
  }

  .mobile-toc-title {
    font-size: var(--text-base);
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .mobile-toc-count {
    font-size: var(--text-xs);
    color: var(--color-text-tertiary);
    background-color: var(--color-bg-secondary);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }

  .mobile-toc-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mobile-toc-close:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  /* 移动端目录内容区 */
  .mobile-toc-content {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-sm) 0;
  }

  /* 进度条 */
  .mobile-toc-progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--color-border);
  }

  .mobile-toc-progress-bar {
    width: 100%;
    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    transition: height 0.1s ease-out;
    border-radius: 0 0 2px 2px;
  }

  /* 移动端目录列表 */
  .mobile-toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-toc-item {
    position: relative;
    transition: all 0.2s ease;
  }

  .mobile-toc-item a {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    padding-left: var(--spacing-base);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: var(--text-sm);
    line-height: 1.5;
    transition: all 0.2s ease;
    border-left: 2px solid transparent;
    margin-left: 3px;
  }

  .mobile-toc-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-border);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .mobile-toc-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 悬停效果 */
  .mobile-toc-item a:active {
    color: var(--color-primary);
    background-color: var(--color-bg-secondary);
  }

  .mobile-toc-item a:active .mobile-toc-indicator {
    background-color: var(--color-primary);
    transform: scale(1.2);
  }

  /* 活动状态 */
  .mobile-toc-item.active a {
    color: var(--color-primary);
    font-weight: 500;
    border-left-color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb, 102, 126, 234), 0.08);
  }

  .mobile-toc-item.active .mobile-toc-indicator {
    background-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 102, 126, 234), 0.2);
    transform: scale(1.3);
  }

  /* 层级缩进 */
  .mobile-toc-item.level-1 a {
    padding-left: var(--spacing-base);
  }

  .mobile-toc-item.level-2 a {
    padding-left: calc(var(--spacing-base) + var(--spacing-md));
  }

  .mobile-toc-item.level-2 .mobile-toc-indicator {
    width: 5px;
    height: 5px;
  }

  .mobile-toc-item.level-3 a {
    padding-left: calc(var(--spacing-base) + var(--spacing-md) * 2);
  }

  .mobile-toc-item.level-3 .mobile-toc-indicator {
    width: 4px;
    height: 4px;
  }

  /* 滑入动画 */
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  /* 遮罩层淡入淡出 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .mobile-toc {
    /* 与回到顶部按钮对齐：回到顶部在 bottom: var(--spacing-base)，尺寸40px */
    bottom: calc(var(--spacing-base) + 40px + var(--spacing-sm));
    right: var(--spacing-base);
  }

  .mobile-toc-btn {
    /* 与回到顶部按钮保持相同尺寸 */
    width: 40px;
    height: 40px;
  }

  .mobile-toc-btn svg {
    width: 18px;
    height: 18px;
  }

  .mobile-toc-panel {
    width: 90%;
  }
}
</style>
