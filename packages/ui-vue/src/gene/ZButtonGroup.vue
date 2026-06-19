<script lang="ts">
/**
 * `ZButtonGroup` —— 按钮组。把多个 `ZButton` 合并为一组：
 * `attached`(默认)折叠相邻边框、仅最外侧保留圆角；否则按 `gap` 间隔排列。
 *
 * **API**:
 * - `vertical?: boolean` —— 纵向排列(默认横向)
 * - `attached?: boolean` —— 贴合模式(默认 `true`：折叠相邻边框 + 共享外圆角)
 * - `gap?: number` —— 非贴合时的间距(px 倍数,1 单位 = 16px,默认 `0.5` = 8px)
 * - `css?` —— 根元素兜底
 *
 * 子元素直接放 `ZButton`(任意 variant / size)。建议组内统一 `size` 与 `variant`。
 *
 * @example
 * <ZButtonGroup>
 *   <ZButton>左</ZButton>
 *   <ZButton>中</ZButton>
 *   <ZButton>右</ZButton>
 * </ZButtonGroup>
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZButtonGroupProps {
  vertical?: boolean
  attached?: boolean
  gap?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { sizePx } from '../_internal/sizing'

const props = withDefaults(defineProps<ZButtonGroupProps>(), {
  vertical: false,
  attached: true,
  gap: 0.5,
})

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.flexDirection(props.vertical ? 'column' : 'row')
    s.alignItems.stretch

    if (props.attached) {
      // hover / focus 的按钮提升 z-index,边框不被相邻按钮的负 margin 遮挡
      s._nest('& > *', n => {
        n.position.relative
      })
      s._nest('& > *:hover, & > *:focus-visible', n => {
        n.zIndex(1)
      })

      if (props.vertical) {
        s._nest('& > *:not(:first-child)', n => {
          n.marginTop.px(-1)
        })
        s._nest('& > *:not(:first-child):not(:last-child)', n => {
          n.borderRadius._none
        })
        s._nest('& > *:first-child', n => {
          n.borderBottomLeftRadius('0')
          n.borderBottomRightRadius('0')
        })
        s._nest('& > *:last-child', n => {
          n.borderTopLeftRadius('0')
          n.borderTopRightRadius('0')
        })
      } else {
        s._nest('& > *:not(:first-child)', n => {
          n.marginLeft.px(-1)
        })
        s._nest('& > *:not(:first-child):not(:last-child)', n => {
          n.borderRadius._none
        })
        s._nest('& > *:first-child', n => {
          n.borderTopRightRadius('0')
          n.borderBottomRightRadius('0')
        })
        s._nest('& > *:last-child', n => {
          n.borderTopLeftRadius('0')
          n.borderBottomLeftRadius('0')
        })
      }
    } else {
      s.gap.px(sizePx(props.gap))
    }

    props.css?.(s)
  }),
)
</script>

<template>
  <div :class="rootClass" role="group">
    <slot />
  </div>
</template>
