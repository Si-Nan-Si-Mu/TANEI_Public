<script setup>
/** 概设部 - 含 TrainingDocs | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：接入动态成员与部长审批面板
import DepartmentPageShell from './DepartmentPageShell.vue'
import TrainingDocs from '@/components/TrainingDocs.vue'
import DepartmentMembers from '@/components/DepartmentMembers.vue'
import DepartmentAdminPanel from '@/components/DepartmentAdminPanel.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'

const navItems = useAppNavItems([
  { label: '首页', to: '/' },
  { label: '设计师', href: '#members' },
  { label: '素材库', href: '#resources' },
])

const resources = [
  { title: '社团 VI 视觉识别系统规范', meta: 'Owner: Una | PDF' },
  { title: '通用海报模板 (PSD)', meta: 'Owner: Vincent | 500MB' },
]
</script>

<template>
  <DepartmentPageShell
    logo-suffix="ART"
    :nav-items="navItems"
    hero-class="hero-des"
    badge="概设部"
    title-html="定义<br>视觉<span class='highlight'>美学</span>"
    lead="负责 UI/UX 设计、海报绘制与视觉传达，用色彩点亮创意。"
    footer-text="© 2024 Design Dept."
  >
    <DepartmentMembers department="design" title="Artists" subtitle="Pixel & Vector" />

    <section id="resources" class="section">
      <div class="container">
        <div class="section-header scroll-hidden">
          <h2>设计资源</h2>
          <p>Tutorials & Assets</p>
        </div>
        <div class="grid grid-3">
          <div class="glass card tutorial-card scroll-hidden">
            <div class="card-icon" style="background: rgba(255, 255, 255, 0.5)">🎨</div>
            <h3>在线教程系统</h3>
            <p>包含 PS 基础、PR 剪辑与秀米排版等完整课程。</p>
            <a href="/source/TN_des/index.html" class="btn primary" style="margin-top: auto">进入学习 →</a>
          </div>

          <div class="glass card scroll-hidden delay-1" style="grid-column: span 2">
            <TrainingDocs department="design" />
            <div class="resource-list" style="margin-top: 20px">
              <div v-for="resource in resources" :key="resource.title" class="resource-item glass">
                <div class="res-info">
                  <h4>{{ resource.title }}</h4>
                  <span>{{ resource.meta }}</span>
                </div>
                <a href="#" class="btn ghost">下载</a>
              </div>
            </div>
            <DepartmentAdminPanel department="design" />
          </div>
        </div>
      </div>
    </section>
  </DepartmentPageShell>
</template>
