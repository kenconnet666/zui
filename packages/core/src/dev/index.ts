/**
 * `@kenconnet666/zui-core/dev` — 开发态工具 subpath 入口。
 *
 * 含：
 * - `assertSchemaConsistency`：校验 schema 一致性（必填语义色 / 保留字 / function token 闭环）
 * - `makeCallsiteLabel` / `parseStackLine` / `findUserCallsite`：跨 runtime stack 解析
 * - `isProductionEnv`：检测 production 构建
 *
 * **设计意图**：让消费者明确把这些工具从生产 bundle 里排除（subpath 让 tree-shake 100%
 * 精确），避免把 dev-only 代码打进线上。
 *
 * @example
 * // 只在 dev 模式下 import
 * if (process.env.NODE_ENV !== 'production') {
 *   const { assertSchemaConsistency } = await import('@kenconnet666/zui-core/dev')
 *   const issues = assertSchemaConsistency(myTheme)
 *   if (issues.length) console.warn(issues)
 * }
 */

export { assertSchemaConsistency } from './assertSchemaConsistency'
export type { SchemaIssue } from './assertSchemaConsistency'

export {
  makeCallsiteLabel,
  parseStackLine,
  findUserCallsite,
  isProductionEnv,
} from './stackTrace'
export type { StackFrame } from './stackTrace'
