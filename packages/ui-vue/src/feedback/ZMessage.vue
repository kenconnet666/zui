<script lang="ts">
/**
 * `ZMessage` —— 顶部 Toast 消息(类 antd message / naive useMessage)。
 *
 * **使用模式**:
 * 1. 直接渲染 `<ZMessage>` 组件 ── 接受 `messages: ZMessageItem[]` 数组,业务方自己管理 state
 * 2. 工厂模式 ── `createMessageApi()` 返回 `{ info, success, warning, error, loading, destroyAll }`
 *    在 body 创建一个临时容器自动 mount,业务方任意位置调 `messageApi.success('保存成功')`
 *
 * **API**(2026-05-23 撤销 item.type 字面量,改 color factory + icon):
 * - item.color?: factory —— 颜色(messageApi 内部按语义 fill)
 * - item.icon?: Component —— 图标组件(messageApi 内部 fill BuiltinIcons.{ success / warning / ... })
 * - item.loading?: boolean —— 是否旋转 loading 图标(默认 false)
 *
 * 两种模式共用同一个 SFC。
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

/** 单条 message 数据。 */
export interface ZMessageItem {
  /** 唯一 id,业务方提供;工厂模式自动生成。 */
  id: string | number
  content: string
  /** 持续时间 ms,`0` 表示不自动关闭(loading 默认 0)。默认 3000。 */
  duration?: number
  /** 颜色 factory(图标 + 内联色)。默认 `_info`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 图标组件(传给 ZIcon 的 component)。默认 `BuiltinIcons.info`。 */
  icon?: Component
  /** 旋转 loading 图标(spin 1s linear infinite),默认 `false`。 */
  loading?: boolean
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
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   顶部居中容器:
 *   ┌─────────────────────────────────────────────────────┐
 *   │ container(Teleport body,position fixed)          │   top: 1.5iem
 *   │   top: 1.5iem  left: 50%  translateX(-50%)         │   z-index: _toast
 *   │   flex column / alignItems center / gap _small     │   pointer-events: none
 *   │                                                     │
 *   │      ┌──────────────────────────────────────┐      │   message item:
 *   │      │ ● icon  content text                 │      │     inline-flex / center
 *   │      │   pad _small  pad-x _middle          │      │     gap _small
 *   │      │   bg _bg  boxShadow _middle          │      │     pad _small,pad-x _middle
 *   │      │   border-radius _small               │      │     border-radius _small
 *   │      │   fontSize _small  lineHeight _normal│      │     bg _bg / boxShadow _middle
 *   │      │   color: item.color factory 或 _info │      │     pointer-events: auto
 *   │      └──────────────────────────────────────┘      │
 *   │      (TransitionGroup: enter translateY(-0.75em))  │
 *   │      (循环 messages.length 个 item)                │
 *   └─────────────────────────────────────────────────────┘
 *
 * duration 默认 3000ms,loading=true 默认 0(不自动关)。
 */
const props = defineProps<ZMessageProps>()
const emit = defineEmits<ZMessageEmits>()

const theme = useZTheme()

const containerClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    s.top.px(sizePx(1.5))
    s.left.pct(50)
    s.transform('translateX(-50%)')
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.gap._small
    s.zIndex._toast
    s.pointerEvents.none
    props.css?.(s)
  }),
)

const itemClass = (item: ZMessageItem): string =>
  icss(theme.value, s => {
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
    s.borderColor.transparent
    // 左侧 icon 颜色:走用户 color factory 或默认 _info
    if (item.color) s.color(item.color)
    else s.color._info
  })

const bodyClass = computed(() =>
  icss(theme.value, s => {
    s.color._text
  }),
)

const transitionActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty.all
    s.transitionDuration._small
    s.transitionTimingFunction._default
  }),
)
const enterFromClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._none
    s.transform('translateY(-0.75em)')
  }),
)
const leaveToClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._none
    s.transform('translateY(-0.5em)')
  }),
)

// timers —— 闭包 Map(不放 reactive,跟 ZNotification 一致)
const timers = new Map<ZMessageItem['id'], ReturnType<typeof setTimeout>>()

function scheduleClose(item: ZMessageItem): void {
  const duration = item.duration ?? (item.loading ? 0 : 3000)
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
  () => props.messages.map(m => m.id),
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
        const item = props.messages.find(m => m.id === id)
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
  return h(ZIcon, {
    component: item.icon ?? BuiltinIcons.info,
    ...(item.loading
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
      <TransitionGroup
        :enter-from-class="enterFromClass"
        :enter-active-class="transitionActiveClass"
        :leave-active-class="transitionActiveClass"
        :leave-to-class="leaveToClass"
        tag="div"
      >
        <div v-for="item in messages" :key="item.id" :class="itemClass(item)">
          <component :is="renderIcon(item)" />
          <span :class="bodyClass">{{ item.content }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
