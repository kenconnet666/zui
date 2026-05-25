# @kenconnet666/zui-vue

## Unreleased

### P0 工程债务清理 + T1.A introspect API(2026-05-25,P0.2-P0.10 + T1.A)

**核心动机**:配合 zui-core 新增 `resolveCarrier` introspect API,清理审计报告 P0 档
工程债务,提升一致性 + DX。

**新能力**(配合 zui-core 0.7.1):
- **`resolveCarrier(theme, prop, factory)`** 全局 helper(@kenconnet666/zui-core 新增)
- **`resolveColor(theme, factory, fallback)`** —— ui-vue 在 `_internal/color-bridge.ts`
  补的便利包装,SVG/canvas/ARIA 等"裸字符串"场景从 color factory 取最终色串
  (支持 token / `.alpha(N)` modifier / 字面量 / 字符串逃生舱)
- **ZProgress circle 模式 stroke 色**现在响应用户 `color` factory(原 TODO 解决)
- **color-bridge 新增** `applyAsStroke / applyAsFill / applyAsCaret` 3 个 carrier 桥接
- **虚拟列表家族新增 `rootRef` expose**(ZVirtualList / ZList / ZDataTable)

**BREAKING**:
- **`ZQRCode.size` → `ZQRCode.pixelSize`**:语义偏离(size 是 iem 倍率,QR 是物理 px),
  显式拆名。迁移:`<ZQRCode :size="160" />` → `<ZQRCode :pixel-size="160" />`
- **`ZSplit.size` / `update:size` → `ZSplit.ratio` / `update:ratio`**:size 是 iem 倍率,
  ZSplit 用比例(0~1)不是物理长度。迁移:`<ZSplit v-model:size="x" />` → `<ZSplit v-model:ratio="x" />`
- **删除冗余 `change` emit**(跟 `update:value` 完全等价):
  - ZSelect / ZTransfer / ZSegmented / ZSwitch / ZRate / ZCheckbox / ZDynamicTags
  - **保留 `change`**:ZInput / ZTextarea / ZInputNumber(blur 触发)/ ZSlider(mouseup)/
    ZDatePicker / ZTimePicker(面板关闭)/ ZCascader / ZTreeSelect(带额外参数 labels/node)/
    ZAnchor / ZTabs / ZPagination / ZUpload / ZCarousel(非 v-model 别名)

**优化**(非破坏):
- **ZCascader / ZTreeSelect `placeholder`** 默认从 `useZLocale('select').placeholder` 拿,
  不再硬编码 `'请选择'`(支持 i18n 切换)
- **ZSelect `'无匹配项'` → `useZLocale('select').noOptions`**
- **ZCard `#header` slot 加入**(`#head` 别名兼容,下版本删)
- **`console.warn` dev gate**(ZCode 加 `if (DEV)`,跟 core / 其他 hook 风格统一)
- **ZSteps `currentColor` cast 改走 `applyAsBg` helper**(禁止内联 cast 散落)
- **ZDynamicTags `setTimeout(fn, 0)` → `nextTick`**(Vue 原生 idiom)

**验证**:
- zui-core `640/640` ✓(+12 resolveCarrier spec)
- zui-vue 受影响 spec 全套 ✓ / type-check ✓ / build ✓
- 推迟到下一 sprint:**P0.1 usePopupTrigger hook**(8 个浮层组件去重,工作量 1-2 天,
  风险高,适合独立 sprint)

### BREAKING — vw-first 单位 + 虚拟列表全栈接入(2026-05-24,S0-S9)

**核心动机**:
1. **响应式默认**:`ZIemPreset.default` 改为 `'0.8333vw'`(5/6vw,= 16px @ 1920 屏),整站 vw 等比缩放,16:9 屏跨屏宽视觉一致。
2. **JS 算法层拿到 iem px 值**:虚拟列表 / 滚动计算等需要数值,以前要 DOM probe,现在 `useZIem()` 一行拿到响应式像素值。
3. **接入虚拟列表**:大数据组件(`ZList` / `ZDataTable` / `ZSelect` / `ZAutoComplete` / `ZMention` / `ZTransfer` / `ZTree` / `ZTreeSelect` / `ZCascader`)统一用 `ZVirtualList` 渲染长列表,数据量任意,DOM 恒定。

**BREAKING 详情**:

- **`ZIemPreset.default`**:`'16px'` → **`'0.8333vw'`**(响应式 5/6vw)
- **`ZIemPreset.large`**:`'20px'` → **`'1.0417vw'`**(同比例)
- **`ZIemPreset.compact`**:`'14px'` → **`'0.7292vw'`**(同比例)
- **`ZIemPreset.fixed`**:**新增** `'16px'`(opt-out 固定 px)
- **`ZIemPreset.em` / `.rem`**:**删除**(`<ZBox :iem>` 只接受 `px` / `vw` 字面或 number)
- **`<ZBox :iem>`**:类型收窄为 ``${number}px` | `${number}vw` | number``,非法值 dev 抛错 + 生产 fallback 16
- **`ZList` 重写**:`itemSize` `height` 必传(iem 倍数),内部走 ZVirtualList,**不再支持非虚拟模式**
- **`ZTree` 重写**:`height` 必传(iem 倍数),内部扁平化 + 虚拟
- **`ZSelect` / `ZAutoComplete` / `ZMention`**:浮层新增 `optionSize`/`dropdownMaxHeight` props(iem 倍数,默认 2/15)
- **`ZTransfer`**:新增 `itemSize`/`listHeight` props(iem 倍数,默认 2/15)
- **`ZCascader`**:新增 `optionSize`/`columnMaxHeight` props(iem 倍数,默认 2/17.5)
- **`ZTreeSelect`**:新增 `treeItemSize`/`treeHeight` props(iem 倍数,默认 2/18)

**新增**:

- **`useZIem(): Ref<number>`** —— 子组件取最近祖先 `ZBox` iem 当前像素值(响应式跟随 viewport resize / iem 切换)。`Z_IEM_PX_KEY` provide 自动响应式
- **`useZVirtualScroll<T>(opts)`** —— 通用虚拟滚动算法 hook(px 算法层,固定/可变行高、prefixSum + 二分、rAF 节流 + 大跨度同步、ResizeObserver autoMeasure、scrollToIndex)
- **`<ZVirtualList>`** —— 通用虚拟滚动列表组件(iem 对外、px 对内、scoped slot `{ item, index, size }` + `#empty` / `#header` / `#footer`)
- **`<ZDataTable>`** —— 数据表格(行虚拟 + sticky header + 列定义 + 单/多选 + 排序 + loading + 空态 + 斑马纹/边框)。`ZTable` 保留作简单展示场景

**执行 sprint**:
- **S0** 单位基础设施(ZIemPreset / ZBox 解析 / useZIem)
- **S1** ZVirtualList(iem 倍数对外,内部走 useZIem)
- **S2** ZList 重写
- **S3** ZDataTable 新建
- **S4** ZSelect 浮层接入
- **S5** ZAutoComplete + ZMention 接入
- **S6** ZTransfer 接入
- **S7** ZCascader 各级 panel 接入
- **S8** ZTree + ZTreeSelect 接入(已有扁平化算法,加 ZVirtualList 渲染)
- **S9** 总验证 + CHANGELOG

**验证**:
- zui-core `628/628` ✓
- zui-vue 全套 spec `655/655` ✓(53 文件)
- type-check ✓ / build ✓

---

### BREAKING — 数值尺寸 props 从 chain factory 改 `number`(iem 倍数)(2026-05-24,R0-R11)

撤销 B5 的"size 全 factory"决策(数值类),改为**数字 = iem 倍数**,组件内能读到数值后按比例算所有相关维度,全维度走 iem(Provider 联动)。其他类型 prop(color / variant / direction / css 等)保持 chain factory 不变。

