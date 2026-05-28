<script lang="ts">
/**
 * `ZTimeline` —— 时间轴。
 *
 * **API**(B6:删 status 业务语义字符串映射,改 chain color factory):
 * - `items: ZTimelineItem[]` —— 每项配置 `title?` / `description?` / `color?: factory`
 * - `item.color?: factory` —— 每个 item 的 dot 颜色 carrier factory,默认 `_textSecondary`
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTimelineItem {
  title?: string
  description?: string
  /** dot 颜色 carrier factory,默认 `_textSecondary`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
}

export interface ZTimelineProps {
  items: ZTimelineItem[]
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applyAsBg } from '../_internal/color-bridge'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ ZTimeline root  flex column  fontSize _small     │
 *   │                                                  │
 *   │  ┌────────────────────────────────────────────┐  │
 *   │  │ item  position: relative                   │  │   每项:
 *   │  │   padding-left: _huge                      │  │     min-height: 2iem
 *   │  │   padding-bottom: _middle                  │  │     padding-left: _huge
 *   │  │   min-height: 2iem                         │  │
 *   │  │                                            │  │
 *   │  │  ● dot 圆点                                │  │   dot: 0.625iem 正圆
 *   │  │    width/height: 0.625iem,_full           │  │     left:0,top:0.25iem
 *   │  │    bg: item.color factory 或 _textSecondary│  │
 *   │  │                                            │  │
 *   │  │  │ line 连接线(非最后一项)               │  │   line: 0.125iem 宽
 *   │  │    width: 0.125iem,bg _border              │  │     left:0.25iem,top:0.75iem→bottom
 *   │  │                                            │  │
 *   │  │  title    fontWeight: _semibold,color _text│  │
 *   │  │  desc     color _textSecondary  _small     │  │
 *   │  └────────────────────────────────────────────┘  │
 *   │  (循环 items.length 个)                         │
 *   └──────────────────────────────────────────────────┘
 */
const props = defineProps<ZTimelineProps>()

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._small
    props.css?.(s)
  }),
)

const itemClass = computed(() =>
  icss(theme.value, s => {
    s.position.relative
    s.paddingLeft._huge
    s.paddingBottom._middle
    s.minHeight.iem(2)
  }),
)

const dotClass = (color?: ZTimelineItem['color']): string =>
  icss(theme.value, s => {
    s.position.absolute
    s.left.px(0)
    s.top.iem(0.25)
    s.width.iem(0.625)
    s.height.iem(0.625)
    s.borderRadius._full
    if (!applyAsBg(s, color)) {
      s.backgroundColor._textSecondary
    }
  })

const lineClass = computed(() =>
  icss(theme.value, s => {
    s.position.absolute
    s.left.iem(0.25)
    s.top.iem(0.75)
    s.bottom.px(0)
    s.width.iem(0.125)
    s.backgroundColor._border
  }),
)

const titleClass = computed(() =>
  icss(theme.value, s => {
    s.fontWeight._semibold
    s.color._text
  }),
)
const descClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontSize._small
    s.marginTop._tiny
  }),
)
</script>

<template>
  <div :class="rootClass" role="list">
    <div v-for="(item, i) in items" :key="i" :class="itemClass" role="listitem">
      <span v-if="i < items.length - 1" :class="lineClass" />
      <span :class="dotClass(item.color)" />
      <div v-if="item.title" :class="titleClass">{{ item.title }}</div>
      <div v-if="item.description" :class="descClass">{{ item.description }}</div>
    </div>
  </div>
</template>
