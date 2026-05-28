<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { icss, useZTheme, ZButton, ZFlex, ZTitle, ZParagraph } from '@kenconnet666/zui-vue'

const theme = useZTheme()
const router = useRouter()

const wrapClass = computed(() =>
  icss(theme.value, s => {
    s.paddingTop.iem(6)
    s.textAlign.center
  }),
)

const codeClass = computed(() =>
  icss(theme.value, s => {
    s.fontSize.iem(6)
    s.fontWeight._bold
    s.color._primary.alpha(20)
    s.lineHeight(1)
    s.marginBottom.iem(1)
  }),
)
</script>

<template>
  <div :class="wrapClass">
    <div :class="codeClass">404</div>
    <ZTitle :level="2">页面不存在</ZTitle>
    <ZParagraph :css="s => s.color._textSecondary">
      你访问的页面不存在，可能已被移动或删除。
    </ZParagraph>
    <ZFlex :gap="g => g.iem(0.75)" :justify="j => j.center">
      <ZButton @click="router.push('/')">返回首页</ZButton>
      <ZButton variant="outlined" @click="router.back()">返回上页</ZButton>
    </ZFlex>
  </div>
</template>
