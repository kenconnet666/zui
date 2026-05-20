# @kenconnet666/zui-core

## 0.6.0

### Minor Changes

- 8841e2c: CL Batch 1-3 — 组件库基础设施完整化

  为构建组件库（Button / Input / Dialog / Tabs / Select / Toast 等）补完一组核心 API。

  ### CL Batch 1：组件库核心 5 项
  - **`defineParts`** 多 slot variants（参考 tailwind-variants slots）—— 给 Dialog / Select / Tabs 等多内部元素组件用。每个 slot 独立工厂、独立 LRU 缓存。
  - **`composeVariants(...factories)`** 多变体复合 + **`extendVariants(parent, child)`** 继承——让作者复用通用 interactive / focus 变体。
  - **`VariantPropsOf<typeof factory>`** / **`VariantPropsOfParts<typeof parts>`** 类型推断 ——自动从工厂推 component props 类型。
  - **`defineMixin`** 可重用样式片段（focus-ring / elevation / surface 等）。
  - **`Chain._state(props, mapping)`** 状态化样式——把 if 链替换成声明式 mapping。

  ### CL Batch 2：响应式 + props 统一 + boolean variants
  - **`applyResponsive(chain, value, apply)`** 响应式 prop 解析 —— `{ base: 4, md: 8, lg: 16 }` 自动 `_media` 嵌套。
  - **`applyStyleProps(theme, props)`** 新签名（旧 `(chain, props)` 保留）—— 与 `icss` / `defineVariants` 参数顺序一致；同时支持响应式 prop。
  - **`ResponsiveStyleProps<T>`** 类型；**`ResponsiveValue<T>` / `ResponsiveObject<T>` / `isResponsiveValue`** 工具。
  - **defineVariants boolean / number variants**：`variants: { disabled: { true: ..., false: ... } }` 配合 `f({ disabled: true })`；数字 `f({ elevation: 2 })` 自动转 `'2'` 字符串 key。
  - 类型层 **`BoolFriendly<K>`**：`'true' | 'false'` 暴露成 `boolean`；纯数字字面量暴露成 `number`。

  ### CL Batch 3：集成 + componentTokensFor + 文档
  - **`componentTokensFor(component, theme)`** runtime helper —— 拿到组件 namespace 下完整 token map（供 icon color 派生 / DOM 注入等）。
  - 新增 `tests/cl-batch3-integration.spec.ts` 24 个集成测试覆盖：完整 Button 组件（27 种 variant 组合）/ 6-slot Dialog / 主题切换 light↔dark / SSR 多 instance 隔离 / applyStyleProps 端到端 / 预设动画用例。
  - README 新增「构建组件库（0.5.0+）」章节，含 7 个 API 完整用例（defineVariants / defineParts / composeVariants / defineMixin / `_state` / applyResponsive / componentTokensFor / SSR）。

  ### 新增导出
  - `defineMixin`
  - `composeVariants` / `extendVariants` / `VariantPropsOf`
  - `defineParts` + 8 个相关类型 / `VariantPropsOfParts`
  - `applyResponsive` / `isResponsiveValue` / `ResponsiveValue` / `ResponsiveObject` / `ResponsiveStyleProps`
  - `componentTokensFor`
  - `Chain._state` 内建方法

  ### 数字
  - 测试 474 → **549**（+75）
  - 套件 26 → **29**（+3）
  - build 72.05 kB → **75.24 kB**（+3.19 kB / +0.79 kB gzip）

