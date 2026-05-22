# @kenconnet666/zui-vue

## Unreleased

### 扩 ZuiSchema:新增 `sizes` / `borders` / `transitionProperty` 三个 category + zuiDark 加深 shadow

补齐 chain enhanced-props 已配但 schema 缺字段的 token category,IDE 写 `s.width._container` /
`s.borderWidth._thin` / `s.transitionProperty._colors` 时自动补全 + 走主题查找。

**新增 3 个 schema category**(全部支持 `UserXxxExt` augmentation):

| Category | 用于 chain carrier | 默认 keys | 单位策略 |
|---|---|---|---|
| `sizes` | `width / height / minW / minH / maxW / maxH / flexBasis` | 5 阶 `tiny`(64px)/`small`(128px)/`middle`(256px)/`large`(512px)/`huge`(768px)+ 4 个语义 `container`(1200px)/`readable`('65ch')/`full`('100%')/`screen`('100vw')/`screenH`('100vh') | 5 阶 iem 化(Provider 联动),语义 4 个字面量 |
| `borders` | `borderWidth / outlineWidth` + 各 sub(top/right/bottom/left) | `none`/`thin`(1px)/`middle`(2px)/`thick`(3px)/`heavy`(4px) | **px 字面量**(同 shadow,跟字号无关) |
| `transitionProperty` | `transitionProperty` | `none`/`all`/`colors`/`opacity`/`transform`/`shadow`/`sizes`/`default` | 逗号分隔 CSS 属性列表 |

**典型用法**:
```ts
<ZBox :css-root="(s) => {
  s.maxWidth._container       // 1200px page 主区
  s.minHeight._screenH        // 100vh 全屏
  s.borderWidth._thin         // 1px 标准边框
  s.outlineWidth._middle      // 2px focus ring
  s.transitionProperty._colors // 颜色族过渡
  s.transitionDuration._small  // 150ms(已有 duration token)
}">
```

**zuiDark 单独加深 shadow**:dark 模式 bg 深,light 的 rgb(0/0/0/0.05~0.25) 阴影看不见。
新 zuiDark.shadow 把 rgba 不透明度提升到 0.3~0.7,深色 bg 上保留"浮起"层次感。

**用户扩展**(同其它 category):
```ts
declare module '@kenconnet666/zui-vue' {
  interface UserSizesExt {
    sidebar: string
    drawer: string
  }
  interface UserBordersExt {
    superThick: string
  }
}
zuiLight.extend({
  sizes: { sidebar: '280px', drawer: '420px' },
  borders: { superThick: '6px' },
})
```

**对现有代码**:零 BREAKING,纯追加 token。**ZDivider `thickness` prop 仍是 string**(未来若改 carrier factory 风格再发 BREAKING entry)。

---

### `ZBox :iem` 移除默认值,改为透传父 cascade(语义修正)

**问题**:之前 `:iem` 默认值 `'16px'`,导致每个 ZBox 都强制写 inline `--zui-iem: 16px`,**子 ZBox 总是覆盖父级 cascade**,违反"向下透传,显式才覆盖"的本意。一旦页面里嵌套多层 ZBox(主题分组 / 装饰 box),根级 `:iem="ZIemPreset.large"` 立刻被子层默认值打回 16px。

**改动**:
- `:iem` 改为可选,**不再有默认值**
- 不传 `:iem` 时,wrapper 不写 inline `--zui-iem`,让 css cascade 自然透传父 ZBox 的值
- **根 ZBox**(没有父 Provider)未传 `:iem` 时,**dev warn** 提醒显式声明根基准:
  > `[zui-vue/ZBox] 根 ZBox 未传 :iem。所有 iem 化 token 将回落到 css var fallback 16px,无法跟随浏览器根字号(a11y 大字)、无法整站切换大字 / 紧凑模式。建议根节点显式包一层 <ZBox :iem="ZIemPreset.default">`

**对现有代码**:
- 完全没用 ZBox / 用 `chain.iem(N)` 的页面:行为不变(自带 `calc(... var(--zui-iem, 16px))` fallback)
- 根 ZBox 已经传了 `:iem` 的工程:不变
- 根 ZBox 没传 `:iem` 的工程:开发期 warn,生产期视觉不变(仍然 16px),但**强烈建议加上**以支持 a11y / 大字 / 紧凑模式

```diff
- <ZBox :theme="zuiLight">           <!-- 默认 16px,但子 ZBox 也会覆盖 -->
+ <ZBox :theme="zuiLight" :iem="ZIemPreset.default">  <!-- 显式 16px,子 ZBox 自动透传 -->
    <App />
  </ZBox>
```

---

### BREAKING — `ZConfigProvider` 改名为 `ZBox` + 新增 `cssRoot` / `tag`

