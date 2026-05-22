/**
 * `@kenconnet666/zui-vue/components/icon` —— ZIcon 子入口。
 *
 * ZIcon 走 SFC 单文件 + 双 `<script>` 块（详见 `skill/zui.md §13.0`）；所有内部
 * helpers（`SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP` / 维度子类型 alias）不对外暴露。
 * 需要做"自定义 variants 维度"的高级用户走 `cssRoot` factory 兜底，或直接 fork 组件。
 */
export { default as ZIcon } from './ZIcon.vue'
export type { ZIconProps } from './ZIcon.vue'
