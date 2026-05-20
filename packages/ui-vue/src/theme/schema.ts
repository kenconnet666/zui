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

/**
 * zui-vue 设计系统 schema —— **业务侧消费的标准 schema**。
 *
 * extends `BaseSchema` 拿到 palette；自身补全 semantic 色 + 所有命名 scale。
 */
export interface ZuiSchema extends BaseSchema {
  color: BaseSchema['color'] & Record<SemanticColorTokens, string>
  /** spacing 5 阶（4/8/16/24/32 px）。 */
  spacing: Record<Size5Keys, string>
  /** radius 7 阶（none + 5 阶 + full）。 */
  radius: Record<RadiusKeys, string>
  /** fontSize 5 阶（12/14/16/18/20 px）。 */
  fontSize: Record<Size5Keys, string>
  /** fontWeight 9 阶（CSS 标准 thin..black，100..900）。 */
  fontWeight: Record<FontWeightKeys, number>
  /** shadow 5 阶（不含 none，去阴影用 `boxShadow('none')`）。 */
  shadow: Record<Size5Keys, string>
  /** blur 6 阶（none + 5 阶 size）。 */
  blur: Record<Size6KeysWithNone, string>
  /** duration 6 阶（none + 5 阶；ms 单位）。 */
  duration: Record<Size6KeysWithNone, string>
  /** easing 5 个 timing function（cubic-bezier）。 */
  easing: Record<EasingKeys, string>
  /** 响应式断点 5 阶（`_media('_middle', ...)` 等链上简写依赖）。 */
  breakpoint: Record<Size5Keys, string>
  /** z-index：5 阶 + UI 角色（modal/popover/tooltip/toast）+ auto。 */
  zIndex: Record<ZIndexKeys, string | number>
  /** opacity 7 阶（none + 5 阶领域词 + full）。 */
  opacity: Record<OpacityKeys, number>
  /** lineHeight 6 阶（none + 5 阶 tight..loose）。 */
  lineHeight: Record<LineHeightKeys, number>
  /** letterSpacing 5 阶（tighter..wider）。 */
  letterSpacing: Record<LetterSpacingKeys, string>
  /** aspectRatio 4 个常用比例。 */
  aspectRatio: Record<AspectRatioKeys, string>
}