详见 `.claude/decisions/2026-05-24-size-prop-number-iem.md`。

**核心动机**:chain factory 是黑盒 callback,组件无法读取用户写入的具体数值 → 无法按比例算其他维度 → "整体保持比例" 无法实现。改 `number` 解决。

**用户接口对比**:
```vue
<!-- 旧 -->
<ZButton :size="BUTTON_SIZE_MAP.middle" />
<ZIcon :size="(w) => w.iem(1.5)" />
<ZModal :width="(w) => w.iem(40)" />

<!-- 新 -->
<ZButton :size="1" />          <!-- size=1 → fontSize 1iem,height 2iem,padding 0.5/1iem 等比缩 -->
<ZIcon :size="1.5" />           <!-- 1.5iem 正方形 -->
<ZModal :width="40" />          <!-- 40iem = 640px @ 1080p -->

<!-- 非 iem 单位走 css 兜底 -->
<ZButton :size="1" :css="(s) => { s.height.vh(5) }" />
```

**改造批次**:
- **R0**:写 ADR + 更新 `.claude/skills/zui.md §13.0`
- **R1**:删 `_internal/size-prop.ts` + `_internal/component-sizes.ts` + 所有组件内 `*_SIZE_MAP`(13+ 处);新建 `_internal/input-size.ts` helper(`applyInputSize` / `applyInputSizeNoHeight`)
- **R2-R7**:~40 组件改造(A 文字 8 / B 盒子 4 / C 输入 10 / D 按钮 2 / E 容器 8 / F 特殊 8)
- **R8 1080p 尺寸合理性 audit**:对照 antd / arco / naive,调整 5 个组件默认值
  - ZTooltip maxWidth 20 → 16(对齐 antd 250px)
  - ZTour minWidth/maxWidth 15/22.5 → 20/32(对齐 antd panelWidth 520)
  - ZProgress circle 6 → 7.5(对齐 antd 120px)
  - ZPagination itemSize size*1.75 → size*2(对齐 antd 32×32)
  - ZDrawer size 20 → 24(对齐 antd 378)
- **R9 JSDoc 盒子图全更新**:~40 组件 `defineProps` 上一行完整嵌套图,标 number iem 倍数 + 内部相对公式 + 1080p px 参考
- **R10 spec 修复**:200+ 处 `:size="(w) => w.iem(N)"` → `:size="N"`,删 `tests/size-prop.spec.ts`
- **R11**:三件套全绿(type-check ✓ / 548 tests ✓ / build ✓)

**不撤销的 B5 决策**:颜色 / 布局方向 / variant 字面量内联 / 视觉变体 / 复合 wire / css 兜底 等保持 chain factory。

### 改进 — sx 透传完善:SxObject 加 ref + 类型放宽 + 根 DOM 暴露(2026-05-24,U1-U4)

**4 类改动**:

#### U1 — `_internal/sx.ts` 扩展 SxObject

- 加 `ref?: VNodeRef`(template ref,让用户拿到子节点 DOM)
- 类型放宽:`& Record<string, unknown>` 兜底任意自定义 attr(`data-*` / 第三方库自定义属性等)
- `extractSxAttrs` 返回值多 `ref` 字段

#### U2 — 23 个组件的 sx 子节点 template 加 `:ref` 绑定(~62 处)

所有 sxXxxAttrs 使用处加 `:ref="sxXxxAttrs.ref"`:

ZCard / ZPopover / ZTable / ZTooltip / ZAlert / ZDrawer / ZModal / ZSpin / ZButton / ZTag / ZCheckbox / ZFormItem / ZInput / ZInputNumber / ZRadio / ZSelect / ZSwitch / ZTextarea / ZBreadcrumb / ZDropdown / ZMenu / ZPagination / ZTabs

**冲突处理 — 8 个 bindXxx helper**:子节点已有内部 ref(`triggerRef` / `inputRef` 等)的,合并用户 `sx*.ref` + 内部 ref 到一个函数 ref:
- ZModal/ZDrawer `bindMask`
- ZTooltip/ZPopover `bindTrigger` + `bindFloating`
- ZInput `bindInput` / ZTextarea `bindTextarea` / ZSelect `bindRoot` + `bindDropdown`
- ZDropdown `bindMenu` / ZTabs `bindList`

#### U3 — 12 个组件 `defineExpose({ rootRef })`

让用户用 `<ZComp ref="r">` → `r.rootRef` 拿到根 DOM:

| 组件 | 根元素 | rootRef 类型 |
|---|---|---|
| ZModal / ZDrawer | mask `<div>` | `HTMLElement \| null` |
| ZInput / ZTextarea / ZMention | wrapper `<div>` | `HTMLDivElement \| null` |
| ZSelect / ZTreeSelect / ZCascader | trigger `<div>` | `HTMLDivElement \| null` |
| ZAutoComplete | `<input>` 根 | `HTMLInputElement \| null` |
| ZTabs | tablist `<div>` | `HTMLDivElement \| null` |
| ZForm | `<form>` | `HTMLFormElement \| null`(合并 `validate` / `reset`) |
| ZFormItem | `<div>` | `HTMLDivElement \| null`(合并 `validate` / `reset`) |

跟内部 `triggerRef` / `inputRef` 共享 DOM 的组件用 `bindRoot` function ref 同时回填两侧。

#### U4 — 验证三件套

- type-check ✓ (vue-tsc exit 0)
- 556/556 tests ✓
- build ✓

**已知限制**:v-for 内子节点的 `sx*.ref` 共享同一 ref(每次循环覆盖,最终只持有最后一个 element)。用户在 v-for 内拿子节点应自己用函数 ref 收集所有节点 — 这是 sx 字段语义的固有限制。

---

### 改进 — 默认值审计 + 盒子图 JSDoc 迁移 + helper className 规范化(2026-05-24,T1-T3 + Q4-Q5 + B9)

**5 类改动**:

#### T1 — withDefaults Function 类型 default 修 double-wrap(3 处)
ZModal `width` / ZBackTop `right / bottom` 之前用 `() => (w) => {...}` double-wrap,改成 ZIcon 范式直接给函数:`(w) => {...}`。

#### T2 — helper className 整理(27 处,22 文件)
- **5 个零参数 helper** → `computed`(`ZSteps.stepClass / ZTimeline.itemClass / lineClass / ZMessage.bodyClass / ZNotification.itemClass`),template 改 `xxx` 裸名调用
- **22 个有参数 helper** → `const xxx = (...args): string => icss(...)` 箭头风格(跟 computed 形式一致),调用方式不变

#### T3 — ZSlider 性能优化(CSS var 注入)
拖动时 `percent.value` 内嵌 `linear-gradient` 字符串 → 每帧重新生成 className(性能差)。改:
- `inputClass` 不依赖 percent,用 `var(--zui-slider-fill / track / bg / percent)`
- `inputStyle` computed 注入 CSS var 到 `:style`
- 结果:**className 稳定,只更新 inline style CSS var**,拖动零 className 重生成

#### Q4 — 默认值审计 + 补全(12 个组件)
把藏在 className computed 里 `if (props.color) ...; else <token>` 隐式 fallback 提到 `withDefaults` 显式声明:

| 组件 | Prop | 默认 factory |
|---|---|---|
| ZAlert | color | `(c) => c._info` |
| ZAvatar | color | `(c) => c._textSecondary`(桥接 bg) |
| ZBadge | color | `(c) => c._danger`(桥接 bg) |
| ZBlockquote | color | `(c) => c._primary`(桥接 border-l) |
| ZCode | color | `(c) => c._text` |
| ZDivider | color | `(c) => c._border` |
| ZRate | color | `(c) => c._warning` |
| ZResult | color | `(c) => c._info` |
| ZSpace | size / align | `(g) => g._small` / `(c) => c.center` |
| ZSpacer | basis | `(b) => b.auto` |
| ZStatistic | color | `(c) => c._text` |
| ZSteps | currentColor | `(c) => c._primary` |

**保留隐式 fallback**(合理):ZButton variant state layer 桥接;ZProgress `applyAsBg` 区分 user/默认色源切换;item 数据 prop(ZMessage / ZNotification / ZTimeline `item.color`);ZSlider inline 读 theme;ZImage `fit` 字面量枚举。

#### Q5 — 盒子图 JSDoc 迁移 + 画完整嵌套图(43 个组件)
- **位置统一**:所有 iem 默认尺寸组件的盒子图 JSDoc 集中到 `withDefaults / defineProps` 上一行(IDE hover defineProps 时一眼看到完整结构)
- **形式**:box-drawing ASCII 完整嵌套图(`┌┐└┘─│`),标注节点尺寸 + 关键属性
- **清理**:删除 B2 阶段散落在 computed 上的 30 处旧盒子注释
- **范围**:gene(4)+ display(12)+ feedback(7)+ input(13)+ navigation(5)+ tool(2)= 43 个组件
- **不画**:布局组件(ZFlex / ZGrid / ZSpace / ZSplit / ZSpacer / ZScrollbar / ZAffix)— 无固定尺寸

#### B9 — 验证三件套全绿
- type-check ✓ (vue-tsc exit 0)
- 556/556 tests ✓ (50/50 spec files)
- build ✓ (exit 0,218 modules,dist/zui-vue.css 不再生成)

---

### BREAKING — props 全 chain factory 化(2026-05-23 / 2026-05-24,B0-B8 八批改造)

撤销 2026-05-22 的 `factory | Size5 | undefined` union 范式,改为**纯 chain factory**。详见
`.claude/decisions/2026-05-23-prop-shape-pure-factory.md`。

**5 种 prop 形态**:
- **Type A** 单属性 factory:`color?: ((c) => void)` → `s.color(props.color)`
- **Type B** 复合 wire factory(关键参数 expose):如 `spin?: ((d: AnimationDuration) => void)` →
  启用即自动 wire `animationName / iterationCount / timingFunction`,用户只控速度
- **Type C** 一对多 factory:如 `size?: ((w: Width) => void)` → `s.width(factory); s.height(factory)`
- **Type V** variant 字符串字面量(内联,不导出独立 type alias):`variant?: 'filled' | 'outlined'`
- **Type N** 保留形态:真二态 boolean / JS 逻辑字符串(`trigger`)/ 原生 HTML 属性 / 第三方继承类型

**禁忌**(违反必改):
- ❌ 字符串枚举 MAP 翻译(`justify='between' → 'space-between'`)
- ❌ 组件 size 字面量枚举(`size?: 'small' | 'middle' | 'large'`)
- ❌ 颜色/语义字面量(`color?: 'primary' | 'danger'`)
- ❌ 自定义命名空间字符串(`placement?: 'top-right'`,非 floating-ui 标准)
- ❌ `export type ZXxxVariant = '...'` 单独 type alias(内联到 props interface)

**改造分批**(8 批):
- **B0**:写 `.claude/decisions/2026-05-23-prop-shape-pure-factory.md` 决策文档 + `.claude/skills/zui.md §13.0` 总纲更新 + `zui-vue-roadmap.md` L16 引用
- **B1**:验证 chain `PropFn` 接 factory 重载(`tests/chain-factory-prop.spec.ts` 6/6)
- **B2**:补 ~25 处 iem 盒子模型 JSDoc(只写 iem,不写 px,因 iem 由 Provider 控制)
- **B3**:删 8 个 type alias 内联(ZButtonVariant / ZTabsType / ZTagVariant / ZProgressType /
  ZDrawerPlacement / ZDropdownTrigger / ZPopoverTrigger / ZTooltipTrigger);ZAvatar `shape: 'circle' | 'square'` → `square?: boolean`
- **B4**:Layout enum → factory(ZFlex / ZGrid / ZSpace 的 direction/wrap/justify/align/justifyItems/alignItems);ZRadioGroup / ZCheckboxGroup direction → factory;ZSteps `direction` → `vertical?: boolean`;ZMenu `mode` 拆 `vertical?: boolean` + `inline?: boolean`;ZDivider `orientation` → `vertical?: boolean`
- **B5**:size 字面量全去除 → 纯 factory(`_internal/size-prop.ts` 简化 `applySizeProp(size, target)` 两参签名;ZIcon / ZAvatar / ZSegmented / ZSwitch / ZRate / ZSpin / ZButton / ZTag / ZDrawer / ZProgress / ZPagination / ZInput / ZTextarea / ZInputNumber / ZSelect / ZAutoComplete / ZTreeSelect / ZDatePicker / ZTimePicker / ZList / ZDescriptions / ZTable 全部走 default factory)
- **B6**:type/status 业务语义 → `color?: factory` + slot/icon(ZAlert / ZMessage(`item.color` + `icon` + `loading`)/ ZNotification(同 ZMessage)/ ZResult(+ `notFound?: boolean`)/ ZProgress(删 status)/ ZSteps(`currentColor?: factory` + `errored?: boolean`)/ ZTimeline `item.color?: factory`);messageApi / notificationApi 内部 wrap 语义保持 happy path API
- **B7**:ZImage `fit / width / height` → factory;ZScrollbar `maxHeight` → factory;ZModal `width` → factory;ZBackTop `right / bottom` → factory;`_typography-base.ts` `underline?: 'always' | 'hover' | 'none'` → 拆 `underline?: boolean` + `underlineOnHover?: boolean`(ZLink 默认 `underlineOnHover=true`)
- **B8**:CHANGELOG + roadmap 进度日志 + 三件套全绿(type-check ✓ / 556 tests ✓ / build ✓)

**新 vs 旧用法对比**:
```vue
<!-- 旧 -->
<ZFlex justify="between" align="center" :gap="(g) => g._middle">
<ZIcon size="middle" :color="(c) => c._primary" />
<ZAlert type="success">操作成功</ZAlert>
<ZButton size="large" variant="filled">提交</ZButton>

<!-- 新 -->
<ZFlex :justify="(j) => j.spaceBetween" :align="(a) => a.center" :gap="(g) => g._middle">
<ZIcon :size="(w) => w.iem(1.25)" :color="(c) => c._primary" />
<ZAlert :color="(c) => c._success">
  <template #icon><ZIcon :component="BuiltinIcons.success" /></template>
  操作成功
</ZAlert>
<ZButton :size="BUTTON_SIZE_MAP.large" variant="filled">提交</ZButton>
```

**验证**(2026-05-24):
- type-check ✓ (exit 0)
- 556/556 tests ✓ (50/50 spec files)
- build ✓ (exit 0,218 modules,dist/zui-vue.css 不再生成)

### 改进 — `s._prop(...)` 调用大规模替换为强类型 chain carrier 写法(2026-05-23)

全库 75 个文件 / 382 处 `s._prop('propName', 'value')` 调用,**98.95% 替换**为强类型 chain
写法,剩 4 处合理保留(动态 prop 名 / CSS custom property)。

**替换策略**:
- **keyword 类**(`overflow.hidden` / `position.relative` / `textAlign.center` / `cursor.notAllowed`
  / `whiteSpace.nowrap` / `textOverflow.ellipsis` / `flexDirection.column` 等):直接 `s.prop.keyword`
