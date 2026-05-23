<script lang="ts">
/**
 * `ZCollapse` —— 折叠面板(items 配置式)。
 *
 * **API**:
 * - `v-model:value` —— 当前展开的 key(s)。`accordion=true` → string;否则 string[]
 * - `items: Array<{ key, title, disabled? }>` —— panel 定义
 * - `accordion?: boolean` —— 同时只展开一个,默认 false
 * - `bordered?: boolean` —— 外框 + 分割线,默认 true
 * - slot `default`:scope `{ item }` 自定义每个 panel 内容(根据 item.key 区分)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCollapseItem {
  key: string
  title: string
  disabled?: boolean
}

export interface ZCollapseProps {
  value?: string | string[] | null
  items: ZCollapseItem[]
  accordion?: boolean
  bordered?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCollapseEmits {
  (e: 'update:value', value: string | string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZCollapseProps>(), {
  accordion: false,
  bordered: true,
})

const emit = defineEmits<ZCollapseEmits>()

const theme = useZTheme()

// 2026-05-23 技术债务修复:不用 reactive Set(Vue test-utils 在 SFC 组件实例化时
// 可能触发 "Invalid value used as weak map key");改为 array.includes。
const expandedList = computed<string[]>(() => {
  const v = props.value
  if (v == null) return []
  if (Array.isArray(v)) return v
  return [v]
})

function isExpanded(key: string): boolean {
  return expandedList.value.includes(key)
}

function toggle(item: ZCollapseItem): void {
  if (item.disabled) return
  if (props.accordion) {
    emit('update:value', isExpanded(item.key) ? '' : item.key)
  } else {
    const cur = expandedList.value
    const next = cur.includes(item.key)
      ? cur.filter((k) => k !== item.key)
      : [...cur, item.key]
    emit('update:value', next)
  }
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.fontSize._middle
    if (props.bordered) {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
      s.borderRadius._small
      s.overflow.hidden
    }
    props.css?.(s)
  }),
)

function headerClass(item: ZCollapseItem, idx: number): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
    s.padding._middle
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.width.pct(100)
    s.color._text
    s.fontSize._middle
    s.fontWeight._medium
    s.textAlign.left
    if (idx > 0 && props.bordered) {
      s.borderTopWidth._thin
      s.borderTopStyle.solid
      s.borderTopColor._border
    }
    s._hover((h2) => {
      if (!item.disabled) h2.backgroundColor._bgMuted
    })
    if (item.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    }
  })
}

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    s.borderTopWidth._thin
    s.borderTopStyle.solid
    s.borderTopColor._border
    s.backgroundColor._bg
  }),
)

const arrowClass = (expanded: boolean): string =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.transitionProperty._transform
    s.transitionDuration._small
    s.transform(expanded ? 'rotate(180deg)' : 'rotate(0deg)')
  })

const downIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronDown }))
</script>

<template>
  <div :class="rootClass">
    <template v-for="(item, idx) in items" :key="item.key">
      <button
        type="button"
        :class="headerClass(item, idx)"
        :aria-expanded="isExpanded(item.key)"
        :aria-disabled="item.disabled"
        :disabled="item.disabled"
        @click="toggle(item)"
      >
        <span>{{ item.title }}</span>
        <span :class="arrowClass(isExpanded(item.key))">
          <component :is="downIcon" />
        </span>
      </button>
      <div v-if="isExpanded(item.key)" :class="bodyClass" role="region">
        <slot :item="item" />
      </div>
    </template>
  </div>
</template>
