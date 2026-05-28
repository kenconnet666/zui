<script setup lang="ts">
import { ZNumberAnimation, ZFlex, ZText, ZButton } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const target = ref(9527)

function randomize() {
  target.value = Math.floor(Math.random() * 100000)
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>基础（0 → 9527）：</ZText>
      <ZText
        :css="
          s => {
            s.fontSize._large
            s.fontWeight._semibold
            s.color._primary
          }
        "
      >
        <ZNumberAnimation :to="9527" />
      </ZText>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>带小数（precision=2）：</ZText>
      <ZText
        :css="
          s => {
            s.fontSize._large
            s.fontWeight._semibold
          }
        "
      >
        <ZNumberAnimation :from="0" :to="3.14159" :precision="2" />
      </ZText>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>无千分位分隔：</ZText>
      <ZText
        :css="
          s => {
            s.fontSize._large
            s.fontWeight._semibold
          }
        "
      >
        <ZNumberAnimation :to="1234567" separator="" />
      </ZText>
    </ZFlex>

    <ZFlex :align="a => a.center" :gap="g => g._middle">
      <ZText>动态目标值（点击随机）：</ZText>
      <ZText
        :css="
          s => {
            s.fontSize._large
            s.fontWeight._semibold
            s.color._success
          }
        "
      >
        <ZNumberAnimation :to="target" />
      </ZText>
      <ZButton :size="0.875" @click="randomize">随机</ZButton>
    </ZFlex>
  </ZFlex>
</template>
