<script lang="ts">
/**
 * `ApiTable` —— 组件 API 文档统一表格。
 *
 * 每列可标记 `mono: true` 以等宽渲染（props.name / type / default 等代码列）。
 * 描述列保持正文字体，支持任意字符串内容。
 *
 * **用法**:
 * ```ts
 * const columns = [
 *   { key: 'name', label: '属性', mono: true },
 *   { key: 'type', label: '类型', mono: true },
 *   { key: 'default', label: '默认值', mono: true },
 *   { key: 'desc', label: '说明' },
 * ]
 * const rows = [
 *   { name: 'size', type: 'number', default: '1', desc: 'px 倍数（1 单位 = 16px），整体等比缩放' },
 * ]
 * ```
 * ```vue
 * <ApiTable :columns="columns" :rows="rows" />
 * ```
 */
export interface ApiTableColumn {
  key: string
  label: string
  /** 用等宽字体渲染此列的内容（name / type / default 等代码值）。默认 false。 */
  mono?: boolean
  width?: string
}

export interface ApiTableProps {
  columns: ApiTableColumn[]
  rows: Array<Record<string, string>>
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss, useZTheme } from '@kenconnet666/zui-vue'

const props = defineProps<ApiTableProps>()
const theme = useZTheme()

const tableClass = computed(() =>
  icss(theme.value, s => {
    s.width.pct(100)
    s.borderCollapse.collapse
    s.fontSize._small
    s.lineHeight._relaxed
    s.marginBottom.px(32)
  }),
)

const theadClass = computed(() =>
  icss(theme.value, s => {
    s.backgroundColor._bgMuted
  }),
)

const thClass = computed(() =>
  icss(theme.value, s => {
    s.textAlign.left
    s.paddingTop.px(8)
    s.paddingBottom.px(8)
    s.paddingLeft.px(12)
    s.paddingRight.px(12)
    s.fontWeight._semibold
    s.color._textSecondary
    s.whiteSpace.nowrap
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const tdClass = (mono: boolean) =>
  computed(() =>
    icss(theme.value, s => {
      s.paddingTop.px(8)
      s.paddingBottom.px(8)
      s.paddingLeft.px(12)
      s.paddingRight.px(12)
      s.borderBottomWidth._thin
      s.borderBottomStyle.solid
      s.borderBottomColor._border
      s.color._text
      s.verticalAlign('top')
      if (mono) {
        s.fontFamily('ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace')
        s.fontSize.px(13)
        s.color._primary
      }
    }),
  )

/** 预计算每列的 td class（避免模板里重复调用）。 */
const tdClasses = computed(() =>
  props.columns.map(col => ({ key: col.key, cls: tdClass(!!col.mono).value })),
)
</script>

<template>
  <div style="overflow-x: auto">
    <table :class="tableClass">
      <thead :class="theadClass">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="thClass"
            :style="col.width ? { width: col.width } : undefined"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i">
          <td v-for="colCls in tdClasses" :key="colCls.key" :class="colCls.cls">
            {{ row[colCls.key] ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
