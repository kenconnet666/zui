# 2026-05-23 · Stage 6.6 ZButton 完成 + Phase α 全套收尾(无人值守跳过 STOP #4)

> **执行模式**:`/loop` 无人值守自主推进。路线图 §6 STOP 节点 #4(Stage 6.6 ZButton 完成后停下让用户
> "review 波纹/焦点表现")在路线图前言已显式豁免。本文档记录设计决策,用户回 IDE 后可在 docs 站点
> (`pnpm --filter @kenconnet666/docs dev`)写一个 ButtonPage 验证视觉表现。

---

## ZButton 设计要点

### A. 5 个 variant(M3 风格命名)

| variant    | 视觉                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `filled`   | 实心 ── `backgroundColor: currentColor` + 反色文字 + `boxShadow._tiny` |
| `outlined` | 描边 ── `borderColor: currentColor` + 透明背景                         |
| `text`     | 无背景无边框 ── 透明 + state layer hover                               |
| `ghost`    | 半透明背景 ── `_primary.alpha(8)`,跟 hover state layer 同色            |
| `link`     | 内联链接 ── 透明背景 + hover 时 `text-decoration: underline`           |

### B. `color` carrier factory(主色)

默认 `_primary`;用户可传 `(c) => c._danger` 等。该色透过 `color` 属性挂到按钮(`currentColor` 引用):

- filled:`backgroundColor: currentColor`(把 color 当背景)+ 文字反色 `_bg`
- outlined:`borderColor: currentColor` + 文字保持 color
- text/ghost/link:文字 = color

### C. M3 state layer(hover/active 半透明叠加)

- 默认 color(`_primary`):hover `_primary.alpha(8)` / active `_primary.alpha(12)`
- **user color 时跳过 state layer**(chain modifier `.alpha` 不能跟 carrier factory 串接,
  当前 API 边界)。降级方案:
  - filled → 仅 boxShadow elevation 变化(`_tiny → _small`)
  - ghost → opacity 0.92 → 1
  - outlined/text → hover 不变色(仅 cursor 反馈)
- 后续改进路径:用 `::before` 伪元素做 state layer overlay,可以脱离 chain modifier 限制

### D. `:focus-visible` outline ring(M3)

```ts
s._focusVisible(f => {
  f._prop('outlineWidth', '2px')
  f._prop('outlineStyle', 'solid')
  f.outlineColor._focusRing.alpha(40)
  f._prop('outlineOffset', '2px')
})
```

走 `_focusRing` semantic token(等同 `_primary`,Stage 4 加入)+ alpha 40% + 2px outset。

### E. Material 风波纹(`useRipple`)

- 默认开启(`ripple: true`)
- 集成 Stage 5 写的 `useRipple` hook(自写,pointerdown 注入 `<span class="zui-ripple">`)
- `disabled` / `loading` 时自动跳过波纹(传 `disabled` 给 useRipple)
- 用户传 `:ripple="false"` 关闭(text/link variant 推荐关)

### F. 状态 props

- `loading` —— 隐藏 `prefixIcon` slot,显示 `BuiltinIcons.refresh` + spin 动画;`aria-busy="true"`,
  button 自动 disabled
- `disabled` —— 标准 HTML disabled,opacity dim,cursor not-allowed
- `block` —— `width: 100%`

### G. icon slot

- `#prefixIcon` / `#suffixIcon` —— 用户传 ZIcon 或任意组件
- loading 时 prefixIcon 被替换

---

## 测试覆盖

`tests/z-button.spec.ts`:19 case

- 渲染:default tag/type,slots(3)
- 5 variant 视觉规则(5)
- 状态:disabled / loading / block / click emit / disabled 不 emit(5)
- focus-visible / ripple 启用 / ripple 禁用(3)
- icon slots:prefixIcon / loading 覆盖(2)

总:330 → **358 全绿**。

---

## Phase α 收尾汇总

`Stage 6.1 → 6.6` 全部完成,21 个 P0 组件清单:

| 分类           | 组件                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **layout**     | ZFlex / ZGrid / ZSpace / ZSpacer                                                                                              |
| **gene**       | ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZDivider / **ZButton** + `BuiltinIcons` 语义 map                                |
| **feedback**   | ZAlert / ZSpin / ZModal / ZMessage + `createMessageApi()`                                                                     |
| **display**    | ZCard / ZTable                                                                                                                |
| **input**      | ZInput / ZTextarea / ZInputNumber / ZSwitch / ZCheckbox + ZCheckboxGroup / ZRadio + ZRadioGroup / ZSelect / ZForm + ZFormItem |
| **navigation** | ZBreadcrumb / ZPagination / ZTabs / ZMenu                                                                                     |

总共 **27 个 SFC + 3 个 helper**(messageApi / \_checkbox-group / \_radio-group / \_form-ctx)+ 5 个 hooks(`_hooks/`)。

测试 **358 case 全绿**,build OK,type-check 0 error。

---

## 视觉验收(待用户)

用户回 IDE 后可写一个 docs 页面:

```vue
<ZButton variant="filled">Save</ZButton>
<ZButton variant="outlined">Outlined</ZButton>
<ZButton variant="text">Text</ZButton>
<ZButton variant="ghost">Ghost</ZButton>
<ZButton variant="link">Link</ZButton>
<ZButton :color="c => c._danger" variant="filled">Danger</ZButton>
<ZButton :loading="true">Loading</ZButton>
<ZButton block>Block</ZButton>
```

验收要点:

1. 5 variant 视觉对比是否符合 M3 风格
2. 波纹动画速度 / 颜色 / 范围
3. focus 环厚度 / 颜色 / offset
4. user color(`_danger` 等)时按钮显示是否对(filled 红底白字,outlined 红边红字)
5. loading 旋转节奏(0.8s) + button 不可点击

---

## 路线图后续

Phase α 完成,接下来:

- **Stage α 收尾**(可选):验证三件套整体跑一次,docs 站点写 ButtonPage / FormPage / TablePage
- **Stage 7+ Phase β**:高频补全(ZAvatar / ZTag / ZBadge / ZTooltip / ZPopover / ZDropdown /
  ZDrawer / ZNotification / 等),Modal.confirm 静态方法,focus trap,popup-style submenu,
  ZSelect 多选,ZTable 排序/选择/分页等

下一轮 wakeup 会从 Stage α 收尾或 Stage 7 起点开始。
