<script setup>
/** 策联部 - 含 TrainingDocs | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：接入动态成员与部长审批面板
import DepartmentPageShell from './DepartmentPageShell.vue'
import TrainingDocs from '@/components/TrainingDocs.vue'
import DepartmentMembers from '@/components/DepartmentMembers.vue'
import DepartmentAdminPanel from '@/components/DepartmentAdminPanel.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'

const navItems = useAppNavItems([
  { label: '首页', to: '/' },
  { label: '策划人', href: '#members' },
  { label: '资源库', href: '#resources' },
])
</script>

<template>
  <DepartmentPageShell
    logo-suffix="PLAN"
    :nav-items="navItems"
    hero-class="hero-sal"
    badge="策联部"
    title-html="让灵感<br>落地<span class='highlight'>生根</span>"
    lead="连接内外的桥梁，负责活动策划、外联赞助与社团品牌建设。"
    footer-text="© 2024 Planning Dept."
  >
    <DepartmentMembers
      department="planning"
      title="Brainstormers"
      subtitle="创意与执行的完美结合"
    />

    <section id="resources" class="section">
      <div class="container">
        <div class="section-header scroll-hidden">
          <h2>策划锦囊</h2>
          <p>Events & Sponsorship</p>
        </div>
        <div class="glass card scroll-hidden">
          <TrainingDocs department="planning" />
        </div>
        <DepartmentAdminPanel department="planning" />
      </div>
    </section>
  </DepartmentPageShell>
</template>
