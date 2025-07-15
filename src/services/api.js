import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cyberlab-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Protocol endpoints
export const getProtocols = (params) => api.get('/protocols', { params })
export const getProtocolById = (id) => api.get(`/protocols/${id}`)
export const createProtocol = (data) => api.post('/protocols', data)
export const updateProtocol = (id, data) => api.put(`/protocols/${id}`, data)
export const deleteProtocol = (id) => api.delete(`/protocols/${id}`)

// Architecture endpoints
export const getArchitectures = (params) => api.get('/architectures', { params })
export const getArchitectureById = (id) => api.get(`/architectures/${id}`)
export const createArchitecture = (data) => api.post('/architectures', data)
export const updateArchitecture = (id, data) => api.put(`/architectures/${id}`, data)
export const deleteArchitecture = (id) => api.delete(`/architectures/${id}`)

// Scenario endpoints
export const getScenarios = (params) => api.get('/scenarios', { params })
export const getScenarioById = (id) => api.get(`/scenarios/${id}`)
export const createScenario = (data) => api.post('/scenarios', data)
export const updateScenario = (id, data) => api.put(`/scenarios/${id}`, data)
export const deleteScenario = (id) => api.delete(`/scenarios/${id}`)

// Deployment endpoints
export const getDeployments = (params) => api.get('/deployments', { params })
export const getDeploymentById = (id) => api.get(`/deployments/${id}`)
export const createDeployment = (data) => api.post('/deployments', data)
export const stopDeployment = (id) => api.post(`/deployments/${id}/stop`)
export const getDeploymentLogs = (id) => api.get(`/deployments/${id}/logs`)

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials)
export const register = (userData) => api.post('/auth/register', userData)
export const getMe = () => api.get('/auth/me')

// YAML processing endpoint
export const processYaml = (yamlString) =>
  api.post('/yaml', yamlString, {
    headers: { 'Content-Type': 'application/yaml' }
  })

export default api