<script lang="ts">
/**
 * `ZCode` —— 代码渲染组件,内置 shiki 语法高亮(optional peer)。
 *
 * **三种渲染模式**:
 * 1. 行内 `<code>`:`inline=true`(默认),纯文本,不高亮
 * 2. 块级 fallback `<pre><code>`:`inline=false` + `lang` 未传 / shiki 未装 / 高亮失败 → 纯文本
 * 3. 块级高亮:`inline=false` + `lang` 已传 + `shiki` 已装 → 异步 `codeToHtml` v-html
 *
 * **API**:
 * - `code?: string` —— 代码文本(优先于 default slot;高亮模式必传 prop)
 * - `lang?: string` —— shiki 语言标识(`'ts'` / `'js'` / `'json'` / `'vue'` 等),未传不高亮
 * - `themes?: { light: string; dark: string }` —— shiki 双主题,默认
 *   `light-plus` / `tokyo-night`
 * - `colorScheme?: 'auto' | 'light' | 'dark'` —— 默认 `'auto'`,通过
 *   `@media (prefers-color-scheme: dark)` 切换 light/dark var
 * - `inline?: boolean` —— 默认 `true`(`<code>`);`false` 走块级(高亮前置条件)
 * - `color?: factory` —— 文字色 carrier(仅 fallback / 未高亮时生效)
 * - `css?: factory` —— 根元素覆盖
 *
 * **依赖**:`shiki ^3.13` 列为 `peerDependenciesMeta.optional`,业务方按需 `pnpm add shiki`;
 * 未安装时控制台 warn 一次后 fallback 纯文本。
 *
 * **实现注**:为保证 vue-test-utils `wrapper.element` 拿到正确 tag(`<code>` / `<pre>` /
 * `<div>`),组件用 `defineComponent` + `setup` 返回 render function 模式而非 `<script setup>`
 * + template,避免多根 v-if 被测试工具包成额外 wrapper。
 */
import { computed, defineComponent, h, ref, watch, type PropType, type VNode } from 'vue'
import type { Chain } from '@kenconnet666/zui-core'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import type { ZuiSchema } from '../provider/theme'

