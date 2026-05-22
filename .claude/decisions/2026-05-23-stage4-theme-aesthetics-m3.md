# 2026-05-23 · Stage 4 主题美学 Material Design C2 方案(无人值守跳过 STOP #2)

> **执行模式**:`/loop` 无人值守自主推进。路线图 §6 STOP 节点 #2(Stage 4 完成后停下让用户
> "在 docs 站点验收 light/dark 模式视觉")在路线图前言已显式豁免("定时任务无人值守情况除外")。
> 本文档记录变更,**用户回到 IDE 时可通过 `pnpm --filter @kenconnet666/docs dev` 启动 docs 自行验收**。

---

## A. SemanticColorTokens 新增 2 个状态色

```diff
 export type SemanticColorTokens =
   | 'primary'
   | 'danger'
   | 'warning'
   | 'success'
   | 'info'
   | 'text'
   | 'textSecondary'
   | 'bg'
   | 'bgMuted'
   | 'border'
+  | 'focusRing'
+  | 'overlayBg'
```

- **`focusRing`** —— `:focus-visible` outline 颜色基色。使用处通常叠 `.alpha(40)` 派生半透明
  focus 环(Material 经典模式:focus 跟随 primary 色调)。
- **`overlayBg`** —— Modal / Drawer / 加载遮罩的背景色基色。使用处通常叠 `.alpha(50)` 派生半透明
  黑遮罩。dark 模式也用同一 base + alpha,简洁。

10 → 12 个语义色。

---

## B. zuiLight color(Material Design 2 经典 700 / Orange 700)

| token | 旧值(Tailwind) | 新值(Material) |
|---|---|---|
| primary | `tw('blue','600')` ≈ `#2563eb` | `#1976d2` Material Blue 700 |
| danger | `tw('red','600')` ≈ `#dc2626` | `#d32f2f` M2 Red 700 |
| warning | `tw('yellow','500')` ≈ `#eab308` | `#ed6c02` M2 Orange 700 |
| success | `tw('green','500')` ≈ `#22c55e` | `#2e7d32` M2 Green 700 |
| info | `tw('cyan','500')` ≈ `#06b6d4` | `#0288d1` M2 Light Blue 700 |
| text | `tw('gray','900')` ≈ `#111827` | `#212121` M2 grey-900 |
| textSecondary | `tw('gray','600')` ≈ `#4b5563` | `#616161` M2 grey-700 |
| bg | `#ffffff` | `#ffffff` ✓ 不变 |
| bgMuted | `tw('gray','50')` ≈ `#f9fafb` | `#f5f5f5` M2 grey-100 |
| border | `tw('gray','200')` ≈ `#e5e7eb` | `#e0e0e0` M2 grey-300 |
| **focusRing** | (新) | `#1976d2` 同 primary |
| **overlayBg** | (新) | `#000000` 用 `.alpha(50)` |

---

## C. zuiDark color(Material 200 / 300 shade,暗背景柔和对比)

| token | 旧值 | 新值 |
|---|---|---|
| primary | `tw('blue','500')` | `#90caf9` Material Blue 200 |
| danger | `tw('red','500')` | `#ef5350` Red 400 |
| warning | `tw('yellow','500')` | `#ffa726` Orange 400 |
| success | `tw('green','500')` | `#66bb6a` Green 400 |
| info | `tw('cyan','500')` | `#4fc3f7` Light Blue 300 |
| text | `tw('gray','100')` | `#e0e0e0` grey-300 |
| textSecondary | `tw('gray','400')` | `#9e9e9e` grey-500 |
| bg | `tw('gray','900')` ≈ `#111827` | `#121212` M3 dark surface 推荐基色 |
| bgMuted | `tw('gray','800')` ≈ `#1f2937` | `#1e1e1e` M3 surface +1 |
| border | `tw('gray','600')` ≈ `#4b5563` | `#424242` grey-800 |
| **focusRing** | (新) | `#90caf9` 同 primary |
| **overlayBg** | (新) | `#000000` |

