---
date: 2026-05-23
type: ADR
status: accepted
supersedes:
  - 2026-05-22-prop-shape-union.md
---

# Prop 形态:全 factory 化(撤销 Size5 字面量 union)

## 决策

**所有外观 props 一律 chain factory**,撤销 `factory | Size5 | undefined` union 范式(2026-05-22 决策)。
具体 5 种形态见下文。

## 背景

2026-05-22 引入 `factory | Size5` union 范式时,初衷是 happy path 简洁 (`size="middle"`)。
实际使用半年发现:

- 字符串档位 `'small' / 'middle' / 'large'` **本质是 schema token 翻译**(组件内 SIZE_MAP 把字符串映射到 `.iem(N)`),用户写 `(s) => s._middle` 直接读 token 完全等价、且**无需 MAP 翻译表**。
- 字面量枚举有歧义:`size='small'` 在不同组件含义不一致(ZIcon=12px vs ZButton 高=24px)。
- 用户提示词调研:"方便用户熟悉 css 本来的属性而不是魔法封装" —— 字符串枚举正是"魔法封装"。

## 新规范(5 种 prop 形态)

### Type A:单属性 factory

```ts
color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
// 实现:s.color(props.color)
```

- prop 名 ≈ CSS 属性名(或语义等价)
- 实现单行 `s.propName(factory)`
- 用于:容器主色、对齐、间距、单一 CSS 属性 prop

### Type B:复合 wire factory(关键参数 expose)

```ts
spin?: ((d: Chain<ZuiSchema>['animationDuration']) => void) | undefined
// 实现:启用即自动 wire 一组规则,用户只控关键参数
if (props.spin) {
  s.animationName(presetAnimations.spin)
  s.animationIterationCount.infinite
  s.animationTimingFunction.linear
  s.animationDuration(props.spin)             // ← 用户控
}
```

- carrier 类型 = **用户最关心的参数**(其余有合理默认)
- 不传 = 不启用;传了 = 启用 + wire 其他默认
- 其他参数想自定义 → `css` 兜底覆盖
- 用于:动画速度、过渡时长等"启用一组规则但用户只关心一个参数"

### Type C:一对多 factory(同步控制多 CSS)

```ts
size?: ((w: Chain<ZuiSchema>['width']) => void) | undefined
// 实现:同 factory 跑两次,作用到不同 CSS 属性
if (props.size) {
  s.width(props.size)
  s.height(props.size)
}
```

- carrier 类型选**代表性属性**(比如方形组件选 width)
- factory 必须可重复调用(chain factory 天然幂等)
- 用于:正方形尺寸、对称 padding、SizePropMulti(fontSize + padding-x + padding-y)等

### Type V:variant 视觉变体(字符串字面量,内联)

```ts
// ✅ 内联枚举到 props,不导出独立 type alias
export interface ZButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'ghost' | 'link'
}

// ❌ 不要单独 export type alias
export type ZButtonVariant = 'filled' | 'outlined' | 'text' | 'ghost' | 'link'
export interface ZButtonProps {
  variant?: ZButtonVariant
}
```

- 用于:**控制多种复杂样式组合**(背景 + 边框 + 文字 + hover state 一整套)
- 不是单一 CSS 翻译,所以保留枚举形态
- 字面量内联到 props interface,不导出独立 type alias
- 也适用于"语义整体" prop:`placement?: 'top-right' | 'top-left' | ...` 这类**整体方位/锚点语义**

### Type N:保留形态(不动)

- **真二态 boolean**:`inline` / `bordered` / `disabled` / `closable` / `loading` / `block` / `ripple` / `square`
- **业务/JS 逻辑字符串**:`trigger?: 'hover' | 'click'` / `validateTrigger?: 'change' | 'blur' | 'submit'` / `expandTrigger?: 'click' | 'hover'`
- **原生 HTML 属性**:`type?: 'button' | 'submit' | 'reset'` / `tag?: 'div'`
- **第三方继承类型**:`placement?: Placement`(floating-ui 自带)
- **业务数据型**:`title` / `placeholder` / `value` / `aria-label`
- **Teleport target**:`to?: string | HTMLElement`

## 禁忌(必须避免)

| ❌ 错误形态                                                           | ✅ 正确形态                                         |
| --------------------------------------------------------------------- | --------------------------------------------------- |
| `justify?: 'between'` 配 MAP 翻译表                                   | `justify?: factory` (Type A)                        |
| `size?: 'small' \| 'middle' \| 'large'`(纯字面量枚举)                 | `size?: factory` (Type C)                           |
| `color?: 'primary' \| 'danger'`(颜色字面量)                           | `color?: factory` (Type A)                          |
| `direction?: 'horizontal' \| 'vertical'`(布局方向枚举,无 JS 逻辑耦合) | `direction?: factory` (Type A 操作 `flexDirection`) |
| `export type ZXxxVariant = ...` 单独 type alias                       | 内联到 props interface (Type V)                     |
| 组件内 `XXX_MAP: Record<keyword, css-value>` 翻译表                   | 直接走 factory + chain token access                 |

## iem 盒子模型 JSDoc 规范

任何使用 iem 单位的尺寸 prop / 内部默认值,JSDoc **必须**标注**iem 单位**的盒子模型(**不写 px 换算**,因为 iem 物理意义由 ZBox Provider 控制,默认 1iem=16px,可切换为 large/compact/em/rem):

```ts
/**
 * 高度 2iem(默认)
 * - padding-y: 0.25iem × 2
 * - border: 0.0625iem × 2
 * - 内容区:1.5iem
 */
```

或更简洁:

```ts
/**
 * 默认尺寸:width/height = 1iem,正方形。
 */
```

**只写 iem,不写 px**。用户已理解 iem 是 Provider 控制的响应式单位。

## 迁移路径

旧:

```vue
<ZIcon size="middle" />
<ZSpace size="large" />
<ZAlert type="success">操作成功</ZAlert>
<ZFlex justify="between" align="center">...</ZFlex>
```

新:

```vue
<ZIcon :size="w => w.iem(1.25)" />
<!-- 显式 iem -->
<ZIcon :size="w => w._middle" />
<!-- 走 schema sizes token -->
<ZSpace :size="g => g._large" />
<ZAlert :color="c => c._success">
  <template #icon><ZIcon :component="BuiltinIcons.success" /></template>
  操作成功
</ZAlert>
<ZFlex :justify="j => j.spaceBetween" :align="a => a.center">...</ZFlex>
```

## 影响范围

约 50 个 prop / 24 处 JSDoc / 30+ 个 .vue 文件。详细批次见 roadmap §10。
