/**
 * `ZInputOTP` —— 一次性密码输入框测试。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZBox } from '../src'
import ZInputOTP from '../src/input/ZInputOTP.vue'

/** 在 ZBox 主题上下文内挂 ZInputOTP，简化每个测试的 mount 调用。 */
function mountOTP(props: Record<string, unknown> = {}) {
  const Host = defineComponent({
    setup() {
      return () => h(ZBox, {}, { default: () => h(ZInputOTP, props) })
    },
  })
  return mount(Host)
}

// ─── 渲染 ───

describe('ZInputOTP — 渲染', () => {
  it('默认渲染 6 个 input', () => {
    const w = mountOTP({ value: '' })
    expect(w.findAll('input').length).toBe(6)
  })

  it('length=4 → 渲染 4 个 input', () => {
    const w = mountOTP({ value: '', length: 4 })
    expect(w.findAll('input').length).toBe(4)
  })

  it('value 正确分配到各 input', () => {
    const w = mountOTP({ value: 'ABC', length: 4 })
    const inputs = w.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('A')
    expect((inputs[1].element as HTMLInputElement).value).toBe('B')
    expect((inputs[2].element as HTMLInputElement).value).toBe('C')
    expect((inputs[3].element as HTMLInputElement).value).toBe('')
  })

  it('container 有 role=group', () => {
    const w = mountOTP({ value: '' })
    expect(w.find('[role="group"]').exists()).toBe(true)
  })

  it('每个 input 有 aria-label="OTP digit N"', () => {
    const w = mountOTP({ value: '', length: 3 })
    const inputs = w.findAll('input')
    expect(inputs[0].attributes('aria-label')).toBe('OTP digit 1')
    expect(inputs[1].attributes('aria-label')).toBe('OTP digit 2')
    expect(inputs[2].attributes('aria-label')).toBe('OTP digit 3')
  })

  it('disabled → 所有 input disabled', () => {
    const w = mountOTP({ value: '', disabled: true })
    w.findAll('input').forEach(inp => {
      expect(inp.attributes('disabled')).toBeDefined()
    })
  })

  it('type=number → inputmode=numeric', () => {
    const w = mountOTP({ value: '', type: 'number' })
    w.findAll('input').forEach(inp => {
      expect(inp.attributes('inputmode')).toBe('numeric')
    })
  })
})

// ─── 打字 / v-model ───

describe('ZInputOTP — 打字与 update:value', () => {
  it('在第 0 格输入 → emit update:value', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '' }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input = w.findAll('input')[0]
    ;(input.element as HTMLInputElement).value = 'A'
    await input.trigger('input')
    expect(otp.emitted('update:value')).toBeTruthy()
    expect(otp.emitted('update:value')![0]).toEqual(['A'])
  })

  it('打满 4 格 → emit complete', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, {
            default: () =>
              h(ZInputOTP, {
                value: value.value,
                length: 4,
                'onUpdate:value': (v: string) => (value.value = v),
              }),
          })
      },
    })
    const w = mount(Host)

    const type = async (idx: number, ch: string): Promise<void> => {
      const input = w.findAll('input')[idx]
      ;(input.element as HTMLInputElement).value = ch
      await input.trigger('input')
      await w.vm.$nextTick()
    }

    await type(0, '1')
    await type(1, '2')
    await type(2, '3')
    await type(3, '4')

    const otp = w.findComponent(ZInputOTP)
    const completeEmits = otp.emitted('complete')
    expect(completeEmits).toBeTruthy()
    expect(completeEmits!.at(-1)).toEqual(['1234'])
  })
})

// ─── Backspace ───

describe('ZInputOTP — Backspace', () => {
  it('Backspace 在非空格 → 清当前格 emit', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: 'AB', length: 3 }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input1 = w.findAll('input')[1]
    await input1.trigger('keydown', { key: 'Backspace' })
    expect(otp.emitted('update:value')).toBeTruthy()
    const emitted = otp.emitted('update:value')!.at(-1) as [string]
    // 第 1 格（'B'）被清掉，剩 'A'
    expect(emitted[0]).toBe('A')
  })

  it('Backspace 在空格 → 清前一格 emit', async () => {
    // value='A'，光标在第 1 格（空）
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: 'A', length: 3 }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input1 = w.findAll('input')[1]
    await input1.trigger('keydown', { key: 'Backspace' })
    expect(otp.emitted('update:value')).toBeTruthy()
    const emitted = otp.emitted('update:value')!.at(-1) as [string]
    expect(emitted[0]).toBe('')
  })
})

// ─── 粘贴 ───

describe('ZInputOTP — 粘贴', () => {
  it('粘贴 "1234" 从第 0 格起 → emit "1234"', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '', length: 4 }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input0 = w.findAll('input')[0]
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    })
    pasteEvent.clipboardData!.setData('text', '1234')
    await input0.element.dispatchEvent(pasteEvent)
    await w.vm.$nextTick()
    expect(otp.emitted('update:value')).toBeTruthy()
    expect(otp.emitted('update:value')!.at(-1)).toEqual(['1234'])
  })

  it('粘贴超长字符串 → 截断到 length', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '', length: 4 }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input0 = w.findAll('input')[0]
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    })
    pasteEvent.clipboardData!.setData('text', '123456789')
    await input0.element.dispatchEvent(pasteEvent)
    await w.vm.$nextTick()
    const emitted = otp.emitted('update:value')!.at(-1) as [string]
    expect(emitted[0].length).toBeLessThanOrEqual(4)
  })
})

// ─── disabled ───

describe('ZInputOTP — disabled', () => {
  it('disabled → 打字无 emit', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '', disabled: true }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input = w.findAll('input')[0]
    ;(input.element as HTMLInputElement).value = 'X'
    await input.trigger('input')
    expect(otp.emitted('update:value')).toBeFalsy()
  })

  it('disabled → Backspace 无 emit', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: 'A', disabled: true }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    await w.findAll('input')[0].trigger('keydown', { key: 'Backspace' })
    expect(otp.emitted('update:value')).toBeFalsy()
  })
})

// ─── type=number 过滤 ───

describe('ZInputOTP — type=number', () => {
  it('输入字母 → 不 emit 有效值（被过滤）', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '', type: 'number' }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input = w.findAll('input')[0]
    ;(input.element as HTMLInputElement).value = 'a'
    await input.trigger('input')
    // 'a' 被过滤后为空，onInput 直接 return，不触发 emit
    expect(otp.emitted('update:value')).toBeFalsy()
  })

  it('输入数字 → 正常 emit', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, {}, { default: () => h(ZInputOTP, { value: '', type: 'number' }) })
      },
    })
    const w = mount(Host)
    const otp = w.findComponent(ZInputOTP)
    const input = w.findAll('input')[0]
    ;(input.element as HTMLInputElement).value = '5'
    await input.trigger('input')
    expect(otp.emitted('update:value')).toBeTruthy()
    expect(otp.emitted('update:value')![0]).toEqual(['5'])
  })
})