- **长度类**:`'calc(N * var(--zui-iem, 16px))'` → `s.prop.iem(N)`;`'Npx'`(`N` 为 iem 倍数,如 8/16/24/32)
  → `s.prop.iem(N/16)`;`'100%'` → `s.prop.pct(100)`
- **位置类**(`top` / `left` / `right` / `bottom` / `inset`):`'0'` → `.px(0)`;`'50%'` → `.pct(50)`;
  `'24px'` → `.iem(1.5)`
- **复合 outline / borderTop 拆分**:`outline: '1px solid'` → `outlineWidth.px(1) + outlineStyle.solid`;
  `borderTop: '1px solid var(--zui-color-border)'` → `borderTopWidth.px(1) + borderTopStyle.solid +
  borderTopColor._border`
- **transform / gridTemplateColumns / animation 等**:不在 ENHANCED_PROPS 但走 PropFn 函数调用,
  `s._prop('transform', '...')` → `s.transform('...')`
- **textDecoration**:简写组件保 `s.textDecoration('underline')`(ZButton link 需要),其它走
  `s.textDecorationLine('underline')`

**iem 化收益**:所有"calc(N * iem)"字面量改纯 chain `.iem(N)`,跟 `<ZBox :iem>` 全站缩放联动更稳。
1080p / iem=16px 基准下各组件物理尺寸完全对齐:
- ZInput middle = padding-y 6px + fontSize 16px ≈ 32px 高
- ZButton middle ≈ 32-36px 高
- ZAvatar middle = 40px(iem 2.5)
- ZModal default width = 480px(iem 30,占 1080p 25%)
- ZDrawer middle = 320px(iem 20)
- ZTooltip maxWidth = 320px(iem 20)
- ZNotification maxWidth = 360px(iem 22.5)
- ZPagination button(middle)= 28px(iem 1.75)

**搭车修复**:
- ZCascader column `:last-child` 边框去除 —— 原 `s._prop('lastChild', '')` 无效写法,改 `s._lastChild((c) => c.borderRightStyle.none)`
- ZSlider linear-gradient background 改 `s.background('...')` PropFn
- ZTag/ZAvatar `borderRadius` ternary 字符串拆 if/else chain(`borderRadius._full` vs `.iem(0.25)`)
- ZTimeline 时间线竖线位置 `calc(0.3125 * iem - 1px)` 重构为纯 iem 表达(线宽 0.125iem / 位置 0.25iem)
- ZModal `maxHeight: calc(100vh - 32px)` 改 `calc(100vh - calc(2 * var(--zui-iem, 16px)))` 跟 iem 联动
- ZSwitch / ZNotification 动态 left/right 拆 if/else chain(原 `_prop(side, '24px')` 动态 prop 名)
- ZCarousel arrow position / dot indicator 用 chain iem 化
- ZButton focus-visible outline 走 chain(`outlineWidth._middle` / `outlineStyle.solid` / `outlineOffset.px(2)`)

**保留 _prop 的 4 处**(全部合理):
- `ZGrid` 2 处 —— `s._prop(prop, ...)` prop 名是动态变量(gridTemplateColumns / gridTemplateRows)
- `ZSlider` 2 处 —— `--zui-slider-thumb-*` CSS custom property,chain 无对应 carrier

**验证**:type-check ✓ / 全库 540+ tests 全绿(详见进度日志)

---

### BREAKING — props 形态统一为 `factory | Size5 | undefined` union(2026-05-22 修订)

撤销 roadmap §1 L15 + skill §13.0 ① "chain factory only" 锁定决策。承认实际现状:
大部分组件偷偷回退到枚举档位,新方案正式统一为 union。

**决策文档**:`.claude/decisions/2026-05-22-prop-shape-union.md`

**新基础设施**:
- `src/_internal/size-prop.ts`:`Size5` / `SizeProp<K>` / `SizePropMulti` / `SizeMap<T>`
  类型 + `applySizeProp` / `makeSizeMap` helper(3 阶 → 5 阶自动 fallback)
- `src/_internal/component-sizes.ts`:`INPUT_SIZE_MAP`(输入框尺寸:fontSize +
  padding-y,8 组件共享)+ `COMPACT_PADDING_MAP`(列表/卡片紧凑 padding)

**改造组件清单**(共 25 个 SFC):

- **gene**:ZIcon(默认 `size: 'small'` 保兼容)/ ZText / ZTitle / ZParagraph / ZLink(共享 `_typography-base.ts` 升级)/ ZSpace / ZAvatar(**BREAKING:`number` 字面量移除**,改 `(w) => w.px(N)`)/ ZTag / ZSegmented / ZButton
- **input**:ZInput / ZInputNumber / ZSelect / ZAutoComplete / ZDatePicker / ZTimePicker / ZTreeSelect(8 个复用 INPUT_SIZE_MAP)/ ZSwitch(rail size 5 阶,iem 联动)/ ZRate(star size 5 阶)/ ZFormItem(**新增 `sxControl` 节点**)
- **feedback**:ZSpin / ZDrawer(`size` 支持 `Size5` 字符串 → iem 映射:tiny=8iem / small=12iem / middle=20iem / large=28iem / huge=40iem)
- **display**:ZProgress / ZList / ZDescriptions / ZTable
- **navigation**:ZPagination

**搭车技术债务修复**:
- ZPopconfirm:删除错误的 `aria-modal="false"`(W3C 规范:Popconfirm 不是模态,该属性不应设置)
- ZInput:删除 dead code `useSlots` 未使用 import
- ZTable / ZTreeSelect:修复 `s.color('_primary')` / `s.borderColor('_primary')` 字符串调用 bug(carrier 不接字符串 token)

**兼容性**:
- `<ZInput size="middle">` / `<ZIcon :size="(w) => w.iem(1)">` 等所有 happy path 不变
- ZAvatar `:size="number"` 是唯一 BREAKING:改 `:size="(w) => w.px(N)"`
- 5 阶档位新增 `tiny` / `huge`(原 3 阶组件)— 不实现的档位自动 fallback 到最近实现(`tiny → small`, `huge → large`)
- 视觉变化:ZProgress / ZPagination 等新加的 tiny/huge 档位(原仅 3 阶)

---

### 🎉 Phase α/β/γ 全部完成 — 80+ 组件 / 540 tests / 全绿

roadmap §7(Phase β)+ §8(Phase γ)全部交付,Stage 9(Phase δ:VirtualList / 富文本 /
DataGrid 企业版 / Schema-driven Form)按需开。

**新组件清单**(本次 commit `e639b0b` 收尾):
- `ZTreeSelect`(input):ZTree 嵌入下拉,叶子选中自动 close
- `ZTour`(feedback):新手引导,steps 配置 + 4 边 mask 挖洞 + 引导卡片
- `ZTable` 升级:`column.sortable` + `v-model:sortState`(asc/desc/none toggle) +
  `selectable` + `v-model:selectedKeys`(全选/单选,含 indeterminate) + `aria-sort`
- `ZSelect` 升级:`multiple` prop + 多选 toggle + `aria-multiselectable` + 多选 clearable

**技术债务批 2(commit `b9ae101`)**:
- `qrcode` 从 dependencies 移到 peerDependencies + peerDependenciesMeta.optional(业务方按需装)
- ZCollapse / ZTransfer / ZNotification / ZMessage:reactive `Set`/`Map` → `array` / 闭包 `Map`
  (规避 Vue test-utils "Invalid value used as weak map key" 边界)
- 新建 `_internal/color-bridge.ts`:`applyAsBg` / `applyAsBorder` / `applyAsOutline` / `getThemeColor`
  helper,统一替代散落 `as unknown as BgFactory` cast(影响 ZButton / ZTag / ZProgress /
  ZGradientText / ZSlider)
