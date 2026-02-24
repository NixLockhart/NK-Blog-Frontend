<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 版权信息 -->
        <div class="copyright">
          <p>&copy; 2025 - {{ currentYear }} {{ siteTitle }}. All rights reserved.</p>
          <div class="beian-info">
            <p v-if="siteBeian" class="beian">
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" class="beian-link">
                {{ siteBeian }}
              </a>
            </p>
            <p v-if="siteGongan" class="beian gongan-beian">
              <a href="https://beian.mps.gov.cn/#/query/webSearch?code=62060202000453" target="_blank" rel="noopener" class="beian-link gongan-link">
                <img src="/beian.png" alt="公安备案" class="beian-icon">
                <span>{{ siteGongan }}</span>
              </a>
            </p>
          </div>
        </div>

        <!-- 社交媒体链接 -->
        <div class="social-links">
          <a v-if="contactGithub" :href="contactGithub" target="_blank" rel="noopener" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a v-if="contactEmail" :href="`mailto:${contactEmail}`" title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const siteTitle = computed(() => appStore.getConfig('site_title', '星光小栈'))
const contactGithub = computed(() => appStore.getConfig('contact_github', ''))
const contactEmail = computed(() => appStore.getConfig('contact_email', ''))
const siteBeian = computed(() => appStore.getConfig('site_icp', ''))
const siteGongan = computed(() => appStore.getConfig('site_gongan', ''))
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  margin-top: auto;
  padding: var(--spacing-xl) 0;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.copyright p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.beian-info {
  margin-top: var(--spacing-xs);
}

.beian {
  margin: var(--spacing-xs) 0 0 0;
  font-size: var(--text-xs);
}

.beian-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.beian-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.gongan-beian {
  display: flex;
  align-items: center;
  gap: 4px;
}

.gongan-link {
  display: flex;
  align-items: center;
  gap: 4px;
}

.beian-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.social-links {
  display: flex;
  gap: var(--spacing-base);
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-base);
  transition: var(--transition-fast);
}

.social-links a:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-base);
    text-align: center;
  }

  .gongan-beian {
    justify-content: center;
  }
}
</style>
