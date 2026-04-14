<script setup>
/** 技术部 - 含 TrainingDocs | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：接入动态成员与部长审批面板
import DepartmentPageShell from './DepartmentPageShell.vue'
import TrainingDocs from '@/components/TrainingDocs.vue'
import DepartmentMembers from '@/components/DepartmentMembers.vue'
import DepartmentAdminPanel from '@/components/DepartmentAdminPanel.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'

const navItems = useAppNavItems([
  { label: '首页', to: '/' },
  { label: '极客', href: '#members' },
  { label: '算法库', href: '#training' },
  { label: '项目', href: '#training' },
])
</script>

<template>
  <DepartmentPageShell
    logo-suffix="DEV"
    :nav-items="navItems"
    hero-class="hero-tec"
    badge="技术部"
    title-html="以逻辑<br>重构<span class='highlight'>世界</span>"
    lead="汇聚全栈开发、算法竞赛与黑客马拉松爱好者的核心引擎。"
    footer-text="© 2024 Technical Dept."
  >
    <DepartmentMembers
      department="tech"
      title="Code Masters"
      subtitle="Talk is cheap, show me the code."
    />

    <section id="training" class="section">
      <div class="container">
        <div class="section-header scroll-hidden">
          <h2>技术沉淀</h2>
          <p>Algorithm & Architecture</p>
        </div>
        <div class="glass card scroll-hidden">
          <TrainingDocs department="tech" />
        </div>
        <DepartmentAdminPanel department="tech" />
      </div>
    </section>
  </DepartmentPageShell>
</template>
