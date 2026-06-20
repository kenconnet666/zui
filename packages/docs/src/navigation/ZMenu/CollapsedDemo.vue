<script setup lang="ts">
import { ZMenu, ZButton, ZFlex, ZText, BuiltinIcons } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const selected = ref('home')
const collapsed = ref(false)

const items = [
  { key: 'home', label: '首页', icon: BuiltinIcons.info },
  {
    key: 'product',
    label: '产品',
    icon: BuiltinIcons.add,
    children: [
      { key: 'product-a', label: '产品 A' },
      { key: 'product-b', label: '产品 B' },
    ],
  },
  { key: 'search', label: '搜索', icon: BuiltinIcons.search },
  { key: 'more', label: '更多', icon: BuiltinIcons.more },
]
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :gap="g => g._small" :align="a => a.center">
      <ZButton :size="0.875" @click="collapsed = !collapsed">
        {{ collapsed ? '展开' : '折叠' }}侧边栏
      </ZButton>
      <ZText>当前状态：{{ collapsed ? '折叠（仅图标）' : '展开' }}</ZText>
    </ZFlex>

    <!-- collapsed 生效需要 vertical=true + inline=true -->
    <ZFlex
      :css="
        s => {
          s.width.px(collapsed ? 48 : 192)
          s.transitionProperty._all
          s.transitionDuration._middle
        }
      "
    >
      <ZMenu
        v-model:value="selected"
        :items="items"
        :vertical="true"
        :inline="true"
        :collapsed="collapsed"
      />
    </ZFlex>
  </ZFlex>
</template>