把原 `<ZConfigProvider>`(主题/iem/locale 注入器)与「装饰用底层 box」职能合并为一个组件,
解决用户经常需要"包一层 div 改背景/边距"时还得另起 wrapper 组件的痛点。

**改动**:
- `ZConfigProvider` → `ZBox`(SFC + 所有 import / docs / tests / skill 文档同步重命名)
- 新增 `cssRoot?: (s: Chain<ZuiSchema>) => void` —— 跟 ZIcon/ZText 一致的 chain factory,
  可写 padding/margin/background/borderRadius、`_hover` 伪类、`_media('_small', ...)` 媒体查询等
- 新增 `tag?: string`(默认 `'div'`)—— 语义化场景传 `'section'` / `'article'` 等
- 全部原有 prop(`theme` / `themePatch` / `locale` / `localePatch` / `timezone` / `dateLocale` / `iem`)
  和注入语义(`Z_THEME_KEY` / `Z_LOCALE_KEY` / `Z_DATE_KEY`)**100% 保留**

**新增 schema 字段 `fonts`**(`sans` / `serif` / `mono` 3 件套):
- 对应 chain `fontFamily` carrier 的 `tokenCat: 'fonts'` token lookup
- `zuiLight` 默认提供跨平台兜底栈(`system-ui` / `ui-serif` / `ui-monospace`)
- `ZText` `mono=true` 现在走 `s.fontFamily._mono`(原硬编码 `MONO_FONT_STACK` 已删)
- 用户工程通过 `<ZBox :theme-patch="{ fonts: { mono: 'Fira Code, ...' } }">` 局部覆盖品牌字体
- `UserFontsExt` augmentation 锚点 + 顶层 re-export

**迁移**:
```diff
- <ZConfigProvider :theme="zuiLight" :iem="ZIemPreset.large">
+ <ZBox :theme="zuiLight" :iem="ZIemPreset.large">
    <App />
- </ZConfigProvider>
+ </ZBox>
```

同名情景的 props 都不动;只把标签名改了。仅当需要"包一层 div 加点装饰"时新用 `:css-root` /
`:tag` 即可一行替代过去的额外 wrapper 组件。

---

### BREAKING — 移除 `:component-tokens` + `useZComponentTokens` 等 ComponentTokenRegistry 体系

跟随 core 0.7.x → unreleased 的下线。简化为三层覆盖模型：**Theme** / **Schema augmentation** / **`:css-root` Instance**。

**移除的 API**：

| API | 替代方案 |
| --- | --- |
| `<ZConfigProvider :component-tokens>` | 改主题：`<ZConfigProvider :theme="zuiLight.extend({ color: { primary: '#abc' } })">`；加品牌 token：`interface UserColorExt { brand: string }` augmentation；单实例改：`:css-root` |
| `useZComponentTokens()` | 不再需要；组件 setup 直接 `useZTheme()` |
| `useZComponentTokenSlice(name)` | 同上 |
| `Z_OVERRIDES_KEY` injection key | 同上 |
| `type ZIconTokens` 等组件 Tokens 接口 | 数值类档位由组件内部 `const SIZE_MAP / DEPTH_MAP / SPIN_MAP` 接管（不再公开） |

**ZIcon 变更**：
- 移除 `ZIconTokens` 类型导出（barrel 只剩 `ZIcon` + `ZIconProps`）
- `size` prop 维持 `'tiny' | 'small' | 'middle' | 'large' | 'huge' | number`（number escape hatch 仍可用）
- 5 个语义色直接走 chain shortcut `s.color._primary / _success / _warning / _danger / _info`（IDE 自动补全 ZuiSchema token）
- `:css-root` 在 base + 维度之后调用，可覆盖任意属性（不变）

**迁移**：

```vue
<!-- 旧 -->
<ZConfigProvider :component-tokens="{ icon: { primaryColor: '#abc', sizeLarge: 2 } }">
  <ZIcon color="primary" size="large" />
</ZConfigProvider>

<!-- 新 —— 改主题色 + cssRoot 单点改 -->
<ZConfigProvider :theme="zuiLight.extend({ color: { primary: '#abc' } })">
  <ZIcon color="primary" :size="2" />  <!-- size number escape -->
</ZConfigProvider>
```

## 0.1.0

### Minor Changes

