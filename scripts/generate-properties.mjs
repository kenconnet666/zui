/**
 * 从 csstype 的 `Properties` 接口 + `packages/core/src/chain/enhanced-props.ts` 的 ENHANCED_PROPS
 * 生成 `packages/core/src/types/properties.generated.ts`：
 *
 *   - 完整 ~300 CSS 属性的链式方法签名
 *   - 每个属性的 JSDoc（MDN 链接、浏览器兼容表、Syntax、Initial value）直接从 csstype 抽取
 *   - 双形态分流：
 *       - ENHANCED_PROPS 内的属性 → `PropCarrier` / `ColorPropCarrier`（四态：fn / token / keyword / unit）
 *       - 其余属性 → `PropFn`（函数态 + 全局关键字）
 *
 * ENHANCED_PROPS 是运行时 + 类型层的 SSoT；本 generator 派生类型，零漂移。
 *
 * 用法: `node scripts/generate-properties.mjs`
 */

import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const WORKSPACE_ROOT = resolve(SCRIPT_DIR, '..')
const CORE_PKG = resolve(WORKSPACE_ROOT, 'packages/core')
const ENHANCED_PROPS_FILE = resolve(CORE_PKG, 'src/chain/enhanced-props.ts')
const OUTPUT_FILE = resolve(CORE_PKG, 'src/types/properties.generated.ts')

const require = createRequire(import.meta.url)

const GENERATED_FILE_HEADER = [
  '// 此文件由 scripts/generate-properties.mjs 自动生成，请勿手动编辑。',
  '// 来源：csstype Properties + src/chain/enhanced-props.ts (ENHANCED_PROPS)。',
  '// 修改方式：改 ENHANCED_PROPS 或升级 csstype，然后 `node scripts/generate-properties.mjs`。',
  '',
].join('\n')

// ─── csstype 入口解析 ───

function resolveCsstypeEntry() {
  const candidates = [CORE_PKG, WORKSPACE_ROOT]
  for (const from of candidates) {
    try {
      const pkg = require.resolve('csstype/package.json', { paths: [from] })
      return resolve(dirname(pkg), 'index.d.ts')
    } catch {
      /* try next */
    }
  }
  throw new Error('[gen-properties] 找不到 csstype/index.d.ts')
}

// ─── 通用工具 ───

function getJSDocText(sourceText, node) {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc)
  if (docs.length === 0) return null
  return docs.map(d => sourceText.slice(d.pos, d.end).trim()).join('\n')
}

function indentBlock(text, indent) {
  return text
    .split('\n')
    .map(line => `${indent}${line}`)
    .join('\n')
}

function getMemberNameText(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text
  }
  return null
}

// ─── 读 csstype: 收集 Properties 接口 + 祖先接口的所有 camelCase 属性 + JSDoc ───

function buildInterfaceRegistry(sourceFile) {
  const registry = new Map()
  for (const stmt of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(stmt)) registry.set(stmt.name.text, stmt)
  }
  return registry
}

function collectProperties(interfaceName, registry, sourceText, state) {
  if (state.visiting.has(interfaceName)) {
    throw new Error(`[gen-properties] 循环继承：${[...state.visiting, interfaceName].join(' -> ')}`)
  }
  const decl = registry.get(interfaceName)
  if (!decl) return
  state.visiting.add(interfaceName)
  try {
    for (const heritage of decl.heritageClauses ?? []) {
      if (heritage.token !== ts.SyntaxKind.ExtendsKeyword) continue
      for (const type of heritage.types) {
        const expr = type.expression
        if (ts.isIdentifier(expr)) collectProperties(expr.text, registry, sourceText, state)
      }
    }
    for (const member of decl.members) {
      if (!ts.isPropertySignature(member) || !member.name) continue
      const name = getMemberNameText(member.name)
      if (!name) continue
      if (name.includes('-')) continue // 跳过 PropertiesHyphen 的 kebab-case key
      if (state.properties.has(name)) continue
      const jsDoc = getJSDocText(sourceText, member)
      state.properties.set(name, { name, jsDoc })
    }
  } finally {
    state.visiting.delete(interfaceName)
  }
}

