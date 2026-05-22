/**
 * `ZRadio` + `ZRadioGroup`(buttonStyle 切换).
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZRadioGroup, ZRadio } from '../src'

describe('ZRadioGroup', () => {
  it('options 渲染 + role=radiogroup', () => {
    const w = mount(ZRadioGroup, {
      props: {
        value: 'a',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      },
    })
    expect(w.attributes('role')).toBe('radiogroup')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
  })

  it('选中某项 → update:value + change', async () => {
    const Host = defineComponent({
      setup() {
        const v = ref<string | number | boolean | null>('a')
        return () =>
          h(ZRadioGroup, {
            value: v.value,
            'onUpdate:value': (nv: string | number | boolean) => (v.value = nv),
            options: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
          })
      },
    })
    const w = mount(Host)
    const inputs = w.findAll('input[type="radio"]')
    await inputs[1].trigger('change')
    expect(w.html()).toContain('B')
  })

  it('buttonStyle=true → 渲染按钮', () => {
    const w = mount(ZRadioGroup, {
      props: {
        value: 'a',
        buttonStyle: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      },
    })
    const btns = w.findAll('button[role="radio"]')
    expect(btns.length).toBe(2)
  })

  it('disabled group → 子项 disabled', () => {
    const w = mount(ZRadioGroup, {
      props: {
        value: 'a',
        disabled: true,
        options: [{ value: 'a', label: 'A' }],
      },
    })
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('ZRadio 独立(group 外)', () => {
  it('group 外渲染不报错(无 onSelect 效果)', () => {
    const w = mount(ZRadio, { props: { value: 'x', label: 'lone' } })
    expect(w.text()).toContain('lone')
  })
})
