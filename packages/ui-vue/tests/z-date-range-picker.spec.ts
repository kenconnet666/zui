/**
 * `ZDateRangePicker` —— 日期范围选择器（开始~结束）。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import ZDateRangePicker from '../src/input/ZDateRangePicker.vue'

// --------------------------------------------------------------------------
// tests
// --------------------------------------------------------------------------

describe('ZDateRangePicker — 渲染', () => {
  it('渲染两个 input[type=date]', () => {
    const w = mount(ZDateRangePicker)
    const inputs = w.findAll('input[type="date"]')
    expect(inputs.length).toBe(2)
  })

  it('渲染分隔符（默认 ~）', () => {
    const w = mount(ZDateRangePicker)
    expect(w.text()).toContain('~')
  })

  it('自定义 separator 渲染', () => {
    const w = mount(ZDateRangePicker, { props: { separator: 'to' } })
    expect(w.text()).toContain('to')
  })

  it('container 带 role=group', () => {
    const w = mount(ZDateRangePicker)
    const group = w.find('[role="group"]')
    expect(group.exists()).toBe(true)
  })

  it('两个 input 分别有 aria-label', () => {
    const w = mount(ZDateRangePicker)
    const inputs = w.findAll('input[type="date"]')
    expect(inputs[0].attributes('aria-label')).toBe('开始日期')
    expect(inputs[1].attributes('aria-label')).toBe('结束日期')
  })
})

describe('ZDateRangePicker — value 绑定', () => {
  it('value 传入后两个 input 显示对应值', () => {
    const w = mount(ZDateRangePicker, { props: { value: ['2026-01-01', '2026-12-31'] } })
    const inputs = w.findAll('input[type="date"]')
    expect((inputs[0].element as HTMLInputElement).value).toBe('2026-01-01')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2026-12-31')
  })

  it('value=null 时两个 input 值为空', () => {
    const w = mount(ZDateRangePicker, { props: { value: null } })
    const inputs = w.findAll('input[type="date"]')
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
    expect((inputs[1].element as HTMLInputElement).value).toBe('')
  })

  it('value 未传时两个 input 值为空', () => {
    const w = mount(ZDateRangePicker)
    const inputs = w.findAll('input[type="date"]')
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
    expect((inputs[1].element as HTMLInputElement).value).toBe('')
  })
})

describe('ZDateRangePicker — update:value emit', () => {
  it('设置开始日期 → emit update:value [start, ""]', async () => {
    const w = mount(ZDateRangePicker)
    const inputs = w.findAll('input[type="date"]')
    ;(inputs[0].element as HTMLInputElement).value = '2026-03-01'
    await inputs[0].trigger('input')
    const emitted = w.emitted('update:value')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([['2026-03-01', '']])
  })

  it('已有开始日期时设置结束日期 → emit update:value [start, end]', async () => {
    const w = mount(ZDateRangePicker, { props: { value: ['2026-01-01', ''] as [string, string] } })
    const inputs = w.findAll('input[type="date"]')
    ;(inputs[1].element as HTMLInputElement).value = '2026-06-30'
    await inputs[1].trigger('input')
    const emitted = w.emitted('update:value')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([['2026-01-01', '2026-06-30']])
  })

  it('change 事件也触发 emit change', async () => {
    const w = mount(ZDateRangePicker, { props: { value: ['2026-01-01', ''] as [string, string] } })
    const inputs = w.findAll('input[type="date"]')
    ;(inputs[1].element as HTMLInputElement).value = '2026-12-31'
    await inputs[1].trigger('change')
    const emitted = w.emitted('change')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([['2026-01-01', '2026-12-31']])
  })
})

describe('ZDateRangePicker — 反转范围防护', () => {
  it('结束 input 的 min = 开始日期（防倒置）', () => {
    const value = ref<[string, string] | null>(['2026-03-01', '2026-06-30'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZDateRangePicker, {
            value: value.value,
            'onUpdate:value': (v: [string, string] | null) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const inputs = w.findAll('input[type="date"]')
    // 结束 input 的 min 应等于当前开始日期
    expect(inputs[1].attributes('min')).toBe('2026-03-01')
  })

  it('开始 input 的 max = 结束日期（防倒置）', () => {
    const value = ref<[string, string] | null>(['2026-03-01', '2026-06-30'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZDateRangePicker, {
            value: value.value,
            'onUpdate:value': (v: [string, string] | null) => (value.value = v),
          })
      },
    })
    const w = mount(Host)
    const inputs = w.findAll('input[type="date"]')
    // 开始 input 的 max 应等于当前结束日期
    expect(inputs[0].attributes('max')).toBe('2026-06-30')
  })

  it('props.min 与 startValue 共存时 endMin = max(min, start)', () => {
    // min=2026-01-01, start=2026-03-01 → endMin should be 2026-03-01（start 更晚）
    const w = mount(ZDateRangePicker, {
      props: { value: ['2026-03-01', ''] as [string, string], min: '2026-01-01' },
    })
    const inputs = w.findAll('input[type="date"]')
    expect(inputs[1].attributes('min')).toBe('2026-03-01')
  })

  it('props.max 与 endValue 共存时 startMax = min(max, end)', () => {
    // max=2026-12-31, end=2026-06-30 → startMax should be 2026-06-30（end 更早）
    const w = mount(ZDateRangePicker, {
      props: { value: ['', '2026-06-30'] as [string, string], max: '2026-12-31' },
    })
    const inputs = w.findAll('input[type="date"]')
    expect(inputs[0].attributes('max')).toBe('2026-06-30')
  })
})

describe('ZDateRangePicker — disabled', () => {
  it('disabled=true 时两个 input 均为 disabled', () => {
    const w = mount(ZDateRangePicker, { props: { disabled: true } })
    const inputs = w.findAll('input[type="date"]')
    expect(inputs[0].attributes('disabled')).toBeDefined()
    expect(inputs[1].attributes('disabled')).toBeDefined()
  })

  it('disabled=false 时两个 input 均不含 disabled 属性', () => {
    const w = mount(ZDateRangePicker, { props: { disabled: false } })
    const inputs = w.findAll('input[type="date"]')
    expect(inputs[0].attributes('disabled')).toBeUndefined()
    expect(inputs[1].attributes('disabled')).toBeUndefined()
  })
})
