/**
 * zadmin 统一响应体。
 *
 * 后端 `ApiResult<T>`（io.github.lionheartlattice.core.entity.parent.ApiResult）：
 * - `code`    业务码，成功为 `'0000'`（字符串）
 * - `title`   响应说明（成功 `'SUCCESS'`，失败为错误描述）
 * - `message` 业务数据（**注意字段名是 message，不是 data**）
 * - `param`   额外参数
 */
export interface ApiResult<T = unknown> {
  code: string
  title: string
  message: T
  param?: unknown
}

/** 成功业务码。 */
export const API_SUCCESS_CODE = '0000'

/** 权限需刷新：收到此码应重新拉取当前用户（zadmin 自动续期约定）。 */
export const API_NEED_FLASH_CODE = 'ACCESS_NEED_FLASH'
