/**
 * `ZuiSchema` —— zui-vue 设计系统层 schema。
 *
 * 在 `BaseSchema`（来自 core，仅 palette）之上叠加：
 * - **11 个语义色** —— `primary / primaryHover / danger / warning / success / info /
 *   text / textMuted / bg / bgMuted / border`
 * - **5 阶 size scales** —— spacing / radius / fontSize / shadow / blur / duration / breakpoint
 * - **fontWeight 9 档** —— CSS 标准 thin..black
 * - **easing 5 个 cubic-bezier** —— Material-flavor
 * - **lineHeight / letterSpacing / opacity / aspectRatio** —— Tailwind 衍生命名 scale
 * - **zIndex** —— 5 阶 + UI 角色 modal/popover/tooltip/toast
 *
 * **设计要点**：所有字段使用 `Record<KeyUnion, V>` 形式而非对象字面量
 * （`{ tiny: string; ... }`），让字段满足 `ThemeSchema` 的 index signature 约束
 * `[customCategory: string]: Record<string, ThemeValue> | undefined`。Record 形式
 * 既保留 IDE 对具体 key 的补全，又满足上层约束。
 *
 * 用户工程要扩自家 brand：`interface MySchema extends ZuiSchema { ... }` 然后基于
 * `zuiLight.schema` 构造 `Theme<MySchema>`。
 */
import type { BaseSchema } from '@kenconnet666/zui-core'

// ════════════════════════════════════════════════════════════════════════
// 用户扩展锚点 —— 每个 category 一个空 interface，用户通过 module augmentation
// 增加自己的 token 字段，自动 intersect 到对应的 ZuiSchema category 上。
//
// 用户工程示例：
//   declare module '@kenconnet666/zui-vue' {
//     interface UserColorExt {
//       brandRoyal: string
//       brandSunset: string
//     }
//     interface UserSpacingExt {
//       extra: string
//     }
//   }
//
// augmentation 后：
//   - ZuiSchema.color 自动包含 `brandRoyal | brandSunset` 等字段
//   - Chain<ZuiSchema> 的 token 集合自动多出 `_brandRoyal | _brandSunset`
//   - `<ZIcon :css-root="(s) => { s.color._brandRoyal }" />` 隐式推导生效，无需手写
//     `interface MySchema extends ZuiSchema { ... }` 与 `new Theme<MySchema>(...)`
//
// 配合 `zuiLight.extend({ color: { brandRoyal: '#1a3a8f' } })` 在运行时喂入值。
// ════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserColorExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserSpacingExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserRadiusExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserFontSizeExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserFontWeightExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserShadowExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserBlurExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserDurationExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserEasingExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserBreakpointExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserZIndexExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserOpacityExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserLineHeightExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserLetterSpacingExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserAspectRatioExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserFontsExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserSizesExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserBordersExt {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserTransitionPropertyExt {}

/** 11 个语义色 token —— light / dark 取同 key 不同 shade。 */
export type SemanticColorTokens =
  | 'primary'
  | 'primaryHover'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'text'
  | 'textMuted'
  | 'bg'
  | 'bgMuted'
  | 'border'

/** 5 阶 size scale key（spacing/fontSize/shadow/blur/breakpoint 共享）。 */
export type Size5Keys = 'tiny' | 'small' | 'middle' | 'large' | 'huge'
/** 6 阶 size + none（duration/blur 用）。 */
export type Size6KeysWithNone = 'none' | Size5Keys
/** 7 阶 radius key（5 阶 + none + full）。 */
export type RadiusKeys = 'none' | Size5Keys | 'full'
/** 9 阶 fontWeight CSS 标准命名。 */
export type FontWeightKeys =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'
/** 5 个 easing timing function。 */
export type EasingKeys = 'default' | 'linear' | 'in' | 'out' | 'inOut'
/** z-index 全键集合：5 阶 + auto + 4 UI 角色。 */
export type ZIndexKeys =
  | 'auto'
  | Size6KeysWithNone
  | 'modal'
  | 'popover'
  | 'tooltip'
  | 'toast'
