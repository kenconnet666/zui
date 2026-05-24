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

const titlesRef = computed<[string, string]>(() => props.titles ?? ['源', '目标'])

// 2026-05-23 技术债务修复:Set 改为 string[](避免 Vue test-utils weak map key 问题)
const leftChecked = ref<string[]>([])
const rightChecked = ref<string[]>([])

const leftItems = computed(() =>
  props.dataSource.filter((it) => !props.targetKeys.includes(it.key)),
)
const rightItems = computed(() =>
  props.dataSource.filter((it) => props.targetKeys.includes(it.key)),
)

function moveRight(): void {
  const next = [...props.targetKeys, ...leftChecked.value]
  emit('update:targetKeys', next)
  emit('change', next)
  leftChecked.value = []
}

function moveLeft(): void {
  const checkedKeys = rightChecked.value
  const next = props.targetKeys.filter((k) => !checkedKeys.includes(k))
  emit('update:targetKeys', next)
  emit('change', next)
  rightChecked.value = []
}

function toggleLeft(key: string, disabled: boolean): void {
  if (disabled) return
  leftChecked.value = leftChecked.value.includes(key)
    ? leftChecked.value.filter((k) => k !== key)
    : [...leftChecked.value, key]
}
function toggleRight(key: string, disabled: boolean): void {
  if (disabled) return
  rightChecked.value = rightChecked.value.includes(key)
    ? rightChecked.value.filter((k) => k !== key)
    : [...rightChecked.value, key]
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

/**
 * 左右面板盒子模型(iem):
 * - width: 12.5iem,固定宽
 * - border: _thin,圆角 _small
 * - 内部纵向布局:head + list
 */
const panelClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.width.iem(12.5)
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius._small
    s.overflow.hidden
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

/**
 * 列表容器盒子模型(iem):
 * - maxHeight: 15iem,超出滚动
 * - padding: _tiny
 */
const listClass = computed(() =>
  icss(theme.value, (s) => {
    s.maxHeight.iem(15)
    s.overflowY.auto
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

/**
 * 中间方向按钮盒子模型(iem):
 * - width/height: 2iem,正方形
 * - border: _thin,圆角 _tiny
 */
function arrowBtnClass(enabled: boolean): string {
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.iem(2)
    s.height.iem(2)
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
    s.textAlign.center
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
        {{ titlesRef[0] }} ({{ leftItems.length }})
      </div>
      <div :class="listClass">
        <template v-if="leftItems.length > 0">
          <div
            v-for="item in leftItems"
            :key="item.key"
            :class="itemRowClass(leftChecked.includes(item.key), !!item.disabled)"
            @click="toggleLeft(item.key, !!item.disabled)"
          >
            <input
              type="checkbox"
              :checked="leftChecked.includes(item.key)"
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
        :class="arrowBtnClass(leftChecked.length > 0)"
        :disabled="leftChecked.length === 0"
        aria-label="移到右侧"
        @click="moveRight"
      >
        <component :is="rightIcon" />
      </button>
      <button
        type="button"
        :class="arrowBtnClass(rightChecked.length > 0)"
        :disabled="rightChecked.length === 0"
        aria-label="移到左侧"
        @click="moveLeft"
      >
        <component :is="leftIcon" />
      </button>
    </div>

    <div :class="panelClass">
      <div :class="panelHeadClass">
        {{ titlesRef[1] }} ({{ rightItems.length }})
      </div>
      <div :class="listClass">
        <template v-if="rightItems.length > 0">
          <div
            v-for="item in rightItems"
            :key="item.key"
            :class="itemRowClass(rightChecked.includes(item.key), !!item.disabled)"
            @click="toggleRight(item.key, !!item.disabled)"
          >
            <input
              type="checkbox"
              :checked="rightChecked.includes(item.key)"
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
