/** 用户资料 API | 更新时间: 2025-03-09 */
const REQUEST_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { ...REQUEST_HEADERS, ...options.headers },
    credentials: 'include',
    ...options,
  })
  return response.json().catch(() => ({}))
}

/** 更新用户资料（名称） */
export function requestUpdateProfile({ name }) {
  return requestJson('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

/** 上传头像 */
export function requestUploadAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  return fetch('/api/user/profile/avatar', {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    credentials: 'include',
    body: formData,
  }).then((r) => r.json().catch(() => ({})))
}
