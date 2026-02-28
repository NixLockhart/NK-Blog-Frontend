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
                <img src="/beian.png" alt="公安备案" class="beian-icon" width="16" height="16">
                <span>{{ siteGongan }}</span>
              </a>
            </p>
          </div>
        </div>

        <!-- 社交媒体链接 -->
        <div class="social-links">
          <a v-if="contactGithub" :href="contactGithub" target="_blank" rel="noopener" title="GitHub">
            <Icon name="github" :size="20" />
          </a>
          <a v-if="contactEmail" :href="`mailto:${contactEmail}`" title="Email">
            <Icon name="mail" :size="20" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Icon from '@/components/common/Icon.vue'

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
