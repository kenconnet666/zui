/**
 * 全局 axios 实例 —— 对接 zadmin 后端。
 *
 * 约定（来自 zadmin）：
 * - baseURL：`import.meta.env.VITE_API_BASE_URL`（dev 经 Vite proxy → http://localhost:19991/api/admin）
 * - 鉴权头：`Authorization: token:<uuid>`，token 持久化在 localStorage
 * - 统一响应体 ApiResult：成功 `code === '0000'`，业务数据在 `message` 字段
 * - 接口默认 POST
 */
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_SUCCESS_CODE, type ApiResult } from '@/types/api'

const TOKEN_KEY = 'zadmin-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** 业务错误：response 拦截器解包后 code 非成功时抛出。 */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly title: string,
    public readonly param?: unknown,
  ) {
    super(title)
    this.name = 'ApiError'
  }
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

// 请求拦截：注入 zadmin 鉴权头 `Authorization: token:<uuid>`
http.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.set('Authorization', `token:${token}`)
  return config
})

// 响应拦截：HTTP 层异常透传（401 等可在此统一处理）
http.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) clearToken()
    return Promise.reject(error)
  },
)

/**
 * 统一请求：自动解包 ApiResult，成功返回 `message`（业务数据），失败抛 {@link ApiError}。
 * zadmin 接口默认 POST，故 method 缺省为 `post`。
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<ApiResult<T>>({ method: 'post', ...config })
  const body = response.data
  if (body.code === API_SUCCESS_CODE) return body.message
  throw new ApiError(body.code, body.title, body.param)
}