- 清理 dead code:`void h` / `void type` 等遗留标记

测试 17 新 case(`z-phase-beta-upgrades.spec`,总 523 → 540 全绿)。

---

### 新增 — Phase β 浮层批(`ZTooltip` / `ZPopover` / `ZDrawer`)

Stage 7 第二批,基于已有 hooks(`usePopper` / `useEscapeStack`)+ Teleport:

- **`ZTooltip`**(display)—— 悬停提示。`content` prop 或 `#content` slot。`placement`(floating-ui)+
  `trigger`(`'hover'` / `'click'` / `'focus'` / `'manual'`,默认 hover)+ `delay`(hover enter/leave ms,默认 100)+
  `visible`(manual 受控)+ `disabled`(总是阻止显示,覆盖 manual mode)。aria `role="tooltip"` +
  trigger 上 `aria-describedby`。深色背景(`_text` bg + `_bg` 文字)。
- **`ZPopover`**(display)—— 弹出层(类 Tooltip 但富内容)。`title` + `#content` slot。
  `trigger`(`'click'`(默认) / `'hover'` / `'manual'`)。**onClickOutside**(`@vueuse/core`)外部
  点击关闭 + **useEscapeStack** ESC 关闭。`role="dialog"`。浅色背景 + 边框 + middle elevation。
- **`ZDrawer`**(feedback)—— 抽屉。`v-model:visible` + `placement`(`'left'` / `'right'` /
  `'top'` / `'bottom'`,默认 right)+ `size`(string|number,默认 320px)+ `title` /
  `closable` / `maskClosable`。body scroll lock + useEscapeStack ESC 关。
  4 sx 节点:sxMask / sxDrawer / sxHead / sxBody / sxFoot。

测试 15 case(总 381 → 396 全绿)。

**实现细节**:
- Teleport 渲染 portal 到 body,跨 spec 测试需 wrapper.unmount() + 显式清理 DOM portal 残留
- ZTooltip:`disabled` 必须在所有 trigger 模式下都阻止显示(包括 manual 受控),否则有逻辑漏洞

---

### 新增 — Phase β gene 补全(P1 装饰类 6 组件)

Stage 7 第一批:

- **`ZAvatar`** —— 头像。优先级:default slot > `src`(图)> `text`(首字母)> 默认占位。
  `size`(number 按 px / `small`(2iem) / `middle`(2.5iem) / `large`(3iem))/ `shape`(circle/square)/
  `color` carrier factory(文字模式背景)/ `alt`(无障碍)。`role="img"` + `aria-label`。
  图片 `onerror` 自动 fallback 到 text。
- **`ZTag`** —— 标签。`color` carrier(默认 `_textSecondary`)+ `variant`(`'filled'` / `'outlined'` /
  `'soft'`)+ `size`(small/middle/large)+ `closable`(emit close)+ `round`(胶囊形)。
  sx:sxClose。
- **`ZBadge`** —— 徽标。`value`(数字/字符串)+ `dot`(红点模式)+ `max`(超出显 `${max}+`,默认 99)+
  `showZero` + `offset: [x, y]` + `color` carrier(默认 `_danger`)。
  有 default slot → 浮挂子元素右上角(absolute + translate);无 slot → inline 显徽标本身。
- **`ZCode`** —— 行内/块级代码。`inline=true` → `<code>` 行内;`inline=false` → `<pre><code>` 块级。
  字体走 `fonts._mono`,背景 `_bgMuted` + 边框 `_border`。
- **`ZBlockquote`** —— `<blockquote>` 块引用,左侧 4px `currentColor` border。`color` carrier 默认 `_primary`。
- **`ZEllipsis`** —— 受控省略。`lines: number`(1=单行 / N>1=多行 `-webkit-line-clamp:N`) + `tag`。
  跟 `ZText :ellipsis` 区别:独立组件可在任意位置包一层,不污染父级。

测试 23 case(总 358 → 381 全绿)。

**实现细节**:emotion CSS-in-JS 中 `-webkit-` 前缀属性需用 **PascalCase**(`WebkitLineClamp`,
**不是** `webkitLineClamp`),否则 emit 出 `webkit-line-clamp` 而非 `-webkit-line-clamp`(失效)。

---

### 新增 — `ZTable` + `ZButton`,Phase α 收尾(P0 全套完成)

Stage 6.5 + 6.6:

- **`ZTable`**(display)—— 基础表格(配置式)。`columns: Array<{ key, title, dataIndex?, width?,
  align?, render? }>` + `data` + `rowKey`(string 或函数)+ `bordered` / `striped` / `size` /
  `emptyText`。column.render 函数返回 VNode 自定义渲染。空数据走 `emptyText` 占位行。
  sx:sxHead / sxBody / sxRow / sxCell。
  **未实现(Phase β)**:排序 / 选择(checkbox)/ 分页接入 / 列冻结 / expandable rows。
- **`ZButton`**(gene)—— Material 风按钮。
  - 5 variant:`filled`(实心) / `outlined`(描边) / `text`(文字) / `ghost`(半透明) / `link`(链接)
  - `color` carrier factory(默认 `_primary`,挂 `currentColor` 给 variant 派生)
  - 状态:`loading`(显 `BuiltinIcons.refresh` + spin,`aria-busy`)、`disabled`、`block`(width 100%)
  - `prefixIcon` / `suffixIcon` slot
  - **`useRipple` Material 波纹**(默认开启,`:ripple="false"` 关)
  - **`:focus-visible` outline ring**(2px `_focusRing.alpha(40)` + 2px outset)
  - state layer:默认 color 时 hover/active 走 `_primary.alpha(8/12)`;user color 时跳过(chain
    modifier 限制,后续 phase 用 `::before` 伪元素 layer 解决)
  - sx:sxIcon / sxRipple

测试 28 case(z-table 9 + z-button 19;总 330 → 358 全绿)。

### 🎉 Phase α 收尾(21 个 P0 组件)

`Stage 6.1 → 6.6` 全部完成。21 个 P0 组件分类:

```
layout       ZFlex / ZGrid / ZSpace / ZSpacer
gene         ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZDivider / ZButton + BuiltinIcons
feedback     ZAlert / ZSpin / ZModal / ZMessage + createMessageApi()
display      ZCard / ZTable
input        ZInput / ZTextarea / ZInputNumber / ZSwitch / ZCheckbox+Group / ZRadio+Group /
             ZSelect / ZForm + ZFormItem
navigation   ZBreadcrumb / ZPagination / ZTabs / ZMenu
hooks (_hooks/) useZId / usePortal + ZPortal / useEscapeStack / usePopper / useRipple
```

类型 + 测试:type-check 0 error,**tests 358/358 pass**,build OK。

决策文档:`.claude/decisions/2026-05-23-stage6_6-zbutton-and-phase-alpha.md`(含 ZButton API 细节 +
Phase α 全套清单 + 视觉验收清单)。

下一步建议:用户优先级 sync 后进入 **Phase β / P1**(高频补全:ZAvatar / ZTag / ZBadge / ZTooltip /
ZPopover / ZDropdown / ZDrawer / ZNotification / ZDatePicker / ZSlider 等),或先在 `packages/docs`
写 ButtonPage / FormPage / TablePage 视觉验收。

---

### 新增 — 导航(`navigation/`,P0)

Stage 6.4:

- **`ZBreadcrumb`** —— 面包屑。`items: [{ label, href?, onClick? }]` 配置式渲染,默认分隔符 `'/'`(可自定义)。
  `<nav aria-label="breadcrumb">` + 最后一项 `aria-current="page"`。sx:sxItem / sxSeparator。
