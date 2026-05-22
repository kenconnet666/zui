# 字符串逃生舱（String Escape Hatch）—— core chain setter 字符串形式支持 token / unit / color 操作

**日期**: 2026-05-22  
**作者**: Claude (无人值守任务)  
**状态**: 实施

---

## 背景

zui-core 的 chain API 当前有 4 种 setter 形态:

| 形态                  | 例子                                | 类型补全          |
| --------------------- | ----------------------------------- | ----------------- |
| 字面量 fn             | `s.color('red')` / `s.width('20px')`| 弱(string)        |
| token shortcut        | `s.color._primary`                  | **强**(枚举)      |
| unit method           | `s.width.px(20)` / `s.width.zu(2)`  | **强**(数字)      |
| color modifier        | `s.color._primary.alpha(50)`        | **强**            |

**痛点**: chain shortcut / unit method 体验最好,但**只能在 ENHANCED_PROPS 注册的属性上工作**。
对于非 enhanced 的属性（如未来加的实验性 CSS prop / 用户从其他工具复制粘贴的字符串值 / 动态拼接的字符串）,只能走"字面量 fn",失去 token 与 unit 系统的语义价值。

用户提出"字符串逃生舱"需求 —— 让 fn 形态也能解析特殊字符串(`'_primary'` / `'_zu(2)'` / `'_primary.alpha(50)'`),既保留运行时灵活性,又复用 token / color2k / 单位系统。

---

## 设计原则

1. **不破坏现有 API** —— 所有现状用法零改动通过。  
2. **trigger 必须明确** —— 只有以 `_` 开头的字符串才尝试解析,普通字面量(`'red'` / `'20px'` / `'#abc'`)零成本通过。
3. **强类型层不变** —— chain shortcut / unit method / color modifier 仍是主推 API,字符串逃生舱**只在运行时层**做事,不污染类型签名。
4. **运行时解析失败默默回落到字面量** —— 不抛错,因为用户可能写 `'_animation-name'` 这种确实是 css 字面量。
5. **不依赖外部依赖** —— 复用 keymap / color.ts / units.ts 现有基础设施。

---

## 选定的字符串语法

### 单条 token

```ts
s.color('_primary')                  // = s.color._primary
s.padding('_middle')                 // = s.padding._middle (carrier 已知 cat=spacing)
s.outlineColor('_primary')           // 即使该 prop 不在 ENHANCED_PROPS,也会全 schema 扫描命中
```

### unit 单位

```ts
s.width('_px(20)')                   // = '20px'
s.width('_zu(2)')                    // = 'calc(2 * var(--zui-unit, 1px))'
s.width('_em(1.5)')                  // = '1.5em'
s.padding('_rem(1)')                 // = '1rem'
s.transitionDuration('_ms(300)')     // = '300ms'
s.transform('_deg(45)')              // (虽然 transform 不是 angle carrier, 字符串仍解析)
```

### token + color 操作链

```ts
s.color('_primary.alpha(50)')        // = setAlpha(theme.color.primary, 0.5)
s.color('_primary.shade(20)')        // 与黑混 20%
s.color('_primary.shade(20).alpha(80)')   // 链式
s.color('_primary.mix(_danger, 30)') // 与另一 token 混色
s.color('_primary.lighten(15)')      // HSL 增亮
s.color('_primary.complement()')     // 补色
```

支持的 11 个 color 操作完全复用 `chain/color.ts`:
- `alpha(n)` —— 注意 `n` 取 0-100(百分比),内部 / 100;与 chain modifier `.alpha(50)` 一致
- `darken(n)` / `lighten(n)` —— HSL 0-100
- `mix(other, n)` —— other 可是字面量或 `_token`,n 取 0-100
- `saturate(n)` / `desaturate(n)` —— 0-100
- `shade(n)` / `tint(n)` —— RGB 混黑/白,0-100
- `complement()` / `rotateHue(deg)` / `invert()` —— 无 n 或角度

### 字面量原样通过

```ts
s.color('red')                       // 不以 _ 开头, 原样
s.width('20px')                      // 同上
s.border('1px solid #abc')           // 同上
s.fontFamily('Open_Sans')            // 含 _ 但不以 _ 开头, 原样
```

---

## 关键决策点

### 决策 1: 解析 trigger 是 `startsWith('_')` 而非 `includes('_')`

**选择**: `value.startsWith('_')`

**理由**: 字面量 CSS 值如 `'Open_Sans'`, `'my_custom_value'` 在 CSS 里合法存在,只检测开头 `_` 避开误判。

**放弃**: 全模式 regex match —— 性能成本高(每次 setter 调用都跑 regex),且 false positive 可能性大。

---

