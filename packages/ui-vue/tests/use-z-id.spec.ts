/**
 * `useZId` —— Vue useId() + zui 前缀 + 可选 suffix。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useZId } from '../src'

describe('useZId', () => {
  it('返回 zui- 前缀的 id', () => {
    let id = ''
    const C = defineComponent({
      setup() {
        id = useZId()
        return () => h('div')
      },
    })
    mount(C)
    expect(id).toMatch(/^zui-/)
    expect(id.length).toBeGreaterThan(4)
  })

  it('传 suffix → 末尾追加', () => {
    let id = ''
    const C = defineComponent({
      setup() {
        id = useZId('label')
        return () => h('div')
      },
    })
    mount(C)
    expect(id).toMatch(/^zui-.*-label$/)
  })

  it('多次调用同组件 → 同 base 不同 suffix 都不冲突', () => {
    const ids: string[] = []
    const C = defineComponent({
      setup() {
        ids.push(useZId('a'), useZId('b'))
        return () => h('div')
      },
    })
    mount(C)
    expect(ids[0]).not.toBe(ids[1])
    expect(ids[0]).toMatch(/-a$/)
    expect(ids[1]).toMatch(/-b$/)
  })
})