- **`ZPagination`** —— 分页器。`v-model:page` + `total` / `pageSize` / `siblings`(当前页 ±N) /
  `showTotal` / `disabled` / `size`。算法 always 显示首末 + 当前 ±siblings + 省略号。
  文案走 `locale.pagination`(`prev` / `next` / `total`)。`aria-label="pagination"` + 当前页
  `aria-current="page"`。sx:sxItem。
- **`ZTabs`** —— 标签页。`v-model:value` + `tabs: [{ name, label, disabled?, closable? }]` + `type`
  (`'line'` / `'card'` / `'segment'`)+ `closable` / `addable` / `disabled`。`role="tablist"` / `tab`
  / `tabpanel`。emit:`update:value` / `change` / `add` / `close(name)`。slot default 接 `activeName`。
  sx:sxList / sxTab / sxPanel。
- **`ZMenu`** —— 菜单。`v-model:value` + `items` 树形(`children` 表示 submenu) + `mode`
  (vertical/horizontal/inline)+ `collapsed`(折叠只显 icon)+ `disabled`。submenu 内联展开
  (`aria-expanded` 切换),`role="menu"` / `menuitem`。sx:sxItem / sxSubmenu / sxLabel。
  **Phase β 未实现**:popup-style submenu(本 v1 仅 inline expand)。

测试 29 case(总 301 → 330 全绿)。

---

### 新增 — 数据录入第二批 `ZSelect` / `ZForm` / `ZFormItem`(P0)

Stage 6.3 收尾:

- **`ZSelect`** —— 单选下拉。`v-model:value` + `options` 数组(`{ value, label, disabled? }`) + `placeholder` /
  `clearable` / `filterable`(输入框过滤) / `disabled` / `size`(small/middle/large)。
  实现走 `usePopper`(`@floating-ui/vue` `offset+flip+shift`)+ `<Teleport to="body">` 避开 overflow 截断 +
  `onClickOutside`(`@vueuse/core`)外部点击关闭 + `useEscapeStack` ESC 关闭。`role="combobox" /
  aria-expanded`,下拉 `role="listbox"`,选项 `role="option"`。
  sx:sxTrigger / sxDropdown / sxOption。
  **Phase β 未实现**:多选 / 远程搜索 / 分组。
- **`ZForm` + `ZFormItem`** —— 表单 + 字段项,基于 `async-validator`(peerDep)。
  - `ZForm`:`model`(reactive 对象) / `rules`(全表 rules 字典) / `labelPlacement`(top/left) /
    `validateTrigger`(change/blur/submit) / `disabled`。`defineExpose` `validate(): Promise<void>` /
    `reset(): void`。
  - `ZFormItem`:`prop`(字段名) / `label` / `rule`(单字段规则) / `required`(`*` 标记 + 必填 rule) /
    `validateTrigger`(覆盖 form 级) / `labelWidth`。slot:default(control) / label / error。
    通过 provide/inject 共享 form ctx。`change` 触发自动校验。失败时渲染 `role="alert"` 错误。
  - 字段 rule 解析顺序:`required` 标记 → `rule` 单字段 → `form.rules[prop]`。

测试 17 case(z-select 10 + z-form 7;总 284 → 301 全绿)。

---

### 新增 — 数据录入(`input/`,P0 第一批)

Stage 6.3 第一批,基础录入 6 个组件:

- **`ZInput`** —— 文本输入。`v-model:value` + `type` / `size`(small/middle/large) / `disabled` / `readonly` /
  `clearable` / `showCount` / `maxlength` / `placeholder` / `autofocus` + slot:prefix / suffix。
  sx:sxInput / sxPrefix / sxSuffix / sxClear。emit:`update:value` / `change` / `focus` / `blur` /
  `clear` / `pressEnter`。聚焦时 border 走 `_primary` + `boxShadow._tiny`。
- **`ZTextarea`** —— 多行输入。`v-model:value` + `rows` / `autosize`(动态高度,受 `maxRows` 限) /
  `placeholder` / `disabled` / `readonly` / `maxlength` / `showCount`。sx:sxTextarea。
- **`ZInputNumber`** —— 数字输入(上下增减按钮)。`v-model:value`(`number | null`) + `step` / `min` /
  `max` / `precision`(`toFixed` 小数位) / `disabled` / `readonly` / `size`。空字符串 → `null`。
- **`ZSwitch`** —— 开关。`v-model:value`(boolean) + `size` / `disabled` / `loading` / `checkedLabel` /
  `uncheckedLabel`。`role="switch"` + `aria-checked` + 键盘 Space 切换。M3 圆形 thumb + 滑入动画。
- **`ZCheckbox`** + **`ZCheckboxGroup`** —— 复选框组(provide/inject 共享 ctx)。Group `v-model:value`
  是 `(string|number|boolean)[]`。子项可单独 `v-model:checked` 或进 Group。支持 `indeterminate`
  (aria-checked=mixed)。Group `options` 数组快捷渲染 / 自定义 slot;`direction` horizontal/vertical。
- **`ZRadio`** + **`ZRadioGroup`** —— 单选组。Group `v-model:value` + `buttonStyle`(按钮组形态)。
  `options` 数组快捷渲染。`role="radiogroup"`,子项 `role="radio"`(button 模式时)。

测试 41 case(原 243 + 41 = 284 全绿)。

**Stage 6.3 未完成**:ZSelect / ZForm + ZFormItem 留在 Stage 6.3 第二批。

---

### 新增 — 反馈+展示基础(`feedback/` + `display/`,P0)

Stage 6.2 P0 反馈与展示组件:

- **`ZAlert`**(feedback)—— 警示横幅。`type`(info/success/warning/danger,各取 schema 语义色 + alpha 8 背景)/
  `title` / `description` / `showIcon`(走 `BuiltinIcons.{info|success|warning|error}`)/ `closable`
  (`emit close`)/ slots: head/icon/title/description/default/closeIcon / sx: sxIcon/sxBody/sxClose。
- **`ZSpin`**(feedback)—— 加载指示器。两种模式:
  - 包裹模式(有 default slot)→ overlay 浮层覆盖 + indicator 居中 + 可选 `tip` 文字
  - 纯 indicator 模式(无 slot)→ inline-flex 单独显示
  默认 indicator = `BuiltinIcons.refresh` + `spin: (d) => d.s(1)` + `iem` size 跟 `size` 档位。
  sx:sxOverlay / sxIndicator。
- **`ZCard`**(display)—— 三节点卡片。slots: head(`#head` 优先于 `title`)/ extra / default / foot。
  `bordered`(默认 true → 边框)/ `bordered=false`(走 M3 shadow)/ `hoverable`(transition + shadow 加深)。
  sx:sxHead / sxBody / sxFoot。
- **`ZModal`**(feedback)—— Portal 对话框。`v-model:visible` + Teleport + `useEscapeStack` + body scroll lock。
  `title` / `width`(string|number) / `centered` / `closable` / `maskClosable` / `to`(Teleport target) /
  `zIndex` / sx 5 节点(sxMask/sxDialog/sxHead/sxBody/sxFoot)。emit: update:visible / close / mask-click。
  M3 elevation `boxShadow._huge` + radius `_large`。
  **Phase β 加 focus trap**(需 `@vueuse/integrations/useFocusTrap`)和 `Modal.confirm/alert` 静态方法。
- **`ZMessage`** + **`createMessageApi()`**(feedback)—— 顶部 Toast 队列。
  - 组件模式:`<ZMessage :messages :onClose>` 业务方自管数组
  - 工厂模式:`createMessageApi()` → `{ info, success, warning, error, loading, close, destroyAll }`,
    内部 `createApp` 临时实例 mount 到 body
  - 默认 duration:非 loading 3s,loading 不自动关
  - icon 跟 type 映射,loading 自带 spin 动画