- 3780a9a: ★ BREAKING — 系统 token 6 个 category 改语义化命名

  ### 改造范围

  | Category       | 旧（Tailwind 风）                                           | 新（语义化）                                              |
  | -------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
  | **spacing**    | `xs / sm / md / lg / xl`（5）                               | `tiny / small / middle / large / huge`（5）               |
  | **fontSize**   | `xs / sm / md / lg / xl`（5）                               | `tiny / small / middle / large / huge`（5）               |
  | **radius**     | `sm / md / lg / full`（4）                                  | `none / tiny / small / middle / large / huge / full`（7） |
  | **shadow**     | `sm / md / lg`（3）                                         | `tiny / small / middle / large / huge`（5）               |
  | **blur**       | `none / xs / sm / base / md / lg / xl / 2xl / 3xl`（9，杂） | `none / tiny / small / middle / large / huge`（6）        |
  | **breakpoint** | `sm / md / lg / xl / 2xl`（5）                              | `tiny / small / middle / large / huge`（5）               |

  ### 不变（已语义化 / 不属 size 维度）

  `color` / `fontWeight` / `duration` / `easing` / `lineHeight` / `letterSpacing` / `zIndex` / `opacity` / `aspectRatio`

  ### 影响 API

  **用户访问**：

  ```diff
  - s.padding._md          → s.padding._middle
  - s.fontSize._lg         → s.fontSize._large
  - s.borderRadius._sm     → s.borderRadius._tiny
  - s.boxShadow._md        → s.boxShadow._middle
  - s._blur('_sm')         → s._blur('_small')
  - s._media('_md', ...)   → s._media('_small', ...)   (768px = 旧 md = 新 small)
  ```

  **注意 breakpoint 值的位移**：
  - 旧 `_md` = 768px → 新对应 `_small`
  - 旧 `_lg` = 1024px → 新对应 `_middle`
  - 旧 `_xl` = 1280px → 新对应 `_large`
  - 旧 `_2xl` = 1536px → 新对应 `_huge`
  - 新加 `_tiny` = 640px（旧 sm）

  **Chain `_container*` helper 重命名**：

  ```diff
  - _containerSm / _containerMd / _containerLg / _containerXl / _container2xl
  + _containerTiny / _containerSmall / _containerMiddle / _containerLarge / _containerHuge
  ```

  ### 数值变化
  - `radius._middle` = '12px'（旧 `_md` 是 8px，新 `_middle` 是 7 档中间值 12px）
  - `radius._tiny` = '4px'（旧 `_sm` 同值）
  - `blur._middle` = '16px'（旧 `_md` 是 12px，新 6 档中间值 16px）
  - `blur._small` = '8px'（旧 `_sm` 是 4px）
  - 新增 `radius._none / _huge`、`blur._none / _tiny / _huge`、`shadow._tiny / _huge`

  ### 迁移指南

  升级 0.6.0 时：
  1. **所有 `._xs / ._sm / ._md / ._lg / ._xl / ._2xl / ._3xl` 替换**：
     ```
     ._xs → ._tiny
     ._sm → ._small
     ._md → ._middle
     ._lg → ._large
     ._xl → ._huge
     ._2xl → ._huge      # schema 不再有 2xl
     ._3xl → ._huge      # schema 不再有 3xl
     ._base → ._small    # blur 删 base
     ```
  2. **`_media` / `_container` / `_blur` 字符串参数同样替换**：
     ```ts
     _media('_md', ...)  → _media('_small', ...)   // 768px 现在叫 small
     _blur('_md')        → _blur('_middle')        // 12px → 16px
     ```
  3. **`_containerSm` 等 Chain helper 重命名**：见上表
  4. **数值断言**：`radius._middle = 12px`（之前 `_md = 8px`）。如果用户做了"基于旧档位值"的测试，需要适配。

  ### 修改文件统计
  - 6 个核心 src 文件（schema / light / dark / Chain）
  - 14 个测试文件（grep 替换 + 数值调整）
  - 4 个 framework recipe
  - README
  - examples（vue / react / vanilla）
  - bench

  测试 549/549 全绿；build 75.58 kB / gzip 19.64 kB（+0.34 kB）。

  理由：
  - variant key（组件 size 'tiny/small/middle/large/huge'）与 theme token 命名统一
  - 避免与 Tailwind 思维耦合（sm/md/lg 在不同场景含义不同）
  - 设计意图更清晰：`_middle` 是"5 档中间"，`_large` 是"较大"，比 `_md` 表义更明确

