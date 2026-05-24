<script lang="ts">
/**
 * `ZCalendar` —— 日历(月视图)。
 *
 * - `v-model:value` —— ISO 字符串 `YYYY-MM-DD`(或空)
 * - `firstDayOfWeek?: 0 | 1` —— 周日(0)/ 周一(1)起首,默认 0
 *
 * 简化版,显示当前月 + 切换月。
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZCalendarProps {
  value?: string
  firstDayOfWeek?: 0 | 1
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZCalendarEmits {
  (e: 'update:value', value: string): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'

/**
 * 盒子模型(iem,Provider 控制基准):
 *
 *   ┌───────────────────────────────────────────────────────┐
 *   │ ZCalendar root                                        │   flex column
 *   │   bg: _bg  border _thin solid _border                 │   border-radius: _small
 *   │   padding: _small  width: fit-content                 │
 *   │                                                       │
 *   │  ┌─────────────────────────────────────────────────┐  │
 *   │  │ header                                          │  │   flex / spaceBetween
 *   │  │  ◀ prev   {Y 年 M 月}   ▶ next                  │  │   pad _tiny  _semibold
 *   │  │  nav btn: pad _tiny  hover bg _bgMuted          │  │
 *   │  └─────────────────────────────────────────────────┘  │
 *   │  ┌─────────────────────────────────────────────────┐  │
 *   │  │ grid  display: grid  7 列 × 32px               │  │   gap: _tiny
 *   │  │  weekday label 行(7 个 _textSecondary _small) │  │
 *   │  │  ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐                  │  │
 *   │  │  │..││..││..││..││..││..││..│ × 6 周           │  │   day cell:
 *   │  │  └──┘└──┘└──┘└──┘└──┘└──┘└──┘                  │  │     height 2iem
 *   │  │  selected → bg _primary,color _bg              │  │     border-radius _tiny
 *   │  │  today → outline currentColor,color _primary   │  │     fontSize _small
 *   │  │  outOfMonth → color _textSecondary             │  │
 *   │  └─────────────────────────────────────────────────┘  │
 *   └───────────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZCalendarProps>(), {
  firstDayOfWeek: 0,
})

const emit = defineEmits<ZCalendarEmits>()

const theme = useZTheme()

const today = new Date()
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

// 当前显示的年月
const cursor = ref<{ year: number; month: number }>(parseCursor(props.value))

function parseCursor(v?: string): { year: number; month: number } {
  if (v) {
    const [y, m] = v.split('-').map(Number)
    if (y && m) return { year: y, month: m - 1 }
  }
  return { year: today.getFullYear(), month: today.getMonth() }
}

function prevMonth(): void {
  const m = cursor.value.month - 1
  if (m < 0) cursor.value = { year: cursor.value.year - 1, month: 11 }
  else cursor.value = { ...cursor.value, month: m }
}
function nextMonth(): void {
  const m = cursor.value.month + 1
  if (m > 11) cursor.value = { year: cursor.value.year + 1, month: 0 }
  else cursor.value = { ...cursor.value, month: m }
}

const WEEKDAY_LABELS_SUN = ['日', '一', '二', '三', '四', '五', '六']
const WEEKDAY_LABELS_MON = ['一', '二', '三', '四', '五', '六', '日']

const weekdayLabels = computed(() =>
  props.firstDayOfWeek === 1 ? WEEKDAY_LABELS_MON : WEEKDAY_LABELS_SUN,
)

const days = computed<{ date: number; key: string; outOfMonth: boolean }[]>(() => {
  const { year, month } = cursor.value
  const firstDay = new Date(year, month, 1)
  const firstWeekday = firstDay.getDay() // 0=Sun
  const offset = (firstWeekday - props.firstDayOfWeek + 7) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const result: { date: number; key: string; outOfMonth: boolean }[] = []
  // 前置(上月尾)
  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const m = month === 0 ? 11 : month - 1
    const y = month === 0 ? year - 1 : year
    result.push({
      date: d,
      key: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      outOfMonth: true,
    })
  }
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({
      date: d,
      key: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      outOfMonth: false,
    })
  }
  // 补尾(下月头),凑齐 6 周 = 42 格
  while (result.length < 42) {
    const idx = result.length
    const d = idx - daysInMonth - offset + 1
    const m = month === 11 ? 0 : month + 1
    const y = month === 11 ? year + 1 : year
    result.push({
      date: d,
      key: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      outOfMonth: true,
    })
  }
  return result
})

function selectDay(key: string): void {
  emit('update:value', key)
}

const rootClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.flexDirection.column
    s.color._text
    s.backgroundColor._bg
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.padding._small
    s.width.fitContent
    props.css?.(s)
  }),
)

const headerClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.padding._tiny
    s.fontWeight._semibold
    s.fontSize._middle
  }),
)

const navBtnClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.cursor.pointer
    s.backgroundColor.transparent
    s.borderStyle.none
    s.padding._tiny
    s.color._text
    s.borderRadius._tiny
    s._hover((h2) => {
      h2.backgroundColor._bgMuted
    })
  }),
)

const gridClass = computed(() =>
  icss(theme.value, (s) => {
    s.display.grid
    s.gridTemplateColumns('repeat(7, 32px)')
    s.gap._tiny
    s.marginTop._tiny
  }),
)

const weekdayClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._textSecondary
    s.fontSize._small
    s.textAlign.center
    s.paddingTop._tiny
    s.paddingBottom._tiny
  }),
)

const dayClass = (d: { key: string; outOfMonth: boolean }): string => {
  const isSelected = props.value === d.key
  const isToday = todayKey === d.key
  return icss(theme.value, (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.justifyContent.center
    s.height.iem(2)
    s.borderRadius._tiny
    s.fontSize._small
    s.cursor.pointer
    s.borderStyle.none
    s.backgroundColor.transparent
    if (d.outOfMonth) s.color._textSecondary
    else s.color._text
    if (isSelected) {
      s.backgroundColor._primary
      s.color._bg
      s.fontWeight._semibold
    } else if (isToday) {
      s.outlineWidth.px(1)
      s.outlineStyle.solid
      s.outlineColor.currentColor
      s.color._primary
    } else {
      s._hover((h2) => {
        h2.backgroundColor._bgMuted
      })
    }
  })
}

const leftIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronLeft }))
const rightIcon = computed(() => h(ZIcon, { component: BuiltinIcons.chevronRight }))
</script>

<template>
  <div :class="rootClass">
    <div :class="headerClass">
      <button type="button" :class="navBtnClass" aria-label="上一月" @click="prevMonth">
        <component :is="leftIcon" />
      </button>
      <span>{{ cursor.year }} 年 {{ cursor.month + 1 }} 月</span>
      <button type="button" :class="navBtnClass" aria-label="下一月" @click="nextMonth">
        <component :is="rightIcon" />
      </button>
    </div>
    <div :class="gridClass">
      <span v-for="w in weekdayLabels" :key="w" :class="weekdayClass">{{ w }}</span>
      <button
        v-for="d in days"
        :key="d.key"
        type="button"
        :class="dayClass(d)"
        @click="selectDay(d.key)"
      >
        {{ d.date }}
      </button>
    </div>
  </div>
</template>
