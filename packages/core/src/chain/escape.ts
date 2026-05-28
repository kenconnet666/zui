/**
 * 字符串逃生舱（String Escape Hatch）—— carrier setter 内的字符串运行时解析。
 *
 * 在 `s.color('red')` 这种"字面量字符串"形态下,识别以 `_` 开头的特殊字符串并解析:
 *
 *   1. `_tokenIdent`               → 反查 theme[cat][token],返回真值
 *   2. `_unitIdent(N)`             → `withUnit(N, ident)`
 *   3. `_tokenIdent.mod1(...).mod2(...)`  → token 反查 + color2k 链式调用
 *
 * **设计上不污染类型签名**:`PropFn` 仍是 `(v: string) => Chain`,字符串逃生舱纯在 runtime 工作。
 * 主推 API 仍是 chain shortcut `s.color._primary` / unit method `s.width.iem(1)`,本模块只
 * 服务"动态拼接 / 复制粘贴 / 非 ENHANCED_PROPS 属性"等场景。
 *
 * **快速路径**:不以 `_` 开头的字符串直接 untouched 返回,零开销。
 *
 * 详细设计参见 `.claude/decisions/2026-05-22-string-escape-hatch.md`。
 */

import {
  complement,
  darken,
  desaturate,
  invert,
  lighten,
  mix,
  rotateHue,
  saturate,
  setAlpha,
  shade,
  tint,
} from './color'
import { getUnitList, withUnit } from './units'

// ════════════════════════════════════════════════════════════════════════
// Color modifier 注册表 —— 名称 → fn(color, ...args)
// ════════════════════════════════════════════════════════════════════════
//
// 与 `carrier.ts` 的 `makeColorTokenValue()` 11 个 modifier 一一对应。
// 参数语义保持一致:n 取 0-100(百分比),alpha 内部 / 100;mix(other, n) 中 other 已被 resolveArg 解析。

type ColorMod = (color: string, ...args: unknown[]) => string

const COLOR_MODIFIERS: Record<string, ColorMod> = {
  alpha: (c, n) => setAlpha(c, (n as number) / 100),
  darken: (c, n) => darken(c, n as number),
  lighten: (c, n) => lighten(c, n as number),
  saturate: (c, n) => saturate(c, n as number),
  desaturate: (c, n) => desaturate(c, n as number),
  shade: (c, n) => shade(c, n as number),
  tint: (c, n) => tint(c, n as number),
  mix: (c, other, n) => mix(c, other as string, n as number),
  complement: c => complement(c),
  rotateHue: (c, deg) => rotateHue(c, deg as number),
  invert: c => invert(c),
}

// 单位 ident 全集 —— length + time + angle,启动期一次性 build,O(1) 查询。
const ALL_UNITS: ReadonlySet<string> = new Set([
  ...getUnitList('length'),
  ...getUnitList('time'),
  ...getUnitList('angle'),
])

// ════════════════════════════════════════════════════════════════════════
// 内部 helpers
// ════════════════════════════════════════════════════════════════════════

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

function warn(msg: string): void {
  if (isDevEnv()) {
    console.warn(`[zui-core/escape] ${msg}`)
  }
}

/**
 * 反查 token —— 先 carrier preferredCat,失败 fallback 全 schema 扫描。
 *
 * @returns 命中:`{ value, cat }`;miss:`null`。
 */
function lookupToken(
  ident: string,
  preferredCat: string | null | undefined,
  theme: Record<string, Record<string, string | number>>,
  keymap: Map<string, Map<string, string>>,
): { value: string | number; cat: string } | null {
  // 阶段 1:用 carrier 的 tokenCat(`s.color('_primary')` → cat=color)
  if (preferredCat) {
    const catMap = keymap.get(preferredCat)
    const origKey = catMap?.get(ident)
    if (origKey !== undefined) {
      const v = theme[preferredCat]?.[origKey]
      if (v !== undefined) return { value: v, cat: preferredCat }
    }
  }
  // 阶段 2:全 schema 扫描(carrier 无 tokenCat,或阶段 1 miss)
  for (const [cat, catMap] of keymap) {
    if (cat === preferredCat) continue
    const origKey = catMap.get(ident)
    if (origKey !== undefined) {
      const v = theme[cat]?.[origKey]
      if (v !== undefined) return { value: v, cat }
    }
  }
  return null
}

/**
 * 解析 modifier 调用片段 `alpha(50)` / `mix(_danger, 30)` / `complement()`。
 *
 * @returns `{ name, args: string[] }`;格式不合法返回 `null`。
 */
function parseCall(callStr: string): { name: string; args: string[] } | null {
  const m = callStr.match(/^([a-zA-Z][a-zA-Z0-9]*)\(([^)]*)\)$/)
  if (!m) return null
  const name = m[1]!
  const argsRaw = m[2]!.trim()
  if (!argsRaw) return { name, args: [] }
  // 简单 split:不处理 args 内嵌套括号(modifier 参数永远是 scalar / token,不会嵌套调用)
  const args = argsRaw.split(/\s*,\s*/)
  return { name, args }
}

