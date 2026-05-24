<script lang="ts">
/**
 * `ZGrid` —— CSS Grid 布局容器。
 *
 * **核心 prop**:
 * - `cols`:`number`(`repeat(N, 1fr)`)/ `string`(自定义 grid-template-columns,如 `'200px 1fr'`)
 *   / `Partial<Record<breakpoint, number | string>>`(响应式断点切换 ── small / middle / large 等
 *   schema breakpoint key)
 * - `rows`:同 `cols` 但作用于 `grid-template-rows`
 * - `gap`:carrier factory → `gap` carrier
 * - `justifyItems` / `alignItems`:`'start'` / `'center'` / `'end'` / `'stretch'`(默认 `'stretch'`)
 * - `inline`:`true` → `display: inline-grid`,默认 `false`(`grid`)
 *
 * **响应式 cols/rows**:对象形式 key 对应 schema breakpoint(`tiny/small/middle/large/huge`),
 * 内部用 `s._media('_small', ...)` 链式嵌套展开。
 *
 * @example
 * ```vue
 * <ZGrid :cols="{ tiny: 1, middle: 2, large: 3 }" :gap="(g) => g._middle">
 *   <Card />
 *   <Card />
 *   <Card />
 * </ZGrid>
 * ```
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

type GridSize5Keys = 'tiny' | 'small' | 'middle' | 'large' | 'huge'

/** cols/rows 取值:固定数 / 自定义字符串 / 响应式对象。 */
export type ZGridColsValue =
  | number
  | string
  | Partial<Record<GridSize5Keys, number | string>>

export interface ZGridProps {
  /** 列定义。数字 → `repeat(N, 1fr)`;字符串 → 直接作 `grid-template-columns`;对象 → 响应式。 */
  cols?: ZGridColsValue
  /** 行定义。同 `cols`,作用于 `grid-template-rows`。默认不写(自动行)。 */
  rows?: ZGridColsValue
  /** `gap` carrier factory。 */
  gap?: ((g: Chain<ZuiSchema>['gap']) => void) | undefined
  /** `justify-items` carrier factory。 */
  justifyItems?: ((c: Chain<ZuiSchema>['justifyItems']) => void) | undefined
  /** `align-items` carrier factory。 */
  alignItems?: ((c: Chain<ZuiSchema>['alignItems']) => void) | undefined
  /** `display: inline-grid`(默认 `grid`)。 */
  inline?: boolean
  /** 根元素二次精细覆盖。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag,默认 `'div'`。 */
  tag?: string
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZGridProps>(), {
  inline: false,
  tag: 'div',
})

const theme = useZTheme()

function resolveTemplate(v: number | string): string {
  return typeof v === 'number' ? `repeat(${v}, minmax(0, 1fr))` : v
}

function applyResponsive(
  s: Chain<ZuiSchema>,
  value: ZGridColsValue,
  prop: 'gridTemplateColumns' | 'gridTemplateRows',
): void {
  if (typeof value === 'number' || typeof value === 'string') {
    s._prop(prop, resolveTemplate(value))
    return
  }
  // 对象:取最小断点作为 base,其余进 _media 嵌套
  const keys: GridSize5Keys[] = ['tiny', 'small', 'middle', 'large', 'huge']
  let firstKey: GridSize5Keys | undefined
  for (const k of keys) {
    if (value[k] !== undefined) {
      firstKey = k
      break
    }
  }
  if (!firstKey) return
  const baseVal = value[firstKey]!
  s._prop(prop, resolveTemplate(baseVal))
  for (const k of keys) {
    if (k === firstKey) continue
    const v = value[k]
    if (v === undefined) continue
    s._media(`_${k}` as `_${GridSize5Keys}`, (m) => {
      m._prop(prop, resolveTemplate(v))
    })
  }
}

const className = computed(() =>
  icss(theme.value, (s) => {
    if (props.inline) s.display.inlineGrid
    else s.display.grid

    if (props.cols !== undefined) applyResponsive(s, props.cols, 'gridTemplateColumns')
    if (props.rows !== undefined) applyResponsive(s, props.rows, 'gridTemplateRows')
    if (props.gap) s.gap(props.gap)
    if (props.justifyItems) s.justifyItems(props.justifyItems)
    if (props.alignItems) s.alignItems(props.alignItems)

    props.css?.(s)
  }),
)
</script>

<template>
  <component :is="tag" :class="className">
    <slot />
  </component>
</template>
