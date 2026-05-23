/**
 * Phase β 批 5 spec:ZTree / ZUpload / ZDatePicker / ZTimePicker / ZColorPicker.
 */
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  ZTree,
  ZUpload,
  ZDatePicker,
  ZTimePicker,
  ZColorPicker,
  type ZTreeNode,
  type ZUploadedFile,
} from '../src'

const TREE_DATA: ZTreeNode[] = [
  {
    key: 'a',
    label: 'A',
    children: [
      { key: 'a1', label: 'A1' },
      { key: 'a2', label: 'A2', disabled: true },
    ],
  },
  { key: 'b', label: 'B' },
]

describe('ZTree', () => {
  it('role=tree + 顶层节点渲染', () => {
    const w = mount(ZTree, { props: { data: TREE_DATA } })
    expect(w.attributes('role')).toBe('tree')
    expect(w.text()).toContain('A')
    expect(w.text()).toContain('B')
    // 默认未展开,A1 / A2 不可见
    expect(w.text()).not.toContain('A1')
  })

  it('expandedKeys 控制展开 → 渲染子节点', () => {
    const w = mount(ZTree, { props: { data: TREE_DATA, expandedKeys: ['a'] } })
    expect(w.text()).toContain('A1')
    expect(w.text()).toContain('A2')
  })

  it('点击有子节点 → toggle expand', async () => {
    const expanded = ref<string[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTree, {
            data: TREE_DATA,
            expandedKeys: expanded.value,
            'onUpdate:expandedKeys': (k: string[]) => (expanded.value = k),
          })
      },
    })
    const w = mount(Host)
    const items = w.findAll('[role="treeitem"]')
    await items[0].trigger('click')
    expect(expanded.value).toEqual(['a'])
  })

  it('点击叶子 → update:selectedKey', async () => {
    const selected = ref<string | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTree, {
            data: TREE_DATA,
            expandedKeys: ['a'],
            selectedKey: selected.value,
            'onUpdate:selectedKey': (k: string | null) => (selected.value = k),
          })
      },
    })
    const w = mount(Host)
    const items = w.findAll('[role="treeitem"]')
    // items[0]=A, [1]=A1, [2]=A2, [3]=B
    await items[1].trigger('click')
    expect(selected.value).toBe('a1')
  })

  it('disabled 节点 → aria-disabled=true', async () => {
    const w = mount(ZTree, { props: { data: TREE_DATA, expandedKeys: ['a'] } })
    const items = w.findAll('[role="treeitem"]')
    expect(items.length).toBe(4)
    // items[2] 是 A2(disabled)
    expect(items[2].attributes('aria-disabled')).toBe('true')
  })
})

describe('ZUpload', () => {
  it('default 渲染拖拽区文案', () => {
    const w = mount(ZUpload)
    expect(w.text()).toContain('点击或拖拽')
  })

  it('选择文件 → emit change + update:fileList', async () => {
    const list = ref<ZUploadedFile[]>([])
    let changed: File[] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZUpload, {
            fileList: list.value,
            'onUpdate:fileList': (l: ZUploadedFile[]) => (list.value = l),
            onChange: (files: File[]) => (changed = files),
          })
      },
    })
    const w = mount(Host)
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
    const input = w.find('input[type="file"]').element as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    await w.find('input[type="file"]').trigger('change')
    expect(list.value.length).toBe(1)
    expect(list.value[0].name).toBe('test.txt')
    expect(changed.length).toBe(1)
  })

  it('fileList 渲染 + 点击移除 → emit remove', async () => {
    const list = ref<ZUploadedFile[]>([
      { uid: '1', name: 'a.txt', size: 100, type: 'text/plain', status: 'success' },
    ])
    let removed: ZUploadedFile | null = null
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZUpload, {
            fileList: list.value,
            'onUpdate:fileList': (l: ZUploadedFile[]) => (list.value = l),
            onRemove: (f: ZUploadedFile) => (removed = f),
          })
      },
    })
    const w = mount(Host)
    expect(w.text()).toContain('a.txt')
    expect(w.text()).toContain('100 B')
    const removeBtn = w.find('button[aria-label="移除"]')
    await removeBtn.trigger('click')
    expect(removed!.uid).toBe('1')
    expect(list.value.length).toBe(0)
  })
})

describe('ZDatePicker', () => {
  it('input type=date + value', () => {
    const w = mount(ZDatePicker, { props: { value: '2026-05-23' } })
    const input = w.find('input').element as HTMLInputElement
    expect(input.type).toBe('date')
    expect(input.value).toBe('2026-05-23')
  })

  it('input → update:value', async () => {
    const w = mount(ZDatePicker, { props: { value: '' } })
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = '2026-06-01'
    await input.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual(['2026-06-01'])
  })

  it('disabled', () => {
    const w = mount(ZDatePicker, { props: { value: '', disabled: true } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('ZTimePicker', () => {
  it('input type=time', () => {
    const w = mount(ZTimePicker, { props: { value: '10:30' } })
    const input = w.find('input').element as HTMLInputElement
    expect(input.type).toBe('time')
    expect(input.value).toBe('10:30')
  })

  it('input → update:value', async () => {
    const w = mount(ZTimePicker, { props: { value: '00:00' } })
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = '14:45'
    await input.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual(['14:45'])
  })
})

describe('ZColorPicker', () => {
  it('显示色块 + 文字 + 隐藏 input[type=color]', () => {
    const w = mount(ZColorPicker, { props: { value: '#ff0000' } })
    const input = w.find('input').element as HTMLInputElement
    expect(input.type).toBe('color')
    expect(w.text()).toContain('#ff0000')
  })

  it('input → update:value', async () => {
    const w = mount(ZColorPicker, { props: { value: '#000000' } })
    const input = w.find('input')
    ;(input.element as HTMLInputElement).value = '#00ff00'
    await input.trigger('input')
    expect(w.emitted('update:value')![0]).toEqual(['#00ff00'])
  })

  it('showText=false → 不显示文字', () => {
    const w = mount(ZColorPicker, { props: { value: '#ff0000', showText: false } })
    expect(w.text()).not.toContain('#ff0000')
  })
})
