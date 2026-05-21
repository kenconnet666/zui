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

  // ═════════════════════════════════════════════════════════════════════
  // P0/P1/P2 补完 —— timing function / font / border-width / position
  // 这一批让 transitionTimingFunction.linear / fontWeight.lighter /
  // borderWidth.thin / backgroundPosition.center 等 keyword-style 链式写法
  // 在所有 Chain<T> 上可用（不依赖 schema TTokens 解析）
  // ═════════════════════════════════════════════════════════════════════

  // ─── timing function（transition/animationTimingFunction） ───
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  stepStart: 'step-start',
  stepEnd: 'step-end',

  // ─── font-weight 相对值 ───
  lighter: 'lighter',
  bolder: 'bolder',

  // ─── font-size absolute + relative ───
  xxSmall: 'xx-small',
  xSmall: 'x-small',
  small: 'small',
  medium: 'medium',
  large: 'large',
  xLarge: 'x-large',
  xxLarge: 'xx-large',
  xxxLarge: 'xxx-large',
  smaller: 'smaller',
  larger: 'larger',

  // ─── font-family generic + ui-* 系列 ───
  serif: 'serif',
  sansSerif: 'sans-serif',
  monospace: 'monospace',
  cursive: 'cursive',
  fantasy: 'fantasy',
  systemUi: 'system-ui',
  uiSerif: 'ui-serif',
  uiSansSerif: 'ui-sans-serif',
  uiMonospace: 'ui-monospace',
  uiRounded: 'ui-rounded',
  emoji: 'emoji',
  math: 'math',
  fangsong: 'fangsong',

  // ─── border-width / outline-width / column-rule-width（medium 与 fontSize 复用） ───
  thin: 'thin',
  thick: 'thick',

  // ═════════════════════════════════════════════════════════════════════
  // 全量补完 —— CSS spec 已支持但 zui 之前漏掉的标准 keyword
  // ═════════════════════════════════════════════════════════════════════

  // ─── cursor 完整集（25 个标准 CSS 值） ───
  crosshair: 'crosshair',
  copy: 'copy',
  alias: 'alias',
  progress: 'progress',
  cell: 'cell',
  verticalText: 'vertical-text',
  contextMenu: 'context-menu',
  noDrop: 'no-drop',
  zoomIn: 'zoom-in',
  zoomOut: 'zoom-out',
  allScroll: 'all-scroll',
  colResize: 'col-resize',
  rowResize: 'row-resize',
  eResize: 'e-resize',
  nResize: 'n-resize',
  sResize: 's-resize',
  wResize: 'w-resize',
  neResize: 'ne-resize',
  nwResize: 'nw-resize',
  seResize: 'se-resize',
  swResize: 'sw-resize',
  ewResize: 'ew-resize',
  nsResize: 'ns-resize',
  neswResize: 'nesw-resize',
  nwseResize: 'nwse-resize',

  // ─── display table 系列 + 现代值 ───
  table: 'table',
  tableCell: 'table-cell',
  tableRow: 'table-row',
  tableColumn: 'table-column',
  tableRowGroup: 'table-row-group',
  tableHeaderGroup: 'table-header-group',
  tableFooterGroup: 'table-footer-group',
  tableColumnGroup: 'table-column-group',
  tableCaption: 'table-caption',
  inlineTable: 'inline-table',
  flowRoot: 'flow-root',
  listItem: 'list-item',
  ruby: 'ruby',

  // ─── pointer-events SVG 值（spec 拼写为单词驼峰，无连字符） ───
  visiblePainted: 'visiblePainted',
  visibleFill: 'visibleFill',
  visibleStroke: 'visibleStroke',
  painted: 'painted',
  stroke: 'stroke',

  // ─── text-align CSS 4 补 ───
  matchParent: 'match-parent',
  justifyAll: 'justify-all',

  // ─── text-decoration-line / -thickness 补 ───
  spellingError: 'spelling-error',
  grammarError: 'grammar-error',
  fromFont: 'from-font',

  // ─── text-transform 补 ───
  fullWidth: 'full-width',
  fullSizeKana: 'full-size-kana',
  mathAuto: 'math-auto',

  // ─── word-break CSS 4 ───
  autoPhrase: 'auto-phrase',

  // ─── stroke-linejoin 补 ───
  arcs: 'arcs',
  miterClip: 'miter-clip',

  // ─── list-style-type 国际化补完 ───
  lowerGreek: 'lower-greek',
  armenian: 'armenian',
  georgian: 'georgian',
  hebrew: 'hebrew',
  hiragana: 'hiragana',
  katakana: 'katakana',
  cjkIdeographic: 'cjk-ideographic',

  // ═════════════════════════════════════════════════════════════════════
  // CSS 4 named colors（146 个，identity 映射）
  // 让 s.color.coral / s.backgroundColor.lavender 等直观写法可用
  // ═════════════════════════════════════════════════════════════════════
  aliceblue: 'aliceblue', antiquewhite: 'antiquewhite', aqua: 'aqua', aquamarine: 'aquamarine',
  azure: 'azure', beige: 'beige', bisque: 'bisque', blanchedalmond: 'blanchedalmond',
  blue: 'blue', blueviolet: 'blueviolet', brown: 'brown', burlywood: 'burlywood',
  cadetblue: 'cadetblue', chartreuse: 'chartreuse', chocolate: 'chocolate', coral: 'coral',
  cornflowerblue: 'cornflowerblue', cornsilk: 'cornsilk', crimson: 'crimson', cyan: 'cyan',
  darkblue: 'darkblue', darkcyan: 'darkcyan', darkgoldenrod: 'darkgoldenrod', darkgray: 'darkgray',
  darkgreen: 'darkgreen', darkgrey: 'darkgrey', darkkhaki: 'darkkhaki', darkmagenta: 'darkmagenta',
  darkolivegreen: 'darkolivegreen', darkorange: 'darkorange', darkorchid: 'darkorchid', darkred: 'darkred',
  darksalmon: 'darksalmon', darkseagreen: 'darkseagreen', darkslateblue: 'darkslateblue', darkslategray: 'darkslategray',
  darkslategrey: 'darkslategrey', darkturquoise: 'darkturquoise', darkviolet: 'darkviolet', deeppink: 'deeppink',
  deepskyblue: 'deepskyblue', dimgray: 'dimgray', dimgrey: 'dimgrey', dodgerblue: 'dodgerblue',
  firebrick: 'firebrick', floralwhite: 'floralwhite', forestgreen: 'forestgreen', fuchsia: 'fuchsia',
  gainsboro: 'gainsboro', ghostwhite: 'ghostwhite', gold: 'gold', goldenrod: 'goldenrod',
  gray: 'gray', green: 'green', greenyellow: 'greenyellow', grey: 'grey', honeydew: 'honeydew',
  hotpink: 'hotpink', indianred: 'indianred', indigo: 'indigo', ivory: 'ivory',
  khaki: 'khaki', lavender: 'lavender', lavenderblush: 'lavenderblush', lawngreen: 'lawngreen',
  lemonchiffon: 'lemonchiffon', lightblue: 'lightblue', lightcoral: 'lightcoral', lightcyan: 'lightcyan',
  lightgoldenrodyellow: 'lightgoldenrodyellow', lightgray: 'lightgray', lightgreen: 'lightgreen', lightgrey: 'lightgrey',
  lightpink: 'lightpink', lightsalmon: 'lightsalmon', lightseagreen: 'lightseagreen', lightskyblue: 'lightskyblue',
  lightslategray: 'lightslategray', lightslategrey: 'lightslategrey', lightsteelblue: 'lightsteelblue', lightyellow: 'lightyellow',
  lime: 'lime', limegreen: 'limegreen', linen: 'linen', magenta: 'magenta', maroon: 'maroon',
  mediumaquamarine: 'mediumaquamarine', mediumblue: 'mediumblue', mediumorchid: 'mediumorchid', mediumpurple: 'mediumpurple',
  mediumseagreen: 'mediumseagreen', mediumslateblue: 'mediumslateblue', mediumspringgreen: 'mediumspringgreen', mediumturquoise: 'mediumturquoise',
  mediumvioletred: 'mediumvioletred', midnightblue: 'midnightblue', mintcream: 'mintcream', mistyrose: 'mistyrose',
  moccasin: 'moccasin', navajowhite: 'navajowhite', navy: 'navy', oldlace: 'oldlace',
  olive: 'olive', olivedrab: 'olivedrab', orange: 'orange', orangered: 'orangered',
  orchid: 'orchid', palegoldenrod: 'palegoldenrod', palegreen: 'palegreen', paleturquoise: 'paleturquoise',
  palevioletred: 'palevioletred', papayawhip: 'papayawhip', peachpuff: 'peachpuff', peru: 'peru',
  pink: 'pink', plum: 'plum', powderblue: 'powderblue', purple: 'purple',
  rebeccapurple: 'rebeccapurple', red: 'red', rosybrown: 'rosybrown', royalblue: 'royalblue',
  saddlebrown: 'saddlebrown', salmon: 'salmon', sandybrown: 'sandybrown', seagreen: 'seagreen',
  seashell: 'seashell', sienna: 'sienna', silver: 'silver', skyblue: 'skyblue',
  slateblue: 'slateblue', slategray: 'slategray', slategrey: 'slategrey', snow: 'snow',
  springgreen: 'springgreen', steelblue: 'steelblue', tan: 'tan', teal: 'teal',
  thistle: 'thistle', tomato: 'tomato', turquoise: 'turquoise', violet: 'violet',
  wheat: 'wheat', whitesmoke: 'whitesmoke', yellow: 'yellow', yellowgreen: 'yellowgreen',
}

export const GLOBAL_KEYWORDS = ['inherit', 'unset', 'initial', 'revert', 'revertLayer'] as const
