<script lang="ts" setup>
/**
 * 首页 —— zui 一句话定位 + 跳转入口。
 */
import { computed, h, type Component } from 'vue'
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
  FavoriteBorderOutlined as HeartOutline,
  GridViewOutlined as Grid,
  PaletteOutlined as Palette,
  RocketLaunchOutlined as Rocket,
  TouchAppOutlined as Touch,
} from '@vicons/material'

const router = useRouter()
const theme = useZTheme()

interface EntryCard {
  key: string
  title: string
  desc: string
  icon: Component
  route: string
}

const cards: EntryCard[] = [
  {
    key: 'button',
    title: 'ZButton 按钮',
    desc: '5 种 variant + Material 风波纹 + iem 等比缩放',
    icon: Touch,
    route: '/gene/button',
  },
  {
    key: 'icon',
    title: 'ZIcon 图标',
    desc: '4 维度 chain factory + iem 联动 + Provider 切换基准',
    icon: HeartOutline,
    route: '/gene/icon',
  },
]

const heroClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.iem(2)
    s.paddingBottom.iem(2)
  }),
)

const linkClass = computed(() =>
  icss(theme.value, s => {
    s.display.block
    s.textDecoration('none')
    s.color.inherit
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
      核心 <code>@kenconnet666/zui-core</code> 提供 Chain + Theme + Variants 抽象，
      <code>@kenconnet666/zui-vue</code> 提供 ZBox 与 Vue 3 组件。
    </ZParagraph>

    <ZFlex :gap="g => g.iem(0.5)" :wrap="w => w.wrap">
      <ZTag>iem 单位</ZTag>
      <ZTag>Chain factory props</ZTag>
      <ZTag>Material 风</ZTag>
      <ZTag>Vue 3</ZTag>
    </ZFlex>

    <ZFlex :gap="g => g.iem(0.75)" :wrap="w => w.wrap" :css="s => s.marginTop.iem(1.5)">
      <ZButton @click="go('/guide/quick-start')">快速开始</ZButton>
      <ZButton variant="outlined" @click="go('/guide/core')">了解 Core</ZButton>
    </ZFlex>

    <ZTitle :level="2">
      <ZFlex :align="a => a.center" :gap="g => g.iem(0.5)" inline>
        <component :is="h(ZIcon, { component: Rocket })" />
        <span>组件演示</span>
      </ZFlex>
    </ZTitle>

    <ZFlex :gap="g => g.iem(1)" :wrap="w => w.wrap">
      <a
        v-for="card in cards"
        :key="card.key"
        :class="linkClass"
        href="javascript:void(0)"
        @click="go(card.route)"
      >
        <ZCard
          hoverable
          :css="
            s => {
              s.width.iem(20)
            }
          "
        >
          <template #header>
            <ZFlex :align="a => a.center" :gap="g => g.iem(0.5)" inline>
              <component :is="h(ZIcon, { component: card.icon, size: 1.25 })" />
              <span>{{ card.title }}</span>
            </ZFlex>
          </template>
          <ZParagraph
            :css="
              s => {
                s.margin.px(0)
              }
            "
            >{{ card.desc }}</ZParagraph
          >
        </ZCard>
      </a>
    </ZFlex>

    <ZTitle :level="2">
      <ZFlex :align="a => a.center" :gap="g => g.iem(0.5)" inline>
        <component :is="h(ZIcon, { component: Palette })" />
        <span>设计哲学</span>
      </ZFlex>
    </ZTitle>
    <ZParagraph>
      所有 Z\* 组件遵守
      <strong>chain factory props + iem + css 兜底 + 三层覆盖 + 单文件 SFC</strong>
      五件套。组件 API 表面极小、零硬编码档位、设计 token 集中在 schema。
    </ZParagraph>

    <ZTitle :level="2">
      <ZFlex :align="a => a.center" :gap="g => g.iem(0.5)" inline>
        <component :is="h(ZIcon, { component: Grid })" />
        <span>路线图</span>
      </ZFlex>
    </ZTitle>
    <ZParagraph>
      已实现 ~85 个组件源文件；文档站持续覆盖中。当前可访问的演示页详见左侧菜单（灰色项尚未实现）。
    </ZParagraph>
  </div>
</template>
