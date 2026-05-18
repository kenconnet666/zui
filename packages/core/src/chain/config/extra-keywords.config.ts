/**
 * W6.1 D14 — 增强关键字扩展槽（仅 core 内部用）。
 *
 * 给 zui 补 csstype 当前版本未跟新的 CSS 关键字。约定：
 *  - 每个 keyword 必须以 `_` 前缀（与 CSS 标准 keyword 无前缀隔离）
 *  - 不能与该属性的 tokenCat 解析出的 token ident 重名（generator 校验）
 *
 * 当前为空 —— 如未来 csstype 没及时跟新某个 keyword（例如 CSS 5 引入新的 `text-wrap`
 * 值），可在此打补丁，等 csstype 升级后再回收。
 *
 * @example （演示，当前无内容）
 * export const EXTRA_KEYWORDS: Record<string, readonly string[]> = {
 *   textWrap: ['_balance', '_pretty'],  // 假设 csstype 漏了
 * }
 */
export const EXTRA_KEYWORDS: Record<string, readonly string[]> = {}
