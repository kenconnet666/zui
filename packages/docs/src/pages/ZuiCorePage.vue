<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">zui-core 模块</ZTitle>
    <ZParagraph>
      <ZCode code="@kenconnet666/zui-core" /> 是 zui 的框架无关核心库，提供
      <strong>Chain 链式样式 builder</strong>、<strong>icss 类名工厂</strong>、
      <strong>主题系统</strong>和<strong>变体抽象</strong>，不依赖任何 UI 框架，
      可在 Vue / React / Svelte 等任意环境使用。
    </ZParagraph>

    <ZTitle :level="2">安装</ZTitle>
    <ZCode :inline="false" lang="bash" code="pnpm add @kenconnet666/zui-core @emotion/css" />

    <ZTitle :level="2">icss — 类名生成入口</ZTitle>
    <ZParagraph>
      <ZCode code="icss(theme, factory)" /> 是最常用的入口，接收 resolved theme 和一个
      Chain factory，返回 Emotion CSS class 字符串。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { icss } from '@kenconnet666/zui-core'

const cls = icss(theme, (s) => {
  s.display.flex
  s.alignItems.center
  s.padding.iem(0.5)         /* iem 响应式单位 */
  s.color._primary           /* schema token */
  s.fontSize._middle         /* fontSize token */
  s._hover((h) => {
    h.color._primary.darken(10)
  })
  s._dark((d) => {           /* 暗色模式 */
    d.background._surface
  })
})`"
    />

    <ZTitle :level="2">Chain — 链式 CSS builder</ZTitle>
    <ZParagraph>
      <ZCode code="Chain&lt;TSchema&gt;" /> 通过声明合并把 ~857 个 CSS 属性挂到强类型 builder 上，
      每个属性上挂 carrier（单位/token/modifier 链）。
    </ZParagraph>

    <ZTitle :level="3">属性写法</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`/* 1. keyword — CSS 枚举值 */
s.display.flex
s.position.relative
s.overflow.hidden

/* 2. token — schema token（_ 前缀） */
s.color._primary
s.fontSize._middle

/* 3. 单位 helper — 数值 + 单位 */
s.width.px(200)
s.height.pct(100)
s.padding.iem(0.5)    /* iem 响应式 */
s.gap.vw(2)

/* 4. 字面量 — 任意 CSS 值 */
s.width('calc(100% - 48px)')
s.lineHeight('1.6')

/* 5. _prop 低级逃生 — key 必须 camelCase */
s._prop('scrollbarWidth', 'none')
s._prop('msOverflowStyle', 'none')
s._prop('colorScheme', 'dark')`"
    />

    <ZTitle :level="3">嵌套：伪类 / 媒体查询 / 暗色</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`/* 伪类 */
s._hover((h) => { h.color._primary; h.cursor.pointer })
s._active((a) => { a.transform('scale(0.98)') })
s._focus((f) => { f.outline('2px solid currentColor') })
s._focusVisible((f) => { f.outlineOffset.px(2) })

/* 伪元素 */
s._before((b) => { b.content(&quot;''&quot;); b.display.block })
s._after((a) => { a.content(&quot;''&quot;) })

/* 媒体查询 */
s._media('(max-width: 768px)', (m) => { m.display.none })
s._media('_middle', (m) => { m.fontSize._large })

/* 暗色模式（.dark 选择器 + @media prefers-color-scheme） */
s._dark((d) => { d.background._surface; d.color._text })

/* 任意选择器 */
s._selector('& + &', (r) => { r.marginLeft.iem(0.5) })`"
    />

    <ZTitle :level="2">iem 单位</ZTitle>
    <ZParagraph>
      <ZCode code="iem(n)" /> 生成 <ZCode code="calc(n * var(--zui-iem, 16px))" />，
      基准由 ZBox 通过 CSS 变量注入，使所有尺寸随 Provider 统一缩放。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { iem } from '@kenconnet666/zui-core'

/* 独立使用（不在 chain 里） */
const width = iem(20)   /* => 'calc(20 * var(--zui-iem, 16px))' */

/* chain 内联 */
s.width.iem(20)
s.padding.iem(0.5)
s.borderRadius.iem(0.375)`"
    />

    <ZTitle :level="2">主题系统</ZTitle>

    <ZTitle :level="3">三层 Schema</ZTitle>
    <ZCode
      :inline="false"
      lang="text"
      :code="`@kenconnet666/zui-core   BaseSchema    /* Tailwind 242 色 palette */
                   ▲ extends
