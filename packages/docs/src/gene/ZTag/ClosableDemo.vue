<script setup lang="ts">
import { ref } from 'vue'
import { ZTag, ZSpace } from '@kenconnet666/zui-vue'

const tags = ref(['Vue', 'TypeScript', 'Emotion', 'Vite'])

function remove(t: string) {
  tags.value = tags.value.filter(x => x !== t)
}
</script>

<template>
  <ZSpace :direction="d => d.column" :size="g => g._middle">
    <ZSpace :size="g => g._small" :align="a => a.center" :wrap="w => w.wrap">
      <ZTag v-for="t in tags" :key="t" closable @close="remove(t)">{{ t }}</ZTag>
      <ZTag v-if="!tags.length" variant="outlined">已全部移除</ZTag>
    </ZSpace>

    <ZSpace :size="g => g._small" :align="a => a.center">
      <ZTag round>圆角 round</ZTag>
      <ZTag round :color="c => c._primary" variant="soft">圆角软色</ZTag>
      <ZTag :size="1.125">大号 size=1.125</ZTag>
    </ZSpace>
  </ZSpace>
</template>
