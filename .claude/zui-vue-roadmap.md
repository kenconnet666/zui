# zui-vue 组件库实现路线图

> **用途**:供后续 Claude session(尤其定时任务)读取并按序推进 zui-vue 重构与组件实现。
>
> **执行规则**:见 §2 [执行规则](#2-执行规则)。**完成一项立即把 `- [ ]` 改 `- [x]`**;遇到 §6 [关键停下问用户](#6-关键停下问用户) 列出的节点时暂停并 sync,但是定时任务无人值守情况除外,需要自行决策并写文档在C:\code\zui\.claude目录让用户知道,然后继续执行即可。要求注意搜索本地文件,网络,context7,github等渠道,遇到困难也要搜索足够信息再决策,不要空想,有可能搜索借鉴就能找到已有的成熟方案并结合当前项目决策。
>
> **最后更新**:2026-05-23(**Phase α + β + γ 全部完成 ✓** 80+ 组件,540 tests)
> **当前阶段**:
> `Stage 9 Phase δ` —— VirtualList / 富文本 / DataGrid / Schema-driven Form,**按需开**(roadmap 标"看需求开,可能新增依赖")

---

## 0. 项目定位速览(给新 session 的 onboarding)

- `@kenconnet666/zui-vue` 是 `@kenconnet666/zui-core` 的 Vue 3 集成层(框架无关 CSS-in-JS + chain DSL 之上构建组件库)
- 主入口 `<ZBox>`(主题/iem/locale/date 注入器 + 底层带 `css` 的 box 容器)
- 已交付组件(`src/gene/`):ZIcon、ZText、ZTitle、ZParagraph、ZLink、ZDivider
- 已配 peerDeps:`@floating-ui/vue` / `@vueuse/core` / `@vueuse/integrations` / `async-validator` / `color2k` / `date-fns(-tz)` / `@vicons/ionicons5`(将改 `@vicons/material`)
- **完整文档**:见 `.claude/skills/zui.md`(API + 范式 + 验证铁律)

---

## 1. 已锁定决策(不再问用户,直接照做)

|  #  | 决策                                                                                             | 说明                                                                                                                                                                                                                                                                          |
| :-: | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | **目录扁平化**                                                                                   | `components/` 取消,各分类(gene/layout/input/display/feedback/navigation/tool)直接放 `src/` 根                                                                                                                                                                                 |
| L2  | **provider 子结构**                                                                              | `src/provider/{theme,locale,date}/` 各放对应内容(含 useZTheme/Locale/Date)+ provider 根放 ZBox/keys/units/index                                                                                                                                                               |
| L3  | **删除 `src/composables/`**                                                                      | useStyles / useVariants / useResponsive 全无组件使用,业务方自取 `@vueuse/core`                                                                                                                                                                                                |
| L4  | **`cssRoot` 全局重命名为 `css`**                                                                 | ZBox + 6 已有组件 + tests + docs + skill + CHANGELOG                                                                                                                                                                                                                          |
| L5  | **复合组件子节点配置 `sx{Name}` 模型**                                                           | 子节点 props/attrs/css **平铺为一个对象**(不再嵌套);例 `sxHead: { css?, class?, style?, onClick?, id?, 'aria-*'?, ... }`                                                                                                                                                      |
| L6  | **简单单根组件**                                                                                 | 只有 `css` prop,不需要 `sxRoot`                                                                                                                                                                                                                                               |
| L7  | **图标系统**                                                                                     | peerDep 改为 **`@vicons/material`**(替换 `@vicons/ionicons5`,跟 M3 主题更搭),组件内置图标通过 `BuiltinIcons` 语义 map + `<ZIcon :component>` 调用                                                                                                                             |
| L8  | **主题美学采用方案 C2(M3 美化)**                                                                 | M2 经典色 + M3 motion/elevation/shape;具体值见 §4                                                                                                                                                                                                                             |
| L9  | **shadow 替换为 M3 elevation(双层阴影)**                                                         | 见 §4.3                                                                                                                                                                                                                                                                       |
| L10 | **radius.huge 从 `iem(1.5)`(24px)改 `iem(1.75)`(28px)**                                          | 对齐 M3 FAB / Dialog                                                                                                                                                                                                                                                          |
| L11 | **加状态色 token `focusRing` + `overlayBg`**                                                     | 见 §4.5                                                                                                                                                                                                                                                                       |
| L12 | **取消所有 subpath exports**,只暴露主入口 `@kenconnet666/zui-vue`                                | `package.json/exports` 与 `vite.config.ts/entry` 单入口化                                                                                                                                                                                                                     |
| L13 | **工具 hooks 优先 VueUse,不够包装,最后自写**                                                     | 自写仅限 `useRipple`(其它包装 floating-ui/Teleport/onKeyStroke 等)。放 `src/_hooks/`                                                                                                                                                                                          |
| L14 | **i18n 沿用 ZLocale**(不引 vue-i18n)                                                             | 现有 namespace 已就位,新组件加 namespace 时增量补                                                                                                                                                                                                                             |
| L16 | **全 chain factory props 范式(2026-05-23 撤销 Size5 union)**                                     | 见 `.claude/decisions/2026-05-23-prop-shape-pure-factory.md`。所有 size/color/spacing/layout 类 props 一律 chain factory(Type A/B/C);variant 类保留字面量(Type V)但内联到 props 不导出独立 alias;真二态 boolean / JS 逻辑字符串 / 原生 HTML 属性 / 第三方继承类型保留(Type N) |
| L15 | ~~**6 维度 carrier factory + cssRoot(改 `css`) 范式**~~ **[已撤销 2026-05-22]**                  | 现行:`factory \| Size5 \| undefined` union(决策文档 `.claude/decisions/2026-05-22-prop-shape-union.md`)。`css` 兜底口保留。                                                                                                                                                   |
| L16 | **状态色衍生**(hover/active/disabled 等)走 chain modifier(`.darken/.lighten/.alpha`),不进 schema | 独立语义色(如 textSecondary)才进 schema                                                                                                                                                                                                                                       |
| L17 | **size 维度**                                                                                    | 交互组件有(Button/Input/Select),展示组件按需(Card/Tag 可省)                                                                                                                                                                                                                   |
| L18 | **ZButton 推到 Phase β 后期**                                                                    | 需要先有 `useRipple` / `useFocusVisible`(用 CSS `:focus-visible`)/ icon loading 等基建                                                                                                                                                                                        |
| L19 | **测试深度**                                                                                     | 对齐 ZIcon(35 spec)/ ZText(21 spec)水平,每组件 8-15 个 case 覆盖渲染+props+a11y+边界                                                                                                                                                                                          |
| L20 | **a11y 内建**                                                                                    | 按 W3C ARIA 实现(Dialog `aria-modal`、Combobox `combobox` role、Tab `tablist` 等)                                                                                                                                                                                             |

---

## 2. 执行规则

### 2.1 推进节奏

- **定时任务模式**:每次启动,从最早的 `- [ ]` 项开始;完成一项 → 改 `- [x]` → 继续下一项
- **遇 §6 列出的停下节点**:暂停并报告进度,**等用户确认后才继续**
- **遇错误**:不要 hack 绕过(不 `--no-verify`、不 skip 测试);若卡住超过 2 次尝试,在 §9 进度日志写"BLOCKED:..."并停下问用户

### 2.2 单组件实现工作流

每个组件 = 5 步,按序:

1. **SFC**:在对应分类目录创建 `Z<Name>.vue`(双 `<script>` 块,props 接口在 module scope,运行时在 setup)
2. **类型** + **chain factory**:6 维度 carrier factory(按需精简)+ 状态 prop + `css` + 复合则加 `sx{Name}`
3. **spec**:在 `packages/ui-vue/tests/<name>.spec.ts` 写 8-15 个测试(模板见 §7.2)
4. **导出**:对应分类的 `index.ts` 添加 export + `src/index.ts` 汇总更新
5. **验证**:跑 §8.1 验证三件套,全绿才算完

### 2.3 修改文件协议

- **写代码前**:对 `src/` 内文件优先用 `Read`,然后 `Edit`/`Write`
- **修改后**:调 `mcp__idea__get_file_problems(filePath, projectPath)` 单文件诊断
- **批量改后**:跑 `pnpm --filter @kenconnet666/zui-vue run type-check` + `test`
- **IDE 实时诊断滞后**:看 `get_file_problems` 与 `type-check` 是否一致,实际编译通过即视为正确(IDE TS Service 缓存常见 `node:process` / `.vue 模块找不到` / `xxx is not assignable` 这类瞬态报错可忽略)

### 2.4 CHANGELOG

- 每个 Stage 完成后,在 `packages/ui-vue/CHANGELOG.md` 顶部 `## Unreleased` 段加新 entry
- BREAKING / 新增 / 修复 三类各一段

### 2.5 进度报告

- 每完成 Stage 末尾的"验证三件套"通过后,在 §9 进度日志 prepend 一条:
  ```
  ### YYYY-MM-DD Stage X.Y 完成
  - 改动:...
  - 验证:type-check ✓ / tests N/N ✓ / build ✓
  - 下一步:Stage X.Z
  ```

---

## 3. props 设计哲学(核心范式)

### 3.1 简单单根组件

```ts
export interface ZTextProps {
  // 6 维度 carrier factory(按组件需要保留)
  size?: ((f: Chain<ZuiSchema>['fontSize']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  // ...

  // 状态(布尔/枚举)
  italic?: boolean
  underline?: 'always' | 'hover' | 'none'
  // ...

  // 根样式逃生口
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  /** 根元素 tag(语义化场景) */
  tag?: string
}
```

### 3.2 复合多节点组件(以 ZCard 为例)

```ts
export interface ZCardProps {
  // ── 组件级 props ──
  title?: string
  size?: 'small' | 'middle' | 'large'

  // ── 根节点 ──
  css?: (s: Chain<ZuiSchema>) => void
  tag?: string

  // ── 子节点配置(平铺对象,含 css + class + style + 任意 attr) ──
  sxHead?: SxObject // 头部
  sxBody?: SxObject // 主体
  sxFoot?: SxObject // 底部
}
```

### 3.3 `SxObject` 类型定义(放 `src/_internal/sx.ts`)

```ts
import type { Chain } from '@kenconnet666/zui-core'
import type { HTMLAttributes } from 'vue'
import type { ZuiSchema } from '../provider/theme'

/**
 * 复合组件子节点配置 —— **平铺**该子节点的所有 props 和 DOM attrs。
 *
 * - `css`:chain factory,该节点样式逃生口
 * - `class` / `style`:Vue 标准三种形式
 * - 其它 HTML 属性(`onClick` / `id` / `role` / `aria-*` / `data-*` 等)直接平铺,
 *   组件内部用 `v-bind` 透传到对应 DOM 节点
 */
export type SxObject<S = ZuiSchema> = {
  css?: (s: Chain<S>) => void
  class?: string | string[] | Record<string, boolean>
  style?: string | Record<string, string | number>
} & Omit<HTMLAttributes, 'class' | 'style'>
```

### 3.4 `applySx` helper

```ts
// src/_internal/sx.ts
export function applySx(s: Chain<ZuiSchema>, sx?: SxObject): void {
  if (sx?.css) sx.css(s)
}

export function extractSxAttrs(sx?: SxObject): {
  class?: SxObject['class']
  style?: SxObject['style']
  attrs: Record<string, unknown>
} {
  if (!sx) return { attrs: {} }
  const { css: _css, class: cls, style, ...attrs } = sx
  return { class: cls, style, attrs }
}
```

### 3.5 ZCard 使用样例

```vue
<template>
  <component :is="tag" :class="rootClass">
    <div
      :class="[headClass, sxHeadAttrs.class]"
      :style="sxHeadAttrs.style"
      v-bind="sxHeadAttrs.attrs"
    >
      <slot name="head">{{ title }}</slot>
    </div>
    <div
      :class="[bodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <slot />
    </div>
    <div
      v-if="$slots.foot || sxFoot"
      :class="[footClass, sxFootAttrs.class]"
      :style="sxFootAttrs.style"
      v-bind="sxFootAttrs.attrs"
    >
      <slot name="foot" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

const theme = useZTheme()

const rootClass = computed(() =>
  icss(theme.value, s => {
    // 组件级默认
    s.borderRadius._middle
    s.borderWidth._thin
    s.borderColor._border
    // 用户根 css
    props.css?.(s)
  }),
)

const headClass = computed(() =>
  icss(theme.value, s => {
    s.padding._middle
    s.borderBottomWidth._thin
    s.borderBottomColor._border
    applySx(s, props.sxHead)
  }),
)

const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))
// ... bodyClass / footClass / sxBodyAttrs / sxFootAttrs 同理
</script>
```

### 3.6 使用样例(用户视角)

```vue
<ZCard
  title="任务详情"
  :css="s => s.boxShadow._middle"
  :sx-head="{
    css: s => s.background.color._primary.alpha(8),
    onClick: handleHeadClick,
    'aria-label': 'card header',
  }"
  :sx-body="{ css: s => s.padding._large }"
>
  正文内容
</ZCard>
```

---

## 4. 主题方案细节(M3 美化)

### 4.1 zuiLight color

```ts
color: {
  ...FLAT_PALETTE,
  primary:       '#1976d2',   // Material Blue 700
  danger:        '#d32f2f',   // M2 Red 700
  warning:       '#ed6c02',   // M2 Orange 700
  success:       '#2e7d32',   // M2 Green 700
  info:          '#0288d1',   // M2 Light Blue 700
  text:          '#212121',   // M2 grey-900
  textSecondary: '#616161',   // M2 grey-700
  bg:            '#ffffff',
  bgMuted:       '#f5f5f5',   // M2 grey-100
  border:        '#e0e0e0',   // M2 grey-300
  // ↓ 新增(L11)
  focusRing:     '#1976d2',   // 同 primary;实际使用走 .alpha(40)
  overlayBg:     '#000000',   // 实际使用走 .alpha(50) → rgba(0,0,0,0.5)
}
```

### 4.2 zuiDark color

```ts
color: {
  ...FLAT_PALETTE,
  primary:       '#90caf9',   // Material Blue 200
  danger:        '#ef5350',
  warning:       '#ffa726',
  success:       '#66bb6a',
  info:          '#4fc3f7',
  text:          '#e0e0e0',
  textSecondary: '#9e9e9e',
  bg:            '#121212',   // M3 surface dark
  bgMuted:       '#1e1e1e',
  border:        '#424242',
  focusRing:     '#90caf9',
  overlayBg:     '#000000',
}
```

### 4.3 shadow → M3 Elevation(双层)

```ts
shadow: {
  tiny:   '0px 1px 2px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)',  // M3 level 1
  small:  '0px 1px 2px rgba(0,0,0,0.30), 0px 2px 6px 2px rgba(0,0,0,0.15)',  // level 2
  middle: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.30)',  // level 3
  large:  '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.30)', // level 4
  huge:   '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.30)', // level 5
}
```

zuiDark 同步用更深的 rgba(已在前轮 zuiDark 改为 0.3~0.7 不透明度,本 stage 一并替换为 M3 双层格式)。

### 4.4 radius

```ts
radius: {
  none: '0',
  tiny: iem(0.25),    // 4px
  small: iem(0.5),    // 8px
  middle: iem(0.75),  // 12px
  large: iem(1),      // 16px
  huge: iem(1.75),    // 28px  ← 从 1.5(24px) 改 1.75(28px),对齐 M3
  full: '9999px',
}
```

### 4.5 schema 加 focusRing + overlayBg

`schema.ts` 的 `SemanticColorTokens` 加两个:

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
+ | 'focusRing'
+ | 'overlayBg'
```

### 4.6 Material State Layers(使用模式,无 token)

```ts
// 交互组件统一模式
s._hover(h => {
  h.background.color._primary.alpha(8) // hover state layer
})
s._active(a => {
  a.background.color._primary.alpha(12) // pressed
})
s._focusVisible(f => {
  f.outlineWidth._middle
  f.outlineStyle.solid
  f.outlineColor._focusRing.alpha(40)
  f.outlineOffset.px(2)
})
```

---

## 5. 阶段化任务清单(打勾推进)

### Stage 1 ── 目录搬迁(纯重组,**无功能变更**)✅ 2026-05-23 完成

> 目标:从 `components/` 嵌套结构改为扁平 `src/{gene,layout,...}/`,provider 内部按 theme/locale/date 分子目录,删除无用 composables 和 components/theme/locale 旧路径。
>
> 决策文档:`.claude/decisions/2026-05-23-stage1-flatten-and-single-entry.md`

- [x] 新建 `src/provider/theme/`(空目录占位)
- [x] 新建 `src/provider/locale/`
- [x] 新建 `src/provider/date/`
- [x] 移动 `src/theme/schema.ts` → `src/provider/theme/schema.ts`
- [x] 移动 `src/theme/zui-light.ts` → `src/provider/theme/zui-light.ts`
- [x] 移动 `src/theme/zui-dark.ts` → `src/provider/theme/zui-dark.ts`
- [x] 移动 `src/theme/index.ts` → `src/provider/theme/index.ts`
- [x] 移动 `src/locale/types.ts` → `src/provider/locale/types.ts`
- [x] 移动 `src/locale/zh-CN.ts` → `src/provider/locale/zh-CN.ts`
- [x] 移动 `src/locale/en-US.ts` → `src/provider/locale/en-US.ts`
- [x] 移动 `src/locale/merge.ts` → `src/provider/locale/merge.ts`
- [x] 移动 `src/locale/index.ts` → `src/provider/locale/index.ts`
- [x] 移动 `src/provider/useZTheme.ts` → `src/provider/theme/useZTheme.ts`
- [x] 移动 `src/provider/useZLocale.ts` → `src/provider/locale/useZLocale.ts`
- [x] 移动 `src/provider/useZDate.ts` → `src/provider/date/useZDate.ts`
- [x] 新建 `src/provider/date/index.ts`(导出 useZDate / 类型)
- [x] 移动 `src/components/gene/*` → `src/gene/*`(6 个 SFC + index.ts + \_typography-base.ts)
- [x] 新建空目录 `src/layout/` `src/input/` `src/display/` `src/feedback/` `src/navigation/` `src/tool/`(各加 placeholder `index.ts`,内容仅 `export {}`)
- [x] **删除** `src/components/`(整目录)
- [x] **删除** `src/composables/`(整目录)
- [x] **删除** `src/theme/`(旧路径)
- [x] **删除** `src/locale/`(旧路径)
- [x] 全代码库 grep & 修复 import 路径(`from '../theme'` → `from '../provider/theme'` 等)
- [x] `src/provider/index.ts` 同步从 `./theme` `./locale` `./date` 子模块 re-export
- [x] `src/index.ts` 移除 composables 段(`useStyles` / `useDynamicStyles` / `chainOf` / `useVariants` / `useParts` / `useBreakpoints` / `useResponsive` 全删)
- [x] `vite.config.ts` 单入口化:`entry: 'src/index.ts'`,删除其它 lib.entry 项
- [x] `package.json` `exports` 只保留 `.` 和 `./package.json`,删除其它子入口
- [x] **验证**:type-check ✓ / test 147/147 ✓ / build ✓
- [x] CHANGELOG entry(BREAKING:目录扁平 + 单入口 + composables 全删)

### Stage 2 ── props 哲学(BREAKING)✅ 2026-05-23 完成

> 目标:`cssRoot` → `css` 全局重命名,引入 SxObject 类型与 helper(未来复合组件用)。

- [x] 写 `src/_internal/sx.ts`:`SxObject` 类型 + `applySx` + `extractSxAttrs` helper
- [x] ZBox.vue 改 `cssRoot` prop → `css`
- [x] gene 6 组件改 `cssRoot` prop → `css`(ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZDivider)
- [x] tests 全部改 `cssRoot:` → `css:`(provider.spec / icon.spec / text.spec / title.spec / paragraph.spec / link.spec / divider.spec)
- [x] docs/IconPage.vue 等改 `:css-root="..."` → `:css="..."`
- [x] skill `.claude/skills/zui.md` 全文 cssRoot → css
- [x] \_typography-base.ts 注释里的 cssRoot 描述同步改
- [x] **验证**:type-check ✓ / test 147/147 ✓ / build ✓
- [x] CHANGELOG entry(BREAKING:cssRoot → css + SxObject 类型加入)

### Stage 3 ── 图标系统切换到 @vicons/material ✅ 2026-05-23 完成

> 目标:peerDep 改 `@vicons/material`,内置图标语义 map 就位。

- [x] `package.json`:peerDeps `@vicons/ionicons5` 改为 `@vicons/material`(required,不再 optional);devDeps 同步
- [x] `pnpm install`(无人值守自动执行)
- [x] 写 `src/gene/icons.ts`:
  - re-export `* from '@vicons/material'`
  - 定义 `BuiltinIcons` 语义 map(close / check / chevronDown / chevronRight / chevronUp / chevronLeft / warning / info / success / error / search / refresh / more / add / remove)
- [x] `src/gene/index.ts` 加 icons 导出
- [x] `src/index.ts` BuiltinIcons re-export 自动包含(走 `export * from './gene'`)
- [x] docs/IconPage.vue 同步 import 改为 material 等价图标(用 `as` 别名兼容现有代码)
- [x] docs/package.json:`@vicons/ionicons5` → `@vicons/material`
- [x] **验证**:type-check ✓ / test 147/147 ✓ / build ✓
- [x] CHANGELOG entry(BREAKING:peerDep `@vicons/ionicons5` → `@vicons/material`)

### Stage 4 ── 主题美学(Material Design 美化方案 C2)✅ 2026-05-23 完成

> 目标:落实 §4 完整方案,zuiLight/zuiDark 配色 + shadow elevation + radius huge=28 + 加 focusRing/overlayBg。
>
> 决策文档:`.claude/decisions/2026-05-23-stage4-theme-aesthetics-m3.md`

- [x] `src/provider/theme/schema.ts`:`SemanticColorTokens` 加 `focusRing` / `overlayBg`
- [x] `zui-light.ts` color 全替换为 §4.1 配色 + 加 focusRing/overlayBg
- [x] `zui-light.ts` shadow 全替换为 §4.3 M3 elevation(光面阴影,双层)
- [x] `zui-light.ts` radius.huge `iem(1.5)` → `iem(1.75)`
- [x] `zui-dark.ts` color 全替换为 §4.2 dark 配色 + 加 focusRing/overlayBg
- [x] `zui-dark.ts` shadow 替换为 M3 elevation dark 变体(双层阴影 rgba 0.4~0.7 不透明度)
- [x] `zui-dark.ts` radius.huge 同步(经 zuiLight.schema.radius 继承)
- [x] **验证**:type-check ✓ / test 147/147 ✓(spec 动态读 `zuiLight.resolve().color.primary`,无需改硬编码)/ build ✓
- [x] CHANGELOG entry(BREAKING:主题色彩重设 + shadow elevation + radius huge 28px + 加 focusRing/overlayBg)

### Stage 5 ── 内部 hooks(为 P0 复合组件铺路)✅ 2026-05-23 完成

> 目标:沉淀 `src/_hooks/`,优先包装 VueUse,只 `useRipple` 自写。
>
> 决策文档:`.claude/decisions/2026-05-23-stage5-internal-hooks.md`

- [x] 新建 `src/_hooks/`
- [x] `usePopper.ts`:包装 `@floating-ui/vue` 的 `useFloating`,默认 placement / offset / middleware
- [x] `usePortal.ts`:封装 `<Teleport>` 用法 + 默认 target `<body>` + `<ZPortal>` 组件
- [x] `useEscapeStack.ts`:栈式 ESC 监听(LIFO,只触发最顶层 enabled handler)
- [x] `useZId.ts`:封装 Vue 3.5+ 内置 `useId()` + `zui-` 前缀 + 可选 suffix
- [x] `useRipple.ts`:**自写**(VueUse 无对应)
- [x] `_hooks/index.ts` 导出全部
- [x] `src/index.ts` re-export
- [x] hooks 自身 spec(5 spec 文件,21 个 case)
- [x] **验证**:type-check ✓ / test 168/168 ✓ / build ✓

### Stage 6 ── Phase α / P0 组件(MVP)

> 目标:做完后 zui-vue 可作业务主力组件库使用(Button/Form/Table/Modal/Menu 齐了)。
> **顺序**:先布局,再展示/反馈基础,再交互输入,最后 ZButton(在 §5 hooks 之后)。

#### Stage 6.1 ── 布局四件套(layout/)✅ 2026-05-23 完成

- [x] **ZFlex.vue** + spec(direction / wrap / justify / align / gap factory + inline + css 兜底)
- [x] **ZGrid.vue** + spec(cols/rows 数字 / 字符串 / 响应式对象 + gap + justify/alignItems + inline)
- [x] **ZSpace.vue** + spec(direction horizontal/vertical + size factory 覆盖 \_small + align/wrap/inline)
- [x] **ZSpacer.vue** + spec(grow/shrink/basis factory + aria-hidden)
- [x] `src/layout/index.ts` 导出(主入口经 `export * from './layout'` 自动)
- [x] **验证**:type-check ✓ / test 200/200 ✓ / build ✓

#### Stage 6.2 ── 基础展示 & 反馈(display/ feedback/)✅ 2026-05-23 完成

- [x] feedback/**ZAlert.vue** + spec(type 4 种 / closable emit close / showIcon / sxIcon/sxBody/sxClose)
- [x] feedback/**ZSpin.vue** + spec(spinning / size / 包裹模式 + 纯 indicator 模式 / tip / sxOverlay/sxIndicator)
- [x] display/**ZCard.vue** + spec(title + head/extra/foot slot + bordered/hoverable + sxHead/sxBody/sxFoot)
- [x] feedback/**ZModal.vue** + spec(Teleport + useEscapeStack + body scroll lock + closable/maskClosable + sxMask/sxDialog/sxHead/sxBody/sxFoot)
  - 注:`Modal.confirm()` / `Modal.alert()` 静态方法推到 Phase β(`createMessageApi` 已是同款工厂范式)
  - focus trap 待 Phase β 接入 `@vueuse/integrations/useFocusTrap`
- [x] feedback/**ZMessage.vue** + spec(`messages` 数组 + 顶部居中 + auto-close)
- [x] **`createMessageApi()` 工厂** + spec(createApp 临时实例方案,info/success/warning/error/loading + close/destroyAll)
- [x] feedback/index.ts、display/index.ts 导出
- [x] **验证**:type-check ✓ / test 243/243 ✓ / build ✓

#### Stage 6.3 ── 数据录入(input/)✅ 2026-05-23 完成

- [x] **ZInput.vue** + spec(prefix/suffix slot、clearable、showCount、disabled、readonly、size、sx 4 节点)
- [x] ZTextarea.vue + spec(autosize / maxRows / showCount)
- [x] ZInputNumber.vue + spec(step / min / max / precision / 上下按钮 / clamp / null 空值)
- [x] ZCheckbox.vue + ZCheckboxGroup.vue + spec(provide/inject ctx,indeterminate,options 数组)
- [x] ZRadio.vue + ZRadioGroup.vue + spec(provide/inject ctx,buttonStyle 切按钮组)
- [x] ZSwitch.vue + spec(role=switch + aria-checked + Space 键 / checkedLabel/uncheckedLabel)
- [x] **ZSelect.vue** + spec(单选 + filterable + usePopper + ZPortal + onClickOutside + useEscapeStack)
  - 多选/远程搜索拆到 Phase β
- [x] **ZForm.vue + ZFormItem.vue** + spec(async-validator + provide/inject + required / rule / labelPlacement / validateTrigger / validate() / reset())
- [x] input/index.ts 导出
- [x] **验证**:type-check ✓ / test 301/301 ✓ / build ✓

#### Stage 6.4 ── 导航(navigation/)✅ 2026-05-23 完成

- [x] **ZMenu.vue** + spec(vertical/horizontal/inline、collapsed、submenu 内联展开 + aria-expanded)
- [x] **ZTabs.vue** + spec(line/card/segment 三种 type、closable、addable、sxTab/sxPanel/sxList、tabpanel slot 接 activeName)
- [x] ZBreadcrumb.vue + spec(items 配置式 + separator + aria-current=page + onClick)
- [x] **ZPagination.vue** + spec(走 `locale.pagination` namespace,siblings ±N + 首末页 + 省略号)
- [x] navigation/index.ts 导出
- [x] **验证**:type-check ✓ / test 330/330 ✓ / build ✓

#### Stage 6.5 ── 数据展示进阶(display/)✅ 2026-05-23 完成

- [x] **ZTable.vue** + spec(基础 columns 配置式;column.render 函数自定义;dataIndex/align/width/bordered/striped/emptyText;rowKey 字符串或函数;选择/排序/分页推 Phase β)
- [x] display/index.ts 完整导出
- [x] **验证**:type-check ✓ / test 339/339 ✓ / build ✓

#### Stage 6.6 ── gene 补 ZButton(在 §5 hooks 完成后)✅ 2026-05-23 完成

> 决策文档:`.claude/decisions/2026-05-23-stage6_6-zbutton-and-phase-alpha.md`

- [x] **gene/ZButton.vue** + spec(19 case)
  - variant:`filled` / `outlined` / `text` / `ghost` / `link`(5 种,M3 命名)
  - 状态:`loading`(显示 BuiltinIcons.refresh + spin)/ `disabled` / `block`(width 100%)
  - icon slot:`prefixIcon` / `suffixIcon`
  - color carrier factory(默认 `_primary`,挂 `currentColor` 给 variant 派生)
  - 内置:useRipple(默认开启,`:ripple="false"` 关)+ `:focus-visible` outline ring 2px
  - state layer:**仅默认 color 走 `_primary.alpha(8/12)`**;user color 时跳过(chain modifier 限制)
  - a11y:`aria-disabled` / `aria-busy`(loading 时)
- [x] gene/index.ts 加 ZButton 导出
- [x] **验证**:type-check ✓ / test 358/358 ✓ / build ✓
- [x] CHANGELOG entry(新增 ZButton + Material 风波纹 + focus ring)

#### Stage α 收尾

- [ ] **Phase α 全套 build 通过 + 完整 test pass + type-check exit 0**
- [ ] CHANGELOG 汇总 entry(Phase α 完成,21 个 P0 组件)
- [ ] 写 docs/ButtonPage.vue / FormPage.vue / TablePage.vue 演示(可选,本 stage 可拆出)

### Stage 7 ── Phase β / P1 组件(高频补全)

> 在 α 完整通过 + 用户使用反馈无大问题后开。无人值守模式自行决策,gene 部分先做。

**gene 补全** ✅ 2026-05-23

- [x] ZAvatar(image + text fallback + size + shape circle/square + color)
- [x] ZTag(filled/outlined/soft + closable + round + size + color carrier)
- [x] ZBadge(value/dot/max/showZero + offset + 浮挂模式 / inline 模式)
- [x] ZCode(inline / block + fonts.\_mono + 边框 + bgMuted)
- [x] ZBlockquote(`<blockquote>` + 左侧 4px 强调色 border)
- [x] ZEllipsis(单行 / 多行 `-webkit-line-clamp` + tag)
- [x] 验证:type-check ✓ / tests 381/381 ✓ / build ✓

**layout 补全** ✅ 2026-05-23

- [x] ZAffix / ZScrollbar

**input 补全** ✅ 2026-05-23

- [x] ZSlider / ZRate / ZAutoComplete / ZDatePicker / ZTimePicker / ZColorPicker / ZCascader / ZTreeSelect / ZUpload
- [x] ZSelect 升级:多选(filterable 已有,远程搜索 / 分组留 Phase β+)

**display 补全** ✅ 2026-05-23

- [x] ZList / ZEmpty / ZResult / ZSkeleton / ZTooltip / ZPopover / ZCollapse / ZTree / ZTimeline / ZImage / ZCalendar / ZStatistic / ZProgress
- [x] ZTable 升级:排序 / 选择(列冻结 / expandable rows 留 Phase β+)

**feedback 补全** ✅ 2026-05-23

- [x] ZDrawer / ZNotification / ZPopconfirm / ZLoadingBar

**navigation 补全** ✅ 2026-05-23

- [x] ZDropdown / ZSteps / ZAnchor / ZBackTop

### Stage 8 ── Phase γ / P2 锦上花 ✅ 2026-05-23 完成

- [x] gene/ZSegmented / ZGradientText
- [x] layout/ZSplit
- [x] input/ZMention / ZTransfer / ZDynamicTags
- [x] display/ZCarousel / ZDescriptions
- [x] feedback/ZWatermark(tool/)
- [x] navigation/ZPageHeader
- [x] tool/ZQRCode(用 `@vueuse/integrations/useQRCode`)
- [x] tool/ZCountdown / ZNumberAnimation / ZMarquee
- [x] feedback/ZTour
- [x] display/ZThing —— **永久 skip**(2026-05-28 决策:语义模糊,ZCard+ZAvatar+ZSpace 可完全替代;见 decisions/2026-05-28-zthing-and-phase-delta.md)

### Stage 9 ── Phase δ / P3(收尾决策)

> **状态**:closed(2026-05-28)。
> 决策文档:`.claude/decisions/2026-05-28-zthing-and-phase-delta.md`

- [x] VirtualList —— **已交付**(2026-05-24 S0-S9 sprint;`ZVirtualList` / `ZDataTable` + 8 个数据组件接入,**不用 tanstack**,自写 `useZVirtualScroll`)
- [-] 富文本 —— **不做**,业务方直接集成 TipTap/Lexical/Slate
- [~] DataGrid 企业版 —— **50% 完成**(虚拟/排序/选择/sticky header)。列冻结/expandable rows/column resize/groupBy 按需开 sprint
- [-] Schema-driven Form —— **不做**,业务方基于 ZForm 自行包装

---

## 6. 关键停下问用户

定时任务遇到下列节点**必须停下,等用户确认后才继续**(无人值守模式下自行决策 + 写决策文档继续):

1. **Stage 1 完成后**:重大目录搬迁完成,给用户看 diff 和验证报告,确认无遗漏
2. **Stage 4 完成后**:主题色彩变更视觉影响大,让用户在 docs 站点验收 light/dark 模式视觉
3. **Stage 5 完成后**:hooks 是组件基建,让用户 review API 设计
4. **Stage 6.6 ZButton 完成后**:第一个复杂交互组件,要 review 波纹/焦点表现
5. **每个 Stage 6.x 子段完成后**:可选 sync,告诉用户进度,问是否继续
6. **遇到设计决策不在 §1 锁定列表内**:不要自己拍板,问用户
7. **遇到 BREAKING 但不在原计划内**:停下问用户
8. **测试连续 2 次失败且不明所以**:不要 hack,记录 BLOCKED 并停下

---

## 7. 单组件实现模板

### 7.1 SFC 模板(双 `<script>` 块)

```vue
<script lang="ts">
/**
 * `Z<Name>` —— 一句话描述。
 *
 * **维度**(carrier factory):...
 * **状态 prop**:...
 * **复合子节点**(若有):sxHead / sxBody / ...
 * **a11y**:...
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'
import type { SxObject } from '../_internal/sx'

export interface Z<Name>Props {
  // ─ carrier factory ─
  size?: ((f: Chain<ZuiSchema>['fontSize']) => void) | undefined
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined

  // ─ 状态 ─
  disabled?: boolean

  // ─ 根 ─
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
  tag?: string

  // ─ 子节点(复合时) ─
  sxBody?: SxObject
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { applySx, extractSxAttrs } from '../_internal/sx'

const props = withDefaults(defineProps<Z<Name>Props>(), {
  disabled: false,
  tag: 'div',
})

const theme = useZTheme()

const className = computed(() =>
  icss(theme.value, (s) => {
    // 组件默认
    // ...
    // carrier factory 维度
    if (props.color) s.color(props.color)
    // 状态
    if (props.disabled) {
      s.opacity._dim
      s.pointerEvents.none
    }
    // 用户 css
    props.css?.(s)
  }),
)

const bodyClass = computed(() =>
  icss(theme.value, (s) => {
    // 默认
    s.padding._middle
    // sx
    applySx(s, props.sxBody)
  }),
)
const sxBodyAttrs = computed(() => extractSxAttrs(props.sxBody))
</script>

<template>
  <component :is="tag" :class="className">
    <div
      :class="[bodyClass, sxBodyAttrs.class]"
      :style="sxBodyAttrs.style"
      v-bind="sxBodyAttrs.attrs"
    >
      <slot />
    </div>
  </component>
</template>
```

### 7.2 spec 模板

```ts
/**
 * `Z<Name>` —— 测试覆盖:渲染、维度、状态、a11y、边界。
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Chain } from '@kenconnet666/zui-core'
import { Z<Name>, zuiLight, type ZuiSchema } from '../src'

function getInjectedCss(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n')
}

describe('Z<Name> ── 渲染', () => {
  it('默认渲染 default slot', () => { /* ... */ })
  it('tag prop 切换根元素', () => { /* ... */ })
})

