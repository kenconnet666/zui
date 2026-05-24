<script lang="ts">
/**
 * `ZScrollbar` —— 美化滚动条容器(走 webkit-scrollbar 样式 + Firefox scrollbar-width)。
 *
 * - `maxHeight?: factory` —— 容器最大高度 carrier factory(2026-05-24 B7:数字尺寸 → factory)
 * - `thin?: boolean` —— 细滚动条,默认 true
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZScrollbarProps {
  /**
   * 最大高度 —— `number`(iem 倍数,默认 undefined = 由父级决定)。
   *
   * 2026-05-24 B7:数值尺寸 prop 改 `number`。非 iem 单位走 `css` 兜底。
   *
   * @example
   * <ZScrollbar :max-height="20" />          <!-- 20iem -->
   * <ZScrollbar :css="(s) => s.maxHeight.px(200)" />   <!-- px 走 css -->
   */
  maxHeight?: number
  thin?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌────────────────────────────────────┐
 *   │ ZScrollbar (div,overflow auto)     │
 *   │   max-height: `maxHeight` iem      │   默认 maxHeight=undefined(由父级决定)
 *   │                                    │   传 maxHeight=20 → 20iem(320px @ 1080p)
 *   │  ┌──────────────────────────────┐  │
 *   │  │ slot 内容(子元素自然撑高)  │  │   滚动条:thin → 8px,thick → 12px
 *   │  │                              │  │   webkit + firefox 联动样式
 *   │  └──────────────────────────────┘  │
 *   └────────────────────────────────────┘
 *
 * 用户改 maxHeight 数字 → 容器最大高度等比缩(滚动条粗细固定不缩,跟随 thin 切)。
 * 非 iem 单位(px / vh)走 `:css` 兜底:`(s) => s.maxHeight.px(200)`。
 */
const props = withDefaults(defineProps<ZScrollbarProps>(), {
  thin: true,
})

const theme = useZTheme()

const SCROLLBAR_STYLE_ID = 'zui-scrollbar-styles'
if (typeof document !== 'undefined' && !document.getElementById(SCROLLBAR_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = SCROLLBAR_STYLE_ID
  style.textContent = `
.zui-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.2) transparent;
}
.zui-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.zui-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.zui-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}
.zui-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.35);
}
.zui-scrollbar.zui-scrollbar--thick::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
.zui-scrollbar.zui-scrollbar--thick {
  scrollbar-width: auto;
}
`
  document.head.appendChild(style)
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.overflow.auto
    if (props.maxHeight !== undefined) s.maxHeight.iem(props.maxHeight)
    props.css?.(s)
  }),
)
</script>

<template>
  <div :class="['zui-scrollbar', props.thin ? '' : 'zui-scrollbar--thick', rootClass]">
    <slot />
  </div>
</template>
