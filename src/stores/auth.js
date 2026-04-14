/**
 * 认证状态管理 - 含权限、资料更新 | 更新时间: 2025-03-09
 */
import { defineStore } from 'pinia'

import {
  normalizeServerRedirect,
  requestCurrentUser,
  requestLogin,
  requestLogout,
  requestRegister,
} from '@/api/auth'
import { requestUpdateProfile, requestUploadAvatar } from '@/api/profile'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isSubmitting: false,
    isHydratingSession: false,
    currentUser: null,
    feedbackText: '',
    feedbackType: 'info',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    isAdmin: (state) => state.currentUser?.role === 'admin',
    userName: (state) => state.currentUser?.name || state.currentUser?.phone || '用户',
  },
  actions: {
    clearFeedback() {
      this.feedbackText = ''
      this.feedbackType = 'info'
    },
    setCurrentUser(user) {
      this.currentUser = user || null
    },
    setFeedback(text, type = 'info') {
      this.feedbackText = text
      this.feedbackType = type
    },
    async hydrateSession() {
      this.isHydratingSession = true

      try {
        const data = await requestCurrentUser()
        if (data.success && data.user) {
          this.setCurrentUser(data.user)
          return true
        }

        this.setCurrentUser(null)
        return false
      } catch {
        this.setCurrentUser(null)
        return false
      } finally {
        this.isHydratingSession = false
      }
    },
    async login(credentials) {
      this.isSubmitting = true
      this.clearFeedback()

      try {
        const data = await requestLogin(credentials)
        if (data.success) {
          this.setCurrentUser(data.user || null)
          if (!data.user) {
            await this.hydrateSession()
          }
          this.setFeedback('登录成功，正在跳转...', 'success')
          return {
            success: true,
            redirect: normalizeServerRedirect(data.redirect),
          }
        }

        this.setFeedback(data.message || '登录失败，请检查手机号或学号和密码', 'error')
        return { success: false }
      } catch {
        this.setFeedback('认证服务暂时不可用，请稍后再试', 'error')
        return { success: false }
      } finally {
        this.isSubmitting = false
      }
    },
    async register(payload) {
      this.isSubmitting = true
      this.clearFeedback()

      try {
        const data = await requestRegister(payload)
        if (data.success) {
          this.setFeedback('注册成功，正在跳转到登录...', 'success')
          return { success: true }
        }

        this.setFeedback(data.message || '注册失败，请稍后重试', 'error')
        return { success: false }
      } catch {
        this.setFeedback('认证服务暂时不可用，请稍后再试', 'error')
        return { success: false }
      } finally {
        this.isSubmitting = false
      }
    },
    async logout() {
      this.isSubmitting = true

      try {
        await requestLogout()
      } finally {
        this.setCurrentUser(null)
        this.clearFeedback()
        this.isSubmitting = false
      }
    },
    async updateProfile({ name }) {
      this.isSubmitting = true
      this.clearFeedback()
      try {
        const data = await requestUpdateProfile({ name })
        if (data.success && data.user) {
          this.setCurrentUser(data.user)
          this.setFeedback('资料已更新', 'success')
          return true
        }
        this.setFeedback(data.message || '更新失败', 'error')
        return false
      } catch {
        this.setFeedback('服务暂时不可用', 'error')
        return false
      } finally {
        this.isSubmitting = false
      }
    },
    async updateAvatar(file) {
      this.isSubmitting = true
      this.clearFeedback()
      try {
        const data = await requestUploadAvatar(file)
        if (data.success && data.user) {
          this.setCurrentUser(data.user)
          this.setFeedback('头像已更新', 'success')
          return true
        }
        this.setFeedback(data.message || '头像上传失败', 'error')
        return false
      } catch {
        this.setFeedback('服务暂时不可用', 'error')
        return false
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
