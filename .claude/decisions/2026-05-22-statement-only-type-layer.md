# 类型层 Statement-Only —— carrier / unit / color modifier 全部返回 `void`

**日期**: 2026-05-22
**作者**: Claude (用户授权自主执行)
**状态**: 实施完成（type-check ✅ / 30 文件 610 tests ✅ / build ✅）

---

## 背景

IDE 在 `s.color.currentColor.` 之后弹出 89+ Chain 内建方法 + 857 个 CSS 属性 carrier 的下拉补全，让用户困惑"为什么 color 后面会有 `_hover` / `_aria` / `display` / `width` 这些 完全不相关的选项"。

**根因**：`carrier.ts` 的 `PropCarrier` / `ColorPropCarrier` / `PropFn` / `LengthUnits` / `TimeUnits` / `AngleUnits` / `ColorTokenValue` 全部把 setter 表达式的"返回值类型"声明为 `TSelf`（= `Chain<T>`），让 IDE 在每一条 setter 之后都展开整个 Chain 表面。

设计意图 vs 类型签名的不一致：

- `.claude/skills/zui.md` §8.10 早已明确 **"token / keyword 命中后不返回 chain（statement-only 决策）"**
- 但 `ColorPropCarrier<TSelf, ...>` 的 `[K in TKeywords]: TSelf` 又把 keyword 映射到 `Chain` 自身
- `properties.generated.ts` 和 `docs-zh/*.ts` JSDoc 又**大量推广 fluent 链式示例**（30+ 处形如 `s.borderWidth.px(2).borderStyle.solid.borderColor._primary`），自相矛盾

用户原话：**"我不需要持续链式，而是有结束节点，一条语句一般只描述一行 css"** —— 类型层应当落实 statement-only。

---

## 设计原则

1. **类型层 statement-only，runtime 保持不变** —— Chain Proxy 仍然 `return chain` 让 JS 端依赖 chain 状态切换的实现细节不变；类型层只暴露 `void`，IDE 补全不再泄漏 Chain 表面。
2. **ColorTokenValue 是唯一的"语义延伸窗口"** —— `s.color._primary.alpha(50)` 这种 modifier 是 token 的语义补全（覆盖式、不累积），保留；但 modifier 调用后的返回类型也是 `void`，链式 modifier `.alpha(50).darken(15)` 不再合法（这恰好对齐了"modifier 不累积、后者覆盖前者"的既有决策）。
3. **Chain 自身内建方法保持 `: this`** —— `_hover` / `_apply` / `_media` 等 89 个内建方法是 nest block 容器（fn 内继续写多行 css），返回 `this` 让用户在内嵌 block 之间衔接是合理需求。本次决策不动这一层。
4. **删除 `TSelf` 类型参数** —— carrier / unit / modifier 类型不再需要 TSelf 参数。代码更干净，generator 输出更短。
5. **文档自洽** —— docs-zh JSDoc 全部 fluent 示例改写为 statement-only，避免文档反向教学。

---

## 实施清单

### 1. `packages/core/src/types/carrier.ts` —— 删 TSelf，全部返回 void

| 类型 / 接口                                                              | 改动                                                                                     |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `LengthUnits<TSelf>` → `LengthUnits`                                     | 删 TSelf；35 个 unit method 全部返回 `void`                                              |
| `TimeUnits<TSelf>` → `TimeUnits`                                         | 同上（ms / s）                                                                           |
| `AngleUnits<TSelf>` → `AngleUnits`                                       | 同上（deg / rad / grad / turn）                                                          |
| `PropCarrier<TSelf, TValue, TTokens, TKeywords, TUnits, TExtraKeywords>` | 删 TSelf；callable + token map + keyword map + extra-keyword map 全部返回 `void`         |
| `PropFn<TSelf, TValue>` → `PropFn<TValue>`                               | 删 TSelf；callable + GlobalKw map 返回 `void`                                            |
| `ColorPropCarrier<TSelf, ...>`                                           | 删 TSelf；callable + keyword map 返回 `void`；token map 返回 `ColorTokenValue`（无泛型） |
| `ColorTokenValue<TSelf>` → `ColorTokenValue`                             | 删 TSelf；11 个 modifier 全部返回 `void`                                                 |

