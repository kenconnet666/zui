# Prop 形态决策 — factory + Size5 枚举档位 union

> 日期:2026-05-22
> 状态:**Accepted** —— 撤销 roadmap §1 L15 + skill §13.0 ① "chain factory only" 锁定
> 影响:zui-vue 全库 ~25-30 个组件 props 签名

---

## 背景:设计哲学已经裂开

roadmap §1 L15 + skill §13.0 ① 锁定的"chain factory only"在实施过程中没人遵守:

| 形态 | 组件数 | 代表 |
|---|---|---|
| 纯 factory | 6 | ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZSpace |
| 纯 3 阶枚举 | 15+ | ZInput / ZSelect / ZForm / ZPagination / ZProgress / ZRate / ZTag / ZButton / ZSegmented / ZSpin / ZAutoComplete / ZInputNumber / ZDatePicker / ZTreeSelect / ZDescriptions / ZList |
| 混合 union | 1 | ZAvatar(`number \| 'small' \| 'middle' \| 'large'`) |
| 纯 number/string | 3 | ZDrawer / ZQRCode / ZSplit |

实际现实是 **carrier factory 对 happy path 太啰嗦**,大部分组件回退到枚举档位。这不是漂移,是承认现实。

---

## 决策:统一为 `factory | Size5 | undefined` union

```ts
type Size5 = 'tiny' | 'small' | 'middle' | 'large' | 'huge'

// 单 carrier 维度(ZIcon size 只影响 width)
size?: ((c: Chain<ZuiSchema>['width']) => void) | Size5

// 多 carrier 维度(ZInput size 同时影响 padding + fontSize)
size?: ((s: Chain<ZuiSchema>) => void) | Size5
```

**用户写法**:

```vue
<!-- happy path,99% 的场景 -->
<ZInput size="middle" />

<!-- factory 逃生口,需要超出预设的尺寸 -->
<ZInput :size="(s) => { s.height.iem(2.5); s.fontSize.iem(1.1) }" />
```

---

## 5 个核心理由

1. **承认现实** —— 实际全库已经分两派,统一为 union 是规范化双轨
2. **happy path 简洁** —— 大多数业务方写 `size="middle"`,不需要每次写 factory
3. **逃生口完整** —— 超出预设的需求走 factory,不阻塞高级用户
4. **theme schema 干净** —— 不需要塞 `inputSizeSmall` / `buttonHeightMiddle` 这种破碎 token
5. **iem 联动保持** —— 枚举档位内部用 `s.height.iem(N)` 实现,ZBox `:iem` 全站缩放依然生效

---

## 取舍

- ❌ 失去"业务方全局覆盖单组件 size token"能力 —— 业务方有 2 条退路:① ZBox `:iem` 全站缩放(已存在)② 包装自己的组件
- ❌ 枚举档位映射写在组件文件内 const map —— 调整需改源码,不能 runtime fork。**这是有意权衡**:简化 > 灵活
- ❌ 跟 roadmap §1 L15 / skill §13.0 ① "chain factory only" 锁定决策冲突 —— **本决策撤销之**

---

## 锁定的执行规则

### R1 — 5 阶 vs 3 阶

**统一 5 阶 `tiny | small | middle | large | huge`**,跟 theme schema 5 阶 size scale 对齐。组件如果只想实现 3 阶(small/middle/large),写 SIZE_MAP 时手动让 tiny/huge fallback 到 small/large。

### R2 — 默认值

`size: 'middle'`(字符串)。简洁可读,统一所有组件 happy path。

### R3 — 数字字面量

ZAvatar / ZDrawer 等的 `number` 字面量**不保留**,改为 `factory | Size5`。极少数语义化为 px 数字的组件(ZQRCode / ZSplit)可保留 `number`。

### R4 — variant / type / shape 等枚举

**不动**。`variant: 'filled' | 'outlined' | 'text' | 'ghost' | 'link'` 这种是"完全不同样式结构的开关",不是连续档位,没有 factory 等价物。

### R5 — boolean 状态

不动(`disabled?: boolean` 永远是布尔)。

### R6 — 实现规范

每组件文件内一个 const `SIZE_MAP: Record<Size5, (target: T) => void>`,通过 `_internal/size-prop.ts` 的 `applySizeProp(props.size, SIZE_MAP, target)` helper 统一应用。**不再用** `typeof props.size === 'string' ? MAP[props.size] : props.size` 这种散落 ternary。

### R7 — 类型 helper 位置

`_internal/size-prop.ts` 导出:
- `Size5` —— 通用枚举类型
- `SizeProp<K>` —— 单 carrier 维度 helper
- `SizePropMulti` —— 多 carrier 维度 helper
- `applySizeProp` —— 应用 helper(自动判断 string vs factory)

---

## BREAKING 评估

**对业务方代码的影响**:

| 当前用法 | 新方案 | 兼容性 |
|---|---|---|
| `<ZInput size="middle">` | 同 | ✅ 兼容 |
| `<ZIcon :size="(w) => w.iem(1.5)">` | 同 | ✅ 兼容 |
| `<ZAvatar :size="32">` | `<ZAvatar :size="(w) => w.px(32)">` | ❌ BREAKING |
| `<ZAvatar size="middle">` | 同 | ✅ 兼容 |

ZAvatar 是唯一现有 BREAKING 点,其它都是**新增**枚举档位 / 新增 factory 路径,不破坏现有写法。

---

## 跟其它决策的关系

- **撤销** L15 `6 维度 carrier factory + cssRoot(改 css) 范式` 中的"全 factory"约束(carrier factory 仍是首选范式,但允许并存枚举档位)
- **撤销** L16 ~~"6 维度 carrier factory + 状态 prop"~~ —— **保留**,这条说的是 prop 维度划分,不冲突
- **保留** L15 "css 兜底" / L5 "复合组件 sx{Name}" / L7 "图标" / L13 "工具 hooks VueUse 优先" 等所有其它锁定决策

---

## 后续动作

1. 新建 `src/_internal/size-prop.ts`(本次)
2. 改 25-30 个组件 props(本次)
3. 更新 roadmap L15(本次)
4. 更新 skill §13.0 ①(本次)
5. CHANGELOG 写 BREAKING entry(本次)
6. 后续 PR 中如增 size 类 prop,严格走 `SizeProp<K>` / `SizePropMulti` / `applySizeProp` 三件套
