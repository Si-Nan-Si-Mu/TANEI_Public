<script setup>
/** 部门成员展示 | 从后端获取成员信息 | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：统一从 DepartmentMember 接口读取头像与昵称
import { onMounted, ref } from 'vue'

import { requestDepartmentMembers } from '@/api/departments'

const props = defineProps({
  department: { type: String, required: true },
  title: { type: String, default: '部门成员' },
  subtitle: { type: String, default: '' },
})

const loading = ref(false)
const members = ref([])

async function loadMembers() {
  loading.value = true
  try {
    const res = await requestDepartmentMembers(props.department)
    if (res.success && Array.isArray(res.members)) {
      members.value = res.members
    } else {
      members.value = []
    }
  } catch {
    members.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadMembers)
</script>

<template>
  <section id="members" class="section">
    <div class="container">
      <div class="section-header scroll-hidden">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="loading" class="members-hint">成员加载中...</div>
      <div v-else-if="!members.length" class="members-hint">暂无成员，等待部长审批加入。</div>
      <div v-else class="grid grid-4">
        <figure
          v-for="(member, index) in members"
          :key="member.id"
          class="member glass scroll-hidden"
          :class="index ? `delay-${index}` : ''"
        >
          <div class="avatar-box">
            <img
              class="avatar"
              :src="member.avatar || '/assets/avatar-placeholder.svg'"
              :alt="member.nickname || member.user_id"
            />
          </div>
          <figcaption>
            <strong>{{ member.nickname || '成员' }}</strong>
            <span v-if="member.is_leader">部长 / Leader</span>
            <a
              v-if="member.blog_url"
              :href="member.blog_url"
              class="btn-blog"
              target="_blank"
              rel="noopener"
            >
              <span>🔗</span> 访问博客
            </a>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.members-hint {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}
</style>