---

## D. shadow → M3 Elevation 双层阴影(level 1-5)

光面阴影模型:**key light**(主光源,锐利,主导阴影方向)+ **ambient light**(环境光,扩散,周围
柔光),两层叠加。这是 Material Design 3 的官方推荐 elevation 实现,视觉层次比单层阴影
("light bottom drop")更清晰、更"真实"。

**zuiLight**:
```ts
tiny:   '0px 1px 2px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)'  // M3 level 1
small:  '0px 1px 2px rgba(0,0,0,0.30), 0px 2px 6px 2px rgba(0,0,0,0.15)'  // level 2
middle: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.30)'  // level 3
large:  '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.30)' // level 4
huge:   '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.30)' // level 5
```

**zuiDark**:同结构,不透明度 0.40~0.70(深色 bg 上需要更强阴影才"浮起"):
```ts
tiny:   '0px 1px 2px rgba(0,0,0,0.60), 0px 1px 3px 1px rgba(0,0,0,0.40)'
small:  '0px 1px 2px rgba(0,0,0,0.60), 0px 2px 6px 2px rgba(0,0,0,0.40)'
middle: '0px 4px 8px 3px rgba(0,0,0,0.40), 0px 1px 3px rgba(0,0,0,0.60)'
large:  '0px 6px 10px 4px rgba(0,0,0,0.40), 0px 2px 3px rgba(0,0,0,0.65)'
huge:   '0px 8px 12px 6px rgba(0,0,0,0.45), 0px 4px 4px rgba(0,0,0,0.70)'
```

---

## E. radius.huge:`iem(1.5)` → `iem(1.75)`(24px → 28px)

对齐 Material 3 FAB / Dialog 推荐圆角。其它 4 阶(tiny/small/middle/large)与 `full` 保持不变。
`zuiDark` 复用 `zuiLight.schema.radius`,自动跟随。

---

## F. 验证

```
pnpm --filter @kenconnet666/zui-vue type-check  → exit 0
pnpm --filter @kenconnet666/zui-vue test        → 147/147 pass
pnpm --filter @kenconnet666/zui-vue build       → 27 chunks emitted
```

tests 全绿的关键:**所有断言 primary 值的 spec 是动态读取 `zuiLight.resolve().color.primary`,
不 hardcode `#2563eb` 等具体颜色**。token 值变了 → 断言自动跟新值匹配。`provider.spec.ts:73`
的 `color.bg === '#ffffff'` 也保持(bg 在新方案中仍是纯白)。

---

## G. 视觉验收(用户操作)

无人值守模式下无法启动 docs 站点。用户回到 IDE 后可:

```powershell
pnpm --filter @kenconnet666/docs dev
# 浏览器开 http://localhost:5173/icon(IconPage)看 ZIcon + 各 zuiLight token 渲染效果
# 想看 dark mode:在 App.vue 或 page 内传 :theme="zuiDark" 包一层 ZBox
```

视觉验收点:
1. primary 蓝是否符合 M2 700 视觉(略深沉,跟 M3 推荐一致)
2. 阴影双层是否在卡片 / 弹窗上"浮起"得自然
3. radius huge=28 在 dialog/sheet 上是否显得过大(若 jarring 可微调到 iem(1.6) = 25.6px)
4. dark 模式 primary `#90caf9`(浅蓝)在深 bg 上的对比度

若任一项需要调整,直接改 `src/provider/theme/zui-light.ts` / `zui-dark.ts` token 值即可,
不影响组件代码。

---

## 路线图后续

Stage 4 完成,下一步 **Stage 5 内部 hooks 基建**(`src/_hooks/`:usePopper / usePortal /
useEscapeStack / useZId / useRipple)。Stage 5 也是 STOP 节点 #3("hooks 是组件基建,让用户
review API 设计"),无人值守模式下自行决策继续 + 写另一份决策文档。
