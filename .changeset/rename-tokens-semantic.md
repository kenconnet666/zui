---
'@kenconnet666/zui-core': minor
---

★ BREAKING — 系统 token 6 个 category 改语义化命名

### 改造范围

| Category | 旧（Tailwind 风）| 新（语义化） |
|---|---|---|
| **spacing** | `xs / sm / md / lg / xl`（5） | `tiny / small / middle / large / huge`（5） |
| **fontSize** | `xs / sm / md / lg / xl`（5） | `tiny / small / middle / large / huge`（5） |
| **radius** | `sm / md / lg / full`（4） | `none / tiny / small / middle / large / huge / full`（7） |
| **shadow** | `sm / md / lg`（3） | `tiny / small / middle / large / huge`（5） |
| **blur** | `none / xs / sm / base / md / lg / xl / 2xl / 3xl`（9，杂） | `none / tiny / small / middle / large / huge`（6） |
| **breakpoint** | `sm / md / lg / xl / 2xl`（5） | `tiny / small / middle / large / huge`（5） |

### 不变（已语义化 / 不属 size 维度）

`color` / `fontWeight` / `duration` / `easing` / `lineHeight` / `letterSpacing` / `zIndex` / `opacity` / `aspectRatio`

### 影响 API

**用户访问**：
```diff
- s.padding._md          → s.padding._middle
- s.fontSize._lg         → s.fontSize._large
- s.borderRadius._sm     → s.borderRadius._tiny
- s.boxShadow._md        → s.boxShadow._middle
- s._blur('_sm')         → s._blur('_small')
- s._media('_md', ...)   → s._media('_small', ...)   (768px = 旧 md = 新 small)
```

**注意 breakpoint 值的位移**：
- 旧 `_md` = 768px → 新对应 `_small`
- 旧 `_lg` = 1024px → 新对应 `_middle`
- 旧 `_xl` = 1280px → 新对应 `_large`
- 旧 `_2xl` = 1536px → 新对应 `_huge`
- 新加 `_tiny` = 640px（旧 sm）

**Chain `_container*` helper 重命名**：

```diff
- _containerSm / _containerMd / _containerLg / _containerXl / _container2xl
+ _containerTiny / _containerSmall / _containerMiddle / _containerLarge / _containerHuge
```

### 数值变化

- `radius._middle` = '12px'（旧 `_md` 是 8px，新 `_middle` 是 7 档中间值 12px）
- `radius._tiny` = '4px'（旧 `_sm` 同值）
- `blur._middle` = '16px'（旧 `_md` 是 12px，新 6 档中间值 16px）
- `blur._small` = '8px'（旧 `_sm` 是 4px）
- 新增 `radius._none / _huge`、`blur._none / _tiny / _huge`、`shadow._tiny / _huge`

### 迁移指南

升级 0.6.0 时：

1. **所有 `._xs / ._sm / ._md / ._lg / ._xl / ._2xl / ._3xl` 替换**：
   ```
   ._xs → ._tiny
   ._sm → ._small
   ._md → ._middle
   ._lg → ._large
   ._xl → ._huge
   ._2xl → ._huge      # schema 不再有 2xl
   ._3xl → ._huge      # schema 不再有 3xl
   ._base → ._small    # blur 删 base
   ```

2. **`_media` / `_container` / `_blur` 字符串参数同样替换**：
   ```ts
   _media('_md', ...)  → _media('_small', ...)   // 768px 现在叫 small
   _blur('_md')        → _blur('_middle')        // 12px → 16px
   ```

3. **`_containerSm` 等 Chain helper 重命名**：见上表

4. **数值断言**：`radius._middle = 12px`（之前 `_md = 8px`）。如果用户做了"基于旧档位值"的测试，需要适配。

### 修改文件统计

- 6 个核心 src 文件（schema / light / dark / Chain）
- 14 个测试文件（grep 替换 + 数值调整）
- 4 个 framework recipe
- README
- examples（vue / react / vanilla）
- bench

测试 549/549 全绿；build 75.58 kB / gzip 19.64 kB（+0.34 kB）。

理由：
- variant key（组件 size 'tiny/small/middle/large/huge'）与 theme token 命名统一
- 避免与 Tailwind 思维耦合（sm/md/lg 在不同场景含义不同）
- 设计意图更清晰：`_middle` 是"5 档中间"，`_large` 是"较大"，比 `_md` 表义更明确
