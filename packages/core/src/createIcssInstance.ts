import type { CSSObject } from '@emotion/css/create-instance'
import { Chain } from './chain/Chain'
import { Theme } from './theme/Theme'
import type { ResolvedTheme, ThemeSchema } from './theme/types'

/**
 * W5.1 — SSR / 多实例 wrapper（D8 落地）。
 *
 * 用户用 `@emotion/css/create-instance` 创建独立 emotion instance 后传入，
 * 拿到一组绑定到该 instance 的 API：所有 `css` / `injectGlobal` / `keyframes` 都走该 instance，
 * 不污染全局 emotion cache。
 *
 * @example
 * import { createInstance } from '@emotion/css/create-instance'
 * import { createIcssInstance } from '@kenconnet666/zui-core'
 *
 * const emotion = createInstance({ key: 'myapp' })
 * const { icss, injectPreflight, registerCustomProperty } = createIcssInstance(emotion)
 *
 * const cls = icss(defaultLight, s => { s.color._primary })
 * injectPreflight()
 */

/** 子集接口：只包含我们要用的 emotion API。 */
export interface EmotionLikeInstance {
  css: (obj: CSSObject) => string
  cx: (...args: (string | false | null | undefined)[]) => string
  injectGlobal: (styles: CSSObject | string) => void
  keyframes: (stops: Record<string, CSSObject>) => string
  /** emotion 11 server SSR API；不强制要求 instance 提供。 */
  flush?: () => void
}

export interface IcssInstance {
  /** 一行 shortcut：传 theme + factory，返回该 instance 的 className。 */
  icss<T extends ThemeSchema>(
    theme: ResolvedTheme<T> | Theme<T>,
    factory: (s: Chain<T>) => void,
  ): string
  /** 显式 Chain 构造（绑定 instance.css）。 */
  chain<T extends ThemeSchema>(theme: ResolvedTheme<T> | Theme<T>): Chain<T>
  /** 透传 instance.cx。 */
  cx: EmotionLikeInstance['cx']
  /** 透传 instance.injectGlobal。 */
  injectGlobal: (styles: CSSObject | string) => void
  /** 按 stops 注册 keyframes，返回 animation name。 */
  ikeyframes(factory: (k: KeyframesBuilder) => void): string
  /** W5.3 — 注册命名 keyframes 进 instance；返回该 animation name（同 ikeyframes，命名版本）。 */
  registerAnimation(name: string, stops: Record<string, CSSObject>): string
  /** W5.4 — 注入 normalize 风 preflight 到 instance。 */
  injectPreflight(): void
  /** W5.5 — 在 instance 上注册 @property。 */
  registerCustomProperty(name: `--${string}`, options: CustomPropertyOptions): void
  /** W8.1 — 注入 @layer order 到 instance。 */
  injectLayerOrder(layers: readonly string[]): void
  /** W8.1 — 注入命名 @layer 的样式块。 */
  injectLayer(name: string, styles: CSSObject): void
  /** W8.4 — @font-face 注册。 */
  registerFont(family: string, sources: FontFaceSource[]): void
  /** emotion 11 SSR flush（如果 instance 提供）。 */
  extractCritical(): void
}

export interface KeyframesBuilder {
  at(stop: string, styles: CSSObject): KeyframesBuilder
  from(styles: CSSObject): KeyframesBuilder
  to(styles: CSSObject): KeyframesBuilder
}

export interface CustomPropertyOptions {
  syntax: string
  inherits: boolean
  initialValue: string | number
}

export interface FontFaceSource {
  src: string
  format?: string
  weight?: number | string
  style?: 'normal' | 'italic' | 'oblique'
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  unicodeRange?: string
}

export function createIcssInstance(emotion: EmotionLikeInstance): IcssInstance {
  return {
    icss(theme, factory) {
      const c = new Chain(theme, { cssFn: emotion.css })
      factory(c)
      return c.toString()
    },
    chain<T extends ThemeSchema>(theme: ResolvedTheme<T> | Theme<T>): Chain<T> {
      return new Chain<T>(theme, { cssFn: emotion.css })
    },
    cx: emotion.cx,
    injectGlobal(styles) {
      emotion.injectGlobal(styles as never)
    },
    ikeyframes(factory) {
      const stops: Record<string, CSSObject> = {}
      const builder: KeyframesBuilder = {
        at(stop, styles) {
          stops[stop] = { ...(stops[stop] ?? {}), ...styles }
          return builder
        },
        from(styles) { return builder.at('from', styles) },
        to(styles) { return builder.at('to', styles) },
      }
      factory(builder)
      return emotion.keyframes(stops)
    },
    registerAnimation(name, stops) {
      // emotion.keyframes 返回 anonymous animation name；用 injectGlobal 注册命名 @keyframes
      const block = renderKeyframes(name, stops)
      emotion.injectGlobal(block as never)
      return name
    },
    injectPreflight() {
      emotion.injectGlobal({
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: { margin: 0, lineHeight: 1.5, WebkitFontSmoothing: 'antialiased' },
        'h1, h2, h3, h4, h5, h6, p, blockquote, dl, dd, figure, pre': { margin: 0 },
        'button, input, textarea, select, optgroup': { font: 'inherit', color: 'inherit', margin: 0 },
        'button, [role="button"]': { cursor: 'pointer' },
        'img, svg, video, canvas, audio, iframe, embed, object': { display: 'block', maxWidth: '100%' },
        'ul, ol': { listStyle: 'none', padding: 0, margin: 0 },
        a: { color: 'inherit', textDecoration: 'inherit' },
      } as never)
    },
    registerCustomProperty(name, options) {
      const block = `@property ${name} {
  syntax: '${options.syntax}';
  inherits: ${options.inherits};
  initial-value: ${options.initialValue};
}`
      emotion.injectGlobal(block as never)
    },
    injectLayerOrder(layers) {
      if (layers.length === 0) return
      emotion.injectGlobal(`@layer ${layers.join(', ')};` as never)
    },
    injectLayer(name, styles) {
      emotion.injectGlobal({ [`@layer ${name}`]: styles } as never)
    },
    registerFont(family, sources) {
      for (const s of sources) {
        const srcRaw = s.src.includes('url(') ? s.src : `url(${s.src})`
        const srcWithFormat = s.format ? `${srcRaw} format('${s.format}')` : srcRaw
        const declarations: string[] = [
          `font-family: '${family}'`,
          `src: ${srcWithFormat}`,
          `font-display: ${s.display ?? 'swap'}`,
        ]
        if (s.weight !== undefined) declarations.push(`font-weight: ${s.weight}`)
        if (s.style !== undefined) declarations.push(`font-style: ${s.style}`)
        if (s.unicodeRange) declarations.push(`unicode-range: ${s.unicodeRange}`)
        const block = `@font-face {\n  ${declarations.join(';\n  ')};\n}`
        emotion.injectGlobal(block as never)
      }
    },
    extractCritical() {
      emotion.flush?.()
    },
  }
}

function renderKeyframes(name: string, stops: Record<string, CSSObject>): string {
  const blocks = Object.entries(stops).map(([stop, styles]) => {
    const declarations = Object.entries(styles)
      .map(([k, v]) => `  ${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v as string};`)
      .join('\n')
    return `${stop} {\n${declarations}\n}`
  }).join('\n')
  return `@keyframes ${name} {\n${blocks}\n}`
}
