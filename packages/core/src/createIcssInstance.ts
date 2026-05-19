import type { CSSObject } from '@emotion/css/create-instance'
import { Chain } from './chain/Chain'
import { Theme } from './theme/Theme'
import type { ResolvedTheme, ThemeSchema } from './theme/types'
import { PREFLIGHT_STYLES } from './preset/preflightStyles'
import { PRESET_ANIMATION_DEFS, type PresetAnimationName } from './preset/animation-defs'

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
  /** 透传 instance.injectGlobal（内置 instance 级内存去重，修 R3）。 */
  injectGlobal: (styles: CSSObject | string) => void
  /** 按 stops 注册 keyframes，返回 animation name。 */
  ikeyframes(factory: (k: KeyframesBuilder) => void): string
  /** W5.3 — 注册命名 keyframes 进 instance；返回该 animation name（同 ikeyframes，命名版本）。 */
  registerAnimation(name: string, stops: Record<string, CSSObject>): string
  /** W5.4 — 注入 normalize 风 preflight 到 instance（与全局 preflight 共享 single source）。 */
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
  /** 测试 / SSR 重置用：清空本 instance 的 injectGlobal 去重缓存（不撤销已注入的样式）。 */
  _resetInjectGlobalCache(): void
  /**
   * S4 — 本 instance 独立注册的 15 个预设动画（参考全局 `presetAnimations`，但
   * keyframes 注册在该 instance 的 emotion 中，SSR 隔离）。
   *
   * 懒加载：第一次访问任一字段时才注册到该 instance；不访问时无副作用。
   */
  readonly presetAnimations: Record<PresetAnimationName, string>
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
  // instance 级内存去重（修 R3）：与全局 injectGlobal.ts 平行，但每个 instance 独立
  // 一份，避免多实例隔离环境下相互污染。
  const injectedHashes = new Set<string>()

  function fingerprint(styles: CSSObject | string): string {
    if (typeof styles === 'string') return `s:${styles}`
    try {
      return `o:${JSON.stringify(styles)}`
    } catch {
      // 含循环引用 / Symbol 等不可序列化值；退回原样不去重
      return `_${Math.random()}`
    }
  }

  function dedupedInjectGlobal(styles: CSSObject | string): void {
    const key = fingerprint(styles)
    if (injectedHashes.has(key)) return
    injectedHashes.add(key)
    emotion.injectGlobal(styles as never)
  }

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
      dedupedInjectGlobal(styles)
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
      dedupedInjectGlobal(block)
      return name
    },
    injectPreflight() {
      // 用 single source PREFLIGHT_STYLES（修 R4：避免与全局 preflight 漂移）
      dedupedInjectGlobal(PREFLIGHT_STYLES)
    },
    registerCustomProperty(name, options) {
      const block = `@property ${name} {
  syntax: '${options.syntax}';
  inherits: ${options.inherits};
  initial-value: ${options.initialValue};
}`
      dedupedInjectGlobal(block)
    },
    injectLayerOrder(layers) {
      if (layers.length === 0) return
      dedupedInjectGlobal(`@layer ${layers.join(', ')};`)
    },
    injectLayer(name, styles) {
      dedupedInjectGlobal({ [`@layer ${name}`]: styles })
    },
    registerFont(family, sources) {
      // 与全局 registerFont 共享 escape 策略（L6 单引号 escape + 危险字符 dev warn）
      const escFamily = family.replace(/'/g, "\\'")
      for (const s of sources) {
        let srcExpr: string
        if (s.src.includes('url(')) {
          srcExpr = s.src
        } else {
          srcExpr = `url('${s.src.replace(/'/g, "\\'")}')`
        }
        const srcWithFormat = s.format
          ? `${srcExpr} format('${s.format.replace(/'/g, "\\'")}')`
          : srcExpr
        const declarations: string[] = [
          `font-family: '${escFamily}'`,
          `src: ${srcWithFormat}`,
          `font-display: ${s.display ?? 'swap'}`,
        ]
        if (s.weight !== undefined) declarations.push(`font-weight: ${s.weight}`)
        if (s.style !== undefined) declarations.push(`font-style: ${s.style}`)
        if (s.unicodeRange) declarations.push(`unicode-range: ${s.unicodeRange}`)
        const block = `@font-face {\n  ${declarations.join(';\n  ')};\n}`
        dedupedInjectGlobal(block)
      }
    },
    extractCritical() {
      emotion.flush?.()
    },
    _resetInjectGlobalCache() {
      injectedHashes.clear()
    },
    // S4: lazy 注册预设动画到本 instance
    presetAnimations: createLazyPresetAnimations(emotion),
  }
}

/**
 * 懒注册预设动画到指定 emotion instance。
 *
 * 返回的对象用 Proxy/getter 模式：第一次访问 `pa.fadeIn` 时才走 `emotion.keyframes()`
 * 注册到 instance；后续访问命中缓存。**未访问任何字段则零开销**。
 */
function createLazyPresetAnimations(emotion: EmotionLikeInstance): Record<PresetAnimationName, string> {
  const cache: Partial<Record<PresetAnimationName, string>> = {}
  return new Proxy({} as Record<PresetAnimationName, string>, {
    get(_, key: string): string | undefined {
      if (!(key in PRESET_ANIMATION_DEFS)) return undefined
      const k = key as PresetAnimationName
      const cached = cache[k]
      if (cached !== undefined) return cached
      const stops = PRESET_ANIMATION_DEFS[k]
      const name = emotion.keyframes(stops as never)
      cache[k] = name
      return name
    },
    has(_, key: string): boolean {
      return key in PRESET_ANIMATION_DEFS
    },
    ownKeys(): string[] {
      return Object.keys(PRESET_ANIMATION_DEFS)
    },
    getOwnPropertyDescriptor(_, key: string): PropertyDescriptor | undefined {
      if (!(key in PRESET_ANIMATION_DEFS)) return undefined
      return {
        enumerable: true,
        configurable: true,
        value: cache[key as PresetAnimationName],
      }
    },
  })
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
