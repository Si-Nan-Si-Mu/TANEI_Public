<script setup>
/** 网络部 - 含 TrainingDocs | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：接入动态成员与部长审批面板
import DepartmentPageShell from './DepartmentPageShell.vue'
import TrainingDocs from '@/components/TrainingDocs.vue'
import DepartmentMembers from '@/components/DepartmentMembers.vue'
import DepartmentAdminPanel from '@/components/DepartmentAdminPanel.vue'
import { useAppNavItems } from '@/composables/useAppNavItems'

const navItems = useAppNavItems([
  { label: '首页', to: '/' },
  { label: '成员', href: '#members' },
  { label: '培训', href: '#training' },
  { label: 'Wiki', href: '#training' },
  {
    label: '师训系统',
    href: '/source/TN_web/teacher-training-agent/dist/index.html',
    target: '_blank',
    rel: 'noopener',
  },
])
</script>

<template>
  <DepartmentPageShell
    logo-suffix="NET"
    :nav-items="navItems"
    hero-class="hero-net"
    badge="网络部"
    title-html="连接万物<br>构建<span class='highlight'>基石</span>"
    lead="负责社团网络基础设施运维、服务器管理以及网络安全技术研究。"
    footer-text="© 2024 Network Dept."
  >
    <DepartmentMembers
      department="network"
      title="部门成员"
      subtitle="点击下方按钮访问成员个人技术博客"
    />

    <section id="training" class="section">
      <div class="container">
        <div class="section-header scroll-hidden">
          <h2>内部培训</h2>
          <p>Knowledge Sharing & Resources</p>
        </div>

        <div class="glass card scroll-hidden">
          <TrainingDocs department="network" />
        </div>
        <DepartmentAdminPanel department="network" />
      </div>
    </section>
  </DepartmentPageShell>
</template>
