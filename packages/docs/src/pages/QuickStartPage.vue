<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
import CodeBlock from '../components/CodeBlock.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">快速开始</ZTitle>
    <ZParagraph>在几分钟内将 zui 接入你的 Vue 3 项目。</ZParagraph>

    <ZTitle :level="2">安装</ZTitle>
    <ZParagraph>使用 pnpm（推荐）、npm 或 yarn 安装：</ZParagraph>
    <CodeBlock lang="bash" code="pnpm add @kenconnet666/zui-vue" />

    <ZTitle :level="2">注册 Provider</ZTitle>
    <ZParagraph>
      在应用根组件用 <ZCode code="ZBox" /> 包裹，注入主题。
      <ZCode code="ZBox" /> 是唯一必须的 Provider，它通过 CSS 变量和 Emotion 全局 class 向下传递主题上下文。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZBox, zuiLight } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <ZBox :theme=&quot;zuiLight&quot;>
    <YourApp />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">在组件中使用</ZTitle>
    <CodeBlock
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
      切换 <ZCode code=":theme" /> 为 <ZCode code="zuiDark" /> 即可全站暗色。 也可以动态绑定 ref
      实现亮暗切换。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { computed, ref } from 'vue'
import { ZBox, zuiLight, zuiDark } from '@kenconnet666/zui-vue'

const dark = ref(false)
const theme = computed(() => dark.value ? zuiDark : zuiLight)
<\/script>

<template>
  <ZBox :theme=&quot;theme&quot;>
    <YourApp />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">扩展 brand 色</ZTitle>
    <ZParagraph>
      通过 <ZCode code="theme.extend()" /> + TypeScript 声明合并，零模板注入自己的 brand token，
      全量 IDE 补全自动生效。
    </ZParagraph>
    <CodeBlock
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

  </section>
</template>
