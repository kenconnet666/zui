/**
 * `@kenconnet666/zui-vue/components/gene` —— 通用基础元件子入口。
 *
 * 所有 gene 组件走 SFC 单文件 + 双 `<script>` 块（详见 `skill/zui.md §13.0`），
 * 公开 props 接口、组件本体；私有 helper（如 `_typography-base.ts`、内部 `*_MAP` 等）
 * 不对外暴露。需要"自定义维度 / 极致定制"的高级用户走 `css` factory 兜底，
 * 或直接 fork 组件。
 */
export { default as ZIcon } from './ZIcon.vue'
export type { ZIconProps } from './ZIcon.vue'

export { default as ZText } from './ZText.vue'
export type { ZTextProps } from './ZText.vue'

export { default as ZTitle } from './ZTitle.vue'
export type { ZTitleProps, ZTitleLevel } from './ZTitle.vue'

export { default as ZParagraph } from './ZParagraph.vue'
export type { ZParagraphProps } from './ZParagraph.vue'

export { default as ZLink } from './ZLink.vue'
export type { ZLinkProps } from './ZLink.vue'

export { default as ZDivider } from './ZDivider.vue'
export type { ZDividerProps, ZDividerAlign } from './ZDivider.vue'

export { default as ZButton } from './ZButton.vue'
export type { ZButtonProps, ZButtonEmits, ZButtonVariant, ZButtonShape } from './ZButton.vue'

export { default as ZButtonGroup } from './ZButtonGroup.vue'
export type { ZButtonGroupProps } from './ZButtonGroup.vue'

// ─── Phase β gene 补全 ───
export { default as ZAvatar } from './ZAvatar.vue'
export type { ZAvatarProps } from './ZAvatar.vue'

export { default as ZAvatarGroup } from './ZAvatarGroup.vue'
export type { ZAvatarGroupProps, ZAvatarGroupItem } from './ZAvatarGroup.vue'

export { default as ZTag } from './ZTag.vue'
export type { ZTagProps, ZTagEmits, ZTagVariant } from './ZTag.vue'

export { default as ZBadge } from './ZBadge.vue'
export type { ZBadgeProps } from './ZBadge.vue'

export { default as ZCode } from './ZCode.vue'
export type { ZCodeProps, ZCodeColorScheme } from './ZCode.vue'

export {
  default as ZCodeCard,
  stripImports,
  CODE_THEMES,
  globalCodeTheme,
  setCodeTheme,
} from './ZCodeCard.vue'
export type { ZCodeCardProps, ZCodeCardEmits, CodeThemeItem } from './ZCodeCard.vue'

export { default as ZCopyButton } from './ZCopyButton.vue'
export type { ZCopyButtonProps, ZCopyButtonEmits } from './ZCopyButton.vue'

export { default as ZBlockquote } from './ZBlockquote.vue'
export type { ZBlockquoteProps } from './ZBlockquote.vue'

export { default as ZEllipsis } from './ZEllipsis.vue'
export type { ZEllipsisProps } from './ZEllipsis.vue'

// ─── Phase γ ───
export { default as ZSegmented } from './ZSegmented.vue'
export type { ZSegmentedProps, ZSegmentedEmits, ZSegmentedOption } from './ZSegmented.vue'

export { default as ZGradientText } from './ZGradientText.vue'
export type { ZGradientTextProps } from './ZGradientText.vue'

// ─── 图标(@vicons/material 全量透出 + BuiltinIcons 语义 map)───
export * from './icons'
