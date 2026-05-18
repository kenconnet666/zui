import { injectGlobal as emotionInjectGlobal } from '@emotion/css'

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

export function registerFont(family: string, sources: FontFaceSource[]): void {
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
    emotionInjectGlobal(block as never)
  }
}
