/**
 * `ZSelect` —— 单选下拉(Phase α v1)。
 */
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZSelect, type ZSelectValue } from '../src'

afterEach(() => {
  // 清理 Teleport 残留
  document.body.querySelectorAll('[role="listbox"]').forEach(el => el.remove())
})

function makeHost(
  value: ReturnType<typeof ref<ZSelectValue | null>>,
  extraProps: Record<string, unknown> = {},
) {
  return defineComponent({
    setup() {
      return () =>
        h(ZSelect, {
          value: value.value,
          'onUpdate:value': (nv: ZSelectValue | null) => (value.value = nv),
          options: [
            { value: 'a', label: 'Apple' },
            { value: 'b', label: 'Banana' },
            { value: 'c', label: 'Cherry', disabled: true },
          ],
          ...extraProps,
        })
    },
  })
}

describe('ZSelect — 渲染', () => {
  it('role=combobox + aria-expanded=false', () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value), { attachTo: document.body })
    const trig = w.find('[role="combobox"]')
    expect(trig.exists()).toBe(true)
    expect(trig.attributes('aria-expanded')).toBe('false')
  })

  it('value=a → 显示 "Apple"', () => {
    const value = ref<ZSelectValue | null>('a')
    const w = mount(makeHost(value), { attachTo: document.body })
    expect(w.text()).toContain('Apple')
  })

  it('placeholder 在未选时显示', () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value, { placeholder: '请选择' }), { attachTo: document.body })
    expect(w.text()).toContain('请选择')
  })
})

describe('ZSelect — 打开 / 关闭', () => {
  it('点击触发器 → aria-expanded=true,下拉渲染 listbox', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    expect(w.find('[role="combobox"]').attributes('aria-expanded')).toBe('true')
    expect(document.querySelector('[role="listbox"]')).not.toBeNull()
  })

  it('Escape → 关闭下拉', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(w.find('[role="combobox"]').attributes('aria-expanded')).toBe('false')
  })
})

describe('ZSelect — 选中', () => {
  it('点选项 → update:value + 关闭', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    await nextTick()
    const opts = document.querySelectorAll('[role="option"]')
    expect(opts.length).toBe(3)
    ;(opts[1] as HTMLElement).click()
    await nextTick()
    expect(value.value).toBe('b')
    expect(w.find('[role="combobox"]').attributes('aria-expanded')).toBe('false')
  })

  it('disabled 选项点击 → 不 emit', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    await nextTick()
    const disabledOpt = document.querySelectorAll('[role="option"]')[2] as HTMLElement
    expect(disabledOpt.getAttribute('aria-disabled')).toBe('true')
    disabledOpt.click()
    await nextTick()
    expect(value.value).toBeNull()
  })
})

describe('ZSelect — clearable / disabled', () => {
  it('clearable + 有值 → 显示清空按钮,点击 emit update:value(null)', async () => {
    const value = ref<ZSelectValue | null>('a')
    const w = mount(makeHost(value, { clearable: true }), { attachTo: document.body })
    const clear = w.find('button[aria-label="清空"]')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')
    expect(value.value).toBeNull()
  })

  it('disabled → 点击不打开', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value, { disabled: true }), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    expect(w.find('[role="combobox"]').attributes('aria-expanded')).toBe('false')
  })
})

describe('ZSelect — filterable', () => {
  it('filterable + 输入过滤 → 只显示匹配项', async () => {
    const value = ref<ZSelectValue | null>(null)
    const w = mount(makeHost(value, { filterable: true }), { attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    await nextTick()
    const input = w.find('input')
    expect(input.exists()).toBe(true)
    ;(input.element as HTMLInputElement).value = 'an'
    await input.trigger('input')
    await nextTick()
    const opts = document.querySelectorAll('[role="option"]')
    // 'Banana' 包含 'an','Apple' 不包含,'Cherry' 不包含
    expect(opts.length).toBe(1)
  })
})
