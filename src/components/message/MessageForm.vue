<template>
  <form class="message-form" @submit.prevent="handleSubmit">
    <!-- 用户信息行 -->
    <div class="form-user-row">
      <!-- 头像上传 -->
      <label class="avatar-upload-label">
        <div class="avatar-upload-btn">
          <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览" class="avatar-preview" />
          <div v-else class="avatar-placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span class="avatar-upload-hint">头像</span>
        </div>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
          class="hidden-input"
        />
      </label>
      <!-- 昵称/邮箱/博客 -->
      <div class="form-fields">
        <input
          v-model="form.nickname"
          type="text"
          class="form-input"
          placeholder="昵称 *"
          required
          maxlength="50"
        />
        <input
          v-model="form.email"
          type="email"
          class="form-input"
          placeholder="邮箱 (可选)"
          maxlength="100"
        />
        <input
          v-model="form.blogUrl"
          type="url"
          class="form-input"
          placeholder="博客地址 (可选，填写后显示在友链)"
          maxlength="200"
        />
      </div>
    </div>

    <!-- 内容输入 -->
    <div class="form-content-area">
      <textarea
        v-model="form.content"
        class="form-textarea"
        placeholder="说点什么吧... (支持 Markdown)"
        required
        maxlength="500"
        rows="4"
      ></textarea>
      <div class="form-footer">
        <span class="char-count" :class="{ 'near-limit': form.content.length > 450 }">
          {{ form.content.length }} / 500
        </span>
        <button type="submit" class="submit-btn" :disabled="submitting">
          <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <span v-if="submitting" class="submit-spinner"></span>
          {{ submitting ? '发送中...' : '发表留言' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { messageApi } from '@/api/message'
import request from '@/utils/request'
import type { MessageCreateRequest } from '@/types'

const emit = defineEmits<{
  messageAdded: []
}>()

const form = ref<MessageCreateRequest>({
  nickname: '',
  email: '',
  blogUrl: '',
  avatar: '',
  content: ''
})

const submitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const avatarPreview = ref<string>('')
const avatarFile = ref<File | null>(null)

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB')
    return
  }

  avatarFile.value = file

  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// 上传头像
const uploadAvatar = async (): Promise<string | null> => {
  if (!avatarFile.value) return null

  const formData = new FormData()
  formData.append('file', avatarFile.value)

  try {
    const data = await request.upload<{ path: string }>('/files/avatar', formData)
    return data.path || null
  } catch (error: any) {
    console.error('头像上传失败:', error)
    alert(`头像上传失败: ${error.message || '请稍后重试'}`)
    return null
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  submitting.value = true
  try {
    // 如果有头像，先上传
    if (avatarFile.value) {
      const avatarPath = await uploadAvatar()
      if (avatarPath) {
        form.value.avatar = avatarPath
      }
    }

    await messageApi.createMessage(form.value)

    // 重置表单
    form.value = {
      nickname: form.value.nickname, // 保留昵称
      email: form.value.email, // 保留邮箱
      blogUrl: form.value.blogUrl, // 保留网站
      avatar: '',
      content: ''
    }
    avatarPreview.value = ''
    avatarFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    emit('messageAdded')
    alert('留言发表成功!')
  } catch (error) {
    console.error('发表留言失败:', error)
    alert('发表留言失败,请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.message-form {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-form:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

/* ==================== 用户信息行 ==================== */
.form-user-row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-base);
}

/* 头像上传 */
.avatar-upload-label {
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.avatar-placeholder-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px dashed var(--color-border-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all 0.2s ease;
  background-color: var(--color-bg);
}

.avatar-upload-label:hover .avatar-placeholder-icon {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.avatar-preview {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
}

.avatar-upload-hint {
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-align: center;
}

.hidden-input {
  display: none;
}

/* 表单字段 */
.form-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: var(--text-sm);
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* ==================== 内容输入区 ==================== */
.form-content-area {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: 1.7;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-textarea::placeholder {
  color: var(--color-text-tertiary);
}

.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* ==================== 底部栏 ==================== */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-variant-numeric: tabular-nums;
}

.char-count.near-limit {
  color: var(--color-accent);
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ==================== 移动端 ==================== */
@media (max-width: 768px) {
  .message-form {
    padding: var(--spacing-base);
  }

  .form-user-row {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-base);
  }

  .avatar-upload-btn {
    flex-direction: row;
    gap: var(--spacing-sm);
  }

  .avatar-upload-hint {
    font-size: var(--text-xs);
  }

  .form-fields {
    width: 100%;
  }
}
</style>
