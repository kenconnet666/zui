import { Theme, FLAT_PALETTE } from '@kenconnet666/zui-core'
import type { ZuiSchema } from './schema'

/**
 * zui 默认浅色主题 —— Tailwind palette 242 色 + 11 个语义色 alias 到具体 shade +
 * 完整 5 阶 size scale + 9 阶 fontWeight + 5 个 easing + 5 阶 breakpoint + UI 角色 z-index +
 * Tailwind 衍生 lineHeight/letterSpacing/opacity/aspectRatio。
 *
 * **尺寸类 token（spacing / radius / fontSize / blur / sizes）= px 字面量**(0.9.x 已移除自创 iem 逻辑单位,现统一纯 px):
 * - `spacing` 4/8/16/24/32px,`radius` 4/8/12/16/28px,`fontSize` 12/14/16/18/20px
 * - `blur` 4/8/16/24/40px,`sizes` 64/128/256/512/768/1200px
 *
 * 需要整站等比缩放走原生 `rem`（改根字号）/ `vw`,不再由 Provider 注入逻辑单位。
 *
 * **特殊值**:`radius.full = '9999px'`（"无穷大圆角"）、各类 `none = '0'`、
 * `letterSpacing` 用 em（跟字体缩放）、`duration/easing/zIndex/opacity/lineHeight/aspectRatio/fontWeight` 非长度。
 *
 * 业务侧顶层主题入口;用户工程通过 `<ZBox :theme="zuiLight">` 注入。
 */
export const zuiLight = new Theme<ZuiSchema>({
  /**
   * **Material Design 经典配色**(Stage 4 / 2026-05-23 升级):
   * - primary / danger / warning / success / info 走 Material 2 经典 700 / Orange 700 shade,
   *   跟 M3 主题更搭(对比度高、不刺眼)
   * - text / textSecondary 用 grey-900 / grey-700(M3 推荐 typography 色)
   * - focusRing 同 primary,使用处叠 `.alpha(40)` 派生半透明 focus 环
   * - overlayBg `#000`,使用处叠 `.alpha(50)` 派生 Modal 遮罩
   */
  color: {
    ...FLAT_PALETTE,
    primary: '#1976d2', // Material Blue 700
    danger: '#d32f2f', // M2 Red 700
    warning: '#ed6c02', // M2 Orange 700
    success: '#2e7d32', // M2 Green 700
    info: '#0288d1', // M2 Light Blue 700
    text: '#212121', // M2 grey-900
    textSecondary: '#616161', // M2 grey-700
    textTertiary: '#9e9e9e', // M2 grey-500 —— 三级文本(占位符 / 时间戳 / 弱提示 / 禁用文字)
    bg: '#ffffff',
    bgMuted: '#f5f5f5', // M2 grey-100
    border: '#e0e0e0', // M2 grey-300
    focusRing: '#1976d2', // 同 primary;实际使用走 .alpha(40)
    overlayBg: '#000000', // 实际使用走 .alpha(50) → rgba(0,0,0,0.5)
  },
  // 5 阶 spacing:4/8/16/24/32px
  spacing: {
    tiny: '4px',
    small: '8px',
    middle: '16px',
    large: '24px',
    huge: '32px',
  },
  // radius:4/8/12/16/28px;full 是语义"无穷"
  // huge=28px 对齐 M3 FAB / Dialog 推荐圆角
  radius: {
    none: '0',
    tiny: '4px',
    small: '8px',
    middle: '12px',
    large: '16px',
    huge: '28px',
    full: '9999px',
  },
  // fontSize:12/14/16/18/20px
  fontSize: {
    tiny: '12px',
    small: '14px',
    middle: '16px',
    large: '18px',
    huge: '20px',
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
  /**
   * **M3 Elevation 双层阴影**(Stage 4 / 2026-05-23):
   * Material Design 3 elevation 模型用两层阴影叠加 ── key light(主光源,锐利)+
   * ambient light(环境光,扩散),5 阶对应 M3 level 1-5。视觉上层次更清晰、更"真实"。
   *
   * level 数字越大 = 越突出(huge = M3 level 5,Dialog / 顶层浮层)。
   */
  shadow: {
    tiny: '0px 1px 2px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)', // M3 level 1
    small: '0px 1px 2px rgba(0,0,0,0.30), 0px 2px 6px 2px rgba(0,0,0,0.15)', // level 2
    middle: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.30)', // level 3
    large: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.30)', // level 4
    huge: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.30)', // level 5
  },
  // blur:4/8/16/24/40px
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
  /**
   * 字体家族 3 件套 —— 跨平台兜底栈,业务侧覆盖品牌字体走 `zuiLight.extend({ fonts: {...} })`
   * 或 `<ZBox :theme-patch="{ fonts: {...} }">`。`s.fontFamily._mono` 查这里的 `mono`。
   */
  fonts: {
    sans: '"PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  /**
   * 通用尺寸 token —— 用于 `width / height / minW / minH / maxW / maxH / flexBasis`。
   *
   * 5 阶 `tiny..huge` 为固定 px 字面量(不再随 Provider 字号联动),物理默认值:
   * - tiny:64px(小图标按钮 / 短输入框)
   * - small:128px(chip / 紧凑卡片)
   * - middle:256px(sidebar 经典宽度 / 弹窗小)
   * - large:512px(弹窗中)
   * - huge:768px(弹窗大 / form 限宽)
   *
   * 4 个语义化 key 走字面量:
   * - container:1200px(page 主区限宽)
   * - readable:`'65ch'`(文本阅读最佳宽度,跟字号自适应)
   * - full / screen / screenH:百分比 / 视口
   */
  sizes: {
    tiny: '64px',
    small: '128px',
    middle: '256px',
    large: '512px',
    huge: '768px',
    container: '1200px',
    readable: '65ch',
    full: '100%',
    screen: '100vw',
    screenH: '100vh',
  },
  /**
   * 边框 / outline 粗细 token —— **px 字面量**(与 shadow 同策略,1px/2px 视觉细节不走逻辑单位)。
   *
   * - none:0(去边框)
   * - thin:1px(默认 / 卡片 / 输入框)
   * - middle:2px(focus ring / 强调边界)
   * - thick:3px(突出卡片 / divider 强调)
   * - heavy:4px(标题装饰 / 错误态)
   */
  borders: {
    none: '0',
    thin: '1px',
    middle: '2px',
    thick: '3px',
    heavy: '4px',
  },
  /**
   * 过渡属性预设 —— 逗号分隔的 CSS 属性列表,emit 后直接挂 `transition-property`。
   *
   * 跟 `duration` + `easing` 配套使用:
   * ```ts
   * s.transitionProperty._colors
   * s.transitionDuration._middle  // 300ms
   * s.transitionTimingFunction._inOut
   * ```
   */
  transitionProperty: {
    none: 'none',
    all: 'all',
    colors:
      'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    opacity: 'opacity',
    transform: 'transform',
    shadow: 'box-shadow',
    sizes: 'width, height, max-width, max-height',
    default:
      'color, background-color, border-color, outline-color, fill, stroke, opacity, box-shadow, transform',
  },
})
