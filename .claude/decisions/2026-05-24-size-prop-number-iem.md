---
date: 2026-05-24
type: ADR
status: accepted
supersedes:
  - 2026-05-23-prop-shape-pure-factory.md(部分,数值尺寸 prop)
---

# 数值尺寸 prop 改 `number`(iem 倍数)

## 决策

**所有"数值尺寸"props 从 chain factory 改为 `number`**(iem 倍数,默认 1iem=16px by Provider)。
**其他类型 prop 保持 chain factory**(color / direction / justify / css 等)。

## 背景

2026-05-23 决策"全 chain factory"实施后(B5),组件实际遇到**根本性问题**:

- 用户传 `:size="(s) => { s.fontSize.iem(1.25) }"` 时,**组件无法读取数值 `1.25`**(chain factory 是黑盒 callback)
- 组件无法按比例计算其他维度(padding / height / border-radius 等)
- "整体保持比例" 无法实现 → 用户每次得在 factory 内手写所有维度

修复:数值类 size 改 `number`,组件能读到具体数字,按比例计算其他维度,**全 iem(Provider 联动)**。

## 新规范

### 数值尺寸 prop 形态(改 `number`)

```ts
interface ZButtonProps {
  size?: number // 字号 iem 倍数,默认 1(= 16px @ Provider 默认 iem)
  height?: number // 高度 iem 倍数(可选,默认 size * 2)
}

interface ZIconProps {
  size?: number // 边长 iem 倍数,默认 1(width + height 镜像)
}

interface ZModalProps {
  width?: number // iem 倍数,默认 30(480px)
  maxWidth?: number
  maxHeight?: number
}
```

**实现**:

```ts
const className = computed(() =>
  icss(theme.value, s => {
    const size = props.size ?? 1
    const height = props.height ?? size * 2

    s.fontSize.iem(size)
    s.height.iem(height)
    s.paddingTop.iem(size * 0.5)
    s.paddingBottom.iem(size * 0.5)
    s.paddingLeft.iem(size * 1)
    s.paddingRight.iem(size * 1)
    s.borderRadius.iem(size * 0.375)
  }),
)
```

**用户改 `size` 数字 → 所有 iem 维度等比缩放 → 整体保持比例**。

### 保留 chain factory 的 prop 类型

| 类型             | 形态                     | 示例                                    |
| ---------------- | ------------------------ | --------------------------------------- |
| 颜色             | chain factory            | `color?: (c) => void`                   |
| 复合 wire        | chain factory            | `spin?: (d: AnimationDuration) => void` |
| 视觉变体         | 字面量内联(不导出 alias) | `variant?: 'filled' \| 'outlined'`      |
| 布局方向         | chain factory            | `justify?: (j) => void`                 |
| 间距(token 友好) | chain factory            | `gap?: (g) => void`(ZSpace)             |
| 真二态           | boolean                  | `disabled?: boolean`                    |
| css 兜底         | chain factory            | `css?: (s) => void`                     |

### 非 iem 单位 / 任意 CSS 走 `css` 兜底

```vue
<!-- 用户要 vh / pct / calc -->
<ZButton
  :size="1"
  :css="
    s => {
      s.height.vh(5)
    }
  "
/>
```

## 各组件 size 配置(默认 iem 倍数 @ 1080p)

### A 类:文字内核(8)— size = fontSize

- ZText / ZParagraph / ZLink:`size?: number`,默认 undefined(继承父字号)
- ZTitle:level 决定默认(已有 level→倍数 map)
- ZTag:size 默认 0.875(14px)
- ZAlert:size 默认 0.875(14px)
- ZBadge:size 默认 0.75(12px)
- ZBlockquote:size 默认 1(16px)

### B 类:盒子内核(4)— size = width(height 镜像)

- ZIcon:1(16px)
- ZAvatar:2.5(40px)
- ZBackTop:2.5(40px)
- ZSwitch:size=2.5(40px 宽),height=size\*0.6=1.5(24px)

### C 类:输入框(10)— size + height

- ZInput / ZInputNumber / ZSelect / ZTreeSelect / ZAutoComplete / ZDatePicker / ZTimePicker / ZCascader:size 1,height size\*2
- ZTextarea / ZMention:size 1,height 由 rows 决定

### D 类:按钮(2)— size + height

- ZButton / ZSegmented:size 1,height size\*2

### E 类:容器(8)— 各自尺寸 prop

- ZModal:width 30(480px)
- ZDrawer:size 20(320px)
- ZPopover:minWidth 8 / maxWidth 30
- ZTooltip:maxWidth 20
- ZPopconfirm:minWidth 12 / maxWidth 20
- ZNotification:maxWidth 22.5(360px)
- ZTour:minWidth 15 / maxWidth 22.5
- ZScrollbar:maxHeight undefined

### F 类:特殊(8)

- ZProgress:size,line 模式默认 0.5(8px),circle 模式默认 6(96px)
- ZSpin:size indicator 1.5(24px)
- ZSlider:track 0.25(4px),thumb 1(16px),内部固定
- ZRate:size star 1.5(24px)
- ZCheckbox:size box 1(16px)
- ZRadio:size dot 1(16px)
- ZPagination:size 1,itemSize size\*1.75(28px)
- ZSteps:indicator 2(32px)

### G 类:不动(7)

- 布局组件 ZFlex / ZGrid / ZSpace / ZSplit / ZSpacer / ZAffix
- ZSpace.size 是 gap 性质,保留 chain factory(token 友好)

## 迁移路径

```vue
<!-- 旧 -->
<ZButton :size="BUTTON_SIZE_MAP.middle" />
<ZIcon :size="w => w.iem(1.5)" />
<ZModal :width="w => w.iem(40)" />

<!-- 新 -->
<ZButton :size="1" />
<ZIcon :size="1.5" />
<ZModal :width="40" />
```

## 影响范围

- 删 `_internal/size-prop.ts` + `_internal/component-sizes.ts`
- 删所有组件内 `*_SIZE_MAP`(BUTTON / TAG / TYPOGRAPHY / PAGINATION / TABLE / DESC / SPIN 等)
- ~40 个组件改造
- ~30 spec 文件 ~200+ 处改 `:size="N"` 形式

## 不撤销 B5 的部分

- 颜色 / 布局方向 / variant 字面量内联 / 视觉变体 / 复合 wire 等保持 chain factory(B5 决策)
- 删字符串字面量映射(B5 禁忌)— **数字不是字面量映射,数字是连续数值**
