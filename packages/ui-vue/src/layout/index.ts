/**
 * `layout/` —— 布局类组件。
 *
 * - `ZFlex` —— Flexbox 容器(direction/wrap/justify/align/gap)
 * - `ZGrid` —— CSS Grid 容器(cols/rows/gap,支持响应式断点对象)
 * - `ZSpace` —— 等间距(antd `Space` 同款,默认 align center + gap _small)
 * - `ZSpacer` —— 占位推开(flex: 1 1 auto)
 */
export { default as ZFlex } from './ZFlex.vue'
export type { ZFlexProps } from './ZFlex.vue'

export { default as ZGrid } from './ZGrid.vue'
export type { ZGridProps, ZGridColsValue } from './ZGrid.vue'

export { default as ZSpace } from './ZSpace.vue'
export type { ZSpaceProps } from './ZSpace.vue'

export { default as ZSpacer } from './ZSpacer.vue'
export type { ZSpacerProps } from './ZSpacer.vue'

// ─── Phase β 补全 ───
export { default as ZAffix } from './ZAffix.vue'
export type { ZAffixProps } from './ZAffix.vue'

export { default as ZScrollbar } from './ZScrollbar.vue'
export type { ZScrollbarProps } from './ZScrollbar.vue'

// ─── Phase γ ───
export { default as ZSplit } from './ZSplit.vue'
export type { ZSplitProps, ZSplitEmits } from './ZSplit.vue'
