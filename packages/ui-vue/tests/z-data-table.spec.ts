/**
 * `ZDataTable` 综合 spec(Sprint 3)。
 *
 * 在 ZBox iem=16px 子树内挂载,iemPx=16 → rowSize=3 等价 48px。
 * 列宽计算 / 排序 / 选中 / 行点击 / 空态 / loading。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ZDataTable, ZBox, type ZDataTableColumn, type ZDataTableSort } from '../src'

type Row = { id: number; name: string; age: number }

const SAMPLE: Row[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 28 },
  { id: 4, name: 'Dave', age: 35 },
  { id: 5, name: 'Eve', age: 22 },
]

const COLUMNS: ZDataTableColumn<Row>[] = [
  { key: 'id', title: 'ID', width: 4, sortable: true },
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', width: 5, align: 'right', sortable: true },
]

class StubRO {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  ;(globalThis as unknown as { ResizeObserver: typeof StubRO }).ResizeObserver = StubRO
})
afterEach(() => {
  vi.useRealTimers()
})

function fakeScrollEl(el: HTMLElement, clientHeight: number): void {
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight })
  let scrollTop = 0
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (v) => {
      scrollTop = v
      el.dispatchEvent(new Event('scroll'))
    },
  })
}

/** 在 ZBox iem=16px 内挂 ZDataTable。 */
function mountDT(props: Record<string, unknown>) {
  const Host = defineComponent({
    setup() {
      return () =>
        h(ZBox, { iem: '16px' }, {
          default: () => h(ZDataTable, props),
        })
    },
  })
  const w = mount(Host)
  return { w, root: w.element.firstElementChild as HTMLElement }
}

describe('ZDataTable — 基础结构', () => {
  it('渲染 role=table + 列头', async () => {
    const { w } = mountDT({ rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20 })
    expect(w.find('[role="table"]').exists()).toBe(true)
    const columnHeaders = w.findAll('[role="columnheader"]')
    expect(columnHeaders.length).toBe(3)
    expect(columnHeaders[0]?.text()).toContain('ID')
    expect(columnHeaders[1]?.text()).toContain('姓名')
    expect(columnHeaders[2]?.text()).toContain('年龄')
    w.unmount()
  })

  it('渲染 rows 数据(强制 viewport 后)', async () => {
    const { w, root } = mountDT({ rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20 })
    const vlContainer = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vlContainer, 240)
    vlContainer.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(w.text()).toContain('Alice')
    expect(w.text()).toContain('Eve')
    w.unmount()
  })

  it('空 rows → 显示 emptyText', () => {
    const { w } = mountDT({ rows: [], columns: COLUMNS, rowSize: 3, height: 20 })
    expect(w.text()).toContain('暂无数据')
    w.unmount()
  })

  it('emptyText 自定义', () => {
    const { w } = mountDT({
      rows: [], columns: COLUMNS, rowSize: 3, height: 20, emptyText: '无结果',
    })
    expect(w.text()).toContain('无结果')
    w.unmount()
  })
})

