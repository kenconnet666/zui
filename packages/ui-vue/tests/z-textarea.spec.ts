/**
 * `ZTextarea` —— 多行输入。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { ZTextarea } from '../src'

describe('ZTextarea', () => {
  it('渲染 <textarea>,value 透传', () => {
    const w = mount(ZTextarea, { props: { value: 'multi\nline' } })
    const ta = w.find('textarea').element as HTMLTextAreaElement
    expect(ta.value).toBe('multi\nline')
  })

  it('rows 默认 3', () => {
    const w = mount(ZTextarea)
    expect(w.find('textarea').attributes('rows')).toBe('3')
  })

  it('input → update:value', async () => {
    const w = mount(ZTextarea, { props: { value: '' } })
    const el = w.find('textarea').element as HTMLTextAreaElement
    el.value = 'new'
    await w.find('textarea').trigger('input')
    expect(w.emitted('update:value')![0]).toEqual(['new'])
  })

  it('disabled / readonly 透传', () => {
    const w = mount(ZTextarea, { props: { disabled: true, readonly: true } })
    expect(w.find('textarea').attributes('disabled')).toBeDefined()
    expect(w.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('showCount + maxlength → 字数显示', () => {
    const w = mount(ZTextarea, { props: { value: 'abcd', showCount: true, maxlength: 100 } })
    expect(w.text()).toContain('4')
    expect(w.text()).toContain('100')
  })
})
