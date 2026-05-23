<script lang="ts">
/**
 * `ZNotification` —— 右上角通知(类 ZMessage 但带 title + description + closable)。
 *
 * **使用模式**(两种,跟 ZMessage 一致):
 * 1. 组件模式:`<ZNotification :items />` 业务方自管 items 数组
 * 2. 工厂模式:`createNotificationApi()` 见 `notificationApi.ts`
 *
 * **types**:info / success / warning / danger / loading
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export type ZNotificationType = 'info' | 'success' | 'warning' | 'danger' | 'loading'

export interface ZNotificationItem {
  id: string | number
  type: ZNotificationType
  title: string
  description?: string
  duration?: number
  closable?: boolean
}

export interface ZNotificationProps {
  items: ZNotificationItem[]
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
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

const props = withDefaults(defineProps<ZNotificationProps>(), {
  placement: 'top-right',
})
const emit = defineEmits<ZNotificationEmits>()

const theme = useZTheme()

const TYPE_ICON: Record<ZNotificationType, keyof typeof BuiltinIcons> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  loading: 'refresh',
}

const TYPE_COLOR: Record<ZNotificationType, 'success' | 'warning' | 'danger' | 'info'> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  loading: 'info',
}

const containerClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    const [vert, horiz] = props.placement.split('-') as ['top' | 'bottom', 'left' | 'right']
    s._prop(vert, '24px')
    s._prop(horiz, '24px')
    s.display.flex
    s.flexDirection.column
    s.gap._small
    s.zIndex._toast
    s.pointerEvents.none
    s._prop('maxWidth', '360px')
    props.css?.(s)
  }),
)

function itemClass(type: ZNotificationType): string {
  return icss(theme.value, (s) => {
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
    void type // 未在 style 中使用,保留参数语义
  })
}

function iconClass(type: ZNotificationType): string {
  return icss(theme.value, (s) => {
    s.color[`_${TYPE_COLOR[type]}` as const]
    s.fontSize._large
    s.flexShrink(0)
  })
}

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontWeight._semibold
    s.color._text
    s.fontSize._middle
  }),
)

const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.marginTop._tiny
  }),
)

const closeBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding('0')
    s.color._textSecondary
    s.flexShrink(0)
    s.marginLeft._small
    s._hover((h2) => {
      h2.color._text
    })
  }),
)

// timers —— 不放在 reactive(Map 在 Vue reactivity 中有边界问题);仅闭包变量
const timers = new Map<ZNotificationItem['id'], ReturnType<typeof setTimeout>>()

function scheduleClose(item: ZNotificationItem): void {
  const duration = item.duration ?? (item.type === 'loading' ? 0 : 4500)
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
  () => props.items.map((m) => m.id),
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
        const item = props.items.find((m) => m.id === id)
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
  const isLoading = item.type === 'loading'
  return h(ZIcon, {
    component: BuiltinIcons[TYPE_ICON[item.type]],
    ...(isLoading
      ? {
          spin: (d: Chain<ZuiSchema>['animationDuration']) => {
            d.s(1)
          },
        }
      : {}),
  })
}

const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
</script>

<template>
  <Teleport to="body">
    <div :class="containerClass" role="status" aria-live="polite">
      <TransitionGroup name="zui-notify" tag="div">
        <div v-for="item in items" :key="item.id" :class="itemClass(item.type)">
          <span :class="iconClass(item.type)">
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

<style>
.zui-notify-enter-active,
.zui-notify-leave-active {
  transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.zui-notify-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.zui-notify-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