### 2. `scripts/generate-properties.mjs` —— renderTypeExpr 同步

- `PropFn<TSelf, ${v}>` → `PropFn<${v}>`
- `PropCarrier<TSelf, ${v}, ...>` → `PropCarrier<${v}, ...>`
- `ColorPropCarrier<TSelf, ...>` → `ColorPropCarrier<...>`
- `LengthUnits<TSelf>` → `LengthUnits`
- `IcxPropMethods<TSelf, T extends ThemeSchema>` → `IcxPropMethods<T extends ThemeSchema>`

### 3. `packages/core/src/chain/Chain.ts`

- `extends IcxPropMethods<Chain<T>, T>` → `extends IcxPropMethods<T>`
- Chain 自身 89 个内建方法 `: this` **保留**（设计原则 3）

### 4. `packages/core/src/types/properties.generated.ts`

`node scripts/generate-properties.mjs` 重生成 —— 195 个 PropCarrier / ColorPropCarrier + 662 个 PropFn 全部用新签名。

### 5. `packages/core/src/types/docs-zh/*.ts` —— JSDoc 示例 statement-only

40+ 处 fluent 链式示例改写为多行 statement。涉及文件：`animation.ts` / `border.ts` / `box.ts` / `colors.ts` / `flex.ts` / `interaction.ts` / `layout.ts` / `misc.ts` / `scroll.ts` / `svg.ts` / `transform.ts` / `typography.ts`。

特例：

- `border.ts` "❌/✅" 教学对比：注释挪到 statement 上方而非尾部，避免语义模糊
- `colors.ts` 描述句内 inline 示例用 `; ` 分号分隔（避免破坏段落流）

### 6. `packages/core/README.md`

- "颜色 token modifier" 行从 fluent `s.color._primary.alpha(50).darken(15)` 改为 `s.color._primary.alpha(50)`，并补充 "modifier 覆盖式、不累积" 的语义说明
- 新增 "类型层 statement-only" 特性条目

### 7. 测试调整

- `tests/types.spec.ts`：
  - `ColorTokenValue<typeof c>` → `ColorTokenValue`（删泛型）
  - `toEqualTypeOf<typeof c>()` → `toBeVoid()`（setter / unit method 返回类型断言）
- `tests/batch4-modern-css.spec.ts`：1 处真 fluent `c._safeArea('bottom').overflow('auto')._scrollSnap(...)` 拆 3 条 statement
- `tests/w6-generator.spec.ts`：parity regex 删 TSelf 匹配项

---

## 关键决策点

### 决策 1：删 TSelf 类型参数，不只是把所有 TSelf 改成 void

**选择**：彻底删 TSelf 参数

**理由**：

- 既然返回类型是 `void`，TSelf 完全不被使用，未使用的类型参数让签名混乱
- 删除让 generator 输出更短、更清晰
- 改动面虽然多一处 generator 同步，但本就在改 generator

**放弃**：保留 TSelf 不用 —— 签名冗余，IDE hover 时显示一个无意义的类型变量

---

### 决策 2：保留 Chain 自身内建方法的 `: this`

**选择**：carrier / modifier 改 void；Chain 内建方法（`_hover` / `_apply` / `_media` / etc.）保持 `: this`

**理由**：

- 用户原话明确是"一条语句只描述一行 css"。`_hover(fn)` 是 block 容器，不是"一行 css"
- 改 Chain 内建方法的返回类型涉及 ~89 个方法 body 的 return 语句，工作量大、风险高
- 仍允许 `s._hover(fn)._active(fn2)` 这种 block 连写（runtime 已支持），对用户体验是友好的
- 用户主要痛点 = carrier 表达式之后 IDE 弹整个 Chain 表面，本次决策已解决
- 后续若用户要求"也不要 `_hover._active` 链式"，可单独再做迁移

**放弃**：所有 method 一刀切改 void —— 风险大，收益小

