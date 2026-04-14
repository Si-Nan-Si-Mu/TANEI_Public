<script setup>
/** 部长审批面板 | 查看与审批加入申请 | 2026年03月16日 更新 */
import { computed, onMounted, ref } from 'vue'

import { approveJoinRequest, rejectJoinRequest, requestJoinRequests } from '@/api/departments'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  department: { type: String, required: true },
})

const authStore = useAuthStore()
const loading = ref(false)
const requests = ref([])
const error = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)

async function loadRequests() {
  if (!isAuthenticated.value) {
    requests.value = []
    error.value = '请先登录'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await requestJoinRequests(props.department)
    if (res.success) {
      requests.value = res.requests || []
    } else {
      requests.value = []
      error.value = res.message || '仅本部门部长或管理员可查看申请'
    }
  } catch {
    requests.value = []
    error.value = '申请列表加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

async function handleApprove(item) {
  if (!window.confirm(`确定通过 ${item.name} 的申请吗？`)) return
  try {
    const res = await approveJoinRequest(props.department, item.id)
    if (res.success) {
      await loadRequests()
    } else {
      window.alert(res.message || '审批失败')
    }
  } catch {
    window.alert('审批失败，请稍后重试')
  }
}

async function handleReject(item) {
  if (!window.confirm(`确定拒绝 ${item.name} 的申请吗？`)) return
  try {
    const res = await rejectJoinRequest(props.department, item.id)
    if (res.success) {
      await loadRequests()
    } else {
      window.alert(res.message || '操作失败')
    }
  } catch {
    window.alert('操作失败，请稍后重试')
  }
}

onMounted(loadRequests)
</script>

<template>
  <section class="section admin-panel">
    <div class="container">
      <div class="section-header scroll-hidden">
        <h2>部门加入申请（仅部长可见）</h2>
        <p>查看并审批成员的加入申请。</p>
      </div>

      <div v-if="loading" class="admin-hint">加载中...</div>
      <div v-else-if="error" class="admin-hint">{{ error }}</div>
      <div v-else-if="!requests.length" class="admin-hint">当前暂无加入申请。</div>
      <div v-else class="admin-list glass scroll-hidden">
        <div v-for="item in requests" :key="item.id" class="admin-item">
          <div class="admin-main">
            <div class="admin-line">
              <strong>{{ item.name }}</strong>
              <span class="badge">{{ item.department }}</span>
              <span class="status" :class="item.status">{{ item.status }}</span>
            </div>
            <div class="admin-line muted">
              学号：{{ item.student_id }} · 邮箱：{{ item.email }} · 手机：{{ item.phone }}
            </div>
            <div v-if="item.reason" class="admin-line reason">
              申请理由：{{ item.reason }}
            </div>
            <div class="admin-line time">
              提交时间：{{ item.created_at }}
            </div>
          </div>
          <div class="admin-actions" v-if="item.status === 'pending'">
            <button type="button" class="btn small primary" @click="handleApprove(item)">通过</button>
            <button type="button" class="btn small ghost danger" @click="handleReject(item)">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-panel {
  margin-top: 24px;
}

.admin-hint {
  padding: 16px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.admin-list {
  margin-top: 12px;
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.admin-item:last-child {
  border-bottom: none;
}

.admin-main {
  flex: 1;
  min-width: 0;
}

.admin-line {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 0.9rem;
}

.admin-line.muted {
  color: var(--text-muted);
}

.admin-line.reason {
  margin-top: 4px;
}

.admin-line.time {
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.badge {
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  font-size: 0.75rem;
}

.status {
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 999px;
  text-transform: uppercase;
}

.status.pending {
  background: rgba(234, 179, 8, 0.1);
  color: #92400e;
}

.status.approved {
  background: rgba(22, 163, 74, 0.1);
  color: #166534;
}

.status.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn.small {
  padding: 6px 10px;
  font-size: 0.8rem;
}

.btn.ghost.danger {
  color: #b91c1c;
  border-color: rgba(239, 68, 68, 0.4);
}

@media (max-width: 640px) {
  .admin-item {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>