async function readCsstypeProperties() {
  const entry = resolveCsstypeEntry()
  const src = await readFile(entry, 'utf8')
  const sf = ts.createSourceFile(entry, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const registry = buildInterfaceRegistry(sf)
  const state = { properties: new Map(), visiting: new Set() }
  // Properties 是 csstype 顶层 union 接口，extends StandardProperties + VendorProperties + SvgProperties
  // SvgProperties 是 SVG 专用，CSS-in-JS 一般也会收（emotion 也支持）；保留
  collectProperties('Properties', registry, src, state)
  return state.properties
}

// ─── 读 ENHANCED_PROPS 字面量（AST） ───

/** 收集顶层 `const X = [...] as const` 之类的字符串数组常量，供 ENHANCED_PROPS 解引用。 */
function collectStringArrayConsts(sf) {
  const consts = new Map()
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      let init = decl.initializer
      if (!init) continue
      // 剥掉 `as const` / 类型断言
      while (init && (ts.isAsExpression(init) || ts.isTypeAssertionExpression(init))) {
        init = init.expression
      }
      if (!init || !ts.isArrayLiteralExpression(init)) continue
      const arr = init.elements.filter(ts.isStringLiteral).map(s => s.text)
      if (arr.length === init.elements.length) {
        consts.set(decl.name.text, arr)
      }
    }
  }
  return consts
}

async function readEnhancedProps() {
  const src = await readFile(ENHANCED_PROPS_FILE, 'utf8')
  const sf = ts.createSourceFile(ENHANCED_PROPS_FILE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const stringArrayConsts = collectStringArrayConsts(sf)

  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== 'ENHANCED_PROPS') continue
      const init = decl.initializer
      if (!init || !ts.isObjectLiteralExpression(init)) continue

      const out = new Map()
      for (const prop of init.properties) {
        if (!ts.isPropertyAssignment(prop)) continue
        const key = getMemberNameText(prop.name)
        if (!key) continue
        if (!ts.isObjectLiteralExpression(prop.initializer)) continue

        const cfg = { tokenCat: null, unitClass: null, keywords: null }
        for (const entry of prop.initializer.properties) {
          if (!ts.isPropertyAssignment(entry) || !ts.isIdentifier(entry.name)) continue
          const fieldName = entry.name.text
          let v = entry.initializer
          // 剥 `as const`
          while (v && (ts.isAsExpression(v) || ts.isTypeAssertionExpression(v))) {
            v = v.expression
          }
          if (ts.isStringLiteral(v)) {
            cfg[fieldName] = v.text
          } else if (v.kind === ts.SyntaxKind.NullKeyword) {
            cfg[fieldName] = null
          } else if (ts.isArrayLiteralExpression(v)) {
            cfg[fieldName] = v.elements.filter(ts.isStringLiteral).map(s => s.text)
          } else if (ts.isIdentifier(v) && stringArrayConsts.has(v.text)) {
            cfg[fieldName] = [...stringArrayConsts.get(v.text)]
          }
        }
        out.set(key, cfg)
      }
      return out
    }
  }
  throw new Error(`[gen-properties] 未在 ${ENHANCED_PROPS_FILE} 找到 ENHANCED_PROPS`)
}

// ─── 类型映射 ───

/** tokenCat → Tokens 类型工具名（与 src/types/tokens.ts 的导出对齐） */
const TOKEN_CAT_TO_TYPE = {
  color: 'ColorTokens',
  spacing: 'SpacingTokens',
  radius: 'RadiusTokens',
  shadow: 'ShadowTokens',
  fontSize: 'FontSizeTokens',
  fontWeight: 'FontWeightTokens',
  lineHeight: 'LineHeightTokens',
  letterSpacing: 'LetterSpacingTokens',
  fonts: 'FontsTokens',
  borders: 'BordersTokens',
  zIndex: 'ZIndexTokens',
  opacity: 'OpacityTokens',
  duration: 'DurationTokens',
  easing: 'EasingTokens',
  aspectRatio: 'AspectRatioTokens',
  sizes: 'SizeTokens',
  cursor: 'CursorTokens',
  transitionProperty: 'TransitionPropertyTokens',
}

/** unitClass → Units 类型 */
const UNIT_CLASS_TO_TYPE = {
  length: 'LengthUnits',
  time: 'TimeUnits',
  angle: 'AngleUnits',
}

function renderTypeExpr(propName, enhanced) {
  // 通过 csstype.Properties<TLength=string|number, TTime=string|number> 让 length / time 属性都接 number；
  // emotion 收到数字会自动加 px，类型层和运行时这样对齐。
  const cssValue = `CssValueOf<'${propName}'>`

  if (!enhanced) {
    return `PropFn<TSelf, ${cssValue}>`
  }

  const { tokenCat, unitClass, keywords } = enhanced
  const tokensType = tokenCat ? `${TOKEN_CAT_TO_TYPE[tokenCat]}<T>` : 'never'

  let keywordsType
  if (keywords === null) {
    keywordsType = 'GlobalKw'
  } else if (Array.isArray(keywords) && keywords.length === 0) {
    keywordsType = 'GlobalKw'
  } else {
    keywordsType = keywords.map(k => `'${k}'`).join(' | ') + ' | GlobalKw'
  }

  const carrier = tokenCat === 'color' ? 'ColorPropCarrier' : 'PropCarrier'

  if (unitClass) {
    const units = `${UNIT_CLASS_TO_TYPE[unitClass]}<TSelf>`
    return `${carrier}<TSelf, ${cssValue}, ${tokensType}, ${keywordsType}, ${units}>`
  }
  return `${carrier}<TSelf, ${cssValue}, ${tokensType}, ${keywordsType}>`
}

