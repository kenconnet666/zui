import { cx as emotionCx } from '@emotion/css'

/**
 * className 入参类型 — 支持 tailwind / clsx 风的灵活形态。
 *
 * - `string`：直接拼接
 * - `false` / `null` / `undefined` / `0` / `''`：忽略
 * - `Record<string, unknown>`：key 是 className，value truthy 时启用（对齐 clsx）
 * - `ClassInput[]`：嵌套数组，递归扁平
 */
export type ClassInput =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, unknown>
  | ClassInput[]

/**
 * 拼接 className，支持 tailwind 风的多形态入参（修 M5）。
 *
 * 行为：
 * - 字符串原样拼接
 * - false / null / undefined / 0 / '' 跳过
 * - 对象 `{ active: true }` → `'active'`（value truthy 时启用 key 作 class）
 * - 数组嵌套递归扁平
 *
 * 最终调用 emotion `cx`，让重复 emotion-managed className 内容合并。
 *
 * @example
 * cx('foo', false && 'bar', 'baz')           // 'foo baz'
 * cx({ active: true, disabled: false })       // 'active'
 * cx(['a', 'b', { c: true }], 'd')            // 'a b c d'
 */
export function cx(...args: ClassInput[]): string {
  const collected: string[] = []
  for (const arg of args) {
    collect(arg, collected)
  }
  return emotionCx(...collected)
}

function collect(input: ClassInput, out: string[]): void {
  if (!input) return
  if (typeof input === 'string') {
    out.push(input)
    return
  }
  if (typeof input === 'number') {
    out.push(String(input))
    return
  }
  if (Array.isArray(input)) {
    for (const item of input) collect(item, out)
    return
  }
  // 对象形：{ active: true, disabled: false }
  if (typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      if (value) out.push(key)
    }
  }
}
