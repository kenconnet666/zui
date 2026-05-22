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
export type { ZDividerProps } from './ZDivider.vue'
