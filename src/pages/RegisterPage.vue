<script setup>
import { computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { label: '首页', to: '/' },
  { label: '关于', href: '/#about' },
  { label: '联系', href: '/#contact' },
  { label: '登录', to: '/login' },
]

const form = reactive({
  phone: '',
  studentId: '',
  password: '',
  passwordConfirm: '',
  agree: false,
})

const phonePattern = /^\d{11}$/

const buttonText = computed(() => (authStore.isSubmitting ? '注册中...' : '注 册'))
const fullDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

async function handleRegister() {
  const phone = form.phone.trim()
  const studentId = form.studentId.trim()

  if (!phone || !studentId || !form.password) {
    authStore.setFeedback('请填写完整信息', 'error')
    return
  }

  if (!phonePattern.test(phone)) {
    authStore.setFeedback('请输入 11 位手机号', 'error')
    return
  }

  if (form.password.length < 6) {
    authStore.setFeedback('密码至少需要 6 位', 'error')
    return
  }

  if (form.password !== form.passwordConfirm) {
    authStore.setFeedback('两次输入的密码不一致', 'error')
    return
  }

  if (!form.agree) {
    authStore.setFeedback('请先阅读并同意用户协议', 'error')
    return
  }

  const result = await authStore.register({
    phone,
    studentId,
    password: form.password,
  })

  if (result.success) {
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  }
}

useScrollReveal()
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :nav-items="navItems" logo-suffix="TECH" />

    <main class="login-main">
      <section class="login-section">
        <div class="login-wrapper glass scroll-hidden register-wrapper">
          <div class="login-header">
            <h1>用户注册</h1>
            <p>加入 TANEI，开启你的技术之旅</p>
          </div>
          <form class="login-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                name="phone"
                placeholder=" "
                required
                autocomplete="tel"
                inputmode="numeric"
                maxlength="11"
              />
              <label for="phone">手机号</label>
            </div>
            <div class="form-group">
              <input
                id="student-id"
                v-model="form.studentId"
                type="text"
                name="student_id"
                placeholder=" "
                required
                autocomplete="off"
              />
              <label for="student-id">学号</label>
            </div>
            <div class="form-group">
              <input
                id="password"
                v-model="form.password"
                type="password"
                name="password"
                placeholder=" "
                required
                autocomplete="new-password"
                minlength="6"
              />
              <label for="password">密码（至少 6 位）</label>
            </div>
            <div class="form-group">
              <input
                id="password-confirm"
                v-model="form.passwordConfirm"
                type="password"
                name="password_confirm"
                placeholder=" "
                required
                autocomplete="new-password"
              />
              <label for="password-confirm">确认密码</label>
            </div>
            <div class="form-options">
              <label class="checkbox-wrap">
                <input v-model="form.agree" type="checkbox" name="agree" />
                <span>我已阅读并同意<RouterLink to="/agreement" target="_blank">用户协议</RouterLink></span>
              </label>
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
              <button id="register-btn" class="btn primary" type="submit" :disabled="authStore.isSubmitting">
                {{ buttonText }}
              </button>
            </div>
          </form>
          <p class="login-footer">
            已有账号？<RouterLink to="/login">立即登录</RouterLink>
          </p>
        </div>
      </section>
    </main>

    <SiteFooter left-title="TANEI" :left-text="fullDate" :links="[{ label: '返回首页', to: '/' }]" />
  </div>
</template>
