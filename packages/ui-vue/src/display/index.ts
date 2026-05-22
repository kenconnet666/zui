/**
 * `display/` —— 数据展示组件。
 */
export { default as ZCard } from './ZCard.vue'
export type { ZCardProps } from './ZCard.vue'

export { default as ZTable } from './ZTable.vue'
export type {
  ZTableProps,
  ZTableColumn,
  ZTableSize,
  ZTableAlign,
} from './ZTable.vue'

// ─── Phase β 浮层(usePopper)───
export { default as ZTooltip } from './ZTooltip.vue'
export type { ZTooltipProps, ZTooltipEmits, ZTooltipTrigger } from './ZTooltip.vue'

export { default as ZPopover } from './ZPopover.vue'
export type { ZPopoverProps, ZPopoverEmits, ZPopoverTrigger } from './ZPopover.vue'
