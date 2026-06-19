/**
 * `ZAvatarGroup` —— 头像组(数据驱动 + max 折叠 +N + 重叠圆环)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZAvatar, ZAvatarGroup } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map(el => el.textContent ?? '')
    .join('\n')
}

describe('ZAvatarGroup', () => {
  it('渲染 items 为头像 + role=group', () => {
    const w = mount(ZAvatarGroup, {
      props: { items: [{ text: 'A' }, { text: 'B' }, { text: 'C' }] },
    })
    expect(w.attributes('role')).toBe('group')
    expect(w.findAllComponents(ZAvatar).length).toBe(3)
  })

  it('max 折叠剩余为 +N', () => {
    const w = mount(ZAvatarGroup, {
      props: {
        items: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }, { text: 'E' }],
        max: 3,
      },
    })
    // 3 个可见 + 1 个 "+N" 余量头像
    expect(w.findAllComponents(ZAvatar).length).toBe(4)
    expect(w.text()).toContain('+2')
  })

  it('无 max → 全显,不出现 +N', () => {
    const w = mount(ZAvatarGroup, {
      props: { items: [{ text: 'A' }, { text: 'B' }] },
    })
    expect(w.findAllComponents(ZAvatar).length).toBe(2)
    expect(w.text()).not.toContain('+')
  })

  it('重叠圆环 → border solid + 非首个负 margin-left', () => {
    mount(ZAvatarGroup, {
      props: { items: [{ text: 'A' }, { text: 'B' }] },
    })
    const css = getInjectedCss()
    expect(css).toMatch(/border-style:solid/)
    expect(css).toMatch(/margin-left:-/)
  })
})
