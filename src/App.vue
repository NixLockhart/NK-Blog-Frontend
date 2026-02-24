<template>
  <div id="app">
    <!-- 头部（固定在顶部） -->
    <Header />

    <!-- 占位元素，为固定导航栏留出空间 -->
    <div class="header-placeholder"></div>

    <!-- 公告栏 -->
    <Announcement />

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部 -->
    <Footer />

    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop" title="回到顶部">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </transition>

    <!-- AI助手 -->
    <AIAssistant />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'
import { usePageTitle } from '@/composables/usePageTitle'
import { throttle } from '@/utils/throttle'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Announcement from '@/components/layout/Announcement.vue'
import { AIAssistant } from '@/components/ai-assistant'

const themeStore = useThemeStore()
const appStore = useAppStore()

// 初始化页面标题和META标签
usePageTitle()

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const throttledScroll = throttle(handleScroll, 100)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  // 初始化主题
  await themeStore.initTheme()

  // 加载站点配置和公告
  appStore.loadSiteConfig()
  appStore.loadAnnouncements()

  // 监听滚动
  window.addEventListener('scroll', throttledScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScroll)
})
</script>

<style>
#app {
  min-height: 100vh;
  width: 100%;
}

/* 为固定导航栏留出空间的占位元素 */
.header-placeholder {
  height: 64px; /* 导航栏高度 */
}

.main-content {
  margin-top: 16px;
  width: 100%;
}

.back-to-top {
  position: fixed;
  right: var(--spacing-lg);
  bottom: var(--spacing-lg);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
  z-index: 999;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.back-to-top:active {
  transform: translateY(-2px);
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .back-to-top {
    right: var(--spacing-base);
    bottom: var(--spacing-base);
    width: 40px;
    height: 40px;
  }
}
</style>
