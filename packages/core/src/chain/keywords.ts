/**
 * 内建支持的 CSS 关键字（无 `_` 前缀）。
 *
 * 用户访问 `chain.display.flex` 时会通过这里转换成 CSS 值（驼峰 → kebab）。
 * 同名 keyword 跨多个 property 通用（如 `none` / `auto`），由 ENHANCED_PROPS.keywords
 * 决定每个 property 允许哪些。
 */
export const KEYWORD_TO_CSS: Record<string, string> = {
  // ─── 全局 ───
  inherit: 'inherit',
  unset: 'unset',
  initial: 'initial',
  revert: 'revert',
  revertLayer: 'revert-layer',

  // ─── display ───
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  flex: 'flex',
  inlineFlex: 'inline-flex',
  grid: 'grid',
  inlineGrid: 'inline-grid',
  none: 'none',
  contents: 'contents',

  // ─── position ───
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',

  // ─── 通用 ───
  auto: 'auto',
  normal: 'normal',
  bold: 'bold',
  top: 'top',
  bottom: 'bottom',
  inside: 'inside',
  outside: 'outside',

  // ─── size keywords ───
  minContent: 'min-content',
  maxContent: 'max-content',
  fitContent: 'fit-content',
  fill: 'fill',
  content: 'content',

  // ─── color keywords ───
  white: 'white',
  black: 'black',
  transparent: 'transparent',
  currentColor: 'currentColor',

  // ─── cursor ───
  default: 'default',
  pointer: 'pointer',
  text: 'text',
  wait: 'wait',
  move: 'move',
  help: 'help',
  notAllowed: 'not-allowed',
  grab: 'grab',
  grabbing: 'grabbing',

  // ─── visibility / overflow ───
  visible: 'visible',
  hidden: 'hidden',
  collapse: 'collapse',
  scroll: 'scroll',
  clip: 'clip',

  // ─── flex direction / wrap ───
  row: 'row',
  column: 'column',
  rowReverse: 'row-reverse',
  columnReverse: 'column-reverse',
  nowrap: 'nowrap',
  wrap: 'wrap',
  wrapReverse: 'wrap-reverse',

  // ─── justify / align ───
  flexStart: 'flex-start',
  flexEnd: 'flex-end',
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
  stretch: 'stretch',
  baseline: 'baseline',
  start: 'start',
  end: 'end',
  left: 'left',
  right: 'right',

  // ─── grid auto-flow ───
  dense: 'dense',
  rowDense: 'row dense',
  columnDense: 'column dense',

  // ─── border style ───
  dotted: 'dotted',
  dashed: 'dashed',
  solid: 'solid',
  double: 'double',
  groove: 'groove',
  ridge: 'ridge',
  inset: 'inset',
  outset: 'outset',

  // ─── animation direction / fill / play ───
  reverse: 'reverse',
  alternate: 'alternate',
  alternateReverse: 'alternate-reverse',
  forwards: 'forwards',
  backwards: 'backwards',
  both: 'both',
  running: 'running',
  paused: 'paused',
  infinite: 'infinite',

  // ─── object-fit ───
  cover: 'cover',
  contain: 'contain',
  scaleDown: 'scale-down',

  // ─── text-align / decoration / transform ───
  justify: 'justify',
  underline: 'underline',
  overline: 'overline',
  lineThrough: 'line-through',
  wavy: 'wavy',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  ellipsis: 'ellipsis',

  // ─── white-space / word-break ───
  pre: 'pre',
  preWrap: 'pre-wrap',
  preLine: 'pre-line',
  breakSpaces: 'break-spaces',
  breakAll: 'break-all',
  keepAll: 'keep-all',
  breakWord: 'break-word',

  // ─── background ───
  repeat: 'repeat',
  noRepeat: 'no-repeat',
  repeatX: 'repeat-x',
  repeatY: 'repeat-y',
  round: 'round',
  space: 'space',
  borderBox: 'border-box',
  paddingBox: 'padding-box',
  contentBox: 'content-box',

  // ─── user-select / pointer-events / resize / scroll-behavior ───
  all: 'all',
  horizontal: 'horizontal',
  vertical: 'vertical',
  smooth: 'smooth',

  // ═════════════════════════════════════════════════════════════════════
  // W1.6' / W1.7 补完（与 enhanced-props.ts 新增的 keyword 集对齐）
  // ═════════════════════════════════════════════════════════════════════

  // ─── logical sides ───
  blockStart: 'block-start',
  blockEnd: 'block-end',
  inlineStart: 'inline-start',
  inlineEnd: 'inline-end',

  // ─── list-style-type ───
  disc: 'disc',
  circle: 'circle',
  square: 'square',
  decimal: 'decimal',
  decimalLeadingZero: 'decimal-leading-zero',
  lowerRoman: 'lower-roman',
  upperRoman: 'upper-roman',
  lowerAlpha: 'lower-alpha',
  upperAlpha: 'upper-alpha',

  // ─── SVG stroke ───
  butt: 'butt',
  miter: 'miter',
  bevel: 'bevel',

  // ─── scroll-snap ───
  x: 'x',
  y: 'y',
  // block / inline / both 已在 display / animation-fill 区域定义，复用
  mandatory: 'mandatory',
  proximity: 'proximity',
  always: 'always',

  // ─── touch-action ───
  panX: 'pan-x',
  panY: 'pan-y',
  panLeft: 'pan-left',
  panRight: 'pan-right',
  panUp: 'pan-up',
  panDown: 'pan-down',
  pinchZoom: 'pinch-zoom',
  manipulation: 'manipulation',

  // ─── appearance ───
  textfield: 'textfield',
  menulistButton: 'menulist-button',

  // ─── will-change ───
  scrollPosition: 'scroll-position',
  // contents: 'contents'  // 已在 display 区有

  // ─── color-scheme ───
  light: 'light',
  dark: 'dark',
  lightDark: 'light dark',
  only: 'only',

  // ─── box-decoration-break ───
  slice: 'slice',
  clone: 'clone',

  // ─── isolation ───
  isolate: 'isolate',

  // ─── writing-mode ───
  horizontalTb: 'horizontal-tb',
  verticalRl: 'vertical-rl',
  verticalLr: 'vertical-lr',
  sidewaysRl: 'sideways-rl',
  sidewaysLr: 'sideways-lr',

  // ─── direction ───
  ltr: 'ltr',
  rtl: 'rtl',

  // ─── text-orientation ───
  mixed: 'mixed',
  upright: 'upright',
  sideways: 'sideways',

  // ─── text-wrap (CSS 4) ───
  balance: 'balance',
  pretty: 'pretty',
  stable: 'stable',

  // ─── field-sizing / interpolate-size / overflow-anchor ───
  // 'fixed' 已在 position 区
  allowKeywords: 'allow-keywords',
  numericOnly: 'numeric-only',

  // ─── blend-mode ───
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  colorDodge: 'color-dodge',
  colorBurn: 'color-burn',
  hardLight: 'hard-light',
  softLight: 'soft-light',
  difference: 'difference',
  exclusion: 'exclusion',
  hue: 'hue',
  saturation: 'saturation',
  color: 'color',
  luminosity: 'luminosity',
  plusDarker: 'plus-darker',
  plusLighter: 'plus-lighter',

  // ─── break-before / break-after / break-inside ───
  // 注：CSS spec 的 `break-before: left / right` 直接复用 keywords 区已有的 `left` / `right`，
  // 不重复定义 `leftPage` / `rightPage`（修 R5：删除歧义条目）。
  avoid: 'avoid',
  avoidPage: 'avoid-page',
  page: 'page',
  recto: 'recto',
  verso: 'verso',
  avoidColumn: 'avoid-column',
  // 'column': 已在 flex / grid 区
  avoidRegion: 'avoid-region',
  region: 'region',

  // ─── border-collapse ───
  separate: 'separate',

  // ─── column-fill ───
  balanceAll: 'balance-all',
}

export const GLOBAL_KEYWORDS = ['inherit', 'unset', 'initial', 'revert', 'revertLayer'] as const
