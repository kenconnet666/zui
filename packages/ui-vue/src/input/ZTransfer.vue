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
  /**
   * 单个 item 行高 —— px 倍数(1 单位 = 16px)。默认 `2`(= 32px)。
   * 左右两列 list 由 `ZVirtualList` 渲染(2026-05-24 v2)。
   */
  itemSize?: number
  /** list 容器高度 —— px 倍数(1 单位 = 16px)。默认 `15`(= 240px)。 */
  listHeight?: number
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTransferEmits {
  (e: 'update:targetKeys', keys: string[]): void
  /** 右侧 key 列表变化(与 `update:targetKeys` 同值,便于不用 v-model 的消费方)。 */
  (e: 'change', keys: string[]): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import ZVirtualList from '../display/ZVirtualList.vue'
import ZCheckbox from './ZCheckbox.vue'
import { sizePx } from '../_internal/sizing'

/**
 * 盒子模型(px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │ ZTransfer root  flex / center / gap _middle              │   color: _text / fontSize _small
 *   │                                                          │
 *   │  ┌──────────────┐    ┌────┐    ┌──────────────┐         │
 *   │  │ left panel   │    │ →  │    │ right panel  │         │   panel:
 *   │  │  width 200px  │    │ ←  │    │  width 200px  │         │     width: 200px(= sizePx(12.5))
 *   │  │  border _thin│    │ 32px    │  border _thin│         │     border _thin _border
 *   │  │  border-radius│    │ 圆角│    │  border-radius│         │     border-radius _small
 *   │  │   _small     │    │_tiny│    │   _small     │         │     flex column
 *   │  │  bg _bg      │    │ btn │    │  bg _bg      │         │
 *   │  │              │    └────┘    │              │         │   panel head:
 *   │  │ ┌──────────┐ │   arrow btn: │ ┌──────────┐ │         │     pad _small
 *   │  │ │ head     │ │  width/h 32px │ │ head     │ │         │     bg _bgMuted
 *   │  │ │ pad _small│ │   ←→ icons   │ │ pad _small│ │         │     fontWeight _semibold
 *   │  │ │ bg _bgMutd│ │              │ │ bg _bgMutd│ │         │
 *   │  │ │ _semibold │ │              │ │ _semibold │ │         │   list:
 *   │  │ │ border-b _thin              │ │ border-b _thin│         │     max-height 240px
 *   │  │ └──────────┘ │              │ └──────────┘ │         │     overflow-y auto
 *   │  │ ┌──────────┐ │              │ ┌──────────┐ │         │     pad _tiny
 *   │  │ │ list     │ │              │ │ list     │ │         │
 *   │  │ │ max-h 15 │ │              │ │ max-h 15 │ │         │   item row:
 *   │  │ │ overflow │ │              │ │ overflow │ │         │     checkbox + label
 *   │  │ │ pad _tiny │ │              │ │ pad _tiny │ │         │     checked: bg _primary.alpha(8)
 *   │  │ └──────────┘ │              │ └──────────┘ │         │
 *   │  └──────────────┘              └──────────────┘         │
 *   └──────────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZTransferProps>(), {
  targetKeys: () => [],
  titles: () => ['源', '目标'],
  itemSize: 2,
  listHeight: 15,
})

const emit = defineEmits<ZTransferEmits>()

const theme = useZTheme()

const titlesRef = computed<[string, string]>(() => props.titles ?? ['源', '目标'])

// 2026-05-23 技术债务修复:Set 改为 string[](避免 Vue test-utils weak map key 问题)
const leftChecked = ref<string[]>([])
const rightChecked = ref<string[]>([])

const leftItems = computed(() => props.dataSource.filter(it => !props.targetKeys.includes(it.key)))
const rightItems = computed(() => props.dataSource.filter(it => props.targetKeys.includes(it.key)))

function moveRight(): void {
  const next = [...props.targetKeys, ...leftChecked.value]
  emit('update:targetKeys', next)
  emit('change', next)
  leftChecked.value = []
}

function moveLeft(): void {
  const checkedKeys = rightChecked.value
  const next = props.targetKeys.filter(k => !checkedKeys.includes(k))
  emit('update:targetKeys', next)
  emit('change', next)
  rightChecked.value = []
}

function toggleLeft(key: string, disabled: boolean): void {
  if (disabled) return
  leftChecked.value = leftChecked.value.includes(key)
    ? leftChecked.value.filter(k => k !== key)
    : [...leftChecked.value, key]
}
function toggleRight(key: string, disabled: boolean): void {
  if (disabled) return
  rightChecked.value = rightChecked.value.includes(key)
    ? rightChecked.value.filter(k => k !== key)
    : [...rightChecked.value, key]
}

const rootClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.gap._middle
    s.color._text
    s.fontSize._small
    props.css?.(s)
  }),
)

const panelClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.width.px(sizePx(12.5))
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.borderRadius._small
    s.overflow.hidden
    s.backgroundColor._bg
  }),
)

const panelHeadClass = computed(() =>
  icss(theme.value, s => {
    s.padding._small
    s.backgroundColor._bgMuted
    s.fontWeight._semibold
    s.borderBottomWidth._thin
    s.borderBottomStyle.solid
    s.borderBottomColor._border
  }),
)

const listClass = computed(() =>
  icss(theme.value, s => {
    s.padding._tiny
  }),
)

const itemRowClass = (checked: boolean, disabled: boolean): string =>
  icss(theme.value, s => {
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
      s._hover(h2 => {
        if (!checked) h2.backgroundColor._textSecondary.alpha(8)
      })
  })

const arrowsClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
  }),
)

const arrowBtnClass = (enabled: boolean): string =>
  icss(theme.value, s => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.width.px(sizePx(2))
    s.height.px(sizePx(2))
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.backgroundColor._bg
    s.cursor(enabled ? 'pointer' : 'not-allowed')
    s.color(enabled ? '_primary' : '_textSecondary')
    if (!enabled) s.opacity._dim
  })

const emptyClass = computed(() =>
  icss(theme.value, s => {
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
      <div :class="panelHeadClass">{{ titlesRef[0] }} ({{ leftItems.length }})</div>
      <div :class="listClass">
        <div v-if="leftItems.length === 0" :class="emptyClass">无数据</div>
        <ZVirtualList
          v-else
          :items="leftItems"
          :item-size="itemSize ?? 2"
          :height="listHeight ?? 15"
          key-field="key"
        >
          <template #default="{ item }">
            <div :class="itemRowClass(leftChecked.includes(item.key), !!item.disabled)">
              <ZCheckbox
                :checked="leftChecked.includes(item.key)"
                :disabled="item.disabled"
                :label="item.label"
                @update:checked="(v: boolean) => { if (v !== leftChecked.includes(item.key)) toggleLeft(item.key, !!item.disabled) }"
                @click.stop
              />
            </div>
          </template>
        </ZVirtualList>
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
      <div :class="panelHeadClass">{{ titlesRef[1] }} ({{ rightItems.length }})</div>
      <div :class="listClass">
        <div v-if="rightItems.length === 0" :class="emptyClass">无数据</div>
        <ZVirtualList
          v-else
          :items="rightItems"
          :item-size="itemSize ?? 2"
          :height="listHeight ?? 15"
          key-field="key"
        >
          <template #default="{ item }">
            <div :class="itemRowClass(rightChecked.includes(item.key), !!item.disabled)">
              <ZCheckbox
                :checked="rightChecked.includes(item.key)"
                :disabled="item.disabled"
                :label="item.label"
                @update:checked="(v: boolean) => { if (v !== rightChecked.includes(item.key)) toggleRight(item.key, !!item.disabled) }"
                @click.stop
              />
            </div>
          </template>
        </ZVirtualList>
      </div>
    </div>
  </div>
</template>
