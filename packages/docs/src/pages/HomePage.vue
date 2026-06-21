<script lang="ts" setup>
/**
 * 首页 —— zui 一句话定位 + 组件总览 + 跳转入口。
 */
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  icss,
  useZTheme,
  ZButton,
  ZCard,
  ZFlex,
  ZIcon,
  ZParagraph,
  ZTag,
  ZTitle,
} from '@kenconnet666/zui-vue'
import {
  GridViewOutlined as Grid,
  PaletteOutlined as Palette,
  RocketLaunchOutlined as Rocket,
} from '@vicons/material'

const router = useRouter()
const theme = useZTheme()

interface CatItem {
  name: string
  route: string
}
interface Category {
  key: string
  label: string
  count: number
  items: CatItem[]
}

/** 7 大分类总览 —— count 对应左侧菜单的演示页数量，items 为各类代表组件。 */
const categories: Category[] = [
  {
    key: 'gene',
    label: '通用 gene',
    count: 19,
    items: [
      { name: 'ZButton', route: '/gene/button' },
      { name: 'ZIcon', route: '/gene/icon' },
      { name: 'ZTag', route: '/gene/tag' },
      { name: 'ZAvatar', route: '/gene/avatar' },
      { name: 'ZSegmented', route: '/gene/segmented' },
    ],
  },
  {
    key: 'layout',
    label: '布局 layout',
    count: 7,
    items: [
      { name: 'ZFlex', route: '/layout/flex' },
      { name: 'ZGrid', route: '/layout/grid' },
      { name: 'ZSpace', route: '/layout/space' },
      { name: 'ZSplit', route: '/layout/split' },
      { name: 'ZScrollbar', route: '/layout/scrollbar' },
    ],
  },
  {
    key: 'display',
    label: '展示 display',
    count: 19,
    items: [
      { name: 'ZCard', route: '/display/card' },
      { name: 'ZTable', route: '/display/table' },
      { name: 'ZDataTable', route: '/display/data-table' },
      { name: 'ZTooltip', route: '/display/tooltip' },
      { name: 'ZTree', route: '/display/tree' },
    ],
  },
  {
    key: 'input',
    label: '输入 input',
    count: 22,
    items: [
      { name: 'ZInput', route: '/input/input' },
      { name: 'ZSelect', route: '/input/select' },
      { name: 'ZForm', route: '/input/form' },
      { name: 'ZDatePicker', route: '/input/date-picker' },
      { name: 'ZCascader', route: '/input/cascader' },
    ],
  },
  {
    key: 'feedback',
    label: '反馈 feedback',
    count: 9,
    items: [
      { name: 'ZModal', route: '/feedback/modal' },
      { name: 'ZDrawer', route: '/feedback/drawer' },
      { name: 'ZMessage', route: '/feedback/message' },
      { name: 'ZAlert', route: '/feedback/alert' },
      { name: 'ZTour', route: '/feedback/tour' },
    ],
  },
  {
    key: 'navigation',
    label: '导航 navigation',
    count: 9,
    items: [
      { name: 'ZMenu', route: '/navigation/menu' },
      { name: 'ZTabs', route: '/navigation/tabs' },
      { name: 'ZSteps', route: '/navigation/steps' },
      { name: 'ZDropdown', route: '/navigation/dropdown' },
      { name: 'ZPagination', route: '/navigation/pagination' },
    ],
  },
  {
    key: 'tool',
    label: '工具 tool',
    count: 5,
    items: [
      { name: 'ZQRCode', route: '/tool/qr-code' },
      { name: 'ZWatermark', route: '/tool/watermark' },
      { name: 'ZCountdown', route: '/tool/countdown' },
      { name: 'ZMarquee', route: '/tool/marquee' },
      { name: 'ZNumberAnimation', route: '/tool/number-animation' },
    ],
  },
]

const heroClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.px(32)
    s.paddingBottom.px(32)
  }),
)

const sectionHeadClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.gap.px(8)
  }),
)

const catGridClass = computed(() =>
  icss(theme.value, s => {
    s.display.grid
    s.gridTemplateColumns('repeat(auto-fill, minmax(260px, 1fr))')
    s.gap.px(16)
  }),
)

const catHeadClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.justifyContent.spaceBetween
    s.width.pct(100)
  }),
)

const countClass = computed(() =>
  icss(theme.value, s => {
    s.color._textTertiary
    s.fontSize._small
    s.fontWeight._normal
  }),
)

const chipClass = computed(() =>
  icss(theme.value, s => {
    s.cursor.pointer
  }),
)

function go(path: string): void {
  router.push(path)
}
</script>

<template>
  <div :class="heroClass">
    <ZTitle :level="1">zui</ZTitle>
    <ZParagraph>
      <strong>框架无关</strong>的 CSS-in-JS 工具库 monorepo。<br />
      核心 <code>@kenconnet666/zui-core</code> 提供 Chain + Theme + icss 抽象，
      <code>@kenconnet666/zui-vue</code> 提供 ZBox 与 90+ Vue 3 组件。
    </ZParagraph>

    <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
      <ZTag>Chain factory props</ZTag>
      <ZTag>Material 风</ZTag>
      <ZTag>Vue 3</ZTag>
      <ZTag>亮 / 暗主题</ZTag>
    </ZFlex>

    <ZFlex :gap="g => g.px(12)" :wrap="w => w.wrap" :css="s => s.marginTop.px(24)">
      <ZButton @click="go('/guide/quick-start')">快速开始</ZButton>
      <ZButton variant="outlined" @click="go('/guide/core')">了解 Core</ZButton>
      <ZButton variant="ghost" @click="go('/guide/theme')">主题与 Token</ZButton>
    </ZFlex>

    <ZTitle :level="2">
      <span :class="sectionHeadClass">
        <component :is="h(ZIcon, { component: Rocket })" />
        <span>组件总览</span>
      </span>
    </ZTitle>
    <ZParagraph>
      已实现 <strong>90+ 个组件</strong>，覆盖 7 大分类，文档站演示页全覆盖。点击下方组件名直达对应文档，
      或用左侧菜单浏览全部。
    </ZParagraph>

    <div :class="catGridClass">
      <ZCard v-for="cat in categories" :key="cat.key" hoverable>
        <template #header>
          <span :class="catHeadClass">
            <span>{{ cat.label }}</span>
            <span :class="countClass">{{ cat.count }} 个</span>
          </span>
        </template>
        <ZFlex :gap="g => g.px(8)" :wrap="w => w.wrap">
          <ZTag
            v-for="item in cat.items"
            :key="item.route"
            variant="soft"
            :class="chipClass"
            @click="go(item.route)"
          >
            {{ item.name }}
          </ZTag>
        </ZFlex>
      </ZCard>
    </div>

    <ZTitle :level="2">
      <span :class="sectionHeadClass">
        <component :is="h(ZIcon, { component: Palette })" />
        <span>设计哲学</span>
      </span>
    </ZTitle>
    <ZParagraph>
      所有 Z\* 组件遵守
      <strong>chain factory props + px 单位 + css 兜底 + 三层覆盖 + 单文件 SFC</strong>
      五件套。组件 API 表面极小、零硬编码档位、设计 token 集中在 schema。
    </ZParagraph>

    <ZTitle :level="2">
      <span :class="sectionHeadClass">
        <component :is="h(ZIcon, { component: Grid })" />
        <span>路线图</span>
      </span>
    </ZTitle>
    <ZParagraph>
      组件层已全面铺开（90+ 个），文档演示页持续补全中 —— 左侧菜单每一项均可点击访问。
      下一步聚焦 API 稳定性、可访问性与暗色主题打磨。
    </ZParagraph>
  </div>
</template>
