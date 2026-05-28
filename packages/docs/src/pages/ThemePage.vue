<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">主题与 ZBox</ZTitle>
    <ZParagraph>
      zui 的主题系统基于<strong>三层 schema 继承</strong> + <strong>CSS 变量注入</strong>， 通过
      <ZCode code="ZBox" /> Provider 向下传递，支持嵌套隔离和运行时动态切换。
    </ZParagraph>

    <ZTitle :level="2">三层 Schema 架构</ZTitle>
    <ZCode
      :inline="false"
      lang="text"
      :code="`@kenconnet666/zui-core   BaseSchema   // Tailwind 242 色 palette
                   ▲ extends
@kenconnet666/zui-vue    ZuiSchema    // + 语义色 + spacing + fontSize + ...
                   ▲ 声明合并
用户工程             UserSchema   // augmentation 注入 brand 色等自定义 token`"
    />

    <ZTitle :level="2">内置主题</ZTitle>
    <ZParagraph>
      <ZCode code="zuiLight" /> 和 <ZCode code="zuiDark" /> 开箱即用，均为
      <ZCode code="ResolvedTheme&lt;ZuiSchema&gt;" /> 类型。
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'name', label: '导出', mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'zuiLight', desc: '亮色主题，白色背景 + 深色文字，蓝色主色调。' },
        { name: 'zuiDark', desc: '暗色主题，深灰背景 + 浅色文字，蓝色主色调。' },
      ]"
    />

    <ZTitle :level="2">ZBox Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'theme',
          type: 'ResolvedTheme<ZuiSchema>',
          default: '—',
          desc: '注入主题对象。必传（或由父级 ZBox 继承）。',
        },
        {
          name: 'iem',
          type: 'string',
          default: '—',
          desc: 'CSS 变量 --zui-iem 的值，如 ZIemPreset.default 或 16px。',
        },
        {
          name: 'tag',
          type: 'string',
          default: `'div'`,
          desc: '根元素标签名，可改为 section / main / article 等语义标签。',
        },
        { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 css factory。' },
      ]"
    />

    <ZTitle :level="2">嵌套隔离</ZTitle>
    <ZParagraph>
      多个 <ZCode code="ZBox" /> 可嵌套使用，子树独立设定 iem 或 theme， 通过浏览器 CSS cascade
      自动隔离，零运行时合并开销。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<!-- 外层：默认主题 + 响应式 iem -->
<ZBox :theme=&quot;zuiLight&quot; :iem=&quot;ZIemPreset.default&quot;>
  <MainContent />

  <!-- 内层：紧凑密度子树，独立于外层 -->
  <ZBox :iem=&quot;ZIemPreset.compact&quot;>
    <DenseTable />
  </ZBox>
</ZBox>`"
    />

    <ZTitle :level="2">useZTheme</ZTitle>
    <ZParagraph>
      在任意子组件中通过 <ZCode code="useZTheme()" /> 获取当前 theme， 配合
      <ZCode code="icss(theme.value, factory)" /> 生成 Emotion CSS class。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { computed } from 'vue'
import { icss, useZTheme } from '@kenconnet666/zui-vue'

const theme = useZTheme()

const myClass = computed(() =>
  icss(theme.value, (s) => {
    s.color._primary
    s.fontSize._middle
    s._hover((h) => h.color._primary.darken(10))
  })
)`"
    />
  </section>
</template>
