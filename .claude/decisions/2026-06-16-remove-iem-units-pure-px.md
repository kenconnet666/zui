---
date: 2026-06-16
supersedes:
  - 2026-05-22-iem-rename-and-base-font-size.md
  - 2026-05-24-size-prop-number-iem.md
status: implemented
branch: refactor/remove-iem-px
---

# 移除 iem 逻辑单位，全面改纯 px

## 背景 / 问题

iem（intrinsic em，`<ZBox>` 注入的 `--zui-iem` 基准）在 0.8.x 默认值是 `0.8333vw`（响应式，1920 屏 = 16px）。实践暴露三个问题：

1. **计算 / 定位困难**：`size=2` 渲染成 `calc(2 * 0.8333vw)`，设计 / 调试无法心算 px；布局定位计算需先 resolve 实际像素。
2. **JS 层税**：虚拟列表 / popper / scrollTop 等算法需要确定像素，被迫引入 `useZIem()` 响应式反查 vw → px —— 纯粹由 vw 默认带来的复杂度。
3. **业界对标**：主流桌面组件库（Element Plus / Naive UI / Ant Design / Arco）清一色纯 px，PrimeVue / Vuetify 用 rem；**没有任何桌面库默认用 vw 做组件尺寸**（vw 只用于移动端 H5 整页缩放，有 a11y 失效、大屏字号爆炸等公认缺陷）。要全局缩放的库（Radix Themes / Mantine）用 `calc(px × var(--scaling))`，基准仍是 px / rem 中性值。

zui 的 iem 机制本身 = Radix `--scaling` / Mantine `--mantine-scale` 同族，**问题在默认值选了 vw 而非中性的 px**。

## 决策

彻底移除 iem 单位系统，改纯 px（对齐 Element Plus / Naive UI）：

- **core**：删 `iem()` / `iemWith()` / `LENGTH_UNITS` 的 `'iem'` / carrier `LengthUnits.iem`。
- **ui-vue**：删 `ZIemPreset` / `ZIem` / `useZIem` / `Z_IEM_PX_KEY` / `--zui-iem` 注入；`<ZBox>` 移除 `iem` prop（保留 theme / locale / date / css）。
- **token 表**：`iem(n)` → px 字面量（spacing 4/8/16/24/32、fontSize 12/14/16/18/20、radius 4/8/12/16/28、blur 4/8/16/24/40、sizes 64/128/256/512/768/1200）。
- **组件**：236 处 `.iem(N)` → `.px(sizePx(N))`；新增 `_internal/sizing.ts` 的 `sizePx(n) = n*16`。
- **`size: number` 语义不变**：仍是「相对默认尺寸的倍数」，只是基准从可变 iem 变成固定 16px。

## 取舍

- **失去**：全局等比缩放 / 紧凑模式 / 大字 a11y（原 `<ZBox :iem>` 能力）。需要时业务侧用原生 `rem`（改根字号）/ `vw` / `clamp()` 局部表达。
- **换取**：布局 / 定位 / JS 计算全是确定像素，心算直观，删除 `useZIem` 反查税。
- **视觉变化**：原默认 `0.8333vw` 在非 1920 屏会等比缩放，现固定 px 不缩放；1920 基准屏视觉一致。这是预期改变（去 vw 的目的）。

## 顺带

- 新增「子绝父相」定位原语：`_anchor()`（relative + isolation）/ `_pin(inset)` / `_pinCorner(corner, offset)`。
- 修 `_translateX/Y/Z`、`_scaleX/Y/Z` 分量 setter 不可组合的 bug（改为读现值合并）。
- `applyUserRef`（`_internal/merge-ref.ts`）统一 9 组件的 ref 合并器；`schema.ts` UserXxxExt 改文件级 eslint 豁免。

## 验证

core + ui-vue type-check / test / build 全绿（ui-vue 600 tests），docs build 绿，generator 0 drift。
