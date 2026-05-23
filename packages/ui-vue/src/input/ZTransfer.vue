<script lang="ts">
/**
 * `ZTransfer` —— 穿梭框(左右两个列表 + 选择互转)。
 *
 * **API**:
 * - `dataSource: Array<{ key, label, disabled? }>` —— 全量数据
 * - `v-model:targetKeys: string[]` —— 右侧已选 keys
 * - `titles?: [string, string]` —— 左右标题,默认 ['源','目标']
 *
 * 简化实现:不做 search filter / 远程加载,左侧未选 + 右侧已选 + 中间按钮。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTransferItem {
  key: string
  label: string
  disabled?: boolean
}

export interface ZTransferProps {
  dataSource: ZTransferItem[]
  targetKeys?: string[]
  titles?: [string, string]
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTransferEmits {
  (e: 'update:targetKeys', keys: string[]): void
  (e: 'change', keys: string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZTransferProps>(), {
  targetKeys: () => [],
  titles: () => ['源', '目标'],
})

const emit = defineEmits<ZTransferEmits>()

const theme = useZTheme()

const leftChecked = ref<Set<string>>(new Set())
const rightChecked = ref<Set<string>>(new Set())

const leftItems = computed(() =>
  props.dataSource.filter((it) => !props.targetKeys.includes(it.key)),
)
const rightItems = computed(() =>
  props.dataSource.filter((it) => props.targetKeys.includes(it.key)),
)

function moveRight(): void {
  const next = [...props.targetKeys, ...Array.from(leftChecked.value)]
  emit('update:targetKeys', next)
  emit('change', next)
  leftChecked.value = new Set()
}

function moveLeft(): void {
  const checked = rightChecked.value
  const next = props.targetKeys.filter((k) => !checked.has(k))
  emit('update:targetKeys', next)
  emit('change', next)
  rightChecked.value = new Set()
}

function toggleLeft(key: string, disabled: boolean): void {
  if (disabled) return
  const next = new Set(leftChecked.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  leftChecked.value = next
}
function toggleRight(key: string, disabled: boolean): void {
  if (disabled) return
  const next = new Set(rightChecked.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  rightChecked.value = next
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._middle
    s.color._text
    s.fontSize._small
    props.css?.(s)
  }),
)

const panelClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s._prop('width', '200px')
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius._small
    s._prop('overflow', 'hidden')
    s.backgroundColor._bg
  }),
)

const panelHeadClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._small
    s.backgroundColor._bgMuted
    s.fontWeight._semibold
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const listClass = computed(() =>
  icss(theme.value, (s) => {
    s._prop('maxHeight', '240px')
    s._prop('overflowY', 'auto')
    s.padding._tiny
  }),
)

function itemRowClass(checked: boolean, disabled: boolean): string {
  return icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.gap._tiny
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.cursor(disabled ? 'not-allowed' : 'pointer')
    if (checked) s.backgroundColor._primary.alpha(8)
    if (disabled) s.opacity._dim
    else
      s._hover((h2) => {
        if (!checked) h2.backgroundColor._textSecondary.alpha(8)
      })
  })
}

const arrowsClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
  }),
)

function arrowBtnClass(enabled: boolean): string {
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s._prop('width', 'calc(2 * var(--zui-iem, 16px))')
    s._prop('height', 'calc(2 * var(--zui-iem, 16px))')
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.cursor(enabled ? 'pointer' : 'not-allowed')
    s.color(enabled ? '_primary' : '_textSecondary')
    if (!enabled) s.opacity._dim
  })
}

const emptyClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._small
    s._prop('textAlign', 'center')
    s.color._textSecondary
    s.fontSize._small
  }),
)

const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))
const leftIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronLeft }))
</script>

<template>
  <div :class="rootClass">
    <div :class="panelClass">
      <div :class="panelHeadClass">
        {{ titles[0] }} ({{ leftItems.length }})
      </div>
      <div :class="listClass">
        <template v-if="leftItems.length > 0">
          <div
            v-for="item in leftItems"
            :key="item.key"
            :class="itemRowClass(leftChecked.has(item.key), !!item.disabled)"
            @click="toggleLeft(item.key, !!item.disabled)"
          >
            <input
              type="checkbox"
              :checked="leftChecked.has(item.key)"
              :disabled="item.disabled"
              @click.stop="toggleLeft(item.key, !!item.disabled)"
            />
            <span>{{ item.label }}</span>
          </div>
        </template>
        <div v-else :class="emptyClass">无数据</div>
      </div>
    </div>

    <div :class="arrowsClass">
      <button
        type="button"
        :class="arrowBtnClass(leftChecked.size > 0)"
        :disabled="leftChecked.size === 0"
        aria-label="移到右侧"
        @click="moveRight"
      >
        <component :is="rightIcon" />
      </button>
      <button
        type="button"
        :class="arrowBtnClass(rightChecked.size > 0)"
        :disabled="rightChecked.size === 0"
        aria-label="移到左侧"
        @click="moveLeft"
      >
        <component :is="leftIcon" />
      </button>
    </div>

    <div :class="panelClass">
      <div :class="panelHeadClass">
        {{ titles[1] }} ({{ rightItems.length }})
      </div>
      <div :class="listClass">
        <template v-if="rightItems.length > 0">
          <div
            v-for="item in rightItems"
            :key="item.key"
            :class="itemRowClass(rightChecked.has(item.key), !!item.disabled)"
            @click="toggleRight(item.key, !!item.disabled)"
          >
            <input
              type="checkbox"
              :checked="rightChecked.has(item.key)"
              :disabled="item.disabled"
              @click.stop="toggleRight(item.key, !!item.disabled)"
            />
            <span>{{ item.label }}</span>
          </div>
        </template>
        <div v-else :class="emptyClass">无数据</div>
      </div>
    </div>
  </div>
</template>
