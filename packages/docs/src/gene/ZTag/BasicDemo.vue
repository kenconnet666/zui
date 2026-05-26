<script setup lang="ts">
import { ZTag, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const tags = ref(['Vue 3', 'TypeScript', 'CSS-in-JS', 'iem 单位'])
function remove(i: number) { tags.value.splice(i, 1) }
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="(g) => g.iem(0.75)">
    <!-- variant -->
    <ZFlex :gap="(g) => g.iem(0.5)" :wrap="(w) => w.wrap">
      <ZTag variant="soft">soft（默认）</ZTag>
      <ZTag variant="outlined">outlined</ZTag>
      <ZTag variant="filled">filled</ZTag>
    </ZFlex>

    <!-- color + variant -->
    <ZFlex :gap="(g) => g.iem(0.5)" :wrap="(w) => w.wrap">
      <ZTag :color="(c) => c._primary">primary soft</ZTag>
      <ZTag :color="(c) => c._success" variant="outlined">success outlined</ZTag>
      <ZTag :color="(c) => c._danger" variant="filled">danger filled</ZTag>
      <ZTag :color="(c) => c._warning">warning soft</ZTag>
    </ZFlex>

    <!-- size + round -->
    <ZFlex :gap="(g) => g.iem(0.5)" :align="(a) => a.center" :wrap="(w) => w.wrap">
      <ZTag :size="0.75">size=0.75 小号</ZTag>
      <ZTag :size="0.875">size=0.875（默认）</ZTag>
      <ZTag :size="1">size=1 标准</ZTag>
      <ZTag :size="1.25" :round="true">size=1.25 圆角胶囊</ZTag>
    </ZFlex>

    <!-- closable -->
    <ZFlex :gap="(g) => g.iem(0.5)" :wrap="(w) => w.wrap">
      <ZTag
        v-for="(tag, i) in tags"
        :key="tag"
        :closable="true"
        :color="(c) => c._primary"
        @close="remove(i)"
      >{{ tag }}</ZTag>
      <span v-if="!tags.length" style="font-size: 0.875em; opacity: 0.5">全部已关闭，刷新重置</span>
    </ZFlex>
  </ZFlex>
</template>
