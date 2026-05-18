// 此文件由 scripts/generate-properties.mjs 自动生成，请勿手动编辑。
// 来源：csstype Properties + src/chain/enhanced-props.ts (ENHANCED_PROPS)。
// 修改方式：改 ENHANCED_PROPS 或升级 csstype，然后 `node scripts/generate-properties.mjs`。

import type * as csstype from 'csstype'
import type { ThemeSchema } from '../theme/types'
import type {
  ColorPropCarrier,
  GlobalKw,
  PropCarrier,
  PropFn,
  LengthUnits,
  TimeUnits,
} from './carrier'
import type {
  AspectRatioTokens,
  BordersTokens,
  ColorTokens,
  CursorTokens,
  DurationTokens,
  EasingTokens,
  FontSizeTokens,
  FontWeightTokens,
  FontsTokens,
  LetterSpacingTokens,
  LineHeightTokens,
  OpacityTokens,
  RadiusTokens,
  ShadowTokens,
  SizeTokens,
  SpacingTokens,
  TransitionPropertyTokens,
  ZIndexTokens,
} from './tokens'

/** 取某个 CSS 属性的 csstype 值类型（剥掉 undefined）。 */
type CssValueOf<K extends keyof csstype.Properties> = NonNullable<csstype.Properties[K]>

/**
 * 自动生成：所有 csstype 已知 CSS 属性在 Chain 上的方法签名。
 *
 * - ENHANCED_PROPS 中的属性 → `PropCarrier` / `ColorPropCarrier`（四态）
 * - 其余属性 → `PropFn`（函数态 + 全局关键字）
 *
 * 通过 `interface Chain<T> extends IcxPropMethods<Chain<T>, T> {}` 注入到 Chain 实例类型。
 */
