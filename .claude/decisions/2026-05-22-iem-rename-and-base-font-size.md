# iem 重命名 + 基准字号语义 —— zu 单位改造为"我自己使用的 em"

**日期**: 2026-05-22
**作者**: Claude(用户授权自主执行)
**状态**: 实施完成(core + ui-vue + docs:type-check / test / build 全绿)

---

## 背景

之前的 `zu` 单位语义:
- `zu(N)` → `calc(N * var(--zui-unit, 1px))`,默认 1zu = 1px
- 用法:`spacing.middle = zu(16)`(N = 物理像素)
- 命名"zu"语义模糊,新用户不知道是什么

用户诉求:
1. **改名 `zu` → `iem`** —— "我自己使用的 em",跟 CSS `rem`(root em)对称
2. **改语义:类似 rem** —— 默认 1iem = 16px(基准字号),Provider 切换
3. **ZIcon 默认 size 用 iem** —— 跟 Provider 字号联动,整站统一图标尺寸
4. **嵌套 Provider 可分别设字号** —— 子树独立、兄弟独立

---

## 设计原则

1. **命名跟 rem 对称**:`rem` = 根字号倍率(浏览器掌控);`iem` = 应用基准倍率(ZConfigProvider 掌控)。"iem" 字面拆解为 "intrinsic em / individual em / **我自己使用的 em**"。
2. **默认 1iem = 16px**(等同 rem),token 数字表达"几个基准字号":`iem(1)` = 1iem,`iem(1.5)` = 1.5iem。
3. **CSS cascade 天然支持嵌套** —— 每个 Provider 写 inline `style="--zui-iem: ..."`,子组件用 `calc(N * var(--zui-iem, 16px))` 通过浏览器自动找最近祖先值。嵌套覆盖、兄弟隔离都是天然的,**零运行时合并开销**。
4. **统一改名连锁** —— chain method / helper / Provider prop / CSS var / preset 全部 iem 化,一次 BREAKING 把概念命名彻底统一。

---

## 改动全景(14 个文件)

| 层 | 文件 | 改动 |
|---|---|---|
| **core 类型** | `packages/core/src/chain/units.ts` | `zu` → `iem`(`LENGTH_UNITS` / `zu()` / `zuWith()` / `withUnit()`);default fallback `1px` → `16px` |
| **core 类型** | `packages/core/src/types/carrier.ts` | `LengthUnits.zu(n)` → `LengthUnits.iem(n)` |
| **core 类型** | `packages/core/src/types/properties.generated.ts` | 自动 regenerate(LengthUnits 接口改了) |
| **core escape** | `packages/core/src/chain/escape.ts` | `_zu(N)` → `_iem(N)`(注释 + 示例,runtime 走 LENGTH_UNITS 查表自动跟随) |
| **core export** | `packages/core/src/index.ts` | export `{ zu, zuWith }` → `{ iem, iemWith }` |
| **core tests** | `tests/debt-batch1.spec.ts` / `tests/escape.spec.ts` / `tests/carrier-factory.spec.ts` | 字符串匹配 `--zui-unit, 1px` → `--zui-iem, 16px`;`zu()` → `iem()` |
| **ui-vue Provider** | `packages/ui-vue/src/provider/units.ts` | `ZUnitPreset` → `ZIemPreset`(删 `pixel`/`retina`,新增 `default`/`large`/`compact`/`em`/`rem`)|
| **ui-vue Provider** | `packages/ui-vue/src/provider/ZConfigProvider.vue` | `:unit` prop → `:iem`;`unitStyle` → `iemStyle`;inline `--zui-unit` → `--zui-iem`;默认 `'1px'` → `'16px'` |
| **ui-vue Provider** | `packages/ui-vue/src/provider/index.ts` | re-export `ZUnitPreset` → `ZIemPreset` |
| **ui-vue 顶层** | `packages/ui-vue/src/index.ts` | re-export `ZUnitPreset` → `ZIemPreset` |
| **ui-vue theme** | `packages/ui-vue/src/theme/zui-light.ts` | `zu(N)` → `iem(N)`,数字全重写(`zu(16)` → `iem(1)` 等);spacing/radius/fontSize/blur token 物理像素**默认值不变** |
| **ui-vue 组件** | `packages/ui-vue/src/components/icon/ZIcon.vue` | 默认 size:`(w) => w.em(1)` → `(w) => w.iem(1)`(默认 16px,跟 Provider 联动)|
| **ui-vue 测试** | `packages/ui-vue/tests/icon.spec.ts` | width/height 字符串匹配 `1em` → `calc(1 * var(--zui-iem, 16px))` |
| **docs** | `packages/docs/src/pages/IconPage.vue` | size demo 全部用 `iem(N)`;新增 §10 `:iem` preset + 嵌套 Provider 演示;新增 §11 "嵌套独立 + 兄弟独立" 演示 |
| **skill** | `.claude/skills/zui.md` §11 / §13.0 ② / §13.10 | iem 语义说明 + token 表数字重写 + Provider :iem 描述 |

