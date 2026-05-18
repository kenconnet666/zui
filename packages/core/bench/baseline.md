# Bench baseline（0.2.0）

测试环境：Windows 11 / Node 24 / Vitest 4 / @emotion/css 11.13.5
跑法：`pnpm --filter @kenconnet666/zui-core bench`

---

## 单条 className 产出（同样 4 个属性）

| Case | hz (ops/s) | mean (ms) | 相对原生 |
|---|---:|---:|---:|
| `emotion css()` 原生（baseline） | **918,584** | 0.0011 | 1.00× |
| `new Chain + toString`（链式 + carrier 缓存） | 19,138 | 0.0523 | 48.00× 慢 |
| `icss(theme, fn)` shortcut | 19,620 | 0.0510 | 46.82× 慢 |

## 嵌套伪类 + 多属性（典型按钮场景）

| Case | hz (ops/s) | mean (ms) | 相对原生 |
|---|---:|---:|---:|
| `emotion css()` 嵌套 baseline | **566,996** | 0.0018 | 1.00× |
| icss 嵌套（5 属性 + `_hover` + `_focusVisible`） | 16,804 | 0.0595 | 33.74× 慢 |

## Chain 实例化开销

| Case | hz (ops/s) | mean (ms) |
|---|---:|---:|
| `new Chain(theme)` 仅构造 | 20,858 | 0.0479 |
| `Chain.color._primary` 单 carrier 访问 | 20,803 | 0.0481 |

→ 构造本身约 48μs；单次 carrier 访问几乎不增加成本（缓存生效）。

---

## 结论

- icss / Chain 单次开销 **~50μs**（19k ops/s），适合"每次 render 重建" 模式。
- 比原生 emotion `css()` 慢 ~46×（比 Plan §一 决策 15 预期的 2-3× 高）。
- 主要开销在 `new Chain` 构造：每次都重建 `_keymap`（253 个 color tokens × n 个 category）。
- 实际应用感知：100 个 dynamic chain / render → 5ms，浏览器一帧 16ms 仍宽裕。

## 后续优化候选（不在 0.2.0 范围）

1. **`_keymap` 缓存到 Theme 实例**：buildKeymap 一次性算完挂在 `theme._keymap`，Chain 直接复用。预估 hz 可翻 2-3×。
2. **Carrier 模板共享**：把无关 chain 实例的 carrier 工厂逻辑提到 module scope，instance 只持 callback 闭包。
3. **冻结 token slot 引用**：`_theme[cat]` 在 carrier 闭包里多次 `[]` 访问，可在 build carrier 时一次性 capture。

---

跑测试时若发现性能退化超 10%，请重新跑 bench 对比此 baseline。
