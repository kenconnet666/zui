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

export type ZRateSize = 'small' | 'middle' | 'large'

export interface ZRateProps {
  value?: number
  count?: number
  allowHalf?: boolean
  disabled?: boolean
  readonly?: boolean
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  size?: ZRateSize
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

const props = withDefaults(defineProps<ZRateProps>(), {
  value: 0,
  count: 5,
  allowHalf: false,
  disabled: false,
  readonly: false,
  size: 'middle',
})

const emit = defineEmits<ZRateEmits>()

const theme = useZTheme()

const SIZE_IEM: Record<ZRateSize, number> = {
  small: 1,
  middle: 1.25,
  large: 1.5,
}

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
    if (props.color) s.color(props.color)
    else s.color._warning
    if (!isInteractive.value) s.opacity._strong
    props.css?.(s)
  }),
)

const starClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s._prop('position', 'relative')
    s._prop('width', `calc(${SIZE_IEM[props.size]} * var(--zui-iem, 16px))`)
    s._prop('height', `calc(${SIZE_IEM[props.size]} * var(--zui-iem, 16px))`)
    s.cursor(isInteractive.value ? 'pointer' : 'default')
    s.color._border
  }),
)

const filledStarClass = (filledRatio: number): string =>
  icss(theme.value, (s) => {
    s._prop('position', 'absolute')
    s._prop('left', '0')
    s._prop('top', '0')
    s._prop('width', `${filledRatio * 100}%`)
    s._prop('height', '100%')
    s._prop('overflow', 'hidden')
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
