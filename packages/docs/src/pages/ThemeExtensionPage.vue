<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
import CodeBlock from '../components/CodeBlock.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">主题扩展(declare module)</ZTitle>
    <ZParagraph>
      zui 主题系统通过 TypeScript <strong>declaration merging</strong>(<ZCode
        code="declare module"
      />) 让用户工程<strong>零运行时模板</strong>注入自家的 brand 色 / spacing / fontSize 等自定义
      token, 所有 chain factory 自动获得 IDE 补全(<ZCode code="s.color._brandRoyal" /> /
      <ZCode code="s.spacing._extra" />), 无需手写
      <ZCode code="interface MySchema extends ZuiSchema { ... }" /> 也无需 cast
      <ZCode code="&lt;S&gt;" /> 泛型。
    </ZParagraph>

    <ZTitle :level="2">扩展锚点(19 个)</ZTitle>
    <ZParagraph>
      <ZCode code="@kenconnet666/zui-vue" /> 在 <ZCode code="provider/theme/schema.ts" /> 导出 19
      个空 interface, 跟 <ZCode code="ZuiSchema" /> 的每个 category 一一对应。通过
      <ZCode code="declare module" /> 往这些 interface 里追加字段,即可让对应 chain carrier 多出
      <ZCode code="_xxx" /> token。
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'ext', label: 'interface 锚点', mono: true, width: '240px' },
        { key: 'category', label: '对应 schema category', mono: true, width: '180px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          ext: 'UserColorExt',
          category: 'color',
          desc: '颜色 token —— brand 主色、状态色、副色等。',
        },
        { ext: 'UserSpacingExt', category: 'spacing', desc: 'padding / margin / gap 间距。' },
        { ext: 'UserRadiusExt', category: 'radius', desc: '圆角。' },
        { ext: 'UserFontSizeExt', category: 'fontSize', desc: '字号。' },
        { ext: 'UserFontWeightExt', category: 'fontWeight', desc: '字重(数字)。' },
        { ext: 'UserShadowExt', category: 'shadow', desc: 'box-shadow / elevation。' },
        { ext: 'UserBlurExt', category: 'blur', desc: '滤镜模糊(backdrop-filter)。' },
        { ext: 'UserDurationExt', category: 'duration', desc: '动画 / 过渡时长。' },
        { ext: 'UserEasingExt', category: 'easing', desc: 'cubic-bezier 曲线。' },
        {
          ext: 'UserBreakpointExt',
          category: 'breakpoint',
          desc: '响应式断点(_media(_xxx, ...))。',
        },
        { ext: 'UserZIndexExt', category: 'zIndex', desc: '层级。' },
        { ext: 'UserOpacityExt', category: 'opacity', desc: '透明度。' },
        { ext: 'UserLineHeightExt', category: 'lineHeight', desc: '行高(数字)。' },
        { ext: 'UserLetterSpacingExt', category: 'letterSpacing', desc: '字间距。' },
        { ext: 'UserAspectRatioExt', category: 'aspectRatio', desc: '宽高比预设。' },
        { ext: 'UserFontsExt', category: 'fonts', desc: '字体家族(sans / serif / mono)。' },
        {
          ext: 'UserSizesExt',
          category: 'sizes',
          desc: 'width / height / max-width 等元素自身尺寸。',
        },
        { ext: 'UserBordersExt', category: 'borders', desc: 'border-width / outline-width 粗细。' },
        {
          ext: 'UserTransitionPropertyExt',
          category: 'transitionProperty',
          desc: 'transition-property 预设(colors/opacity/transform 等)。',
        },
      ]"
    />

    <ZTitle :level="2">declare module 语法</ZTitle>
    <ZParagraph>
      在用户工程的 <ZCode code="zui.d.ts" />(或任意 <ZCode code=".d.ts" /> / <ZCode code=".ts" />)
      里写一段 <ZCode code="declare module" />:
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// src/types/zui.d.ts
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandRoyal: string
    brandSunset: string
  }
  interface UserSpacingExt {
    extra: string       // 比 huge 还大
    pico: string        // 比 tiny 还小
  }
  interface UserFontSizeExt {
    display: string     // 展示用超大号
  }
}

