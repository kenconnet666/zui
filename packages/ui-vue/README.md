# @kenconnet666/zui-vue

> Vue 3 集成层 + 强类型组件库,构建于 [`@kenconnet666/zui-core`](../core) 之上。

[![npm](https://img.shields.io/npm/v/@kenconnet666/zui-vue.svg)](https://www.npmjs.com/package/@kenconnet666/zui-vue)

`@kenconnet666/zui-vue` 在框架无关的 CSS-in-JS DSL 之上,提供:

- **`<ZBox>` 注入器** —— 主题 / locale / timezone 嵌套注入（~~iem~~ 已移除（0.9.x））
- **80+ 组件**（gene / layout / input / display / feedback / navigation / tool）
- **2 套内建主题** —— `zuiLight`（Material 700）/ `zuiDark`（Material 200/300）
- **纯 px 尺寸** —— 1 单位 = 16px，JS 计算用 `sizePx(n) = n * 16`（`_internal/sizing.ts`）；~~`ZIemPreset`~~ 已移除（0.9.x）
- **5 个内置 hooks** —— `usePopper` / `usePortal` / `useEscapeStack` / `useZId` / `useRipple`
- **i18n + timezone** —— `zhCN` / `enUS` + date-fns-tz 时区支持
- **完整 a11y** —— ARIA role / aria-\* / 焦点管理 / ESC 栈

## 安装

```bash
pnpm add @kenconnet666/zui-vue
```

zui-vue 把 `@kenconnet666/zui-core` 列在 dependencies(workspace 内),用户**不需要**单独安装 core。但需要装 peerDeps:

```bash
pnpm add @emotion/css @emotion/unitless @floating-ui/vue @vicons/material \
         @vueuse/core @vueuse/integrations async-validator color2k \
         date-fns date-fns-tz vue
```

可选 peerDeps(按需):

- `qrcode` —— 给 `<ZQRCode>` 用
- `shiki` —— 给 `<ZCode>` / `<ZCodeCard>` 高亮代码块用

需要 Node ≥ 20、Vue ^3.5、TypeScript ≥ 5(`moduleResolution: "Bundler"`)。

## Quickstart

`main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

`App.vue`:

```vue
<script setup lang="ts">
import { ZBox, zuiLight, zhCN, ZButton, ZInput, ZForm, ZFormItem } from '@kenconnet666/zui-vue'
import { ref } from 'vue'

const model = ref({ name: '', email: '' })
</script>

<template>
  <ZBox :theme="zuiLight" :locale="zhCN"><!-- :iem 已移除（0.9.x）；尺寸改用纯 px -->
    <ZForm :model="model" label-placement="top">
      <ZFormItem prop="name" label="名称" required>
        <ZInput v-model:value="model.name" placeholder="请输入" />
      </ZFormItem>
      <ZFormItem prop="email" label="邮箱">
        <ZInput v-model:value="model.email" type="email" />
      </ZFormItem>
      <ZButton variant="filled">提交</ZButton>
    </ZForm>
  </ZBox>
</template>
```

## 组件清单

### gene 通用(17)

`ZButton` `ZIcon` `ZText` `ZTitle` `ZParagraph` `ZLink` `ZTag` `ZBadge` `ZAvatar` `ZDivider` `ZCode` `ZCodeCard` `ZCopyButton` `ZEllipsis` `ZGradientText` `ZBlockquote` `ZSegmented`

### layout 布局(7)

`ZFlex` `ZGrid` `ZSpace` `ZSpacer` `ZSplit` `ZScrollbar` `ZAffix`

### input 输入(20+)

`ZInput` `ZTextarea` `ZInputNumber` `ZSelect` `ZCheckbox` `ZCheckboxGroup` `ZRadio` `ZRadioGroup` `ZSwitch` `ZSlider` `ZRate` `ZDatePicker` `ZTimePicker` `ZUpload` `ZForm` `ZFormItem` `ZAutoComplete` `ZMention` `ZCascader` `ZTreeSelect` `ZTransfer` `ZDynamicTags` `ZColorPicker`

### display 展示(19)

`ZCard` `ZImage` `ZEmpty` `ZProgress` `ZResult` `ZSkeleton` `ZStatistic` `ZList` `ZTable` `ZDataTable` `ZDescriptions` `ZTree` `ZTimeline` `ZTooltip` `ZPopover` `ZCarousel` `ZCollapse` `ZCalendar` `ZVirtualList`

### feedback 反馈(9)

`ZAlert` `ZMessage` `ZNotification` `ZLoadingBar` `ZSpin` `ZModal` `ZDrawer` `ZPopconfirm` `ZTour`

### navigation 导航(9)

`ZMenu` `ZTabs` `ZSteps` `ZBreadcrumb` `ZDropdown` `ZPagination` `ZAnchor` `ZBackTop` `ZPageHeader`

### tool 工具(5)

`ZCountdown` `ZMarquee` `ZNumberAnimation` `ZQRCode` `ZWatermark`

详细 API + 在线 demo 见 **docs 站点**(`pnpm --filter @kenconnet666/docs dev` 本地启动)。

## 设计哲学(简版)

1. **chain DSL 强类型**:每个 CSS 属性都是 builder 上的强类型方法,IDE 全程补全
2. **统一 `css` 兜底口**:任何组件支持 `:css="(s) => ..."` 写 emotion 风格的运行时样式
3. **复合组件 sx 平铺**:`ZCard` 的 head/body/foot 用 `sxHead` / `sxBody` / `sxFoot` 配置,**props/class/style/事件全平铺**到一个对象
4. **carrier factory 范式**:`size` / `color` / `spacing` 类 props 接 `(c: Chain['color']) => void` 函数,把主题 token 调度交给用户
5. **响应式 vw**:`ZIemPreset.default` 是 `0.8333vw`(=16px @ 1920),整站随宽度等比缩放;`useZIem()` 拿到当前 px 值供 JS 算法层用
6. **a11y 内建**:ARIA role / focus trap / ESC stack / `:focus-visible`

详细 props 范式见 [docs guide / props 范式](/guide/prop-shape)。

## 主题扩展

`zuiLight` / `zuiDark` 是默认主题。用户用 `declare module` 扩 schema:

```ts
import type {} from '@kenconnet666/zui-vue'

declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brand: string
    accent: string
  }
}
```

然后:

```ts
const myTheme = zuiLight.extend({
  color: { brand: '#7c3aed', accent: '#06b6d4' },
})
```

之后 `s.color._brand` / `s.color._accent` 在所有组件的 `:css` 中可用。

完整列表 17 个 `UserXxxExt` 锚点:`UserColorExt` / `UserSpacingExt` / `UserRadiusExt` / `UserFontSizeExt` / `UserFontWeightExt` / `UserShadowExt` / `UserBlurExt` / `UserDurationExt` / `UserEasingExt` / `UserBreakpointExt` / `UserZIndexExt` / `UserOpacityExt` / `UserLineHeightExt` / `UserLetterSpacingExt` / `UserAspectRatioExt` / `UserFontsExt` / `UserSizesExt` / `UserBordersExt` / `UserTransitionPropertyExt`。

## i18n

```vue
<ZBox :locale="zhCN">  <!-- 或 enUS -->
  <!-- ... -->
</ZBox>
```

切换:`useZLocale().set(enUS)`。扩展 namespace 见 [docs guide / Locale 扩展](/guide/locale-ext)。

## tree-shake / 包大小

单入口设计 + `sideEffects: false`,bundler 自动 tree-shake。**只用 `<ZButton>`** 的项目仅引入相关代码 + emotion runtime + ZBox provider 基建。

## 开发

```bash
# 在 monorepo 根
pnpm install
pnpm --filter @kenconnet666/zui-vue test          # 全套 spec
pnpm --filter @kenconnet666/zui-vue run type-check
pnpm --filter @kenconnet666/zui-vue run build
pnpm --filter @kenconnet666/docs dev              # 文档站点
```

## 相关链接

- [docs 站点(本地启)](../docs/)
- [zui-core 文档](../core/README.md)
- [完整 API 与 skill 知识库](../../.claude/skills/zui.md)
- [实现路线图](../../.claude/zui-vue-roadmap.md)
- [CHANGELOG](./CHANGELOG.md)

## License

MIT