---

### 决策 3：ColorTokenValue.modifier 也返回 void

**选择**：`s.color._primary.alpha(50)` 之后即终结，不允许 `.alpha(50).darken(15)`

**理由**：

- 既有设计就说明 modifier 不累积、后者覆盖前者，链式 modifier 实际上是误导
- 类型层禁止链式正好与"覆盖式"语义对齐
- 一个 token 只能用一个 modifier 决定最终色值，符合"一行 css = 一个值"

**放弃**：modifier 之间允许链式累加（已被既有设计否决）

---

### 决策 4：docs-zh / README 全面改写为 statement-only

**选择**：JSDoc 示例 + README 示例全部改为多行 statement

**理由**：

- 文档与类型签名必须一致 —— 旧 fluent 示例在新签名下编译会红，文档不能教用户写编译错的代码
- generator 把 docs-zh JSDoc 编译进 `properties.generated.ts`，所有 IDE hover 提示都会读这些示例
- 文档教学风格直接影响用户学习路径

**放弃**：留 fluent 示例只改类型 —— 文档反向教学，IDE hover 会让用户更困惑

---

### 决策 5：Chain.color 等 carrier 字段的 IDE 显示

**选择**：carrier 类型是 `((value: TValue) => void) & { [K in TTokens]: ColorTokenValue } & { [K in TKeywords]: void } & TUnits`

**实际表现**：

- `s.color.` → IDE 显示 color tokens（`_primary` / `_success` / etc.）+ CSS color keywords（`white` / `red` / `currentColor` / etc.）+ unit methods（如非 color 属性也是 carrier）+ extra-keyword（如有）
- `s.color._primary.` → IDE 只显示 11 个 ColorTokenValue modifier（alpha / darken / etc.）
- `s.color._primary.alpha(50).` → IDE 只显示 `Object.prototype` 几个方法（toString / valueOf / 等），不再爆 Chain 表面
- `s.color.currentColor.` → 同上，干净

**完美对齐用户诉求**：每条 setter 表达式终结，IDE 补全只在该终结的地方展开 token 选项或 modifier 窗口，永不泄漏 Chain 自身。

---

## 不在本次任务范围

- **Chain 内建方法（`_hover` / `_apply` / `_media` / 等 89+）返回类型** —— 仍是 `: this`，允许 block 连写（决策 2）。未来若用户要求一刀切，可独立再做。
- **runtime 行为** —— Proxy / chain mutation / `_node` 切换等运行时实现完全不动；只动类型层。
- **`ColorTokenValue` 的 modifier 累积语义** —— 既有设计就是覆盖式，本次不动。
- **examples / bench / ui-vue components** —— 这些代码内已经用的是 modifier 调用（`h.backgroundColor._primary.alpha(85)`，合法）或 statement 写法，无需改动。

---

## 验证

| 验证                                                  | 结果                                          |
| ----------------------------------------------------- | --------------------------------------------- |
| `pnpm --filter @kenconnet666/zui-core run type-check` | ✅ 通过                                       |
| `pnpm --filter @kenconnet666/zui-core test -- run`    | ✅ 30 文件 / 610 tests 全绿（含 parity test） |
| `pnpm --filter @kenconnet666/zui-core build`          | ✅ vite build OK；dts 1.7s 生成               |
| `node scripts/generate-properties.mjs`                | ✅ 输出无 drift（再跑同结果）                 |
| IDE 实际补全                                          | `s.color.currentColor.` 不再弹 Chain 表面     |

---

## 后续

- 后续如有用户写 `s.color.red.padding.px(8)` 这种连写，TS 会编译错（`Property 'padding' does not exist on type 'void'`），错误信息明确，引导用户拆 statement
- `.claude/skills/zui.md` §8.10 已同步措辞，强调"类型层 statement-only"而非仅设计准则
- 决策的"渐进可扩展"：若未来用户也想禁掉 `_hover._active` 链式，把 Chain 内建方法的 `: this` 改 `: void` 即可（runtime body 的 `return this` 同步删）
