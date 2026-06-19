<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZAvatarGroup/BasicDemo.vue'
import BasicDemoSource from './ZAvatarGroup/BasicDemo.vue?raw'

const propsRows = [
  { name: 'items', type: 'ZAvatarGroupItem[]', default: '—（必传）', desc: '头像数据(src / text / alt)。' },
  { name: 'max', type: 'number', default: '—', desc: '最多显示个数，其余折叠为 +N(默认全显)。' },
  { name: 'size', type: 'number', default: '2.5', desc: '统一尺寸(px 倍数，1 = 16px，2.5 = 40px)。' },
  { name: 'overlap', type: 'number', default: '0.3', desc: '相邻重叠比例(占 size 的比例)。' },
  { name: 'square', type: 'boolean', default: 'false', desc: '方形(默认圆形)。' },
  { name: 'color', type: '(c: ColorCarrier) => void', default: '—', desc: '+N 余量头像背景色。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '根元素 CSS 兜底。' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZAvatarGroup 头像组</ZTitle>
    <ZParagraph>
      多个头像重叠排列，超出 <ZCode code="max" /> 折叠为 <ZCode code="+N" />。数据驱动(<ZCode
        code="items"
      />)，每个头像带 <ZCode code="_bg" /> 圆环以区分重叠边界。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="全部 / max 折叠 / 大尺寸 / 方形" :source="BasicDemoSource">
      <template #desc>
        <code>max</code> 控制最多显示个数，剩余折叠为 <strong>+N</strong> 余量头像；<code>overlap</code>
        控制相邻重叠比例。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />
  </section>
</template>