/** opacity 7 阶（none + 5 阶领域词 + full）。 */
export type OpacityKeys = 'none' | 'faint' | 'dim' | 'half' | 'strong' | 'solid' | 'full'
/** lineHeight 6 阶（none + 5 阶 tight..loose）。 */
export type LineHeightKeys = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
/** letterSpacing 5 阶。 */
export type LetterSpacingKeys = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider'
/** aspectRatio 4 个常用比例。 */
export type AspectRatioKeys = 'square' | 'video' | 'portrait' | 'landscape'
/** 字体家族 3 件套(对应 CSS `font-family` 经典分类)。 */
export type FontsKeys = 'sans' | 'serif' | 'mono'
/**
 * 通用 size token —— 用于 `width / height / minWidth / minHeight / maxWidth / maxHeight /
 * flexBasis` 这类「元素自身尺寸」carrier。**和 `spacing` 不同**(后者是 padding/margin/gap)。
 *
 * - 5 阶 `tiny/small/middle/large/huge` —— iem 化的递进尺寸(组件 / 卡片 / 弹窗框)
 * - 4 个语义化 key —— `container`(页面主区)/ `readable`(文本阅读宽度,`'65ch'`)/
 *   `full`(`'100%'`)/ `screen`(`'100vw'`)/ `screenH`(`'100vh'`)
 */
export type SizesKeys =
  | Size5Keys
  | 'container'
  | 'readable'
  | 'full'
  | 'screen'
  | 'screenH'
/**
 * 边框/outline 粗细 token —— 用于 `borderWidth / outlineWidth` 及各 sub(top/right/bottom/left)。
 *
 * **保留 px 字面量,不走 iem**(同 shadow):
 * - 边框粗细跟字号无关,1px / 2px 这种"视觉细节"用 iem 反而失真(0.0625iem 用户不会想)
 * - 跟设计稿 1:1 对齐
 */
export type BordersKeys = 'none' | 'thin' | 'middle' | 'thick' | 'heavy'
/**
 * 过渡属性预设 token —— 用于 `transitionProperty`。值是逗号分隔的 CSS 属性列表。
 *
 * 灵感来自 Tailwind 的 `transition-{colors|opacity|transform|shadow|all}`。
 */
export type TransitionPropertyKeys =
  | 'none'
  | 'all'
  | 'colors'
  | 'opacity'
  | 'transform'
  | 'shadow'
  | 'sizes'
  | 'default'

/**
 * zui-vue 设计系统 schema —— **业务侧消费的标准 schema**。
 *
 * extends `BaseSchema` 拿到 palette；自身补全 semantic 色 + 所有命名 scale。
 */
