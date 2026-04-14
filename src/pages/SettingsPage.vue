<script setup>
/** 个人设置页 - 头像、昵称修改 | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：新增加入部门申请表（姓名、学号、邮箱、手机号）
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuthStore } from '@/stores/auth'
import { requestJoinDepartment } from '@/api/departments'

const authStore = useAuthStore()
const avatarInput = ref(null)

const navItems = computed(() => {
  const items = [
    { label: '首页', to: '/' },
    { label: '关于', href: '/#about' },
    { label: '联系', href: '/#contact' },
  ]
  if (authStore.isAuthenticated) {
    items.push({ label: '设置', to: '/settings' })
    items.push({ label: '退出', to: '/logout' })
  } else {
    items.push({ label: '登录', to: '/login' })
    items.push({ label: '注册', to: '/register' })
  }
  return items
})

const form = ref({ name: '' })
const joinForm = ref({
  department: 'tech',
  name: '',
  student_id: '',
  email: '',
  phone: '',
  reason: '',
})
const joinSubmitting = ref(false)

watch(
  () => authStore.currentUser,
  (u) => {
    form.value.name = u?.name || u?.phone || ''
    joinForm.value.name = u?.name || ''
    joinForm.value.student_id = u?.student_id || ''
    joinForm.value.phone = u?.phone || ''
  },
  { immediate: true }
)

const avatarUrl = computed(() => {
  const u = authStore.currentUser
  if (!u?.avatar) return '/assets/avatar-placeholder.svg'
  return u.avatar.startsWith('http') ? u.avatar : `/api${u.avatar}`
})

const buttonText = computed(() => (authStore.isSubmitting ? '保存中...' : '保存修改'))

function openAvatarPicker() {
  avatarInput.value?.click()
}

async function onAvatarChange(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) {
    authStore.setFeedback('请选择图片文件', 'error')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    authStore.setFeedback('图片大小不超过 2MB', 'error')
    return
  }
  await authStore.updateAvatar(file)
  e.target.value = ''
}

async function handleSubmit() {
  const name = form.value.name?.trim()
  if (!name) {
    authStore.setFeedback('请输入昵称', 'error')
    return
  }
  await authStore.updateProfile({ name })
}

async function handleJoinDepartment() {
  const payload = {
    name: (joinForm.value.name || '').trim(),
    student_id: (joinForm.value.student_id || '').trim(),
    email: (joinForm.value.email || '').trim(),
    phone: (joinForm.value.phone || '').trim(),
    reason: (joinForm.value.reason || '').trim(),
  }
  if (!payload.name || !payload.student_id || !payload.email || !payload.phone) {
    authStore.setFeedback('姓名、学号、邮箱和手机号为必填', 'error')
    return
  }
  joinSubmitting.value = true
  try {
    const res = await requestJoinDepartment(joinForm.value.department, payload)
    if (res.success) {
      authStore.setFeedback(res.message || '申请已提交，等待部长审批', 'success')
    } else {
      authStore.setFeedback(res.message || '申请提交失败', 'error')
    }
  } catch {
    authStore.setFeedback('申请提交失败，请稍后重试', 'error')
  } finally {
    joinSubmitting.value = false
  }
}

useScrollReveal()
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :nav-items="navItems" logo-suffix="TECH" />

    <main class="settings-main">
      <section class="settings-section">
        <div class="settings-wrapper glass scroll-hidden">
          <div class="settings-header">
            <h1>个人设置</h1>
            <p>管理您的头像和昵称</p>
          </div>

          <div class="settings-avatar">
            <div class="avatar-preview" @click="openAvatarPicker">
              <img :src="avatarUrl" alt="头像" class="avatar-img" />
              <span class="avatar-overlay">更换头像</span>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="avatar-input-hidden"
              @change="onAvatarChange"
            />
            <p class="avatar-hint">点击头像上传，支持 JPG/PNG，大小不超过 2MB</p>
          </div>

          <form class="settings-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder=" "
                maxlength="20"
                required
              />
              <label for="name">昵称</label>
            </div>
            <div
              v-if="authStore.feedbackText"
              class="login-message"
              :class="authStore.feedbackType"
              role="alert"
              style="display: block"
            >
              {{ authStore.feedbackText }}
            </div>
            <div class="form-actions">
              <button class="btn primary" type="submit" :disabled="authStore.isSubmitting">
                {{ buttonText }}
              </button>
            </div>
          </form>

          <div class="settings-divider" />

          <section class="settings-section-block">
            <h2>加入部门</h2>
            <p class="section-desc">选择想加入的部门，并填写基本信息，提交后由对应部长审批。</p>
            <form class="settings-form" @submit.prevent="handleJoinDepartment">
              <div class="form-group">
                <select v-model="joinForm.department">
                  <option value="tech">技术部</option>
                  <option value="network">网络部</option>
                  <option value="planning">策联部</option>
                  <option value="design">概设部</option>
                </select>
                <label>意向部门</label>
              </div>
              <div class="form-group">
                <input v-model="joinForm.name" type="text" placeholder=" " required />
                <label>姓名</label>
              </div>
              <div class="form-group">
                <input v-model="joinForm.student_id" type="text" placeholder=" " required />
                <label>学号</label>
              </div>
              <div class="form-group">
                <input v-model="joinForm.email" type="email" placeholder=" " required />
                <label>邮箱</label>
              </div>
              <div class="form-group">
                <input v-model="joinForm.phone" type="tel" placeholder=" " required />
                <label>手机号</label>
              </div>
              <div class="form-group">
                <textarea
                  v-model="joinForm.reason"
                  rows="3"
                  placeholder="简单介绍一下自己与加入意向（可选）"
                />
              </div>
              <div class="form-actions">
                <button class="btn secondary" type="submit" :disabled="joinSubmitting">
                  {{ joinSubmitting ? '提交中...' : '提交加入申请' }}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>

    <SiteFooter
      left-title="TANEI"
      left-text="个人设置"
      :links="[{ label: '返回首页', to: '/' }]"
    />
  </div>
</template>

<style scoped>
.settings-main {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px 60px;
}

.settings-section {
  width: 100%;
  max-width: 480px;
}

.settings-wrapper {
  padding: 48px 40px;
  border-radius: 24px;
  box-shadow: 0 12px 48px rgba(31, 38, 135, 0.12);
}

.settings-header {
  text-align: center;
  margin-bottom: 36px;
}

.settings-header h1 {
  font-size: 1.8rem;
  color: #0f172a;
  margin-bottom: 8px;
}

.settings-header p {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.settings-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(45deg, var(--primary), var(--accent));
  padding: 4px;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: #e4e9f2;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-input-hidden {
  display: none;
}

.avatar-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 12px;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-form .form-group input {
  width: 100%;
  padding: 16px 20px;
  font-size: 1rem;
}

.form-actions .btn {
  width: 100%;
  justify-content: center;
  padding: 16px;
}

@media (max-width: 768px) {
  .settings-wrapper {
    padding: 36px 24px;
  }
}
</style>