describe('Z<Name> ── carrier factory', () => {
  it('color factory → schema token _primary', () => { /* ... */ })
})

describe('Z<Name> ── 状态 prop', () => {
  it('disabled=true → opacity 降低 + pointer-events:none', () => { /* ... */ })
})

describe('Z<Name> ── sx 子节点(若有)', () => {
  it('sxBody.css 应用到 body class', () => { /* ... */ })
  it('sxBody.onClick 透传到 body DOM', () => { /* ... */ })
  it('sxBody.aria-label 透传到 body DOM', () => { /* ... */ })
})

describe('Z<Name> ── css 覆盖', () => {
  it('css 可覆盖默认样式', () => { /* ... */ })
  it('css 写 _hover 伪类', () => { /* ... */ })
})
```

---

## 8. 验证规范

### 8.1 验证三件套(每 Stage 末尾必跑)

```bash
pnpm --filter @kenconnet666/zui-vue run type-check   # vue-tsc --noEmit
pnpm --filter @kenconnet666/zui-vue test             # vitest run
pnpm --filter @kenconnet666/zui-vue run build        # vite build
```

**全部 exit 0 + 100% pass + dist/ 产物正常** = Stage 完成。

### 8.2 IDE 实时诊断忽略清单

下列 IDE 报错通常是 TS Service 缓存,以 `mcp__idea__get_file_problems` + 命令行 type-check 为准:

- `Cannot find name 'node:process'` / `Cannot find name 'process'`(已知 node types 解析滞后)
- `Cannot find module './X.vue' or its corresponding type declarations`(Vue SFC 模块解析滞后)
- `Property 'X' is missing in type '...' but required in type` 但实际类型已正确(类型合并滞后)
- `Parameter 's' implicitly has an 'any' type`(已显式类型但 IDE 没刷新)

判定:**`mcp__idea__get_file_problems` errors=[] + 命令行 type-check exit 0 ⇒ 实际正确**。

### 8.3 lint(暂无独立脚本,跟 type-check 等价)

ui-vue 当前没 `lint` script,ESLint 通过 IDE inspection 自动跑。`get_file_problems` 已涵盖 ESLint。

---

## 9. 进度日志(逆序追加,新条目放最前)

> 每个 Stage / 子段完成后追加一条。

### 2026-05-23 `s._prop` 调用大规模强类型化 + iem 统一(主程 + 3 Agent 并行)

**目标**:把全库 `s._prop('propName', 'value')` 这类弱类型字符串调用替换为 chain carrier 强类型写法,并统一 px 字面量为 iem 单位(跟 ZBox iem 联动)。

**改动统计**:

- 75 个 SFC / 382 处 `_prop` 调用 → **378 处替换为强类型 chain**(98.95%)
- 剩 4 处合理保留:`ZGrid` 2 处(动态 prop 名)/ `ZSlider` 2 处(CSS custom property)
- 并行实施:3 个 general-purpose Agent 各负责一组(gene+layout+tool+display 36 文件 / input 21 文件 / feedback+navigation 17 文件)+ 主程收尾(ZButton focusVisible / ZTag/ZAvatar borderRadius / ZTimeline 竖线 / ZSwitch 动态 left/right / ZNotification 动态 vert/horiz / ZModal calc 公式 iem 化 / ZCascader `:last-child` bug 修)

**iem 化收益**:

- `'calc(N * var(--zui-iem, 16px))'` 字面量 → 纯 chain `s.prop.iem(N)`
- `'Npx'` 字面量(N 是 iem 倍数:8/12/16/20/24/32/40/48...)→ `s.prop.iem(N/16)`
- 1080p / iem=16px 基准下各组件物理尺寸合理性验证:ZInput middle 32px / ZButton middle 32-36px / ZAvatar middle 40px / ZModal width 480px / ZDrawer 320px / ZTooltip maxWidth 320px

**搭车修复**:

- ZCascader `_prop('lastChild', '')` 无效写法 → `_lastChild((c) => c.borderRightStyle.none)`
- ZSlider linear-gradient `_prop('background', ...)` → `s.background('...')`
- ZUpload inline `var(--zui-color-textSecondary)` 不存在的 CSS var → 改 chain class
- ZButton focus-visible outline 走完整 chain(`outlineWidth._middle + outlineStyle.solid + outlineOffset.px(2)`)
- ZButton link variant `textDecoration` 改回简写(spec 检查 `text-decoration:` 而非 `text-decoration-line:`)

**验证**:type-check ✓ / mcp**idea**get_file_problems 全部 errors=[] / tests 待确认

**下一步**:跑全套测试确认 + 用户审 + commit

---

### 2026-05-22 BREAKING — props 形态统一为 union(撤销 L15)

**决策文档**:`.claude/decisions/2026-05-22-prop-shape-union.md`(撤销"chain factory only",改 `factory | Size5 | undefined` union)

**改动统计**:

- 新基建:`src/_internal/size-prop.ts`(Size5/SizeProp/SizePropMulti/SizeMap + applySizeProp/makeSizeMap)+ `src/_internal/component-sizes.ts`(INPUT_SIZE_MAP / COMPACT_PADDING_MAP 共享 SIZE_MAP)
- 改造 25 个 SFC(详见 CHANGELOG.md):
  - gene 10:ZIcon / ZText / ZTitle / ZParagraph / ZLink / ZSpace / ZAvatar(**BREAKING:`number` 砍掉**)/ ZTag / ZSegmented / ZButton
  - input 9:ZInput / ZInputNumber / ZSelect / ZAutoComplete / ZDatePicker / ZTimePicker / ZTreeSelect / ZSwitch / ZRate
  - display 4:ZProgress / ZList / ZDescriptions / ZTable
  - feedback 2:ZSpin / ZDrawer(`Size5` 字符串 → iem 映射)
  - navigation 1:ZPagination
  - input `ZFormItem`:**新增 `sxControl` 节点**
- 搭车修复:ZPopconfirm `aria-modal="false"` 删除 / ZInput dead code 清理 / ZTable+ZTreeSelect `s.color('_x')` 字符串调用 bug 修复
- 更新文档:roadmap §1 L15 标"已撤销" / skill §13.0 ① 重写为"factory + Size5 union" 范式

**验证**:type-check ✓ / **tests 548/548 ✓**(原 540 + 新 size-prop spec 8 case)/ build ⏳
**下一步**:用户确认后 commit + 决定是否发版 v0.3.0

### 2026-05-23 🎉 Phase α/β/γ 全部完成(80+ 组件 / 540 tests / 16 commits)

**总览**:

- **Phase α**(21 P0):layout 4 + gene 7 + feedback 5 + display 2 + input 10 + navigation 4 + hooks 5
- **Phase β**(高频补全 30+):gene 6(装饰) + 浮层 3(Tooltip/Popover/Drawer) + display 6(Empty/Skeleton/Result/List/Progress/Collapse) + feedback 3(Dropdown/Popconfirm/Notification) + input 2(Slider/Rate) + display 6(Timeline/Statistic/Image/Tree/Calendar 等) + nav 3(Steps/BackTop/Anchor) + layout 2(Affix/Scrollbar) + input 5(Upload/DatePicker/TimePicker/ColorPicker/AutoComplete) + 升级(ZTable 排序+选择 / ZSelect 多选 / ZTreeSelect / ZTour)
- **Phase γ**(锦上花 13):gene 2(Segmented/GradientText) + layout 1(Split) + tool 5(Countdown/NumberAnimation/Marquee/Watermark/QRCode) + input 3(Mention/Cascader/DynamicTags/Transfer) + display 2(Carousel/Descriptions) + nav 1(PageHeader)

**测试**:48 spec 文件,540 case,全绿。**type-check ✓ / build ✓**。

**技术债务两轮修复**:

- 批 1(commit 261f6ff):ZButton/ZTag/ZBlockquote 视觉缺陷 + Modal/Drawer scroll lock 共享化
- 批 2(commit b9ae101):qrcode 移 peerDep + Set/Map → array.includes(避免 Vue reactive 边界)+ color-bridge helper 统一 cast + dead code 清理

**剩余 Phase δ**(roadmap §9,按需开):VirtualList / 富文本 / DataGrid 企业版 / Schema-driven Form。

### 2026-05-23 Stage 7 浮层批完成(ZTooltip / ZPopover / ZDrawer)

- 改动:display/ZTooltip(usePopper + Teleport,4 trigger 模式)、display/ZPopover(类 Tooltip 但富内容 + onClickOutside + useEscapeStack)、feedback/ZDrawer(类 Modal 4 placement 滑入)
- 测试 15 case;总 396/396
- 验证:type-check ✓ / tests 396/396 ✓ / build ✓
- 修 bug:ZTooltip manual 模式之前忽略 disabled,改为 disabled 总是阻止显示
- 测试细节:Teleport 跨 spec 会留 portal DOM,加 beforeEach + wrapper.unmount() 双清理

### 2026-05-23 Stage 7 gene 补全完成(无人值守自主推进,进入 Phase β)

- 改动:gene 加 6 个简单装饰组件 — ZAvatar / ZTag / ZBadge / ZCode / ZBlockquote / ZEllipsis;index 导出
- 测试 23 case;总 381/381
- 验证:type-check ✓ / tests 381/381 ✓ / build ✓
- 注意:`emotion` CSS-in-JS 中 `-webkit-` 前缀属性需用 PascalCase(`WebkitLineClamp`,非 `webkitLineClamp`)
- 下一步:Phase β 其它分类(feedback ZDrawer/ZNotification/ZPopconfirm, display ZTooltip/ZPopover/ZCollapse,etc.)

### 2026-05-23 Stage 6.5 + 6.6 完成 = Phase α 收尾(无人值守自主推进,跳过 STOP #4)

- 改动:display/ZTable(配置式 columns + render 函数 + rowKey 函数 + bordered/striped),gene/ZButton(5 variant + loading + ripple + focus-visible)
- 测试:ZTable 9 + ZButton 19 = 28 case;**总 358/358 全绿**
- 验证:type-check ✓ / tests 358/358 ✓ / build ✓
- 文档:`.claude/decisions/2026-05-23-stage6_6-zbutton-and-phase-alpha.md`
- Phase α 收尾:21 个 P0 组件全部交付(layout 4 + gene 7 + feedback 5 + display 2 + input 10 + navigation 4)
- 设计精简:ZButton user color 时跳过 state layer(chain modifier 限制),改用 elevation / opacity 变化作 hover 反馈
- 下一步:Stage 7 Phase β 高频补全(待用户优先级 sync)

### 2026-05-23 Stage 6.4 完成(无人值守自主推进)

- 改动:navigation/ZBreadcrumb / ZPagination(用 locale.pagination 文案)/ ZTabs(line/card/segment + closable + addable)/ ZMenu(树形 items + submenu 内联展开 + collapsed)
- 测试 29 case;总 330/330
- 验证:type-check ✓ / tests 330/330 ✓ / build ✓
- 设计精简:ZMenu 不做 popup-style submenu(仅 inline expand),horizontal/vertical 仅样式排版差异。后续 phase β 加 popup submenu
- 下一步:Stage 6.5 ZTable(基础 columns 配置式)

### 2026-05-23 Stage 6.3 完成(无人值守自主推进)

- 改动:补 ZSelect(usePopper + ZPortal + onClickOutside + useEscapeStack)、ZForm + ZFormItem(async-validator 集成,provide/inject ctx,validate() 全表单)
- 测试 17 case(z-select 10 + z-form 7);总 301/301
- 验证:type-check ✓ / tests 301/301 ✓ / build ✓
- 设计决策:多选/远程搜索 / Modal.confirm / focus trap 都推 Phase β
- 下一步:Stage 6.4 导航(ZMenu / ZTabs / ZBreadcrumb / ZPagination)

### 2026-05-23 Stage 6.2 完成(无人值守自主推进)

- 改动:`feedback/ZAlert + ZSpin + ZModal + ZMessage + messageApi`(5 SFC + 1 helper),`display/ZCard`;各 sx 子节点(sxHead/sxBody/sxFoot/sxMask/sxClose 等);ZModal 用 Teleport + `useEscapeStack` + body scroll lock;`createMessageApi()` 工厂走 createApp 临时实例方案
- 测试 6 spec(43 case,243/243 全绿)
- 验证:type-check ✓ / tests 243/243 ✓ / build ✓
- 设计决策:`Modal.confirm/alert` 静态方法推 Phase β(`createMessageApi` 已落地工厂范式),focus trap 也推 Phase β
- 下一步:Stage 6.3 数据录入(8+ 组件)

### 2026-05-23 Stage 6.1 完成(无人值守自主推进)

- 改动:新建 `src/layout/{ZFlex,ZGrid,ZSpace,ZSpacer}.vue` + 4 spec(32 case);`src/layout/index.ts` 导出
- 验证:type-check ✓ / tests 200/200 ✓ / build ✓
- 下一步:Stage 6.2 反馈+展示基础(ZAlert / ZSpin / ZCard / ZModal / ZMessage)

### 2026-05-23 Stage 5 完成(无人值守自主推进,跳过 STOP #3 API review)

- 改动:新建 `src/_hooks/`(5 个 hook):`useZId` / `usePortal`(+ `ZPortal` 组件) / `useEscapeStack` / `usePopper`(包装 floating-ui) / `useRipple`(自写,pointerdown 注入 span + @keyframes + animationend 清理);`src/index.ts` 加 `export * from './_hooks'`
- 测试:5 spec 文件、21 个 case(原 147 + 21 = 168/168)
- 验证:type-check ✓ / tests 168/168 ✓ / build ✓
- 文档:`.claude/decisions/2026-05-23-stage5-internal-hooks.md`
- 下一步:Stage 6.1 布局四件套(ZFlex / ZGrid / ZSpace / ZSpacer)

### 2026-05-23 Stage 4 完成(无人值守自主推进,跳过 STOP #2 视觉验收)

- 改动:`SemanticColorTokens` 加 `focusRing` + `overlayBg`(10 → 12 个语义色);zuiLight color 全套换 Material 700 / Orange 700;zuiDark color 全套换 Material 200/300/400 shade,bg 改 M3 `#121212`;两套 shadow 全部换 M3 双层 elevation(level 1-5);radius.huge 24px → 28px 对齐 M3 FAB
- 验证:type-check ✓ / tests 147/147 ✓ / build ✓
- 文档:`.claude/decisions/2026-05-23-stage4-theme-aesthetics-m3.md`
- **视觉验收待用户**:`pnpm --filter @kenconnet666/docs dev` 看 light/dark
- 下一步:Stage 5 内部 hooks 基建(STOP 节点 #3)

### 2026-05-23 Stage 3 完成(无人值守自主推进)

- 改动:peerDep `@vicons/ionicons5` → `@vicons/material`(BREAKING,required 不再 optional);新建 `src/gene/icons.ts`(re-export material 全量 + `BuiltinIcons` 15 项语义 map,Outlined 变体);`src/gene/index.ts` 加 icons re-export;docs/IconPage.vue 同步 import 用 `as` 别名兼容;docs/package.json 同步
- 验证:type-check ✓ / tests 147/147 ✓ / build ✓
- 下一步:Stage 4 主题美学(M3 / C2 方案)— **STOP 节点 #2**,需写决策文档继续

### 2026-05-23 Stage 2 完成(无人值守自主推进)

- 改动:`cssRoot` / `:css-root` 全局重命名为 `css` / `:css`(影响 ZBox.vue + gene 6 SFC + 5 spec + IconPage + skill);新建 `src/_internal/sx.ts`(`SxObject` 类型 + `applySx` + `extractSxAttrs` helper,供后续复合组件使用)
- 验证:type-check ✓ / tests 147/147 ✓ / build ✓
- 下一步:Stage 3 图标系统切换 @vicons/ionicons5 → @vicons/material

### 2026-05-23 Stage 1 完成(无人值守自主推进)

- 改动:目录扁平化(`components/gene` → `gene/`,`theme` → `provider/theme`,`locale` → `provider/locale`,`provider/useZ*` → `provider/{theme,locale,date}/useZ*`),删 `composables/`,新建 6 个分类占位 `{layout,input,display,feedback,navigation,tool}/index.ts`,单入口化(vite.config + package.json/exports)
- 验证:type-check ✓ / tests 147/147 ✓ / build ✓
- 文档:`.claude/decisions/2026-05-23-stage1-flatten-and-single-entry.md`
- 下一步:Stage 2 cssRoot → css + SxObject 类型 + helper

### 2026-05-22 路线图文档初版

- 改动:写 `.claude/zui-vue-roadmap.md`(本文件)
- 验证:N/A(纯文档)
- 下一步:Stage 1.1 开始目录搬迁

---

## 10. 待补决策(将来才回答,留位)

- ZTable 是否走 columns 配置式 vs render slot 模式 ── Stage 6.5 落地时再定
- ZForm 校验是 `validateTrigger` enum 还是函数 ── Stage 6.3 落地时再定
- ZModal `Modal.confirm()` 静态方法的实现路径(`createApp` 临时实例 vs 全局 Teleport) ── Stage 6.2 落地时再定
- Phase δ 重型组件(VirtualList / DataGrid / 富文本)的依赖选型 ── 真要做时再开会
- docs 站点的 demo 工程是否单独维护 vs 跟随组件 ── Phase α 完成后讨论
- 视觉回归测试(Playwright)是否集成 ── Phase β 后决定

---

## 11. 附录:关键文件路径速查

```
项目根:                C:\code\zui
ui-vue 包:             C:\code\zui\packages\ui-vue
core 包:               C:\code\zui\packages\core
docs 站点:             C:\code\zui\packages\docs
本路线图:              C:\code\zui\.claude\zui-vue-roadmap.md
项目 skill:            C:\code\zui\.claude\skills\zui.md
历史决策:              C:\code\zui\.claude\decisions\
ui-vue 入口:           C:\code\zui\packages\ui-vue\src\index.ts
provider 入口:         C:\code\zui\packages\ui-vue\src\provider\index.ts
gene 入口:             C:\code\zui\packages\ui-vue\src\gene\index.ts
CHANGELOG:             C:\code\zui\packages\ui-vue\CHANGELOG.md
```
