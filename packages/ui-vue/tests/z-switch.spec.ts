/**
 * `ZSwitch` —— 开关。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZSwitch } from '../src'

describe('ZSwitch', () => {
  it('role=switch + aria-checked', () => {
    const w = mount(ZSwitch, { props: { value: true } })
    expect(w.attributes('role')).toBe('switch')
    expect(w.attributes('aria-checked')).toBe('true')
  })

  it('点击 → update:value 取反(v0.2 已删除等价 change emit)', async () => {
    const w = mount(ZSwitch, { props: { value: false } })
    await w.trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([true])
    expect(w.emitted('change')).toBeUndefined()
  })

  it('disabled → 点击无效', async () => {
    const w = mount(ZSwitch, { props: { value: false, disabled: true } })
    await w.trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('loading → 点击无效', async () => {
    const w = mount(ZSwitch, { props: { value: false, loading: true } })
    await w.trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('Space 键切换', async () => {
    const w = mount(ZSwitch, { props: { value: false } })
    await w.trigger('keydown', { key: ' ' })
    expect(w.emitted('update:value')![0]).toEqual([true])
  })

  it('checkedLabel 在 value=true 时显示', () => {
    const w = mount(ZSwitch, { props: { value: true, checkedLabel: 'ON', uncheckedLabel: 'OFF' } })
    expect(w.text()).toContain('ON')
    expect(w.text()).not.toContain('OFF')
  })
})
