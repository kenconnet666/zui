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
}

export const GLOBAL_KEYWORDS = ['inherit', 'unset', 'initial', 'revert', 'revertLayer'] as const
