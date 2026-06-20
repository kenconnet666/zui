<script setup lang="ts">
import { ZSpin, ZFlex, ZIcon, BuiltinIcons } from '@kenconnet666/zui-vue'
</script>

<!--
  #indicator slot 演示：替换默认旋转图标为任意自定义内容。
  ZSpin 的 indicator slot 在包裹模式和纯 indicator 模式下均生效。
-->
<template>
  <ZFlex :gap="g => g._large" :align="a => a.center" :wrap="w => w.wrap">

    <!-- 1. 默认 indicator（对照）-->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="2" />
      <span>默认</span>
    </ZFlex>

    <!-- 2. #indicator slot：换成 warning 图标旋转 -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="2">
        <template #indicator>
          <ZIcon
            :component="BuiltinIcons.refresh"
            :size="2"
            :color="c => c._warning"
            :spin="d => d.s(0.6)"
          />
        </template>
      </ZSpin>
      <span>自定义颜色 + 速度</span>
    </ZFlex>

    <!-- 3. #indicator slot：换成 add 图标，反向旋转 + 不同 easing -->
    <ZFlex :direction="d => d.column" :align="a => a.center" :gap="g => g._small">
      <ZSpin :size="2">
        <template #indicator>
          <ZIcon
            :component="BuiltinIcons.add"
            :size="2"
            :color="c => c._danger"
            :spin="d => d.s(1.5)"
            :css="s => {
              s.animationDirection.reverse
              s.animationTimingFunction('ease-in-out')
            }"
          />
        </template>
      </ZSpin>
      <span>反向旋转</span>
    </ZFlex>

    <!-- 4. 包裹模式下使用自定义 #indicator -->
    <ZSpin spinning>
      <template #indicator>
        <ZIcon
          :component="BuiltinIcons.search"
          :size="1.5"
          :color="c => c._primary"
          :spin="d => d.ms(800)"
        />
      </template>
      <div
        :style="{
          width: '160px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid currentColor',
          opacity: 0.3,
        }"
      >
        被遮罩的内容
      </div>
    </ZSpin>

  </ZFlex>
</template>
