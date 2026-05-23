<script lang="ts">
/**
 * `ZCascader` —— 级联选择(基于树形数据 + popper)。简化:列式展开(每列一层 children)。
 *
 * - `v-model:value` —— string[](从根到叶的 key 路径)
 * - `options: ZCascaderOption[]` —— 树形选项
 * - `placeholder?` / `disabled?`
 * - `expandTrigger?: 'click' | 'hover'` —— 子级展开触发,默认 click
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCascaderOption {
  value: string
  label: string
  disabled?: boolean
  children?: ZCascaderOption[]
}

export interface ZCascaderProps {
  value?: string[]
  options: ZCascaderOption[]
  placeholder?: string
  disabled?: boolean
  expandTrigger?: 'click' | 'hover'
  placement?: Placement
  separator?: string
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCascaderEmits {
  (e: 'update:value', value: string[]): void
  (e: 'change', value: string[], labels: string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { usePopper, useEscapeStack } from '../_hooks'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZCascaderProps>(), {
  placeholder: '请选择',
  disabled: false,
  expandTrigger: 'click',
  placement: 'bottom-start',
  separator: ' / ',
})

const emit = defineEmits<ZCascaderEmits>()

const theme = useZTheme()

const triggerRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
const open = ref(false)
// 活跃路径:每个 column 选中的 value
const activePath = ref<string[]>(props.value ?? [])

const { floatingStyles } = usePopper(triggerRef, popperRef, {
  placement: computed(() => props.placement),
  offset: 4,
})

useEscapeStack(
  () => {
    if (open.value) open.value = false
  },
  { enabled: open },
)

onClickOutside(triggerRef, (e: Event) => {
  if (!open.value) return
  if (popperRef.value && e.target && popperRef.value.contains(e.target as Node)) return
  open.value = false
})

const columns = computed<ZCascaderOption[][]>(() => {
  const result: ZCascaderOption[][] = [props.options]
  let current: ZCascaderOption[] | undefined = props.options
  for (const key of activePath.value) {
    const node: ZCascaderOption | undefined = current?.find((o) => o.value === key)
    if (node?.children && node.children.length > 0) {
      result.push(node.children)
      current = node.children
    } else {
      break
    }
  }
  return result
})

function selectedLabels(): string[] {
  const labels: string[] = []
  let level: ZCascaderOption[] | undefined = props.options
  for (const k of props.value ?? []) {
    const node: ZCascaderOption | undefined = level?.find((o) => o.value === k)
    if (!node) break
    labels.push(node.label)
    level = node.children
  }
  return labels
}

const displayText = computed(() => selectedLabels().join(props.separator))

function pickInColumn(colIndex: number, opt: ZCascaderOption): void {
  if (opt.disabled) return
  // 截断到本列 + 添加新选中
  const newPath = [...activePath.value.slice(0, colIndex), opt.value]
  activePath.value = newPath
  if (!opt.children || opt.children.length === 0) {
    // 叶子:提交
    const labels: string[] = []
    let level: ZCascaderOption[] | undefined = props.options
    for (const k of newPath) {
      const n: ZCascaderOption | undefined = level?.find((o) => o.value === k)
      if (!n) break
      labels.push(n.label)
      level = n.children
    }
    emit('update:value', newPath)
    emit('change', newPath, labels)
    open.value = false
  }
}

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    activePath.value = props.value ?? []
  }
}

const triggerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor(open.value ? '_primary' : '_border')
    s.backgroundColor._bg
    s.color._text
    s.fontSize._middle
    s.paddingLeft._small
    s.paddingRight._small
    s.paddingTop.iem(0.375)
    s.paddingBottom.iem(0.375)
    s.cursor(props.disabled ? 'not-allowed' : 'pointer')
    s.minWidth.iem(12)
    if (props.disabled) {
      s.opacity._dim
      s.backgroundColor._bgMuted
    }
    props.css?.(s)
  }),
)

const triggerTextClass = computed(() =>
  icss(theme.value, (s) => {
    s.flexGrow(1)
    if (!displayText.value) s.color._textSecondary
  }),
)

const popperClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.absolute
    s.zIndex._popover
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._middle
    s.display.flex
  }),
)

const columnClass = computed(() =>
  icss(theme.value, (s) => {
    s.minWidth.iem(8)
    s.maxHeight.iem(17.5)
    s.overflowY.auto
    s.borderRightWidth._thin
    s.borderRightStyle.solid
    s.borderRightColor._border
    s.padding._tiny
    s._lastChild((c) => {
      c.borderRightStyle.none
    })
  }),
)

function optionClass(opt: ZCascaderOption, isActive: boolean): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._tiny
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.fontSize._middle
    s.cursor(opt.disabled ? 'not-allowed' : 'pointer')
    if (isActive) {
      s.backgroundColor._primary.alpha(8)
      s.color._primary
    } else {
      s.color._text
      if (!opt.disabled) {
        s._hover((h2) => {
          h2.backgroundColor._textSecondary.alpha(8)
        })
      }
    }
    if (opt.disabled) s.opacity._dim
  })
}

const arrowClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(open.value ? 'rotate(180deg)' : 'rotate(0deg)')
  }),
)

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))
</script>

<template>
  <div
    ref="triggerRef"
    :class="triggerClass"
    role="combobox"
    :aria-expanded="open"
    :aria-disabled="disabled"
    @click="toggleOpen"
  >
    <span :class="triggerTextClass">{{ displayText || placeholder }}</span>
    <span :class="arrowClass">
      <component :is="downIcon" />
    </span>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      ref="popperRef"
      :class="popperClass"
      :style="floatingStyles"
      role="listbox"
    >
      <div v-for="(col, ci) in columns" :key="ci" :class="columnClass">
        <div
          v-for="opt in col"
          :key="opt.value"
          :class="optionClass(opt, activePath[ci] === opt.value)"
          role="option"
          :aria-selected="activePath[ci] === opt.value"
          :aria-disabled="opt.disabled"
          @click="pickInColumn(ci, opt)"
        >
          <span>{{ opt.label }}</span>
          <span v-if="opt.children && opt.children.length > 0">
            <component :is="rightIcon" />
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
