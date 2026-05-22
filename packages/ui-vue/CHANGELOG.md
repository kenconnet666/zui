# @kenconnet666/zui-vue

## Unreleased

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
