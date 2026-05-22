<script lang="ts">
/**
 * `ZLoadingBar` —— 顶部线性进度条(类 NProgress)。通常配套 useLoadingBar API 用,
 * 不直接渲染 props。
 *
 * **API**:
 * - `value: number | null` —— 进度 0~100;null = 不可见
 * - `error?: boolean` —— 错误态(切红)
 *
 * 推荐配合 `createLoadingBarApi()` 用(类似 createMessageApi)。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZLoadingBarProps {
  value?: number | null
  error?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'

const props = withDefaults(defineProps<ZLoadingBarProps>(), {
  value: null,
  error: false,
})

const theme = useZTheme()

const visible = computed(() => props.value !== null)
const widthPct = computed(() => Math.max(0, Math.min(100, props.value ?? 0)))

const wrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s._prop('top', '0')
    s._prop('left', '0')
    s._prop('right', '0')
    s._prop('height', '2px')
    s.zIndex._toast
    s.pointerEvents.none
    props.css?.(s)
  }),
)

const fillClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('height', '100%')
    s._prop('width', `${widthPct.value}%`)
    if (props.error) s.backgroundColor._danger
    else s.backgroundColor._primary
    s.transitionProperty._sizes
    s.transitionDuration._small
    s.boxShadow._tiny
  }),
)
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" :class="wrapClass" role="progressbar" :aria-valuenow="widthPct">
      <div :class="fillClass" />
    </div>
  </Teleport>
</template>
