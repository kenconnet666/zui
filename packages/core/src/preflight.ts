import { injectGlobal } from './injectGlobal'

/**
 * W5.4 — 仅 normalize 风格的全局 CSS reset（**不**等同 Tailwind 完整 preflight）。
 *
 * 设计哲学（D11）：
 *  - 不抢用户 CSS reset 选择权
 *  - 只做"几乎所有项目都需要"的零争议条目
 *  - 1 行调用就 OK，不参数化
 *
 * 覆盖：
 *  - `*` 设 `box-sizing: border-box`
 *  - body 移 margin / 行高 / 字体平滑
 *  - heading / p 移 margin
 *  - form 元素继承字体 / 颜色
 *  - 嵌入媒体（img/svg/video/canvas/audio/iframe/embed/object）设 `display: block` / `max-width: 100%`
 *  - 列表移内边距 / 移除 marker（用户用 list-style-type 自行声明）
 *
 * @example
 * import { injectPreflight } from '@kenconnet666/zui-core'
 * injectPreflight()
 */
export function injectPreflight(): void {
  injectGlobal({
    '*, *::before, *::after': { boxSizing: 'border-box' },
    body: {
      margin: 0,
      lineHeight: 1.5,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    'h1, h2, h3, h4, h5, h6, p, blockquote, dl, dd, figure, pre': { margin: 0 },
    'button, input, textarea, select, optgroup': {
      font: 'inherit',
      color: 'inherit',
      margin: 0,
    },
    'button, [role="button"]': { cursor: 'pointer' },
    'img, svg, video, canvas, audio, iframe, embed, object': {
      display: 'block',
      maxWidth: '100%',
    },
    'ul, ol': { listStyle: 'none', padding: 0, margin: 0 },
    a: { color: 'inherit', textDecoration: 'inherit' },
  })
}
