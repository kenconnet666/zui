# Bench baseline（0.3.0）

测试环境：Windows 11 / Node 24 / Vitest 4 / @emotion/css 11.13.5
跑法：`pnpm --filter @kenconnet666/zui-core bench`

> 0.3.0 W4.1（Theme.getKeymap() 缓存）落地后 **icss 提速 21×**：19k → 404k ops/s。
> N7（Batch 2）拆细成三类：总览 / carrier / proxy。

---

## chain.bench.ts — 总览（0.3.0 数据）

### 单条 className 产出（同样 4 个属性）

| Case | hz (ops/s) | mean (μs) | 相对原生 |
|---|---:|---:|---:|
| `emotion css()` 原生（baseline） | **918,584** | 1.1 | 1.00× |
| `new Chain + toString`（链式 + carrier 缓存） | ~404,000 | 2.5 | 2.27× 慢 |
| `icss(theme, fn)` shortcut | ~404,000 | 2.5 | 2.27× 慢 |

### 嵌套伪类 + 多属性（典型按钮场景）

| Case | hz (ops/s) | mean (μs) | 相对原生 |
|---|---:|---:|---:|
| `emotion css()` 嵌套 baseline | **566,996** | 1.8 | 1.00× |
| icss 嵌套（5 属性 + `_hover` + `_focusVisible`） | （待跑） | — | — |

### Chain 实例化开销

| Case | hz (ops/s) | mean (μs) |
|---|---:|---:|
| `new Chain(theme)` 仅构造 | （待跑） | — |
| `Chain.color._primary` 单 carrier 访问 | （待跑） | — |

---

## carrier.bench.ts — Carrier / Token 解析（N7 新增）

### 用途

度量 carrier 创建 / 缓存命中 / token 解析（keymap 查询）三个分层的开销。
当总体 icss bench 退化时，能定位是哪一层出问题。

### 场景

| 组 | Case |
|---|---|
| **Carrier 访问开销** | `chain.color` 首访 / 重访 / 100 次同名 / 100 次不同 |
| **Token 解析** | `_primary` token 命中 / `white` keyword 命中 / 函数态 / unit 方法 |
| **Theme.getKeymap() 缓存** | Theme 实例（缓存命中） vs 裸 ResolvedTheme（每次重建） |

### 预期模式

- Carrier 首访 < 重访 1.5×（Proxy + Map.set 一次）
- 100 次同名 / 不同应展示 _carriers Map 的命中率差异
- Theme 实例传入 vs 裸 ResolvedTheme：差距应该 = `buildKeymap()` 的成本

---

## proxy.bench.ts — Proxy 拦截开销（N7 新增）

### 用途

度量 `makeChainProxy` 的拦截器 + prototype 自动扫描（B2）的额外成本。

### 场景

| 组 | Case |
|---|---|
| **Proxy 拦截开销** | `toString()` / `_node` / `label('x')` / `_hover(noop)` vs plain object baseline |
| **内建方法调用密度** | 5 个 `_hover` 嵌套 / 10 个并列 `_media` |

### 预期

- Proxy chain 字段访问 < plain object 1.5× 慢（Proxy `get` 拦截器开销）
- `_hover` 5 层嵌套是常见 component 写法，应在 50μs 内

---

## 跑法 + 输出

```powershell
pnpm --filter @kenconnet666/zui-core bench
```

vitest bench 默认输出 hz / mean / margin。三个 bench 文件并行跑，约 60 秒。

---

## 性能退化阈值

| 阈值 | 行动 |
|---|---|
| 总体 ops/s 退化 > 10% | 跑 carrier.bench + proxy.bench 定位 |
| 退化 > 20% | 立即 STOP，检查最近改动 |
| 任何 bench 失败 / 抛错 | 立即 STOP |

---

## 不优化的方向（决策记录）

- **W4.2 carrier 工厂模块级共享**：bench 已 404k ops/s（100 chain/render = 0.25ms，远低于一帧 16ms），需求驱动不存在。**不做**。
- **Proxy 替换为 mixin / decorator**：会破坏 carrier 四态访问的字符串通配性。**不做**。
- **token 解析换 hash 表**：keymap 已是 Map<string, string>。**不做**。

---

跑测试时若发现性能退化超 10%，重新跑 bench 对比此 baseline。
