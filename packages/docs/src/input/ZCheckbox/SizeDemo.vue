<script setup lang="ts">
import { ref } from 'vue'
import { ZCheckbox, ZFlex } from '@kenconnet666/zui-vue'

const checked = ref(true)
</script>

<template>
  <ZFlex :align="a => a.center" :gap="g => g._large">
    <!-- size 三档：0.75 / 1(默认) / 1.5 -->
    <ZCheckbox
      v-model:checked="checked"
      label="size=0.75（小）"
      :size="0.75"
    />
    <ZCheckbox
      v-model:checked="checked"
      label="size=1（默认）"
      :size="1"
    />
    <ZCheckbox
      v-model:checked="checked"
      label="size=1.5（大）"
      :size="1.5"
    />
  </ZFlex>
</template>
