import { Theme, FLAT_PALETTE, tw, zu } from '@kenconnet666/zui-core'
import type { ZuiSchema } from './schema'

/**
 * zui 默认浅色主题 —— Tailwind palette 242 色 + 11 个语义色 alias 到具体 shade +
 * 完整 5 阶 size scale + 9 阶 fontWeight + 5 个 easing + 5 阶 breakpoint + UI 角色 z-index +
 * Tailwind 衍生 lineHeight/letterSpacing/opacity/aspectRatio。
 *
 * **尺寸类 token（spacing / radius / fontSize / blur）走 zui 逻辑单位 `zu`**：
 * 每个值 emit `calc(N * var(--zui-unit, 1px))`，默认 1zu = 1px（与传统 css 行为一致）；
 * `<ZConfigProvider :unit="'2px'">` 整站放大 2×、`:unit="ZUnitPreset.rem"` 跟随浏览器根字号
 * （a11y 友好）等，**单点切换全站 sizing**。详见 skill §13.0 ②。
 *
 * **不走 zu 的几类**（设计哲学）：
 * - `breakpoint` —— 媒体查询基准，跟"屏幕宽度"绑定，不该跟 unit 缩放
 * - `shadow` —— 装饰性效果，保留 px 字面量与设计稿绑定
 * - `radius.full = '9999px'` —— "无穷大圆角"语义
 * - `blur.none = '0'` —— 0 长度无需 calc
 * - `letterSpacing` —— em 单位，跟字体本身缩放（zu 体系无关）
 * - `duration` / `easing` / `zIndex` / `opacity` / `lineHeight` / `aspectRatio` / `fontWeight` —— 非长度
 *
 * 业务侧顶层主题入口；用户工程通过 `<ZConfigProvider :theme="zuiLight">` 注入。
 */
export const zuiLight = new Theme<ZuiSchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '600'),
    primaryHover: tw('blue', '500'),
    danger: tw('red', '600'),
    warning: tw('yellow', '500'),
    success: tw('green', '500'),
    info: tw('cyan', '500'),
    text: tw('gray', '900'),
    textMuted: tw('gray', '600'),
    bg: '#ffffff',
    bgMuted: tw('gray', '50'),
    border: tw('gray', '200'),
  },
  spacing: {
    tiny: zu(4),
    small: zu(8),
    middle: zu(16),
    large: zu(24),
    huge: zu(32),
  },
  radius: {
    none: '0',
    tiny: zu(4),
    small: zu(8),
    middle: zu(12),
    large: zu(16),
    huge: zu(24),
    full: '9999px',
  },
  fontSize: {
    tiny: zu(12),
    small: zu(14),
    middle: zu(16),
    large: zu(18),
    huge: zu(20),
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  shadow: {
    tiny: '0 1px 1px 0 rgb(0 0 0 / 0.03)',
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    middle: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    huge: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  blur: {
    none: '0',
    tiny: zu(4),
    small: zu(8),
    middle: zu(16),
    large: zu(24),
    huge: zu(40),
  },
  duration: {
    none: '0ms',
    tiny: '75ms',
    small: '150ms',
    middle: '300ms',
    large: '500ms',
    huge: '700ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoint: {
    tiny: '640px',
    small: '768px',
    middle: '1024px',
    large: '1280px',
    huge: '1536px',
  },
  zIndex: {
    auto: 'auto',
    none: 0,
    tiny: 10,
    small: 20,
    middle: 30,
    large: 40,
    huge: 50,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
    toast: 1300,
  },
  opacity: {
    none: 0,
    faint: 0.05,
    dim: 0.25,
    half: 0.5,
    strong: 0.75,
    solid: 0.95,
    full: 1,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
  aspectRatio: {
    square: '1 / 1',
    video: '16 / 9',
    portrait: '3 / 4',
    landscape: '4 / 3',
  },
})