- 3be1f05: ★ dist 产物结构改造 + subpath exports（无破坏，0.7.0）

  ### 改造前 vs 改造后

  |                  | 0.6.0                                | 0.7.0                               |
  | ---------------- | ------------------------------------ | ----------------------------------- |
  | 文件结构         | 单 `dist/index.js`（75 kB minified） | 多目录平铺（~50 个独立文件）        |
  | 可读性           | 单字母变量、无 JSDoc                 | ✅ 真名变量 + 完整 JSDoc            |
  | Subpath import   | ❌ 仅主入口                          | ✅ `/variants` / `/preset` / `/dev` |
  | Tree-shake       | bundler 内部分析                     | ✅ ESM 静态边界，更精确             |
  | go-to-definition | 跳单文件第 N 行                      | ✅ 跳独立模块                       |

  ### Subpath 入口

  ```ts
  // 组件库 variants
  import { defineVariants, defineParts } from '@kenconnet666/zui-core/variants'

  // 预设资源
  import { presetAnimations, PREFLIGHT_STYLES } from '@kenconnet666/zui-core/preset'

  // 开发态工具（仅 dev 模式 import）
  import { assertSchemaConsistency } from '@kenconnet666/zui-core/dev'
  ```

  ### dist 产物结构

  ```
  dist/
  ├── index.js                            (~2 kB re-exports)
  ├── chain/Chain.js                      (28.78 kB / gzip 9.01 kB)
  ├── chain/carrier.js, color.js, ...
  ├── theme/Theme.js, resolveTheme.js, defaults/light.js, dark.js, ...
  ├── variants/index.js + 4 文件
  ├── preset/index.js + 3 文件
  ├── dev/index.js + 2 文件
  ├── types/ (纯 .d.ts)
  └── icss.js / cx.js / ikeyframes.js / ...
  ```

  每个文件保留完整 JSDoc + 真名变量 + 独立 source map。

  ### 实现要点
  - **`vite.config.ts`**：4 入口（main + 3 subpath）+ `preserveModules: true` + `minify: false`
  - **`dts plugin`**：`rollupTypes: false`，每个源文件输出对应 `.d.ts`
  - **`package.json`**：`exports` 加 `/variants` / `/preset` / `/dev` + `/package.json` 反查

  ### 包体积
  - 主入口 `dist/index.js`: 75 kB → **2.27 kB**（仅 re-exports）
  - 总 unpacked: ~120 kB（含 source map / d.ts.map）
  - 总 packed tarball: 123 kB → **222 kB**（含完整 JSDoc / map，但每文件 gzip 友好）

  实际 bundler 打包时按需 import，最终用户 bundle 不会变大。

  ### 内部修复

  `theme/componentTokens.ts:65` — `prefix` 显式 `: string` cast，让 dts plugin 在
  `ComponentTokenRegistry` 用户未 augment 时（`C = never`）也能生成 .d.ts。

  ### 兼容性

  ✅ **非破坏性**：所有现有 `import { ... } from '@kenconnet666/zui-core'` 主入口语句继续工作。
  ✅ 现有测试 549/549 全绿。
  ✅ types 路径修正（`dist/index.d.ts` 仍存在并 re-export）。

## 0.5.0

### Minor Changes

- b1ac0ff: 第二轮审计 — Audit Batch 1-3 全部落地

  ### Audit Batch 1：全局 helper 接入 dedupe + escape + freeze
  - **S1** 一致性：`registerCustomProperty` / `registerFont` / `injectLayer` / `injectLayerOrder` 全部改走 `./injectGlobal`（享受内存级去重）。与 `createIcssInstance` instance 版行为对齐。
  - **S2** `registerCustomProperty` 加单引号 escape + dev 模式可疑 syntax / initialValue 警告。
  - **S5** `PREFLIGHT_STYLES` 深 freeze 防外部 mutation 污染全局。

  ### Audit Batch 2：toIdent + assertSchemaConsistency 防御
  - **S3** `toIdent` 检测非法 JS ident 字符（空格 / 特殊符号 / emoji）→ dev warn + 兜底 sanitize。`buildKeymap` 配套：同 category 内 ident 撞车 dev warn。
  - **S6** `assertSchemaConsistency.makeReferenceProbe` 不存在 category 的内层 Proxy 也记录访问路径 → ref 含完整 `cat.key` 而非只 `cat`。

  ### Audit Batch 3：preset instance 工厂 + sideEffects 精确化
  - **S4** ★ 抽 `src/preset/animation-defs.ts`（15 个动画的 stops 数据 + `PresetAnimationName` 类型）。
    - 全局 `presetAnimations` 仍 eager 注册到全局 emotion（向后兼容）
    - `createIcssInstance` 加 `presetAnimations` 字段：**lazy 注册到 instance 的 emotion**（多实例 SSR 隔离）
    - lazy 实现用 Proxy + 内部 cache，未访问任何字段则零开销
  - **S7** `package.json` `sideEffects: false` → `["**/preset/animations.js", "**/preset/animations.mjs"]` 精确告知 bundler 哪个文件有副作用。

  ### Audit Batch 4：工程化 + 测试覆盖
  - **S8** `vite.config.ts` bench 加 `environment: 'node'`，bench 启动加速。
  - **S10** `tsconfig.json` 加 `noEmitOnError: true` 双保险（type-check 错时不出 dist）。
  - **S9** `register*` 测试断言生成的 `@property` / `@font-face` / `@layer` 字符串内容（之前只测调用不抛错）。

  ### 新增测试

  54 个测试（共 420 → 474）。
  build 增量：68.26 kB → 72.05 kB（+3.79 kB，主要是 instance 版 presetAnimations + escape 代码）。