### 决策 2: token 反查策略 —— 优先用 carrier cfg.tokenCat, 失败 fallback 全 schema 扫描

**选择**: 两阶段反查
1. 若 carrier 有 `cfg.tokenCat`(例 `s.color` → cat=color),先在 `keymap.get('color')` 找 `_primary`
2. 若上一步 miss,遍历所有 category,找第一个匹配的 ident

**理由**: 阶段 1 命中常见场景(`s.color('_primary')`),零额外成本。阶段 2 覆盖未注册到 ENHANCED_PROPS 的属性(`s.outlineColor('_primary')` —— `outlineColor` 可能没 cfg,但 `_primary` 是 schema 内合法 token)。

**放弃**: 始终全扫描 —— 性能差,且阶段 1 命中已经覆盖 90% 场景。

---

### 决策 3: color 操作链语法是 `.method(args)`(点号)而非 `/` 或 `|`

**选择**: `'_primary.alpha(50)'` 点号链式

**理由**: 与 chain modifier `s.color._primary.alpha(50)` 的 TS 写法完全镜像,用户从强类型形态迁移到字符串形态零认知成本。

**放弃方案**:
- `'_primary/alpha(50)'` —— 用户的最初描述提到了 `/`,但 `/` 在 CSS 里有强语义(`background-position/size`, `font: size/line-height`,grid `1 / 3`),会与未来扩展(直接支持 css shorthand 字符串)冲突。
- `'_primary | alpha(50)'` —— pipe 不像 ts 习惯。
- `'_primary alpha(50)'`(空格) —— CSS shorthand 用空格区分多值,冲突。

---

### 决策 4: color modifier 参数语义跟 chain modifier 完全对齐

**选择**: `'_primary.alpha(50)'` 中 `50` 表示 50%(内部 / 100 = 0.5),与 `s.color._primary.alpha(50)` 一致。

**理由**: 单一心智模型;用户在 chain 与字符串两种形态间切换不需要换算。

**放弃**: `alpha(0.5)` 用 0-1 浮点 —— 跟 chain 不一致会造成混乱。

---

### 决策 5: unit 字符串形态用 `_unitIdent(N)` 而非 `Nunit`

**选择**: `'_px(20)'` / `'_zu(2)'` / `'_em(1.5)'`

**理由**: 与 chain method `s.width.px(20)` / `s.width.zu(2)` 完全镜像,前缀 `_` 与 token 形态统一(都是"escape 标记")。`'_zu(N)'` 也直观保留 zu 是逻辑单位的意涵。

**放弃**: `'20px'` 解析 —— 这种已经是合法 CSS 字面量字符串,**不需要解析也不该解析**(用户用了字面量就是要字面量,zui 不应隐式改写)。

---

### 决策 6: 解析失败的兜底行为 —— silent fallthrough + dev warn

**选择**:
- 以 `_` 开头但 token 反查失败 → 原样写入 + `console.warn` (dev mode)
- 完全格式错误(无法 parse 链式)→ 原样写入 + warn
- 不以 `_` 开头 → 原样写入,零开销

**理由**: 抛错会让 chain 中断,用户体验差。warn 足够引导用户排错。

**放弃**: throw —— 太破坏性。

---

### 决策 7: zu 单位"改为纯 TS 变量" —— 加 `zuWith()` 工厂,保留默认 `zu()` 不变

**用户原话**: "zu 单位改为纯 ts 变量"

**选择**: 不改 `zu(n)` 现行实现(继续返回 `calc(N * var(--zui-unit, 1px))`),**新增** `zuWith(base)` 工厂函数 —— 纯 TS 计算,不依赖 css var。

```ts
// 默认(走 css var, Provider cascade)
zu(8)                          // 'calc(8 * var(--zui-unit, 1px))'

// 自定义基准(纯 TS,无 css var 依赖)
const zu2x = zuWith('2px')
zu2x(8)                        // '16px'        ← 编译期已算好

const zuRem = zuWith('0.0625rem')
zuRem(16)                      // '1rem'

// 复杂 css 表达式(无法 TS 解析) → 退化到 calc()
const zuFluid = zuWith('clamp(0.5px, 0.1vw, 2px)')
zuFluid(8)                     // 'calc(8 * clamp(0.5px, 0.1vw, 2px))'
```

**理由**:
- `<ZConfigProvider :unit>` 走 css cascade 是有意设计(嵌套覆盖零运行时开销),不应替换。
- 但 SSR / 静态站点生成 / 测试场景需要"在 TS 层就把 zu(N) 算成具体 px",`zuWith(base)` 提供这个 escape。
- 不引入全局可变状态(`setZuiUnit()` 那种 module-level setter)—— 全局状态在 SSR / 多实例 / 测试隔离里都是坑。`zuWith` 是工厂,纯函数,无副作用。