测试 43 case(原 200 + 43 = 243 全绿)。

---

### 新增 — 布局四件套 `layout/`(P0)

Stage 6.1 P0 布局组件落地:

- **`ZFlex`** —— Flexbox 容器。props:`direction`(`row` / `column` / `row-reverse` / `column-reverse`)/
  `wrap`(boolean / `'reverse'`)/ `justify`(`start` / `center` / `end` / `between` / `around` / `evenly`)/
  `align`(`start` / `center` / `end` / `stretch` / `baseline`)/ `gap` carrier factory / `inline` / `css` / `tag`
- **`ZGrid`** —— CSS Grid 容器。`cols` / `rows` 支持:
  - 数字 → `repeat(N, minmax(0, 1fr))`
  - 字符串 → 直接作 `grid-template-columns` / `rows`
  - 响应式对象 → `{ tiny: 1, middle: 3 }`,最小断点作 base,其它用 `@media min-width:breakpoint`(走
    schema `breakpoint.*` token)。
  另含 `gap` carrier factory / `justifyItems` / `alignItems` / `inline` / `css` / `tag`。
- **`ZSpace`** —— 等间距 flex(类 antd Space)。默认 `align: center`、`gap: _small`、不 wrap。
  Props:`direction`(horizontal/vertical)/ `size` carrier factory / `align` / `wrap` / `inline` /
  `css` / `tag`。
- **`ZSpacer`** —— flex 推开占位(`flex: 1 1 auto`)。Props:`grow` / `shrink` / `basis` carrier
  factory / `css` / `tag`。默认 `aria-hidden="true"`(屏读器跳过)。

测试 32 case(原 168 → 200 全绿)。

---

### 新增 — 内部 hooks 基建 `src/_hooks/`(5 个 hook,标 internal)

为后续复合组件(Modal / Drawer / Tooltip / Popover / Button 等)铺路,沉淀 5 个常用 composable:

- **`useZId(suffix?)`** —— 包装 Vue 3.5+ 内置 `useId()` + `zui-` 前缀。复合组件给子节点关联
  `aria-controls` / `htmlFor` 用。
- **`usePortal(target?)`** + **`<ZPortal>`** —— Teleport target 解析 + 现成组件包装。
  Modal / Drawer / Tooltip 渲染到 `<body>` 用。
- **`useEscapeStack(onEscape, { enabled? })`** —— 多层浮层 ESC 栈式管理,只关最顶层(LIFO);
  enabled=false 的 handler 跳过。
- **`usePopper(reference, floating, opts?)`** —— `@floating-ui/vue` 薄包装,内置 `offset(8) + flip() +
  shift({ padding: 8 })` middleware + `autoUpdate`。Popover / Tooltip / Dropdown / Select 浮层定位。
- **`useRipple(targetRef, opts?)`** —— Material 风波纹(**自写**,VueUse 无对应)。pointerdown →
  span + @keyframes 动画 → animationend 清理。Button / Tab / IconButton 用。

**API 稳定性**:下划线前缀 `_hooks/` 标 internal,API 变更**不算 BREAKING**(组件实际使用时若需微调
参数形状,直接改即可)。业务方使用需自行承担升级成本。

测试覆盖:21 个新 spec(原 147 → 168 全绿)。

决策文档:`.claude/decisions/2026-05-23-stage5-internal-hooks.md`

---

### BREAKING — 主题美学升级 Material Design(C2 方案)+ 新增 `focusRing` / `overlayBg` 语义色

**理由**:
- `#L8` 锁定决策:主题美学采用 Material 2 经典色 + M3 motion/elevation/shape 的组合方案 ──
  比 Tailwind 蓝绿色调更"产品级",跟 `@vicons/material` 图标体系搭配也更自然
- 新增 `focusRing` / `overlayBg` 是组件库后续 Modal / Drawer / 各类 focus 环都要用的状态色,
  之前用 `_primary.alpha(40)` / `'#000'.alpha(50)` 临时凑合,提升为 token 后业务侧统一覆盖更顺手

**配色变更**(zuiLight):
- `primary`: `tw('blue','600')` ≈ `#2563eb` → `#1976d2` Material Blue 700
- `danger`: `#dc2626` → `#d32f2f` M2 Red 700
- `warning`: `#eab308` → `#ed6c02` M2 Orange 700
- `success`: `#22c55e` → `#2e7d32` M2 Green 700
- `info`: `#06b6d4` → `#0288d1` M2 Light Blue 700
- `text`: `#111827` → `#212121` M2 grey-900
- `textSecondary`: `#4b5563` → `#616161` M2 grey-700
- `bgMuted`: `#f9fafb` → `#f5f5f5` M2 grey-100
- `border`: `#e5e7eb` → `#e0e0e0` M2 grey-300
- (新)`focusRing`: `#1976d2` 同 primary,使用处 `.alpha(40)`
- (新)`overlayBg`: `#000000`,使用处 `.alpha(50)`

**配色变更**(zuiDark):
- `primary`: `tw('blue','500')` → `#90caf9` Material Blue 200
- `danger / warning / success / info`: 全部换 Material 200~400 shade
- `text`: `#e0e0e0` grey-300 / `textSecondary`: `#9e9e9e` grey-500
- `bg`: `#111827` → `#121212` M3 dark surface 推荐基色
- `bgMuted`: `#1f2937` → `#1e1e1e` M3 surface +1
- `border`: `#4b5563` → `#424242` grey-800
- (新)`focusRing` / `overlayBg`

**shadow → M3 Elevation 双层阴影**(level 1-5,两层叠加 ── key light + ambient light,
Material Design 3 官方推荐 elevation 实现):
- light 模式 rgba 0.15~0.30 不透明度
- dark 模式 rgba 0.40~0.70 不透明度(深 bg 需要更强阴影才"浮起")

**radius.huge**: `iem(1.5)`(24px)→ `iem(1.75)`(28px) ── 对齐 Material 3 FAB / Dialog 推荐圆角

**迁移**:
1. 内部 tests / 业务代码若 hardcode 比对 primary `#2563eb` 等具体值 → 改读 `zuiLight.resolve().color.primary`
2. 若业务工程依赖旧 shadow 单层布局 → 重新比对 Stripe 卡片视觉(M3 双层更立体)
3. 若依赖 `radius.huge=24` → 显式覆盖 `zuiLight.extend({ radius: { huge: iem(1.5) } })`

决策文档:`.claude/decisions/2026-05-23-stage4-theme-aesthetics-m3.md`(含完整对照表 + 视觉验收清单)

---

### BREAKING — 图标 peerDep 从 `@vicons/ionicons5` 切到 `@vicons/material`,新增 `BuiltinIcons` 语义 map

**理由**:
- 主题美学方案 C2(`#L8` 锁定决策)走 Material Design 视觉(M2 经典色 + M3 motion/elevation/shape),
  内置图标自然应配套 Material 图标体系(`@vicons/material`),美观度和语义一致性都优于 Ionicons5
- peerDep 从 optional 升 required,组件库内置反馈(`<ZAlert>` / `<ZModal>` 的关闭按钮、Select 的下拉箭头、
  Table 的刷新按钮等)依赖固定图标,不允许业务方不装(若不装,组件渲染失败)
- 新增 `BuiltinIcons` 语义 map(15 项:`close` / `check` / `chevronDown/Up/Left/Right` / `warning` /
  `info` / `success` / `error` / `search` / `refresh` / `more` / `add` / `remove`),组件库 + 业务方共用
  统一字典 —— 想要 `success` 从 `CheckCircleOutlined` 换 `DoneOutlined`,只改一处

