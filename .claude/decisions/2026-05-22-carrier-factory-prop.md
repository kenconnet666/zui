# Carrier factory prop —— 组件维度 prop 从离散字符串改为 chain factory

**日期**: 2026-05-22
**作者**: Claude(用户授权自主执行)
**状态**: 实施完成(core + ui-vue type-check / 31+2 文件 670 tests / build 全绿)

**更新 2026-05-22 后续**:粒度从"size/spin 接整个 chain / color/depth 接单 carrier"统一为**所有 4 维度都接单 carrier**:
- `size` → `width` carrier(height 自动镜像 width)
- `color` → `color` carrier
- `depth` → `opacity` carrier
- `spin` → `animationDuration` carrier(name / iteration / timing 自动加)

API 极致一致,IDE 补全更聚焦,非正方形 / 自定义 easing 等不在单轴表达力内的需求统一走 cssRoot。详见下方 "决策 3 修订"。

---

## 背景

ZIcon 旧实现:每个外观维度是离散字符串枚举(`color: 'primary' | 'danger' | ...`),setup 内 switch 分派到对应 chain 调用:

```ts
// 旧 — 17 行 switch
switch (props.color) {
  case 'default': s.color.currentColor; break
  case 'primary': s.color._primary; break
  case 'success': s.color._success; break
  // ... 6 个 case
}
```

**用户实际诉求**:`:color="(c) => c._primary"` / `:color="(c) => c._danger.alpha(50)"` / `:color="(c) => c('#abc')"` —— 不再受离散枚举约束,直接传 chain factory 给组件 prop,setup 内一行应用。

理由(用户原话):
> 我的 idea 的下拉补全非常强大,能统计频率进行排列推荐,还能输入部分字母或者 `_` 下划线筛选主题 token 值,使用这种方式设计完主题直接挂组件库上非常简单方便,而且也简洁灵活。

这是组件设计范式级别的变化 —— 用 IDE 智能补全替代设计语言的硬约束,让维度 prop 暴露 carrier 全部能力(token / keyword / 字面量 / modifier 链 / unit method 等)。

---

## 设计原则

1. **每个外观维度 = 一个 chain factory prop** —— 不再有离散字符串枚举('primary' / 'large' / 'subtle' 等),所有维度都接受 `(c) => void` 工厂。
2. **carrier 类型直接复用 `Chain<S>[key]`** —— schema 扩展(`UserColorExt`)走声明合并,组件层无需引入 `ColorCarrierOf<S>` 等中间 alias。
3. **粒度匹配维度本身的语义**:
   - 涉及**单 carrier** 的维度(color = `s.color` / depth = `s.opacity`)→ factory 接 `Chain<S>['color']` 等
   - 涉及**多属性** 的维度(size = width+height / spin = animationName+duration+iteration+timing)→ factory 接整个 `Chain<S>`
4. **默认值表达"语义零位"**:
   - `color` 默认 `(c) => c.currentColor` —— 跟随父继承
   - `size` 默认 `(s) => { s.width.em(1); s.height.em(1) }` —— 1em 跟随父字号
   - `depth` / `spin` 不传 = 不写(等于 100% / 不旋转)
5. **设计语言的"档位"由 theme schema 承担** —— spacing / duration / opacity / fontSize 等 5 阶 token 在 schema 内集中管理;组件层不再硬编码 `SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP`。要 5 阶档位的用户写 `(o) => o._half` 或 `(s) => s.width.em(1.25)`,要 app 级调整走 `zuiLight.extend({ opacity: { half: 0.6 } })`。

---

## core 层改动

### `packages/core/src/types/carrier.ts` —— 加 self-ref factory 重载

每个 carrier 类型的 callable 上加第三个重载,把 carrier 自身作为入参传给 user factory:

```ts
export type PropCarrier<TValue, TTokens, TKeywords, TUnits = unknown, TExtra = never> =
  & ((value: TTokens) => void)
  & ((value: TValue) => void)
  & ((factory: (c: PropCarrier<TValue, TTokens, TKeywords, TUnits, TExtra>) => void) => void)  // ← 新增
  & { readonly [K in TTokens]: void }
  & { readonly [K in TKeywords]: void }
  & { readonly [K in TExtra]: void }
  & TUnits

export type ColorPropCarrier<TValue, TTokens, TKeywords, TExtra = never> =
  & ((value: TTokens) => void)
  & ((value: TValue) => void)
  & ((factory: (c: ColorPropCarrier<TValue, TTokens, TKeywords, TExtra>) => void) => void)  // ← 新增
  & { readonly [K in TTokens]: ColorTokenValue }
  & { readonly [K in TKeywords]: void }
  & { readonly [K in TExtra]: void }

export type PropFn<TValue> =
  & ((value: TValue) => void)
  & ((factory: (c: PropFn<TValue>) => void) => void)  // ← 新增
  & { readonly [K in GlobalKw]: void }
```

