<script setup lang="ts">
/**
 * ZSkeleton — loading 切换演示。
 * 点击按钮切换 loading，false 时渲染 default slot 真实内容。
 */
import { ZSkeleton, ZFlex, ZButton, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(16)">
    <ZButton variant="outlined" @click="loading = !loading">
      切换 loading（当前：{{ loading ? '骨架中' : '已加载' }}）
    </ZButton>

    <ZSkeleton :loading="loading" :avatar="true" :title="true">
      <ZFlex :gap="g => g.px(12)" :align="a => a.center">
        <ZFlex
          :css="
            s => {
              s.width.px(40)
              s.height.px(40)
              s.borderRadius._full
              s.backgroundColor._bgMuted
              s.flexShrink(0)
            }
          "
        />
        <ZFlex :direction="d => d.column" :gap="g => g.px(4)">
          <ZText>真实加载完的用户名</ZText>
          <ZText
            :css="
              s => {
                s.color._textSecondary
                s.fontSize._small
              }
            "
          >
            数据已加载完毕，骨架屏已隐藏。
          </ZText>
        </ZFlex>
      </ZFlex>
    </ZSkeleton>
  </ZFlex>
</template>
