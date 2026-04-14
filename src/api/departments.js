/** 部门成员与申请 API | 更新时间: 2025-03-09 */
// 2026年03月16日 更新：加入申请、成员列表与审批接口
async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'X-Requested-With': 'XMLHttpRequest', ...options.headers },
    credentials: 'include',
    ...options,
  })
  return response.json().catch(() => ({}))
}

export function requestMyDepartments() {
  return requestJson('/api/me/departments', { method: 'GET' })
}

export function requestDepartmentMembers(department) {
  return requestJson(`/api/departments/${department}/members`, { method: 'GET' })
}

export function requestJoinDepartment(department, payload) {
  return requestJson(`/api/departments/${department}/join-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  })
}

export function requestJoinRequests(department) {
  return requestJson(`/api/departments/${department}/join-requests`, { method: 'GET' })
}

export function approveJoinRequest(department, id) {
  return requestJson(`/api/departments/${department}/join-requests/${id}/approve`, {
    method: 'POST',
  })
}

export function rejectJoinRequest(department, id) {
  return requestJson(`/api/departments/${department}/join-requests/${id}/reject`, {
    method: 'POST',
  })
}

