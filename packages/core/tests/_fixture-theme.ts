/**
 * Core 测试 fixture —— 复刻旧 `defaultLight` / `defaultDark` 的完整设计系统 token，
 * 包含 11 语义色 + 5 阶 spacing/radius/fontSize/shadow/blur/duration/breakpoint
 * + fontWeight/easing/lineHeight/letterSpacing/opacity/aspectRatio/zIndex。
 *
 * **存在原因**：core 公开 API 已剥离这些 token（移到 ui-vue 的 `ZuiSchema`）；但
 * core 自身测试需要一个"含丰富 token"的 fixture 来验证 chain proxy / token 命中 /
 * variants 等机制。复用旧 light.ts 的字面量即可。
 *
 * 不在公开 API：仅 `tests/*` 下的 spec 文件 import。
 */
import { Theme, FLAT_PALETTE, tw } from '../src'
import type { BaseSchema } from '../src'

/** 含 semantic + 5 阶 + 命名 scale 的完整 schema —— 仅测试用。 */
export interface TestSchema extends BaseSchema {
  color: BaseSchema['color'] & {
    primary: string
    primaryHover: string
    danger: string
    warning: string
    success: string
    info: string
    text: string
    textMuted: string
    bg: string
    bgMuted: string
    border: string
  }
  spacing: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  radius: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
    full: string
  }
  fontSize: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  fontWeight: {
    thin: number
    extralight: number
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
    extrabold: number
    black: number
  }
  shadow: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  blur: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  duration: {
    none: string
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  easing: {
    default: string
    linear: string
    in: string
    out: string
    inOut: string
  }
  breakpoint: {
    tiny: string
    small: string
    middle: string
    large: string
    huge: string
  }
  zIndex: {
    auto: string | number
    none: number
    tiny: number
    small: number
    middle: number
    large: number
    huge: number
    modal: number
    popover: number
    tooltip: number
    toast: number
  }
  opacity: {
    none: number
    faint: number
    dim: number
    half: number
    strong: number
    solid: number
    full: number
  }
  lineHeight: {
    none: number
    tight: number
    snug: number
    normal: number
    relaxed: number
    loose: number
  }
  letterSpacing: {
    tighter: string
    tight: string
    normal: string
    wide: string
    wider: string
  }
  aspectRatio: {
    square: string
    video: string
    portrait: string
    landscape: string
  }
}

/** 测试 fixture —— 浅色，含完整设计系统 token。等价旧 `defaultLight`。 */
export const defaultLight = new Theme<TestSchema>({
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
  spacing: { tiny: '4px', small: '8px', middle: '16px', large: '24px', huge: '32px' },
  radius: {
    none: '0',
    tiny: '4px',
    small: '8px',
    middle: '12px',
    large: '16px',
    huge: '24px',
    full: '9999px',
  },
  fontSize: { tiny: '12px', small: '14px', middle: '16px', large: '18px', huge: '20px' },
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
    tiny: '4px',
    small: '8px',
    middle: '16px',
    large: '24px',
    huge: '40px',
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

/** 测试 fixture —— 深色（语义色 alias 不同 shade）。等价旧 `defaultDark`。 */
export const defaultDark = new Theme<TestSchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '500'),
    primaryHover: tw('blue', '600'),
    danger: tw('red', '500'),
    warning: tw('yellow', '500'),
    success: tw('green', '500'),
    info: tw('cyan', '500'),
    text: tw('gray', '100'),
    textMuted: tw('gray', '400'),
    bg: tw('gray', '900'),
    bgMuted: tw('gray', '800'),
    border: tw('gray', '600'),
  },
  spacing: defaultLight.schema.spacing,
  radius: defaultLight.schema.radius,
  fontSize: defaultLight.schema.fontSize,
  fontWeight: defaultLight.schema.fontWeight,
  shadow: defaultLight.schema.shadow,
  blur: defaultLight.schema.blur,
  duration: defaultLight.schema.duration,
  easing: defaultLight.schema.easing,
  breakpoint: defaultLight.schema.breakpoint,
  zIndex: defaultLight.schema.zIndex,
  opacity: defaultLight.schema.opacity,
  lineHeight: defaultLight.schema.lineHeight,
  letterSpacing: defaultLight.schema.letterSpacing,
  aspectRatio: defaultLight.schema.aspectRatio,
})
