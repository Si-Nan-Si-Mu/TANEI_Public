<script setup>
/** 首页 - 含 useAppNavItems | 更新时间: 2025-03-09 */
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import SiteFooter from '@/components/layout/SiteFooter.vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import DepartmentSidebar from '@/components/layout/DepartmentSidebar.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'
import { useHomeScrollSpy } from '@/composables/useHomeScrollSpy'
import { useScrollReveal } from '@/composables/useScrollReveal'

const navItems = useAppNavItems([
  { label: '关于', href: '#about' },
  { label: '活动', href: '#activities' },
  { label: '成员', href: '#members' },
  { label: '联系', href: '#contact' },
])

const form = ref({
  name: '',
  email: '',
})

const members = [
  {
    name: 'RyoD',
    title: '塔内协会·会长',
    avatar: '/assets/RyoD.jpg',
    alt: 'RyoD',
  },
  {
    name: '林轩',
    title: '塔内协会·副会长',
    avatar: '/assets/avatar-placeholder.svg',
    alt: '司南',
  },
  {
    name: '熬不了夜哥',
    title: '塔内协会·副会长',
    avatar: '/assets/aobuliaoyege.jpg',
    alt: 'Linus',
  },
  {
    name: '赵同学',
    title: '塔内协会·副会长',
    avatar: '/assets/avatar-placeholder.svg',
    alt: '赵同学',
  },
]

const footerDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function handleSubmit() {
  console.log('表单数据:', { ...form.value })
}

useScrollReveal()
useHomeScrollSpy()
</script>

<template>
  <div class="full-height-layout">
    <SiteHeader :nav-items="navItems" logo-suffix="TECH" />

    <main>
      <section id="about" class="hero">
        <div class="container hero-inner scroll-hidden">
          <a class="hero-scol-link" href="https://www.scnu.edu.cn/" target="_blank" rel="noopener">
            <span class="hero-scol-label">官网</span>
            <span class="hero-scol-name">华南师范大学</span>
            <span class="hero-scol-icon" aria-hidden="true">→</span>
          </a>
          <h1><span class="highlight">塔内·</span>用代码<br />编织<span class="highlight">未来</span></h1>
          <p class="lead">专注项目实践、技术分享与友好协作的极客社区。</p>
          <div class="hero-cta">
            <RouterLink class="btn primary" to="/register">加入我们</RouterLink>
            <RouterLink class="btn ghost" to="/login">成员登录</RouterLink>
          </div>
        </div>
      </section>

      <DepartmentSidebar />

      <section id="activities" class="section">
        <div class="container">
          <div class="section-header scroll-hidden">
            <h2>探索与创造</h2>
            <p>我们在做什么</p>
          </div>
          <div class="grid grid-3">
            <article class="card glass scroll-hidden delay-1">
              <div class="card-icon">🚀</div>
              <h3>项目实战</h3>
              <p>拒绝纸上谈兵。从需求分析到上线部署，体验完整的全栈开发流程。</p>
            </article>
            <article class="card glass scroll-hidden delay-2">
              <div class="card-icon">💡</div>
              <h3>技术工作坊</h3>
              <p>涵盖机器学习、云原生、前端工程化等前沿领域的短期密集特训。</p>
            </article>
            <article class="card glass scroll-hidden delay-3">
              <div class="card-icon">🎤</div>
              <h3>灵感分享</h3>
              <p>定期举办 Tech Talk，分享踩坑经验、面试技巧与黑科技。</p>
            </article>
          </div>
        </div>
      </section>

      <section id="members" class="section">
        <div class="container">
          <div class="section-header scroll-hidden">
            <h2>核心成员</h2>
            <p>你可以认识这些有趣的灵魂</p>
          </div>
          <div class="grid grid-4">
            <figure
              v-for="(member, index) in members"
              :key="member.name"
              class="member glass scroll-hidden"
              :class="index ? `delay-${index}` : ''"
            >
              <div class="avatar-box">
                <img class="avatar" :src="member.avatar" :alt="member.alt" />
              </div>
              <figcaption>
                <strong>{{ member.name }}</strong>
                <span>{{ member.title }}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="contact" class="section">
        <div class="container scroll-hidden">
          <div class="contact-wrapper glass">
            <div class="contact-text">
              <h2>保持联系</h2>
              <p>无论你是技术大牛还是萌新，TANEI 都欢迎你的加入。</p>
            </div>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <input id="name" v-model="form.name" type="text" placeholder=" " required />
                <label for="name">你的名字</label>
              </div>
              <div class="form-group">
                <input id="email" v-model="form.email" type="email" placeholder=" " required />
                <label for="email">电子邮箱</label>
              </div>
              <div class="form-actions">
                <button class="btn primary" type="submit">发送</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter
      left-title="TANEI"
      :left-text="footerDate"
      :links="[
        { label: 'GitHub', href: 'https://github.com/Si-Nan-Si-Mu/TANEI_Public', target: '_blank', rel: 'noopener' },
        { label: 'Bilibili', href: '#' },
        { label: 'Email Us', href: 'mailto:contact@example.com' },
      ]"
    />
  </div>
</template>