**类型层 self-reference 风险评估**:TypeScript 对 type alias 内的间接 self-reference 通常 OK(test 已验证),只要不触发循环展开。本次 `PropCarrier<...>` 在自己定义里以 `c: PropCarrier<...>` 出现,TS 把它当作 lazy reference,不展开 — type-check 通过。

### `packages/core/src/chain/carrier.ts` —— runtime 加 factory 分支

callable target 内增加 `typeof value === 'function'` 分支,把 carrier(Proxy 自身)传给 user factory:

```ts
function buildCarrier(chain, prop) {
  const target = function (value) {
    if (typeof value === 'function') {
      (value as (c: unknown) => void)(carrier)  // ← 把 carrier 自身传给 factory
      return chain
    }
    if (typeof value === 'string') {
      value = resolveStringValue(value, cfg, ...)
    }
    internal._node[prop] = value
    return chain
  }
  const carrier: unknown = new Proxy(target, { get(...) { ... } })
  return carrier
}
```

关键:`carrier` 声明在 `target` 之后,但 `target` 只有在 Proxy 构造完成后才会被外部调用,所以 closure 拿到的 `carrier` 总是已初始化的 Proxy 实例 —— 一个 hoisting 时序的常见模式。

### 测试覆盖

新增 `tests/carrier-factory.spec.ts`(18 tests):
- ColorPropCarrier factory:token / keyword / 字面量 / modifier / 字符串逃生舱 / noop default / 后者覆盖
- PropCarrier(非 color)factory:token / unit method / zu / keyword / opacity 字面量 / opacity token
- PropFn factory:GlobalKw / 字面量
- 组件 prop 范式集成:闭包外部状态 / 多 carrier 串联

---

## ZIcon 改造

### props 接口

```ts
export interface ZIconProps {
  size?: (s: Chain<ZuiSchema>) => void                  // 整个 chain(width + height 双轴)
  color?: (c: Chain<ZuiSchema>['color']) => void        // color carrier
  depth?: (o: Chain<ZuiSchema>['opacity']) => void      // opacity carrier
  spin?: (s: Chain<ZuiSchema>) => void                  // 整个 chain(animation 多属性)
  cssRoot?: (s: Chain<ZuiSchema>) => void               // 兜底逃生口

  component?: Component
  tag?: string
  label?: string
}
```

### setup 简化

```ts
icss(theme.value, (s) => {
  // base(不动)
  s.display.inlineFlex
  s.alignItems.center
  s.justifyContent.center
  s.flexShrink(0)
  s.lineHeight(1)

  // 4 维度 —— 5 行替代旧 30+ 行 switch + const map + 分支
  props.size(s)                                  // size factory 直接应用
  s.color(props.color)                           // color factory 通过 carrier 重载
  if (props.depth) s.opacity(props.depth)        // opacity factory
  if (props.spin) props.spin(s)                  // spin factory

  // cssRoot 兜底
  props.cssRoot?.(s)
})
```

**删除**:旧 `SIZE_MAP` / `DEPTH_MAP` / `SPIN_MAP` 三个 const 对象;旧 17 行 color switch;旧 spin 分支组装(4 行)。

### 默认值

```ts
withDefaults(defineProps<ZIconProps>(), {
  // Vue defineProps:prop 类型是 Function 时,default 直接是函数本身
  size: (s: Chain<ZuiSchema>) => {
    s.width.em(1)
    s.height.em(1)
  },
  color: (c: Chain<ZuiSchema>['color']) => {
    c.currentColor
  },
  tag: 'i',
})
```

**注意 Vue 行为**:`withDefaults` 对 Function 类型 prop,default 直接给函数本身(**不需要** `() => fn` 工厂语法 —— 工厂语法仅对 Object / Array 等其他引用类型生效)。这点踩了一次:用工厂语法时 Vue 不调用 factory,导致 default 永远不生效。

### 用户使用示例

```vue
<ZIcon :component="HeartIcon" :color="(c) => c._primary" />
<ZIcon :component="HeartIcon" :color="(c) => c._danger.alpha(50)" />
<ZIcon :component="HeartIcon" :color="(c) => c('#ff00aa')" />
<ZIcon :component="HeartIcon" :size="(s) => { s.width.em(1.5); s.height.em(1.5) }" />
<ZIcon :component="HeartIcon" :depth="(o) => o._half" />
<ZIcon
  :component="SpinnerIcon"
  :spin="(s) => {
    s.animationName(presetAnimations.spin)
    s.animationDuration.s(1)
    s.animationIterationCount.infinite
    s.animationTimingFunction.linear
  }"
/>
```

