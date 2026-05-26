<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">快速开始</ZTitle>
    <ZParagraph>在几分钟内将 zui 接入你的 Vue 3 项目。</ZParagraph>

    <ZTitle :level="2">安装</ZTitle>
    <ZParagraph>使用 pnpm（推荐）、npm 或 yarn 安装：</ZParagraph>
    <ZCode :inline="false" lang="bash" code="pnpm add @kenconnet666/zui-vue" />

    <ZTitle :level="2">注册 Provider</ZTitle>
    <ZParagraph>
      在应用根组件用 <ZCode code="ZBox" /> 包裹，注入主题和 iem 基准。
      <ZCode code="ZBox" /> 是唯一必须的 Provider，它通过 CSS 变量向下传递 <ZCode code="--zui-iem" />
      和 Emotion 全局 class 上下文。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZBox, ZIemPreset, zuiLight } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <ZBox :theme=&quot;zuiLight&quot; :iem=&quot;ZIemPreset.default&quot;>
    <YourApp />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">在组件中使用</ZTitle>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZButton, ZTitle } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <ZTitle :level=&quot;1&quot;>Hello zui</ZTitle>
  <ZButton>点击我</ZButton>
</template>`"
    />

    <ZTitle :level="2">暗色主题</ZTitle>
    <ZParagraph>
      切换 <ZCode code=":theme" /> 为 <ZCode code="zuiDark" /> 即可全站暗色。
      也可以动态绑定 ref 实现亮暗切换。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { computed, ref } from 'vue'
import { ZBox, ZIemPreset, zuiLight, zuiDark } from '@kenconnet666/zui-vue'

const dark = ref(false)
const theme = computed(() => dark.value ? zuiDark : zuiLight)
<\/script>

<template>
  <ZBox :theme=&quot;theme&quot; :iem=&quot;ZIemPreset.default&quot;>
    <YourApp />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">扩展 brand 色</ZTitle>
    <ZParagraph>
      通过 <ZCode code="theme.extend()" /> + TypeScript 声明合并，零模板注入自己的 brand token，
      全量 IDE 补全自动生效。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// zui.d.ts
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandPrimary: string
    brandAccent: string
  }
}

// App.vue
const myTheme = zuiLight.extend({
  color: { brandPrimary: '#1a3a8f', brandAccent: '#ff7849' }
})`"
    />

    <ZTitle :level="2">ZIemPreset 预设</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',  label: '预设',  mono: true, width: '180px' },
        { key: 'value', label: '值',    mono: true, width: '160px' },
        { key: 'desc',  label: '说明' },
      ]"
      :rows="[
        { name: 'ZIemPreset.default', value: '0.8333vw',  desc: '随视口等比缩放。1920px 宽屏下 = 16px，推荐默认。' },
        { name: 'ZIemPreset.fixed',   value: '16px',       desc: '固定 16px，opt-out 响应式缩放。' },
        { name: 'ZIemPreset.compact', value: '14px',       desc: '紧凑模式，适合信息密度高的后台。' },
        { name: 'ZIemPreset.large',   value: '20px',       desc: '大字模式，适合无障碍/展示场景。' },
      ]"
    />
  </section>
</template>
