/**
 * 认证接口 —— 对接 zadmin `sys/captcha` 两步登录 + `sys/login`。
 *
 * ⚠️ 仅为对接样板：入参/返回字段以后端 `doc.html` 与 DTO 为准，后续按实际补全。
 */
import { request } from '@/utils/http'

/** 步骤 1：获取滑块验证码挑战（免鉴权）。 */
export function getCaptchaChallenge<T = unknown>() {
  return request<T>({ url: '/sys/captcha/challenge' })
}

export interface LoginParams {
  username: string
  password: string
  /** 验证码相关字段名以后端为准。 */
  [key: string]: unknown
}

/** 步骤 2：提交用户名/密码/验证码登录，返回含 token 的用户权限信息。 */
export function login<T = unknown>(data: LoginParams) {
  return request<T>({ url: '/sys/captcha/login', data })
}

/** 获取 / 刷新当前登录用户信息（收到 ACCESS_NEED_FLASH 时重调）。 */
export function getCurrentUser<T = unknown>() {
  return request<T>({ url: '/sys/login/current-user' })
}

/** 退出登录。 */
export function logout() {
  return request<void>({ url: '/sys/login/logout' })
}
