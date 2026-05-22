/**
 * `ZTable` —— 基础表格(配置式)。
 */
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { ZTable, type ZTableColumn } from '../src'

interface Row {
  id: number
  name: string
  age: number
}

const ROWS: Row[] = [
  { id: 1, name: 'Alice', age: 28 },
  { id: 2, name: 'Bob', age: 35 },
  { id: 3, name: 'Carol', age: 42 },
]

const COLS: ZTableColumn<Row>[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', align: 'right' },
]

describe('ZTable', () => {
  it('渲染 <table> 结构', () => {
    const w = mount(ZTable<Row>, { props: { columns: COLS, data: ROWS } })
    expect(w.find('table').exists()).toBe(true)
    expect(w.findAll('thead th').length).toBe(2)
    expect(w.findAll('tbody tr').length).toBe(3)
  })

  it('表头文字', () => {
    const w = mount(ZTable<Row>, { props: { columns: COLS, data: ROWS } })
    expect(w.text()).toContain('姓名')
    expect(w.text()).toContain('年龄')
  })

  it('数据渲染', () => {
    const w = mount(ZTable<Row>, { props: { columns: COLS, data: ROWS } })
    expect(w.text()).toContain('Alice')
    expect(w.text()).toContain('Bob')
    expect(w.text()).toContain('Carol')
    expect(w.text()).toContain('28')
  })

  it('dataIndex 不同于 key', () => {
    const cols: ZTableColumn<Row>[] = [
      { key: 'displayName', title: 'Name', dataIndex: 'name' },
    ]
    const w = mount(ZTable<Row>, { props: { columns: cols, data: ROWS } })
    expect(w.text()).toContain('Alice')
  })

  it('自定义 render', () => {
    const cols: ZTableColumn<Row>[] = [
      {
        key: 'name',
        title: 'Name',
        render: (row) => h('strong', `[${row.name}]`),
      },
    ]
    const w = mount(ZTable<Row>, { props: { columns: cols, data: ROWS } })
    expect(w.find('strong').text()).toBe('[Alice]')
  })

  it('空数据 → emptyText', () => {
    const w = mount(ZTable<Row>, {
      props: { columns: COLS, data: [], emptyText: '无' },
    })
    expect(w.text()).toContain('无')
  })

  it('rowKey 函数', () => {
    const cols: ZTableColumn<Row>[] = [{ key: 'name', title: 'N' }]
    const w = mount(ZTable<Row>, {
      props: { columns: cols, data: ROWS, rowKey: (r: Row) => `row-${r.id}` },
    })
    expect(w.findAll('tbody tr').length).toBe(3)
  })

  it('bordered=true 写入 border 样式', () => {
    const w = mount(ZTable<Row>, { props: { columns: COLS, data: ROWS, bordered: true } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/border-width:1px/)
  })

  it('align=right 写入 text-align', () => {
    mount(ZTable<Row>, { props: { columns: COLS, data: ROWS } })
    const css = Array.from(document.querySelectorAll('style'))
      .map((el) => el.textContent ?? '')
      .join('\n')
    expect(css).toMatch(/text-align:right/)
  })
})
