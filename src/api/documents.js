/** 培训文档 API | 更新时间: 2025-03-09 */
async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'X-Requested-With': 'XMLHttpRequest', ...options.headers },
    credentials: 'include',
    ...options,
  })
  return response.json().catch(() => ({}))
}

/** 获取培训文档列表（所有已登录用户可访问） */
export function requestDocumentList() {
  return requestJson('/api/documents', { method: 'GET' })
}

/** 上传培训文档（仅管理员） */
export function requestUploadDocument(file, meta = {}) {
  const formData = new FormData()
  formData.append('file', file)
  if (meta.title) formData.append('title', meta.title)
  if (meta.department) formData.append('department', meta.department)
  return fetch('/api/documents', {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
    body: formData,
  }).then((r) => r.json().catch(() => ({})))
}

/** 获取文档下载地址或触发下载 */
export function getDocumentDownloadUrl(id) {
  return `/api/documents/${id}/download`
}

// 2026年03月16日 更新：文档重命名与删除接口（仅管理员）
/** 更新文档信息（仅管理员） */
export function requestUpdateDocument(id, payload) {
  return requestJson(`/api/documents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  })
}

/** 删除文档（仅管理员） */
export function requestDeleteDocument(id) {
  return requestJson(`/api/documents/${id}`, {
    method: 'DELETE',
  })
}