**放弃方案**:
- `setZuiUnit('2px')` 全局副作用 setter —— SSR 不安全。
- 让 `zu(n)` 默认就走 TS 计算 —— 破坏 Provider cascade 优势。

---

### 决策 8: 字符串逃生舱不污染类型签名(`PropFn` 仍是 `(v: string) => Chain`)

**选择**: 实现纯在 runtime,`PropFn` 接口签名不变(仍接 `string | number | GlobalKw`)。

**理由**: 类型层暴露 union(`'_primary' | '_success' | ...`)会让用户 IDE 提示爆炸 + 误以为这是首推 API。字符串逃生舱定位是"复制粘贴友好的逃生口",不是类型补全主战场;主战场永远是 chain shortcut / unit method。

**文档承诺**: 注释 + 决策文档明确告知"字符串逃生舱**优先级低于** chain shortcut,只在动态拼接 / 复制粘贴时使用"。

---

## 实现拓扑

```
packages/core/src/chain/
├── escape.ts            (新) —— resolveStringValue(value, cfg, theme, keymap)
├── carrier.ts           (改) —— target fn 在赋值前调 resolveStringValue
├── units.ts             (改) —— 新增 zuWith(base: string | number)
└── color.ts                    —— 复用现有 11 个函数
```

**escape.ts API**:

```ts
/**
 * 字符串逃生舱解析器。在 carrier setter 内调用,识别 `_` 开头的特殊字符串并解析为最终 css 值。
 *
 * 4 种识别模式:
 *   1. `_tokenIdent`              → keymap 反查(优先 carrier.tokenCat, fallback 全扫)
 *   2. `_unitIdent(N)`            → withUnit(N, ident)
 *   3. `_tokenIdent.modifier(...).modifier(...)`  → token 反查 + color2k 链式
 *   4. 无法解析                    → 原样返回 + dev warn
 *
 * 不以 `_` 开头的字符串:直接 untouched 返回(零开销快速路径)。
 */
export function resolveStringValue(
  value: string,
  carrierCfg: { tokenCat?: string } | undefined,
  theme: Record<string, Record<string, string | number>>,
  keymap: Map<string, Map<string, string>>,
): string | number
```

---

## 测试覆盖（packages/core/tests/escape.spec.ts）

按语法分组,每组覆盖正向 + 边界 + 失配:

1. **token 直读** — 5 个语义色 + carrier 内 + 跨 carrier + miss fallback
2. **unit** — px / em / rem / zu / cqw / pct / 时间(ms/s) / 角度(deg) / 失配回字面量
3. **color modifier** — 11 个函数全覆盖 + 链式 + mix 中嵌套 token + 0/100 边界
4. **zuWith** — 数字 / px / rem / vw / calc / clamp / 失败兜底
5. **无 trigger 快速路径** — 普通 CSS 值零干扰
6. **与现有 API 平等** — `s.color('_primary')` 和 `s.color._primary` 产出 className 一致

---

## 风险与不做的事

| 风险 | 应对 |
| --- | --- |
| 字符串里嵌 `_other_token` 当作 token 解析?(如 `'1px solid _primary'`) | **不做** —— 只匹配整串以 `_` 开头的形态;mixed 字符串(`'1px solid _primary'`)不解析,要写 mixed 走 `${`1px solid ${zuiLight.color.primary}`}` |
| Provider cascade 与 `zuWith` 同时存在,用户混用引起困惑 | 决策文档明确两者用途互补 + jsdoc 写清楚 |
| `_primary.alpha(50)` 解析时 `mix(_danger, 30)` 嵌套 token 反查 | 实现内做单层递归(够用),不支持任意嵌套(`mix(_a.alpha(50), 30)` 这种暂不支持) |
| token 全扫描在大 schema 下性能 | keymap 已结构化 `Map<cat, Map<ident, key>>`,遍历 ~20 cat × ~10 ident = 200 次 lookup,微秒级,可接受 |

---

## 不在本次任务范围

- 字符串里的 `var(--xxx)` 自定义属性解析 —— 用户自己写 css var 就好,不需要 zui 介入。
- 多值 shorthand 字符串解析(`'1px solid _primary'`) —— 复杂度过高,价值低(用户可拆成 borderWidth + borderStyle + borderColor)。
- 类型层 union 补全 `s.color('_primary' | '_success' | ...)` —— 决策 8 已排除。

---

## 后续

实现 + 测试通过后,可能需要在 `.claude/skills/zui.md` 加一节"字符串逃生舱"。当前任务范围内不做,作为 skill 后续维护项。
