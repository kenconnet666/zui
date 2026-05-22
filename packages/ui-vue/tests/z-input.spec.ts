/**
 * `ZInput` —— 文本输入框。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZInput } from '../src'

describe('ZInput — 渲染', () => {
  it('渲染 <input>', () => {
    const w = mount(ZInput, { props: { value: 'hello' } })
    const input = w.find('input').element as HTMLInputElement
    expect(input.value).toBe('hello')
  })

  it('placeholder 应用', () => {
    const w = mount(ZInput, { props: { placeholder: '请输入' } })
    expect(w.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('disabled 透传到 input', () => {
    const w = mount(ZInput, { props: { disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })

  it('type=password 透传', () => {
    const w = mount(ZInput, { props: { type: 'password' } })
    expect(w.find('input').attributes('type')).toBe('password')
  })
})

describe('ZInput — v-model', () => {
  it('input 事件 → update:value', async () => {
    const w = mount(ZInput, { props: { value: '' } })
    const input = w.find('input').element as HTMLInputElement
    input.value = 'abc'
    await w.find('input').trigger('input')
    expect(w.emitted('update:value')).toBeTruthy()
    expect(w.emitted('update:value')![0]).toEqual(['abc'])
  })

  it('回车 → pressEnter', async () => {
    const w = mount(ZInput, { props: { value: 'x' } })
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('pressEnter')).toBeTruthy()
  })
})

describe('ZInput — clearable / showCount / slots', () => {
  it('clearable + 有值 → 显示清空按钮,点击 emit clear + update:value=""', async () => {
    const w = mount(ZInput, { props: { value: 'abc', clearable: true } })
    const btn = w.find('button[aria-label="清空"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(w.emitted('clear')).toBeTruthy()
    expect(w.emitted('update:value')!.at(-1)).toEqual([''])
  })

  it('clearable + 空值 → 无清空按钮', () => {
    const w = mount(ZInput, { props: { value: '', clearable: true } })
    expect(w.find('button[aria-label="清空"]').exists()).toBe(false)
  })

  it('showCount + maxlength → 显示 n/max', () => {
    const w = mount(ZInput, { props: { value: 'hi', showCount: true, maxlength: 10 } })
    expect(w.text()).toContain('2')
    expect(w.text()).toContain('10')
  })

  it('prefix slot 渲染', () => {
    const Host = defineComponent({
      setup() {
        const v = ref('x')
        return () =>
          h(
            ZInput,
            { value: v.value, 'onUpdate:value': (nv: string) => (v.value = nv) },
            { prefix: () => 'P' },
          )
      },
    })
    const w = mount(Host)
    expect(w.text()).toContain('P')
  })
})
