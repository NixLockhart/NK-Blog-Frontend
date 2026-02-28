<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- 移动端菜单按钮 -->
        <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav-menu"
          aria-label="菜单">
          <Icon name="menu" :size="24" />
        </button>

        <!-- Logo -->
        <router-link to="/" class="logo">
          <h1>{{ siteTitle }}</h1>
        </router-link>

        <!-- 桌面端导航菜单 -->
        <nav class="nav desktop-nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/articles" class="nav-item">文章</router-link>
          <router-link to="/message" class="nav-item">留言板</router-link>
          <router-link to="/update-log" class="nav-item">更新日志</router-link>
          <router-link to="/about" class="nav-item">关于</router-link>
        </nav>

        <!-- 搜索和主题切换 -->
        <div class="header-actions">
          <button
            class="search-btn"
            :class="{ 'search-btn-hidden': !showSearchButton }"
            @click="toggleSearch"
            :tabindex="showSearchButton ? 0 : -1"
            title="搜索">
            <Icon name="search" :size="20" />
          </button>
          <button class="theme-toggle" @click="toggleTheme" :title="`切换到${theme === 'light' ? '暗色' : '亮色'}模式`">
            <Icon v-if="theme === 'light'" name="sun" :size="20" />
            <Icon v-else name="moon" :size="20" />
          </button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <transition name="search-slide">
        <div v-if="isSearchVisible" class="search-bar">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            @keyup.enter="performSearch"
            class="search-input"
          >
          <button @click="performSearch" class="search-submit">搜索</button>
          <button @click="closeSearch" class="search-close">取消</button>
        </div>
      </transition>
    </div>

    <!-- 移动端菜单抽屉 -->
    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu" @keydown.escape="closeMobileMenu">
        <nav id="mobile-nav-menu" class="mobile-nav" role="navigation" aria-label="移动端导航" @click.stop>
          <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">首页</router-link>
          <router-link to="/articles" class="mobile-nav-item" @click="closeMobileMenu">文章</router-link>
          <router-link to="/message" class="mobile-nav-item" @click="closeMobileMenu">留言板</router-link>
          <router-link to="/update-log" class="mobile-nav-item" @click="closeMobileMenu">更新日志</router-link>
          <router-link to="/about" class="mobile-nav-item" @click="closeMobileMenu">关于</router-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import Icon from '@/components/common/Icon.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const themeStore = useThemeStore()

const siteTitle = computed(() => appStore.getConfig('site_title', '星光小栈'))
const theme = computed(() => themeStore.theme)

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 搜索相关状态
const isSearchVisible = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// 判断是否在文章页面
const showSearchButton = computed(() => {
  return route.path === '/articles' || route.path.startsWith('/article/')
})

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // 防止背景滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Escape 键关闭移动端菜单
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value
  if (isSearchVisible.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  isSearchVisible.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/articles',
      query: { search: searchQuery.value.trim() }
    })
    closeSearch()
  }
}

// 路由变化时关闭移动端菜单
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--glass-bg);
  border-bottom: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--glass-shadow);
  transition: var(--transition-base);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  gap: var(--spacing-md);
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 0;
}

.mobile-menu-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.logo {
  text-decoration: none;
  color: var(--color-text);
}

.logo h1 {
  font-size: var(--text-xl);
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.nav-item {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: var(--radius-base);
  transition: var(--transition-fast);
}

.nav-item:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.nav-item.router-link-active {
  color: var(--color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.search-btn,
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 0;
}

.search-btn:hover,
.theme-toggle:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.search-btn-hidden {
  visibility: hidden !important;
  pointer-events: none;
  transition: none;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-base) 0;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  font-size: var(--text-base);
  outline: none;
  transition: var(--transition-fast);
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-submit,
.search-close {
  padding: var(--spacing-sm) var(--spacing-base);
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-submit {
  background-color: var(--color-primary);
  color: white;
}

.search-submit:hover {
  opacity: 0.9;
}

.search-close {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.search-close:hover {
  background-color: var(--color-bg-tertiary);
}

/* 搜索栏动画 */
.search-slide-enter-active,
.search-slide-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
  overflow: hidden;
}

.search-slide-enter-from,
.search-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 移动端菜单 */
.mobile-menu-overlay {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99;
}

.mobile-nav {
  position: absolute;
  top: 0;
  left: 12px;
  width: 240px;
  max-width: calc(100vw - 80px);
  background-color: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  padding: var(--spacing-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.mobile-nav-item {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: var(--radius-md);
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  min-height: 44px;
}

/* 左侧指示条 */
.mobile-nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, var(--color-primary), var(--color-secondary));
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 右侧活动指示点 */
.mobile-nav-item::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  transform: translateY(-50%) scale(0);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

/* 悬停态 */
.mobile-nav-item:hover {
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
}

/* 选中态 */
.mobile-nav-item.router-link-active {
  color: var(--color-primary);
  font-weight: 600;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%);
  padding-left: calc(var(--spacing-base) + 4px);
}

.mobile-nav-item.router-link-active::before {
  transform: scaleY(1);
}

.mobile-nav-item.router-link-active::after {
  transform: translateY(-50%) scale(1);
  opacity: 1;
}

/* 选中态悬停：加深背景 */
.mobile-nav-item.router-link-active:hover {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, var(--color-bg-secondary) 100%);
}

/* 按下反馈 */
.mobile-nav-item:active {
  transform: scale(0.97);
}

/* 暗色主题选中背景 */
:root[data-theme='dark'] .mobile-nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.1) 0%, transparent 100%);
}

:root[data-theme='dark'] .mobile-nav-item.router-link-active:hover {
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.15) 0%, var(--color-bg-secondary) 100%);
}

/* 移动端菜单动画 - 更细腻的效果 */
.slide-enter-active {
  animation: overlay-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-leave-active {
  animation: overlay-fade-out 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-active .mobile-nav {
  animation: menu-slide-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-leave-active .mobile-nav {
  animation: menu-slide-out 0.3s cubic-bezier(0.4, 0, 1, 1);
}

/* 菜单项逐个淡入动画 */
.slide-enter-active .mobile-nav-item:nth-child(1) {
  animation: item-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.slide-enter-active .mobile-nav-item:nth-child(2) {
  animation: item-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
}

.slide-enter-active .mobile-nav-item:nth-child(3) {
  animation: item-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.slide-enter-active .mobile-nav-item:nth-child(4) {
  animation: item-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.25s both;
}

.slide-enter-active .mobile-nav-item:nth-child(5) {
  animation: item-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
    -webkit-backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
}

@keyframes overlay-fade-out {
  from {
    opacity: 1;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0);
    -webkit-backdrop-filter: blur(0);
  }
}

@keyframes menu-slide-in {
  from {
    transform: translateX(-100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes menu-slide-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(-100%) scale(0.95);
    opacity: 0;
  }
}

@keyframes item-fade-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .desktop-nav {
    display: none;
  }

  .header-actions {
    margin-left: auto;
  }
}
</style>
