<script lang="ts">
/**
 * `DemoBlock` —— docs 站点单个示例块。
 *
 * **职责**:基于 `ZCodeCard` 再薄包一层,提供 desc 槽位 + 与页面其它内容的统一间距。
 *
 * **设计原则**:**演示代码 = 实际文件源码 1:1**。不剥 import、不删空块,
 * 用户看到啥就是真实可复制运行的 .vue 源。
 *
 * **用法**(Vite `?raw` 双重身份):
 *
 * ```ts
 * import BasicDemo from './ZButton/BasicDemo.vue'
 * import BasicSource from './ZButton/BasicDemo.vue?raw'
 * ```
 *
 * ```vue
 * <DemoBlock title="基础用法" :source="BasicSource">
 *   <template #desc>说明文字,可包富文本。</template>
 *   <BasicDemo />
 * </DemoBlock>
 * ```
 *
 * **API**:
 * - `title?: string` —— 卡片头部标题(透传 `ZCodeCard.title`)
 * - `source: string` —— 源代码字符串(必传)
 * - `lang?: string` —— shiki 语言,默认 `'vue'`
 * - `defaultExpanded?: boolean` —— 默认折叠,默认 `false`
 *
 * **slots**:
 * - `default` —— 实时渲染的示例组件
 * - `desc` —— 卡片上方的说明文字(可选)
 */
export interface DemoBlockProps {
  title?: string
  source: string
  lang?: string
  defaultExpanded?: boolean
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss, useZTheme, ZCodeCard, ZFlex } from '@kenconnet666/zui-vue'

withDefaults(defineProps<DemoBlockProps>(), {
  lang: 'vue',
  defaultExpanded: false,
})

const theme = useZTheme()

const descClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.fontSize._small
    s.lineHeight._relaxed
    s.margin.px(0)
  }),
)
</script>

<template>
  <ZFlex :direction="d => d.column" :gap="g => g.px(8)">
    <p v-if="$slots.desc" :class="descClass">
      <slot name="desc" />
    </p>
    <ZCodeCard
      :title="title ?? ''"
      :source="source"
      :lang="lang"
      :default-expanded="defaultExpanded"
      :show-imports="true"
    >
      <slot />
    </ZCodeCard>
  </ZFlex>
</template>