// ─── 输出渲染 ───

function renderFile(properties, enhanced) {
  /** 用到的 Tokens 类型集合（避免引入未使用导致 lint 报红） */
  const usedTokenTypes = new Set()
  /** 用到的 Units 类型集合 */
  const usedUnitTypes = new Set()
  /** 是否用到 ColorPropCarrier / PropCarrier / PropFn / GlobalKw */
  const usedCarrierTypes = new Set(['GlobalKw']) // GlobalKw 总会出现

  // 先扫一遍决定 imports
  for (const [name] of properties) {
    const enh = enhanced.get(name)
    if (!enh) {
      usedCarrierTypes.add('PropFn')
      continue
    }
    if (enh.tokenCat) {
      usedTokenTypes.add(TOKEN_CAT_TO_TYPE[enh.tokenCat])
      usedCarrierTypes.add(enh.tokenCat === 'color' ? 'ColorPropCarrier' : 'PropCarrier')
    } else {
      usedCarrierTypes.add('PropCarrier')
    }
    if (enh.unitClass) usedUnitTypes.add(UNIT_CLASS_TO_TYPE[enh.unitClass])
  }

  const lines = []
  lines.push(GENERATED_FILE_HEADER)
  lines.push("import type * as csstype from 'csstype'")
  lines.push("import type { ThemeSchema } from '../theme/types'")
  lines.push('import type {')
  const carrierImports = [...usedCarrierTypes].sort()
  for (const t of carrierImports) lines.push(`  ${t},`)
  const unitImports = [...usedUnitTypes].sort()
  for (const t of unitImports) lines.push(`  ${t},`)
  lines.push("} from './carrier'")
  if (usedTokenTypes.size > 0) {
    lines.push('import type {')
    for (const t of [...usedTokenTypes].sort()) lines.push(`  ${t},`)
    lines.push("} from './tokens'")
  }
  lines.push('')
  lines.push('/**')
  lines.push(' * 取某个 CSS 属性的 csstype 值类型（剥掉 undefined）。')
  lines.push(' *')
  lines.push(' * 用 `Properties<string | number, string | number>` 让 length / time 等数值属性同时接受数字')
  lines.push(' * （emotion 收到数字会自动加 px / ms）。')
  lines.push(' */')
  lines.push("type CssValueOf<K extends keyof csstype.Properties> = NonNullable<csstype.Properties<string | number, string | number>[K]>")
  lines.push('')
  lines.push('/**')
  lines.push(' * 自动生成：所有 csstype 已知 CSS 属性在 Chain 上的方法签名。')
  lines.push(' *')
  lines.push(" * - ENHANCED_PROPS 中的属性 → `PropCarrier` / `ColorPropCarrier`（四态）")
  lines.push(' * - 其余属性 → `PropFn`（函数态 + 全局关键字）')
  lines.push(' *')
  lines.push(' * 通过 `interface Chain<T> extends IcxPropMethods<Chain<T>, T> {}` 注入到 Chain 实例类型。')
  lines.push(' */')
  lines.push('export interface IcxPropMethods<TSelf, T extends ThemeSchema> {')

  for (const [name, info] of properties) {
    if (info.jsDoc) lines.push(indentBlock(info.jsDoc, '  '))
    lines.push(`  ${name}: ${renderTypeExpr(name, enhanced.get(name))}`)
  }

  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

// ─── main ───

async function main() {
  const properties = await readCsstypeProperties()
  const enhanced = await readEnhancedProps()
  const out = renderFile(properties, enhanced)

  const prev = await readFile(OUTPUT_FILE, 'utf8').catch(() => '')
  if (out === prev) {
    console.log(`[gen-properties] 无变化: ${OUTPUT_FILE}`)
    return
  }

  await writeFile(OUTPUT_FILE, out, 'utf8')
  console.log(`[gen-properties] 已生成: ${OUTPUT_FILE}`)
  console.log(`[gen-properties] 属性总数 = ${properties.size}, 增强 = ${enhanced.size}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
