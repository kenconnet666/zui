# 2026-05-23 · Stage 5 内部 hooks 基建(无人值守跳过 STOP #3)

> **执行模式**:`/loop` 无人值守自主推进。路线图 §6 STOP 节点 #3(Stage 5 完成后停下让用户
> "review hooks API 设计")在路线图前言已显式豁免。本文档记录设计决策,**用户回到 IDE 时可
> 直接查看 5 个 hook 源码 + spec 评估,不喜欢的话改 API 不算 BREAKING**(标 internal)。

---

## 5 个 hook 的 API 决策

### 1. `useZId(suffix?: string): string`

包装 Vue 3.5+ 内置 `useId()`,加 `zui-` 前缀,可选 `-{suffix}` 后缀。

**为什么不返回 Ref**:`useId()` 每次组件 setup 返回一个稳定字符串(整个组件生命周期不变),
没必要 wrap Ref。复合组件需要多个 id 直接调多次 `useZId('label')` / `useZId('input')`。

### 2. `usePortal(target?: string | HTMLElement | null): Ref<HTMLElement | null>`

`onMounted` 内解析 target:string 走 `querySelector`、Element 直传、null/undefined 默认 `document.body`。
返回普通 ref(放弃 `Readonly<Ref>` ── happy-dom HTMLElement 与 dom HTMLElement 类型不兼容导致 readonly
wrapper 失败)。

附带 `<ZPortal :to :disabled>` 组件,内部就是 `<Teleport>` 的薄包装。

### 3. `useEscapeStack(onEscape: () => void, opts?: { enabled?: Ref<boolean> }): void`

**模块级 LIFO 栈** + 一个 global `keydown` listener。Escape 触发时从栈顶往下找第一个 `enabled` handler
触发并 stopPropagation。组件销毁(`onScopeDispose`)自动 pop。栈空 detach listener 节省资源。

**为什么不返回 controller**:大部分用法是 `useEscapeStack(() => open.value = false, { enabled: open })`,
组件销毁即 cleanup,无需外部主动 disable。

### 4. `usePopper(reference, floating, opts?): ReturnType<typeof useFloating>`

`@floating-ui/vue` `useFloating` 的薄包装,默认配置:

- `placement: 'bottom'`
- `strategy: 'absolute'`
- `middleware: [offset(8), flip(), shift({ padding: 8 })]`
- `whileElementsMounted: autoUpdate`

用户传 `placement` / `strategy` / `offset`(数字 px,默认 8) / `middleware`(追加额外)/ `open`
(控制是否计算)。返回值跟 `useFloating` 完全一致,业务方拿 `floatingStyles` 直接套到浮层 `:style`。

### 5. `useRipple(targetRef, opts?): void`

**自写**(VueUse 无对应)。pointerdown → 计算 ripple 中心 → 注入 `<span class="zui-ripple">` →
animationend 自动移除。全局一次性注入 `@keyframes zui-ripple-scale`(`<style id="zui-ripple-style">`)。

API:

- `targetRef: Ref<HTMLElement | null>` —— 必填,通常 `ref(null)` + template ref / functional ref 绑定
- `opts.color?: string` —— 默认 `'rgba(255, 255, 255, 0.35)'`(白色半透,深 bg 上明显)
- `opts.duration?: number` —— 默认 `400`(ms,Material 推荐 350~450)
- `opts.disabled?: Ref<boolean> | boolean` —— 静态或响应式禁用

**容器要求**:`position: relative; overflow: hidden`(组件自加,hook 不强制)。

---

## 测试覆盖

- `tests/use-z-id.spec.ts` —— 3 case(前缀 / suffix / 多调用不冲突)
- `tests/use-portal.spec.ts` —— 4 case(默认 body / selector / Element / ZPortal 组件)
- `tests/use-escape-stack.spec.ts` —— 5 case(单 handler / 非 Esc 不触发 / 双层 LIFO / disabled 跳过 / Esc 别名)
- `tests/use-popper.spec.ts` —— 3 case(API 形状 / 默认 placement / 自定义 placement+strategy)
- `tests/use-ripple.spec.ts` —— 6 case(注入 ripple / 注入 keyframes 样式 / disabled / 自定义 color+duration / animationend 移除 / 响应式 disabled)

合计 21 个新 spec,加上原有 147 → **168 全绿**。

---

## 验证

```
pnpm --filter @kenconnet666/zui-vue type-check  → exit 0
pnpm --filter @kenconnet666/zui-vue test        → 168/168 pass
pnpm --filter @kenconnet666/zui-vue build       → 33 chunks emitted(含 5 个 hook js + dts)
```

---

## 暴露策略

`src/_hooks/index.ts` 导出全部 5 个 hook + `ZPortal` 组件,主入口 `src/index.ts` 透出:

```ts
export * from './_hooks'
```

下划线 `_hooks` 命名标 internal:**API 变更不算 BREAKING**,业务方使用需自行承担升级成本。
这给了我们后续根据组件实际使用情况微调 API 的自由度(如 useRipple 加入波纹半径上限、useEscapeStack
支持优先级覆盖栈序等)。

---

## 路线图后续

下一步 **Stage 6 Phase α / P0 组件**(布局四件套 + 反馈展示 + 输入 + 导航 + 数据展示 + ZButton)。
工作量约 21 个 P0 组件,每个 SFC + spec + 验证。**Stage 6.6 ZButton 完成后是 STOP 节点 #4**,
其余 Stage 6.x 子段无 STOP。

下一轮 wakeup 会从 Stage 6.1 ZFlex 开始推进。
