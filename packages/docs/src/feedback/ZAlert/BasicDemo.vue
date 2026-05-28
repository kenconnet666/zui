<script setup lang="ts">
import { ZAlert, ZFlex } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._middle">
    <ZAlert title="信息提示" description="这是一条 info 类型的提示，使用默认颜色 _info。" />
    <ZAlert
      :color="c => c._success"
      title="操作成功"
      description="数据已保存，变更将在下次同步时生效。"
    />
    <ZAlert
      :color="c => c._warning"
      title="注意"
      description="当前环境为测试环境，请勿提交生产数据。"
    />
    <ZAlert
      :color="c => c._danger"
      title="错误"
      description="请求失败，服务器返回 500，请稍后重试。"
    />

    <ZAlert
      v-if="visible"
      :color="c => c._primary"
      title="可关闭的提示"
      description="点击右侧关闭按钮可以关闭此提示。"
      :closable="true"
      @close="visible = false"
    />

    <ZAlert
      :showIcon="false"
      title="无图标模式"
      description="通过 :showIcon='false' 隐藏左侧图标。"
    />

    <ZAlert :size="0.75" :color="c => c._info" title="小尺寸 (size=0.75)" />
    <ZAlert :size="1.125" :color="c => c._success" title="大尺寸 (size=1.125)" />
  </ZFlex>
</template>