@kenconnet666/zui-vue    ZuiSchema     /* + 语义色 + spacing + fontSize + ... */
                   ▲ declaration merge
用户工程             UserSchema    /* augmentation 注入 brand 色等自定义 token */`"
    />

    <ZTitle :level="3">BaseSchema palette</ZTitle>
    <ZParagraph>
      <ZCode code="BaseSchema.color" /> 包含 Tailwind 全部 242 个调色板 token（<ZCode code="slate50" /> …
      <ZCode code="zinc950" /> 等），以及 <ZCode code="black" /> / <ZCode code="white" />。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { paletteLight, paletteDark } from '@kenconnet666/zui-core'

/* paletteLight / paletteDark 是最小可用主题（仅 palette，无 semantic token）
   业务端推荐 zuiLight / zuiDark（来自 @kenconnet666/zui-vue，含完整设计 token） */`"
    />

    <ZTitle :level="3">ResolvedTheme</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import type { ResolvedTheme } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '@kenconnet666/zui-vue'

/* theme 对象同时是：
   1. 访问 token 值的普通对象   theme.color._primary === '#3b82f6'
   2. 注入 CSS 变量 / class 的 builder
   3. extend() 入口（不可变，返回新 theme） */

const extended = zuiLight.extend({
  color: { brandPrimary: '#1a3a8f', brandAccent: '#ff7849' }
})`"
    />

    <ZTitle :level="2">变体系统</ZTitle>

    <ZTitle :level="3">defineVariants</ZTitle>
    <ZParagraph>
      cva / tv 风格的变体抽象，把组件多态映射到 CSS class。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { defineVariants } from '@kenconnet666/zui-core'

const buttonVariants = defineVariants(theme, {
  base: (s) => {
    s.display.inlineFlex
    s.alignItems.center
    s.cursor.pointer
  },
  variants: {
    variant: {
      filled:   (s) => { s.background._primary; s.color._onPrimary },
      outlined: (s) => { s.borderWidth._thin; s.borderStyle.solid; s.borderColor._primary },
      text:     (s) => { s.background.transparent },
    },
    size: {
      sm: (s) => { s.fontSize.iem(0.875); s.padding.iem(0.25) },
      md: (s) => { s.fontSize.iem(1);     s.padding.iem(0.5) },
    },
  },
  defaultVariants: { variant: 'filled', size: 'md' },
})

/* 使用 */
const cls = buttonVariants({ variant: 'outlined', size: 'sm' })`"
    />

    <ZTitle :level="3">defineParts（slots 多 part 组件）</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { defineParts } from '@kenconnet666/zui-core'

const cardParts = defineParts(theme, {
  parts: ['root', 'header', 'body', 'footer'] as const,
  base: {
    root:   (s) => { s.borderWidth._thin; s.borderStyle.solid; s.borderColor._border },
    header: (s) => { s.padding.iem(0.75); s.borderBottom._thin },
    body:   (s) => { s.padding.iem(1) },
  },
  variants: {
    hoverable: {
      true: { root: (s) => { s._hover((h) => h.boxShadow._middle) } },
    },
  },
})

/* 使用 */
const parts = cardParts({ hoverable: true })
/* parts.root / parts.header / parts.body / parts.footer */`"
    />

    <ZTitle :level="2">其他工具函数</ZTitle>
    <ApiTable
      :columns="[
        { key: 'fn',   label: '函数',    mono: true, width: '240px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { fn: 'ikeyframes(factory)',         desc: '生成 @keyframes animation name。factory 接受 { from, to, pct(n) } 写关键帧。' },
        { fn: 'cx(...inputs)',               desc: '合并 class 字符串，过滤 falsy，等同 clsx。' },
        { fn: 'injectGlobal(css)',           desc: '注入全局 CSS，常用于 scrollbar 样式、body 重置等。' },
        { fn: 'injectPreflight()',           desc: '注入 Tailwind 风格的 preflight / reset。' },
        { fn: 'registerFont(src, options)',  desc: '注入 @font-face 规则。' },
        { fn: 'registerCustomProperty(options)', desc: '注入 @property（CSS Houdini 类型化自定义属性）。' },
        { fn: 'toClassName(css)',            desc: '直接接受 Emotion CSSObject 返回 class，低级逃生口。' },
        { fn: 'createIcssInstance()',        desc: 'SSR / 多实例场景：创建独立的 emotion 实例。' },
      ]"
    />
  </section>
</template>
