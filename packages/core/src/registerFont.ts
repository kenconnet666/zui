import { injectGlobal } from './injectGlobal'

/**
 * W8.4 — `@font-face` 注册 helper。
 *
 * @example
 * registerFont('Inter', [
 *   { src: 'url(/fonts/Inter.woff2)', format: 'woff2', weight: 400 },
 *   { src: 'url(/fonts/Inter-Bold.woff2)', format: 'woff2', weight: 700 },
 * ])
 */
export interface FontFaceSource {
  /** 资源 URL（自带 `url(...)` 或纯 path；纯 path 会自动包裹）。 */
  src: string
  /** 格式提示，如 'woff2' / 'woff' / 'truetype'。 */
  format?: string
  weight?: number | string
  style?: 'normal' | 'italic' | 'oblique'
  /** `font-display` 策略，默认 'swap'。 */
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  /** `unicode-range` 范围，便于按子集分片加载。 */
  unicodeRange?: string
}

/**
 * 把字符串中的 `'` 转义为 `\'`，避免 url('...') / font-family 字符串拼接被破坏。
 *
 * **L6 防御**：原 `url('${s.src}')` 拼接对包含单引号的 url 会破坏 CSS。
 * Dev 模式检测到危险字符同时发 warn。
 */
function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, "\\'")
}

function isDevEnv(): boolean {
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}

export function registerFont(family: string, sources: FontFaceSource[]): void {
  for (const s of sources) {
    // url() 包裹：若用户已经写了 url(...) 就不再包；否则包成 url('escaped-src')
    let srcExpr: string
    if (s.src.includes('url(')) {
      srcExpr = s.src
      // 用户已自包 url(...)，无法插入额外 escape，dev 模式 warn
      if (isDevEnv() && /[<>"]/.test(s.src)) {
         
        console.warn(
          `[zui-core/registerFont] sources[].src 含可疑字符（< > "），可能破坏 @font-face：${s.src}`,
        )
      }
    } else {
      srcExpr = `url('${escapeSingleQuotes(s.src)}')`
    }
    const srcWithFormat = s.format
      ? `${srcExpr} format('${escapeSingleQuotes(s.format)}')`
      : srcExpr
    const escapedFamily = escapeSingleQuotes(family)
    const declarations: string[] = [
      `font-family: '${escapedFamily}'`,
      `src: ${srcWithFormat}`,
      `font-display: ${s.display ?? 'swap'}`,
    ]
    if (s.weight !== undefined) declarations.push(`font-weight: ${s.weight}`)
    if (s.style !== undefined) declarations.push(`font-style: ${s.style}`)
    if (s.unicodeRange) declarations.push(`unicode-range: ${s.unicodeRange}`)

    const block = `@font-face {\n  ${declarations.join(';\n  ')};\n}`
    injectGlobal(block)
  }
}