- 65282d9: Batch A — `defineVariants` 变体抽象

  新增 `defineVariants(theme, config)` 工厂函数，参考 cva / tv 风格但完全适配 zui-core 的
  statement-only chain。让组件库作者声明式定义 base / variants / defaults / compoundVariants：

  ```ts
  const button = defineVariants(defaultLight, {
    base: (s) => {
      s.padding.px(12)
      s.borderRadius._md
    },
    variants: {
      intent: {
        primary: (s) => {
          s.backgroundColor._primary
          s.color.white
        },
        danger: (s) => {
          s.backgroundColor._danger
          s.color.white
        },
        ghost: (s) => {
          s.color._primary
        },
      },
      size: {
        sm: (s) => {
          s.padding.px(8)
        },
        md: (s) => {
          s.padding.px(12)
        },
        lg: (s) => {
          s.padding.px(16)
        },
      },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
    compoundVariants: [
      {
        when: { intent: 'ghost', size: 'sm' },
        apply: (s) => {
          s.padding.px(6)
        },
      },
    ],
  })

  button({ intent: 'danger', size: 'sm' }) // → className
  button() // 全 defaults
  ```

  特性：
  - **类型完整**：`Parameters<typeof button>[0]` 推出 `{ intent?: 'primary'|'danger'|'ghost'; size?: 'sm'|'md'|'lg' }`
  - **内置缓存**：相同 props 输入命中缓存（stable JSON key，props 顺序无关）
  - **statement-only 兼容**：variant 内可用 `_hover` / `_focusVisible` / 等所有内建嵌套方法
  - **声明顺序优先**：compound 多条按声明顺序 apply，后者覆盖前者

  新增导出：
  - `defineVariants` 主函数
  - `VariantOptions<S>` / `VariantMap<S>` / `VariantProps<V>` / `CompoundVariant<S, V>` / `DefineVariantsConfig<S, V>` 类型工具

  新增 22 测试（共 303 / 281 → 303）。

- f8f880c: Batch C — 预设动画 + `_transition` 简写

  ### `presetAnimations` 模块

  15 个组件库常用 keyframes 预设（参考 tailwindcss-animate）：

  | 类别         | 名称                                                                          |
  | ------------ | ----------------------------------------------------------------------------- |
  | Fade         | `fadeIn` / `fadeOut`                                                          |
  | Slide        | `slideInUp` / `slideInDown` / `slideInLeft` / `slideInRight` / `slideOutDown` |
  | Scale / Zoom | `scaleIn` / `scaleOut` / `zoomIn`                                             |
  | 强调 / 循环  | `spin` / `pulse` / `bounce` / `ping` / `shake`                                |

  每个值是 emotion 注册后的 `animation-name` 字符串，直接传给 `s.animationName(...)` 使用：

  ```ts
  import { presetAnimations, icss, defaultLight } from '@kenconnet666/zui-core'

  const cls = icss(defaultLight, (s) => {
    s.animationName(presetAnimations.fadeIn)
    s.animationDuration('300ms')
    s.animationFillMode('both')
  })
  ```

  ### `_transition` 链式简写

  新 Chain method，token 名（`_normal` / `_inOut`）自动解析自 `theme.duration` / `theme.easing`：

  ```ts
  s._transition({ property: 'all', duration: '_normal', easing: '_inOut' })
  // → transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)

  s._transition({ property: 'opacity', duration: 200, easing: 'ease-out' })
  // → transition: opacity 200ms ease-out
  ```

  特性：
  - 数字 `duration` 自动加 `ms` 单位
  - token 不存在时原样透传（不抛错）
  - `delay` 也支持 token / 数字
  - 与 `_hover` 等嵌套方法协调

  新增导出：
  - `presetAnimations` 主对象
  - `PresetAnimationName` 字面量 union 类型
  - `Chain._transition(opts)` method

  新增 38 测试（共 341 / 303 → 341）。