- ## `@kenconnet666/zui-core` 0.7.0

  ### BREAKING — schema 拆分：`DefaultSchema` 删除，core 只保留 palette
  - 新增 `BaseSchema`（取代旧 `DefaultSchema`），**只含 palette 颜色**，不再内置语义色 / spacing / radius / fontSize / shadow / blur / duration / breakpoint / fontWeight / easing / lineHeight / letterSpacing / opacity / aspectRatio / zIndex 等设计系统层 token。
  - 新增 `paletteLight` / `paletteDark`（取代旧 `defaultLight` / `defaultDark`），仅含 Tailwind 242 色 palette。
  - 完整设计系统 token（semantic 11 色 + 15 个 scale）下沉到 `@kenconnet666/zui-vue` 的 `ZuiSchema` / `zuiLight` / `zuiDark`，需要用 `@kenconnet666/zui-vue` 才能用旧 `defaultLight` 的等价体验。

  ### 增强
  - `ENHANCED_PROPS` 大批补充 CSS 标准 keyword 支持（过渡 / 字体 / 边框宽度 / 位置等）。
  - `ComponentTokenRegistry` 保留空 interface 作为声明合并锚点，用户可注入自定义 component token namespace。
  - `Chain<T = BaseSchema>` 默认 generic 改为 `BaseSchema`。
  - 新增 `src/types/docs-zh/` 中文 API 文档聚合入口（19 个分组 + AGENT_GUIDE.md），由 `scripts/generate-properties.mjs` 校验。
  - `properties.generated.ts` 重生：~17.9k 行（含完整中文 JSDoc）。

  ### 迁移

  | 旧                                                                     | 新                                                                 |
  | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
  | `import { defaultLight, DefaultSchema } from '@kenconnet666/zui-core'` | `import { zuiLight, type ZuiSchema } from '@kenconnet666/zui-vue'` |
  | `Chain<DefaultSchema>`                                                 | `Chain<ZuiSchema>`（来自 `@kenconnet666/zui-vue`）                 |
  | `defaultLight.resolve().color.primary`                                 | `zuiLight.resolve().color.primary`                                 |

  只用 palette 不需要 semantic 的场景：`import { paletteLight, type BaseSchema } from '@kenconnet666/zui-core'`。

  ## `@kenconnet666/zui-vue` 0.1.0

  ### 首个正式公开版本

  #### 新增
  - `zuiLight` / `zuiDark` 主题（基于 core 的 palette + 11 语义色 + 15 个完整 scale）。
  - `ZuiSchema` 主题层 schema + 15 个 `UserXxxExt` 模块扩展锚点：用户工程通过
    `declare module '@kenconnet666/zui-vue' { interface UserColorExt { brandRoyal: string } }`
    即可让 `Chain<ZuiSchema>` 自动识别自定义 token，无需手写 `interface MySchema extends ZuiSchema`。
  - `ZIcon`：4 维度全离散组件（size / color / depth / spin），21 项 component token 完整暴露。
    - `baseFontSize` prop 控制根 `font-size`（"1em 等于多少"），让 width/height 的 em 单位 resolve 到绝对值。
    - `spin` prop **纯枚举** `'none' | 'tiny' | 'small' | 'middle' | 'large' | 'huge'`，**不接 boolean**。
    - `ZIconTokens` 全字段 number 化（`sizeLarge` em 倍率 / `depthDimOpacity` 0..1 / `spinMiddleDuration` 秒）。
  - `ZConfigProvider` + 4 个 composable（`useZTheme` / `useZComponentTokens` / `useZLocale` / `useZDate`）。
  - locale 字典（zh-CN / en-US + namespace 级 mergeLocale）。
  - **主入口全量透传 core**：`@kenconnet666/zui-vue` 内 `export * from '@kenconnet666/zui-core'`，
    装 ui-vue 即等于装 core，用户无需再单独 `import` core 包。
  - `LICENSE`（MIT）。

  #### subpath exports
  - `@kenconnet666/zui-vue` 主入口
  - `@kenconnet666/zui-vue/provider`
  - `@kenconnet666/zui-vue/composables`
  - `@kenconnet666/zui-vue/locale`
  - `@kenconnet666/zui-vue/components`
  - `@kenconnet666/zui-vue/components/icon`

### Patch Changes

- Updated dependencies
  - @kenconnet666/zui-core@0.7.0

## 0.0.5

### Patch Changes

- Updated dependencies [8841e2c]
- Updated dependencies [3780a9a]
- Updated dependencies [3be1f05]
  - @kenconnet666/zui-core@0.6.0

## 0.0.4

### Patch Changes

- Updated dependencies [b1ac0ff]
- Updated dependencies [65282d9]
- Updated dependencies [f8f880c]
- Updated dependencies [7bcbdad]
- Updated dependencies [d00dcd0]
- Updated dependencies [c94cf87]
  - @kenconnet666/zui-core@0.5.0

## 0.0.3

### Patch Changes

- Updated dependencies [2b32b59]
- Updated dependencies [277fc1c]
- Updated dependencies [5271397]
- Updated dependencies [e5b793b]
- Updated dependencies [012c314]
  - @kenconnet666/zui-core@0.4.0

## 0.0.2

### Patch Changes

- Updated dependencies
  - @kenconnet666/zui-core@0.3.0
