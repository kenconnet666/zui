<script setup lang="ts">
import { ZSkeleton, ZFlex, ZText, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>基础骨架（3 行）</ZText>
      <ZSkeleton />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>带头像 + 标题</ZText>
      <ZSkeleton :avatar="true" :title="true" :rows="2" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZText>无动画</ZText>
      <ZSkeleton :animated="false" :rows="2" />
    </ZFlex>

    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZFlex :align="a => a.center" :gap="g => g._small">
        <ZButton :size="0.875" @click="loading = !loading">
          切换 loading（当前：{{ loading ? '骨架' : '内容' }}）
        </ZButton>
      </ZFlex>
      <ZSkeleton :loading="loading" :avatar="true" :title="true">
        <ZFlex :gap="g => g._small" :align="a => a.center">
          <ZFlex
            :css="
              s => {
                s.width.iem(2.5)
                s.height.iem(2.5)
                s.borderRadius._full
                s.backgroundColor._bgMuted
              }
            "
          />
          <ZFlex :direction="d => d.column" :gap="g => g._tiny">
            <ZText>加载完成的用户名</ZText>
            <ZText
              :css="
                s => {
                  s.color._textSecondary
                  s.fontSize._small
                }
              "
              >用户简介内容已加载完毕。</ZText
            >
          </ZFlex>
        </ZFlex>
      </ZSkeleton>
    </ZFlex>
  </ZFlex>
</template>