- d00dcd0: Debt Batch 2 — 中等改进 6 项

  ### M5 `cx` 支持 tailwind / clsx 风多形态入参

  ```ts
  cx('foo', false && 'bar', { active: true, disabled: false }) // 'foo active'
  cx(['a', 'b', { c: cond }], 'd') // 嵌套递归
  ```

  支持：string / number / falsy 跳过 / object `{ k: truthy }` / 数组嵌套。新增 `ClassInput` 类型导出。

  ### M4 `Theme` 构造对 function token 发 dev 警告

  `Object.assign(this, schema)` 把 function token 挂到 instance 上 → 类型签名是 `string | number` 但运行时是 function。dev 模式现在 `console.warn` 提醒用户走 `theme.resolve()`。production 静默。**只警告一次**（防止多 token 时刷屏）。

  ### M7 `deepClone` JSDoc 文档化 undefined 跳过行为

  JSDoc 现在明确：`undefined` 字段跳过（与 JS 一般约定一致），`null` 字段保留。

  ### M8 `color.ts` clamp NaN / Infinity 防御

  `setAlpha(c, NaN)` 之前输出 `rgba(r,g,b,NaN)` 破坏 CSS。现在 `clamp01` 内 `if (!Number.isFinite(n)) return 0`，所有 modifier（darken / lighten / mix / saturate / desaturate）安全。

  ### L1 `Chain._node` / `_theme` / `_keymap` / `_carriers` / `_cssFn` 改 `readonly`

  TypeScript 现在标记 `chain._node = {}` reassign 为错。**mutation（`chain._node.color = 'x'`）仍允许** —— escape hatch 保留。
  `_nest()` 内部通过 cast 切换 `_node` 引用（集中此处，唯一已知 reassign 用法）。

  ### 类型层 R1 收尾：`LengthUnits` 接口补 18 个现代单位

  接 Debt Batch 1 的 R1 修复（运行时 carrier），`types/carrier.ts` 的 `LengthUnits<TSelf>` 也补完 svw/svh/svmin/svmax/lvw/lvh/lvmin/lvmax/dvw/dvh/dvmin/dvmax/cqw/cqh/cqi/cqb/cqmin/cqmax 共 18 个新单位。**与 LENGTH_UNITS（34 个）严格对齐**。
  类型层 + 运行时全闭环。

  ### L3 `applyStyleProps` 运行时测试补完

  之前只有类型层测试，现在加 14 个运行时测试覆盖 alias 映射、token / keyword / 函数态、undefined 跳过、混合 props 等。

  ### 新增测试

  39 个测试（共 363 → 402）。

- c94cf87: Debt Batch 3 — 完整性 4 项

  ### L5 `defineVariants` LRU 缓存上限

  新增 `cacheLimit` 配置（默认 256），超过后按 LRU 淘汰最早插入的 entry。LRU touch：访问已缓存项会重新插入到尾部，避免被淘汰。

  ```ts
  const button = defineVariants(theme, {
    variants: {
      /* ... */
    },
    cacheLimit: 100, // 限制 100 个 className 缓存
    // 或 Infinity 关闭上限（不推荐）
  })
  ```

  ### L6 `registerFont` URL escape + dev warn

  之前 `font-family: '${family}'` / `url('${src}')` 拼接对包含单引号的字符串会破坏 CSS。
  现在 `escapeSingleQuotes(value)` 把 `'` 转 `\'`；dev 模式检测到 `<` / `>` / `"` 等可疑字符时 warn。`createIcssInstance` 内的 `registerFont` 同步获益。

  ### M2 README 加非颜色 token 不应链式警告

  明确标注：
  - 颜色 token 命中返回 `ColorTokenValue` helper（**不返回 chain**）→ 不能继续链式
  - 非颜色 token 命中**当前**返回 chain，**类型层也允许**继续链 — 但请按 statement-only 风格写

  ### M3 ★ Generator 启动时校验 KEYWORD_TO_CSS 覆盖 enhanced-props

  `scripts/generate-properties.mjs` 新增 `validateKeywordCoverage()`：扫描 ENHANCED_PROPS 所有 `keywords` 数组引用的 keyword，校验都存在于 `keywords.ts` 的 `KEYWORD_TO_CSS` 表中；缺失则抛错。

  **立刻发现 6 个隐藏 bug**：
  - `top` / `bottom`（captionSide）
  - `inside` / `outside`（listStylePosition）
  - `light` / `dark`（colorScheme）

  之前用户写 `s.captionSide.top` 等 carrier 静默不命中。已补 6 个 keyword 到 `KEYWORD_TO_CSS`。

  ### 新增测试

  15 个测试（共 402 → 417）：
  - L5 LRU 淘汰 / touch / cacheLimit Infinity
  - L6 URL escape / dev warn
  - M3 补全的 6 个 keyword 在 KEYWORD_TO_CSS 且 carrier 命中
  - M2 文档化的 token 命中行为守护