IDE 在每个 callback 内部都有完整补全:
- `c.` → 全部 color schema token (`_primary` / `_danger` / `_blue600` / ...)+ 146 CSS 命名色 + GlobalKw
- 输入 `_p` → 模糊筛选所有 `_p*` token(`_primary` / `_primaryHover` / `_pink500` 等)
- `c._primary.` → 11 个 ColorTokenValue modifier

---

## 关键决策点

### 决策 1:所有 PropCarrier 统一加 factory 重载(而非只 ColorPropCarrier)

**选择**:`PropCarrier` / `ColorPropCarrier` / `PropFn` 三种 carrier 全加

**理由**:
- 语义一致 —— 所有 carrier prop 都接 factory,没有"哪些能哪些不能"的心智负担
- 未来其他组件维度(spacing / sizing / borders / 等)都能用同一范式
- 改动一次性,carrier.ts 加 3 行重载

**放弃**:只 ColorPropCarrier(只 color 类) —— 限制未来扩展

---

### 决策 2:ZIcon 全 4 维度都改 factory(而非只 color)

**选择**:size / color / depth / spin 全部 factory 化,删 SIZE_MAP / DEPTH_MAP / SPIN_MAP

**理由(用户授权)**:
- 用户原话明确"ZIcon 的其他几个属性也改为这种灵活的方案"
- 范式一致性 —— ZIcon 4 个维度 + cssRoot 一共 5 个 prop 全部是 chain factory,API 表面零特例
- 设计语言不再"硬编码在组件代码里",而是"集中在 schema",通过 IDE 补全 + factory 用法暴露给用户
- 用户主张 IDE 智能补全(频率统计 / 模糊筛选)足够替代离散枚举的"语义约束作用"

**风险**:用户失去了"在 prop 字符串字面量看出语义"的便利(`color="primary"` vs `color="c => c._primary"`)。但用户已明确权衡接受。

---

### 决策 3 (修订):所有 4 维度都接单 carrier,组件 setup 处理"自动补全的其他属性"

**最终选择**(2026-05-22 修订,实施版):
- **size** → `Chain['width']` carrier;**height 自动镜像 width**(setup 内复制 `_node.width` 到 `_node.height`)
- **color** → `Chain['color']` carrier
- **depth** → `Chain['opacity']` carrier
- **spin** → `Chain['animationDuration']` carrier;**name / iteration / timing 自动启用**(setup 内硬编码)

**为什么统一为单 carrier**:
- API 极致一致 —— 4 个外观 prop 全部接单 carrier,用户写法统一为 `(c) => c.方法(...)` 一行
- IDE 补全更聚焦 —— 单 carrier 暴露该维度全部能力(token / keyword / modifier / unit method),不被无关 chain 方法干扰
- "单轴 + 兜底"的心智模型 —— 每个 prop 表达"该维度的一个核心轴",其他衍生属性由组件自动处理,用户**不需要也不能**直接操作。突破单轴边界(非正方形 / 自定义 easing)统一走 cssRoot
- 非常符合用户原话"设计完主题直接挂组件库上非常简单方便,而且也简洁灵活"

**height 镜像 width 实现**:setup 内 `props.size(s.width)` 让用户写 `(w) => w.em(1.25)`,然后读 `chain._node.width` 复制到 `_node.height`:
```ts
props.size(s.width)
if (s._node.width !== undefined) s._node.height = s._node.width
```
这放弃了"size 同时写 width 和 height 两个不同值"的能力,但这是 icon 的正常假设(永远正方形)。非正方形走 cssRoot:
```vue
<ZIcon :css-root="(s) => { s.width.px(24); s.height.px(32) }" />
```

**spin 自动属性实现**:启用 spin 时 setup 内硬编码 name + iteration + timing:
```ts
if (props.spin) {
  s.animationName(presetAnimations.spin)
  s.animationIterationCount.infinite
  s.animationTimingFunction.linear
  s.animationDuration(props.spin)
}
```
用户只通过 factory 控制 `animationDuration`。自定义 easing / 反向旋转走 cssRoot:
```vue
<ZIcon
  :spin="(d) => d.s(2)"
  :css-root="(s) => { s.animationTimingFunction('ease-in-out'); s.animationDirection.reverse }"
/>
```

**放弃方案**:
- ~~粒度匹配维度本身的语义(size/spin 接 Chain / color/depth 接 carrier)~~ —— 初版选择,粒度不统一,API 心智负担两套
- 全部用 `Chain` —— 失去单维度的补全聚焦优势,且每个 prop 写法都要"找到合适的属性 setter"
- 单 carrier 不接管 height / animation name 等 —— 用户每次都要写"width + height 两行" / "animation 4 行",违背简洁初衷

