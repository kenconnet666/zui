<script lang="ts">
/**
 * `ZTabs` —— 标签页(配置式 + 三种 type)。
 *
 * **API**:
 * - `v-model:value`(当前激活的 name)
 * - `tabs: Array<{ name, label, disabled?, closable? }>` —— 配置式
 * - `type?: 'line' | 'card' | 'segment'` —— 默认 `'line'`
 * - `closable?: boolean` —— 全局关闭按钮(可被 tab 项 `closable` 覆盖)
 * - `addable?: boolean` —— 右侧添加按钮
 * - `disabled?: boolean`
 * - sx:sxTab(单个 tab head)/ sxPanel(内容区)/ sxList(tab 头容器)
 *
 * **slots**:`#default` —— 渲染 panel 内容,典型用 `<template #default="{ activeName }">`
 * 或自己按 `value` 切换内容
 *
 * **emit**:`update:value` / `change` / `add` / `close(name)`
 *
 * **a11y**:`role="tablist"` / `role="tab"` / `aria-selected`(tablist 容器);panel `role="tabpanel"`。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface ZTabItem {
  name: string
  label: string
  disabled?: boolean
  closable?: boolean
}

export interface ZTabsProps {
  value?: string
  tabs: ZTabItem[]
  type?: 'line' | 'card' | 'segment'
  closable?: boolean
  addable?: boolean
  disabled?: boolean
  sxList?: SxObject
  sxTab?: SxObject
  sxPanel?: SxObject
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTabsEmits {
  (e: 'update:value', name: string): void
  (e: 'change', name: string): void
  (e: 'add'): void
  (e: 'close', name: string): void
}
</script>

<script lang="ts" setup>
import { computed, h } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'
import { BuiltinIcons, ZIcon } from '../gene'

const props = withDefaults(defineProps<ZTabsProps>(), {
  type: 'line',
  closable: false,
  addable: false,
  disabled: false,
})

const emit = defineEmits<ZTabsEmits>()

const theme = useZTheme()

const activeName = computed(
  () => props.value ?? props.tabs.find((t) => !t.disabled)?.name ?? props.tabs[0]?.name ?? '',
)

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    props.css?.(s)
  }),
)

const listClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.stretch
    s.gap._tiny
    if (props.type === 'line') {
      s.borderBottomWidth._thin
      s.borderBottomStyle.solid
      s.borderBottomColor._border
    } else if (props.type === 'card') {
      s.marginBottom.px(-1)
    } else if (props.type === 'segment') {
      s.padding._tiny
      s.backgroundColor._bgMuted
      s.borderRadius._small
    }
    applySx(s, props.sxList)
  }),
)
const sxListAttrs = computed(() => extractSxAttrs(props.sxList))

function tabClass(tab: ZTabItem, isActive: boolean): string {
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.gap._tiny
    s.padding._small
    s.paddingLeft._middle
    s.paddingRight._middle
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.color._textSecondary
    s.fontSize._middle
    s.transitionProperty._colors
    s.transitionDuration._small

    if (props.type === 'line') {
      s.borderBottomWidth._thick
      s.borderBottomStyle.solid
      s.borderBottomColor.transparent
      s.marginBottom.px(-1)
      if (isActive) {
        s.color._primary
        s.borderBottomColor._primary
      }
    } else if (props.type === 'card') {
      s.borderWidth._thin
      s.borderStyle.solid
      s.borderColor._border
      s.borderTopLeftRadius._small
      s.borderTopRightRadius._small
      if (isActive) {
        s.color._text
        s.backgroundColor._bg
        s.borderBottomColor.transparent
      } else {
        s.backgroundColor._bgMuted
      }
    } else if (props.type === 'segment') {
      s.borderRadius._tiny
      if (isActive) {
        s.color._text
        s.backgroundColor._bg
        s.boxShadow._tiny
      }
    }

    s._hover((h2) => {
      if (!tab.disabled && !isActive) h2.color._text
    })
    if (tab.disabled || props.disabled) {
      s.opacity._dim
      s.cursor.notAllowed
    }
    applySx(s, props.sxTab)
  })
}
const sxTabAttrs = computed(() => extractSxAttrs(props.sxTab))

const panelClass = computed(() =>
  icss(theme.value, (s) => {
    s.padding._middle
    applySx(s, props.sxPanel)
  }),
)
const sxPanelAttrs = computed(() => extractSxAttrs(props.sxPanel))

const closeBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding.px(0)
    s.fontSize._small
    s.color._textSecondary
    s._hover((h2) => {
      h2.color._text
    })
  }),
)

const addBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding._small
    s.fontSize._middle
    s.color._textSecondary
    s._hover((h2) => {
      h2.color._primary
    })
  }),
)

function select(tab: ZTabItem): void {
  if (tab.disabled || props.disabled) return
  if (tab.name === activeName.value) return
  emit('update:value', tab.name)
  emit('change', tab.name)
}

function onClose(tab: ZTabItem, e: MouseEvent): void {
  e.stopPropagation()
  if (props.disabled) return
  emit('close', tab.name)
}

function onAdd(): void {
  if (props.disabled) return
  emit('add')
}

const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
const addIcon = computed(() => h(ZIcon, { component: BuiltinIcons.add }))

function isTabClosable(t: ZTabItem): boolean {
  return t.closable ?? props.closable
}
</script>

<template>
  <div :class="rootClass">
    <div
      :class="[listClass, sxListAttrs.class]"
      :style="sxListAttrs.style"
      role="tablist"
      v-bind="sxListAttrs.attrs"
    >
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        :class="[tabClass(tab, tab.name === activeName), sxTabAttrs.class]"
        :style="sxTabAttrs.style"
        role="tab"
        :aria-selected="tab.name === activeName"
        :aria-disabled="tab.disabled || disabled"
        :tabindex="tab.name === activeName ? 0 : -1"
        v-bind="sxTabAttrs.attrs"
        @click="select(tab)"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="isTabClosable(tab)"
          :class="closeBtnClass"
          role="button"
          aria-label="关闭"
          @click="onClose(tab, $event)"
        >
          <component :is="closeIcon" />
        </span>
      </button>
      <button
        v-if="addable"
        type="button"
        :class="addBtnClass"
        aria-label="添加"
        :disabled="disabled"
        @click="onAdd"
      >
        <component :is="addIcon" />
      </button>
    </div>
    <div
      :class="[panelClass, sxPanelAttrs.class]"
      :style="sxPanelAttrs.style"
      role="tabpanel"
      v-bind="sxPanelAttrs.attrs"
    >
      <slot :activeName="activeName" />
    </div>
  </div>
</template>
