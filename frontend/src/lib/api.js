const BASE = '/api'

function getToken() {
  return localStorage.getItem('viq_token')
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let detail = 'Something went wrong'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

async function upload(path, file) {
  const form = new FormData()
  form.append('file', file)
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: form })
  if (!res.ok) {
    let detail = 'Upload failed'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),

  listCompanies: () => request('/companies'),
  createCompany: (payload) => request('/companies', { method: 'POST', body: payload }),
  getCompany: (id) => request(`/companies/${id}`),

  chatHistory: (id) => request(`/companies/${id}/chat`),
  sendChat: (id, message) => request(`/companies/${id}/chat`, { method: 'POST', body: { message } }),
  listDocuments: (id) => request(`/companies/${id}/documents`),
  uploadDocument: (id, file) => upload(`/companies/${id}/documents`, file),

  analyzeMarket: (id, focus) => request(`/companies/${id}/market/analyze`, { method: 'POST', body: { focus } }),

  listDatasets: (id) => request(`/companies/${id}/data`),
  getDataset: (id, datasetId) => request(`/companies/${id}/data/${datasetId}`),
  uploadDataset: (id, file) => upload(`/companies/${id}/data/upload`, file),

  growthSuggestions: (id) => request(`/companies/${id}/growth/suggestions`),
}

export { getToken }
