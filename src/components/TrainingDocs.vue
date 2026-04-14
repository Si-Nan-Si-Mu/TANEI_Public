<script setup>
/** 培训文档 - 管理员上传/用户下载 | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：支持管理员重命名与删除文档
import { computed, ref, watch } from 'vue'

import {
  requestDocumentList,
  requestUploadDocument,
  requestUpdateDocument,
  requestDeleteDocument,
  getDocumentDownloadUrl,
} from '@/api/documents'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  /** 部门标识，用于区分不同部门的文档 */
  department: { type: String, default: 'tech' },
})

const authStore = useAuthStore()
const fileInput = ref(null)
const docs = ref([])
const loading = ref(false)
const uploadTitle = ref('')
const uploadFile = ref(null)
const uploadProgress = ref(false)
const uploadError = ref('')
const editDocId = ref(null)
const editTitle = ref('')
const editError = ref('')

const isAdmin = computed(() => authStore.isAdmin)
const isAuthenticated = computed(() => authStore.isAuthenticated)

async function loadDocs() {
  if (!authStore.isAuthenticated) {
    docs.value = []
    return
  }
  loading.value = true
  try {
    const res = await requestDocumentList()
    if (res.success && Array.isArray(res.documents)) {
      docs.value = res.documents
    } else {
      docs.value = []
    }
  } catch {
    docs.value = []
  } finally {
    loading.value = false
  }
}

watch(
  () => authStore.isAuthenticated,
  (v) => v && loadDocs(),
  { immediate: true }
)

function onFileChange(e) {
  const file = e.target.files?.[0]
  uploadFile.value = file || null
  uploadError.value = ''
}

async function handleUpload() {
  if (!uploadFile.value) {
    uploadError.value = '请选择文件'
    return
  }
  uploadProgress.value = true
  uploadError.value = ''
  try {
    const res = await requestUploadDocument(uploadFile.value, {
      title: uploadTitle.value || uploadFile.value.name,
      department: props.department,
    })
if (res.success) {
      uploadTitle.value = ''
      uploadFile.value = null
      if (fileInput.value) fileInput.value.value = ''
      await loadDocs()
    } else {
      uploadError.value = res.message || '上传失败'
    }
  } catch {
    uploadError.value = '上传失败，请稍后重试'
  } finally {
    uploadProgress.value = false
  }
}

function startEdit(doc) {
  editDocId.value = doc.id
  editTitle.value = doc.title || doc.filename
  editError.value = ''
}

function cancelEdit() {
  editDocId.value = null
  editTitle.value = ''
  editError.value = ''
}

async function handleEditSave() {
  if (!editDocId.value) return
  const title = (editTitle.value || '').trim()
  if (!title) {
    editError.value = '标题不能为空'
    return
  }
  try {
    const res = await requestUpdateDocument(editDocId.value, { title })
    if (res.success && res.document) {
      const idx = docs.value.findIndex((d) => d.id === editDocId.value)
      if (idx !== -1) {
        docs.value[idx] = res.document
      }
      cancelEdit()
    } else {
      editError.value = res.message || '更新失败'
    }
  } catch {
    editError.value = '更新失败，请稍后重试'
  }
}

async function handleDelete(doc) {
  if (!window.confirm(`确定要删除「${doc.title || doc.filename}」吗？删除后无法恢复。`)) {
    return
  }
  try {
    const res = await requestDeleteDocument(doc.id)
    if (res.success) {
      docs.value = docs.value.filter((d) => d.id !== doc.id)
    } else {
      window.alert(res.message || '删除失败')
    }
  } catch {
    window.alert('删除失败，请稍后重试')
  }
}

function downloadUrl(id) {
  return getDocumentDownloadUrl(id)
}
</script>

<template>
  <div class="training-docs" :class="{ 'has-upload': isAdmin }">
    <div v-if="!isAuthenticated" class="training-docs-guest">
      <p>登录后即可查看和下载培训文档</p>
    </div>

    <template v-else>
      <div class="training-docs-list">
        <h3>📂 培训文档</h3>
        <div v-if="loading" class="training-docs-loading">加载中...</div>
        <div v-else-if="docs.length === 0" class="training-docs-empty">
          暂无文档，{{ isAdmin ? '管理员可上传' : '敬请期待' }}
        </div>
        <div v-else class="resource-list">
          <div v-for="doc in docs" :key="doc.id" class="resource-item glass">
            <div class="res-info">
              <template v-if="editDocId === doc.id">
                <input
                  v-model="editTitle"
                  type="text"
                  class="edit-title-input"
                  placeholder="文档标题"
                />
                <p v-if="editError" class="edit-error">{{ editError }}</p>
              </template>
              <template v-else>
                <h4>{{ doc.title || doc.filename }}</h4>
                <span>{{ doc.description || doc.created_at || '' }}</span>
              </template>
            </div>
            <div class="res-actions">
              <a
                :href="downloadUrl(doc.id)"
                class="btn ghost"
                target="_blank"
                rel="noopener"
                download
              >
                下载
              </a>
              <template v-if="isAdmin">
                <button
                  v-if="editDocId !== doc.id"
                  type="button"
                  class="btn text-only"
                  @click="startEdit(doc)"
                >
                  重命名
                </button>
                <button
                  v-else
                  type="button"
                  class="btn text-only"
                  @click="handleEditSave"
                >
                  保存
                </button>
                <button
                  v-if="editDocId === doc.id"
                  type="button"
                  class="btn text-only danger"
                  @click="cancelEdit"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="btn text-only danger"
                  @click="handleDelete(doc)"
                >
                  删除
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="training-docs-upload">
        <h3>📤 上传文档</h3>
        <p class="notice-inline">仅管理员可上传培训文档</p>
        <form class="upload-form" @submit.prevent="handleUpload">
          <div class="form-group">
            <input
              v-model="uploadTitle"
              type="text"
              placeholder="文档标题（可选）"
              class="upload-title-input"
            />
          </div>
          <div class="upload-zone" @click="fileInput?.click()">
            <input
              id="training-doc-input"
              ref="fileInput"
              type="file"
              class="avatar-input-hidden"
              @change="onFileChange"
            />
            <span class="upload-icon">💾</span>
            <h4>{{ uploadFile ? uploadFile.name : '点击或拖拽文件上传' }}</h4>
            <p style="font-size: 0.8rem; color: #999">.pdf, .zip, .doc, .pptx</p>
          </div>
          <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
          <div class="form-actions">
            <button class="btn primary" type="submit" :disabled="uploadProgress || !uploadFile">
              {{ uploadProgress ? '上传中...' : '上传' }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<style scoped>
.training-docs {
  display: grid;
  gap: 24px;
}

@media (min-width: 769px) {
  .training-docs.has-upload {
    grid-template-columns: 1fr 1fr;
  }
}

.training-docs-guest {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

.training-docs-list h3,
.training-docs-upload h3 {
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.training-docs-loading,
.training-docs-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}

.res-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-title-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
}

.edit-error {
  margin-top: 4px;
  font-size: 0.8rem;
  color: #dc2626;
}

.btn.text-only {
  border: none;
  background: transparent;
  padding: 4px 6px;
  font-size: 0.8rem;
  color: var(--primary);
  cursor: pointer;
}

.btn.text-only.danger {
  color: #dc2626;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-title-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 0.95rem;
}

.upload-error {
  font-size: 0.9rem;
  color: #dc2626;
}

.avatar-input-hidden {
  display: none;
}
</style>