export interface ZuiSchema extends BaseSchema {
  color: BaseSchema['color'] & Record<SemanticColorTokens, string> & Partial<UserColorExt>
  /** spacing 5 阶（4/8/16/24/32 px） + 用户扩展。 */
  spacing: Record<Size5Keys, string> & Partial<UserSpacingExt>
  /** radius 7 阶（none + 5 阶 + full） + 用户扩展。 */
  radius: Record<RadiusKeys, string> & Partial<UserRadiusExt>
  /** fontSize 5 阶（12/14/16/18/20 px） + 用户扩展。 */
  fontSize: Record<Size5Keys, string> & Partial<UserFontSizeExt>
  /** fontWeight 9 阶（CSS 标准 thin..black，100..900） + 用户扩展。 */
  fontWeight: Record<FontWeightKeys, number> & Partial<UserFontWeightExt>
  /** shadow 5 阶（不含 none，去阴影用 `boxShadow('none')`） + 用户扩展。 */
  shadow: Record<Size5Keys, string> & Partial<UserShadowExt>
  /** blur 6 阶（none + 5 阶 size） + 用户扩展。 */
  blur: Record<Size6KeysWithNone, string> & Partial<UserBlurExt>
  /** duration 6 阶（none + 5 阶；ms 单位） + 用户扩展。 */
  duration: Record<Size6KeysWithNone, string> & Partial<UserDurationExt>
  /** easing 5 个 timing function（cubic-bezier） + 用户扩展。 */
  easing: Record<EasingKeys, string> & Partial<UserEasingExt>
  /** 响应式断点 5 阶 + 用户扩展（`_media('_xxx', ...)` 链上简写依赖）。 */
  breakpoint: Record<Size5Keys, string> & Partial<UserBreakpointExt>
  /** z-index：5 阶 + UI 角色（modal/popover/tooltip/toast）+ auto + 用户扩展。 */
  zIndex: Record<ZIndexKeys, string | number> & Partial<UserZIndexExt>
  /** opacity 7 阶（none + 5 阶领域词 + full） + 用户扩展。 */
  opacity: Record<OpacityKeys, number> & Partial<UserOpacityExt>
  /** lineHeight 6 阶（none + 5 阶 tight..loose） + 用户扩展。 */
  lineHeight: Record<LineHeightKeys, number> & Partial<UserLineHeightExt>
  /** letterSpacing 5 阶（tighter..wider） + 用户扩展。 */
  letterSpacing: Record<LetterSpacingKeys, string> & Partial<UserLetterSpacingExt>
  /** aspectRatio 4 个常用比例 + 用户扩展。 */
  aspectRatio: Record<AspectRatioKeys, string> & Partial<UserAspectRatioExt>
  /**
   * 字体家族 3 件套 + 用户扩展。**对应 chain `fontFamily` carrier 的 token lookup**
   * (`tokenCat: 'fonts'`),用户写 `s.fontFamily._mono` 查 `schema.fonts.mono`。
   *
   * **默认值跨平台兜底**:
   * - `sans`:`system-ui` 优先,fallback 到各平台系统 UI 字体
   * - `serif`:`ui-serif` 优先,fallback Georgia/Times
   * - `mono`:`ui-monospace` 优先,fallback SFMono/Menlo/Consolas
   *
   * 业务侧覆盖品牌字体:`zuiLight.extend({ fonts: { sans: 'Inter, ...' } })`,
   * 或局部 Provider:`<ZBox :theme-patch="{ fonts: { sans: 'Inter, sans-serif' } }">`。
   */
  fonts: Record<FontsKeys, string> & Partial<UserFontsExt>
  /**
   * 通用尺寸 token —— **对应 chain carrier `width / height / minWidth / minHeight /
   * maxWidth / maxHeight / flexBasis` 的 `tokenCat: 'sizes'`**。写 `s.width._container`
   * / `s.maxWidth._readable` / `s.height._screenH`,IDE 自动补全本表的 key。
   *
   * **跟 `spacing` 区别**:spacing 是「内距/外距/gap」(padding/margin/gap),sizes 是
   * 「元素自身的宽高」。两者数字范围差别大,不复用。
   *
   * 5 阶 `tiny..huge` 走 iem(跟 Provider 联动),语义化 4 个 key 走字面量。
   */
  sizes: Record<SizesKeys, string> & Partial<UserSizesExt>
  /**
   * 边框 / outline 粗细 token —— **对应 chain carrier `borderWidth / outlineWidth /
   * borderTopWidth / borderRightWidth / borderBottomWidth / borderLeftWidth` 的
   * `tokenCat: 'borders'`**。写 `s.borderWidth._thin` / `s.outlineWidth._middle`。
   *
   * **保留 px 字面量,不走 iem**:1px/2px 这种"视觉细节"跟字号无关,跟设计稿对齐更稳。
   */
  borders: Record<BordersKeys, string> & Partial<UserBordersExt>
  /**
   * 过渡属性预设 —— **对应 chain carrier `transitionProperty` 的
   * `tokenCat: 'transitionProperty'`**。写 `s.transitionProperty._colors` /
   * `s.transitionProperty._default`,emit 出逗号分隔的 CSS 属性列表。
   *
   * 灵感来自 Tailwind 的 `transition-{colors|opacity|transform|shadow|all}`。
   */
  transitionProperty: Record<TransitionPropertyKeys, string> & Partial<UserTransitionPropertyExt>
}
