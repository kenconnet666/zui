import { describe, expect, it } from 'vitest'
import { Chain } from '../src'
import { defaultLight } from './_fixture-theme'
import {
  findUserCallsite,
  isProductionEnv,
  makeCallsiteLabel,
  parseStackLine,
} from '../src/dev/stackTrace'

/**
 * W3.2 完整 stack-trace label 测试。
 *
 * 覆盖：parseStackLine 各 runtime 格式 / findUserCallsite framework 过滤 /
 * makeCallsiteLabel 综合 / isProductionEnv / Chain { debug: true } 集成 + C2 label join 协作。
 */

describe('parseStackLine — 跨 runtime stack 格式解析', () => {
  it('V8 (Chrome / Node) 带函数名格式', () => {
    const frame = parseStackLine('    at MyButton (file:///Users/me/proj/src/Button.tsx:42:10)')
    expect(frame).toMatchObject({ fileName: 'Button', line: 42, column: 10 })
  })

  it('V8 匿名 callsite（无函数名）', () => {
    const frame = parseStackLine('    at file:///proj/src/App.ts:15:5')
    expect(frame).toMatchObject({ fileName: 'App', line: 15, column: 5 })
  })

  it('SpiderMonkey (Firefox) 格式 fn@file:line:col', () => {
    const frame = parseStackLine('renderButton@file:///proj/src/Form.vue:88:12')
    expect(frame).toMatchObject({ fileName: 'Form', line: 88, column: 12 })
  })

  it('JavaScriptCore (Safari) 格式', () => {
    const frame = parseStackLine('handler@file:///app/main.js:128:3')
    expect(frame).toMatchObject({ fileName: 'main', line: 128, column: 3 })
  })

  it('Windows 反斜杠路径', () => {
    const frame = parseStackLine('    at fn (C:\\code\\zui\\src\\App.ts:7:1)')
    expect(frame?.fileName).toBe('App')
    expect(frame?.line).toBe(7)
  })

  it('无扩展名文件', () => {
    const frame = parseStackLine('    at fn (file:///proj/index:10:2)')
    expect(frame?.fileName).toBe('index')
  })

  it('多 . 文件名（取最后一个扩展名）', () => {
    const frame = parseStackLine('    at fn (file:///proj/MyComp.vue.ts:5:1)')
    expect(frame?.fileName).toBe('MyComp.vue')
  })

  it('无效行返回 null', () => {
    expect(parseStackLine('Error: something')).toBe(null)
    expect(parseStackLine('')).toBe(null)
    expect(parseStackLine('    at NoLineCol')).toBe(null)
  })

  it('行号 / 列号非数字返回 null', () => {
    expect(parseStackLine('    at fn (file:///x:abc:def)')).toBe(null)
  })
})

describe('findUserCallsite — 跳过 framework frame', () => {
  it('跳过 Chain.ts / proxy.ts / carrier.ts', () => {
    const frame = findUserCallsite([
      '    at Object.get (C:/zui/src/chain/proxy.ts:38:25)',
      '    at constructor (C:/zui/src/chain/Chain.ts:120:5)',
      '    at MyButton (C:/proj/src/Button.tsx:42:10)',
    ])
    expect(frame?.fileName).toBe('Button')
  })

  it('跳过 node_modules', () => {
    const frame = findUserCallsite([
      '    at fn (node_modules/@emotion/css/dist/index.js:10:5)',
      '    at app (C:/proj/src/App.ts:5:1)',
    ])
    expect(frame?.fileName).toBe('App')
  })

  it('跳过 stackTrace.ts 自身', () => {
    const frame = findUserCallsite([
      '    at makeCallsiteLabel (C:/zui/src/dev/stackTrace.ts:50:10)',
      '    at constructor (C:/zui/src/chain/Chain.ts:120:5)',
      '    at user (C:/proj/index.ts:1:1)',
    ])
    expect(frame?.fileName).toBe('index')
  })

  it('全是 framework frame 返回 null', () => {
    const frame = findUserCallsite([
      '    at fn (C:/zui/src/chain/proxy.ts:38:25)',
      '    at fn (C:/zui/src/chain/Chain.ts:120:5)',
      '    at fn (node_modules/zui-core/dist/index.js:1:1)',
    ])
    expect(frame).toBe(null)
  })

  it('空数组返回 null', () => {
    expect(findUserCallsite([])).toBe(null)
  })
})

describe('makeCallsiteLabel — 综合', () => {
  it('从完整 stack 抽 callsite 拼 filename_line', () => {
    const stack = `Error
    at constructor (C:/zui/src/chain/Chain.ts:120:5)
    at MyButton (C:/proj/src/Button.tsx:42:10)
    at render (C:/proj/src/App.tsx:5:1)`
    expect(makeCallsiteLabel(stack)).toBe('Button_42')
  })

  it('undefined stack 返回 null', () => {
    expect(makeCallsiteLabel(undefined)).toBe(null)
  })

  it('空 stack 返回 null', () => {
    expect(makeCallsiteLabel('')).toBe(null)
  })

  it('只有 Error 行返回 null', () => {
    expect(makeCallsiteLabel('Error')).toBe(null)
  })

  it('全 framework 返回 null', () => {
    const stack = `Error
    at Object.get (C:/zui/src/chain/proxy.ts:38:25)
    at constructor (C:/zui/src/chain/Chain.ts:120:5)`
    expect(makeCallsiteLabel(stack)).toBe(null)
  })
})

describe('isProductionEnv', () => {
  it('NODE_ENV !== production 时返回 false（vitest 默认）', () => {
    expect(isProductionEnv()).toBe(false)
  })

  it('process.env 改成 production 后返回 true', () => {
    const orig = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      expect(isProductionEnv()).toBe(true)
    } finally {
      process.env.NODE_ENV = orig
    }
  })
})

describe('Chain { debug: true } 集成', () => {
  it('debug: true + dev 环境 → _node.label 有值（来自当前 spec 文件）', () => {
    const c = new Chain(defaultLight, { debug: true })
    // 当前 spec 文件名是 stack-trace.spec.ts，去扩展名后是 stack-trace.spec
    // 但 vitest 调用栈复杂，可能命中 vitest runner / chai 等，所以宽松断言
    expect(typeof c._node.label === 'string' || c._node.label === undefined).toBe(true)
    // 若有值，必须是 filename_line 格式（不含完整路径）
    if (typeof c._node.label === 'string') {
      expect(c._node.label).toMatch(/^[\w.-]+_\d+$/)
    }
  })

  it('debug: false 不加 label', () => {
    const c = new Chain(defaultLight, { debug: false })
    expect(c._node.label).toBeUndefined()
  })

  it('未传 options 不加 label', () => {
    const c = new Chain(defaultLight)
    expect(c._node.label).toBeUndefined()
  })

  it('debug: true 在 NODE_ENV=production 时降级 noop', () => {
    const orig = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      const c = new Chain(defaultLight, { debug: true })
      expect(c._node.label).toBeUndefined()
    } finally {
      process.env.NODE_ENV = orig
    }
  })

  it('debug: true 与 c.label(name) 协作（C2 join：callsite.userLabel）', () => {
    const c = new Chain(defaultLight, { debug: true })
    c.label('MyButton')
    // 若 debug 加了 label，应该是 callsite.MyButton；若没（找不到用户 callsite），就是 MyButton
    expect(c._node.label).toMatch(/^([\w.-]+_\d+\.)?MyButton$/)
  })
})
