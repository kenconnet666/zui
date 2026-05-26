<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZNumberAnimation/BasicDemo.vue'
import BasicDemoSource from './ZNumberAnimation/BasicDemo.vue?raw'

const propsRows = [
  { name: 'to',        type: 'number',             default: '—（必传）', desc: '目标值。值变化时动画重新触发。' },
  { name: 'from',      type: 'number',             default: '0',         desc: '起始值。' },
  { name: 'duration',  type: 'number',             default: '1500',      desc: '动画时长（ms）。' },
  { name: 'precision', type: 'number',             default: '—',         desc: '小数位数。不传则根据目标值自动决定。' },
  { name: 'separator', type: 'string',             default: "','",       desc: '千分位分隔符，设为空字符串可关闭。' },
  { name: 'css',       type: '(s: Chain) => void', default: '—',         desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZNumberAnimation 数字动画</ZTitle>
    <ZParagraph>
      数字滚动动画组件，从 <ZCode code="from" /> 平滑过渡到 <ZCode code="to" />，
      使用 easeOutCubic 缓动函数。支持千分位分隔符和小数精度。
      目标值变化时自动重新触发动画。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="基础 / 小数 / 无分隔符 / 动态目标值" :source="BasicDemoSource">
      <template #desc>
        <ZCode code="to" /> 变化时动画自动重新触发；
        <ZCode code="precision" /> 控制小数位数；
        <ZCode code="separator" /> 设为空字符串可关闭千分位分隔。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name',    label: '属性',   mono: true, width: '140px' },
        { key: 'type',    label: '类型',   mono: true, width: '140px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc',    label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