export interface IcxPropMethods<TSelf, T extends ThemeSchema> {
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | <color>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **93** | **92**  | **15.4** | **93** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/accent-color
     */
  accentColor: ColorPropCarrier<TSelf, CssValueOf<'accentColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **28**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-content
     */
  alignContent: PropFn<TSelf, CssValueOf<'alignContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ] | anchor-center`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **20**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-items
     */
  alignItems: PropFn<TSelf, CssValueOf<'alignItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position> | anchor-center`
     *
     * **Initial value**: `auto`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **20**  |  **9**  | **12** | **10** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/align-self
     */
  alignSelf: PropFn<TSelf, CssValueOf<'alignSelf'>>
  /**
     * **Syntax**: `[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]#`
     *
     * **Initial value**: `normal`
     */
  alignTracks: PropFn<TSelf, CssValueOf<'alignTracks'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `baseline | alphabetic | ideographic | middle | central | mathematical | text-before-edge | text-after-edge`
     *
     * **Initial value**: `baseline`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **1**  |   No    | **5.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/alignment-baseline
     */
  alignmentBaseline: PropFn<TSelf, CssValueOf<'alignmentBaseline'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <dashed-ident>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/anchor-name
     */
  anchorName: PropFn<TSelf, CssValueOf<'anchorName'>>
  /**
     * **Syntax**: `none | all | <dashed-ident>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **131** | **preview** | **26** | **131** | No  |
     */
  anchorScope: PropFn<TSelf, CssValueOf<'anchorScope'>>
  /**
     * Since July 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<single-animation-composition>#`
     *
     * **Initial value**: `replace`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **112** | **115** | **16** | **112** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-composition
     */
  animationComposition: PropFn<TSelf, CssValueOf<'animationComposition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-delay
     */
  animationDelay: PropFn<TSelf, CssValueOf<'animationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-direction
     */
  animationDirection: PropFn<TSelf, CssValueOf<'animationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-duration
     */
  animationDuration: PropCarrier<TSelf, CssValueOf<'animationDuration'>, DurationTokens<T>, GlobalKw, TimeUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 5 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-fill-mode
     */
  animationFillMode: PropFn<TSelf, CssValueOf<'animationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-iteration-count
     */
  animationIterationCount: PropFn<TSelf, CssValueOf<'animationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-name
     */
  animationName: PropFn<TSelf, CssValueOf<'animationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-play-state
     */
  animationPlayState: PropFn<TSelf, CssValueOf<'animationPlayState'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range-end
     */
  animationRangeEnd: PropFn<TSelf, CssValueOf<'animationRangeEnd'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ normal | <length-percentage> | <timeline-range-name> <length-percentage>? ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range-start
     */
  animationRangeStart: PropFn<TSelf, CssValueOf<'animationRangeStart'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<single-animation-timeline>#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-timeline
     */
  animationTimeline: PropFn<TSelf, CssValueOf<'animationTimeline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-timing-function
     */
  animationTimingFunction: PropFn<TSelf, CssValueOf<'animationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | auto | <compat-auto> | <compat-special>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
     * | :-----: | :-----: | :------: | :------: | :-: |
     * | **84**  | **80**  | **15.4** |  **84**  | No  |
     * | 1 _-x-_ | 1 _-x-_ | 3 _-x-_  | 12 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/appearance
     */
  appearance: PropFn<TSelf, CssValueOf<'appearance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto || <ratio>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **88** | **89**  | **15** | **88** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/aspect-ratio
     */
  aspectRatio: PropCarrier<TSelf, CssValueOf<'aspectRatio'>, AspectRatioTokens<T>, 'auto' | GlobalKw>
  /**
     * Since September 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **76** | **103** | **18**  | **79** | No  |
     * |        |         | 9 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backdrop-filter
     */
  backdropFilter: PropFn<TSelf, CssValueOf<'backdropFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     *
     * |  Chrome  | Firefox  |  Safari   |  Edge  |   IE   |
     * | :------: | :------: | :-------: | :----: | :----: |
     * |  **36**  |  **16**  | **15.4**  | **12** | **10** |
     * | 12 _-x-_ | 10 _-x-_ | 5.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/backface-visibility
     */
  backfaceVisibility: PropFn<TSelf, CssValueOf<'backfaceVisibility'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<attachment>#`
     *
     * **Initial value**: `scroll`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-attachment
     */
  backgroundAttachment: PropFn<TSelf, CssValueOf<'backgroundAttachment'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<blend-mode>#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **35** | **30**  | **8**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-blend-mode
     */
  backgroundBlendMode: PropFn<TSelf, CssValueOf<'backgroundBlendMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-clip>#`
     *
     * **Initial value**: `border-box`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **4**  |  **5**  | **12** | **9** |
     * |        |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-clip
     */
  backgroundClip: PropFn<TSelf, CssValueOf<'backgroundClip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `transparent`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-color
     */
  backgroundColor: ColorPropCarrier<TSelf, CssValueOf<'backgroundColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-image>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-image
     */
  backgroundImage: PropFn<TSelf, CssValueOf<'backgroundImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **4**  | **3**  | **12** | **9** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-origin
     */
  backgroundOrigin: PropFn<TSelf, CssValueOf<'backgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#`
     *
     * **Initial value**: `0%`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **49**  | **1**  | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position-x
     */
  backgroundPositionX: PropFn<TSelf, CssValueOf<'backgroundPositionX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#`
     *
     * **Initial value**: `0%`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **49**  | **1**  | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position-y
     */
  backgroundPositionY: PropFn<TSelf, CssValueOf<'backgroundPositionY'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<repeat-style>#`
     *
     * **Initial value**: `repeat`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-repeat
     */
  backgroundRepeat: PropFn<TSelf, CssValueOf<'backgroundRepeat'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **3**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-size
     */
  backgroundSize: PropFn<TSelf, CssValueOf<'backgroundSize'>>
  /**
     * **Syntax**: `<length-percentage> | sub | super | baseline`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |   No    | **4**  | **79** | No  |
     */
  baselineShift: PropFn<TSelf, CssValueOf<'baselineShift'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     *
     * |            Chrome            | Firefox |             Safari             |  Edge  | IE  |
     * | :--------------------------: | :-----: | :----------------------------: | :----: | :-: |
     * |            **57**            | **41**  |            **12.1**            | **79** | No  |
     * | 8 _(-webkit-logical-height)_ |         | 5.1 _(-webkit-logical-height)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/block-size
     */
  blockSize: PropFn<TSelf, CssValueOf<'blockSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-color
     */
  borderBlockEndColor: PropFn<TSelf, CssValueOf<'borderBlockEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-style
     */
  borderBlockEndStyle: PropFn<TSelf, CssValueOf<'borderBlockEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end-width
     */
  borderBlockEndWidth: PropFn<TSelf, CssValueOf<'borderBlockEndWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-color
     */
  borderBlockStartColor: PropFn<TSelf, CssValueOf<'borderBlockStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-style
     */
  borderBlockStartStyle: PropFn<TSelf, CssValueOf<'borderBlockStartStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start-width
     */
  borderBlockStartWidth: PropFn<TSelf, CssValueOf<'borderBlockStartWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-color
     */
  borderBottomColor: ColorPropCarrier<TSelf, CssValueOf<'borderBottomColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **4**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-left-radius
     */
  borderBottomLeftRadius: PropCarrier<TSelf, CssValueOf<'borderBottomLeftRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **4**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-right-radius
     */
  borderBottomRightRadius: PropCarrier<TSelf, CssValueOf<'borderBottomRightRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-style>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-style
     */
  borderBottomStyle: PropFn<TSelf, CssValueOf<'borderBottomStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom-width
     */
  borderBottomWidth: PropCarrier<TSelf, CssValueOf<'borderBottomWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `separate | collapse`
     *
     * **Initial value**: `separate`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **1**  | **1.1** | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-collapse
     */
  borderCollapse: PropFn<TSelf, CssValueOf<'borderCollapse'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-end-end-radius
     */
  borderEndEndRadius: PropFn<TSelf, CssValueOf<'borderEndEndRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-end-start-radius
     */
  borderEndStartRadius: PropFn<TSelf, CssValueOf<'borderEndStartRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <length [0,∞]> | <number [0,∞]> ]{1,4}  `
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-outset
     */
  borderImageOutset: PropFn<TSelf, CssValueOf<'borderImageOutset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2016.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-repeat
     */
  borderImageRepeat: PropFn<TSelf, CssValueOf<'borderImageRepeat'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <number [0,∞]> | <percentage [0,∞]> ]{1,4}  && fill?`
     *
     * **Initial value**: `100%`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-slice
     */
  borderImageSlice: PropFn<TSelf, CssValueOf<'borderImageSlice'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **15** | **15**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-source
     */
  borderImageSource: PropFn<TSelf, CssValueOf<'borderImageSource'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <length-percentage [0,∞]> | <number [0,∞]> | auto ]{1,4}`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **16** | **13**  | **6**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image-width
     */
  borderImageWidth: PropFn<TSelf, CssValueOf<'borderImageWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-color)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-color
     */
  borderInlineEndColor: PropFn<TSelf, CssValueOf<'borderInlineEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-style)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-style
     */
  borderInlineEndStyle: PropFn<TSelf, CssValueOf<'borderInlineEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome |           Firefox           |  Safari  |  Edge  | IE  |
     * | :----: | :-------------------------: | :------: | :----: | :-: |
     * | **69** |           **41**            | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-end-width)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end-width
     */
  borderInlineEndWidth: PropFn<TSelf, CssValueOf<'borderInlineEndWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome |            Firefox            |  Safari  |  Edge  | IE  |
     * | :----: | :---------------------------: | :------: | :----: | :-: |
     * | **69** |            **41**             | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-start-color)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-color
     */
  borderInlineStartColor: PropFn<TSelf, CssValueOf<'borderInlineStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome |            Firefox            |  Safari  |  Edge  | IE  |
     * | :----: | :---------------------------: | :------: | :----: | :-: |
     * | **69** |            **41**             | **12.1** | **79** | No  |
     * |        | 3 _(-moz-border-start-style)_ |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-style
     */
  borderInlineStartStyle: PropFn<TSelf, CssValueOf<'borderInlineStartStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start-width
     */
  borderInlineStartWidth: PropFn<TSelf, CssValueOf<'borderInlineStartWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-color
     */
  borderLeftColor: ColorPropCarrier<TSelf, CssValueOf<'borderLeftColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-style>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-style
     */
  borderLeftStyle: PropFn<TSelf, CssValueOf<'borderLeftStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left-width
     */
  borderLeftWidth: PropCarrier<TSelf, CssValueOf<'borderLeftWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-color
     */
  borderRightColor: ColorPropCarrier<TSelf, CssValueOf<'borderRightColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-style>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-style
     */
  borderRightStyle: PropFn<TSelf, CssValueOf<'borderRightStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right-width
     */
  borderRightWidth: PropCarrier<TSelf, CssValueOf<'borderRightWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length>{1,2}`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-spacing
     */
  borderSpacing: PropFn<TSelf, CssValueOf<'borderSpacing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-start-end-radius
     */
  borderStartEndRadius: PropFn<TSelf, CssValueOf<'borderStartEndRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<'border-top-left-radius'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **89** | **66**  | **15** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-start-start-radius
     */
  borderStartStartRadius: PropFn<TSelf, CssValueOf<'borderStartStartRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-color
     */
  borderTopColor: ColorPropCarrier<TSelf, CssValueOf<'borderTopColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **4**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-left-radius
     */
  borderTopLeftRadius: PropCarrier<TSelf, CssValueOf<'borderTopLeftRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **4**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-right-radius
     */
  borderTopRightRadius: PropCarrier<TSelf, CssValueOf<'borderTopRightRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-style>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-style
     */
  borderTopStyle: PropFn<TSelf, CssValueOf<'borderTopStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top-width
     */
  borderTopWidth: PropCarrier<TSelf, CssValueOf<'borderTopWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage> | <anchor()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/bottom
     */
  bottom: PropCarrier<TSelf, CssValueOf<'bottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `slice | clone`
     *
     * **Initial value**: `slice`
     *
     * |  Chrome  | Firefox |   Safari    |   Edge   | IE  |
     * | :------: | :-----: | :---------: | :------: | :-: |
     * | **130**  | **32**  | **7** _-x-_ | **130**  | No  |
     * | 22 _-x-_ |         |             | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-decoration-break
     */
  boxDecorationBreak: PropFn<TSelf, CssValueOf<'boxDecorationBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * | **10**  |  **4**  | **5.1** | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-shadow
     */
  boxShadow: PropCarrier<TSelf, CssValueOf<'boxShadow'>, ShadowTokens<T>, 'none' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `content-box | border-box`
     *
     * **Initial value**: `content-box`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * | **10**  | **29**  | **5.1** | **12** | **8** |
     * | 1 _-x-_ | 1 _-x-_ | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/box-sizing
     */
  boxSizing: PropFn<TSelf, CssValueOf<'boxSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2019.
     *
     * **Syntax**: `auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **50** | **65**  | **10** | **12** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-after
     */
  breakAfter: PropFn<TSelf, CssValueOf<'breakAfter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2019.
     *
     * **Syntax**: `auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **50** | **65**  | **10** | **12** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-before
     */
  breakBefore: PropFn<TSelf, CssValueOf<'breakBefore'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2019.
     *
     * **Syntax**: `auto | avoid | avoid-page | avoid-column | avoid-region`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **50** | **65**  | **10** | **12** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/break-inside
     */
  breakInside: PropFn<TSelf, CssValueOf<'breakInside'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `top | bottom`
     *
     * **Initial value**: `top`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caption-side
     */
  captionSide: PropFn<TSelf, CssValueOf<'captionSide'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | <color>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **53**  | **11.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caret-color
     */
  caretColor: ColorPropCarrier<TSelf, CssValueOf<'caretColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * **Syntax**: `auto | bar | block | underscore`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   |   No    |   No   |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/caret-shape
     */
  caretShape: PropFn<TSelf, CssValueOf<'caretShape'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | left | right | both | inline-start | inline-end`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clear
     */
  clear: PropFn<TSelf, CssValueOf<'clear'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<clip-source> | [ <basic-shape> || <geometry-box> ] | none`
     *
     * **Initial value**: `none`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **55**  | **3.5** | **9.1** | **79** | **10** |
     * | 23 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clip-path
     */
  clipPath: PropFn<TSelf, CssValueOf<'clipPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `nonzero | evenodd`
     *
     * **Initial value**: `nonzero`
     *
     * | Chrome  | Firefox | Safari |  Edge  | IE  |
     * | :-----: | :-----: | :----: | :----: | :-: |
     * | **≤15** | **3.5** | **≤5** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/clip-rule
     */
  clipRule: PropFn<TSelf, CssValueOf<'clipRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `canvastext`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color
     */
  color: ColorPropCarrier<TSelf, CssValueOf<'color'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     *
     * |  Chrome  |       Firefox       |  Safari  |   Edge   | IE  |
     * | :------: | :-----------------: | :------: | :------: | :-: |
     * | **136**  |       **97**        | **15.4** | **136**  | No  |
     * | 17 _-x-_ | 48 _(color-adjust)_ | 6 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/print-color-adjust
     */
  colorAdjust: PropFn<TSelf, CssValueOf<'colorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | sRGB | linearRGB`
     *
     * **Initial value**: `linearRGB`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **3**  | **3**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color-interpolation-filters
     */
  colorInterpolationFilters: PropFn<TSelf, CssValueOf<'colorInterpolationFilters'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2022.
     *
     * **Syntax**: `normal | [ light | dark | <custom-ident> ]+ && only?`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **81** | **96**  | **13** | **81** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/color-scheme
     */
  colorScheme: PropFn<TSelf, CssValueOf<'colorScheme'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<integer> | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-count
     */
  columnCount: PropFn<TSelf, CssValueOf<'columnCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `auto | balance`
     *
     * **Initial value**: `balance`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE   |
     * | :----: | :-----: | :-----: | :----: | :----: |
     * | **50** | **52**  |  **9**  | **12** | **10** |
     * |        |         | 8 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-fill
     */
  columnFill: PropFn<TSelf, CssValueOf<'columnFill'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **1**  | **1.5** | **3**  | **12** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-gap
     */
  columnGap: PropCarrier<TSelf, CssValueOf<'columnGap'>, SpacingTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-color
     */
  columnRuleColor: PropFn<TSelf, CssValueOf<'columnRuleColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-style
     */
  columnRuleStyle: PropFn<TSelf, CssValueOf<'columnRuleStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule-width
     */
  columnRuleWidth: PropFn<TSelf, CssValueOf<'columnRuleWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `none | all`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **50**  | **71**  |   **9**   | **12** | **10** |
     * | 6 _-x-_ |         | 5.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-span
     */
  columnSpan: PropFn<TSelf, CssValueOf<'columnSpan'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2016.
     *
     * **Syntax**: `<length> | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **50**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-width
     */
  columnWidth: PropFn<TSelf, CssValueOf<'columnWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | strict | content | [ [ size || inline-size ] || layout || style || paint ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **52** | **69**  | **15.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain
     */
  contain: PropFn<TSelf, CssValueOf<'contain'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto? [ none | <length> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **95** | **107** | **17** | **95** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-block-size
     */
  containIntrinsicBlockSize: PropFn<TSelf, CssValueOf<'containIntrinsicBlockSize'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto? [ none | <length> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **95** | **107** | **17** | **95** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-height
     */
  containIntrinsicHeight: PropFn<TSelf, CssValueOf<'containIntrinsicHeight'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto? [ none | <length> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **95** | **107** | **17** | **95** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-inline-size
     */
  containIntrinsicInlineSize: PropFn<TSelf, CssValueOf<'containIntrinsicInlineSize'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto? [ none | <length> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **95** | **107** | **17** | **95** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-width
     */
  containIntrinsicWidth: PropFn<TSelf, CssValueOf<'containIntrinsicWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since February 2023.
     *
     * **Syntax**: `none | <custom-ident>+`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **105** | **110** | **16** | **105** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container-name
     */
  containerName: PropFn<TSelf, CssValueOf<'containerName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since February 2023.
     *
     * **Syntax**: `normal | [ [ size | inline-size ] || scroll-state ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **105** | **110** | **16** | **105** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container-type
     */
  containerType: PropFn<TSelf, CssValueOf<'containerType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | none | [ <content-replacement> | <content-list> ] [ / [ <string> | <counter> | <attr()> ]+ ]?`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/content
     */
  content: PropFn<TSelf, CssValueOf<'content'>>
  /**
     * Since September 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `visible | auto | hidden`
     *
     * **Initial value**: `visible`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **85** | **125** | **18** | **85** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/content-visibility
     */
  contentVisibility: PropFn<TSelf, CssValueOf<'contentVisibility'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <counter-name> <integer>? ]+ | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **2**  |  **1**  | **3**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-increment
     */
  counterIncrement: PropFn<TSelf, CssValueOf<'counterIncrement'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <counter-name> <integer>? | <reversed-counter-name> <integer>? ]+ | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **2**  |  **1**  | **3**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-reset
     */
  counterReset: PropFn<TSelf, CssValueOf<'counterReset'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <counter-name> <integer>? ]+ | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **85** | **68**  | **17.2** | **85** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/counter-set
     */
  counterSet: PropFn<TSelf, CssValueOf<'counterSet'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since December 2021.
     *
     * **Syntax**: `[ [ <url> [ <x> <y> ]? , ]* <cursor-predefined> ]`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **1**  | **1.2** | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cursor
     */
  cursor: PropCarrier<TSelf, CssValueOf<'cursor'>, CursorTokens<T>, 'auto' | 'default' | 'pointer' | 'text' | 'wait' | 'move' | 'help' | 'notAllowed' | 'none' | 'grab' | 'grabbing' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cx
     */
  cx: PropFn<TSelf, CssValueOf<'cx'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/cy
     */
  cy: PropFn<TSelf, CssValueOf<'cy'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | path(<string>)`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **52** | **97**  |   No   | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/d
     */
  d: PropFn<TSelf, CssValueOf<'d'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `ltr | rtl`
     *
     * **Initial value**: `ltr`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **2**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/direction
     */
  direction: PropFn<TSelf, CssValueOf<'direction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>`
     *
     * **Initial value**: `inline`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/display
     */
  display: PropCarrier<TSelf, CssValueOf<'display'>, never, 'block' | 'inline' | 'inlineBlock' | 'flex' | 'inlineFlex' | 'grid' | 'inlineGrid' | 'none' | 'contents' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | text-bottom | alphabetic | ideographic | middle | central | mathematical | hanging | text-top`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **1**  | **4**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/dominant-baseline
     */
  dominantBaseline: PropFn<TSelf, CssValueOf<'dominantBaseline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `show | hide`
     *
     * **Initial value**: `show`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **1**  | **1.2** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/empty-cells
     */
  emptyCells: PropFn<TSelf, CssValueOf<'emptyCells'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `content | fixed`
     *
     * **Initial value**: `fixed`
     *
     * | Chrome  | Firefox |   Safari    |  Edge   | IE  |
     * | :-----: | :-----: | :---------: | :-----: | :-: |
     * | **123** |   No    | **preview** | **123** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/field-sizing
     */
  fieldSizing: PropFn<TSelf, CssValueOf<'fieldSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<paint>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill
     */
  fill: ColorPropCarrier<TSelf, CssValueOf<'fill'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **1**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill-opacity
     */
  fillOpacity: PropFn<TSelf, CssValueOf<'fillOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `nonzero | evenodd`
     *
     * **Initial value**: `nonzero`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/fill-rule
     */
  fillRule: PropFn<TSelf, CssValueOf<'fillRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  | IE  |
     * | :------: | :-----: | :-----: | :----: | :-: |
     * |  **53**  | **35**  | **9.1** | **12** | No  |
     * | 18 _-x-_ |         | 6 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/filter
     */
  filter: PropFn<TSelf, CssValueOf<'filter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `content | <'width'>`
     *
     * **Initial value**: `auto`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **22**  |  **9**  | **12** | **11** |
     * | 22 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-basis
     */
  flexBasis: PropFn<TSelf, CssValueOf<'flexBasis'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `row | row-reverse | column | column-reverse`
     *
     * **Initial value**: `row`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
     * | :------: | :-----: | :-----: | :----: | :------: |
     * |  **29**  | **22**  |  **9**  | **12** |  **11**  |
     * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-direction
     */
  flexDirection: PropFn<TSelf, CssValueOf<'flexDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |            IE            |
     * | :------: | :-----: | :-----: | :----: | :----------------------: |
     * |  **29**  | **20**  |  **9**  | **12** |          **11**          |
     * | 22 _-x-_ |         | 7 _-x-_ |        | 10 _(-ms-flex-positive)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-grow
     */
  flexGrow: PropFn<TSelf, CssValueOf<'flexGrow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `1`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **20**  |  **9**  | **12** | **10** |
     * | 22 _-x-_ |         | 8 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-shrink
     */
  flexShrink: PropFn<TSelf, CssValueOf<'flexShrink'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `nowrap | wrap | wrap-reverse`
     *
     * **Initial value**: `nowrap`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **28**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-wrap
     */
  flexWrap: PropFn<TSelf, CssValueOf<'flexWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `left | right | none | inline-start | inline-end`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/float
     */
  float: PropFn<TSelf, CssValueOf<'float'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flood-color
     */
  floodColor: PropFn<TSelf, CssValueOf<'floodColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flood-opacity
     */
  floodOpacity: PropFn<TSelf, CssValueOf<'floodOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <family-name> | <generic-family> ]#`
     *
     * **Initial value**: depends on user agent
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-family
     */
  fontFamily: PropCarrier<TSelf, CssValueOf<'fontFamily'>, FontsTokens<T>, GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
     * | :------: | :------: | :-----: | :----: | :----: |
     * |  **48**  |  **34**  | **9.1** | **15** | **10** |
     * | 16 _-x-_ | 15 _-x-_ |         |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-feature-settings
     */
  fontFeatureSettings: PropFn<TSelf, CssValueOf<'fontFeatureSettings'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | normal | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **33** | **32**  |  **9**  | **79** | No  |
     * |        |         | 6 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-kerning
     */
  fontKerning: PropFn<TSelf, CssValueOf<'fontKerning'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <string>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **143** | **34**  |   No   | **143** | No  |
     * |         | 4 _-x-_ |        |         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-language-override
     */
  fontLanguageOverride: PropFn<TSelf, CssValueOf<'fontLanguageOverride'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2020.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **79** | **62**  | **13.1** | **17** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-optical-sizing
     */
  fontOpticalSizing: PropFn<TSelf, CssValueOf<'fontOpticalSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2022.
     *
     * **Syntax**: `normal | light | dark | <palette-identifier> | <palette-mix()>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **101** | **107** | **15.4** | **101** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-palette
     */
  fontPalette: PropFn<TSelf, CssValueOf<'fontPalette'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<absolute-size> | <relative-size> | <length-percentage [0,∞]> | math`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-size
     */
  fontSize: PropCarrier<TSelf, CssValueOf<'fontSize'>, FontSizeTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * Since July 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | [ ex-height | cap-height | ch-width | ic-width | ic-height ]? [ from-font | <number> ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **127** |  **3**  | **16.4** | **127** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-size-adjust
     */
  fontSizeAdjust: PropFn<TSelf, CssValueOf<'fontSizeAdjust'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     *
     * |              Chrome              |              Firefox               |              Safari              |               Edge                | IE  |
     * | :------------------------------: | :--------------------------------: | :------------------------------: | :-------------------------------: | :-: |
     * | **5** _(-webkit-font-smoothing)_ | **25** _(-moz-osx-font-smoothing)_ | **4** _(-webkit-font-smoothing)_ | **79** _(-webkit-font-smoothing)_ | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-smooth
     */
  fontSmooth: PropFn<TSelf, CssValueOf<'fontSmooth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | italic | oblique <angle>?`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-style
     */
  fontStyle: PropFn<TSelf, CssValueOf<'fontStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2022.
     *
     * **Syntax**: `none | [ weight || style || small-caps || position]`
     *
     * **Initial value**: `weight style small-caps position `
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **97** | **34**  | **9**  | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis
     */
  fontSynthesis: PropFn<TSelf, CssValueOf<'fontSynthesis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   | **118** |   No   |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-position
     */
  fontSynthesisPosition: PropFn<TSelf, CssValueOf<'fontSynthesisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-small-caps
     */
  fontSynthesisSmallCaps: PropFn<TSelf, CssValueOf<'fontSynthesisSmallCaps'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-style
     */
  fontSynthesisStyle: PropFn<TSelf, CssValueOf<'fontSynthesisStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **97** | **111** | **16.4** | **97** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-synthesis-weight
     */
  fontSynthesisWeight: PropFn<TSelf, CssValueOf<'fontSynthesisWeight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant
     */
  fontVariant: PropFn<TSelf, CssValueOf<'fontVariant'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :-----: | :-----: | :-: |
     * | **111** | **34**  | **9.1** | **111** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-alternates
     */
  fontVariantAlternates: PropFn<TSelf, CssValueOf<'fontVariantAlternates'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **52** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-caps
     */
  fontVariantCaps: PropFn<TSelf, CssValueOf<'fontVariantCaps'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **63** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-east-asian
     */
  fontVariantEastAsian: PropFn<TSelf, CssValueOf<'fontVariantEastAsian'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | text | emoji | unicode`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **131** | **141** |   No   | **131** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-emoji
     */
  fontVariantEmoji: PropFn<TSelf, CssValueOf<'fontVariantEmoji'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  | IE  |
     * | :------: | :-----: | :-----: | :----: | :-: |
     * |  **34**  | **34**  | **9.1** | **79** | No  |
     * | 31 _-x-_ |         | 7 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-ligatures
     */
  fontVariantLigatures: PropFn<TSelf, CssValueOf<'fontVariantLigatures'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **52** | **34**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-numeric
     */
  fontVariantNumeric: PropFn<TSelf, CssValueOf<'fontVariantNumeric'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | sub | super`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  | Edge | IE  |
     * | :----: | :-----: | :-----: | :--: | :-: |
     * |   No   | **34**  | **9.1** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variant-position
     */
  fontVariantPosition: PropFn<TSelf, CssValueOf<'fontVariantPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2018.
     *
     * **Syntax**: `normal | [ <string> <number> ]#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **62** | **62**  | **11** | **17** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-variation-settings
     */
  fontVariationSettings: PropFn<TSelf, CssValueOf<'fontVariationSettings'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<font-weight-absolute> | bolder | lighter`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **2**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font-weight
     */
  fontWeight: PropCarrier<TSelf, CssValueOf<'fontWeight'>, FontWeightTokens<T>, 'normal' | 'bold' | GlobalKw>
  /**
     * **Syntax**: `normal | <percentage [0,∞]> | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **18.4** |  No  | No  |
     */
  fontWidth: PropFn<TSelf, CssValueOf<'fontWidth'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | none | preserve-parent-color`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |              Edge               |                 IE                  |
     * | :----: | :-----: | :----: | :-----------------------------: | :---------------------------------: |
     * | **89** | **113** |   No   |             **79**              | **10** _(-ms-high-contrast-adjust)_ |
     * |        |         |        | 12 _(-ms-high-contrast-adjust)_ |                                     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/forced-color-adjust
     */
  forcedColorAdjust: PropFn<TSelf, CssValueOf<'forcedColorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<track-size>+`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |             IE              |
     * | :----: | :-----: | :------: | :----: | :-------------------------: |
     * | **57** | **70**  | **10.1** | **16** | **10** _(-ms-grid-columns)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-columns
     */
  gridAutoColumns: PropFn<TSelf, CssValueOf<'gridAutoColumns'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `[ row | column ] || dense`
     *
     * **Initial value**: `row`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-flow
     */
  gridAutoFlow: PropFn<TSelf, CssValueOf<'gridAutoFlow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<track-size>+`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |            IE            |
     * | :----: | :-----: | :------: | :----: | :----------------------: |
     * | **57** | **70**  | **10.1** | **16** | **10** _(-ms-grid-rows)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-auto-rows
     */
  gridAutoRows: PropFn<TSelf, CssValueOf<'gridAutoRows'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column-end
     */
  gridColumnEnd: PropFn<TSelf, CssValueOf<'gridColumnEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column-start
     */
  gridColumnStart: PropFn<TSelf, CssValueOf<'gridColumnStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row-end
     */
  gridRowEnd: PropFn<TSelf, CssValueOf<'gridRowEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row-start
     */
  gridRowStart: PropFn<TSelf, CssValueOf<'gridRowStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <string>+`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-areas
     */
  gridTemplateAreas: PropFn<TSelf, CssValueOf<'gridTemplateAreas'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <track-list> | <auto-track-list> | subgrid <line-name-list>?`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |             IE              |
     * | :----: | :-----: | :------: | :----: | :-------------------------: |
     * | **57** | **52**  | **10.1** | **16** | **10** _(-ms-grid-columns)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-columns
     */
  gridTemplateColumns: PropFn<TSelf, CssValueOf<'gridTemplateColumns'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | <track-list> | <auto-track-list> | subgrid <line-name-list>?`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |            IE            |
     * | :----: | :-----: | :------: | :----: | :----------------------: |
     * | **57** | **52**  | **10.1** | **16** | **10** _(-ms-grid-rows)_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template-rows
     */
  gridTemplateRows: PropFn<TSelf, CssValueOf<'gridTemplateRows'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ first || [ force-end | allow-end ] || last ]`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari | Edge | IE  |
     * | :----: | :-----: | :----: | :--: | :-: |
     * |   No   |   No    | **10** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hanging-punctuation
     */
  hangingPunctuation: PropFn<TSelf, CssValueOf<'hangingPunctuation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/height
     */
  height: PropCarrier<TSelf, CssValueOf<'height'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <string>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari   |   Edge   | IE  |
     * | :-----: | :-----: | :-------: | :------: | :-: |
     * | **106** | **98**  |  **17**   | **106**  | No  |
     * | 6 _-x-_ |         | 5.1 _-x-_ | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphenate-character
     */
  hyphenateCharacter: PropFn<TSelf, CssValueOf<'hyphenateCharacter'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ auto | <integer> ]{1,3}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** | **137** |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphenate-limit-chars
     */
  hyphenateLimitChars: PropFn<TSelf, CssValueOf<'hyphenateLimitChars'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     *
     * |  Chrome  | Firefox |  Safari   |  Edge  |      IE      |
     * | :------: | :-----: | :-------: | :----: | :----------: |
     * |  **55**  | **43**  |  **17**   | **79** | **10** _-x-_ |
     * | 13 _-x-_ | 6 _-x-_ | 5.1 _-x-_ |        |              |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/hyphens
     */
  hyphens: PropFn<TSelf, CssValueOf<'hyphens'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2020.
     *
     * **Syntax**: `from-image | <angle> | [ <angle>? flip ]`
     *
     * **Initial value**: `from-image`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **81** | **26**  | **13.1** | **81** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/image-orientation
     */
  imageOrientation: PropFn<TSelf, CssValueOf<'imageOrientation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | crisp-edges | pixelated | smooth`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **13** | **3.6** | **6**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/image-rendering
     */
  imageRendering: PropFn<TSelf, CssValueOf<'imageRendering'>>
  /**
     * The **`image-resolution`** CSS property specifies the intrinsic resolution of all raster images used in or on the element. It affects content images such as replaced elements and generated content, and decorative images such as `background-image` images.
     *
     * **Syntax**: `[ from-image || <resolution> ] && snap?`
     *
     * **Initial value**: `1dppx`
     */
  imageResolution: PropFn<TSelf, CssValueOf<'imageResolution'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | [ <number> <integer>? ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |   Safari    |  Edge   | IE  |
     * | :-----: | :-----: | :---------: | :-----: | :-: |
     * | **110** |   No    | **9** _-x-_ | **110** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/initial-letter
     */
  initialLetter: PropFn<TSelf, CssValueOf<'initialLetter'>>
  /**
     * **Syntax**: `[ auto | alphabetic | hanging | ideographic ]`
     *
     * **Initial value**: `auto`
     */
  initialLetterAlign: PropFn<TSelf, CssValueOf<'initialLetterAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     *
     * |           Chrome            | Firefox |            Safari             |  Edge  | IE  |
     * | :-------------------------: | :-----: | :---------------------------: | :----: | :-: |
     * |           **57**            | **41**  |           **12.1**            | **79** | No  |
     * | 8 _(-webkit-logical-width)_ |         | 5.1 _(-webkit-logical-width)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inline-size
     */
  inlineSize: PropFn<TSelf, CssValueOf<'inlineSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block-end
     */
  insetBlockEnd: PropFn<TSelf, CssValueOf<'insetBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block-start
     */
  insetBlockStart: PropFn<TSelf, CssValueOf<'insetBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline-end
     */
  insetInlineEnd: PropFn<TSelf, CssValueOf<'insetInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline-start
     */
  insetInlineStart: PropFn<TSelf, CssValueOf<'insetInlineStart'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `numeric-only | allow-keywords`
     *
     * **Initial value**: `numeric-only`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **129** |   No    |   No   | **129** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/interpolate-size
     */
  interpolateSize: PropFn<TSelf, CssValueOf<'interpolateSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | isolate`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **41** | **36**  | **8**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/isolation
     */
  isolation: PropFn<TSelf, CssValueOf<'isolation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]`
     *
     * **Initial value**: `normal`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **20**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-content
     */
  justifyContent: PropFn<TSelf, CssValueOf<'justifyContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2016.
     *
     * **Syntax**: `normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ] | anchor-center`
     *
     * **Initial value**: `legacy`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **52** | **20**  | **9**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-items
     */
  justifyItems: PropFn<TSelf, CssValueOf<'justifyItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | anchor-center`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |   IE   |
     * | :----: | :-----: | :------: | :----: | :----: |
     * | **57** | **45**  | **10.1** | **16** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/justify-self
     */
  justifySelf: PropFn<TSelf, CssValueOf<'justifySelf'>>
  /**
     * **Syntax**: `[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#`
     *
     * **Initial value**: `normal`
     */
  justifyTracks: PropFn<TSelf, CssValueOf<'justifyTracks'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage> | <anchor()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/left
     */
  left: PropCarrier<TSelf, CssValueOf<'left'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | <length>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/letter-spacing
     */
  letterSpacing: PropCarrier<TSelf, CssValueOf<'letterSpacing'>, LetterSpacingTokens<T>, 'normal' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `white`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **5**  |  **3**  | **6**  | **12** | **≤11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/lighting-color
     */
  lightingColor: PropFn<TSelf, CssValueOf<'lightingColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE    |
     * | :-----: | :-----: | :-----: | :----: | :-----: |
     * | **58**  | **69**  | **11**  | **14** | **5.5** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |         |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-break
     */
  lineBreak: PropFn<TSelf, CssValueOf<'lineBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | <number> | <length> | <percentage>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-height
     */
  lineHeight: PropCarrier<TSelf, CssValueOf<'lineHeight'>, LineHeightTokens<T>, 'normal' | GlobalKw, LengthUnits<TSelf>>
  /**
     * The **`line-height-step`** CSS property sets the step unit for line box heights. When the property is set, line box heights are rounded up to the closest multiple of the unit.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  lineHeightStep: PropFn<TSelf, CssValueOf<'lineHeightStep'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<image> | none`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-image
     */
  listStyleImage: PropFn<TSelf, CssValueOf<'listStyleImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `inside | outside`
     *
     * **Initial value**: `outside`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-position
     */
  listStylePosition: PropFn<TSelf, CssValueOf<'listStylePosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<counter-style> | <string> | none`
     *
     * **Initial value**: `disc`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style-type
     */
  listStyleType: PropFn<TSelf, CssValueOf<'listStyleType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block-end
     */
  marginBlockEnd: PropFn<TSelf, CssValueOf<'marginBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block-start
     */
  marginBlockStart: PropFn<TSelf, CssValueOf<'marginBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage> | auto | <anchor-size()>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-bottom
     */
  marginBottom: PropCarrier<TSelf, CssValueOf<'marginBottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * |          Chrome          |        Firefox        |          Safari          |  Edge  | IE  |
     * | :----------------------: | :-------------------: | :----------------------: | :----: | :-: |
     * |          **69**          |        **41**         |         **12.1**         | **79** | No  |
     * | 2 _(-webkit-margin-end)_ | 3 _(-moz-margin-end)_ | 3 _(-webkit-margin-end)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline-end
     */
  marginInlineEnd: PropFn<TSelf, CssValueOf<'marginInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     *
     * |           Chrome           |         Firefox         |           Safari           |  Edge  | IE  |
     * | :------------------------: | :---------------------: | :------------------------: | :----: | :-: |
     * |           **69**           |         **41**          |          **12.1**          | **79** | No  |
     * | 2 _(-webkit-margin-start)_ | 3 _(-moz-margin-start)_ | 3 _(-webkit-margin-start)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline-start
     */
  marginInlineStart: PropFn<TSelf, CssValueOf<'marginInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage> | auto | <anchor-size()>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-left
     */
  marginLeft: PropCarrier<TSelf, CssValueOf<'marginLeft'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage> | auto | <anchor-size()>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-right
     */
  marginRight: PropCarrier<TSelf, CssValueOf<'marginRight'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage> | auto | <anchor-size()>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-top
     */
  marginTop: PropCarrier<TSelf, CssValueOf<'marginTop'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | in-flow | all`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **16.4** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-trim
     */
  marginTrim: PropFn<TSelf, CssValueOf<'marginTrim'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker
     */
  marker: PropFn<TSelf, CssValueOf<'marker'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-end
     */
  markerEnd: PropFn<TSelf, CssValueOf<'markerEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-mid
     */
  markerMid: PropFn<TSelf, CssValueOf<'markerMid'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <url>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/marker-start
     */
  markerStart: PropFn<TSelf, CssValueOf<'markerStart'>>
  /**
     * The **`mask-border-mode`** CSS property specifies the blending mode used in a mask border.
     *
     * **Syntax**: `luminance | alpha`
     *
     * **Initial value**: `alpha`
     */
  maskBorderMode: PropFn<TSelf, CssValueOf<'maskBorderMode'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length> | <number> ]{1,4}`
     *
     * **Initial value**: `0`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-outset)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-outset)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-outset)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-outset
     */
  maskBorderOutset: PropFn<TSelf, CssValueOf<'maskBorderOutset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-repeat)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-repeat)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-repeat)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-repeat
     */
  maskBorderRepeat: PropFn<TSelf, CssValueOf<'maskBorderRepeat'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<number-percentage>{1,4} fill?`
     *
     * **Initial value**: `0`
     *
     * |                 Chrome                 | Firefox |                Safari                |                  Edge                   | IE  |
     * | :------------------------------------: | :-----: | :----------------------------------: | :-------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-slice)_ |   No    |               **17.2**               | **79** _(-webkit-mask-box-image-slice)_ | No  |
     * |                                        |         | 3.1 _(-webkit-mask-box-image-slice)_ |                                         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-slice
     */
  maskBorderSlice: PropFn<TSelf, CssValueOf<'maskBorderSlice'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     *
     * |                 Chrome                  | Firefox |                Safari                 |                   Edge                   | IE  |
     * | :-------------------------------------: | :-----: | :-----------------------------------: | :--------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-source)_ |   No    |               **17.2**                | **79** _(-webkit-mask-box-image-source)_ | No  |
     * |                                         |         | 3.1 _(-webkit-mask-box-image-source)_ |                                          |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-source
     */
  maskBorderSource: PropFn<TSelf, CssValueOf<'maskBorderSource'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length-percentage> | <number> | auto ]{1,4}`
     *
     * **Initial value**: `auto`
     *
     * |                 Chrome                 | Firefox |                Safari                |                  Edge                   | IE  |
     * | :------------------------------------: | :-----: | :----------------------------------: | :-------------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image-width)_ |   No    |               **17.2**               | **79** _(-webkit-mask-box-image-width)_ | No  |
     * |                                        |         | 3.1 _(-webkit-mask-box-image-width)_ |                                         |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border-width
     */
  maskBorderWidth: PropFn<TSelf, CssValueOf<'maskBorderWidth'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <coord-box> | no-clip ]#`
     *
     * **Initial value**: `border-box`
     *
     * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
     * | :-----: | :-----: | :------: | :------: | :-: |
     * | **120** | **53**  | **15.4** | **120**  | No  |
     * | 1 _-x-_ |         | 4 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-clip
     */
  maskClip: PropFn<TSelf, CssValueOf<'maskClip'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<compositing-operator>#`
     *
     * **Initial value**: `add`
     *
     * | Chrome  | Firefox |  Safari  | Edge  | IE  |
     * | :-----: | :-----: | :------: | :---: | :-: |
     * | **120** | **53**  | **15.4** | 18-79 | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-composite
     */
  maskComposite: PropFn<TSelf, CssValueOf<'maskComposite'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<mask-reference>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  | Edge  | IE  |
     * | :-----: | :-----: | :------: | :---: | :-: |
     * | **120** | **53**  | **15.4** | 16-79 | No  |
     * | 1 _-x-_ |         | 4 _-x-_  |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-image
     */
  maskImage: PropFn<TSelf, CssValueOf<'maskImage'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<masking-mode>#`
     *
     * **Initial value**: `match-source`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **120** | **53**  | **15.4** | **120** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-mode
     */
  maskMode: PropFn<TSelf, CssValueOf<'maskMode'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<coord-box>#`
     *
     * **Initial value**: `border-box`
     *
     * | Chrome  | Firefox |  Safari  |   Edge   | IE  |
     * | :-----: | :-----: | :------: | :------: | :-: |
     * | **120** | **53**  | **15.4** | **120**  | No  |
     * | 1 _-x-_ |         | 4 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-origin
     */
  maskOrigin: PropFn<TSelf, CssValueOf<'maskOrigin'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<position>#`
     *
     * **Initial value**: `0% 0%`
     *
     * | Chrome  | Firefox |  Safari   | Edge  | IE  |
     * | :-----: | :-----: | :-------: | :---: | :-: |
     * | **120** | **53**  | **15.4**  | 18-79 | No  |
     * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-position
     */
  maskPosition: PropFn<TSelf, CssValueOf<'maskPosition'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<repeat-style>#`
     *
     * **Initial value**: `repeat`
     *
     * | Chrome  | Firefox |  Safari   | Edge  | IE  |
     * | :-----: | :-----: | :-------: | :---: | :-: |
     * | **120** | **53**  | **15.4**  | 18-79 | No  |
     * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-repeat
     */
  maskRepeat: PropFn<TSelf, CssValueOf<'maskRepeat'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  | Edge  | IE  |
     * | :-----: | :-----: | :------: | :---: | :-: |
     * | **120** | **53**  | **15.4** | 18-79 | No  |
     * | 4 _-x-_ |         | 4 _-x-_  |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-size
     */
  maskSize: PropFn<TSelf, CssValueOf<'maskSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `luminance | alpha`
     *
     * **Initial value**: `luminance`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **24** | **35**  | **7**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-type
     */
  maskType: PropFn<TSelf, CssValueOf<'maskType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `[ pack | next ] || [ definite-first | ordered ]`
     *
     * **Initial value**: `pack`
     */
  masonryAutoFlow: PropFn<TSelf, CssValueOf<'masonryAutoFlow'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto-add | add(<integer>) | <integer>`
     *
     * **Initial value**: `0`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** | **117** |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-depth
     */
  mathDepth: PropFn<TSelf, CssValueOf<'mathDepth'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | compact`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **109** |   No    |   No   | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-shift
     */
  mathShift: PropFn<TSelf, CssValueOf<'mathShift'>>
  /**
     * Since August 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | compact`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **109** | **117** | **14.1** | **109** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/math-style
     */
  mathStyle: PropFn<TSelf, CssValueOf<'mathStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-block-size
     */
  maxBlockSize: PropFn<TSelf, CssValueOf<'maxBlockSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **1**  | **1.3** | **12** | **7** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-height
     */
  maxHeight: PropCarrier<TSelf, CssValueOf<'maxHeight'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |   Safari   |  Edge  | IE  |
     * | :----: | :-----: | :--------: | :----: | :-: |
     * | **57** | **41**  |  **12.1**  | **79** | No  |
     * |        |         | 10.1 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-inline-size
     */
  maxInlineSize: PropFn<TSelf, CssValueOf<'maxInlineSize'>>
  /**
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     */
  maxLines: PropFn<TSelf, CssValueOf<'maxLines'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **7** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/max-width
     */
  maxWidth: PropCarrier<TSelf, CssValueOf<'maxWidth'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'min-width'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-block-size
     */
  minBlockSize: PropFn<TSelf, CssValueOf<'minBlockSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **3**  | **1.3** | **12** | **7** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-height
     */
  minHeight: PropCarrier<TSelf, CssValueOf<'minHeight'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'min-width'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-inline-size
     */
  minInlineSize: PropFn<TSelf, CssValueOf<'minInlineSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **7** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/min-width
     */
  minWidth: PropCarrier<TSelf, CssValueOf<'minWidth'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<blend-mode> | plus-darker | plus-lighter`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **41** | **32**  | **8**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mix-blend-mode
     */
  mixBlendMode: PropFn<TSelf, CssValueOf<'mixBlendMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **55**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-distance)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-distance
     */
  motionDistance: PropFn<TSelf, CssValueOf<'motionDistance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | <offset-path> || <coord-box>`
     *
     * **Initial value**: `none`
     *
     * |       Chrome       | Firefox |  Safari  |  Edge  | IE  |
     * | :----------------: | :-----: | :------: | :----: | :-: |
     * |       **55**       | **72**  | **15.4** | **79** | No  |
     * | 46 _(motion-path)_ |         |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-path
     */
  motionPath: PropFn<TSelf, CssValueOf<'motionPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  motionRotation: PropFn<TSelf, CssValueOf<'motionRotation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `fill | contain | cover | none | scale-down`
     *
     * **Initial value**: `fill`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **32** | **36**  | **10** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-fit
     */
  objectFit: PropFn<TSelf, CssValueOf<'objectFit'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **32** | **36**  | **10** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-position
     */
  objectPosition: PropFn<TSelf, CssValueOf<'objectPosition'>>
  /**
     * **Syntax**: `none | <basic-shape-rect>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **104** |   No    |   No   | **104** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/object-view-box
     */
  objectViewBox: PropFn<TSelf, CssValueOf<'objectViewBox'>>
  /**
     * Since August 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <position>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** | **72**  | **16** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-anchor
     */
  offsetAnchor: PropFn<TSelf, CssValueOf<'offsetAnchor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **55**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-distance)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-distance
     */
  offsetDistance: PropFn<TSelf, CssValueOf<'offsetDistance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | <offset-path> || <coord-box>`
     *
     * **Initial value**: `none`
     *
     * |       Chrome       | Firefox |  Safari  |  Edge  | IE  |
     * | :----------------: | :-----: | :------: | :----: | :-: |
     * |       **55**       | **72**  | **15.4** | **79** | No  |
     * | 46 _(motion-path)_ |         |          |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-path
     */
  offsetPath: PropFn<TSelf, CssValueOf<'offsetPath'>>
  /**
     * Since January 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | auto | <position>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** | **122** | **16** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-position
     */
  offsetPosition: PropFn<TSelf, CssValueOf<'offsetPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  offsetRotate: PropFn<TSelf, CssValueOf<'offsetRotate'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ auto | reverse ] || <angle>`
     *
     * **Initial value**: `auto`
     *
     * |         Chrome         | Firefox | Safari |  Edge  | IE  |
     * | :--------------------: | :-----: | :----: | :----: | :-: |
     * |         **56**         | **72**  | **16** | **79** | No  |
     * | 46 _(motion-rotation)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset-rotate
     */
  offsetRotation: PropFn<TSelf, CssValueOf<'offsetRotation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **2**  | **12** | **9** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/opacity
     */
  opacity: PropCarrier<TSelf, CssValueOf<'opacity'>, OpacityTokens<T>, GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `0`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
     * | :------: | :-----: | :-----: | :----: | :------: |
     * |  **29**  | **20**  |  **9**  | **12** |  **11**  |
     * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/order
     */
  order: PropFn<TSelf, CssValueOf<'order'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `2`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **25** |   No    | **1.3** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/orphans
     */
  orphans: PropFn<TSelf, CssValueOf<'orphans'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <color>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  | **1.5** | **1.2** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-color
     */
  outlineColor: ColorPropCarrier<TSelf, CssValueOf<'outlineColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **1**  | **1.5** | **1.2** | **15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-offset
     */
  outlineOffset: PropFn<TSelf, CssValueOf<'outlineOffset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <outline-line-style>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  | **1.5** | **1.2** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-style
     */
  outlineStyle: PropFn<TSelf, CssValueOf<'outlineStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  | **1.5** | **1.2** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline-width
     */
  outlineWidth: PropCarrier<TSelf, CssValueOf<'outlineWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |   Safari    |  Edge  | IE  |
     * | :----: | :-----: | :---------: | :----: | :-: |
     * | **56** | **66**  | **preview** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-anchor
     */
  overflowAnchor: PropFn<TSelf, CssValueOf<'overflowAnchor'>>
  /**
     * Since September 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **135** | **69**  | **26** | **135** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-block
     */
  overflowBlock: PropFn<TSelf, CssValueOf<'overflowBlock'>>
  /**
     * **Syntax**: `padding-box | content-box`
     *
     * **Initial value**: `padding-box`
     */
  overflowClipBox: PropFn<TSelf, CssValueOf<'overflowClipBox'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<visual-box> || <length [0,∞]>`
     *
     * **Initial value**: `0px`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **90** | **102** |   No   | **90** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-clip-margin
     */
  overflowClipMargin: PropFn<TSelf, CssValueOf<'overflowClipMargin'>>
  /**
     * Since September 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **135** | **69**  | **26** | **135** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-inline
     */
  overflowInline: PropFn<TSelf, CssValueOf<'overflowInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2018.
     *
     * **Syntax**: `normal | break-word | anywhere`
     *
     * **Initial value**: `normal`
     *
     * |     Chrome      |      Firefox      |     Safari      |       Edge       |          IE           |
     * | :-------------: | :---------------: | :-------------: | :--------------: | :-------------------: |
     * |     **23**      |      **49**       |      **7**      |      **18**      | **5.5** _(word-wrap)_ |
     * | 1 _(word-wrap)_ | 3.5 _(word-wrap)_ | 1 _(word-wrap)_ | 12 _(word-wrap)_ |                       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-wrap
     */
  overflowWrap: PropFn<TSelf, CssValueOf<'overflowWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **3.5** | **3**  | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-x
     */
  overflowX: PropCarrier<TSelf, CssValueOf<'overflowX'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  | **3.5** | **3**  | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow-y
     */
  overflowY: PropCarrier<TSelf, CssValueOf<'overflowY'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **117** |   No    |   No   | **117** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overlay
     */
  overlay: PropFn<TSelf, CssValueOf<'overlay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **77** | **73**  | **16** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-block
     */
  overscrollBehaviorBlock: PropFn<TSelf, CssValueOf<'overscrollBehaviorBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **77** | **73**  | **16** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-inline
     */
  overscrollBehaviorInline: PropFn<TSelf, CssValueOf<'overscrollBehaviorInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-x
     */
  overscrollBehaviorX: PropFn<TSelf, CssValueOf<'overscrollBehaviorX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `contain | none | auto`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior-y
     */
  overscrollBehaviorY: PropFn<TSelf, CssValueOf<'overscrollBehaviorY'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block-end
     */
  paddingBlockEnd: PropFn<TSelf, CssValueOf<'paddingBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block-start
     */
  paddingBlockStart: PropFn<TSelf, CssValueOf<'paddingBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-bottom
     */
  paddingBottom: PropCarrier<TSelf, CssValueOf<'paddingBottom'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * |          Chrome           |        Firefox         |          Safari           |  Edge  | IE  |
     * | :-----------------------: | :--------------------: | :-----------------------: | :----: | :-: |
     * |          **69**           |         **41**         |         **12.1**          | **79** | No  |
     * | 2 _(-webkit-padding-end)_ | 3 _(-moz-padding-end)_ | 3 _(-webkit-padding-end)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline-end
     */
  paddingInlineEnd: PropFn<TSelf, CssValueOf<'paddingInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     *
     * |           Chrome            |         Firefox          |           Safari            |  Edge  | IE  |
     * | :-------------------------: | :----------------------: | :-------------------------: | :----: | :-: |
     * |           **69**            |          **41**          |          **12.1**           | **79** | No  |
     * | 2 _(-webkit-padding-start)_ | 3 _(-moz-padding-start)_ | 3 _(-webkit-padding-start)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline-start
     */
  paddingInlineStart: PropFn<TSelf, CssValueOf<'paddingInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-left
     */
  paddingLeft: PropCarrier<TSelf, CssValueOf<'paddingLeft'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-right
     */
  paddingRight: PropCarrier<TSelf, CssValueOf<'paddingRight'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-top
     */
  paddingTop: PropCarrier<TSelf, CssValueOf<'paddingTop'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since February 2023.
     *
     * **Syntax**: `auto | <custom-ident>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **85** | **110** | **1**  | **85** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/page
     */
  page: PropFn<TSelf, CssValueOf<'page'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | [ fill || stroke || markers ]`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **123** | **60**  | **11** | **123** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/paint-order
     */
  paintOrder: PropFn<TSelf, CssValueOf<'paintOrder'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <length>`
     *
     * **Initial value**: `none`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
     * | :------: | :------: | :-----: | :----: | :----: |
     * |  **36**  |  **16**  |  **9**  | **12** | **10** |
     * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/perspective
     */
  perspective: PropFn<TSelf, CssValueOf<'perspective'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  |   IE   |
     * | :------: | :------: | :-----: | :----: | :----: |
     * |  **36**  |  **16**  |  **9**  | **12** | **10** |
     * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/perspective-origin
     */
  perspectiveOrigin: PropFn<TSelf, CssValueOf<'perspectiveOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE   |
     * | :----: | :-----: | :----: | :----: | :----: |
     * | **1**  | **1.5** | **4**  | **12** | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/pointer-events
     */
  pointerEvents: PropFn<TSelf, CssValueOf<'pointerEvents'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `static | relative | absolute | sticky | fixed`
     *
     * **Initial value**: `static`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position
     */
  position: PropCarrier<TSelf, CssValueOf<'position'>, never, 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | GlobalKw>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | <anchor-name>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-anchor
     */
  positionAnchor: PropFn<TSelf, CssValueOf<'positionAnchor'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <position-area>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **129** | **preview** | **26** | **129** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-area
     */
  positionArea: PropFn<TSelf, CssValueOf<'positionArea'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ [<dashed-ident> || <try-tactic>] | <'position-area'> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **128** | **preview** | **26** | **128** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try-fallbacks
     */
  positionTryFallbacks: PropFn<TSelf, CssValueOf<'positionTryFallbacks'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <try-size>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **125** |   No    | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try-order
     */
  positionTryOrder: PropFn<TSelf, CssValueOf<'positionTryOrder'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `always | [ anchors-valid || anchors-visible || no-overflow ]`
     *
     * **Initial value**: `anchors-visible`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** |   No   | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-visibility
     */
  positionVisibility: PropFn<TSelf, CssValueOf<'positionVisibility'>>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     *
     * |  Chrome  |       Firefox       |  Safari  |   Edge   | IE  |
     * | :------: | :-----------------: | :------: | :------: | :-: |
     * | **136**  |       **97**        | **15.4** | **136**  | No  |
     * | 17 _-x-_ | 48 _(color-adjust)_ | 6 _-x-_  | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/print-color-adjust
     */
  printColorAdjust: PropFn<TSelf, CssValueOf<'printColorAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | auto | [ <string> <string> ]+`
     *
     * **Initial value**: depends on user agent
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **11** | **1.5** | **9**  | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/quotes
     */
  quotes: PropFn<TSelf, CssValueOf<'quotes'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **43** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/r
     */
  r: PropFn<TSelf, CssValueOf<'r'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | both | horizontal | vertical | block | inline`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **4**  | **3**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/resize
     */
  resize: PropFn<TSelf, CssValueOf<'resize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage> | <anchor()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/right
     */
  right: PropCarrier<TSelf, CssValueOf<'right'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2022.
     *
     * **Syntax**: `none | <angle> | [ x | y | z | <number>{3} ] && <angle>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **104** | **72**  | **14.1** | **104** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/rotate
     */
  rotate: PropFn<TSelf, CssValueOf<'rotate'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **47** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/row-gap
     */
  rowGap: PropCarrier<TSelf, CssValueOf<'rowGap'>, SpacingTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `start | center | space-between | space-around`
     *
     * **Initial value**: `space-around`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **128** | **38**  | **18.2** | **128** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-align
     */
  rubyAlign: PropFn<TSelf, CssValueOf<'rubyAlign'>>
  /**
     * **Syntax**: `separate | collapse | auto`
     *
     * **Initial value**: `separate`
     */
  rubyMerge: PropFn<TSelf, CssValueOf<'rubyMerge'>>
  /**
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **18.2** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-overhang
     */
  rubyOverhang: PropFn<TSelf, CssValueOf<'rubyOverhang'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ alternate || [ over | under ] ] | inter-character`
     *
     * **Initial value**: `alternate`
     *
     * | Chrome  | Firefox |  Safari  | Edge  | IE  |
     * | :-----: | :-----: | :------: | :---: | :-: |
     * | **84**  | **38**  | **18.2** | 12-79 | No  |
     * | 1 _-x-_ |         | 7 _-x-_  |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ruby-position
     */
  rubyPosition: PropFn<TSelf, CssValueOf<'rubyPosition'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **43** | **69**  | **17.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/rx
     */
  rx: PropFn<TSelf, CssValueOf<'rx'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **43** | **69**  | **17.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/ry
     */
  ry: PropFn<TSelf, CssValueOf<'ry'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2022.
     *
     * **Syntax**: `none | [ <number> | <percentage> ]{1,3}`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **104** | **72**  | **14.1** | **104** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scale
     */
  scale: PropFn<TSelf, CssValueOf<'scale'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | smooth`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **61** | **36**  | **15.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-behavior
     */
  scrollBehavior: PropFn<TSelf, CssValueOf<'scrollBehavior'>>
  /**
     * **Syntax**: `none | nearest`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **133** |   No    |   No   | **133** | No  |
     */
  scrollInitialTarget: PropFn<TSelf, CssValueOf<'scrollInitialTarget'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block-end
     */
  scrollMarginBlockEnd: PropFn<TSelf, CssValueOf<'scrollMarginBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block-start
     */
  scrollMarginBlockStart: PropFn<TSelf, CssValueOf<'scrollMarginBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |              Safari              |  Edge  | IE  |
     * | :----: | :-----: | :------------------------------: | :----: | :-: |
     * | **69** | **68**  |             **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-bottom)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-bottom
     */
  scrollMarginBottom: PropFn<TSelf, CssValueOf<'scrollMarginBottom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline-end
     */
  scrollMarginInlineEnd: PropFn<TSelf, CssValueOf<'scrollMarginInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline-start
     */
  scrollMarginInlineStart: PropFn<TSelf, CssValueOf<'scrollMarginInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari             |  Edge  | IE  |
     * | :----: | :-----: | :----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-left)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-left
     */
  scrollMarginLeft: PropFn<TSelf, CssValueOf<'scrollMarginLeft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari              |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-right)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-right
     */
  scrollMarginRight: PropFn<TSelf, CssValueOf<'scrollMarginRight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |            Safari             |  Edge  | IE  |
     * | :----: | :-----: | :---------------------------: | :----: | :-: |
     * | **69** | **68**  |           **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-top)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-top
     */
  scrollMarginTop: PropFn<TSelf, CssValueOf<'scrollMarginTop'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block-end
     */
  scrollPaddingBlockEnd: PropFn<TSelf, CssValueOf<'scrollPaddingBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block-start
     */
  scrollPaddingBlockStart: PropFn<TSelf, CssValueOf<'scrollPaddingBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **68**  | **14.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-bottom
     */
  scrollPaddingBottom: PropFn<TSelf, CssValueOf<'scrollPaddingBottom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline-end
     */
  scrollPaddingInlineEnd: PropFn<TSelf, CssValueOf<'scrollPaddingInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline-start
     */
  scrollPaddingInlineStart: PropFn<TSelf, CssValueOf<'scrollPaddingInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **68**  | **14.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-left
     */
  scrollPaddingLeft: PropFn<TSelf, CssValueOf<'scrollPaddingLeft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **68**  | **14.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-right
     */
  scrollPaddingRight: PropFn<TSelf, CssValueOf<'scrollPaddingRight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `auto | <length-percentage>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **68**  | **14.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-top
     */
  scrollPaddingTop: PropFn<TSelf, CssValueOf<'scrollPaddingTop'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `[ none | start | end | center ]{1,2}`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-align
     */
  scrollSnapAlign: PropFn<TSelf, CssValueOf<'scrollSnapAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |              Safari              |  Edge  | IE  |
     * | :----: | :-----: | :------------------------------: | :----: | :-: |
     * | **69** | **68**  |             **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-bottom)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-bottom
     */
  scrollSnapMarginBottom: PropFn<TSelf, CssValueOf<'scrollSnapMarginBottom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari             |  Edge  | IE  |
     * | :----: | :-----: | :----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-left)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-left
     */
  scrollSnapMarginLeft: PropFn<TSelf, CssValueOf<'scrollSnapMarginLeft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |             Safari              |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------------: | :----: | :-: |
     * | **69** | **68**  |            **14.1**             | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-right)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-right
     */
  scrollSnapMarginRight: PropFn<TSelf, CssValueOf<'scrollSnapMarginRight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |            Safari             |  Edge  | IE  |
     * | :----: | :-----: | :---------------------------: | :----: | :-: |
     * | **69** | **68**  |           **14.1**            | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin-top)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-top
     */
  scrollSnapMarginTop: PropFn<TSelf, CssValueOf<'scrollSnapMarginTop'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2022.
     *
     * **Syntax**: `normal | always`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **75** | **103** | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-stop
     */
  scrollSnapStop: PropFn<TSelf, CssValueOf<'scrollSnapStop'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2022.
     *
     * **Syntax**: `none | [ x | y | block | inline | both ] [ mandatory | proximity ]?`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  |      IE      |
     * | :----: | :-----: | :-----: | :----: | :----------: |
     * | **69** |  39-68  | **11**  | **79** | **10** _-x-_ |
     * |        |         | 9 _-x-_ |        |              |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-snap-type
     */
  scrollSnapType: PropFn<TSelf, CssValueOf<'scrollSnapType'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ block | inline | x | y ]#`
     *
     * **Initial value**: `block`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline-axis
     */
  scrollTimelineAxis: PropFn<TSelf, CssValueOf<'scrollTimelineAxis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ none | <dashed-ident> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline-name
     */
  scrollTimelineName: PropFn<TSelf, CssValueOf<'scrollTimelineName'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | <color>{2}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **121** | **64**  |   No   | **121** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-color
     */
  scrollbarColor: PropFn<TSelf, CssValueOf<'scrollbarColor'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | stable && both-edges?`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **94** | **97**  | **18.2** | **94** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-gutter
     */
  scrollbarGutter: PropFn<TSelf, CssValueOf<'scrollbarGutter'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | thin | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **121** | **64**  | **18.2** | **121** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scrollbar-width
     */
  scrollbarWidth: PropFn<TSelf, CssValueOf<'scrollbarWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `0.0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-image-threshold
     */
  shapeImageThreshold: PropFn<TSelf, CssValueOf<'shapeImageThreshold'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-margin
     */
  shapeMargin: PropFn<TSelf, CssValueOf<'shapeMargin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ <shape-box> || <basic-shape> ] | <image>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **37** | **62**  | **10.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-outside
     */
  shapeOutside: PropFn<TSelf, CssValueOf<'shapeOutside'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | optimizeSpeed | crispEdges | geometricPrecision`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **1**  |  **3**  | **4**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/shape-rendering
     */
  shapeRendering: PropFn<TSelf, CssValueOf<'shapeRendering'>>
  /**
     * **Syntax**: `normal | spell-out || digits || [ literal-punctuation | no-punctuation ]`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **11.1** |  No  | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/speak-as
     */
  speakAs: PropFn<TSelf, CssValueOf<'speakAs'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'color'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stop-color
     */
  stopColor: PropFn<TSelf, CssValueOf<'stopColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `black`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stop-opacity
     */
  stopOpacity: PropFn<TSelf, CssValueOf<'stopOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<paint>`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke
     */
  stroke: ColorPropCarrier<TSelf, CssValueOf<'stroke'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `transparent`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * |   No   |   No    | **11.1** |  No  | No  |
     */
  strokeColor: PropFn<TSelf, CssValueOf<'strokeColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `none | <dasharray>`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-dasharray
     */
  strokeDasharray: PropFn<TSelf, CssValueOf<'strokeDasharray'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length-percentage> | <number>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-dashoffset
     */
  strokeDashoffset: PropFn<TSelf, CssValueOf<'strokeDashoffset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `butt | round | square`
     *
     * **Initial value**: `butt`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-linecap
     */
  strokeLinecap: PropFn<TSelf, CssValueOf<'strokeLinecap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `miter | miter-clip | round | bevel | arcs`
     *
     * **Initial value**: `miter`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-linejoin
     */
  strokeLinejoin: PropFn<TSelf, CssValueOf<'strokeLinejoin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `4`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-miterlimit
     */
  strokeMiterlimit: PropFn<TSelf, CssValueOf<'strokeMiterlimit'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<'opacity'>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-opacity
     */
  strokeOpacity: PropFn<TSelf, CssValueOf<'strokeOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length-percentage> | <number>`
     *
     * **Initial value**: `1px`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  | **1.5** | **4**  | **≤15** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/stroke-width
     */
  strokeWidth: PropFn<TSelf, CssValueOf<'strokeWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **21** | **91**  | **7**  | **79** | No  |
     * |        | 4 _-x-_ |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/tab-size
     */
  tabSize: PropFn<TSelf, CssValueOf<'tabSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | fixed`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **14** |  **1**  | **1**  | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/table-layout
     */
  tableLayout: PropFn<TSelf, CssValueOf<'tableLayout'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `start | end | left | right | center | justify | match-parent`
     *
     * **Initial value**: `start`, or a nameless value that acts as `left` if _direction_ is `ltr`, `right` if _direction_ is `rtl` if `start` is not supported by the browser.
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-align
     */
  textAlign: PropFn<TSelf, CssValueOf<'textAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `auto | start | end | left | right | center | justify`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **47** | **49**  | **16** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-align-last
     */
  textAlignLast: PropFn<TSelf, CssValueOf<'textAlignLast'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2016.
     *
     * **Syntax**: `start | middle | end`
     *
     * **Initial value**: `start`
     *
     * | Chrome | Firefox | Safari |  Edge   | IE  |
     * | :----: | :-----: | :----: | :-----: | :-: |
     * | **1**  |  **3**  | **4**  | **≤14** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-anchor
     */
  textAnchor: PropFn<TSelf, CssValueOf<'textAnchor'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <autospace> | auto`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **140** | **145** | **18.4** | **140** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-autospace
     */
  textAutospace: PropFn<TSelf, CssValueOf<'textAutospace'>>
  /**
     * **Syntax**: `normal | <'text-box-trim'> || <'text-box-edge'>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box
     */
  textBox: PropFn<TSelf, CssValueOf<'textBox'>>
  /**
     * **Syntax**: `auto | <text-edge>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box-edge
     */
  textBoxEdge: PropFn<TSelf, CssValueOf<'textBoxEdge'>>
  /**
     * **Syntax**: `none | trim-start | trim-end | trim-both`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **133** |   No    | **18.2** | **133** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-box-trim
     */
  textBoxTrim: PropFn<TSelf, CssValueOf<'textBoxTrim'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     *
     * |           Chrome           | Firefox |            Safari            |  Edge  |                   IE                   |
     * | :------------------------: | :-----: | :--------------------------: | :----: | :------------------------------------: |
     * |           **48**           | **48**  |           **15.4**           | **79** | **11** _(-ms-text-combine-horizontal)_ |
     * | 9 _(-webkit-text-combine)_ |         | 5.1 _(-webkit-text-combine)_ |        |                                        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-combine-upright
     */
  textCombineUpright: PropFn<TSelf, CssValueOf<'textCombineUpright'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **36**  | **12.1** | **79** | No  |
     * |        |         | 8 _-x-_  |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-color
     */
  textDecorationColor: ColorPropCarrier<TSelf, CssValueOf<'textDecorationColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **36**  | **12.1** | **79** | No  |
     * |        |         | 8 _-x-_  |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-line
     */
  textDecorationLine: PropFn<TSelf, CssValueOf<'textDecorationLine'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]`
     *
     * **Initial value**: `objects`
     *
     * | Chrome | Firefox |  Safari  | Edge | IE  |
     * | :----: | :-----: | :------: | :--: | :-: |
     * | 57-64  |   No    | **12.1** |  No  | No  |
     * |        |         | 7 _-x-_  |      |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-skip
     */
  textDecorationSkip: PropFn<TSelf, CssValueOf<'textDecorationSkip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | all | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **64** | **70**  | **15.4** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-skip-ink
     */
  textDecorationSkipInk: PropFn<TSelf, CssValueOf<'textDecorationSkipInk'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `solid | double | dotted | dashed | wavy`
     *
     * **Initial value**: `solid`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **36**  | **12.1** | **79** | No  |
     * |        |         | 8 _-x-_  |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-style
     */
  textDecorationStyle: PropFn<TSelf, CssValueOf<'textDecorationStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2021.
     *
     * **Syntax**: `auto | from-font | <length> | <percentage> `
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **89** | **70**  | **12.1** | **89** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration-thickness
     */
  textDecorationThickness: PropFn<TSelf, CssValueOf<'textDecorationThickness'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-color
     */
  textEmphasisColor: PropFn<TSelf, CssValueOf<'textEmphasisColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | [ over | under ] && [ right | left ]?`
     *
     * **Initial value**: `auto`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-position
     */
  textEmphasisPosition: PropFn<TSelf, CssValueOf<'textEmphasisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>`
     *
     * **Initial value**: `none`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis-style
     */
  textEmphasisStyle: PropFn<TSelf, CssValueOf<'textEmphasisStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage> && hanging? && each-line?`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-indent
     */
  textIndent: PropFn<TSelf, CssValueOf<'textIndent'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | inter-character | inter-word | none`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari | Edge  |   IE   |
     * | :----: | :-----: | :----: | :---: | :----: |
     * |   No   | **55**  |   No   | 12-79 | **11** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-justify
     */
  textJustify: PropFn<TSelf, CssValueOf<'textJustify'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2020.
     *
     * **Syntax**: `mixed | upright | sideways`
     *
     * **Initial value**: `mixed`
     *
     * |  Chrome  | Firefox |  Safari   |  Edge  | IE  |
     * | :------: | :-----: | :-------: | :----: | :-: |
     * |  **48**  | **41**  |  **14**   | **79** | No  |
     * | 12 _-x-_ |         | 5.1 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-orientation
     */
  textOrientation: PropFn<TSelf, CssValueOf<'textOrientation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ clip | ellipsis | <string> ]{1,2}`
     *
     * **Initial value**: `clip`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **7**  | **1.3** | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-overflow
     */
  textOverflow: PropFn<TSelf, CssValueOf<'textOverflow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | optimizeSpeed | optimizeLegibility | geometricPrecision`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **4**  |  **1**  | **5**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-rendering
     */
  textRendering: PropFn<TSelf, CssValueOf<'textRendering'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow-t>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE   |
     * | :----: | :-----: | :-----: | :----: | :----: |
     * | **2**  | **3.5** | **1.1** | **12** | **10** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-shadow
     */
  textShadow: PropFn<TSelf, CssValueOf<'textShadow'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **54** |   No    |   No   | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-size-adjust
     */
  textSizeAdjust: PropFn<TSelf, CssValueOf<'textSizeAdjust'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `space-all | normal | space-first | trim-start`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **123** |   No    |   No   | **123** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-spacing-trim
     */
  textSpacingTrim: PropFn<TSelf, CssValueOf<'textSpacingTrim'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | [ capitalize | uppercase | lowercase ] || full-width || full-size-kana | math-auto`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-transform
     */
  textTransform: PropFn<TSelf, CssValueOf<'textTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2020.
     *
     * **Syntax**: `auto | <length> | <percentage> `
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **70**  | **12.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-underline-offset
     */
  textUnderlineOffset: PropFn<TSelf, CssValueOf<'textUnderlineOffset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | from-font | [ under || [ left | right ] ]`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :------: | :----: | :---: |
     * | **33** | **74**  | **12.1** | **12** | **6** |
     * |        |         | 9 _-x-_  |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-underline-position
     */
  textUnderlinePosition: PropFn<TSelf, CssValueOf<'textUnderlinePosition'>>
  /**
     * Since October 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `wrap | nowrap`
     *
     * **Initial value**: `wrap`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **130** | **124** | **17.4** | **130** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap-mode
     */
  textWrapMode: PropFn<TSelf, CssValueOf<'textWrapMode'>>
  /**
     * Since October 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | balance | stable | pretty`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **130** | **124** | **17.5** | **130** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap-style
     */
  textWrapStyle: PropFn<TSelf, CssValueOf<'textWrapStyle'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <dashed-ident>#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **116** |   No    | **26** | **116** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/timeline-scope
     */
  timelineScope: PropFn<TSelf, CssValueOf<'timelineScope'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage> | <anchor()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/top
     */
  top: PropCarrier<TSelf, CssValueOf<'top'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2019.
     *
     * **Syntax**: `auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |    IE    |
     * | :----: | :-----: | :----: | :----: | :------: |
     * | **36** | **52**  | **13** | **12** |  **11**  |
     * |        |         |        |        | 10 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/touch-action
     */
  touchAction: PropFn<TSelf, CssValueOf<'touchAction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  |  Firefox  |  Safari   |  Edge  |   IE    |
     * | :-----: | :-------: | :-------: | :----: | :-----: |
     * | **36**  |  **16**   |   **9**   | **12** | **10**  |
     * | 1 _-x-_ | 3.5 _-x-_ | 3.1 _-x-_ |        | 9 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform
     */
  transform: PropFn<TSelf, CssValueOf<'transform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `content-box | border-box | fill-box | stroke-box | view-box`
     *
     * **Initial value**: `view-box`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **64** | **55**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-box
     */
  transformBox: PropFn<TSelf, CssValueOf<'transformBox'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     *
     * | Chrome  |  Firefox  | Safari  |  Edge  |   IE    |
     * | :-----: | :-------: | :-----: | :----: | :-----: |
     * | **36**  |  **16**   |  **9**  | **12** | **10**  |
     * | 1 _-x-_ | 3.5 _-x-_ | 2 _-x-_ |        | 9 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-origin
     */
  transformOrigin: PropFn<TSelf, CssValueOf<'transformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     *
     * |  Chrome  | Firefox  | Safari  |  Edge  | IE  |
     * | :------: | :------: | :-----: | :----: | :-: |
     * |  **36**  |  **16**  |  **9**  | **12** | No  |
     * | 12 _-x-_ | 10 _-x-_ | 4 _-x-_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transform-style
     */
  transformStyle: PropFn<TSelf, CssValueOf<'transformStyle'>>
  /**
     * Since August 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<transition-behavior-value>#`
     *
     * **Initial value**: `normal`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **117** | **129** | **17.4** | **117** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-behavior
     */
  transitionBehavior: PropFn<TSelf, CssValueOf<'transitionBehavior'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **26**  | **16**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-delay
     */
  transitionDelay: PropFn<TSelf, CssValueOf<'transitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **26**  | **16**  |   **9**   | **12** | **10** |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-duration
     */
  transitionDuration: PropCarrier<TSelf, CssValueOf<'transitionDuration'>, DurationTokens<T>, GlobalKw, TimeUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **26**  | **16**  |   **9**   | **12** | **10** |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-property
     */
  transitionProperty: PropCarrier<TSelf, CssValueOf<'transitionProperty'>, TransitionPropertyTokens<T>, GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **26**  | **16**  |   **9**   | **12** | **10** |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition-timing-function
     */
  transitionTimingFunction: PropCarrier<TSelf, CssValueOf<'transitionTimingFunction'>, EasingTokens<T>, GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2022.
     *
     * **Syntax**: `none | <length-percentage> [ <length-percentage> <length>? ]?`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **104** | **72**  | **14.1** | **104** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/translate
     */
  translate: PropFn<TSelf, CssValueOf<'translate'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | embed | isolate | bidi-override | isolate-override | plaintext`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE    |
     * | :----: | :-----: | :-----: | :----: | :-----: |
     * | **2**  |  **1**  | **1.3** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/unicode-bidi
     */
  unicodeBidi: PropFn<TSelf, CssValueOf<'unicodeBidi'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox |   Safari    |   Edge   |      IE      |
     * | :-----: | :-----: | :---------: | :------: | :----------: |
     * | **54**  | **69**  | **3** _-x-_ |  **79**  | **10** _-x-_ |
     * | 1 _-x-_ | 1 _-x-_ |             | 12 _-x-_ |              |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/user-select
     */
  userSelect: PropFn<TSelf, CssValueOf<'userSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | non-scaling-stroke | non-scaling-size | non-rotation | fixed-position`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **6**  | **15**  | **5.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/vector-effect
     */
  vectorEffect: PropFn<TSelf, CssValueOf<'vectorEffect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>`
     *
     * **Initial value**: `baseline`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/vertical-align
     */
  verticalAlign: PropFn<TSelf, CssValueOf<'verticalAlign'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ block | inline | x | y ]#`
     *
     * **Initial value**: `block`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-axis
     */
  viewTimelineAxis: PropFn<TSelf, CssValueOf<'viewTimelineAxis'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ [ auto | <length-percentage> ]{1,2} ]#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-inset
     */
  viewTimelineInset: PropFn<TSelf, CssValueOf<'viewTimelineInset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ none | <dashed-ident> ]#`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline-name
     */
  viewTimelineName: PropFn<TSelf, CssValueOf<'viewTimelineName'>>
  /**
     * **Syntax**: `none | <custom-ident>+`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **125** | **144** | **18.2** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-transition-class
     */
  viewTransitionClass: PropFn<TSelf, CssValueOf<'viewTransitionClass'>>
  /**
     * Since October 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | <custom-ident> | match-element`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **111** | **144** | **18** | **111** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-transition-name
     */
  viewTransitionName: PropFn<TSelf, CssValueOf<'viewTransitionName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | collapse`
     *
     * **Initial value**: `visible`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/visibility
     */
  visibility: PropCarrier<TSelf, CssValueOf<'visibility'>, never, 'visible' | 'hidden' | 'collapse' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | pre | pre-wrap | pre-line | <'white-space-collapse'> || <'text-wrap-mode'>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/white-space
     */
  whiteSpace: PropFn<TSelf, CssValueOf<'whiteSpace'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `collapse | preserve | preserve-breaks | preserve-spaces | break-spaces`
     *
     * **Initial value**: `collapse`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **114** | **124** | **17.4** | **114** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/white-space-collapse
     */
  whiteSpaceCollapse: PropFn<TSelf, CssValueOf<'whiteSpaceCollapse'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `2`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **25** |   No    | **1.3** | **12** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/widows
     */
  widows: PropFn<TSelf, CssValueOf<'widows'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <length-percentage [0,∞]> | min-content | max-content | fit-content | fit-content(<length-percentage [0,∞]>) | <calc-size()> | <anchor-size()>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/width
     */
  width: PropCarrier<TSelf, CssValueOf<'width'>, SizeTokens<T>, 'auto' | 'minContent' | 'maxContent' | 'fitContent' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | <animateable-feature>#`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **36** | **36**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/will-change
     */
  willChange: PropFn<TSelf, CssValueOf<'willChange'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | break-all | keep-all | break-word | auto-phrase`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  | **15**  | **3**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/word-break
     */
  wordBreak: PropFn<TSelf, CssValueOf<'wordBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | <length>`
     *
     * **Initial value**: `normal`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **6** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/word-spacing
     */
  wordSpacing: PropFn<TSelf, CssValueOf<'wordSpacing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2018.
     *
     * **Syntax**: `normal | break-word`
     *
     * **Initial value**: `normal`
     */
  wordWrap: PropFn<TSelf, CssValueOf<'wordWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr`
     *
     * **Initial value**: `horizontal-tb`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |  IE   |
     * | :-----: | :-----: | :-------: | :----: | :---: |
     * | **48**  | **41**  | **10.1**  | **12** | **9** |
     * | 8 _-x-_ |         | 5.1 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/writing-mode
     */
  writingMode: PropFn<TSelf, CssValueOf<'writingMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **42** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/x
     */
  x: PropFn<TSelf, CssValueOf<'x'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `<length> | <percentage>`
     *
     * **Initial value**: `0`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **42** | **69**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/y
     */
  y: PropFn<TSelf, CssValueOf<'y'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <integer>`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/z-index
     */
  zIndex: PropCarrier<TSelf, CssValueOf<'zIndex'>, ZIndexTokens<T>, 'auto' | GlobalKw>
  /**
     * Since May 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `normal | reset | <number [0,∞]> || <percentage [0,∞]>`
     *
     * **Initial value**: `1`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE    |
     * | :----: | :-----: | :-----: | :----: | :-----: |
     * | **1**  | **126** | **3.1** | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/zoom
     */
  zoom: PropFn<TSelf, CssValueOf<'zoom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `initial | inherit | unset | revert | revert-layer`
     *
     * **Initial value**: There is no practical initial value for it.
     *
     * | Chrome | Firefox | Safari  |  Edge  | IE  |
     * | :----: | :-----: | :-----: | :----: | :-: |
     * | **37** | **27**  | **9.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/all
     */
  all: PropFn<TSelf, CssValueOf<'all'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation
     */
  animation: PropFn<TSelf, CssValueOf<'animation'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'animation-range-start'> <'animation-range-end'>? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/animation-range
     */
  animationRange: PropFn<TSelf, CssValueOf<'animationRange'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-layer>#? , <final-bg-layer>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background
     */
  background: PropFn<TSelf, CssValueOf<'background'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-position>#`
     *
     * **Initial value**: `0% 0%`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/background-position
     */
  backgroundPosition: PropFn<TSelf, CssValueOf<'backgroundPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border
     */
  border: PropFn<TSelf, CssValueOf<'border'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-block-start'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block
     */
  borderBlock: PropFn<TSelf, CssValueOf<'borderBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-color'>{1,2}`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-color
     */
  borderBlockColor: PropFn<TSelf, CssValueOf<'borderBlockColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-end
     */
  borderBlockEnd: PropFn<TSelf, CssValueOf<'borderBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-start
     */
  borderBlockStart: PropFn<TSelf, CssValueOf<'borderBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-style'>{1,2}`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-style
     */
  borderBlockStyle: PropFn<TSelf, CssValueOf<'borderBlockStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-width'>{1,2}`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-block-width
     */
  borderBlockWidth: PropFn<TSelf, CssValueOf<'borderBlockWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-bottom
     */
  borderBottom: PropFn<TSelf, CssValueOf<'borderBottom'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<color>{1,4}`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-color
     */
  borderColor: ColorPropCarrier<TSelf, CssValueOf<'borderColor'>, ColorTokens<T>, 'white' | 'black' | 'transparent' | 'currentColor' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     *
     * | Chrome  |  Firefox  | Safari  |  Edge  |   IE   |
     * | :-----: | :-------: | :-----: | :----: | :----: |
     * | **16**  |  **15**   |  **6**  | **12** | **11** |
     * | 7 _-x-_ | 3.5 _-x-_ | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-image
     */
  borderImage: PropFn<TSelf, CssValueOf<'borderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-block-start'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline
     */
  borderInline: PropFn<TSelf, CssValueOf<'borderInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-color'>{1,2}`
     *
     * **Initial value**: `currentcolor`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-color
     */
  borderInlineColor: PropFn<TSelf, CssValueOf<'borderInlineColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-end
     */
  borderInlineEnd: PropFn<TSelf, CssValueOf<'borderInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'> || <'border-top-style'> || <color>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **41**  | **12.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-start
     */
  borderInlineStart: PropFn<TSelf, CssValueOf<'borderInlineStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-style'>{1,2}`
     *
     * **Initial value**: `none`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-style
     */
  borderInlineStyle: PropFn<TSelf, CssValueOf<'borderInlineStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'border-top-width'>{1,2}`
     *
     * **Initial value**: `medium`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-inline-width
     */
  borderInlineWidth: PropFn<TSelf, CssValueOf<'borderInlineWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-left
     */
  borderLeft: PropFn<TSelf, CssValueOf<'borderLeft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |  IE   |
     * | :-----: | :-----: | :-----: | :----: | :---: |
     * |  **4**  |  **4**  |  **5**  | **12** | **9** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-radius
     */
  borderRadius: PropCarrier<TSelf, CssValueOf<'borderRadius'>, RadiusTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |   IE    |
     * | :----: | :-----: | :----: | :----: | :-----: |
     * | **1**  |  **1**  | **1**  | **12** | **5.5** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-right
     */
  borderRight: PropFn<TSelf, CssValueOf<'borderRight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-style>{1,4}`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-style
     */
  borderStyle: PropFn<TSelf, CssValueOf<'borderStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width> || <line-style> || <color>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-top
     */
  borderTop: PropFn<TSelf, CssValueOf<'borderTop'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>{1,4}`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/border-width
     */
  borderWidth: PropCarrier<TSelf, CssValueOf<'borderWidth'>, BordersTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /** **Syntax**: `<'caret-color'> || <'caret-shape'>` */
  caret: PropFn<TSelf, CssValueOf<'caret'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  |  **9**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/column-rule
     */
  columnRule: PropFn<TSelf, CssValueOf<'columnRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-width'> || <'column-count'>`
     *
     * | Chrome | Firefox | Safari  |  Edge  |   IE   |
     * | :----: | :-----: | :-----: | :----: | :----: |
     * | **50** | **52**  |  **9**  | **12** | **10** |
     * |        |         | 3 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/columns
     */
  columns: PropFn<TSelf, CssValueOf<'columns'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ auto? [ none | <length> ] ]{1,2}`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **83** | **107** | **17** | **83** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/contain-intrinsic-size
     */
  containIntrinsicSize: PropFn<TSelf, CssValueOf<'containIntrinsicSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since February 2023.
     *
     * **Syntax**: `<'container-name'> [ / <'container-type'> ]?`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **105** | **110** | **16** | **105** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/container
     */
  container: PropFn<TSelf, CssValueOf<'container'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |    IE    |
     * | :------: | :-----: | :-----: | :----: | :------: |
     * |  **29**  | **22**  |  **9**  | **12** |  **11**  |
     * | 21 _-x-_ |         | 7 _-x-_ |        | 10 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex
     */
  flex: PropFn<TSelf, CssValueOf<'flex'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<'flex-direction'> || <'flex-wrap'>`
     *
     * |  Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :------: | :-----: | :-----: | :----: | :----: |
     * |  **29**  | **28**  |  **9**  | **12** | **11** |
     * | 21 _-x-_ |         | 7 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/flex-flow
     */
  flexFlow: PropFn<TSelf, CssValueOf<'flexFlow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] | <system-family-name>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/font
     */
  font: PropFn<TSelf, CssValueOf<'font'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<'row-gap'> <'column-gap'>?`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/gap
     */
  gap: PropCarrier<TSelf, CssValueOf<'gap'>, SpacingTokens<T>, GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid
     */
  grid: PropFn<TSelf, CssValueOf<'grid'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line> [ / <grid-line> ]{0,3}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-area
     */
  gridArea: PropFn<TSelf, CssValueOf<'gridArea'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line> [ / <grid-line> ]?`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-column
     */
  gridColumn: PropFn<TSelf, CssValueOf<'gridColumn'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<grid-line> [ / <grid-line> ]?`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-row
     */
  gridRow: PropFn<TSelf, CssValueOf<'gridRow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **57** | **52**  | **10.1** | **16** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/grid-template
     */
  gridTemplate: PropFn<TSelf, CssValueOf<'gridTemplate'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,4}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset
     */
  inset: PropCarrier<TSelf, CssValueOf<'inset'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-block
     */
  insetBlock: PropFn<TSelf, CssValueOf<'insetBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **63**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/inset-inline
     */
  insetInline: PropFn<TSelf, CssValueOf<'insetInline'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     *
     * |   Chrome    |   Firefox    |  Safari   |     Edge     | IE  |
     * | :---------: | :----------: | :-------: | :----------: | :-: |
     * | **6** _-x-_ | **68** _-x-_ | 18.2-18.4 | **17** _-x-_ | No  |
     * |             |              |  5 _-x-_  |              |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/line-clamp
     */
  lineClamp: PropFn<TSelf, CssValueOf<'lineClamp'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'list-style-type'> || <'list-style-position'> || <'list-style-image'>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/list-style
     */
  listStyle: PropFn<TSelf, CssValueOf<'listStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'margin-top'>{1,4}`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin
     */
  margin: PropCarrier<TSelf, CssValueOf<'margin'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'margin-top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-block
     */
  marginBlock: PropCarrier<TSelf, CssValueOf<'marginBlock'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'margin-top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/margin-inline
     */
  marginInline: PropCarrier<TSelf, CssValueOf<'marginInline'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<mask-layer>#`
     *
     * | Chrome  | Firefox |  Safari   | Edge  | IE  |
     * | :-----: | :-----: | :-------: | :---: | :-: |
     * | **120** | **53**  | **15.4**  | 12-79 | No  |
     * | 1 _-x-_ |         | 3.1 _-x-_ |       |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask
     */
  mask: PropFn<TSelf, CssValueOf<'mask'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>`
     *
     * |              Chrome              | Firefox |             Safari             |               Edge                | IE  |
     * | :------------------------------: | :-----: | :----------------------------: | :-------------------------------: | :-: |
     * | **1** _(-webkit-mask-box-image)_ |   No    |            **17.2**            | **79** _(-webkit-mask-box-image)_ | No  |
     * |                                  |         | 3.1 _(-webkit-mask-box-image)_ |                                   |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/mask-border
     */
  maskBorder: PropFn<TSelf, CssValueOf<'maskBorder'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?`
     *
     * |    Chrome     | Firefox | Safari |  Edge  | IE  |
     * | :-----------: | :-----: | :----: | :----: | :-: |
     * |    **55**     | **72**  | **16** | **79** | No  |
     * | 46 _(motion)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset
     */
  motion: PropFn<TSelf, CssValueOf<'motion'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?`
     *
     * |    Chrome     | Firefox | Safari |  Edge  | IE  |
     * | :-----------: | :-----: | :----: | :----: | :-: |
     * |    **55**     | **72**  | **16** | **79** | No  |
     * | 46 _(motion)_ |         |        |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/offset
     */
  offset: PropFn<TSelf, CssValueOf<'offset'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `<'outline-width'> || <'outline-style'> || <'outline-color'>`
     *
     * | Chrome | Firefox |  Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :------: | :----: | :---: |
     * | **94** | **88**  | **16.4** | **94** | **8** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/outline
     */
  outline: PropFn<TSelf, CssValueOf<'outline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ visible | hidden | clip | scroll | auto ]{1,2}`
     *
     * **Initial value**: `visible`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overflow
     */
  overflow: PropCarrier<TSelf, CssValueOf<'overflow'>, never, 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | GlobalKw>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `[ contain | none | auto ]{1,2}`
     *
     * **Initial value**: `auto`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **63** | **59**  | **16** | **18** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/overscroll-behavior
     */
  overscrollBehavior: PropFn<TSelf, CssValueOf<'overscrollBehavior'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'padding-top'>{1,4}`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding
     */
  padding: PropCarrier<TSelf, CssValueOf<'padding'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'padding-top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-block
     */
  paddingBlock: PropCarrier<TSelf, CssValueOf<'paddingBlock'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'padding-top'>{1,2}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **87** | **66**  | **14.1** | **87** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/padding-inline
     */
  paddingInline: PropCarrier<TSelf, CssValueOf<'paddingInline'>, SpacingTokens<T>, 'auto' | GlobalKw, LengthUnits<TSelf>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-content'> <'justify-content'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **9**  | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-content
     */
  placeContent: PropFn<TSelf, CssValueOf<'placeContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-items'> <'justify-items'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-items
     */
  placeItems: PropFn<TSelf, CssValueOf<'placeItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'align-self'> <'justify-self'>?`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **59** | **45**  | **11** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/place-self
     */
  placeSelf: PropFn<TSelf, CssValueOf<'placeSelf'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'position-try-order'>? <'position-try-fallbacks'>`
     *
     * | Chrome  |   Firefox   | Safari |  Edge   | IE  |
     * | :-----: | :---------: | :----: | :-----: | :-: |
     * | **125** | **preview** | **26** | **125** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/position-try
     */
  positionTry: PropFn<TSelf, CssValueOf<'positionTry'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2021.
     *
     * **Syntax**: `<length>{1,4}`
     *
     * | Chrome | Firefox |          Safari           |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------: | :----: | :-: |
     * | **69** | **90**  |         **14.1**          | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin
     */
  scrollMargin: PropFn<TSelf, CssValueOf<'scrollMargin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>{1,2}`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-block
     */
  scrollMarginBlock: PropFn<TSelf, CssValueOf<'scrollMarginBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `<length>{1,2}`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin-inline
     */
  scrollMarginInline: PropFn<TSelf, CssValueOf<'scrollMarginInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `[ auto | <length-percentage> ]{1,4}`
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **69** | **68**  | **14.1** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding
     */
  scrollPadding: PropFn<TSelf, CssValueOf<'scrollPadding'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `[ auto | <length-percentage> ]{1,2}`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-block
     */
  scrollPaddingBlock: PropFn<TSelf, CssValueOf<'scrollPaddingBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2021.
     *
     * **Syntax**: `[ auto | <length-percentage> ]{1,2}`
     *
     * | Chrome | Firefox | Safari |  Edge  | IE  |
     * | :----: | :-----: | :----: | :----: | :-: |
     * | **69** | **68**  | **15** | **79** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-padding-inline
     */
  scrollPaddingInline: PropFn<TSelf, CssValueOf<'scrollPaddingInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2021.
     *
     * **Syntax**: `<length>{1,4}`
     *
     * | Chrome | Firefox |          Safari           |  Edge  | IE  |
     * | :----: | :-----: | :-----------------------: | :----: | :-: |
     * | **69** |  68-90  |         **14.1**          | **79** | No  |
     * |        |         | 11 _(scroll-snap-margin)_ |        |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-margin
     */
  scrollSnapMargin: PropFn<TSelf, CssValueOf<'scrollSnapMargin'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'scroll-timeline-name'> <'scroll-timeline-axis'>? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/scroll-timeline
     */
  scrollTimeline: PropFn<TSelf, CssValueOf<'scrollTimeline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-decoration
     */
  textDecoration: PropFn<TSelf, CssValueOf<'textDecoration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<'text-emphasis-style'> || <'text-emphasis-color'>`
     *
     * |  Chrome  | Firefox | Safari |   Edge   | IE  |
     * | :------: | :-----: | :----: | :------: | :-: |
     * |  **99**  | **46**  | **7**  |  **99**  | No  |
     * | 25 _-x-_ |         |        | 79 _-x-_ |     |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-emphasis
     */
  textEmphasis: PropFn<TSelf, CssValueOf<'textEmphasis'>>
  /**
     * Since March 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<'text-wrap-mode'> || <'text-wrap-style'>`
     *
     * **Initial value**: `wrap`
     *
     * | Chrome  | Firefox |  Safari  |  Edge   | IE  |
     * | :-----: | :-----: | :------: | :-----: | :-: |
     * | **114** | **121** | **17.4** | **114** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/text-wrap
     */
  textWrap: PropFn<TSelf, CssValueOf<'textWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE   |
     * | :-----: | :-----: | :-------: | :----: | :----: |
     * | **26**  | **16**  |   **9**   | **12** | **10** |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/transition
     */
  transition: PropFn<TSelf, CssValueOf<'transition'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <'view-timeline-name'> [ <'view-timeline-axis'> || <'view-timeline-inset'> ]? ]#`
     *
     * | Chrome  | Firefox | Safari |  Edge   | IE  |
     * | :-----: | :-----: | :----: | :-----: | :-: |
     * | **115** |   No    | **26** | **115** | No  |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/Reference/Properties/view-timeline
     */
  viewTimeline: PropFn<TSelf, CssValueOf<'viewTimeline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  MozAnimationDelay: PropFn<TSelf, CssValueOf<'MozAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     */
  MozAnimationDirection: PropFn<TSelf, CssValueOf<'MozAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     */
  MozAnimationDuration: PropFn<TSelf, CssValueOf<'MozAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     */
  MozAnimationFillMode: PropFn<TSelf, CssValueOf<'MozAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     */
  MozAnimationIterationCount: PropFn<TSelf, CssValueOf<'MozAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     */
  MozAnimationName: PropFn<TSelf, CssValueOf<'MozAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     */
  MozAnimationPlayState: PropFn<TSelf, CssValueOf<'MozAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  MozAnimationTimingFunction: PropFn<TSelf, CssValueOf<'MozAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized`
     *
     * **Initial value**: `none` (but this value is overridden in the user agent CSS)
     */
  MozAppearance: PropFn<TSelf, CssValueOf<'MozAppearance'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     */
  MozBackfaceVisibility: PropFn<TSelf, CssValueOf<'MozBackfaceVisibility'>>
  /**
     * **Syntax**: `<url> | none`
     *
     * **Initial value**: `none`
     */
  MozBinding: PropFn<TSelf, CssValueOf<'MozBinding'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderBottomColors: PropFn<TSelf, CssValueOf<'MozBorderBottomColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     */
  MozBorderEndColor: PropFn<TSelf, CssValueOf<'MozBorderEndColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     */
  MozBorderEndStyle: PropFn<TSelf, CssValueOf<'MozBorderEndStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-width'>`
     *
     * **Initial value**: `medium`
     */
  MozBorderEndWidth: PropFn<TSelf, CssValueOf<'MozBorderEndWidth'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderLeftColors: PropFn<TSelf, CssValueOf<'MozBorderLeftColors'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderRightColors: PropFn<TSelf, CssValueOf<'MozBorderRightColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-color'>`
     *
     * **Initial value**: `currentcolor`
     */
  MozBorderStartColor: PropFn<TSelf, CssValueOf<'MozBorderStartColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'border-top-style'>`
     *
     * **Initial value**: `none`
     */
  MozBorderStartStyle: PropFn<TSelf, CssValueOf<'MozBorderStartStyle'>>
  /**
     * **Syntax**: `<color>+ | none`
     *
     * **Initial value**: `none`
     */
  MozBorderTopColors: PropFn<TSelf, CssValueOf<'MozBorderTopColors'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `content-box | border-box`
     *
     * **Initial value**: `content-box`
     */
  MozBoxSizing: PropFn<TSelf, CssValueOf<'MozBoxSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  MozColumnRuleColor: PropFn<TSelf, CssValueOf<'MozColumnRuleColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  MozColumnRuleStyle: PropFn<TSelf, CssValueOf<'MozColumnRuleStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  MozColumnRuleWidth: PropFn<TSelf, CssValueOf<'MozColumnRuleWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2016.
     *
     * **Syntax**: `<length> | auto`
     *
     * **Initial value**: `auto`
     */
  MozColumnWidth: PropFn<TSelf, CssValueOf<'MozColumnWidth'>>
  /**
     * **Syntax**: `none | [ fill | fill-opacity | stroke | stroke-opacity ]#`
     *
     * **Initial value**: `none`
     */
  MozContextProperties: PropFn<TSelf, CssValueOf<'MozContextProperties'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     */
  MozFontFeatureSettings: PropFn<TSelf, CssValueOf<'MozFontFeatureSettings'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | <string>`
     *
     * **Initial value**: `normal`
     */
  MozFontLanguageOverride: PropFn<TSelf, CssValueOf<'MozFontLanguageOverride'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  MozHyphens: PropFn<TSelf, CssValueOf<'MozHyphens'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  MozMarginEnd: PropFn<TSelf, CssValueOf<'MozMarginEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  MozMarginStart: PropFn<TSelf, CssValueOf<'MozMarginStart'>>
  /**
     * The **`-moz-orient`** CSS property specifies the orientation of the element to which it's applied.
     *
     * **Syntax**: `inline | block | horizontal | vertical`
     *
     * **Initial value**: `inline`
     */
  MozOrient: PropFn<TSelf, CssValueOf<'MozOrient'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     */
  MozOsxFontSmoothing: PropFn<TSelf, CssValueOf<'MozOsxFontSmoothing'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusBottomleft: PropFn<TSelf, CssValueOf<'MozOutlineRadiusBottomleft'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusBottomright: PropFn<TSelf, CssValueOf<'MozOutlineRadiusBottomright'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusTopleft: PropFn<TSelf, CssValueOf<'MozOutlineRadiusTopleft'>>
  /**
     * **Syntax**: `<outline-radius>`
     *
     * **Initial value**: `0`
     */
  MozOutlineRadiusTopright: PropFn<TSelf, CssValueOf<'MozOutlineRadiusTopright'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  MozPaddingEnd: PropFn<TSelf, CssValueOf<'MozPaddingEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  MozPaddingStart: PropFn<TSelf, CssValueOf<'MozPaddingStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <length>`
     *
     * **Initial value**: `none`
     */
  MozPerspective: PropFn<TSelf, CssValueOf<'MozPerspective'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     */
  MozPerspectiveOrigin: PropFn<TSelf, CssValueOf<'MozPerspectiveOrigin'>>
  /**
     * **Syntax**: `ignore | stretch-to-fit`
     *
     * **Initial value**: `stretch-to-fit`
     */
  MozStackSizing: PropFn<TSelf, CssValueOf<'MozStackSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     */
  MozTabSize: PropFn<TSelf, CssValueOf<'MozTabSize'>>
  /**
     * **Syntax**: `none | blink`
     *
     * **Initial value**: `none`
     */
  MozTextBlink: PropFn<TSelf, CssValueOf<'MozTextBlink'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     */
  MozTextSizeAdjust: PropFn<TSelf, CssValueOf<'MozTextSizeAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  MozTransform: PropFn<TSelf, CssValueOf<'MozTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  MozTransformOrigin: PropFn<TSelf, CssValueOf<'MozTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     */
  MozTransformStyle: PropFn<TSelf, CssValueOf<'MozTransformStyle'>>
  /**
     * The **`user-modify`** property has no effect in Firefox. It was originally planned to determine whether or not the content of an element can be edited by a user.
     *
     * **Syntax**: `read-only | read-write | write-only`
     *
     * **Initial value**: `read-only`
     */
  MozUserModify: PropFn<TSelf, CssValueOf<'MozUserModify'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     */
  MozUserSelect: PropFn<TSelf, CssValueOf<'MozUserSelect'>>
  /**
     * **Syntax**: `drag | no-drag`
     *
     * **Initial value**: `drag`
     */
  MozWindowDragging: PropFn<TSelf, CssValueOf<'MozWindowDragging'>>
  /**
     * **Syntax**: `default | menu | tooltip | sheet | none`
     *
     * **Initial value**: `default`
     */
  MozWindowShadow: PropFn<TSelf, CssValueOf<'MozWindowShadow'>>
  /**
     * **Syntax**: `false | true`
     *
     * **Initial value**: `false`
     */
  msAccelerator: PropFn<TSelf, CssValueOf<'msAccelerator'>>
  /**
     * **Syntax**: `tb | rl | bt | lr`
     *
     * **Initial value**: `tb`
     */
  msBlockProgression: PropFn<TSelf, CssValueOf<'msBlockProgression'>>
  /**
     * **Syntax**: `none | chained`
     *
     * **Initial value**: `none`
     */
  msContentZoomChaining: PropFn<TSelf, CssValueOf<'msContentZoomChaining'>>
  /**
     * **Syntax**: `<percentage>`
     *
     * **Initial value**: `400%`
     */
  msContentZoomLimitMax: PropFn<TSelf, CssValueOf<'msContentZoomLimitMax'>>
  /**
     * **Syntax**: `<percentage>`
     *
     * **Initial value**: `100%`
     */
  msContentZoomLimitMin: PropFn<TSelf, CssValueOf<'msContentZoomLimitMin'>>
  /**
     * **Syntax**: `snapInterval( <percentage>, <percentage> ) | snapList( <percentage># )`
     *
     * **Initial value**: `snapInterval(0%, 100%)`
     */
  msContentZoomSnapPoints: PropFn<TSelf, CssValueOf<'msContentZoomSnapPoints'>>
  /**
     * **Syntax**: `none | proximity | mandatory`
     *
     * **Initial value**: `none`
     */
  msContentZoomSnapType: PropFn<TSelf, CssValueOf<'msContentZoomSnapType'>>
  /**
     * **Syntax**: `none | zoom`
     *
     * **Initial value**: zoom for the top level element, none for all other elements
     */
  msContentZooming: PropFn<TSelf, CssValueOf<'msContentZooming'>>
  /**
     * **Syntax**: `<string>`
     *
     * **Initial value**: "" (the empty string)
     */
  msFilter: PropFn<TSelf, CssValueOf<'msFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `row | row-reverse | column | column-reverse`
     *
     * **Initial value**: `row`
     */
  msFlexDirection: PropFn<TSelf, CssValueOf<'msFlexDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     */
  msFlexPositive: PropFn<TSelf, CssValueOf<'msFlexPositive'>>
  /**
     * **Syntax**: `[ none | <custom-ident> ]#`
     *
     * **Initial value**: `none`
     */
  msFlowFrom: PropFn<TSelf, CssValueOf<'msFlowFrom'>>
  /**
     * **Syntax**: `[ none | <custom-ident> ]#`
     *
     * **Initial value**: `none`
     */
  msFlowInto: PropFn<TSelf, CssValueOf<'msFlowInto'>>
  /**
     * **Syntax**: `none | <track-list> | <auto-track-list>`
     *
     * **Initial value**: `none`
     */
  msGridColumns: PropFn<TSelf, CssValueOf<'msGridColumns'>>
  /**
     * **Syntax**: `none | <track-list> | <auto-track-list>`
     *
     * **Initial value**: `none`
     */
  msGridRows: PropFn<TSelf, CssValueOf<'msGridRows'>>
  /**
     * **Syntax**: `auto | none`
     *
     * **Initial value**: `auto`
     */
  msHighContrastAdjust: PropFn<TSelf, CssValueOf<'msHighContrastAdjust'>>
  /**
     * **Syntax**: `auto | <integer>{1,3}`
     *
     * **Initial value**: `auto`
     */
  msHyphenateLimitChars: PropFn<TSelf, CssValueOf<'msHyphenateLimitChars'>>
  /**
     * **Syntax**: `no-limit | <integer>`
     *
     * **Initial value**: `no-limit`
     */
  msHyphenateLimitLines: PropFn<TSelf, CssValueOf<'msHyphenateLimitLines'>>
  /**
     * **Syntax**: `<percentage> | <length>`
     *
     * **Initial value**: `0`
     */
  msHyphenateLimitZone: PropFn<TSelf, CssValueOf<'msHyphenateLimitZone'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  msHyphens: PropFn<TSelf, CssValueOf<'msHyphens'>>
  /**
     * **Syntax**: `auto | after`
     *
     * **Initial value**: `auto`
     */
  msImeAlign: PropFn<TSelf, CssValueOf<'msImeAlign'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     */
  msLineBreak: PropFn<TSelf, CssValueOf<'msLineBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `0`
     */
  msOrder: PropFn<TSelf, CssValueOf<'msOrder'>>
  /**
     * **Syntax**: `auto | none | scrollbar | -ms-autohiding-scrollbar`
     *
     * **Initial value**: `auto`
     */
  msOverflowStyle: PropFn<TSelf, CssValueOf<'msOverflowStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     */
  msOverflowX: PropFn<TSelf, CssValueOf<'msOverflowX'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `visible | hidden | clip | scroll | auto`
     *
     * **Initial value**: `visible`
     */
  msOverflowY: PropFn<TSelf, CssValueOf<'msOverflowY'>>
  /**
     * **Syntax**: `chained | none`
     *
     * **Initial value**: `chained`
     */
  msScrollChaining: PropFn<TSelf, CssValueOf<'msScrollChaining'>>
  /**
     * **Syntax**: `auto | <length>`
     *
     * **Initial value**: `auto`
     */
  msScrollLimitXMax: PropFn<TSelf, CssValueOf<'msScrollLimitXMax'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msScrollLimitXMin: PropFn<TSelf, CssValueOf<'msScrollLimitXMin'>>
  /**
     * **Syntax**: `auto | <length>`
     *
     * **Initial value**: `auto`
     */
  msScrollLimitYMax: PropFn<TSelf, CssValueOf<'msScrollLimitYMax'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msScrollLimitYMin: PropFn<TSelf, CssValueOf<'msScrollLimitYMin'>>
  /**
     * **Syntax**: `none | railed`
     *
     * **Initial value**: `railed`
     */
  msScrollRails: PropFn<TSelf, CssValueOf<'msScrollRails'>>
  /**
     * **Syntax**: `snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )`
     *
     * **Initial value**: `snapInterval(0px, 100%)`
     */
  msScrollSnapPointsX: PropFn<TSelf, CssValueOf<'msScrollSnapPointsX'>>
  /**
     * **Syntax**: `snapInterval( <length-percentage>, <length-percentage> ) | snapList( <length-percentage># )`
     *
     * **Initial value**: `snapInterval(0px, 100%)`
     */
  msScrollSnapPointsY: PropFn<TSelf, CssValueOf<'msScrollSnapPointsY'>>
  /**
     * **Syntax**: `none | proximity | mandatory`
     *
     * **Initial value**: `none`
     */
  msScrollSnapType: PropFn<TSelf, CssValueOf<'msScrollSnapType'>>
  /**
     * **Syntax**: `none | vertical-to-horizontal`
     *
     * **Initial value**: `none`
     */
  msScrollTranslation: PropFn<TSelf, CssValueOf<'msScrollTranslation'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: depends on user agent
     */
  msScrollbar3dlightColor: PropFn<TSelf, CssValueOf<'msScrollbar3dlightColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ButtonText`
     */
  msScrollbarArrowColor: PropFn<TSelf, CssValueOf<'msScrollbarArrowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: depends on user agent
     */
  msScrollbarBaseColor: PropFn<TSelf, CssValueOf<'msScrollbarBaseColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDDarkShadow`
     */
  msScrollbarDarkshadowColor: PropFn<TSelf, CssValueOf<'msScrollbarDarkshadowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDFace`
     */
  msScrollbarFaceColor: PropFn<TSelf, CssValueOf<'msScrollbarFaceColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDHighlight`
     */
  msScrollbarHighlightColor: PropFn<TSelf, CssValueOf<'msScrollbarHighlightColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `ThreeDDarkShadow`
     */
  msScrollbarShadowColor: PropFn<TSelf, CssValueOf<'msScrollbarShadowColor'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `Scrollbar`
     */
  msScrollbarTrackColor: PropFn<TSelf, CssValueOf<'msScrollbarTrackColor'>>
  /**
     * **Syntax**: `none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space`
     *
     * **Initial value**: `none`
     */
  msTextAutospace: PropFn<TSelf, CssValueOf<'msTextAutospace'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     */
  msTextCombineHorizontal: PropFn<TSelf, CssValueOf<'msTextCombineHorizontal'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ clip | ellipsis | <string> ]{1,2}`
     *
     * **Initial value**: `clip`
     */
  msTextOverflow: PropFn<TSelf, CssValueOf<'msTextOverflow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2019.
     *
     * **Syntax**: `auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation`
     *
     * **Initial value**: `auto`
     */
  msTouchAction: PropFn<TSelf, CssValueOf<'msTouchAction'>>
  /**
     * **Syntax**: `grippers | none`
     *
     * **Initial value**: `grippers`
     */
  msTouchSelect: PropFn<TSelf, CssValueOf<'msTouchSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  msTransform: PropFn<TSelf, CssValueOf<'msTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  msTransformOrigin: PropFn<TSelf, CssValueOf<'msTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  msTransitionDelay: PropFn<TSelf, CssValueOf<'msTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  msTransitionDuration: PropFn<TSelf, CssValueOf<'msTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     */
  msTransitionProperty: PropFn<TSelf, CssValueOf<'msTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  msTransitionTimingFunction: PropFn<TSelf, CssValueOf<'msTransitionTimingFunction'>>
  /**
     * **Syntax**: `none | element | text`
     *
     * **Initial value**: `text`
     */
  msUserSelect: PropFn<TSelf, CssValueOf<'msUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `normal | break-all | keep-all | break-word | auto-phrase`
     *
     * **Initial value**: `normal`
     */
  msWordBreak: PropFn<TSelf, CssValueOf<'msWordBreak'>>
  /**
     * **Syntax**: `auto | both | start | end | maximum | clear`
     *
     * **Initial value**: `auto`
     */
  msWrapFlow: PropFn<TSelf, CssValueOf<'msWrapFlow'>>
  /**
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  msWrapMargin: PropFn<TSelf, CssValueOf<'msWrapMargin'>>
  /**
     * **Syntax**: `wrap | none`
     *
     * **Initial value**: `wrap`
     */
  msWrapThrough: PropFn<TSelf, CssValueOf<'msWrapThrough'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr`
     *
     * **Initial value**: `horizontal-tb`
     */
  msWritingMode: PropFn<TSelf, CssValueOf<'msWritingMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>`
     *
     * **Initial value**: `normal`
     */
  WebkitAlignContent: PropFn<TSelf, CssValueOf<'WebkitAlignContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ] | anchor-center`
     *
     * **Initial value**: `normal`
     */
  WebkitAlignItems: PropFn<TSelf, CssValueOf<'WebkitAlignItems'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position> | anchor-center`
     *
     * **Initial value**: `auto`
     */
  WebkitAlignSelf: PropFn<TSelf, CssValueOf<'WebkitAlignSelf'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitAnimationDelay: PropFn<TSelf, CssValueOf<'WebkitAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     */
  WebkitAnimationDirection: PropFn<TSelf, CssValueOf<'WebkitAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     */
  WebkitAnimationDuration: PropFn<TSelf, CssValueOf<'WebkitAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     */
  WebkitAnimationFillMode: PropFn<TSelf, CssValueOf<'WebkitAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     */
  WebkitAnimationIterationCount: PropFn<TSelf, CssValueOf<'WebkitAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     */
  WebkitAnimationName: PropFn<TSelf, CssValueOf<'WebkitAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     */
  WebkitAnimationPlayState: PropFn<TSelf, CssValueOf<'WebkitAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  WebkitAnimationTimingFunction: PropFn<TSelf, CssValueOf<'WebkitAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | button | button-bevel | caret | checkbox | default-button | inner-spin-button | listbox | listitem | media-controls-background | media-controls-fullscreen-background | media-current-time-display | media-enter-fullscreen-button | media-exit-fullscreen-button | media-fullscreen-button | media-mute-button | media-overlay-play-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | media-time-remaining-display | media-toggle-closed-captions-button | media-volume-slider | media-volume-slider-container | media-volume-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | meter | progress-bar | progress-bar-value | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield | -apple-pay-button`
     *
     * **Initial value**: `none` (but this value is overridden in the user agent CSS)
     */
  WebkitAppearance: PropFn<TSelf, CssValueOf<'WebkitAppearance'>>
  /**
     * Since September 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     */
  WebkitBackdropFilter: PropFn<TSelf, CssValueOf<'WebkitBackdropFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `visible | hidden`
     *
     * **Initial value**: `visible`
     */
  WebkitBackfaceVisibility: PropFn<TSelf, CssValueOf<'WebkitBackfaceVisibility'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-clip>#`
     *
     * **Initial value**: `border-box`
     */
  WebkitBackgroundClip: PropFn<TSelf, CssValueOf<'WebkitBackgroundClip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     */
  WebkitBackgroundOrigin: PropFn<TSelf, CssValueOf<'WebkitBackgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     */
  WebkitBackgroundSize: PropFn<TSelf, CssValueOf<'WebkitBackgroundSize'>>
  /**
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitBorderBeforeColor: PropFn<TSelf, CssValueOf<'WebkitBorderBeforeColor'>>
  /**
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  WebkitBorderBeforeStyle: PropFn<TSelf, CssValueOf<'WebkitBorderBeforeStyle'>>
  /**
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  WebkitBorderBeforeWidth: PropFn<TSelf, CssValueOf<'WebkitBorderBeforeWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderBottomLeftRadius: PropFn<TSelf, CssValueOf<'WebkitBorderBottomLeftRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderBottomRightRadius: PropFn<TSelf, CssValueOf<'WebkitBorderBottomRightRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ <number [0,∞]> | <percentage [0,∞]> ]{1,4}  && fill?`
     *
     * **Initial value**: `100%`
     */
  WebkitBorderImageSlice: PropFn<TSelf, CssValueOf<'WebkitBorderImageSlice'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderTopLeftRadius: PropFn<TSelf, CssValueOf<'WebkitBorderTopLeftRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     */
  WebkitBorderTopRightRadius: PropFn<TSelf, CssValueOf<'WebkitBorderTopRightRadius'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `slice | clone`
     *
     * **Initial value**: `slice`
     */
  WebkitBoxDecorationBreak: PropFn<TSelf, CssValueOf<'WebkitBoxDecorationBreak'>>
  /**
     * The **`-webkit-box-reflect`** CSS property lets you reflect the content of an element in one specific direction.
     *
     * **Syntax**: `[ above | below | right | left ]? <length>? <image>?`
     *
     * **Initial value**: `none`
     */
  WebkitBoxReflect: PropFn<TSelf, CssValueOf<'WebkitBoxReflect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow>#`
     *
     * **Initial value**: `none`
     */
  WebkitBoxShadow: PropFn<TSelf, CssValueOf<'WebkitBoxShadow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `content-box | border-box`
     *
     * **Initial value**: `content-box`
     */
  WebkitBoxSizing: PropFn<TSelf, CssValueOf<'WebkitBoxSizing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<clip-source> | [ <basic-shape> || <geometry-box> ] | none`
     *
     * **Initial value**: `none`
     */
  WebkitClipPath: PropFn<TSelf, CssValueOf<'WebkitClipPath'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<integer> | auto`
     *
     * **Initial value**: `auto`
     */
  WebkitColumnCount: PropFn<TSelf, CssValueOf<'WebkitColumnCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `auto | balance`
     *
     * **Initial value**: `balance`
     */
  WebkitColumnFill: PropFn<TSelf, CssValueOf<'WebkitColumnFill'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitColumnRuleColor: PropFn<TSelf, CssValueOf<'WebkitColumnRuleColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-style'>`
     *
     * **Initial value**: `none`
     */
  WebkitColumnRuleStyle: PropFn<TSelf, CssValueOf<'WebkitColumnRuleStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'border-width'>`
     *
     * **Initial value**: `medium`
     */
  WebkitColumnRuleWidth: PropFn<TSelf, CssValueOf<'WebkitColumnRuleWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `none | all`
     *
     * **Initial value**: `none`
     */
  WebkitColumnSpan: PropFn<TSelf, CssValueOf<'WebkitColumnSpan'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since November 2016.
     *
     * **Syntax**: `<length> | auto`
     *
     * **Initial value**: `auto`
     */
  WebkitColumnWidth: PropFn<TSelf, CssValueOf<'WebkitColumnWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `none | <filter-value-list>`
     *
     * **Initial value**: `none`
     */
  WebkitFilter: PropFn<TSelf, CssValueOf<'WebkitFilter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `content | <'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitFlexBasis: PropFn<TSelf, CssValueOf<'WebkitFlexBasis'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `row | row-reverse | column | column-reverse`
     *
     * **Initial value**: `row`
     */
  WebkitFlexDirection: PropFn<TSelf, CssValueOf<'WebkitFlexDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     */
  WebkitFlexGrow: PropFn<TSelf, CssValueOf<'WebkitFlexGrow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `1`
     */
  WebkitFlexShrink: PropFn<TSelf, CssValueOf<'WebkitFlexShrink'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `nowrap | wrap | wrap-reverse`
     *
     * **Initial value**: `nowrap`
     */
  WebkitFlexWrap: PropFn<TSelf, CssValueOf<'WebkitFlexWrap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `normal | <feature-tag-value>#`
     *
     * **Initial value**: `normal`
     */
  WebkitFontFeatureSettings: PropFn<TSelf, CssValueOf<'WebkitFontFeatureSettings'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `auto | normal | none`
     *
     * **Initial value**: `auto`
     */
  WebkitFontKerning: PropFn<TSelf, CssValueOf<'WebkitFontKerning'>>
  /**
     * The **`font-smooth`** CSS property controls the application of anti-aliasing when fonts are rendered.
     *
     * **Syntax**: `auto | never | always | <absolute-size> | <length>`
     *
     * **Initial value**: `auto`
     */
  WebkitFontSmoothing: PropFn<TSelf, CssValueOf<'WebkitFontSmoothing'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]`
     *
     * **Initial value**: `normal`
     */
  WebkitFontVariantLigatures: PropFn<TSelf, CssValueOf<'WebkitFontVariantLigatures'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `auto | <string>`
     *
     * **Initial value**: `auto`
     */
  WebkitHyphenateCharacter: PropFn<TSelf, CssValueOf<'WebkitHyphenateCharacter'>>
  /**
     * Since September 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `none | manual | auto`
     *
     * **Initial value**: `manual`
     */
  WebkitHyphens: PropFn<TSelf, CssValueOf<'WebkitHyphens'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `normal | [ <number> <integer>? ]`
     *
     * **Initial value**: `normal`
     */
  WebkitInitialLetter: PropFn<TSelf, CssValueOf<'WebkitInitialLetter'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]`
     *
     * **Initial value**: `normal`
     */
  WebkitJustifyContent: PropFn<TSelf, CssValueOf<'WebkitJustifyContent'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     */
  WebkitLineBreak: PropFn<TSelf, CssValueOf<'WebkitLineBreak'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <integer>`
     *
     * **Initial value**: `none`
     */
  WebkitLineClamp: PropFn<TSelf, CssValueOf<'WebkitLineClamp'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitLogicalHeight: PropFn<TSelf, CssValueOf<'WebkitLogicalHeight'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'width'>`
     *
     * **Initial value**: `auto`
     */
  WebkitLogicalWidth: PropFn<TSelf, CssValueOf<'WebkitLogicalWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitMarginEnd: PropFn<TSelf, CssValueOf<'WebkitMarginEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'margin-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitMarginStart: PropFn<TSelf, CssValueOf<'WebkitMarginStart'>>
  /**
     * **Syntax**: `<attachment>#`
     *
     * **Initial value**: `scroll`
     */
  WebkitMaskAttachment: PropFn<TSelf, CssValueOf<'WebkitMaskAttachment'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length> | <number> ]{1,4}`
     *
     * **Initial value**: `0`
     */
  WebkitMaskBoxImageOutset: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImageOutset'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ stretch | repeat | round | space ]{1,2}`
     *
     * **Initial value**: `stretch`
     */
  WebkitMaskBoxImageRepeat: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImageRepeat'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<number-percentage>{1,4} fill?`
     *
     * **Initial value**: `0`
     */
  WebkitMaskBoxImageSlice: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImageSlice'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <image>`
     *
     * **Initial value**: `none`
     */
  WebkitMaskBoxImageSource: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImageSource'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `[ <length-percentage> | <number> | auto ]{1,4}`
     *
     * **Initial value**: `auto`
     */
  WebkitMaskBoxImageWidth: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImageWidth'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <coord-box> | no-clip | border | padding | content | text ]#`
     *
     * **Initial value**: `border`
     */
  WebkitMaskClip: PropFn<TSelf, CssValueOf<'WebkitMaskClip'>>
  /**
     * The **`-webkit-mask-composite`** property specifies the manner in which multiple mask images applied to the same element are composited with one another. Mask images are composited in the opposite order that they are declared with the `-webkit-mask-image` property.
     *
     * **Syntax**: `<composite-style>#`
     *
     * **Initial value**: `source-over`
     */
  WebkitMaskComposite: PropFn<TSelf, CssValueOf<'WebkitMaskComposite'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<mask-reference>#`
     *
     * **Initial value**: `none`
     */
  WebkitMaskImage: PropFn<TSelf, CssValueOf<'WebkitMaskImage'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <coord-box> | border | padding | content ]#`
     *
     * **Initial value**: `padding`
     */
  WebkitMaskOrigin: PropFn<TSelf, CssValueOf<'WebkitMaskOrigin'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<position>#`
     *
     * **Initial value**: `0% 0%`
     */
  WebkitMaskPosition: PropFn<TSelf, CssValueOf<'WebkitMaskPosition'>>
  /**
     * The `-webkit-mask-position-x` CSS property sets the initial horizontal position of a mask image.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right ]#`
     *
     * **Initial value**: `0%`
     */
  WebkitMaskPositionX: PropFn<TSelf, CssValueOf<'WebkitMaskPositionX'>>
  /**
     * The `-webkit-mask-position-y` CSS property sets the initial vertical position of a mask image.
     *
     * **Syntax**: `[ <length-percentage> | top | center | bottom ]#`
     *
     * **Initial value**: `0%`
     */
  WebkitMaskPositionY: PropFn<TSelf, CssValueOf<'WebkitMaskPositionY'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<repeat-style>#`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeat: PropFn<TSelf, CssValueOf<'WebkitMaskRepeat'>>
  /**
     * The `-webkit-mask-repeat-x` property specifies whether and how a mask image is repeated (tiled) horizontally.
     *
     * **Syntax**: `repeat | no-repeat | space | round`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeatX: PropFn<TSelf, CssValueOf<'WebkitMaskRepeatX'>>
  /**
     * The `-webkit-mask-repeat-y` property sets whether and how a mask image is repeated (tiled) vertically.
     *
     * **Syntax**: `repeat | no-repeat | space | round`
     *
     * **Initial value**: `repeat`
     */
  WebkitMaskRepeatY: PropFn<TSelf, CssValueOf<'WebkitMaskRepeatY'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     */
  WebkitMaskSize: PropFn<TSelf, CssValueOf<'WebkitMaskSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'max-width'>`
     *
     * **Initial value**: `none`
     */
  WebkitMaxInlineSize: PropFn<TSelf, CssValueOf<'WebkitMaxInlineSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `0`
     */
  WebkitOrder: PropFn<TSelf, CssValueOf<'WebkitOrder'>>
  /**
     * **Syntax**: `auto | touch`
     *
     * **Initial value**: `auto`
     */
  WebkitOverflowScrolling: PropFn<TSelf, CssValueOf<'WebkitOverflowScrolling'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitPaddingEnd: PropFn<TSelf, CssValueOf<'WebkitPaddingEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<'padding-top'>`
     *
     * **Initial value**: `0`
     */
  WebkitPaddingStart: PropFn<TSelf, CssValueOf<'WebkitPaddingStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <length>`
     *
     * **Initial value**: `none`
     */
  WebkitPerspective: PropFn<TSelf, CssValueOf<'WebkitPerspective'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     */
  WebkitPerspectiveOrigin: PropFn<TSelf, CssValueOf<'WebkitPerspectiveOrigin'>>
  /**
     * Since May 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `economy | exact`
     *
     * **Initial value**: `economy`
     */
  WebkitPrintColorAdjust: PropFn<TSelf, CssValueOf<'WebkitPrintColorAdjust'>>
  /**
     * Since December 2024, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ alternate || [ over | under ] ] | inter-character`
     *
     * **Initial value**: `alternate`
     */
  WebkitRubyPosition: PropFn<TSelf, CssValueOf<'WebkitRubyPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2022.
     *
     * **Syntax**: `none | [ x | y | block | inline | both ] [ mandatory | proximity ]?`
     *
     * **Initial value**: `none`
     */
  WebkitScrollSnapType: PropFn<TSelf, CssValueOf<'WebkitScrollSnapType'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     */
  WebkitShapeMargin: PropFn<TSelf, CssValueOf<'WebkitShapeMargin'>>
  /**
     * **`-webkit-tap-highlight-color`** is a non-standard CSS property that sets the color of the highlight that appears over a link while it's being tapped. The highlighting indicates to the user that their tap is being successfully recognized, and indicates which element they're tapping on.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `black`
     */
  WebkitTapHighlightColor: PropFn<TSelf, CssValueOf<'WebkitTapHighlightColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | all | [ digits <integer>? ]`
     *
     * **Initial value**: `none`
     */
  WebkitTextCombine: PropFn<TSelf, CssValueOf<'WebkitTextCombine'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextDecorationColor: PropFn<TSelf, CssValueOf<'WebkitTextDecorationColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error`
     *
     * **Initial value**: `none`
     */
  WebkitTextDecorationLine: PropFn<TSelf, CssValueOf<'WebkitTextDecorationLine'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]`
     *
     * **Initial value**: `objects`
     */
  WebkitTextDecorationSkip: PropFn<TSelf, CssValueOf<'WebkitTextDecorationSkip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `solid | double | dotted | dashed | wavy`
     *
     * **Initial value**: `solid`
     */
  WebkitTextDecorationStyle: PropFn<TSelf, CssValueOf<'WebkitTextDecorationStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextEmphasisColor: PropFn<TSelf, CssValueOf<'WebkitTextEmphasisColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `auto | [ over | under ] && [ right | left ]?`
     *
     * **Initial value**: `auto`
     */
  WebkitTextEmphasisPosition: PropFn<TSelf, CssValueOf<'WebkitTextEmphasisPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>`
     *
     * **Initial value**: `none`
     */
  WebkitTextEmphasisStyle: PropFn<TSelf, CssValueOf<'WebkitTextEmphasisStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2016.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextFillColor: PropFn<TSelf, CssValueOf<'WebkitTextFillColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2020.
     *
     * **Syntax**: `mixed | upright | sideways`
     *
     * **Initial value**: `mixed`
     */
  WebkitTextOrientation: PropFn<TSelf, CssValueOf<'WebkitTextOrientation'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | auto | <percentage>`
     *
     * **Initial value**: `auto` for smartphone browsers supporting inflation, `none` in other cases (and then not modifiable).
     */
  WebkitTextSizeAdjust: PropFn<TSelf, CssValueOf<'WebkitTextSizeAdjust'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     */
  WebkitTextStrokeColor: PropFn<TSelf, CssValueOf<'WebkitTextStrokeColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length>`
     *
     * **Initial value**: `0`
     */
  WebkitTextStrokeWidth: PropFn<TSelf, CssValueOf<'WebkitTextStrokeWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | from-font | [ under || [ left | right ] ]`
     *
     * **Initial value**: `auto`
     */
  WebkitTextUnderlinePosition: PropFn<TSelf, CssValueOf<'WebkitTextUnderlinePosition'>>
  /**
     * The `-webkit-touch-callout` CSS property controls the display of the default callout shown when you touch and hold a touch target.
     *
     * **Syntax**: `default | none`
     *
     * **Initial value**: `default`
     */
  WebkitTouchCallout: PropFn<TSelf, CssValueOf<'WebkitTouchCallout'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     */
  WebkitTransform: PropFn<TSelf, CssValueOf<'WebkitTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     */
  WebkitTransformOrigin: PropFn<TSelf, CssValueOf<'WebkitTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `flat | preserve-3d`
     *
     * **Initial value**: `flat`
     */
  WebkitTransformStyle: PropFn<TSelf, CssValueOf<'WebkitTransformStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitTransitionDelay: PropFn<TSelf, CssValueOf<'WebkitTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     */
  WebkitTransitionDuration: PropFn<TSelf, CssValueOf<'WebkitTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     */
  WebkitTransitionProperty: PropFn<TSelf, CssValueOf<'WebkitTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     */
  WebkitTransitionTimingFunction: PropFn<TSelf, CssValueOf<'WebkitTransitionTimingFunction'>>
  /**
     * **Syntax**: `read-only | read-write | read-write-plaintext-only`
     *
     * **Initial value**: `read-only`
     */
  WebkitUserModify: PropFn<TSelf, CssValueOf<'WebkitUserModify'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     */
  WebkitUserSelect: PropFn<TSelf, CssValueOf<'WebkitUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr`
     *
     * **Initial value**: `horizontal-tb`
     */
  WebkitWritingMode: PropFn<TSelf, CssValueOf<'WebkitWritingMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     */
  MozAnimation: PropFn<TSelf, CssValueOf<'MozAnimation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     */
  MozBorderImage: PropFn<TSelf, CssValueOf<'MozBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     */
  MozColumnRule: PropFn<TSelf, CssValueOf<'MozColumnRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-width'> || <'column-count'>`
     */
  MozColumns: PropFn<TSelf, CssValueOf<'MozColumns'>>
  /** **Syntax**: `<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?` */
  MozOutlineRadius: PropFn<TSelf, CssValueOf<'MozOutlineRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  MozTransition: PropFn<TSelf, CssValueOf<'MozTransition'>>
  /** **Syntax**: `<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>` */
  msContentZoomLimit: PropFn<TSelf, CssValueOf<'msContentZoomLimit'>>
  /** **Syntax**: `<'-ms-content-zoom-snap-type'> || <'-ms-content-zoom-snap-points'>` */
  msContentZoomSnap: PropFn<TSelf, CssValueOf<'msContentZoomSnap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     */
  msFlex: PropFn<TSelf, CssValueOf<'msFlex'>>
  /** **Syntax**: `<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>` */
  msScrollLimit: PropFn<TSelf, CssValueOf<'msScrollLimit'>>
  /** **Syntax**: `<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>` */
  msScrollSnapX: PropFn<TSelf, CssValueOf<'msScrollSnapX'>>
  /** **Syntax**: `<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>` */
  msScrollSnapY: PropFn<TSelf, CssValueOf<'msScrollSnapY'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  msTransition: PropFn<TSelf, CssValueOf<'msTransition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     */
  WebkitAnimation: PropFn<TSelf, CssValueOf<'WebkitAnimation'>>
  /**
     * The **`-webkit-border-before`** CSS property is a shorthand property for setting the individual logical block start border property values in a single place in the style sheet.
     *
     * **Syntax**: `<'border-width'> || <'border-style'> || <color>`
     */
  WebkitBorderBefore: PropFn<TSelf, CssValueOf<'WebkitBorderBefore'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     */
  WebkitBorderImage: PropFn<TSelf, CssValueOf<'WebkitBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?`
     */
  WebkitBorderRadius: PropFn<TSelf, CssValueOf<'WebkitBorderRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>`
     */
  WebkitColumnRule: PropFn<TSelf, CssValueOf<'WebkitColumnRule'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<'column-width'> || <'column-count'>`
     */
  WebkitColumns: PropFn<TSelf, CssValueOf<'WebkitColumns'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]`
     */
  WebkitFlex: PropFn<TSelf, CssValueOf<'WebkitFlex'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<'flex-direction'> || <'flex-wrap'>`
     */
  WebkitFlexFlow: PropFn<TSelf, CssValueOf<'WebkitFlexFlow'>>
  /**
     * Since December 2023, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers.
     *
     * **Syntax**: `[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <visual-box> | border | padding | content | text ] || [ <visual-box> | border | padding | content ] ]#`
     */
  WebkitMask: PropFn<TSelf, CssValueOf<'WebkitMask'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>`
     */
  WebkitMaskBoxImage: PropFn<TSelf, CssValueOf<'WebkitMaskBoxImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2022.
     *
     * **Syntax**: `<'text-emphasis-style'> || <'text-emphasis-color'>`
     */
  WebkitTextEmphasis: PropFn<TSelf, CssValueOf<'WebkitTextEmphasis'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2017.
     *
     * **Syntax**: `<length> || <color>`
     */
  WebkitTextStroke: PropFn<TSelf, CssValueOf<'WebkitTextStroke'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     */
  WebkitTransition: PropFn<TSelf, CssValueOf<'WebkitTransition'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  boxAlign: PropFn<TSelf, CssValueOf<'boxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  boxDirection: PropFn<TSelf, CssValueOf<'boxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  boxFlex: PropFn<TSelf, CssValueOf<'boxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  boxFlexGroup: PropFn<TSelf, CssValueOf<'boxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  boxLines: PropFn<TSelf, CssValueOf<'boxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  boxOrdinalGroup: PropFn<TSelf, CssValueOf<'boxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  boxOrient: PropFn<TSelf, CssValueOf<'boxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  boxPack: PropFn<TSelf, CssValueOf<'boxPack'>>
  /**
     * The **`clip`** CSS property defines a visible portion of an element. The `clip` property applies only to absolutely positioned elements — that is, elements with `position:absolute` or `position:fixed`.
     *
     * **Syntax**: `<shape> | auto`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  clip: PropFn<TSelf, CssValueOf<'clip'>>
  /**
     * The **`font-stretch`** CSS property selects a normal, condensed, or expanded face from a font.
     *
     * **Syntax**: `<font-stretch-absolute>`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  fontStretch: PropFn<TSelf, CssValueOf<'fontStretch'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  gridColumnGap: PropFn<TSelf, CssValueOf<'gridColumnGap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<'grid-row-gap'> <'grid-column-gap'>?`
     *
     * @deprecated
     */
  gridGap: PropFn<TSelf, CssValueOf<'gridGap'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.
     *
     * **Syntax**: `<length-percentage>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  gridRowGap: PropFn<TSelf, CssValueOf<'gridRowGap'>>
  /**
     * **Syntax**: `auto | normal | active | inactive | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  imeMode: PropFn<TSelf, CssValueOf<'imeMode'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | <position-area>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  insetArea: PropFn<TSelf, CssValueOf<'insetArea'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * @deprecated
     */
  offsetBlock: PropFn<TSelf, CssValueOf<'offsetBlock'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetBlockEnd: PropFn<TSelf, CssValueOf<'offsetBlockEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetBlockStart: PropFn<TSelf, CssValueOf<'offsetBlockStart'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>{1,2}`
     *
     * @deprecated
     */
  offsetInline: PropFn<TSelf, CssValueOf<'offsetInline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetInlineEnd: PropFn<TSelf, CssValueOf<'offsetInlineEnd'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since April 2021.
     *
     * **Syntax**: `<'top'>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  offsetInlineStart: PropFn<TSelf, CssValueOf<'offsetInlineStart'>>
  /**
     * The **`page-break-after`** CSS property adjusts page breaks _after_ the current element.
     *
     * **Syntax**: `auto | always | avoid | left | right | recto | verso`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakAfter: PropFn<TSelf, CssValueOf<'pageBreakAfter'>>
  /**
     * The **`page-break-before`** CSS property adjusts page breaks _before_ the current element.
     *
     * **Syntax**: `auto | always | avoid | left | right | recto | verso`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakBefore: PropFn<TSelf, CssValueOf<'pageBreakBefore'>>
  /**
     * The **`page-break-inside`** CSS property adjusts page breaks _inside_ the current element.
     *
     * **Syntax**: `auto | avoid`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  pageBreakInside: PropFn<TSelf, CssValueOf<'pageBreakInside'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `none | [ [<dashed-ident> || <try-tactic>] | <'position-area'> ]#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  positionTryOptions: PropFn<TSelf, CssValueOf<'positionTryOptions'>>
  /**
     * **Syntax**: `none | <position>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapCoordinate: PropFn<TSelf, CssValueOf<'scrollSnapCoordinate'>>
  /**
     * **Syntax**: `<position>`
     *
     * **Initial value**: `0px 0px`
     *
     * @deprecated
     */
  scrollSnapDestination: PropFn<TSelf, CssValueOf<'scrollSnapDestination'>>
  /**
     * **Syntax**: `none | repeat( <length-percentage> )`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapPointsX: PropFn<TSelf, CssValueOf<'scrollSnapPointsX'>>
  /**
     * **Syntax**: `none | repeat( <length-percentage> )`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapPointsY: PropFn<TSelf, CssValueOf<'scrollSnapPointsY'>>
  /**
     * **Syntax**: `none | mandatory | proximity`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapTypeX: PropFn<TSelf, CssValueOf<'scrollSnapTypeX'>>
  /**
     * **Syntax**: `none | mandatory | proximity`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  scrollSnapTypeY: PropFn<TSelf, CssValueOf<'scrollSnapTypeY'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  KhtmlBoxAlign: PropFn<TSelf, CssValueOf<'KhtmlBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  KhtmlBoxDirection: PropFn<TSelf, CssValueOf<'KhtmlBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  KhtmlBoxFlex: PropFn<TSelf, CssValueOf<'KhtmlBoxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlBoxFlexGroup: PropFn<TSelf, CssValueOf<'KhtmlBoxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  KhtmlBoxLines: PropFn<TSelf, CssValueOf<'KhtmlBoxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlBoxOrdinalGroup: PropFn<TSelf, CssValueOf<'KhtmlBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  KhtmlBoxOrient: PropFn<TSelf, CssValueOf<'KhtmlBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  KhtmlBoxPack: PropFn<TSelf, CssValueOf<'KhtmlBoxPack'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2020.
     *
     * **Syntax**: `auto | loose | normal | strict | anywhere`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  KhtmlLineBreak: PropFn<TSelf, CssValueOf<'KhtmlLineBreak'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  KhtmlOpacity: PropFn<TSelf, CssValueOf<'KhtmlOpacity'>>
  /**
     * This feature is not Baseline because it does not work in some of the most widely-used browsers.
     *
     * **Syntax**: `auto | text | none | all`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  KhtmlUserSelect: PropFn<TSelf, CssValueOf<'KhtmlUserSelect'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-clip>#`
     *
     * **Initial value**: `border-box`
     *
     * @deprecated
     */
  MozBackgroundClip: PropFn<TSelf, CssValueOf<'MozBackgroundClip'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<visual-box>#`
     *
     * **Initial value**: `padding-box`
     *
     * @deprecated
     */
  MozBackgroundOrigin: PropFn<TSelf, CssValueOf<'MozBackgroundOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     *
     * @deprecated
     */
  MozBackgroundSize: PropFn<TSelf, CssValueOf<'MozBackgroundSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]?`
     *
     * @deprecated
     */
  MozBorderRadius: PropFn<TSelf, CssValueOf<'MozBorderRadius'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusBottomleft: PropFn<TSelf, CssValueOf<'MozBorderRadiusBottomleft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusBottomright: PropFn<TSelf, CssValueOf<'MozBorderRadiusBottomright'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusTopleft: PropFn<TSelf, CssValueOf<'MozBorderRadiusTopleft'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<length-percentage [0,∞]>{1,2}`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBorderRadiusTopright: PropFn<TSelf, CssValueOf<'MozBorderRadiusTopright'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  MozBoxAlign: PropFn<TSelf, CssValueOf<'MozBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  MozBoxDirection: PropFn<TSelf, CssValueOf<'MozBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozBoxFlex: PropFn<TSelf, CssValueOf<'MozBoxFlex'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  MozBoxOrdinalGroup: PropFn<TSelf, CssValueOf<'MozBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  MozBoxOrient: PropFn<TSelf, CssValueOf<'MozBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  MozBoxPack: PropFn<TSelf, CssValueOf<'MozBoxPack'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `none | <shadow>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozBoxShadow: PropFn<TSelf, CssValueOf<'MozBoxShadow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `<integer> | auto`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozColumnCount: PropFn<TSelf, CssValueOf<'MozColumnCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2017.
     *
     * **Syntax**: `auto | balance`
     *
     * **Initial value**: `balance`
     *
     * @deprecated
     */
  MozColumnFill: PropFn<TSelf, CssValueOf<'MozColumnFill'>>
  /**
     * The non-standard **`-moz-float-edge`** CSS property specifies whether the height and width properties of the element include the margin, border, or padding thickness.
     *
     * **Syntax**: `border-box | content-box | margin-box | padding-box`
     *
     * **Initial value**: `content-box`
     *
     * @deprecated
     */
  MozFloatEdge: PropFn<TSelf, CssValueOf<'MozFloatEdge'>>
  /**
     * The **`-moz-force-broken-image-icon`** extended CSS property can be used to force the broken image icon to be shown even when a broken image has an `alt` attribute.
     *
     * **Syntax**: `0 | 1`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  MozForceBrokenImageIcon: PropFn<TSelf, CssValueOf<'MozForceBrokenImageIcon'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<opacity-value>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  MozOpacity: PropFn<TSelf, CssValueOf<'MozOpacity'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since March 2023.
     *
     * **Syntax**: `<'outline-width'> || <'outline-style'> || <'outline-color'>`
     *
     * @deprecated
     */
  MozOutline: PropFn<TSelf, CssValueOf<'MozOutline'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <color>`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozOutlineColor: PropFn<TSelf, CssValueOf<'MozOutlineColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `auto | <outline-line-style>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozOutlineStyle: PropFn<TSelf, CssValueOf<'MozOutlineStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<line-width>`
     *
     * **Initial value**: `medium`
     *
     * @deprecated
     */
  MozOutlineWidth: PropFn<TSelf, CssValueOf<'MozOutlineWidth'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2022.
     *
     * **Syntax**: `auto | start | end | left | right | center | justify`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozTextAlignLast: PropFn<TSelf, CssValueOf<'MozTextAlignLast'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `currentcolor`
     *
     * @deprecated
     */
  MozTextDecorationColor: PropFn<TSelf, CssValueOf<'MozTextDecorationColor'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozTextDecorationLine: PropFn<TSelf, CssValueOf<'MozTextDecorationLine'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `solid | double | dotted | dashed | wavy`
     *
     * **Initial value**: `solid`
     *
     * @deprecated
     */
  MozTextDecorationStyle: PropFn<TSelf, CssValueOf<'MozTextDecorationStyle'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  MozTransitionDelay: PropFn<TSelf, CssValueOf<'MozTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  MozTransitionDuration: PropFn<TSelf, CssValueOf<'MozTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     *
     * @deprecated
     */
  MozTransitionProperty: PropFn<TSelf, CssValueOf<'MozTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  MozTransitionTimingFunction: PropFn<TSelf, CssValueOf<'MozTransitionTimingFunction'>>
  /**
     * The **`-moz-user-focus`** CSS property is used to indicate whether an element can have the focus.
     *
     * **Syntax**: `ignore | normal | select-after | select-before | select-menu | select-same | select-all | none`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  MozUserFocus: PropFn<TSelf, CssValueOf<'MozUserFocus'>>
  /**
     * In Mozilla applications, **`-moz-user-input`** determines if an element will accept user input.
     *
     * **Syntax**: `auto | none | enabled | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  MozUserInput: PropFn<TSelf, CssValueOf<'MozUserInput'>>
  /**
     * **Syntax**: `auto | normal | active | inactive | disabled`
     *
     * **Initial value**: `auto`
     *
     * @deprecated
     */
  msImeMode: PropFn<TSelf, CssValueOf<'msImeMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation>#`
     *
     * @deprecated
     */
  OAnimation: PropFn<TSelf, CssValueOf<'OAnimation'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OAnimationDelay: PropFn<TSelf, CssValueOf<'OAnimationDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-direction>#`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  OAnimationDirection: PropFn<TSelf, CssValueOf<'OAnimationDirection'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ auto | <time [0s,∞]> ]#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OAnimationDuration: PropFn<TSelf, CssValueOf<'OAnimationDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-fill-mode>#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OAnimationFillMode: PropFn<TSelf, CssValueOf<'OAnimationFillMode'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-iteration-count>#`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  OAnimationIterationCount: PropFn<TSelf, CssValueOf<'OAnimationIterationCount'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ none | <keyframes-name> ]#`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OAnimationName: PropFn<TSelf, CssValueOf<'OAnimationName'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-animation-play-state>#`
     *
     * **Initial value**: `running`
     *
     * @deprecated
     */
  OAnimationPlayState: PropFn<TSelf, CssValueOf<'OAnimationPlayState'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  OAnimationTimingFunction: PropFn<TSelf, CssValueOf<'OAnimationTimingFunction'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<bg-size>#`
     *
     * **Initial value**: `auto auto`
     *
     * @deprecated
     */
  OBackgroundSize: PropFn<TSelf, CssValueOf<'OBackgroundSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>`
     *
     * @deprecated
     */
  OBorderImage: PropFn<TSelf, CssValueOf<'OBorderImage'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `fill | contain | cover | none | scale-down`
     *
     * **Initial value**: `fill`
     *
     * @deprecated
     */
  OObjectFit: PropFn<TSelf, CssValueOf<'OObjectFit'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since January 2020.
     *
     * **Syntax**: `<position>`
     *
     * **Initial value**: `50% 50%`
     *
     * @deprecated
     */
  OObjectPosition: PropFn<TSelf, CssValueOf<'OObjectPosition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since August 2021.
     *
     * **Syntax**: `<integer> | <length>`
     *
     * **Initial value**: `8`
     *
     * @deprecated
     */
  OTabSize: PropFn<TSelf, CssValueOf<'OTabSize'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.
     *
     * **Syntax**: `[ clip | ellipsis | <string> ]{1,2}`
     *
     * **Initial value**: `clip`
     *
     * @deprecated
     */
  OTextOverflow: PropFn<TSelf, CssValueOf<'OTextOverflow'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     *
     * @deprecated
     */
  OTransform: PropFn<TSelf, CssValueOf<'OTransform'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?`
     *
     * **Initial value**: `50% 50% 0`
     *
     * @deprecated
     */
  OTransformOrigin: PropFn<TSelf, CssValueOf<'OTransformOrigin'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<single-transition>#`
     *
     * @deprecated
     */
  OTransition: PropFn<TSelf, CssValueOf<'OTransition'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OTransitionDelay: PropFn<TSelf, CssValueOf<'OTransitionDelay'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<time>#`
     *
     * **Initial value**: `0s`
     *
     * @deprecated
     */
  OTransitionDuration: PropFn<TSelf, CssValueOf<'OTransitionDuration'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `none | <single-transition-property>#`
     *
     * **Initial value**: all
     *
     * @deprecated
     */
  OTransitionProperty: PropFn<TSelf, CssValueOf<'OTransitionProperty'>>
  /**
     * This feature is well established and works across many devices and browser versions. It’s been available across browsers since September 2015.
     *
     * **Syntax**: `<easing-function>#`
     *
     * **Initial value**: `ease`
     *
     * @deprecated
     */
  OTransitionTimingFunction: PropFn<TSelf, CssValueOf<'OTransitionTimingFunction'>>
  /**
     * The **`box-align`** CSS property specifies how an element aligns its contents across its layout in a perpendicular direction. The effect of the property is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | baseline | stretch`
     *
     * **Initial value**: `stretch`
     *
     * @deprecated
     */
  WebkitBoxAlign: PropFn<TSelf, CssValueOf<'WebkitBoxAlign'>>
  /**
     * The **`box-direction`** CSS property specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).
     *
     * **Syntax**: `normal | reverse | inherit`
     *
     * **Initial value**: `normal`
     *
     * @deprecated
     */
  WebkitBoxDirection: PropFn<TSelf, CssValueOf<'WebkitBoxDirection'>>
  /**
     * The **`-moz-box-flex`** and **`-webkit-box-flex`** CSS properties specify how a `-moz-box` or `-webkit-box` grows to fill the box that contains it, in the direction of the containing box's layout.
     *
     * **Syntax**: `<number>`
     *
     * **Initial value**: `0`
     *
     * @deprecated
     */
  WebkitBoxFlex: PropFn<TSelf, CssValueOf<'WebkitBoxFlex'>>
  /**
     * The **`box-flex-group`** CSS property assigns the flexbox's child elements to a flex group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  WebkitBoxFlexGroup: PropFn<TSelf, CssValueOf<'WebkitBoxFlexGroup'>>
  /**
     * The **`box-lines`** CSS property determines whether the box may have a single or multiple lines (rows for horizontally oriented boxes, columns for vertically oriented boxes).
     *
     * **Syntax**: `single | multiple`
     *
     * **Initial value**: `single`
     *
     * @deprecated
     */
  WebkitBoxLines: PropFn<TSelf, CssValueOf<'WebkitBoxLines'>>
  /**
     * The **`box-ordinal-group`** CSS property assigns the flexbox's child elements to an ordinal group.
     *
     * **Syntax**: `<integer>`
     *
     * **Initial value**: `1`
     *
     * @deprecated
     */
  WebkitBoxOrdinalGroup: PropFn<TSelf, CssValueOf<'WebkitBoxOrdinalGroup'>>
  /**
     * The **`box-orient`** CSS property sets whether an element lays out its contents horizontally or vertically.
     *
     * **Syntax**: `horizontal | vertical | inline-axis | block-axis | inherit`
     *
     * **Initial value**: `inline-axis`
     *
     * @deprecated
     */
  WebkitBoxOrient: PropFn<TSelf, CssValueOf<'WebkitBoxOrient'>>
  /**
     * The **`-moz-box-pack`** and **`-webkit-box-pack`** CSS properties specify how a `-moz-box` or `-webkit-box` packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.
     *
     * **Syntax**: `start | center | end | justify`
     *
     * **Initial value**: `start`
     *
     * @deprecated
     */
  WebkitBoxPack: PropFn<TSelf, CssValueOf<'WebkitBoxPack'>>
  colorInterpolation: PropFn<TSelf, CssValueOf<'colorInterpolation'>>
  colorRendering: PropFn<TSelf, CssValueOf<'colorRendering'>>
  glyphOrientationVertical: PropFn<TSelf, CssValueOf<'glyphOrientationVertical'>>
}
