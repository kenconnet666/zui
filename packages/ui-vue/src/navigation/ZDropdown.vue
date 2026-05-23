<script lang="ts">
/**
 * `ZDropdown` —— 下拉菜单(基于 usePopper + Teleport + onClickOutside,内置选项渲染)。
 *
 * **API**:
 * - `items: ZDropdownItem[]` —— 选项
 * - `placement?: Placement` —— 默认 `'bottom-start'`
 * - `trigger?: 'click' | 'hover' | 'manual'` —— 默认 `'click'`
 * - `v-model:visible`
 * - slot `default`(触发器,通常是按钮)
 *
 * **a11y**:trigger 上 `aria-haspopup="menu"` / `aria-expanded`,菜单 `role="menu"`,
 * 选项 `role="menuitem"`。
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZDropdownItem {
  key: string
  label: string
  disabled?: boolean
  danger?: boolean
}

export type ZDropdownTrigger = 'click' | 'hover' | 'manual'

export interface ZDropdownProps {
  items: ZDropdownItem[]
  placement?: Placement
  trigger?: ZDropdownTrigger
  visible?: boolean
  disabled?: boolean
  sxMenu?: SxObject
  sxItem?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZDropdownEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'select', key: string): void
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { usePopper, useEscapeStack } from '../_hooks'
import { applySx, extractSxAttrs } from '../_internal/sx'

const props = withDefaults(defineProps<ZDropdownProps>(), {
  placement: 'bottom-start',
  trigger: 'click',
  visible: false,
  disabled: false,
})

const emit = defineEmits<ZDropdownEmits>()

const theme = useZTheme()

const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const innerVisible = ref(false)

const actualVisible = computed(() => {
  if (props.disabled) return false
  if (props.trigger === 'manual') return props.visible
  return innerVisible.value
})

const { floatingStyles } = usePopper(triggerRef, menuRef, {
  placement: computed(() => props.placement),
  offset: 4,
})

function setVisible(v: boolean): void {
  innerVisible.value = v
  emit('update:visible', v)
}

watch(
  () => props.visible,
  (v) => {
    if (props.trigger === 'manual') innerVisible.value = v
  },
  { immediate: true },
)

useEscapeStack(
  () => {
    if (innerVisible.value && props.trigger !== 'manual') setVisible(false)
  },
  { enabled: innerVisible },
)

onClickOutside(triggerRef, (e: Event) => {
  if (props.trigger !== 'click') return
  if (!innerVisible.value) return
  if (menuRef.value && e.target && menuRef.value.contains(e.target as Node)) return
  setVisible(false)
})

function onTriggerClick(): void {
  if (props.disabled || props.trigger === 'manual') return
  if (props.trigger === 'click') setVisible(!innerVisible.value)
}
function onTriggerHover(open: boolean): void {
  if (props.disabled || props.trigger !== 'hover') return
  setVisible(open)
}

function selectItem(item: ZDropdownItem): void {
  if (item.disabled) return
  emit('select', item.key)
  setVisible(false)
}

const triggerWrapClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
  }),
)

const menuClass = computed(() =>
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
    s.padding._tiny
    s.minWidth.iem(8)
    s.display.flex
    s.flexDirection.column
    applySx(s, props.sxMenu)
    props.css?.(s)
  }),
)
const sxMenuAttrs = computed(() => extractSxAttrs(props.sxMenu))

function itemClass(item: ZDropdownItem): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.cursor.pointer
    s.fontSize._middle
    if (item.danger) s.color._danger
    else s.color._text
    if (item.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    } else {
      s._hover((h2) => {
        h2.backgroundColor._textSecondary.alpha(8)
      })
    }
    applySx(s, props.sxItem)
  })
}
const sxItemAttrs = computed(() => extractSxAttrs(props.sxItem))
</script>

<template>
  <span
    ref="triggerRef"
    :class="triggerWrapClass"
    aria-haspopup="menu"
    :aria-expanded="actualVisible"
    @click="onTriggerClick"
    @mouseenter="onTriggerHover(true)"
    @mouseleave="onTriggerHover(false)"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="actualVisible"
      ref="menuRef"
      :class="[menuClass, sxMenuAttrs.class]"
      :style="[floatingStyles, sxMenuAttrs.style]"
      role="menu"
      v-bind="sxMenuAttrs.attrs"
    >
      <div
        v-for="item in items"
        :key="item.key"
        :class="[itemClass(item), sxItemAttrs.class]"
        :style="sxItemAttrs.style"
        role="menuitem"
        :aria-disabled="item.disabled"
        v-bind="sxItemAttrs.attrs"
        @click="selectItem(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </Teleport>
</template>
