<script lang="ts">
/**
 * `ZPopconfirm` —— 气泡确认框(基于 ZPopover 形式手写,确认/取消按钮)。
 *
 * **API**:
 * - `title?: string` / `description?: string`
 * - `okText?: string` / `cancelText?: string`
 * - `placement?: Placement` —— 默认 `'top'`
 * - emit:`confirm` / `cancel`
 * - slot `default`(触发器)
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZPopconfirmProps {
  title?: string
  description?: string
  okText?: string
  cancelText?: string
  placement?: Placement
  disabled?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZPopconfirmEmits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { usePopper, useEscapeStack } from '../_hooks'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZPopconfirmProps>(), {
  okText: '确定',
  cancelText: '取消',
  placement: 'top',
  disabled: false,
})

const emit = defineEmits<ZPopconfirmEmits>()

const theme = useZTheme()

const triggerRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const visible = ref(false)

const { floatingStyles } = usePopper(triggerRef, floatingRef, {
  placement: computed(() => props.placement),
  offset: 8,
})

useEscapeStack(
  () => {
    if (visible.value) visible.value = false
  },
  { enabled: visible },
)

onClickOutside(triggerRef, (e: Event) => {
  if (!visible.value) return
  if (floatingRef.value && e.target && floatingRef.value.contains(e.target as Node)) return
  visible.value = false
})

function toggle(): void {
  if (props.disabled) return
  visible.value = !visible.value
}
function onConfirm(): void {
  emit('confirm')
  visible.value = false
}
function onCancel(): void {
  emit('cancel')
  visible.value = false
}

const triggerWrapClass = computed(() => icss(theme.value, (s) => s.display.inlineFlex))

/**
 * popper 容器盒子模型(iem):
 * - min-width: 12iem
 * - max-width: 20iem
 * - border: _thin
 * - padding: _middle
 */
const popperClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.padding._middle
    s.minWidth.iem(12)
    s.maxWidth.iem(20)
    s.fontSize._small
    s.display.flex
    s.flexDirection.column
    s.gap._small
    props.css?.(s)
  }),
)

const headRowClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.flexStart
    s.gap._small
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontWeight._semibold
    s.color._text
  }),
)

const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
  }),
)

const iconClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._warning
    s.flexShrink(0)
    s.fontSize._middle
  }),
)

const actionsClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.justifyContent.flexEnd
    s.gap._tiny
    s.marginTop._tiny
  }),
)

function btnClass(primary: boolean): string {
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.borderRadius._tiny
    s.fontSize._small
    s.fontWeight._medium
    s.paddingLeft._small
    s.paddingRight._small
    s.paddingTop.iem(0.25)
    s.paddingBottom.iem(0.25)
    s.borderWidth._thin
    s.borderStyle.solid
    if (primary) {
      s.backgroundColor._primary
      s.color._bg
      s.borderColor.transparent
    } else {
      s.backgroundColor.transparent
      s.color._text
      s.borderColor._border
    }
  })
}

const warningIcon = computed(() => h(ZIcon, { component: BuiltinIcons.warning }))
</script>

<template>
  <span ref="triggerRef" :class="triggerWrapClass" @click="toggle">
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="visible"
      ref="floatingRef"
      :class="popperClass"
      :style="floatingStyles"
      role="dialog"
    >
      <div :class="headRowClass">
        <span :class="iconClass">
          <component :is="warningIcon" />
        </span>
        <div>
          <div v-if="title" :class="titleClass">{{ title }}</div>
          <div v-if="description" :class="descClass">{{ description }}</div>
        </div>
      </div>
      <div :class="actionsClass">
        <button type="button" :class="btnClass(false)" @click="onCancel">{{ cancelText }}</button>
        <button type="button" :class="btnClass(true)" @click="onConfirm">{{ okText }}</button>
      </div>
    </div>
  </Teleport>
</template>
