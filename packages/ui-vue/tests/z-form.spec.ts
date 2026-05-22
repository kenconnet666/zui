/**
 * `ZForm` + `ZFormItem` —— async-validator 集成。
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZForm, ZFormItem, ZInput, type ZFormExpose } from '../src'

describe('ZForm — 渲染', () => {
  it('渲染为 <form>', () => {
    const w = mount(ZForm, {
      props: { model: {} },
      slots: { default: () => 'x' },
    })
    expect(w.element.tagName).toBe('FORM')
  })
})

describe('ZFormItem — 标签 + control slot', () => {
  it('label 渲染', () => {
    const model = reactive({ name: '' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZForm, { model }, () =>
            h(ZFormItem, { prop: 'name', label: '名称' }, () => h(ZInput, { value: model.name })),
          )
      },
    })
    const w = mount(Host)
    expect(w.text()).toContain('名称')
  })

  it('required=true → label 前显示 *', () => {
    const model = reactive({ name: '' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZForm, { model }, () =>
            h(ZFormItem, { prop: 'name', label: '名称', required: true }, () => h('input')),
          )
      },
    })
    const w = mount(Host)
    expect(w.text()).toContain('*')
  })
})

describe('ZFormItem — 校验', () => {
  it('required + 空值 → validate 失败 + errorMsg 写入 DOM', async () => {
    const model = reactive({ name: '' })
    const formRef = ref<ZFormExpose | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZForm,
            { model, ref: (el: unknown) => (formRef.value = el as ZFormExpose | null) },
            () =>
              h(ZFormItem, { prop: 'name', label: '名称', required: true }, () => h('input')),
          )
      },
    })
    const w = mount(Host)
    await nextTick()
    await formRef.value!.validate().catch(() => {})
    await nextTick()
    expect(w.find('[role="alert"]').text()).toContain('必填')
  })

  it('validate 通过 → 不写错误', async () => {
    const model = reactive({ name: '有值' })
    const formRef = ref<ZFormExpose | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZForm,
            { model, ref: (el: unknown) => (formRef.value = el as ZFormExpose | null) },
            () =>
              h(ZFormItem, { prop: 'name', label: '名称', required: true }, () => h('input')),
          )
      },
    })
    const w = mount(Host)
    await nextTick()
    await formRef.value!.validate()
    await nextTick()
    expect(w.find('[role="alert"]').exists()).toBe(false)
  })

  it('rule 自定义校验 — 最小长度', async () => {
    const model = reactive({ name: 'ab' })
    const formRef = ref<ZFormExpose | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZForm,
            { model, ref: (el: unknown) => (formRef.value = el as ZFormExpose | null) },
            () =>
              h(
                ZFormItem,
                {
                  prop: 'name',
                  label: '名称',
                  rule: { type: 'string', min: 3, message: '至少 3 字符' },
                },
                () => h('input'),
              ),
          )
      },
    })
    const w = mount(Host)
    await nextTick()
    await formRef.value!.validate().catch(() => {})
    await nextTick()
    expect(w.find('[role="alert"]').text()).toContain('至少 3 字符')
  })

  it('reset → 清空错误', async () => {
    const model = reactive({ name: '' })
    const formRef = ref<ZFormExpose | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            ZForm,
            { model, ref: (el: unknown) => (formRef.value = el as ZFormExpose | null) },
            () =>
              h(ZFormItem, { prop: 'name', label: '名称', required: true }, () => h('input')),
          )
      },
    })
    const w = mount(Host)
    await nextTick()
    await formRef.value!.validate().catch(() => {})
    await nextTick()
    expect(w.find('[role="alert"]').exists()).toBe(true)
    formRef.value!.reset()
    await nextTick()
    expect(w.find('[role="alert"]').exists()).toBe(false)
  })
})
