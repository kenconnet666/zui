<script lang="ts">
/**
 * `ZNotification` —— 右上角通知(类 ZMessage 但带 title + description + closable)。
 *
 * **使用模式**(两种,跟 ZMessage 一致):
 * 1. 组件模式:`<ZNotification :items />` 业务方自管 items 数组
 * 2. 工厂模式:`createNotificationApi()` 见 `notificationApi.ts`
 *
 * **API**(2026-05-23 撤销 item.type 字面量):
 * - item.color?: factory(颜色,工厂 wrap)
 * - item.icon?: Component(图标,工厂 wrap)
 * - item.loading?: boolean(默认 `false`)
 */
import type { Component } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZNotificationItem {
  id: string | number
  title: string
  description?: string
  duration?: number
  closable?: boolean
  /** 颜色 factory(图标 + 内联色)。默认 `_info`。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  /** 图标组件(传给 ZIcon 的 component)。默认 `BuiltinIcons.info`。 */
  icon?: Component
  /** 旋转 loading 图标。默认 `false`。 */
  loading?: boolean
}

export interface ZNotificationProps {
  items: ZNotificationItem[]
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** 通知容器最大宽度 —— `number`(iem 倍数,默认 22.5 = 360px)。2026-05-24 B7。 */
  maxWidth?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZNotificationEmits {
  (e: 'close', id: ZNotificationItem['id']): void
}
</script>

<script lang="ts" setup>
import { computed, h, onMounted, onUnmounted, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │ container(Teleport body,position fixed)          │
 *   │   top-right(默认): top 1.5iem  right 1.5iem      │
 *   │   max-width: `maxWidth` iem                        │   默认 maxWidth=22.5(360px @ 1080p)
 *   │   flex column  gap _small  z-index _toast          │
 *   │                                                     │
 *   │  ┌───────────────────────────────────────────────┐  │   item:
 *   │  │ ● icon  title (强)        × close            │  │     flex / gap _small
 *   │  │         description                            │  │     pad _middle
 *   │  │   pad _middle  border-radius _small           │  │     border _thin _border
 *   │  │   bg _bg  border _thin  boxShadow _middle     │  │     boxShadow _middle
 *   │  │   fontSize _small  lineHeight _normal         │  │     bg _bg
 *   │  │   icon: color factory 或 _info,fontSize _large│ │     pointer-events: auto
 *   │  │   title: _semibold fontSize _middle           │  │
 *   │  │   desc:  _textSecondary _small  marginTop _tiny│ │
 *   │  └───────────────────────────────────────────────┘  │
 *   │  (TransitionGroup: enter translateX(1.25em))       │
 *   └─────────────────────────────────────────────────────┘
 *
 * 用户改 maxWidth 数字 → container 最大宽度等比缩(其它走固定 spacing token,不缩)。
 * duration 默认 4500ms,loading=true 默认 0(不自动关)。非 iem 单位走 `:css` 兜底。
 */
const props = withDefaults(defineProps<ZNotificationProps>(), {
  placement: 'top-right',
  maxWidth: 22.5,
})
const emit = defineEmits<ZNotificationEmits>()

const theme = useZTheme()

const containerClass = computed(() =>
  icss(theme.value, s => {
    s.position.fixed
    const [vert, horiz] = props.placement.split('-') as ['top' | 'bottom', 'left' | 'right']
    if (vert === 'top') s.top.px(sizePx(1.5))
    else s.bottom.px(sizePx(1.5))
    if (horiz === 'left') s.left.px(sizePx(1.5))
    else s.right.px(sizePx(1.5))
    s.display.flex
    s.flexDirection.column
    s.gap._small
    s.zIndex._toast
    s.pointerEvents.none
    s.maxWidth.px(sizePx(props.maxWidth ?? 22.5))
    props.css?.(s)
  }),
)

const itemClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.gap._small
    s.padding._middle
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.boxShadow._middle
    s.color._text
    s.fontSize._small
    s.lineHeight._normal
    s.pointerEvents.auto
  }),
)

const iconClass = (item: ZNotificationItem): string =>
  icss(theme.value, s => {
    if (item.color) s.color(item.color)
    else s.color._info
    s.fontSize._large
    s.flexShrink(0)
  })

const titleClass = computed(() =>
  icss(theme.value, s => {
    s.fontWeight._semibold
    s.color._text
    s.fontSize._middle
  }),
)

const descClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontSize._small
    s.marginTop._tiny
  }),
)

const closeBtnClass = computed(() =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.color._textSecondary
    s.flexShrink(0)
    s.marginLeft._small
    s._hover(h2 => {
      h2.color._text
    })
  }),
)

// timers —— 不放在 reactive(Map 在 Vue reactivity 中有边界问题);仅闭包变量
const timers = new Map<ZNotificationItem['id'], ReturnType<typeof setTimeout>>()

function scheduleClose(item: ZNotificationItem): void {
  const duration = item.duration ?? (item.loading ? 0 : 4500)
  if (duration <= 0) return
  const t = setTimeout(() => {
    emit('close', item.id)
    timers.delete(item.id)
  }, duration)
  timers.set(item.id, t)
}

onMounted(() => {
  for (const m of props.items) scheduleClose(m)
})

watch(
  () => props.items.map(m => m.id),
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
        const item = props.items.find(m => m.id === id)
        if (item) scheduleClose(item)
      }
    }
  },
)

onUnmounted(() => {
  for (const t of timers.values()) clearTimeout(t)
  timers.clear()
})

function renderIcon(item: ZNotificationItem) {
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

const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))

const transitionActiveClass = computed(() =>
  icss(theme.value, s => {
    s.transitionProperty.all
    s.transitionDuration._middle
    s.transitionTimingFunction._default
  }),
)
const slideBoundaryClass = computed(() =>
  icss(theme.value, s => {
    s.opacity._none
    s.transform('translateX(1.25em)')
  }),
)
</script>

<template>
  <Teleport to="body">
    <div :class="containerClass" role="status" aria-live="polite">
      <TransitionGroup
        :enter-from-class="slideBoundaryClass"
        :enter-active-class="transitionActiveClass"
        :leave-active-class="transitionActiveClass"
        :leave-to-class="slideBoundaryClass"
        tag="div"
      >
        <div v-for="item in items" :key="item.id" :class="itemClass">
          <span :class="iconClass(item)">
            <component :is="renderIcon(item)" />
          </span>
          <div style="flex: 1; min-width: 0">
            <div :class="titleClass">{{ item.title }}</div>
            <div v-if="item.description" :class="descClass">{{ item.description }}</div>
          </div>
          <button
            v-if="item.closable !== false"
            type="button"
            :class="closeBtnClass"
            aria-label="关闭"
            @click="emit('close', item.id)"
          >
            <component :is="closeIcon" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
