/**
 * Phase β 升级 spec:ZTreeSelect / ZTour / ZTable 排序+选择 / ZSelect 多选。
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import {
  ZTreeSelect,
  ZTour,
  ZTable,
  ZSelect,
  type ZTreeNode,
  type ZSelectOption,
  type ZSelectValue,
  type ZTableColumn,
  type ZTableSortState,
  type ZTourStep,
} from '../src'

let wrappers: VueWrapper[] = []

function cleanup(): void {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.querySelectorAll('[role="listbox"], [role="dialog"]').forEach((el) => el.remove())
}

beforeEach(cleanup)
afterEach(cleanup)

describe('ZTreeSelect', () => {
  const TREE: ZTreeNode[] = [
    {
      key: 'root',
      label: 'Root',
      children: [
        { key: 'leaf1', label: 'Leaf 1' },
        { key: 'leaf2', label: 'Leaf 2' },
      ],
    },
  ]

  it('role=combobox + 默认隐藏', () => {
    const w = mount(ZTreeSelect, {
      props: { data: TREE, defaultExpandedKeys: ['root'] },
      attachTo: document.body,
    })
    wrappers.push(w)
    expect(w.find('[role="combobox"]').exists()).toBe(true)
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })

  it('点触发器 → 展开下拉 + 显示 ZTree', async () => {
    const w = mount(ZTreeSelect, {
      props: { data: TREE, defaultExpandedKeys: ['root'] },
      attachTo: document.body,
    })
    wrappers.push(w)
    await w.find('[role="combobox"]').trigger('click')
    expect(document.querySelector('[role="listbox"]')).not.toBeNull()
    expect(document.body.textContent).toContain('Leaf 1')
  })

  it('选叶子 → update:value + 关闭', async () => {
    const value = ref<string | null>(null)
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTreeSelect, {
            data: TREE,
            value: value.value,
            defaultExpandedKeys: ['root'],
            'onUpdate:value': (v: string | null) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('[role="combobox"]').trigger('click')
    // 找 Leaf 1
    const leaf = Array.from(document.querySelectorAll('[role="treeitem"]')).find((el) =>
      el.textContent?.includes('Leaf 1'),
    )!
    ;(leaf as HTMLElement).click()
    await w.vm.$nextTick()
    expect(value.value).toBe('leaf1')
  })

  it('显示选中 label', () => {
    const w = mount(ZTreeSelect, {
      props: { data: TREE, value: 'leaf2', defaultExpandedKeys: ['root'] },
      attachTo: document.body,
    })
    wrappers.push(w)
    expect(w.find('[role="combobox"]').text()).toContain('Leaf 2')
  })
})

describe('ZTour', () => {
  const STEPS: ZTourStep[] = [
    { target: '#step1', title: '第一步', description: '这是第一步' },
    { target: '#step2', title: '第二步' },
  ]

  function setupTargetEls(): void {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<button id="step1">btn1</button><button id="step2">btn2</button>',
    )
  }

  beforeEach(() => {
    document.querySelectorAll('#step1, #step2').forEach((el) => el.remove())
    setupTargetEls()
  })

  it('open=false → 不渲染', () => {
    const w = mount(ZTour, { props: { steps: STEPS, open: false }, attachTo: document.body })
    wrappers.push(w)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('open=true + step 0 → 渲染卡片 + 当前步标题', async () => {
    const w = mount(ZTour, { props: { steps: STEPS, open: true, current: 0 }, attachTo: document.body })
    wrappers.push(w)
    await w.vm.$nextTick()
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.textContent).toContain('第一步')
    expect(document.body.textContent).toContain('1 / 2')
  })

  it('点下一步 → emit update:current', async () => {
    const current = ref(0)
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTour, {
            steps: STEPS,
            open: true,
            current: current.value,
            'onUpdate:current': (v: number) => (current.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.vm.$nextTick()
    const nextBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('下一步'),
    )!
    nextBtn.click()
    await w.vm.$nextTick()
    expect(current.value).toBe(1)
  })

  it('最后一步点完成 → emit finish + open=false', async () => {
    const open = ref(true)
    let finished = false
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTour, {
            steps: STEPS,
            open: open.value,
            current: 1, // 已最后一步
            'onUpdate:open': (v: boolean) => (open.value = v),
            onFinish: () => (finished = true),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.vm.$nextTick()
    const finishBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('完成'),
    )!
    finishBtn.click()
    await w.vm.$nextTick()
    expect(finished).toBe(true)
    expect(open.value).toBe(false)
  })
})

interface Row {
  id: number
  name: string
  age: number
}

describe('ZTable 排序', () => {
  const ROWS: Row[] = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Carol', age: 35 },
  ]
  const COLS: ZTableColumn<Row>[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'age', title: 'Age', sortable: true },
  ]

  it('sortable 列头点击 → emit update:sortState', async () => {
    const sortState = ref<ZTableSortState>({ column: null, order: null })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTable<Row>, {
            columns: COLS,
            data: ROWS,
            sortState: sortState.value,
            'onUpdate:sortState': (s: ZTableSortState) => (sortState.value = s),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('th')
    // 第一个 th 是 Name(可点)
    await headers[0].trigger('click')
    expect(sortState.value).toEqual({ column: 'name', order: 'asc' })
    await headers[0].trigger('click')
    expect(sortState.value).toEqual({ column: 'name', order: 'desc' })
    await headers[0].trigger('click')
    expect(sortState.value).toEqual({ column: null, order: null })
  })

  it('按 age asc 排序 → 数据顺序变 Bob/Alice/Carol', () => {
    const w = mount(ZTable<Row>, {
      props: {
        columns: COLS,
        data: ROWS,
        sortState: { column: 'age', order: 'asc' },
      },
    })
    const rows = w.findAll('tbody tr')
    expect(rows[0].text()).toContain('Bob')
    expect(rows[1].text()).toContain('Alice')
    expect(rows[2].text()).toContain('Carol')
  })

  it('aria-sort=ascending', () => {
    const w = mount(ZTable<Row>, {
      props: {
        columns: COLS,
        data: ROWS,
        sortState: { column: 'name', order: 'asc' },
      },
    })
    const headers = w.findAll('th')
    expect(headers[0].attributes('aria-sort')).toBe('ascending')
    expect(headers[1].attributes('aria-sort')).toBe('none')
  })
})

describe('ZTable 行选择', () => {
  const ROWS: Row[] = [
    { id: 1, name: 'A', age: 1 },
    { id: 2, name: 'B', age: 2 },
  ]
  const COLS: ZTableColumn<Row>[] = [{ key: 'name', title: 'N' }]

  it('selectable=true → 多一列 checkbox', () => {
    const w = mount(ZTable<Row>, {
      props: { columns: COLS, data: ROWS, selectable: true },
    })
    // 表头多一列 + 每行多一列
    expect(w.findAll('thead th').length).toBe(2)
    expect(w.findAll('tbody tr')[0].findAll('td').length).toBe(2)
  })

  it('点行 checkbox → emit update:selectedKeys', async () => {
    const selected = ref<(string | number)[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTable<Row>, {
            columns: COLS,
            data: ROWS,
            selectable: true,
            selectedKeys: selected.value,
            'onUpdate:selectedKeys': (k: (string | number)[]) => (selected.value = k),
          })
      },
    })
    const w = mount(Host)
    const checkboxes = w.findAll('tbody input[type="checkbox"]')
    await checkboxes[0].trigger('change')
    expect(selected.value).toContain(1)
  })

  it('全选 checkbox', async () => {
    const selected = ref<(string | number)[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZTable<Row>, {
            columns: COLS,
            data: ROWS,
            selectable: true,
            selectedKeys: selected.value,
            'onUpdate:selectedKeys': (k: (string | number)[]) => (selected.value = k),
          })
      },
    })
    const w = mount(Host)
    const headCheckbox = w.find('thead input[type="checkbox"]')
    ;(headCheckbox.element as HTMLInputElement).checked = true
    await headCheckbox.trigger('change')
    expect(selected.value).toEqual([1, 2])
  })
})

describe('ZSelect 多选', () => {
  const OPTS: ZSelectOption[] = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana' },
    { value: 'c', label: 'Cherry' },
  ]

  it('multiple=true → aria-multiselectable + value 是数组', () => {
    const w = mount(ZSelect, {
      props: { value: ['a'], options: OPTS, multiple: true },
      attachTo: document.body,
    })
    wrappers.push(w)
    const trig = w.find('[role="combobox"]')
    expect(trig.attributes('aria-multiselectable')).toBe('true')
    expect(trig.text()).toContain('Apple')
  })

  it('多选下点选项 → toggle 数组,不关闭', async () => {
    const value = ref<ZSelectValue | ZSelectValue[] | null>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZSelect, {
            value: value.value,
            options: OPTS,
            multiple: true,
            'onUpdate:value': (v: ZSelectValue | ZSelectValue[] | null) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    await w.find('[role="combobox"]').trigger('click')
    await w.vm.$nextTick()
    // 每次 click 后 Vue 重新渲染下拉,需要重新 query options
    function getOpts(): Element[] {
      return Array.from(document.querySelectorAll('[role="option"]'))
    }
    ;(getOpts()[0] as HTMLElement).click()
    await w.vm.$nextTick()
    expect(value.value).toEqual(['a'])
    ;(getOpts()[1] as HTMLElement).click()
    await w.vm.$nextTick()
    expect(value.value).toEqual(['a', 'b'])
    ;(getOpts()[0] as HTMLElement).click() // toggle off
    await w.vm.$nextTick()
    expect(value.value).toEqual(['b'])
  })

  it('多选 + clearable + 有选 → clearable 显示,点 clear → []', async () => {
    const value = ref<ZSelectValue | ZSelectValue[] | null>(['a', 'b'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZSelect, {
            value: value.value,
            options: OPTS,
            multiple: true,
            clearable: true,
            'onUpdate:value': (v: ZSelectValue | ZSelectValue[] | null) => (value.value = v),
          })
      },
    })
    const w = mount(Host, { attachTo: document.body })
    wrappers.push(w)
    const clear = w.find('button[aria-label="清空"]')
    expect(clear.exists()).toBe(true)
    await clear.trigger('click')
    expect(value.value).toEqual([])
  })
})