export {}  // 让该文件成为 module(否则全局污染)`"
    />
    <ZParagraph> augmentation 立即生效: </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'effect', label: '生效项', mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { effect: 'ZuiSchema.color', desc: '自动多出 brandRoyal / brandSunset 字段(类型层)。' },
        {
          effect: 'Chain<ZuiSchema>',
          desc: 's.color._brandRoyal / s.color._brandSunset 自动可用,IDE 补全。',
        },
        { effect: 's.spacing._extra', desc: 'spacing carrier 多出 _extra / _pico token。' },
        {
          effect: 'theme.extend({...})',
          desc: '类型层接受 brandRoyal/brandSunset/extra/pico 等新字段(必须传值)。',
        },
      ]"
    />

    <ZTitle :level="2">完整样例</ZTitle>

    <ZTitle :level="3">① 扩展类型层</ZTitle>
    <CodeBlock
      lang="ts"
      :code="`// src/types/zui.d.ts
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandPrimary: string
    brandAccent: string
    brandMuted: string
  }
  interface UserSpacingExt {
    section: string        // 大区块间距
  }
  interface UserFontSizeExt {
    hero: string           // hero banner 用
    micro: string          // 小注解
  }
  interface UserShadowExt {
    glow: string           // 品牌发光效果
  }
}

export {}`"
    />

    <ZTitle :level="3">② 注入运行时值</ZTitle>
    <CodeBlock
      lang="ts"
      :code="`// src/theme.ts
import { zuiLight } from '@kenconnet666/zui-vue'

export const myTheme = zuiLight.extend({
  color: {
    brandPrimary: '#1a3a8f',
    brandAccent:  '#ff7849',
    brandMuted:   '#7b8cb5',
    // 也可以覆盖内置语义色
    primary: '#1a3a8f',
  },
  spacing: {
    section: '64px',
  },
  fontSize: {
    hero:  '48px',
    micro: '10px',
  },
  shadow: {
    glow: '0 0 24px rgba(26, 58, 143, 0.4)',
  },
})`"
    />

    <ZTitle :level="3">③ ZBox 注入</ZTitle>
    <CodeBlock
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZBox } from '@kenconnet666/zui-vue'
import { myTheme } from './theme'
<\/script>

<template>
  <ZBox :theme=&quot;myTheme&quot;>
    <App />
  </ZBox>
</template>`"
    />

    <ZTitle :level="3">④ 组件内使用</ZTitle>
    <CodeBlock
      lang="vue"
      :code="`<template>
  <!-- chain carrier 自动补全自定义 token -->
  <ZTitle :level=&quot;1&quot; :color=&quot;(c) => c._brandPrimary&quot; :size=&quot;(f) => f._hero&quot;>
    欢迎来到品牌站
  </ZTitle>

  <ZText :color=&quot;(c) => c._brandMuted&quot; :size=&quot;(f) => f._micro&quot;>
    品牌副文案
  </ZText>

  <ZBox
    :css=&quot;(s) => {
      s.padding._section
      s.boxShadow._glow
      s.background.color._brandAccent.alpha(8)
    }&quot;
  >
    Hero 区块
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">自定义主题工厂(从零写一份)</ZTitle>
    <ZParagraph>
      <ZCode code="zuiLight" />/<ZCode code="zuiDark" /> 直接
      <ZCode code=".extend()" /> 是<strong>推荐入口</strong>—— 保留所有内置
      token,只覆盖差异。如果需要彻底替换(比如做完全独立的设计系统),用
      <ZCode code="Theme" /> 类从零构造,参考 <ZCode code="zui-light.ts" /> 的写法:
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`import { Theme, FLAT_PALETTE } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '@kenconnet666/zui-vue'

export const myCustomTheme = new Theme<ZuiSchema>({
  color: {
    ...FLAT_PALETTE,            // 保留 Tailwind 242 色 palette
    primary: '#1a3a8f',
    danger:  '#c41e3a',
    warning: '#e67e22',
    success: '#27ae60',
    info:    '#3498db',
    text:    '#1a1a1a',
    textSecondary: '#6b6b6b',
    bg:      '#fafafa',
    bgMuted: '#f0f0f0',
    border:  '#dcdcdc',
    focusRing: '#1a3a8f',
    overlayBg: '#000000',
  },
  spacing: {
    tiny:   '4px',
    small:  '8px',
    middle: '16px',
    large:  '24px',
    huge:   '32px',
  },
  // ... 其它 16 个 category(完整字段参考 zui-light.ts)
})`"
    />

    <ZTitle :level="2">主题切换(useZTheme.set)</ZTitle>
    <ZParagraph>
      运行时切主题最常见模式:把 <ZCode code="theme" /> 绑成 ref / computed,在按钮点击时换值。
      <ZCode code="ZBox" /> 监听 <ZCode code="theme" /> prop 变化,所有 chain factory 自动重算。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { computed, ref } from 'vue'