### Patch Changes

- 7bcbdad: Debt Batch 1 — 5 个严重 bug / 一致性修复

  ### R1 ★ 修复：现代 CSS 单位完全不工作

  `chain/carrier.ts` 的 `isUnitMethod` 硬编码 16 个 length unit，**遗漏 W1.7 落地的 18 个现代单位**（svw / svh / lvw / lvh / dvw / dvh / dvmin / dvmax / cqw / cqh / cqi / cqb / cqmin / cqmax 等）。导致 `s.padding.cqw(10)` / `s.width.svh(100)` 等运行时静默失败。

  修复：carrier 改用 `getUnitList(cls)` 从 `units.ts` 取，避免硬编码漂移。

  ### R2 GLOBAL_KEYWORDS single source

  `isGlobalKeyword` 硬编码 5 个值，与 `keywords.ts` 的 `GLOBAL_KEYWORDS` 常量重复。修复：import 常量。

  ### R3 createIcssInstance 内 injectGlobal 加 instance 级 dedupe

  `createIcssInstance` 直接调 `emotion.injectGlobal`，多实例 SSR 环境下反复 `injectPreflight()` / `registerCustomProperty()` 等都重复走 emotion serializer。修复：每个 instance 独立 `injectedHashes: Set<string>` 内存去重；新增 `_resetInjectGlobalCache()` API。

  ### R4 preflight single source

  `preflight.ts`（全局版）与 `createIcssInstance.injectPreflight`（instance 版）两份独立实现，已漂移（全局版多 `MozOsxFontSmoothing` / `textRendering`）。修复：抽 `src/preset/preflightStyles.ts` 作为 single source，两份实现都引用。

  ### R5 删 keywords.ts `leftPage` / `rightPage` 歧义条目

  `leftPage: 'left'` / `rightPage: 'right'` 与 `left: 'left'` / `right: 'right'` 重复，且 break-before 直接用 css `left` / `right` 命中已可。修复：删除两条歧义条目；`enhanced-props.ts` 的 `BREAK_KW` 改用 `'left'` / `'right'`；重跑 generator 更新 properties.generated.ts。

  ### 新增测试

  22 个测试（共 341 → 363）覆盖：
  - 34 个 length unit 全部可用
  - TIME_UNITS / ANGLE_UNITS 回归
  - GLOBAL_KEYWORDS 全部命中
  - instance dedupe + SSR 隔离 + \_resetCache
  - PREFLIGHT_STYLES 内容稳定
  - break-before: left / right 仍工作

## 0.4.0

### Minor Changes

- 2b32b59: Batch 1 — 质量与调试体验改进（5 项）
  - **B2** `Chain` Proxy 改用 prototype 自动扫描，新增内建方法无需同步白名单（修复历史易漏 bug）。继承 Chain 加自定义方法也能正确走 Proxy。
  - **C2** `label()` 多次调用现在 join 成 `a.b.c` 而非互相覆盖；空字符串入参被忽略。
  - **B5** 颜色 modifier (`darken` / `lighten` / `mix` / `saturate` / `desaturate`) 在原色含 alpha (rgba) 时保留原 alpha 输出 `rgba(...)`；不透明颜色仍输出 hex（兼容）。
  - **B4** `mergeTheme` 在 dev 模式下扫描 partial，遇 function token 时 `console.warn` 警示（生产构建静默）。
  - **C10** `injectGlobal` 内存级去重（基于内容指纹），重复内容不再走 emotion serializer。新增 `_resetInjectGlobalCache()` 内部测试 helper。

  新增 24 测试（共 198 / 174 → 198）。非破坏性。

