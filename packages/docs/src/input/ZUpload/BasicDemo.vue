<script setup lang="ts">
import { ZUpload, ZFlex, ZText } from '@kenconnet666/zui-vue'
import { ref } from 'vue'
import type { ZUploadedFile } from '@kenconnet666/zui-vue'

const fileList = ref<ZUploadedFile[]>([])

function handleChange(files: File[]): void {
  for (const file of files) {
    fileList.value.push({
      uid: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'success',
      raw: file,
    })
  }
}
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g._large">
    <ZUpload
      v-model:file-list="fileList"
      :multiple="true"
      @change="handleChange"
    />

    <ZText v-if="fileList.length" :css="s => { s.color._textSecondary; s.fontSize._small }">
      已选 {{ fileList.length }} 个文件
    </ZText>

    <ZUpload :disabled="true" />
  </ZFlex>
</template>