### 决策 3.5 (新增):`exactOptionalPropertyTypes` 友好 —— props 显式 `| undefined`

**选择**:每个可选 factory prop 显式写 `((c: ...) => void) | undefined`,而不是仅 `?:`。

```ts
size?: ((w: Chain<ZuiSchema>['width']) => void) | undefined
```

**理由**:
- 用户工程若启用 `exactOptionalPropertyTypes: true`(本仓库 docs 工程就启用了),传 `:size="undefined"` 或 computed `Factory | undefined` 给 optional `size?: Factory` 会编译错(undefined 不是 Factory)
- 显式 `| undefined` 让 optional 字段同时接受 "不传" 和 "传 undefined" 两种语义,跟 Vue template 的 `v-bind`/`computed` 用法更友好
- 不影响 IDE 补全和用户编辑体验

**放弃**:让用户自己用 `v-bind="fn ? { depth: fn } : {}"` 条件展开 —— 模板冗长,违背"简洁灵活"初衷

---

### 决策 4:factory 入参类型直接复用 `Chain<S>[key]`,不引入 alias

**选择**:`color?: (c: Chain<ZuiSchema>['color']) => void` —— index access type 直接写

**理由**:
- schema 扩展(`UserColorExt`)走声明合并,组件 props 类型自动跟随,**无需更新 alias**
- 不增加新概念(`ColorCarrierOf<S>` / `OpacityCarrierOf<S>` 等)
- 模式可推广 —— 用户写自己的组件也这样写,跟 zui 一致

**放弃**:导出 `CarrierFor<S, K>` helper —— 多一个概念,边际收益低

---

### 决策 5:Vue defineProps Function 类型 default 行为

**选择**:`default: 函数本身` 而非 `default: () => 函数本身`

**理由 + 踩坑记录**:
- Vue 3 文档对 Object / Array 等引用类型 default 要求工厂语法 `() => obj` —— 避免多实例共享
- 但 Function 类型 prop 的 default 应该**直接给函数本身**,Vue 内部检测 prop 类型,Function 不当作"需要工厂返回"的引用类型
- 错用工厂语法 → Vue 不调用 factory → default 永远不生效 → 默认 size / color 没应用 → 测试红
- 修复:删 outer `() =>`

---

### 决策 6:删 SIZE_MAP / DEPTH_MAP / SPIN_MAP,不留兼容档

**选择**:彻底删,组件代码内不再硬编码"5 阶档位字面量"

**理由**:
- 5 阶档位的语义现在由 theme schema 表达(`opacity.half = 0.5` / `duration.middle = '300ms'`)
- 用户要 5 阶档位的用法:`(o) => o._half` / `(s) => { s.animationDuration._middle; ... }`
- 留兼容档(字符串枚举 OR factory)违反 statement-only + 范式一致性
- 颠覆性 BREAKING,但组件库还在 0.x,可控

---

## 测试结果

| 项 | 结果 |
| --- | --- |
| core type-check | ✅ |
| core test | ✅ 31 文件 / 628 tests(新增 18) |
| core build | ✅ |
| ui-vue type-check | ✅ |
| ui-vue test | ✅ 2 文件 / 41 tests(icon 32 + provider 9) |

---

## §13.0 ① 改写

skill §13.0 ① 旧:**"离散预设优先 · size 类维度可选 `| number` escape hatch · 其它无连续输入"**

新:**"chain factory props · 直接复用 `Chain<S>[key]` · 默认值表达语义零位 · 设计档位由 schema 承担"**

详见 `.claude/skills/zui.md` §13.0 ① 同步改写。

---

## 不在本次任务范围

- **其他基础组件**(Button / Input / Dialog / Tabs / Select / Avatar / ...)按本范式逐步迁移 —— 各组件做时单独决策粒度
- **factory 入参的 IDE hover 显示** —— 受 TS 重载交叉显示行为影响,可能仍有 callable 重载相关的 hover 噪音,后续 polish
- **size 维度的 "px / em / zu" 单位选择 helper** —— 是否提供 `<ZIcon :size="size.em(1.25)" />` 这种命名 helper,留待后续(增加概念 vs 当下"用户自己写 2 行")权衡)

---

## 后续

- 用户写自己的组件,推荐:外观维度全部 chain factory + cssRoot 兜底
- skill §13.0 完整指南同步更新,新组件按此模板写
- 如果 carrier factory 重载在某些 IDE 体验里有显示问题(如重载列表过多),可考虑收紧重载顺序或加 `@deprecated` 提示老用法