---

## 新 token 物理值表(默认基准 16px)

| Category | tiny | small | middle | large | huge | 物理(px @ default) |
|---|---|---|---|---|---|---|
| `spacing` | `iem(0.25)` | `iem(0.5)` | `iem(1)` | `iem(1.5)` | `iem(2)` | 4/8/16/24/32 |
| `radius` | `iem(0.25)` | `iem(0.5)` | `iem(0.75)` | `iem(1)` | `iem(1.5)` | 4/8/12/16/24 |
| `fontSize` | `iem(0.75)` | `iem(0.875)` | `iem(1)` | `iem(1.125)` | `iem(1.25)` | 12/14/16/18/20 |
| `blur` | `iem(0.25)` | `iem(0.5)` | `iem(1)` | `iem(1.5)` | `iem(2.5)` | 4/8/16/24/40 |

不变(非 iem):shadow / breakpoint / duration / easing / zIndex / opacity / lineHeight / letterSpacing / aspectRatio / fontWeight。

**关键性质**:用 `padding._middle` 等 token 的代码视觉零变化(默认 16px = `iem(1)` * 16px = 16px,跟旧 `zu(16)` * 1px = 16px 等同)。只有 **explicit 写 `s.padding.zu(N)`** 的旧代码会受影响(且现在编译错,因为 zu 已删)。

---

## 新 ZIemPreset

```ts
export const ZIemPreset = {
  default: '16px',   // 1iem = 16px(默认基准,等同 rem)
  large:   '20px',   // 1iem = 20px(放大 25%,大字模式)
  compact: '14px',   // 1iem = 14px(紧凑 -12.5%)
  em:      '1em',    // 1iem = 1em(跟父字号,嵌套自动)
  rem:     '1rem',   // 1iem = 1rem(跟浏览器根字号,a11y)
} as const
```

---

## 嵌套 / 兄弟 Provider 行为

CSS cascade 天然支持,零运行时合并:

```vue
<ZConfigProvider :iem="ZIemPreset.default">
  <App />                                        <!-- 1iem = 16px -->

  <ZConfigProvider :iem="ZIemPreset.large">     <!-- 嵌套覆盖 -->
    <Sidebar />                                  <!-- 1iem = 20px -->
  </ZConfigProvider>

  <Main />                                       <!-- 1iem = 16px(回到外层) -->
</ZConfigProvider>

<!-- 兄弟 Provider 互不影响 -->
<ZConfigProvider :iem="ZIemPreset.compact"><Compact /></ZConfigProvider>
<ZConfigProvider :iem="ZIemPreset.large"><Cozy /></ZConfigProvider>
```

**实现机制**:每个 `ZConfigProvider` 在 wrapper `<div>` 写 inline `style="--zui-iem: 16px"`;子组件 `calc(N * var(--zui-iem, 16px))` 通过浏览器 CSS 引擎自动找最近祖先的值。子 Provider 不需要"合并父值",直接覆盖。

---

## 关键决策点

### 决策 1:`iem` 命名(vs 保留 zu)

**选择**:**全改名 iem**(用户原话:"iem 含义是我自己使用的 em")

**理由**:
- `zu` 字面无语义,新用户不知道含义
- `iem` 跟 `rem`(root em)对称,字面就是"用户自定义 em",一看就懂
- 配合改语义(1iem = 16px),命名 + 语义统一一次性 BREAKING

**放弃**:保留 `zu` 名只改语义 —— 名字和新语义割裂,误导更深

### 决策 2:周边名字全改(连锁 BREAKING)

**选择**:`ZUnitPreset` → `ZIemPreset`,`:unit` → `:iem`,`--zui-unit` → `--zui-iem`,`zu()` → `iem()`,`zuWith()` → `iemWith()`,`_zu(N)` → `_iem(N)` —— 一次性全改。

