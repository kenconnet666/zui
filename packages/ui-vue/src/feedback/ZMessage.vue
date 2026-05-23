<script lang="ts">
/**
 * `ZMessage` —— 顶部 Toast 消息(类 antd message / naive useMessage)。
 *
 * **使用模式**:
 * 1. 直接渲染 `<ZMessage>` 组件 ── 接受 `messages: ZMessageItem[]` 数组,业务方自己管理 state
 * 2. 工厂模式 ── `createMessageApi()` 返回 `{ info, success, warning, error, loading, destroyAll }`
 *    在 body 创建一个临时容器自动 mount,业务方任意位置调 `messageApi.success('保存成功')`
 *
 * 两种模式共用同一个 SFC,区别在容器挂载方式。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZMessageType = 'info' | 'success' | 'warning' | 'danger' | 'loading'

/** 单条 message 数据。 */
export interface ZMessageItem {
  /** 唯一 id,业务方提供;工厂模式自动生成。 */
  id: string | number
  type: ZMessageType
  content: string
  /** 持续时间 ms,`0` 表示不自动关闭(loading 默认 0)。默认 3000。 */
  duration?: number
}

export interface ZMessageProps {
  /** message 数组。 */
  messages: ZMessageItem[]
  /** 容器 css 兜底。 */
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZMessageEmits {
  (e: 'close', id: ZMessageItem['id']): void
}
</script>

<script lang="ts" setup>
import { computed, h, onMounted, onUnmounted, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = defineProps<ZMessageProps>()
const emit = defineEmits<ZMessageEmits>()

const theme = useZTheme()

const TYPE_ICON_MAP: Record<ZMessageType, keyof typeof BuiltinIcons> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  loading: 'refresh',
}

const TYPE_COLOR_MAP: Record<ZMessageType, 'info' | 'success' | 'warning' | 'danger'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  loading: 'info',
}

const containerClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s._prop('top', '24px')
    s._prop('left', '50%')
    s._prop('transform', 'translateX(-50%)')
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.gap._small
    s.zIndex._toast
    s.pointerEvents.none
    props.css?.(s)
  }),
)

function itemClass(type: ZMessageType): string {
  const colorKey = `_${TYPE_COLOR_MAP[type]}` as const
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._small
    s.padding._small
    s.paddingLeft._middle
    s.paddingRight._middle
    s.borderRadius._small
    s.backgroundColor._bg
    s.boxShadow._middle
    s.color._text
    s.fontSize._small
    s.lineHeight._normal
    s.pointerEvents.auto
    s.borderWidth._thin
    s.borderStyle.solid
    s._prop('borderColor', 'transparent')
    // 左侧 icon 颜色
    s.color[colorKey]
  })
}

function bodyClass(): string {
  return icss(theme.value, (s) => {
    s.color._text
  })
}

// timers —— 闭包 Map(不放 reactive,跟 ZNotification 一致)
const timers = new Map<ZMessageItem['id'], ReturnType<typeof setTimeout>>()

function scheduleClose(item: ZMessageItem): void {
  const duration = item.duration ?? (item.type === 'loading' ? 0 : 3000)
  if (duration <= 0) return
  const t = setTimeout(() => {
    emit('close', item.id)
    timers.delete(item.id)
  }, duration)
  timers.set(item.id, t)
}

onMounted(() => {
  for (const m of props.messages) scheduleClose(m)
})

// 当 messages 增减时管理 timers
watch(
  () => props.messages.map((m) => m.id),
  (newIds, oldIds) => {
    for (const id of oldIds ?? []) {
      if (!newIds.includes(id)) {
        const t = timers.get(id)
        if (t) {
          clearTimeout(t)
          timers.delete(id)
        }
      }
    }
    for (const id of newIds) {
      if (!timers.has(id)) {
        const item = props.messages.find((m) => m.id === id)
        if (item) scheduleClose(item)
      }
    }
  },
  { deep: false },
)

onUnmounted(() => {
  for (const t of timers.values()) clearTimeout(t)
  timers.clear()
})

function renderIcon(item: ZMessageItem) {
  const isSpinning = item.type === 'loading'
  return h(ZIcon, {
    component: BuiltinIcons[TYPE_ICON_MAP[item.type]],
    ...(isSpinning
      ? {
          spin: (d: Chain<ZuiSchema>['animationDuration']) => {
            d.s(1)
          },
        }
      : {}),
  })
}
</script>

<template>
  <Teleport to="body">
    <div :class="containerClass" role="status" aria-live="polite">
      <TransitionGroup name="zui-msg" tag="div">
        <div v-for="item in messages" :key="item.id" :class="itemClass(item.type)">
          <component :is="renderIcon(item)" />
          <span :class="bodyClass()">{{ item.content }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.zui-msg-enter-active,
.zui-msg-leave-active {
  transition: all 240ms cubic-bezier(0.4, 0, 0.2, 1);
}
.zui-msg-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.zui-msg-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
