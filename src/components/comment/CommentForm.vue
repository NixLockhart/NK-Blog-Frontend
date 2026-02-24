<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <!-- 左侧头像上传框 -->
      <div class="avatar-section">
        <label class="avatar-upload-label">
          <div class="avatar-box">
            <img v-if="avatarPreview" :src="avatarPreview" alt="头像预览" class="avatar-preview" />
            <div v-else class="avatar-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleFileChange"
            class="hidden-input"
          />
        </label>
        <span class="avatar-hint">点击上传头像</span>
      </div>

      <!-- 右侧用户信息 -->
      <div class="user-info">
        <div class="form-row">
          <input
            v-model="form.nickname"
            type="text"
            class="input"
            placeholder="昵称 *"
            required
            maxlength="50"
          />
        </div>
        <div class="form-row">
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="邮箱(可选)"
            maxlength="100"
          />
        </div>
      </div>
    </div>

    <!-- 评论内容区域 -->
    <div class="form-content">
      <textarea
        v-model="form.content"
        class="textarea"
        placeholder="说点什么吧... (支持Markdown)"
        required
        maxlength="1000"
      ></textarea>
      <button type="submit" class="btn-submit" :disabled="submitting">
        {{ submitting ? '发表中...' : '发表评论' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { commentApi } from '@/api/comment'
import request from '@/utils/request'
import type { CommentCreateRequest } from '@/types'

const props = defineProps<{
  articleId: number
  parentId?: number
}>()

const emit = defineEmits<{
  commentAdded: []
}>()

const form = ref<Omit<CommentCreateRequest, 'articleId'>>({
  nickname: '',
  email: '',
  website: '', // 保留字段，但不在界面显示
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

    await commentApi.createComment({
      ...form.value,
      articleId: props.articleId,
      parentId: props.parentId
    })

    // 重置表单
    form.value = {
      nickname: form.value.nickname, // 保留昵称
      email: form.value.email, // 保留邮箱
      website: '', // 始终为空
      avatar: '',
      content: ''
    }
    avatarPreview.value = ''
    avatarFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    emit('commentAdded')
    alert('评论发表成功!')
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表评论失败,请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.comment-form {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--color-border);
}

.form-header {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

/* 头像区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.avatar-upload-label {
  cursor: pointer;
  display: block;
}

.avatar-box {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  transition: var(--transition-fast);
  overflow: hidden;
}

.avatar-box:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.avatar-hint {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-align: center;
  white-space: nowrap;
}

/* 用户信息区域 */
.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-row {
  width: 100%;
}

.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-base);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: var(--transition-fast);
  outline: none;
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

/* 评论内容区域 */
.form-content {
  position: relative;
}

.textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-base);
  padding-bottom: 50px;
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: var(--transition-fast);
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.textarea::placeholder {
  color: var(--color-text-tertiary);
}

.btn-submit {
  position: absolute;
  right: var(--spacing-base);
  bottom: var(--spacing-base);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-input {
  display: none;
}

@media (max-width: 768px) {
  .comment-form {
    padding: var(--spacing-base);
  }

  .form-header {
    grid-template-columns: 80px 1fr;
    gap: var(--spacing-base);
  }

  .avatar-box {
    width: 80px;
    height: 80px;
  }

  .textarea {
    min-height: 100px;
  }
}
</style>