**理由**:
- 命名一致性:用户在 chain method / Provider prop / preset 看到的都是 `iem`,认知整合
- 旧名字保留只会增加误导(`ZUnitPreset.pixel = '1px'` 在新默认 16px 体系下完全反直觉)
- ui-vue + docs 还在 0.x,可控 BREAKING

**放弃**:只改 chain method 名 —— 用户认知割裂

### 决策 3:默认 fallback `1px` → `16px`

**选择**:`iem(N)` → `calc(N * var(--zui-iem, 16px))`

**理由**:
- 没在 Provider 内的页面也默认 1iem = 16px(等同 1rem),符合"我自己使用的 em"语义
- 旧用户 schema 用 `padding._middle` 视觉零变化(因为 token 数字同步从 `zu(16)` 改成 `iem(1)`)
- 跟 ZIemPreset.default = `'16px'` 一致

### 决策 4:ZIcon 默认 size:`em(1)` → `iem(1)`

**选择**:默认走 iem,跟 Provider 联动

**理由**:用户原话明确"ZIcon 使用这个单位"。结果:
- ZConfigProvider 切大字时图标整站放大(包括按钮里的图标)
- 失去"在 `<button style="font-size:14px">` 里图标 = 14px" 的语义 — 想要这个行为的用户显式 `(w) => w.em(1)`

### 决策 5:ZIemPreset 不保留旧名

**选择**:删 `pixel` / `retina`,新增 `default` / `large` / `compact` / `em` / `rem`

**理由**:旧 `pixel='1px'` 在新 iem 体系下意思是 1iem=1px,跟默认 16px 完全反直觉,留着误导。`retina='2px'` 同理。全删比兼容档干净。

### 决策 6:token 数字从"物理像素"改"几个基准字号"

**选择**:`spacing.middle = iem(1)` 而不是 `iem(16)`

**理由**:
- 跟 rem 用法一致 —— 设计师读 `padding: 1rem` 直觉知道 = "1 个根字号"
- 数字小(0.25/0.5/1/1.5/2),有比例语义
- Provider 切到 20px 大字时,`iem(1)` 自动变 20px(不需要手动算 `16 * 1.25`)

---

## 嵌套 Provider 是否会"影响其他向下覆盖的 Provider"?

**不会**。CSS var cascade 是 **作用域隔离** 的:
- Provider A 的 wrapper `<div style="--zui-iem: 20px">` 只影响其 DOM 子树
- 兄弟 Provider B 的 wrapper `<div style="--zui-iem: 14px">` 完全独立
- 嵌套 Provider C 在 A 内部 `<div style="--zui-iem: 16px">` 只覆盖自己子树,出 C 范围回到 A 的 20px

**关键性质**:子 Provider 不需要知道父 Provider 设的什么值,也不需要合并 —— 浏览器 CSS 引擎在 paint 时自动找最近祖先的 `--zui-iem`,效率 O(1)。这跟 theme / locale 等需要深合并的 prop 完全不同。

---

## 验证结果

| 项 | 结果 |
| --- | --- |
| core type-check | ✅ |
| core test | ✅ 31 文件 / 628 tests |
| core build | ✅ |
| ui-vue type-check | ✅ |
| ui-vue test | ✅ 2 文件 / 44 tests(icon 35 + provider 9) |
| ui-vue build | ✅ |
| docs type-check | ✅ |
| docs build | ✅ |

---

## 兼容性提示

**BREAKING**:用户工程如果有:
- 引 `import { zu, zuWith } from '@kenconnet666/zui-core'` → 改 `iem, iemWith`
- 引 `import { ZUnitPreset } from '@kenconnet666/zui-vue'` → 改 `ZIemPreset`
- `<ZConfigProvider :unit="...">` → 改 `:iem`
- explicit `s.padding.zu(N)` chain method → 改 `s.padding.iem(N/16)`(因数字语义改了)
- `_zu(N)` 字符串逃生舱 → 改 `_iem(N/16)`

`padding._middle` 等 schema token 用法 **零变化**(物理像素默认值不变)。

---

## 后续

- 用户工程升级时 grep `\bzu\b` / `ZUnitPreset` / `:unit\b` 一次性替换
- 新组件开发直接走 iem(默认 Provider 字号)+ cssRoot 兜底
- `iemWith()` 在 SSR / 测试场景把 `iem(N)` 在 TS 层就算成具体 px(跟旧 `zuWith` 相同行为)
