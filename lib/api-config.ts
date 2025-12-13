export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
  // Aquí puedes agregar más endpoints en el futuro
  platforms: {
    list: '/v1/secret-key/platform/',
    create: '/v1/secret-key/platform/',
    findByname: (name:string) => `/v1/secret-key/platform/name?name=${encodeURIComponent(name)}`,
    update: (id: string) => `/v1/secret-key/platform/${id}`,
    delete: (id: string) => `/v1/secret-key/platform/${id}`,
  },
};