<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import BasicDemo from './ZInputOTP/BasicDemo.vue'
import BasicDemoSource from './ZInputOTP/BasicDemo.vue?raw'
import SizeDemo from './ZInputOTP/SizeDemo.vue'
import SizeDemoSource from './ZInputOTP/SizeDemo.vue?raw'
import NumberDemo from './ZInputOTP/NumberDemo.vue'
import NumberDemoSource from './ZInputOTP/NumberDemo.vue?raw'

const propsRows = [
  { name: 'value', type: 'string', default: '—', desc: '绑定值（v-model:value），长度 ≤ length。' },
  { name: 'length', type: 'number', default: '6', desc: '验证码位数。' },
  {
    name: 'size',
    type: 'number',
    default: '1',
    desc: '框体 px 倍数（1 单位 = 16px），影响宽/高/字号。',
  },
  { name: 'type', type: "'text' | 'number'", default: "'text'", desc: '输入模式；number 仅接受 0-9。' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用所有输入框。' },
  { name: 'placeholder', type: 'string', default: '—', desc: '单字符占位（每个空格都显示）。' },
  { name: 'css', type: '(s: Chain) => void', default: '—', desc: '容器 CSS 兜底。' },
]

const emitsRows = [
  { name: 'update:value', args: 'string', desc: '任意格变更时触发（v-model:value）。' },
  { name: 'complete', args: 'string', desc: '所有位填满时触发，payload 为完整字符串。' },
  { name: 'change', args: 'string', desc: '任意格变更时触发，payload 为当前字符串（与 update:value 同步）。' },
  { name: 'focus', args: 'FocusEvent', desc: '任意格聚焦时触发。' },
  { name: 'blur', args: 'FocusEvent', desc: '任意格失焦时触发。' },
]

const sizeRows = [
  { size: '0.75', fontSize: '12px', boxSize: '30px', radius: '3px' },
  { size: '1（默认）', fontSize: '16px', boxSize: '40px', radius: '4px' },
  { size: '1.25', fontSize: '20px', boxSize: '50px', radius: '5px' },
  { size: '1.5', fontSize: '24px', boxSize: '60px', radius: '6px' },
]
</script>

<template>
  <section>
    <ZTitle :level="1">ZInputOTP 验证码</ZTitle>
    <ZParagraph>
      一次性密码（OTP）输入框。<ZCode code="length" /> 控制位数，打字自动跳格，
      <ZCode code="Backspace" /> 退格，方向键导航，支持整串粘贴。<ZCode code="type='number'" />
      限制为纯数字；<ZCode code="complete" /> 事件在全部填满时触发。
    </ZParagraph>

    <ZTitle :level="2">基础用法</ZTitle>
    <DemoBlock title="默认 6 位 / 禁用" :source="BasicDemoSource">
      <template #desc>
        <code>v-model:value</code> 绑定当前值；所有位填满后触发 <strong>complete</strong> 事件。
        第二行展示 <strong>disabled</strong> 状态。
      </template>
      <BasicDemo />
    </DemoBlock>

    <ZTitle :level="2">尺寸</ZTitle>
    <DemoBlock title="size 三档（0.75 / 1 / 1.5）" :source="SizeDemoSource">
      <template #desc>
        <code>size</code> 是 <strong>px 倍数</strong>，1 单位 = 16px；框体宽高 = size × 2.5 × 16px。
      </template>
      <SizeDemo />
    </DemoBlock>

    <ZTitle :level="2">纯数字模式</ZTitle>
    <DemoBlock title="type='number'" :source="NumberDemoSource">
      <template #desc>
        <code>type="number"</code> 自动过滤非数字字符，移动端弹出数字键盘（<code>inputmode="numeric"</code>）。
      </template>
      <NumberDemo />
    </DemoBlock>

    <ZTitle :level="2">Props</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '属性', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '200px' },
        { key: 'default', label: '默认值', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="propsRows"
    />

    <ZTitle :level="2">Emits</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: '事件', mono: true, width: '160px' },
        { key: 'args', label: '参数', mono: true, width: '100px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="emitsRows"
    />

    <ZTitle :level="2">尺寸参考（1 单位 = 16px）</ZTitle>
    <ZParagraph>
      <code>size</code> 是 <strong>px 倍数</strong>，1 单位 = 16px（<code>_internal/sizing.ts</code> 的
      <code>sizePx(n) = n * 16</code>）。下表以 <strong>1 单位 = 16px</strong> 为基准列出各档位的
      px 值：
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'size', label: 'size', mono: true, width: '120px' },
        { key: 'fontSize', label: 'font-size', mono: true, width: '120px' },
        { key: 'boxSize', label: 'width / height', mono: true, width: '140px' },
        { key: 'radius', label: 'border-radius', mono: true, width: '140px' },
      ]"
      :rows="sizeRows"
    />
    <ZParagraph>
      需要非标准尺寸时，直接传小数倍数（如 <code>:size="1.25"</code> = 50px 框体）或用
      <code>:css</code> 逃生口覆盖任意属性。
    </ZParagraph>
  </section>
</template>
