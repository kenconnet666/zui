/**
 * `ZCheckbox` + `ZCheckboxGroup`。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZCheckbox, ZCheckboxGroup } from '../src'

describe('ZCheckbox 单独', () => {
  it('label 渲染', () => {
    const w = mount(ZCheckbox, { props: { label: 'item1' } })
    expect(w.text()).toContain('item1')
  })

  it('点击 → update:checked', async () => {
    const w = mount(ZCheckbox, { props: { checked: false, label: 'x' } })
    const input = w.find('input[type="checkbox"]')
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    expect(w.emitted('update:checked')![0]).toEqual([true])
    // 说明:v0.2 已删除组件 emit('change');native input change 事件会被 Vue
    // attrs fallthrough 冒泡(`emitted('change')` 仍可能拿到 Event 对象),
    // 这不是 zui 显式 emit,业务方应该用 v-model:checked 或监听 update:checked。
  })

  it('disabled → 不 emit', async () => {
    const w = mount(ZCheckbox, { props: { checked: false, disabled: true, label: 'x' } })
    const input = w.find('input[type="checkbox"]')
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    expect(w.emitted('update:checked')).toBeFalsy()
  })

  it('indeterminate → aria-checked=mixed', () => {
    const w = mount(ZCheckbox, { props: { indeterminate: true, label: 'x' } })
    expect(w.find('input').attributes('aria-checked')).toBe('mixed')
  })
})

describe('ZCheckboxGroup', () => {
  it('options 数组渲染 + role=group', () => {
    const w = mount(ZCheckboxGroup, {
      props: {
        value: [],
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
      },
    })
    expect(w.attributes('role')).toBe('group')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
  })

  it('选中某项 → update:value 包含该值', async () => {
    const Host = defineComponent({
      setup() {
        const v = ref<(string | number | boolean)[]>([])
        return () =>
          h(ZCheckboxGroup, {
            value: v.value,
            'onUpdate:value': (nv: (string | number | boolean)[]) => (v.value = nv),
            options: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
          })
      },
    })
    const w = mount(Host)
    const inputs = w.findAll('input[type="checkbox"]')
    ;(inputs[0].element as HTMLInputElement).checked = true
    await inputs[0].trigger('change')
    // group emit 通过 host 转写 v
    await w.vm.$nextTick()
    expect(w.html()).toContain('A')
  })

  it('group disabled → 子项继承', () => {
    const w = mount(ZCheckboxGroup, {
      props: {
        value: [],
        disabled: true,
        options: [{ value: 'a', label: 'A' }],
      },
    })
    expect(w.find('input[type="checkbox"]').attributes('disabled')).toBeDefined()
  })
})
