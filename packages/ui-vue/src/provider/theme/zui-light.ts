import { Theme, FLAT_PALETTE, tw, iem } from '@kenconnet666/zui-core'
import type { ZuiSchema } from './schema'

/**
 * zui 默认浅色主题 —— Tailwind palette 242 色 + 11 个语义色 alias 到具体 shade +
 * 完整 5 阶 size scale + 9 阶 fontWeight + 5 个 easing + 5 阶 breakpoint + UI 角色 z-index +
 * Tailwind 衍生 lineHeight/letterSpacing/opacity/aspectRatio。
 *
 * **尺寸类 token（spacing / radius / fontSize / blur）走 zui 逻辑单位 `iem`**:
 * 每个值 emit `calc(N * var(--zui-iem, 16px))`,**默认 1iem = 16px**(等同 1rem);
 * `<ZBox :iem="ZIemPreset.large">` 整站放大 25%(1iem=20px)、
 * `:iem="ZIemPreset.rem"` 跟随浏览器根字号(a11y),
 * **嵌套 Provider 通过 css cascade 自然覆盖,兄弟 Provider 各自独立**。详见 skill §13.0 ②。
 *
 * iem = "我自己使用的 em",跟 CSS `rem`(root em)对称 —— rem 由浏览器掌控,iem 由 Provider 掌控。
 *
 * **token 数字语义**:N 表示"几个基准字号"。
 * - `spacing.middle = iem(1)` → 默认 16px,Provider 20px 模式下 = 20px
 * - `fontSize.large = iem(1.125)` → 默认 18px(16×1.125),Provider 20px 模式下 = 22.5px
 *
 * **不走 iem 的几类**(设计哲学):
 * - `breakpoint` —— 媒体查询基准,跟"屏幕宽度"绑定,不该跟 iem 缩放
 * - `shadow` —— 装饰性效果,保留 px 字面量与设计稿绑定
 * - `radius.full = '9999px'` —— "无穷大圆角"语义
 * - `blur.none = '0'` —— 0 长度无需 calc
 * - `letterSpacing` —— em 单位,跟字体本身缩放(iem 体系无关)
 * - `duration` / `easing` / `zIndex` / `opacity` / `lineHeight` / `aspectRatio` / `fontWeight` —— 非长度
 *
 * 业务侧顶层主题入口;用户工程通过 `<ZBox :theme="zuiLight">` 注入。
 */
export const zuiLight = new Theme<ZuiSchema>({
  color: {
    ...FLAT_PALETTE,
    primary: tw('blue', '600'),
    danger: tw('red', '600'),
    warning: tw('yellow', '500'),
    success: tw('green', '500'),
    info: tw('cyan', '500'),
    text: tw('gray', '900'),
    textSecondary: tw('gray', '600'),
    bg: '#ffffff',
    bgMuted: tw('gray', '50'),
    border: tw('gray', '200'),
  },
  // 5 阶 spacing:默认 4/8/16/24/32px(0.25/0.5/1/1.5/2 个基准字号)
  spacing: {
    tiny: iem(0.25),
    small: iem(0.5),
    middle: iem(1),
    large: iem(1.5),
    huge: iem(2),
  },
  // radius:默认 4/8/12/16/24px(0.25/0.5/0.75/1/1.5 个基准字号);full 是语义"无穷"
  radius: {
    none: '0',
    tiny: iem(0.25),
    small: iem(0.5),
    middle: iem(0.75),
    large: iem(1),
    huge: iem(1.5),
    full: '9999px',
  },
  // fontSize:默认 12/14/16/18/20px(0.75/0.875/1/1.125/1.25 个基准字号)
  fontSize: {
    tiny: iem(0.75),
    small: iem(0.875),
    middle: iem(1),
    large: iem(1.125),
    huge: iem(1.25),
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
  // blur:默认 4/8/16/24/40px(0.25/0.5/1/1.5/2.5 个基准字号)
  blur: {
    none: '0',
    tiny: iem(0.25),
    small: iem(0.5),
    middle: iem(1),
    large: iem(1.5),
    huge: iem(2.5),
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
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  /**
   * 通用尺寸 token —— 用于 `width / height / minW / minH / maxW / maxH / flexBasis`。
   *
   * 5 阶 `tiny..huge` 走 iem(跟 Provider 字号联动),物理默认值:
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
    tiny: iem(4),
    small: iem(8),
    middle: iem(16),
    large: iem(32),
    huge: iem(48),
    container: iem(75),
    readable: '65ch',
    full: '100%',
    screen: '100vw',
    screenH: '100vh',
  },
  /**
   * 边框 / outline 粗细 token —— **px 字面量,不走 iem**(跟 shadow 同策略)。
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
