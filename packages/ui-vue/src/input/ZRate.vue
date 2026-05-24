<script lang="ts">
/**
 * `ZRate` —— 星级评分。
 *
 * **API**:
 * - `v-model:value` —— number(支持小数 if `allowHalf=true`)
 * - `count?: number` —— 总星数(默认 5)
 * - `allowHalf?: boolean` —— 允许半星(默认 false)
 * - `disabled?: boolean` / `readonly?: boolean`
 * - `color` carrier factory —— 默认 `_warning`(M2 orange,适合星)
 * - `size?: 'small' | 'middle' | 'large'`
 *
 * **a11y**:`role="radiogroup"`,每颗 `role="radio"` + `aria-checked`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SizeProp } from '../_internal/size-prop'

export interface ZRateProps {
  value?: number
  count?: number
  allowHalf?: boolean
  disabled?: boolean
  readonly?: boolean
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /**
   * 星星尺寸 —— **纯 chain factory**(2026-05-23 撤销 Size5 union)。
   *
   * **默认**:`(w) => w.iem(1.25)`(等价旧 middle 档位)。
   *
   * **参考档位**:tiny(0.75iem) / small(1iem) / middle(1.25iem) / large(1.5iem) / huge(2iem)。
   *
   * height 自动镜像 width(星星始终方形)。
   *
   * @example
   * <ZRate :size="(w) => w.iem(2)" />        <!-- 等价 huge -->
   */
  size?: SizeProp<'width'>
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZRateEmits {
  (e: 'update:value', value: number): void
  (e: 'change', value: number): void
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ ZRate root  inline-flex / gap 0.125iem           │   color: 用户 color factory 或 _warning
 *   │   color: _warning(默认,star fill)             │   非交互态 opacity _strong
 *   │                                                  │
 *   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │   star button(count 个,默认 5):
 *   │  │ ★  │ │ ★  │ │ ☆  │ │ ☆  │ │ ☆  │             │     width: 1.25iem(默认 middle,可改)
 *   │  │1.25│ │1.25│ │1.25│ │1.25│ │1.25│             │     height: 1.25iem(镜像 width)
 *   │  │iem │ │iem │ │iem │ │iem │ │iem │             │     color: _border(空星底色)
 *   │  └────┘ └────┘ └────┘ └────┘ └────┘             │
 *   │     ↑                                            │   filled star(覆盖层):
 *   │     value 决定每颗 fill 比率(0 / 0.5 / 1)     │     position absolute / inset 0
 *   │                                                  │     width: filledRatio * 100%
 *   │                                                  │     overflow hidden / currentColor
 *   └──────────────────────────────────────────────────┘
 *
 * allowHalf=true 时点击星左半 → 0.5 颗,右半 → 1 颗。
 */
const props = withDefaults(defineProps<ZRateProps>(), {
  value: 0,
  count: 5,
  allowHalf: false,
  disabled: false,
  readonly: false,
  // 默认等价旧 middle 档位:1.25iem
  size: (w: Chain<ZuiSchema>['width']) => {
    w.iem(1.25)
  },
  // 星色默认 `_warning`(M2 orange,适合星)
  color: (c: Chain<ZuiSchema>['color']) => {
    c._warning
  },
})

const emit = defineEmits<ZRateEmits>()

const theme = useZTheme()

const isInteractive = computed(() => !props.disabled && !props.readonly)

function setValue(v: number): void {
  if (!isInteractive.value) return
  emit('update:value', v)
  emit('change', v)
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.gap.iem(0.125)
    s.color(props.color)
    if (!isInteractive.value) s.opacity._strong
    props.css?.(s)
  }),
)

const starClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.position.relative
    // size(Type C):同一 factory 应用到 width + height,保证星星方形
    s.width(props.size)
    s.height(props.size)
    s.cursor(isInteractive.value ? 'pointer' : 'default')
    s.color._border
  }),
)

const filledStarClass = (filledRatio: number): string =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.left.px(0)
    s.top.px(0)
    s.width.pct(filledRatio * 100)
    s.height.pct(100)
    s.overflow.hidden
    s.color.currentColor
  })

function starFilledRatio(idx: number): number {
  // idx 0..count-1
  const star = idx + 1
  if (props.value >= star) return 1
  if (props.allowHalf && props.value >= star - 0.5) return 0.5
  return 0
}

function onClick(idx: number, e: MouseEvent): void {
  if (!isInteractive.value) return
  if (!props.allowHalf) {
    setValue(idx + 1)
    return
  }
  // half star detection:看点击位置在按钮左半还是右半
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const localX = e.clientX - rect.left
  const half = localX < rect.width / 2
  setValue(idx + (half ? 0.5 : 1))
}

const starSvg = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2 L15 9 L22 9.5 L17 14 L18.5 22 L12 18 L5.5 22 L7 14 L2 9.5 L9 9 Z"/></svg>`
</script>

<template>
  <div :class="rootClass" role="radiogroup" :aria-disabled="disabled || readonly">
    <button
      v-for="i in count"
      :key="i"
      type="button"
      :class="starClass"
      role="radio"
      :aria-checked="value === i"
      :disabled="disabled"
      style="background: transparent; border: none; padding: 0;"
      @click="onClick(i - 1, $event)"
    >
      <span v-html="starSvg" style="position: absolute; inset: 0; opacity: 1; color: inherit;" />
      <span
        v-if="starFilledRatio(i - 1) > 0"
        :class="filledStarClass(starFilledRatio(i - 1))"
        v-html="starSvg"
      />
    </button>
  </div>
</template>
