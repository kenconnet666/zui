import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ENHANCED_PROPS } from '../src/chain/enhanced-props'

/**
 * 守护测试：ENHANCED_PROPS（运行时 SSoT）必须与 properties.generated.ts（类型层派生）
 * 严格对齐。任何 ENHANCED_PROPS 改动后忘了跑 `pnpm generate` 时，本测试会失败。
 *
 * 校验维度：
 *  1. ENHANCED_PROPS 的每个 key 在 properties.generated.ts 中存在
 *  2. tokenCat === 'color' ↔ 类型层用 ColorPropCarrier
 *  3. tokenCat !== 'color' 且为非 null ↔ 类型层用 PropCarrier
 *  4. tokenCat === null ↔ 类型层用 PropCarrier（仍是四态）
 *  5. unitClass / keywords 字段反映到类型层（粗校验：行内必含 LengthUnits/TimeUnits/... 关键字）
 */

// vitest 工作目录 = packages/core，从这里定位生成文件
const GENERATED_PATH = resolve(process.cwd(), 'src/types/properties.generated.ts')
const generatedSrc = readFileSync(GENERATED_PATH, 'utf8')

function getPropTypeLine(propName: string): string | null {
  // 生成文件经 prettier 格式化后，超长的 PropCarrier / 关键字 union 会跨多行展开。
  // 捕获从 `  propName:` 起，直到下一个属性的 JSDoc(`  /**`)、下一个属性声明
  // (`  word:`) 或接口闭合(`}`) 之前的完整声明块，再压平为单段文本以便 includes 判定。
  const re = new RegExp(
    `^  ${propName}:\\s*([\\s\\S]*?)(?=\\n  /\\*\\*|\\n  \\w+:|\\n\\})`,
    'm',
  )
  const m = generatedSrc.match(re)
  return m ? m[1]!.trim() : null
}

describe('Parity — ENHANCED_PROPS ↔ properties.generated.ts', () => {
  it('每个 ENHANCED_PROPS key 在 generated.ts 中存在', () => {
    const missing: string[] = []
    for (const prop of Object.keys(ENHANCED_PROPS)) {
      if (getPropTypeLine(prop) === null) missing.push(prop)
    }
    expect(missing, `Missing in generated.ts: ${missing.join(', ')}`).toEqual([])
  })

  it('color 类 tokenCat 用 ColorPropCarrier', () => {
    const mismatches: string[] = []
    for (const [prop, cfg] of Object.entries(ENHANCED_PROPS)) {
      if (cfg.tokenCat !== 'color') continue
      const line = getPropTypeLine(prop)
      if (!line) {
        mismatches.push(`${prop}: missing`)
        continue
      }
      if (!line.includes('ColorPropCarrier')) {
        mismatches.push(`${prop}: expect ColorPropCarrier, got ${line}`)
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('非 color 类 tokenCat 用 PropCarrier（不含 Color 前缀）', () => {
    const mismatches: string[] = []
    for (const [prop, cfg] of Object.entries(ENHANCED_PROPS)) {
      if (cfg.tokenCat === 'color') continue
      const line = getPropTypeLine(prop)
      if (!line) {
        mismatches.push(`${prop}: missing`)
        continue
      }
      if (!/\bPropCarrier\b/.test(line) || /\bColorPropCarrier\b/.test(line)) {
        mismatches.push(`${prop}: expect PropCarrier, got ${line}`)
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('unitClass=length 时类型行含 LengthUnits', () => {
    const mismatches: string[] = []
    for (const [prop, cfg] of Object.entries(ENHANCED_PROPS)) {
      if (cfg.unitClass !== 'length') continue
      const line = getPropTypeLine(prop)!
      if (!line.includes('LengthUnits')) mismatches.push(`${prop}: ${line}`)
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('unitClass=time 时类型行含 TimeUnits', () => {
    const mismatches: string[] = []
    for (const [prop, cfg] of Object.entries(ENHANCED_PROPS)) {
      if (cfg.unitClass !== 'time') continue
      const line = getPropTypeLine(prop)!
      if (!line.includes('TimeUnits')) mismatches.push(`${prop}: ${line}`)
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('keywords 数组中的每个 keyword 出现在类型行', () => {
    const mismatches: string[] = []
    for (const [prop, cfg] of Object.entries(ENHANCED_PROPS)) {
      if (!cfg.keywords || cfg.keywords.length === 0) continue
      const line = getPropTypeLine(prop)!
      for (const kw of cfg.keywords) {
        if (!line.includes(`'${kw}'`)) {
          mismatches.push(`${prop}: keyword '${kw}' not in type line: ${line}`)
        }
      }
    }
    expect(mismatches, mismatches.join('\n')).toEqual([])
  })

  it('generated.ts 文件头声明来源 + 总属性数 ≈ 800+', () => {
    expect(generatedSrc).toContain('scripts/generate-properties.mjs')
    expect(generatedSrc).toContain('ENHANCED_PROPS')
    const propLines = generatedSrc.match(/^\s{2}\w+:\s/gm) ?? []
    expect(propLines.length).toBeGreaterThan(800)
  })
})
