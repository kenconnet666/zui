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
   * 最大高度 factory —— 接 `maxHeight` carrier。默认无(由父级决定)。
   *
   * @example
   * <ZScrollbar :max-height="(h) => h.px(200)" />
   * <ZScrollbar :max-height="(h) => h.iem(20)" />
   * <ZScrollbar :max-height="(h) => h.pct(80)" />
   */
  maxHeight?: ((c: Chain<ZuiSchema>['maxHeight']) => void) | undefined
  thin?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

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
    if (props.maxHeight) s.maxHeight(props.maxHeight)
    props.css?.(s)
  }),
)
</script>

<template>
  <div :class="['zui-scrollbar', props.thin ? '' : 'zui-scrollbar--thick', rootClass]">
    <slot />
  </div>
</template>