export interface ZCodeProps {
  /** 代码文本。高亮模式必传(default slot 内容无法可靠提取)。 */
  code?: string
  /** shiki 语言标识,未传 → 不启用高亮。 */
  lang?: string
  /** shiki 双主题对,默认 `light-plus` / `tokyo-night`。 */
  themes?: { light: string; dark: string }
  /** 颜色模式:`'auto'`(跟随 OS prefers-color-scheme,默认)/ `'light'` / `'dark'`。 */
  colorScheme?: 'auto' | 'light' | 'dark'
  /** 行内 `<code>` 还是块级 `<pre><code>`。默认 `true`(行内,不高亮)。 */
  inline?: boolean
  /** 文字色 carrier(fallback / 未高亮模式生效;高亮模式由 shiki 控制色)。 */
  color?: ((c: Chain<ZuiSchema>['color']) => void) | undefined
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

/**
 * 盒子模型(iem,Provider 控制基准;number 是 iem 倍数,默认 1iem=16px @ 1080p):
 *
 *   行内模式(inline=true):
 *   ┌──────────────┐
 *   │ <code>       │   font-family: _mono
 *   │  paddingX: 0.375iem  paddingY: 0.0625iem    │
 *   │  bg: _bgMuted / border _thin _border / radius _tiny
 *   │  fontSize: 0.875iem(相对父字号小一号)     │
 *   └──────────────┘
 *
 *   块级 fallback(inline=false, 未高亮):
 *   ┌──────────────────────────┐
 *   │ <pre><code>              │   font-family: _mono
 *   │   pad _small / overflowX auto              │
 *   │   bg _bgMuted / border _thin _border       │
 *   │   fontSize _small / lineHeight _normal     │
 *   └──────────────────────────┘
 *
 *   块级高亮(inline=false, lang+shiki):
 *   ┌──────────────────────────────┐
 *   │ <div root>(wrapper)         │   font-family: _mono
 *   │  ┌────────────────────────┐  │
 *   │  │ <pre class="shiki">   │  │   margin 0 / pad _small
 *   │  │  shiki output spans   │  │   border _thin _border / radius _tiny
 *   │  │  color: var(--shiki-light)│  │   overflowX auto / fontSize _small
 *   │  │  bg: var(--shiki-light-bg)│  │
 *   │  │  @media dark → var(--shiki-dark*)│  │   colorScheme=auto/dark 控制
 *   │  └────────────────────────┘  │
 *   └──────────────────────────────┘
 *
 * shiki 用 `defaultColor: false` —— 输出 spans 仅含 `--shiki-light` + `--shiki-dark` CSS var,
 * 由 wrapper 的 emotion class 通过 `_dark()` 媒体查询切换 var 生效色。
 * 未传 lang / shiki 未装 / 高亮失败 → 自动 fallback 纯文本。非 iem 单位走 `:css` 兜底。
 */

// ─── shiki 动态加载(optional peer);模块级缓存 ───
interface ShikiCodeToHtmlOpts {
  lang: string
  themes: { light: string; dark: string }
  defaultColor: false
}
type ShikiCodeToHtml = (code: string, opts: ShikiCodeToHtmlOpts) => Promise<string>
let shikiCache: { codeToHtml: ShikiCodeToHtml } | null | undefined
let warnedMissing = false

async function loadShiki(): Promise<{ codeToHtml: ShikiCodeToHtml } | null> {
  if (shikiCache !== undefined) return shikiCache
  try {
    // 字面量动态 import —— 让 Vite 等下游 bundler 能静态识别并解析。
    // ui-vue 自身的 vite.config 把 `shiki` 列为 `rollupOptions.external`,
    // 不打进 dist;消费方(若装了 shiki)的 bundler 负责实际加载。
    // 未装 shiki:try-catch 走 fallback 纯文本(consoleconsole.warn 一次)。
    const mod = (await import('shiki')) as {
      codeToHtml: ShikiCodeToHtml
    }
    shikiCache = { codeToHtml: mod.codeToHtml }
  } catch {
    if (
      !warnedMissing &&
      (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production')
    ) {
      console.warn(
        '[zui-vue/ZCode] `shiki` 未安装,回落纯文本渲染。' +
          '\n  启用代码高亮:`pnpm add shiki`(或 npm/yarn)',
      )
      warnedMissing = true
    }
    shikiCache = null
  }
  return shikiCache
}

const DEFAULT_THEMES = { light: 'light-plus', dark: 'tokyo-night' } as const

export default defineComponent({
  name: 'ZCode',
  props: {
    code: { type: String, default: undefined },
    lang: { type: String, default: undefined },
    themes: {
      type: Object as PropType<{ light: string; dark: string }>,
      default: () => ({ ...DEFAULT_THEMES }),
    },
    colorScheme: {
      type: String as PropType<'auto' | 'light' | 'dark'>,
      default: 'auto',
    },
    inline: { type: Boolean, default: true },
    color: {
      type: Function as PropType<(c: Chain<ZuiSchema>['color']) => void>,
      // 文字色默认 `_text`(可被 user factory 覆盖)。仅 fallback / 未高亮时生效
      default: (c: Chain<ZuiSchema>['color']) => {
        c._text
      },
    },
    css: {
      type: Function as PropType<(s: Chain<ZuiSchema>) => void>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const theme = useZTheme()

    // ─── 高亮 HTML(null=fallback 纯文本 / string=shiki 输出)───
    const highlighted = ref<string | null>(null)

    watch(
      () =>
        [
          props.code,
          props.lang,
          props.themes.light,
          props.themes.dark,
          props.inline,
        ] as const,
      async ([code, lang, light, dark, inline]) => {
        // 行内模式 / lang 未传 / code 为空 → 不高亮
        if (inline || !lang || !code) {
          highlighted.value = null
          return
        }
        const shiki = await loadShiki()
        if (!shiki) {
          highlighted.value = null
          return
        }
        try {
          highlighted.value = await shiki.codeToHtml(code, {
            lang,
            themes: { light, dark },
            defaultColor: false,
          })
        } catch (e) {
          // shiki 抛(未注册的 lang 等)→ fallback 纯文本
          if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
            console.warn(`[zui-vue/ZCode] shiki 高亮失败 (lang=${lang}):`, e)
          }
          highlighted.value = null
        }
      },
      { immediate: true },
    )

    // ─── 根 className ───
    const rootClass = computed(() =>
      icss(theme.value, (s) => {
        s.fontFamily._mono

        if (highlighted.value !== null) {
          // 高亮模式:wrapper 透明,样式落在内层 .shiki <pre>
          s.display.block
          s.borderRadius._tiny

          s._selector('& .shiki', (sub) => {
            sub.margin.px(0)
            sub.padding._small
            sub.borderRadius._tiny
            sub.borderWidth._thin
            sub.borderStyle.solid
            sub.borderColor._border
            sub.overflowX.auto
            sub.fontSize._small
            sub.lineHeight._normal
            sub.color('var(--shiki-light)')
            sub.backgroundColor('var(--shiki-light-bg)')
          })
          s._selector('& .shiki span', (sub) => {
            sub.color('var(--shiki-light)')
          })

          if (props.colorScheme === 'auto') {
            s._dark((d) => {
              d._selector('& .shiki', (sub) => {
                sub.color('var(--shiki-dark)')
                sub.backgroundColor('var(--shiki-dark-bg)')
              })
              d._selector('& .shiki span', (sub) => {
                sub.color('var(--shiki-dark)')
              })
            })
          } else if (props.colorScheme === 'dark') {
            s._selector('& .shiki', (sub) => {
              sub.color('var(--shiki-dark)')
              sub.backgroundColor('var(--shiki-dark-bg)')
            })
            s._selector('& .shiki span', (sub) => {
              sub.color('var(--shiki-dark)')
            })
          }
          // colorScheme==='light' → 走默认 light var,无 dark 覆盖
        } else {
          // fallback / 未高亮(纯文本)
          s.backgroundColor._bgMuted
          s.borderRadius._tiny
          s.borderWidth._thin
          s.borderStyle.solid
          s.borderColor._border
          s.color(props.color)

          if (props.inline) {
            s.display.inlineBlock
            s.paddingLeft.iem(0.375)
            s.paddingRight.iem(0.375)
            s.paddingTop.iem(0.0625)
            s.paddingBottom.iem(0.0625)
            s.fontSize._small
          } else {
            s.display.block
            s.padding._small
            s.overflowX.auto
            s.whiteSpace.pre
            s.fontSize._small
            s.lineHeight._normal
          }
        }

        props.css?.(s)
      }),
    )

    return (): VNode => {
      // 高亮:整段 shiki <pre class="shiki">…</pre> 作为 div 内容
      if (highlighted.value !== null) {
        return h('div', {
          class: rootClass.value,
          innerHTML: highlighted.value,
        })
      }
      // fallback 块级:<pre><code><slot/></code></pre>
      const slotContent = slots.default?.() ?? [props.code ?? '']
      if (!props.inline) {
        return h(
          'pre',
          { class: rootClass.value },
          [h('code', null, slotContent)],
        )
      }
      // fallback 行内:<code><slot/></code>
      return h('code', { class: rootClass.value }, slotContent)
    }
  },
})
</script>