- 277fc1c: Batch 3 — W3.2 完整 stack-trace label（dev 体验）

  把 `Chain` 构造的 `debug: true` 选项从简化版升级为完整版：
  - 抽到新模块 `src/dev/stackTrace.ts`，方便测试与复用
  - 跨 runtime 解析 stack 行：V8（Chrome / Node）/ SpiderMonkey（Firefox）/ JavaScriptCore（Safari）三种格式
  - framework frame 过滤：跳过 `Chain.ts` / `proxy.ts` / `carrier.ts` / `stackTrace.ts` / `node_modules` / `@kenconnet666/zui-core` 等
  - 输出 `fileName_LINE` 格式 label（去扩展名 / 去路径，对 emotion devtools 友好）
  - `isProductionEnv()` 提取：production 下 `debug: true` 自动降级 noop（避免栈泄露）
  - 与 C2 `label()` join 协作：手动 `c.label('Button')` 后会拼成 `App_42.Button`

  新增 26 测试（共 224 / 198 → 224）。

  新导出（dev 工具）：
  - `makeCallsiteLabel(stack?: string): string | null`
  - `parseStackLine(line: string): StackFrame | null`
  - `findUserCallsite(stackLines: string[]): StackFrame | null`
  - `isProductionEnv(): boolean`
  - type `StackFrame`

- 5271397: Batch 4 — 4 个现代 CSS 4 helper

  新增 4 个 Chain method，对齐 CSS 2024 实用方向：
  - `_safeArea(side?, property?)` — iOS notch / home indicator / Android nav bar 留白。支持 4 单侧或 `'all'`，可写 padding / margin / inset。
  - `_scrollSnap(opts)` — CSS Scroll Snap Level 1 简写：`type` + `strictness`（容器侧）和 `align` + `stop`（子项侧）。
  - `_overscroll(behavior, axis?)` — `overscroll-behavior` / `-x` / `-y` / `-inline` / `-block`。常用于禁用页面下拉刷新。
  - `_field(sizing)` — CSS Working Group 草案 `field-sizing`，让 `<input>` / `<textarea>` 跟随内容自适应。

  跳过：实验性 `_anchor`（CSS Anchor Positioning），浏览器支持率低 + API 易变。

  新增 24 测试（共 248 / 224 → 248）。

### Patch Changes

- e5b793b: Batch 5 — edge case 测试集中补强（仅测试）

  新增 `tests/edge.spec.ts` 33 个测试，集中覆盖已知陷阱与边界条件，防止回归：
  - function token 求值顺序 / 跨 category 引用 / 环 / 缺失 category cast 兜底
  - `resolveTheme` `Object.freeze` immutable 验证
  - blur key `'2xl'` / `'3xl'` 非合法 ident 访问（`theme.blur['2xl']`、`Chain._blur('2xl')`、`_blur('_2xl')`、未知 token 透传）
  - proxy bind receiver — `_when` / `_apply` / `_unless` 内 `fn(this)` 仍是 proxy
  - carrier 缓存命中（连续访问引用相同 / 跨实例不复用 / `_carriers` Map 大小）
  - alpha clamp 边界（< 0 / > 100 / 0 / 100）
  - 保留属性名（schema 起名 `label` 不破坏 Chain）
  - `icss` 接受 Theme / ResolvedTheme 两种形式
  - 空 schema / 空 partial 不抛
  - `Chain.toString()` 多次调用按 emotion content hash 等价
  - `_nest` try/finally 还原 \_node（fn 抛错后 chain 仍可用）/ 同名 selector 合并 / 空 fn 不留空 selector

  零代码改动。共 248 → 281 测试。

