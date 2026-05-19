---
'@kenconnet666/zui-core': minor
---

Batch A — `defineVariants` 变体抽象

新增 `defineVariants(theme, config)` 工厂函数，参考 cva / tv 风格但完全适配 zui-core 的
statement-only chain。让组件库作者声明式定义 base / variants / defaults / compoundVariants：

```ts
const button = defineVariants(defaultLight, {
  base: s => { s.padding.px(12); s.borderRadius._md },
  variants: {
    intent: {
      primary: s => { s.backgroundColor._primary; s.color.white },
      danger:  s => { s.backgroundColor._danger;  s.color.white },
      ghost:   s => { s.color._primary },
    },
    size: {
      sm: s => { s.padding.px(8) },
      md: s => { s.padding.px(12) },
      lg: s => { s.padding.px(16) },
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
  compoundVariants: [
    { when: { intent: 'ghost', size: 'sm' }, apply: s => { s.padding.px(6) } },
  ],
})

button({ intent: 'danger', size: 'sm' })   // → className
button()                                   // 全 defaults
```

特性：
- **类型完整**：`Parameters<typeof button>[0]` 推出 `{ intent?: 'primary'|'danger'|'ghost'; size?: 'sm'|'md'|'lg' }`
- **内置缓存**：相同 props 输入命中缓存（stable JSON key，props 顺序无关）
- **statement-only 兼容**：variant 内可用 `_hover` / `_focusVisible` / 等所有内建嵌套方法
- **声明顺序优先**：compound 多条按声明顺序 apply，后者覆盖前者

新增导出：
- `defineVariants` 主函数
- `VariantOptions<S>` / `VariantMap<S>` / `VariantProps<V>` / `CompoundVariant<S, V>` / `DefineVariantsConfig<S, V>` 类型工具

新增 22 测试（共 303 / 281 → 303）。