**改动**:
- `peerDependencies` 与 `devDependencies`:`@vicons/ionicons5@^0.13.0` → `@vicons/material@^0.13.0`
- `peerDependenciesMeta` 删除 `@vicons/ionicons5` optional 标记
- `vite.config.ts` external 列表同步
- 新增 `src/gene/icons.ts`:`export * from '@vicons/material'`(全量透传)+ `BuiltinIcons` map + `BuiltinIconName` type
- `src/gene/index.ts` 添加 `export * from './icons'`
- 主入口经 `export * from './gene'` 自动透出 `BuiltinIcons` 与 material 全套
- `docs/IconPage.vue`:imports 改用 material 等价图标 + `as` 别名(`CheckCircleOutlined as CheckmarkCircle` 等,保持现有 docs 代码可读)
- `docs/package.json`:dependency 同步

**迁移**:
```diff
- import { HomeOutline } from '@vicons/ionicons5'
+ import { HomeOutlined } from '@vicons/material'         // 或:
+ import { HomeOutlined } from '@kenconnet666/zui-vue'    // 主入口透传

  // 内置语义图标(新)
+ import { BuiltinIcons } from '@kenconnet666/zui-vue'
+ <ZIcon :component="BuiltinIcons.close" label="关闭" />
```

---

### BREAKING — `cssRoot` prop 全局重命名为 `css`,新增 `SxObject` 类型与 helper

**理由**:
- `cssRoot` 这名字暗示"根节点的 css"但其实就是组件的核心 css 逃生口。改为更短的 `css` 更对仗
  `class` / `style`,跟 antd / MUI 的 `sx` / `css` prop 命名习惯对齐。
- 同时引入 `SxObject` 类型(`{ css, class, style, ...HTMLAttributes }`)+ `applySx` / `extractSxAttrs`
  helper,为后续复合组件(ZCard / ZModal / ZTabs ...)的子节点 `sxHead` / `sxBody` / `sxFoot` props
  提供统一基建。

**改动**:
- `ZBox` + 6 个 gene 组件(ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZDivider)的 `cssRoot` prop
  改名为 `css`(类型不变,仍是 `(s: Chain<ZuiSchema>) => void`)
- 5 个 spec 文件同步改 `cssRoot:` → `css:`
- `docs/IconPage.vue` 展示页改 `:css-root="..."` → `:css="..."`
- `.claude/skills/zui.md` 全文更新
- 新增 `src/_internal/sx.ts`(对外不直接暴露,通过组件 props 类型间接出现)

**迁移**:
```diff
- <ZIcon :css-root="(s) => { s.color._primary }" />
+ <ZIcon :css="(s) => { s.color._primary }" />

- mount(ZBox, { props: { cssRoot: (s) => s.padding.px(24) } })
+ mount(ZBox, { props: { css: (s) => s.padding.px(24) } })
```

---

### BREAKING — 目录扁平化 + 单入口化 + 删除 composables

**理由**:三件事一起做完成"分类化、扁平化、单入口化"的结构重整,为后续 P0/P1/P2/P3 分阶段
组件落地腾出干净的目录树。

**目录扁平化**(`src/components/` 嵌套层取消,各分类直接放 `src/` 根):

```
src/components/gene/*           → src/gene/*
src/theme/*                     → src/provider/theme/*
src/locale/*                    → src/provider/locale/*
src/provider/useZTheme.ts       → src/provider/theme/useZTheme.ts
src/provider/useZLocale.ts      → src/provider/locale/useZLocale.ts
src/provider/useZDate.ts        → src/provider/date/useZDate.ts
(新建占位)                       → src/{layout,input,display,feedback,navigation,tool}/index.ts
(新建空目录)                     → src/_internal/  src/_hooks/
```

`provider/` 根目录仅保留:`ZBox.vue` + `keys.ts` + `units.ts` + `index.ts`。

**单入口化**:`package.json/exports` 删除所有 subpath(`./provider`、`./locale`、`./composables`、
`./components`、`./components/gene`),只暴露 `.` 主入口。`vite.config.ts/build.lib.entry` 从对象式
多入口改为单字符串 `'src/index.ts'`(rollup `preserveModules` 不变,tree-shake 由 bundler 处理)。

**删除 composables**:`useStyles` / `useDynamicStyles` / `chainOf` / `useVariants` / `useParts` /
`useBreakpoints` / `useResponsive` 全部移除。这些 hook 无任何组件依赖,实际仅作为外部工具函数
被业务方少量使用,且 80% 能力可直接走 `@vueuse/core`(`useBreakpoints` / `useElementSize` 等),
保留它们只增加包面积和文档维护成本。业务侧需要时直接装 `@vueuse/core`。

**迁移**:
```diff
- import { useZTheme } from '@kenconnet666/zui-vue/provider'
+ import { useZTheme } from '@kenconnet666/zui-vue'

- import { zhCN } from '@kenconnet666/zui-vue/locale'
+ import { zhCN } from '@kenconnet666/zui-vue'

- import { useStyles, useBreakpoints } from '@kenconnet666/zui-vue/composables'
+ // 自行安装 @vueuse/core,或在组件内直接用 icss(theme, factory) + matchMedia
```

**决策文档**:`.claude/decisions/2026-05-23-stage1-flatten-and-single-entry.md`

---

### BREAKING — 语义色 `textMuted` 改名为 `textSecondary`

**理由**:对齐 antd / MUI 的 `text.secondary` 命名惯例,语义清晰("次要文本"层级),且避免跟主题模式名 `light` 字面冲突。

**改动**:
- `SemanticColorTokens` 中 `textMuted` → `textSecondary`
- `zuiLight.color.textSecondary` / `zuiDark.color.textSecondary`(物理值不变,仍是 `tw('gray', '600')` / `tw('gray', '400')`)

**迁移**:
```diff
- s.color._textMuted
+ s.color._textSecondary
```

**core fixture 不动**:`packages/core/tests/_fixture-theme.ts` 等自定义 schema 中 `textMuted` 字段是 core 包测试用样本,跟 ZuiSchema 无关。

---

### BREAKING — 移除 `primaryHover` 语义色,hover 态由 chain modifier 派生

**问题**:原 `SemanticColorTokens` 含 `primaryHover` 一个孤立的"hover 态"专属 token,但
其它语义色(`danger` / `warning` / `success` / `info`)都没有对应 `xxxHover`,**不对称**。
要么所有色都加 `Hover` 变体(token 表翻倍),要么删 `primaryHover` 让所有语义色用同一个
模式派生 hover —— 选后者,更简洁。

**改动**:
- `SemanticColorTokens` 删 `primaryHover`(从 11 减到 10 个语义色)
- `zuiLight.color.primaryHover` / `zuiDark.color.primaryHover` 删
- IDE 上 `s.color._primaryHover` 报"找不到 token" → 改用 modifier

**迁移**:hover 态用 chain `color2k` modifier 在使用处派生:
```ts
// 旧
s._hover(h => h.color._primaryHover)

// 新(三选一,按效果选)
s._hover(h => h.color._primary.darken(8))   // 加深 8%(类似旧 zuiLight 行为)
s._hover(h => h.color._primary.lighten(8))  // 提亮 8%(类似旧 zuiDark 行为)
s._hover(h => h.color._primary.alpha(80))   // 80% 透明度
```

业务侧要"全站统一 hover 加深"可用 augmentation + 默认值:
```ts
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    primaryHover: string  // 自己加回去
  }
}
zuiLight.extend({ color: { primaryHover: tw('blue', '500') } })
```

**对 core 包零影响**:core/tests/_fixture-theme.ts 等测试 fixture 自定义 schema 中
的 `primaryHover` 不动(那是 core 包"function token 引用同级 key"等行为的测试样本)。

---

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