import { ZBox, zuiLight, zuiDark } from '@kenconnet666/zui-vue'
import { myTheme } from './theme'

type Mode = 'light' | 'dark' | 'brand'
const mode = ref<Mode>('light')

const theme = computed(() => {
  switch (mode.value) {
    case 'dark':  return zuiDark
    case 'brand': return myTheme
    default:      return zuiLight
  }
})
<\/script>

<template>
  <ZBox :theme=&quot;theme&quot;>
    <button @click=&quot;mode = 'light'&quot;>浅色</button>
    <button @click=&quot;mode = 'dark'&quot;>暗色</button>
    <button @click=&quot;mode = 'brand'&quot;>品牌</button>
    <App />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">局部 themePatch</ZTitle>
    <ZParagraph>
      子树用 <ZCode code=":theme-patch" /> 增量 patch 父主题,不需要重新构造完整 theme。 合并走
      <ZCode code="mergeTheme" /> 深合并。
    </ZParagraph>
    <CodeBlock
      lang="vue"
      :code="`<template>
  <!-- 外层用品牌主题 -->
  <ZBox :theme=&quot;myTheme&quot;>
    <MainContent />

    <!-- 内层局部把 primary 改红 -->
    <ZBox :theme-patch=&quot;{ color: { primary: '#d32f2f' } }&quot;>
      <DangerZone />     <!-- 这里的 _primary 是红色 -->
    </ZBox>
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">访问扩展 token</ZTitle>
    <ZParagraph>
      所有 chain factory(prop callback / <ZCode code="css" /> / <ZCode code="useStyles" /> /
      <ZCode code="icss" />) 都自动可用:
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// ① 组件 prop callback
<ZIcon :color=&quot;(c) => c._brandRoyal&quot; />

// ② css 兜底口
<ZBox :css=&quot;(s) => { s.color._brandRoyal; s.padding._section }&quot; />

// ③ icss 顶层入口
import { icss, useZTheme } from '@kenconnet666/zui-vue'
const theme = useZTheme()
const cls = computed(() => icss(theme.value, (s) => {
  s.color._brandRoyal
  s.boxShadow._glow
}))

// ④ 直接读 token 值
const primaryHex = theme.value.color.brandRoyal   // '#1a3a8f'`"
    />

    <ZTitle :level="2">三层继承关系</ZTitle>
    <CodeBlock
      lang="text"
      :code="`@kenconnet666/zui-core    BaseSchema    /* Tailwind 242 色 palette + 基本 category */
                    ▲ extends
@kenconnet666/zui-vue     ZuiSchema     /* + 语义色(primary/danger/...)+ 5 阶 size scale */
                    ▲ declaration merge(UserXxxExt)
用户工程               UserSchema    /* 你的 brand 色 + 自家 token */`"
    />

    <ZTitle :level="2">注意事项</ZTitle>
    <ApiTable
      :columns="[
        { key: 'topic', label: '问题', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          topic: 'extend 必须传值',
          desc: 'augmentation 只是类型层声明 —— 真正的运行时值要在 theme.extend({...}) 中传入,否则访问时 undefined。',
        },
        {
          topic: '数字开头 key',
          desc: '不能用 2xl / 4xl 等非合法 ident。schema 内部已用语义化命名(tiny/small/middle/large/huge)避免此问题;扩展时也建议遵循。',
        },
        {
          topic: 'd.ts 文件包含路径',
          desc: 'tsconfig 的 include 必须覆盖该 d.ts 文件,否则 augmentation 不生效。',
        },
        {
          topic: 'export {} 防全局污染',
          desc: 'declare module 文件末尾加 export {} 确保是 module 模式,而不是 global script。',
        },
        {
          topic: 'function token',
          desc: 'mergeTheme/extend 的 partial 应基于已解析的字面量,不要再传 function token(dev 模式会 warn)。',
        },
      ]"
    />
  </section>
</template>
