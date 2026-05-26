<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAlert/BasicDemo.vue'
import BasicDemoSource from './ZAlert/BasicDemo.vue?raw'
</script>

<template>
  <section>
    <ZTitle :level="1">ZAlert 警告</ZTitle>
    <ZParagraph>
      警示横幅，适合展示需要用户注意的页面级提示信息。
      <ZCode code="color" /> 接受 chain factory，可使用全部 schema color token；
      <ZCode code="size" /> 为 iem 倍数，控制字号与内边距等比缩放；
      <ZCode code="closable" /> 开启右侧关闭按钮，触发 <ZCode code="@close" /> 事件。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="颜色 / 可关闭 / 无图标 / 尺寸" :source="BasicDemoSource">
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '180px' },
        { key: 'type',    label: '类型',   mono: true, width: '260px' },
        { key: 'default', label: '默认值', mono: true, width: '120px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="[
        { name: 'color',       type: '(c: ColorCarrier) => void',  default: '_info',  desc: '颜色 factory，影响图标色和背景浅色。' },
        { name: 'title',       type: 'string',                     default: '—',      desc: '标题文本（也可走 #title slot）。' },
        { name: 'description', type: 'string',                     default: '—',      desc: '描述文本（也可走 #description slot）。' },
        { name: 'size',        type: 'number',                     default: '0.875',  desc: 'iem 倍数，字号 / 内边距 / 间距等比缩放。' },
        { name: 'showIcon',    type: 'boolean',                    default: 'true',   desc: '是否显示左侧图标。' },
        { name: 'closable',    type: 'boolean',                    default: 'false',  desc: '是否显示右侧关闭按钮。' },
        { name: 'tag',         type: 'string',                     default: `'div'`,  desc: '根元素 tag。' },
        { name: 'css',         type: '(s: Chain) => void',         default: '—',      desc: '根元素 CSS 兜底。' },
      ]"
    />

    <ZTitle :level="2">Events</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '120px' },
        { key: 'type', label: '参数', mono: true },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'close', type: '(evt: MouseEvent) => void', desc: '点击关闭按钮时触发（需开启 closable）。' },
      ]"
    />

    <ZTitle :level="2">Slots</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '插槽',  mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'icon',        desc: '自定义左侧图标（覆盖默认内置图标）。' },
        { name: 'title',       desc: '自定义标题内容。' },
        { name: 'description', desc: '自定义描述内容。' },
        { name: 'default',     desc: '默认插槽，追加在描述下方（适合操作按钮）。' },
      ]"
    />
  </section>
</template>
