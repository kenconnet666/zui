<script lang="ts">
/**
 * `ZTour` —— 新手引导(steps 配置 + 高亮目标 + popper 引导卡片)。
 *
 * **API**:
 * - `v-model:current?: number` —— 当前步 index(0-based)
 * - `steps: ZTourStep[]` —— 步骤配置
 * - `open: boolean` —— 是否显示
 * - emit `close` / `finish`
 *
 * 简化实现:用全屏 mask + popper 引导框,target 元素通过 CSS box-shadow 黑色透明做"开洞" 效果。
 */
import type { Placement } from '@floating-ui/vue'
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZTourStep {
  /** 目标元素 css selector(`'#my-btn'`)。 */
  target: string
  title: string
  description?: string
  placement?: Placement
}

export interface ZTourProps {
  current?: number
  steps: ZTourStep[]
  open: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZTourEmits {
  (e: 'update:current', value: number): void
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'finish'): void
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { useEscapeStack } from '../_hooks'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ mask(4 块矩形挖洞 target 周围)position fixed     │   bg _overlayBg.alpha(50)
 *   │   top / bottom / left / right 4 块包围 target       │   z-index _modal
 *   │   pointer-events: auto  → 点击 mask 关闭            │
 *   │                                                      │
 *   │       ┌────────────────┐                            │
 *   │       │ target element │ (high-light 区,无 mask)  │
 *   │       └────────────────┘                            │
 *   │           │ 12px offset                             │
 *   │           ▼                                         │
 *   │   ┌──────────────────────────────────────┐          │   tour card:
 *   │   │ tour card  position fixed            │          │     min-width 15iem
 *   │   │   min-width: 15iem                   │          │     max-width 22.5iem
 *   │   │   max-width: 22.5iem                 │          │     bg _bg / color _text
 *   │   │   pad: _middle  border-radius _small │          │     border _thin _border
 *   │   │   border _thin solid _border         │          │     boxShadow _huge
 *   │   │   boxShadow _huge                    │          │     z-index _modal
 *   │   │                                      │          │
 *   │   │  title    fontSize _large _semibold  │          │
 *   │   │  desc     _textSecondary _small      │          │
 *   │   │  ┌────────────────────────────────┐  │          │   footer:
 *   │   │  │ N/M    [prev] [next/finish]    │  │          │     flex spaceBetween
 *   │   │  │  _textSecondary _small           │          │     btn: pad-y 0.25iem
 *   │   │  └────────────────────────────────┘  │          │     primary bg _primary
 *   │   └──────────────────────────────────────┘          │
 *   └──────────────────────────────────────────────────────┘
 *
 * ESC 关。
 */
const props = withDefaults(defineProps<ZTourProps>(), {
  current: 0,
})

const emit = defineEmits<ZTourEmits>()

const theme = useZTheme()

const targetRect = ref<DOMRect | null>(null)
const cardRef = ref<HTMLElement | null>(null)

const currentRef = computed<number>(() => props.current ?? 0)
const currentStep = computed<ZTourStep | undefined>(() => props.steps[currentRef.value])

function updateTargetRect(): void {
  if (!currentStep.value) {
    targetRect.value = null
    return
  }
  const el = document.querySelector(currentStep.value.target)
  if (!el) {
    targetRect.value = null
    return
  }
  targetRect.value = el.getBoundingClientRect()
}

watch(() => [props.current, props.open], updateTargetRect, { immediate: true })

useEscapeStack(
  () => {
    if (props.open) {
      emit('update:open', false)
      emit('close')
    }
  },
  { enabled: computed(() => props.open) },
)

function gotoStep(idx: number): void {
  if (idx < 0 || idx >= props.steps.length) return
  emit('update:current', idx)
}
function prev(): void {
  gotoStep(currentRef.value - 1)
}
function next(): void {
  if (currentRef.value + 1 >= props.steps.length) {
    emit('finish')
    emit('update:open', false)
    return
  }
  gotoStep(currentRef.value + 1)
}

function close(): void {
  emit('update:open', false)
  emit('close')
}

const isLast = computed(() => currentRef.value >= props.steps.length - 1)

// mask:用 4 个矩形挖出 target 区域(避免 box-shadow 范围限制)
const maskTopStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  return { top: '0', left: '0', right: '0', height: `${Math.max(0, r.top)}px` }
})
const maskBottomStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  return { top: `${r.bottom}px`, left: '0', right: '0', bottom: '0' }
})
const maskLeftStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  return { top: `${r.top}px`, left: '0', width: `${Math.max(0, r.left)}px`, height: `${r.height}px` }
})
const maskRightStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  return { top: `${r.top}px`, left: `${r.right}px`, right: '0', height: `${r.height}px` }
})

const maskClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s.backgroundColor._overlayBg.alpha(50)
    s.zIndex._modal
    s.pointerEvents.auto
  }),
)

const cardStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  const top = r.bottom + 12
  const left = Math.max(8, r.left)
  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

const cardClass = computed(() =>
  icss(theme.value, (s) => {
    s.position.fixed
    s.zIndex._modal
    s.backgroundColor._bg
    s.color._text
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.boxShadow._huge
    s.padding._middle
    s.minWidth.iem(15)
    s.maxWidth.iem(22.5)
    props.css?.(s)
  }),
)

const titleClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._large
    s.fontWeight._semibold
    s.color._text
    s.marginBottom._tiny
  }),
)
const descClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.marginBottom._small
  }),
)
const footerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.gap._small
  }),
)
const stepIndicatorClass = computed(() =>
  icss(theme.value, (s) => {
    s.fontSize._small
    s.color._textSecondary
  }),
)
const btnGroupClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.gap._tiny
  }),
)
const btnClass = (primary: boolean): string =>
  icss(theme.value, (s) => {
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
</script>

<template>
  <Teleport to="body">
    <template v-if="open && currentStep">
      <!-- mask 4 边 -->
      <div :class="maskClass" :style="maskTopStyle" @click="close" />
      <div :class="maskClass" :style="maskBottomStyle" @click="close" />
      <div :class="maskClass" :style="maskLeftStyle" @click="close" />
      <div :class="maskClass" :style="maskRightStyle" @click="close" />

      <div ref="cardRef" :class="cardClass" :style="cardStyle" role="dialog" aria-modal="true">
        <div :class="titleClass">{{ currentStep.title }}</div>
        <div v-if="currentStep.description" :class="descClass">{{ currentStep.description }}</div>
        <div :class="footerClass">
          <span :class="stepIndicatorClass">
            {{ currentRef + 1 }} / {{ steps.length }}
          </span>
          <div :class="btnGroupClass">
            <button v-if="currentRef > 0" type="button" :class="btnClass(false)" @click="prev">上一步</button>
            <button type="button" :class="btnClass(true)" @click="next">
              {{ isLast ? '完成' : '下一步' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>
