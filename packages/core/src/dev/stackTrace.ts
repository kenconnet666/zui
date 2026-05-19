/**
 * Stack trace 解析工具。供 `Chain` 的 `debug: true` 选项使用。
 *
 * 跨 runtime 解析 `new Error().stack` 的首个用户代码 callsite，拼成 `filename_line` 风
 * label。生产构建（NODE_ENV === 'production'）下调用方应跳过本模块。
 *
 * 支持的 stack 格式：
 * - **V8**（Chrome / Node / Edge）：`    at functionName (file:///path/file.ts:42:10)`
 * - **SpiderMonkey**（Firefox）：`functionName@file:///path/file.ts:42:10`
 * - **JavaScriptCore**（Safari）：`functionName@file:///path/file.ts:42:10`
 * - **匿名 / arrow**：V8 用 `    at file:///path/file.ts:42:10`（无函数名）
 *
 * 输出形如 `App_42` / `Button_15`（去掉扩展名 + 路径 + 拼下划线）。
 */

const FRAMEWORK_HINTS = [
  'Chain.ts',
  'Chain.js',
  'proxy.ts',
  'proxy.js',
  'carrier.ts',
  'carrier.js',
  'createIcssInstance',
  'icss.ts',
  'icss.js',
  'stackTrace.ts',
  'stackTrace.js',
  'node_modules',
  '@kenconnet666/zui-core',
  'zui-core/dist',
] as const

/** 单行 stack 解析结果。 */
export interface StackFrame {
  /** 不含路径 / 扩展名的文件名（如 `App` / `Button`）。匿名 callsite 返回 'anonymous'。 */
  fileName: string
  /** 1-based 行号；解析失败给 0。 */
  line: number
  /** 1-based 列号；解析失败给 0。 */
  column: number
  /** 原始行文本（debug 用）。 */
  raw: string
}

/**
 * 从一行 stack frame 抽取 fileName / line / column。
 *
 * 兼容 V8 (`at fn (file:line:col)`) 和 SpiderMonkey (`fn@file:line:col`) 两种格式。
 */
export function parseStackLine(line: string): StackFrame | null {
  const raw = line.trim()
  if (!raw) return null

  // 匹配末尾的 `:LINE:COL`（可选 `)` 结尾，V8 的 `(file:line:col)` 形式）
  const m = raw.match(/(?:^|[\s@(])([^()\s@]+):(\d+):(\d+)\)?$/)
  if (!m) return null

  const pathPart = m[1]!
  const lineNo = parseInt(m[2]!, 10)
  const colNo = parseInt(m[3]!, 10)
  if (!Number.isFinite(lineNo) || !Number.isFinite(colNo)) return null

  // 取最后一段 + 去扩展名
  const segments = pathPart.split(/[\\/]/)
  const last = segments[segments.length - 1] ?? pathPart
  const fileName = last.replace(/\.[^.]+$/, '') || 'anonymous'

  return { fileName, line: lineNo, column: colNo, raw }
}

/**
 * 在 stack 行列表里找首个 **不属于 framework** 的 callsite。
 *
 * 跳过 `Chain.ts` / `proxy.ts` / `carrier.ts` / `node_modules` / `@kenconnet666` 等
 * framework 内部 frame。
 */
export function findUserCallsite(stackLines: string[]): StackFrame | null {
  for (const line of stackLines) {
    const isFramework = FRAMEWORK_HINTS.some((hint) => line.includes(hint))
    if (isFramework) continue
    const frame = parseStackLine(line)
    if (frame) return frame
  }
  return null
}

/**
 * 用当前 `new Error().stack` 抽 callsite，返回 `filename_line` label；找不到返回 null。
 *
 * 调用方应保证已在 dev 环境（`process.env.NODE_ENV !== 'production'`）才调用。
 *
 * @example
 * const label = makeCallsiteLabel(new Error().stack)
 * // → 'App_42' / 'Button_15' / null
 */
export function makeCallsiteLabel(stack: string | undefined): string | null {
  if (!stack) return null
  // V8 第一行通常是 'Error'，从第 2 行开始才是栈帧
  const lines = stack.split('\n').slice(1)
  const frame = findUserCallsite(lines)
  if (!frame) return null
  return `${frame.fileName}_${frame.line}`
}

/**
 * 判断当前是否为生产构建。`debug: true` 选项在 production 下会被忽略，避免栈泄露。
 *
 * 仅检查 `process.env.NODE_ENV`；浏览器环境下 process 通常未定义，本函数返回 false（视为 dev）。
 * 生产构建工具（Vite / Webpack / Rollup）会把 `process.env.NODE_ENV` 替换为 `"production"` 字面量。
 */
export function isProductionEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
}
