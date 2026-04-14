<script setup>
/** 登录页 - 支持 redirect 参数 | 更新时间: 2025-03-09 */
import { computed, reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: '首页', to: '/' },
  { label: '关于', href: '/#about' },
  { label: '联系', href: '/#contact' },
]

const form = reactive({
  account: '',
  password: '',
  remember: false,
})

const buttonText = computed(() => (authStore.isSubmitting ? '登录中...' : '登 录'))
const fullDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

async function handleLogin() {
  if (!form.account.trim() || !form.password) {
    authStore.setFeedback('请输入手机号或学号和密码', 'error')
    return
  }

  const result = await authStore.login({
    account: form.account.trim(),
    password: form.password,
  })

  if (result.success) {
    const redirect = result.redirect || route.query.redirect || '/'
    setTimeout(() => {
      router.push(redirect)
    }, 800)
  }
}

useScrollReveal()
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :nav-items="navItems" logo-suffix="TECH" />

    <main class="login-main">
      <section class="login-section">
        <div class="login-wrapper glass scroll-hidden">
          <div class="login-header">
            <h1>用户登录</h1>
            <p>保护您的账号信息</p>
          </div>
          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <input
                id="account"
                v-model="form.account"
                type="text"
                name="account"
                placeholder=" "
                required
                autocomplete="username"
              />
              <label for="account">手机号或学号</label>
            </div>
            <div class="form-group">
              <input
                id="password"
                v-model="form.password"
                type="password"
                name="password"
                placeholder=" "
                required
                autocomplete="current-password"
              />
              <label for="password">密码</label>
            </div>
            <div class="form-options">
              <label class="checkbox-wrap">
                <input v-model="form.remember" type="checkbox" name="remember" />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-link">忘记密码？</a>
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
              <button id="login-btn" class="btn primary" type="submit" :disabled="authStore.isSubmitting">
                {{ buttonText }}
              </button>
            </div>
          </form>
          <p class="login-footer">
            还没有账号？<RouterLink to="/register">立即注册</RouterLink>
          </p>
        </div>
      </section>
    </main>

    <SiteFooter left-title="TANEI" :left-text="fullDate" :links="[{ label: '返回首页', to: '/' }]" />
  </div>
</template>
