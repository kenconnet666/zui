<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode, ZFlex, ZIcon, ZBox, ZIemPreset } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
import { HomeOutlined as HomeOutline } from '@vicons/material'
</script>

<template>
  <section>
    <ZTitle :level="1">iem 单位</ZTitle>
    <ZParagraph>
      <ZCode code="iem" />（<strong>I</strong>'s <strong>Em</strong>）是 zui 的自定义响应式单位，
      类比 CSS <ZCode code="rem" />（root em），但基准由 <ZCode code="ZBox" /> 通过
      <ZCode code="--zui-iem" /> CSS 变量注入，而非绑定 <ZCode code=":root" /> 的 font-size。
    </ZParagraph>

    <ZTitle :level="2">原理</ZTitle>
    <ZCode
      :inline="false"
      lang="css"
      :code="`/* ZBox 注入 */
.zbox { --zui-iem: 0.8333vw; }   /* ZIemPreset.default: 随视口缩放 */

/* 所有 iem 化 token 展开为 */
font-size: calc(1 * var(--zui-iem, 16px));    /* 1iem */
padding:   calc(0.5 * var(--zui-iem, 16px));  /* 0.5iem */
gap:       calc(1.5 * var(--zui-iem, 16px));  /* 1.5iem */`"
    />

    <ZTitle :level="2">ZIemPreset 预设</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '预设', mono: true, width: '220px' },
        { key: 'value', label: 'CSS 值', mono: true, width: '140px' },
        { key: 'px1920', label: '@ 1920px', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'ZIemPreset.default',
          value: '0.8333vw',
          px1920: '16px',
          desc: '随视口等比缩放。推荐大多数场景。',
        },
        {
          name: 'ZIemPreset.fixed',
          value: '16px',
          px1920: '16px',
          desc: '固定 16px，不随视口缩放。',
        },
        {
          name: 'ZIemPreset.compact',
          value: '14px',
          px1920: '14px',
          desc: '紧凑模式，适合信息密度高的后台。',
        },
        {
          name: 'ZIemPreset.large',
          value: '20px',
          px1920: '20px',
          desc: '大字模式，适合展示/无障碍场景。',
        },
      ]"
    />

    <ZTitle :level="2">实时演示</ZTitle>
    <ZParagraph>同一个 <ZCode code="ZIcon" /> + 文字，在不同 iem 下的物理大小：</ZParagraph>

    <ZFlex :gap="g => g.iem(1)" :wrap="w => w.wrap">
      <ZBox
        v-for="preset in [
          { label: 'compact (14px)', iem: ZIemPreset.compact },
          { label: 'fixed (16px)', iem: ZIemPreset.fixed },
          { label: 'default (vw)', iem: ZIemPreset.default },
          { label: 'large (20px)', iem: ZIemPreset.large },
        ]"
        :key="preset.label"
        :iem="preset.iem"
        :css="
          s => {
            s.padding._middle
            s.borderWidth._thin
            s.borderStyle.solid
            s.borderColor._border
            s.borderRadius._middle
            s.display.flex
            s.alignItems.center
            s.gap._small
          }
        "
      >
        <ZIcon :component="HomeOutline" />
        <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">{{ preset.label }}</span>
      </ZBox>
    </ZFlex>

    <ZTitle :level="2">在 icss 中使用</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`icss(theme.value, (s) => {
  s.fontSize.iem(1)       // calc(1 * var(--zui-iem, 16px))
  s.padding.iem(0.5)      // calc(0.5 * var(--zui-iem, 16px))
  s.width.iem(20)         // calc(20 * var(--zui-iem, 16px)) = 320px @ 16px
  s.borderRadius.iem(0.375) // 6px @ 16px
})`"
    />

    <ZTitle :level="2">非 iem 单位</ZTitle>
    <ZParagraph>
      需要 px / vw / % 等固定单位时，使用对应方法：
      <ZCode code="s.width.px(200)" />、<ZCode code="s.width.pct(100)" />、
      <ZCode code="s.width.vh(50)" />。或走 <ZCode code="s.width('200px')" /> 字面量。
    </ZParagraph>
  </section>
</template>