- 012c314: Batch 6 — 文档审计补强（仅文档）
  - `README.md` 限制章节：
    - 新增 `:focus-visible` iOS Safari 14- 兼容性提示
    - 新增 schema function token 直接访问 vs `resolve()` 一致性警示
    - 新增 `mergeTheme` partial 字面量约定（0.4.0 起 dev 警告）
    - SSR 章节改为 "0.3.0 起提供 createIcssInstance(emotion)"
    - 测试数量更新到 17 套 / 281
    - 设计文档链接改为 `.claude/Plan.md` / `.claude/AGENT.md`
  - `.claude/AGENT.md`：
    - §5.12 schema function token 一致性
    - §5.13 token / keyword 命中不返回 chain（statement-only）
    - §5.14 vitest agent 环境跑 pnpm 用 cmd.exe wrapper
  - `.claude/Plan.md`：
    - §五 当前状态：17 套 / 281 / 89+ 内建方法
    - §六 未做尾巴：标记 ✅ Batch 1-5 / 标记 **不做** W4.2 / W6.1 完整 / N8
    - §八 审计：B2 / B5 / C2 / C10 标 ✅ 修复
    - §九 决策日志：新增 5 条 Batch 1-5 决策记录
  - `CLAUDE.md`：状态 + 下一步候选刷新

  零代码改动。

## 0.3.0

### Minor Changes

- Phase 3 全量落地：新增 ComponentTokenRegistry / StyleProps / \_stack / \_grid / \_inspect / assertSchemaConsistency / createIcssInstance SSR wrapper / injectPreflight / registerCustomProperty / injectLayer / registerFont 等约 20 个 API。default schema 补 8 个 token category（duration / easing / breakpoint / zIndex / opacity / lineHeight / letterSpacing / aspectRatio）。bench 提升 21×（icss 19k → 404k ops/s）。测试 95 → 174。

  新增 API：
  - `ComponentTokenRegistry` declaration merging 注册槽 + `FlattenComponentTokens` 工具 + `withComponentTokens` 派生 helper
  - `StyleProps<T>` 类型 + `applyStyleProps(chain, props)` 运行时（30+ alias：color/bg/p/m/rounded/shadow/...）
  - `TokenOf<Cat, T>` 工具类型
  - 通用属性 variant：`_data` / `_aria` / `_has` / `_not` / `_is` / `_where`
  - 状态 variant：`_open` / `_closed` / `_loading` / `_inert` / `_forcedColors` / `_starting`
  - container query 简写：`_containerSm` / `_containerMd` 等
  - group / peer data 变种：`_groupData` / `_peerData` / `_groupAria` / `_peerAria`
  - Transform longhand：`_translate` / `_translateX/Y/Z` / `_rotate` / `_rotateX/Y/Z` / `_scale` / `_scaleX/Y/Z` / `_skew` / `_perspective` / `_transformOrigin` / `_preserve3d`
  - Filter / Backdrop helpers：`_filterBlur` / `_filterBrightness` 等共 18 个
  - Gradient helpers：`_linearGradient` / `_radialGradient` / `_conicGradient`
  - Pattern 库：`_stack` / `_grid` / `_aspectVideo/Square/Portrait/Landscape` / `_focusRing` / `_visuallyHidden` / `_fillParent` / `_skipLink`
  - Dev 工具：`_inspect({ format })` / `assertSchemaConsistency()`
  - SSR：`createIcssInstance(emotion)` 工厂返回完整工具集（icss / chain / cx / injectGlobal / ikeyframes / registerAnimation / injectPreflight / registerCustomProperty / injectLayer / injectLayerOrder / registerFont / extractCritical）

  性能优化：
  - `Theme.getKeymap()` 懒缓存（W4.1）：bench icss 19k → 404k ops/s（21× 提速）
  - `resolveTheme()` 末尾 `Object.freeze` 每个 category（V8 sealed class）

  类型系统：
  - `PropCarrier` / `ColorPropCarrier` 扩 `TExtraKeywords` slot
  - generator 接管 extra-keywords 扩展槽 + 校验 `_` 前缀
  - LENGTH_UNITS 从 16 扩到 30（容器查询单位 cqw/cqh/cqi/cqb/cqmin/cqmax + 动态视口单位 svw/lvw/dvw 等）
  - ENHANCED_PROPS 从 129 扩到 195（filter / tables / lists / SVG / scroll-snap / pointer / layout / blend / writing / columns / break / 现代 CSS 4 / counter）

  非破坏性 minor 升级：所有 0.2.x API 保留。