describe('ZDataTable — 排序', () => {
  it('点击 sortable 列头 → emit update:sort asc', async () => {
    const events: ZDataTableSort[][] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                'onUpdate:sort': (s: ZDataTableSort) => events.push([s]),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('[role="columnheader"]')
    await headers[0]!.trigger('click')  // ID 列
    expect(events[0]?.[0]).toEqual({ key: 'id', order: 'asc' })
    w.unmount()
  })

  it('再次点击同列 → desc', async () => {
    const sort = ref<ZDataTableSort | null>({ key: 'id', order: 'asc' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                sort: sort.value,
                'onUpdate:sort': (s: ZDataTableSort | null) => (sort.value = s),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('[role="columnheader"]')
    await headers[0]!.trigger('click')
    expect(sort.value).toEqual({ key: 'id', order: 'desc' })
    w.unmount()
  })

  it('第三次点击 → null(取消排序)', async () => {
    const sort = ref<ZDataTableSort | null>({ key: 'id', order: 'desc' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                sort: sort.value,
                'onUpdate:sort': (s: ZDataTableSort | null) => (sort.value = s),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const headers = w.findAll('[role="columnheader"]')
    await headers[0]!.trigger('click')
    expect(sort.value).toBeNull()
    w.unmount()
  })

  it('sort 应用后 rows 实际排序', async () => {
    const sort = ref<ZDataTableSort | null>({ key: 'age', order: 'asc' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                sort: sort.value,
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const root = w.element.firstElementChild as HTMLElement
    const vl = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vl, 240)
    vl.dispatchEvent(new Event('scroll'))
    await nextTick()
    // age 升序:Eve(22) < Bob(25) < Carol(28) < Alice(30) < Dave(35)
    // 第一行应是 Eve
    const rows = root.querySelectorAll('[role="row"]')
    expect(rows[0]?.textContent).toContain('Eve')
    w.unmount()
  })
})

describe('ZDataTable — 选中', () => {
  it("selection='none' → 不渲染 checkbox 列", () => {
    const { w } = mountDT({ rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20 })
    const checkboxes = w.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(0)
    w.unmount()
  })

  it("selection='multiple' → 渲染表头全选 checkbox", () => {
    const { w } = mountDT({
      rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
      selection: 'multiple',
    })
    // 表头一个全选 checkbox(行内的还没渲染,因为 viewport 没注入)
    const headerCheckbox = w.find('[role="columnheader"] input[type="checkbox"]')
    expect(headerCheckbox.exists()).toBe(true)
    w.unmount()
  })

  it("multiple 行点击 → toggle selected", async () => {
    const selected = ref<(string | number)[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                selection: 'multiple',
                selected: selected.value,
                'onUpdate:selected': (s: (string | number)[]) => (selected.value = s),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const root = w.element.firstElementChild as HTMLElement
    const vl = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vl, 240)
    vl.dispatchEvent(new Event('scroll'))
    await nextTick()
    // 点第一行
    const rows = root.querySelectorAll('[role="row"]')
    await (rows[0] as HTMLElement).click()
    expect(selected.value).toEqual([1])
    // 再点取消
    await (rows[0] as HTMLElement).click()
    expect(selected.value).toEqual([])
    w.unmount()
  })

  it("single 模式只保留一个", async () => {
    const selected = ref<(string | number)[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                selection: 'single',
                selected: selected.value,
                'onUpdate:selected': (s: (string | number)[]) => (selected.value = s),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const root = w.element.firstElementChild as HTMLElement
    const vl = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vl, 240)
    vl.dispatchEvent(new Event('scroll'))
    await nextTick()
    const rows = root.querySelectorAll('[role="row"]')
    await (rows[0] as HTMLElement).click()
    expect(selected.value).toEqual([1])
    // 点第二行,只剩 id=2(single 替换)
    await (rows[1] as HTMLElement).click()
    expect(selected.value).toEqual([2])
    w.unmount()
  })

  it('全选 checkbox 点击 → 选全部 / 取消全部', async () => {
    const selected = ref<(string | number)[]>([])
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                selection: 'multiple',
                selected: selected.value,
                'onUpdate:selected': (s: (string | number)[]) => (selected.value = s),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const headerCb = w.find('[role="columnheader"] input[type="checkbox"]')
    await headerCb.trigger('change')
    expect(selected.value).toEqual([1, 2, 3, 4, 5])
    await headerCb.trigger('change')
    expect(selected.value).toEqual([])
    w.unmount()
  })
})

describe('ZDataTable — 行点击 emit', () => {
  it('emit row-click(row, index, event)', async () => {
    const events: unknown[][] = []
    const Host = defineComponent({
      setup() {
        return () =>
          h(ZBox, { iem: '16px' }, {
            default: () =>
              h(ZDataTable, {
                rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20,
                onRowClick: (row: Row, index: number) => events.push([row, index]),
              } as Record<string, unknown>),
          })
      },
    })
    const w = mount(Host)
    const root = w.element.firstElementChild as HTMLElement
    const vl = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vl, 240)
    vl.dispatchEvent(new Event('scroll'))
    await nextTick()
    const rows = root.querySelectorAll('[role="row"]')
    await (rows[0] as HTMLElement).click()
    expect(events.length).toBe(1)
    expect(events[0]?.[1]).toBe(0)
    w.unmount()
  })
})

describe('ZDataTable — loading + bordered + stripe', () => {
  it('loading=true → 显示遮罩', () => {
    const { w } = mountDT({
      rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20, loading: true,
    })
    const mask = w.find('[role="status"][aria-busy="true"]')
    expect(mask.exists()).toBe(true)
    w.unmount()
  })

  it('bordered → 边框样式', () => {
    mountDT({
      rows: SAMPLE, columns: COLUMNS, rowSize: 3, height: 20, bordered: true,
    })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-width:1px/)
  })
})

describe('ZDataTable — 自定义渲染', () => {
  it('col.render 函数', async () => {
    const customColumns: ZDataTableColumn<Row>[] = [
      { key: 'id', title: 'ID', width: 4 },
      {
        key: 'name',
        title: '姓名',
        render: (row) => `<${row.name}>` as unknown as string,  // 字符串模式
      },
    ]
    const { w, root } = mountDT({
      rows: SAMPLE.slice(0, 2), columns: customColumns, rowSize: 3, height: 20,
    })
    const vl = root.querySelector('[data-zv-wrapper]')?.parentElement as HTMLElement
    fakeScrollEl(vl, 200)
    vl.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(w.text()).toContain('<Alice>')
    w.unmount()
  })
})
