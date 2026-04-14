import { JSEncrypt } from 'jsencrypt'

import publicKey from '../../assets/public.pem?raw'

const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

function encryptPayload(payload) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey.trim())
  const timestamp = Date.now().toString()

  const encrypted = encryptor.encrypt(JSON.stringify(payload))
  if (!encrypted) {
    throw new Error('RSA_ENCRYPT_FAILED')
  }

  return {
    data: encrypted,
    timestamp,
  }
}

async function postEncrypted(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: REQUEST_HEADERS,
    credentials: 'include',
    body: JSON.stringify(encryptPayload(payload)),
  })

  return response.json().catch(() => ({}))
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: REQUEST_HEADERS,
    credentials: 'include',
    ...options,
  })

  return response.json().catch(() => ({}))
}

export function requestLogin({ account, password }) {
  return postEncrypted('/api/user/login', {
    account,
    password,
  })
}

export function requestRegister({ phone, studentId, password }) {
  return postEncrypted('/api/user/register', {
    phone,
    student_id: studentId,
    password,
  })
}

export function requestCurrentUser() {
  return requestJson('/api/auth/me', {
    method: 'GET',
  })
}

export function requestLogout() {
  return requestJson('/api/user/logout', {
    method: 'POST',
  })
}

export function normalizeServerRedirect(redirect) {
  if (!redirect || redirect === 'index.html' || redirect === '/index.html') {
    return '/'
  }

  return redirect
}
