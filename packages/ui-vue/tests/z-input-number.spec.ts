/**
 * `ZInputNumber` —— 数字输入(+ 上下按钮 / step / min / max / precision)。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZInputNumber } from '../src'

describe('ZInputNumber', () => {
  it('显示 number → input.value 是字符串', () => {
    const w = mount(ZInputNumber, { props: { value: 5 } })
    expect((w.find('input').element as HTMLInputElement).value).toBe('5')
  })

  it('点 + → update:value 加 step', async () => {
    const w = mount(ZInputNumber, { props: { value: 5, step: 2 } })
    await w.find('button[aria-label="增加"]').trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([7])
  })

  it('点 - → update:value 减 step', async () => {
    const w = mount(ZInputNumber, { props: { value: 5, step: 3 } })
    await w.find('button[aria-label="减少"]').trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([2])
  })

  it('clamp 到 max', async () => {
    const w = mount(ZInputNumber, { props: { value: 9, max: 10, step: 5 } })
    await w.find('button[aria-label="增加"]').trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([10])
  })

  it('clamp 到 min', async () => {
    const w = mount(ZInputNumber, { props: { value: 1, min: 0, step: 5 } })
    await w.find('button[aria-label="减少"]').trigger('click')
    expect(w.emitted('update:value')![0]).toEqual([0])
  })

  it('precision=2 → 显示两位小数', () => {
    const w = mount(ZInputNumber, { props: { value: 1.234, precision: 2 } })
    expect((w.find('input').element as HTMLInputElement).value).toBe('1.23')
  })

  it('input 空字符串 → update:value(null)', async () => {
    const w = mount(ZInputNumber, { props: { value: 5 } })
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = ''
    await input.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual([null])
  })

  it('disabled → 上下按钮失效', async () => {
    const w = mount(ZInputNumber, { props: { value: 5, disabled: true } })
    await w.find('button[aria-label="增加"]').trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
  })
})
