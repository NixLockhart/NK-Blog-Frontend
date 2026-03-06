<template>
  <div class="maintenance-page">
    <div class="maintenance-content">
      <!-- 动画图标 -->
      <div class="maintenance-icon">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 外圈齿轮 -->
          <g class="gear gear-outer">
            <path d="M60 15a45 45 0 1 1 0 90 45 45 0 0 1 0-90zm0 12a33 33 0 1 0 0 66 33 33 0 0 0 0-66z"
              fill="currentColor" opacity="0.15" />
            <circle cx="60" cy="15" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="93" cy="30" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="105" cy="60" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="93" cy="90" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="60" cy="105" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="27" cy="90" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="15" cy="60" r="5" fill="currentColor" opacity="0.3" />
            <circle cx="27" cy="30" r="5" fill="currentColor" opacity="0.3" />
          </g>
          <!-- 扳手 -->
          <g class="wrench" opacity="0.6">
            <path d="M52 48 L68 72 L64 76 L48 52Z" fill="currentColor" />
            <circle cx="46" cy="46" r="10" stroke="currentColor" stroke-width="3" fill="none" />
            <rect x="66" y="70" width="6" height="14" rx="2" transform="rotate(-35 69 77)" fill="currentColor" />
          </g>
        </svg>
      </div>

      <h1 class="maintenance-title">网站维护中</h1>
      <p class="maintenance-description">
        服务器正在维护或暂时无法连接，请稍后再试。
      </p>

      <div class="maintenance-actions">
        <button class="btn btn-primary" @click="retry">刷新</button>
      </div>

      <p class="maintenance-hint">如果问题持续存在，请<a href="mailto:nix_email@126.com" class="contact-link">联系站长</a>。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const retry = () => {
  window.location.reload()
}
</script>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background-color: var(--color-bg);
}

.maintenance-content {
  text-align: center;
  max-width: 480px;
}

.maintenance-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  color: var(--color-primary);
  animation: float 3s ease-in-out infinite;
}

.gear-outer {
  transform-origin: 60px 60px;
  animation: spin 12s linear infinite;
}

.maintenance-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin: 0 0 var(--spacing-base) 0;
}

.maintenance-description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: 1.6;
}

.maintenance-actions {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.maintenance-actions .btn {
  min-width: 140px;
  gap: var(--spacing-sm);
}

.maintenance-hint {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.contact-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.contact-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .maintenance-icon {
    width: 96px;
    height: 96px;
  }

  .maintenance-title {
    font-size: var(--text-2xl);
  }

  .maintenance-description {
    font-size: var(--text-base);
  }
}
</style>