/**
 * 把 arg 字符串转成 runtime 值:
 * - 纯数字 → number
 * - `_token` → 反查后的真值
 * - 其它(可能带引号) → 字面量字符串(去外层引号)
 */
function resolveArg(
  arg: string,
  theme: Record<string, Record<string, string | number>>,
  keymap: Map<string, Map<string, string>>,
): unknown {
  if (/^-?\d+(\.\d+)?$/.test(arg)) return parseFloat(arg)
  if (arg.startsWith('_')) {
    const hit = lookupToken(arg, undefined, theme, keymap)
    if (hit) return hit.value
    warn(`arg token "${arg}" miss; using as literal string`)
  }
  return arg.replace(/^['"]|['"]$/g, '')
}

/**
 * 拆 `head.mod1(args).mod2(args)` 链:depth-aware,避免 split('.')误切到括号内。
 */
function splitChain(s: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of s) {
    if (ch === '(') {
      depth++
      current += ch
    } else if (ch === ')') {
      depth--
      current += ch
    } else if (ch === '.' && depth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current) parts.push(current)
  return parts
}

/**
 * 识别 `_unitIdent(N)` 形态。命中返回 css 字符串,不命中返回 null。
 *
 * 例:`_px(20)` → `'20px'`,`_iem(1)` → `'calc(1 * var(--zui-iem, 16px))'`。
 */
function tryParseUnitCall(value: string): string | null {
  const m = value.match(/^_([a-z]+)\((-?\d+(?:\.\d+)?)\)$/)
  if (!m) return null
  const ident = m[1]!
  const n = parseFloat(m[2]!)
  if (!ALL_UNITS.has(ident)) return null
  return withUnit(n, ident)
}

// ════════════════════════════════════════════════════════════════════════
// 主入口
// ════════════════════════════════════════════════════════════════════════

/**
 * 在 carrier setter 内调用,解析字符串值的 4 种逃生形态。
 *
 * @param value         setter 接收到的字符串
 * @param carrierCfg    ENHANCED_PROPS[prop],拿 `tokenCat` 做优先 lookup
 * @param theme         resolved theme
 * @param keymap        Chain 持有的 `Map<cat, Map<ident, key>>`
 * @returns             解析后的最终值(string 或 number);不识别时原样返回入参
 *
 * @example
 * resolveStringValue('_primary', { tokenCat: 'color' }, theme, keymap)
 * // → theme.color.primary 的 hex 字符串
 *
 * @example
 * resolveStringValue('_primary.alpha(50)', { tokenCat: 'color' }, theme, keymap)
 * // → setAlpha(primary, 0.5)
 *
 * @example
 * resolveStringValue('_iem(1)', { tokenCat: 'spacing' }, theme, keymap)
 * // → 'calc(1 * var(--zui-iem, 16px))'
 *
 * @example
 * resolveStringValue('red', { tokenCat: 'color' }, theme, keymap)
 * // → 'red'(不以 _ 开头,原样)
 */
export function resolveStringValue(
  value: string,
  carrierCfg: { tokenCat?: string | null } | undefined,
  theme: Record<string, Record<string, string | number>>,
  keymap: Map<string, Map<string, string>>,
): string | number {
  // ─── 快速路径:不以 _ 开头,零开销 untouched ───
  if (!value.startsWith('_')) return value

  // ─── 模式 1:unit 形态 _ident(N) ───
  const unitResult = tryParseUnitCall(value)
  if (unitResult !== null) return unitResult

  // ─── 模式 2 & 3:token + 可选 color modifier 链 ───
  const parts = splitChain(value)
  const head = parts[0]!
  const modifiers = parts.slice(1)

  // head 必须是合法 ident(防御:用户写错,如 `_primary.alpha 50)` 这种)
  if (!/^_[a-zA-Z0-9_]+$/.test(head)) {
    warn(`unrecognized head "${head}" in "${value}"; using as literal`)
    return value
  }

  const hit = lookupToken(head, carrierCfg?.tokenCat, theme, keymap)
  if (!hit) {
    warn(`token "${head}" not found in any category; using as literal`)
    return value
  }

  // 无 modifier:返回 token 真值
  if (modifiers.length === 0) return hit.value

  // 有 modifier:必须是 string(color)token
  if (typeof hit.value !== 'string') {
    warn(`token "${head}" is ${typeof hit.value}, cannot apply modifiers; using bare token value`)
    return hit.value
  }

  // 应用 color modifier 链
  let current = hit.value
  for (const modStr of modifiers) {
    const call = parseCall(modStr)
    if (!call) {
      warn(`malformed modifier "${modStr}" in "${value}"; stopping at "${current}"`)
      break
    }
    const fn = COLOR_MODIFIERS[call.name]
    if (!fn) {
      warn(`unknown color modifier "${call.name}" in "${value}"; stopping at "${current}"`)
      break
    }
    const resolvedArgs = call.args.map(a => resolveArg(a, theme, keymap))
    current = fn(current, ...resolvedArgs)
  }
  return current
}
