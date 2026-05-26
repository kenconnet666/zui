<script setup lang="ts">
import { ZCalendar, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const selected = ref('')
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZFlex :direction="d => d.column" :gap="g => g._small">
      <ZCalendar v-model:value="selected" />
      <ZText v-if="selected" :css="s => { s.color._textSecondary; s.fontSize._small }">
        已选择：{{ selected }}
      </ZText>
    </ZFlex>

    <ZCalendar :first-day-of-week="1" />
  </ZFlex>
</template>
