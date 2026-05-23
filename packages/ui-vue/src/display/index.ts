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

// ─── Phase β 第二批 ───
export { default as ZEmpty } from './ZEmpty.vue'
export type { ZEmptyProps } from './ZEmpty.vue'

export { default as ZSkeleton } from './ZSkeleton.vue'
export type { ZSkeletonProps } from './ZSkeleton.vue'

export { default as ZResult } from './ZResult.vue'
export type { ZResultProps, ZResultStatus } from './ZResult.vue'

export { default as ZList } from './ZList.vue'
export type { ZListProps, ZListSize } from './ZList.vue'

export { default as ZProgress } from './ZProgress.vue'
export type {
  ZProgressProps,
  ZProgressType,
  ZProgressSize,
  ZProgressStatus,
} from './ZProgress.vue'

export { default as ZCollapse } from './ZCollapse.vue'
export type { ZCollapseProps, ZCollapseEmits, ZCollapseItem } from './ZCollapse.vue'

// ─── Phase β 第三批 ───
export { default as ZTimeline } from './ZTimeline.vue'
export type { ZTimelineProps, ZTimelineItem, ZTimelineStatus } from './ZTimeline.vue'

export { default as ZStatistic } from './ZStatistic.vue'
export type { ZStatisticProps } from './ZStatistic.vue'

export { default as ZImage } from './ZImage.vue'
export type { ZImageProps } from './ZImage.vue'

export { default as ZTree } from './ZTree.vue'
export type { ZTreeProps, ZTreeEmits, ZTreeNode } from './ZTree.vue'
