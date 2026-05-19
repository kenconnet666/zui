import { Theme } from '../Theme'
import { FLAT_PALETTE, tw } from './palette'
import type { DefaultSchema } from './schema'

/**
 * 内置浅色主题（完整 Tailwind palette 242 色 + 11 语义色 + 8 个补充 token category）。
 * 语义色 alias 到 palette 具体 shade（例如 `primary = tw('blue', '600')`）。
 */
export const defaultLight = new Theme<DefaultSchema>({
  color: {
    // ─── palette 242 色 ───
    ...FLAT_PALETTE,
    // ─── 语义色（light） ───
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
    tiny: '4px',
    small: '8px',
    middle: '16px',
    large: '24px',
    huge: '32px',
  },
  radius: {
    none: '0',
    tiny: '4px',
    small: '8px',
    middle: '12px',
    large: '16px',
    huge: '24px',
    full: '9999px',
  },
  fontSize: {
    tiny: '12px',
    small: '14px',
    middle: '16px',
    large: '18px',
    huge: '20px',
  },
  fontWeight: {
    tiny: 300,
    small: 400,
    middle: 500,
    large: 600,
    huge: 700,
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
    tiny: '4px',
    small: '8px',
    middle: '16px',
    large: '24px',
    huge: '40px',
  },
  // ─── W1.8 补充 ───
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
    tiny: 0.05,
    small: 0.25,
    middle: 0.5,
    large: 0.75,
    huge: 0.95,
    full: 1,
  },
  lineHeight: {
    none: 1,
    tiny: 1.25,
    small: 1.375,
    middle: 1.5,
    large: 1.625,
    huge: 2,
  },
  letterSpacing: {
    tiny: '-0.05em',
    small: '-0.025em',
    middle: '0',
    large: '0.025em',
    huge: '0.05em',
  },
  aspectRatio: {
    square: '1 / 1',
    video: '16 / 9',
    portrait: '3 / 4',
    landscape: '4 / 3',
  },
})
