import type { UnitClass } from './units'

/** 单条 ENHANCED_PROPS 配置。tokenCat 为 null 表示该属性不绑主题 token。 */
export interface EnhancedPropConfig {
  /** 对应 ThemeSchema 中的 category 名（例如 `'color'`、`'spacing'`）；null 表示无 token。 */
  tokenCat: string | null
  /** 此属性的 unit 方法属于哪一类（length / time / angle）；null 表示不挂 unit 方法。 */
  unitClass: UnitClass | null
  /** 该属性合法 CSS keyword（无前缀，驼峰；KEYWORD_TO_CSS 中查 CSS 值）。null 表示用全局关键字。 */
  keywords: readonly string[] | null
}

// ─── 复用 keyword 集（避免重复写） ───

const COLOR_KW = ['white', 'black', 'transparent', 'currentColor'] as const
const SPACING_KW = ['auto'] as const
const SIZE_KW = ['auto', 'minContent', 'maxContent', 'fitContent'] as const
const DISPLAY_KW = [
  // 基础 outside / inside
  'block',
  'inline',
  'inlineBlock',
  'flex',
  'inlineFlex',
  'grid',
  'inlineGrid',
  'none',
  'contents',
  // 现代 inside
  'flowRoot',
  'ruby',
  // list-item
  'listItem',
  // table 家族
  'table',
  'inlineTable',
  'tableCell',
  'tableRow',
  'tableColumn',
  'tableRowGroup',
  'tableHeaderGroup',
  'tableFooterGroup',
  'tableColumnGroup',
  'tableCaption',
] as const
const POSITION_KW = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const
const CURSOR_KW = [
  // 通用
  'auto',
  'default',
  'none',
  // 交互
  'pointer',
  'text',
  'verticalText',
  'wait',
  'progress',
  'help',
  'contextMenu',
  'cell',
  'crosshair',
  // 拖放
  'move',
  'grab',
  'grabbing',
  'alias',
  'copy',
  'notAllowed',
  'noDrop',
  // 缩放
  'allScroll',
  'zoomIn',
  'zoomOut',
  // resize（8 方向 + 列/行 + 对角线）
  'colResize',
  'rowResize',
  'eResize',
  'nResize',
  'sResize',
  'wResize',
  'neResize',
  'nwResize',
  'seResize',
  'swResize',
  'ewResize',
  'nsResize',
  'neswResize',
  'nwseResize',
] as const
const VISIBILITY_KW = ['visible', 'hidden', 'collapse'] as const
const OVERFLOW_KW = ['visible', 'hidden', 'scroll', 'auto', 'clip'] as const

// ─── P2.A 新增 ───

const FLEX_DIRECTION_KW = ['row', 'rowReverse', 'column', 'columnReverse'] as const
const FLEX_WRAP_KW = ['nowrap', 'wrap', 'wrapReverse'] as const
const JUSTIFY_KW = [
  'flexStart',
  'flexEnd',
  'center',
  'spaceBetween',
  'spaceAround',
  'spaceEvenly',
  'normal',
  'stretch',
  'start',
  'end',
  'left',
  'right',
] as const
const ALIGN_KW = [
  'flexStart',
  'flexEnd',
  'center',
  'baseline',
  'stretch',
  'normal',
  'start',
  'end',
] as const
const FLEX_BASIS_KW = ['auto', 'fill', 'maxContent', 'minContent', 'fitContent', 'content'] as const
const BORDER_STYLE_KW = [
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
] as const
const ANIMATION_DIRECTION_KW = ['normal', 'reverse', 'alternate', 'alternateReverse'] as const
const ANIMATION_FILL_KW = ['none', 'forwards', 'backwards', 'both'] as const
const ANIMATION_PLAY_KW = ['running', 'paused'] as const
const OBJECT_FIT_KW = ['fill', 'contain', 'cover', 'none', 'scaleDown'] as const
const TEXT_ALIGN_KW = [
  'left',
  'right',
  'center',
  'justify',
  'start',
  'end',
  'matchParent',
  'justifyAll',
] as const
const TEXT_DECO_LINE_KW = [
  'none',
  'underline',
  'overline',
  'lineThrough',
  'spellingError',
  'grammarError',
] as const
const TEXT_DECO_STYLE_KW = ['solid', 'double', 'dotted', 'dashed', 'wavy'] as const
const TEXT_TRANSFORM_KW = [
  'none',
  'capitalize',
  'uppercase',
  'lowercase',
  'fullWidth',
  'fullSizeKana',
  'mathAuto',
] as const
const TEXT_OVERFLOW_KW = ['clip', 'ellipsis'] as const
const WHITE_SPACE_KW = [
  'normal',
  'nowrap',
  'pre',
  'preWrap',
  'preLine',
  'breakSpaces',
  // CSS 4
  'wrap',
  'collapse',
] as const
const WORD_BREAK_KW = ['normal', 'breakAll', 'keepAll', 'breakWord', 'autoPhrase'] as const
const BG_SIZE_KW = ['auto', 'cover', 'contain'] as const
const BG_REPEAT_KW = ['repeat', 'noRepeat', 'repeatX', 'repeatY', 'round', 'space'] as const
const BG_CLIP_KW = ['borderBox', 'paddingBox', 'contentBox', 'text'] as const
const USER_SELECT_KW = ['none', 'auto', 'text', 'all', 'contain'] as const
const POINTER_EVENTS_KW = [
  'none',
  'auto',
  // SVG（注：spec 拼写为驼峰单词，无连字符）
  'visiblePainted',
  'visibleFill',
  'visibleStroke',
  'visible',
  'painted',
  'fill',
  'stroke',
  'all',
] as const
const RESIZE_KW = ['none', 'both', 'horizontal', 'vertical', 'block', 'inline'] as const
const SCROLL_BEHAVIOR_KW = ['auto', 'smooth'] as const
const GRID_AUTO_FLOW_KW = ['row', 'column', 'dense', 'rowDense', 'columnDense'] as const

// ─── W1.6' / W1.7 新增 ───
const BLEND_MODE_KW = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'colorDodge',
  'colorBurn',
  'hardLight',
  'softLight',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
  'plusDarker',
  'plusLighter',
] as const
const BREAK_KW = [
  'auto',
  'avoid',
  'always',
  'all',
  'avoidPage',
  'page',
  'left',
  'right',
  'recto',
  'verso',
  'avoidColumn',
  'column',
  'avoidRegion',
  'region',
] as const
const TABLE_LAYOUT_KW = ['auto', 'fixed'] as const
const BORDER_COLLAPSE_KW = ['collapse', 'separate'] as const
const CAPTION_SIDE_KW = [
  'top',
  'bottom',
  'blockStart',
  'blockEnd',
  'inlineStart',
  'inlineEnd',
] as const
const LIST_STYLE_TYPE_KW = [
  // 基础
  'disc',
  'circle',
  'square',
  'none',
  // 数字 / 西文字母
  'decimal',
  'decimalLeadingZero',
  'lowerRoman',
  'upperRoman',
  'lowerAlpha',
  'upperAlpha',
  // 国际化（CSS spec 已标准化）
  'lowerGreek',
  'armenian',
  'georgian',
  'hebrew',
  'hiragana',
  'katakana',
  'cjkIdeographic',
] as const
const LIST_STYLE_POSITION_KW = ['inside', 'outside'] as const
const STROKE_LINECAP_KW = ['butt', 'round', 'square'] as const
const STROKE_LINEJOIN_KW = ['miter', 'round', 'bevel', 'arcs', 'miterClip'] as const
const SCROLL_SNAP_TYPE_KW = [
  'none',
  'x',
  'y',
  'block',
  'inline',
  'both',
  'mandatory',
  'proximity',
] as const
const SCROLL_SNAP_ALIGN_KW = ['none', 'start', 'end', 'center'] as const
const SCROLL_SNAP_STOP_KW = ['normal', 'always'] as const
const TOUCH_ACTION_KW = [
  'auto',
  'none',
  'panX',
  'panY',
  'panLeft',
  'panRight',
  'panUp',
  'panDown',
  'pinchZoom',
  'manipulation',
] as const
const APPEARANCE_KW = ['none', 'auto', 'textfield', 'menulistButton'] as const
const WILL_CHANGE_KW = ['auto', 'scrollPosition', 'contents'] as const
const COLOR_SCHEME_KW = ['normal', 'light', 'dark', 'lightDark', 'only'] as const
const BOX_SIZING_KW = ['borderBox', 'contentBox'] as const
const BOX_DECORATION_BREAK_KW = ['slice', 'clone'] as const
const FLOAT_KW = ['left', 'right', 'none', 'inlineStart', 'inlineEnd'] as const
const CLEAR_KW = ['left', 'right', 'none', 'both', 'inlineStart', 'inlineEnd'] as const
const ISOLATION_KW = ['auto', 'isolate'] as const
const WRITING_MODE_KW = [
  'horizontalTb',
  'verticalRl',
  'verticalLr',
  'sidewaysRl',
  'sidewaysLr',
] as const
const DIRECTION_KW = ['ltr', 'rtl'] as const
const TEXT_ORIENTATION_KW = ['mixed', 'upright', 'sideways'] as const
const TEXT_WRAP_KW = ['wrap', 'nowrap', 'balance', 'pretty', 'stable'] as const
const FIELD_SIZING_KW = ['content', 'fixed'] as const
const INTERPOLATE_SIZE_KW = ['allowKeywords', 'numericOnly'] as const
const OVERFLOW_ANCHOR_KW = ['auto', 'none'] as const
const COLUMN_SPAN_KW = ['none', 'all'] as const
const COLUMN_FILL_KW = ['auto', 'balance', 'balanceAll'] as const

// ─── P0/P1/P2 补完 ───

/** transition/animation timing function 的 CSS 标准 keyword（不含贝塞尔函数 / steps()）。 */
const TIMING_FUNCTION_KW = [
  'linear',
  'ease',
  'easeIn',
  'easeOut',
  'easeInOut',
  'stepStart',
  'stepEnd',
] as const

/** font-weight 关键字（含相对值 lighter/bolder）。 */
const FONT_WEIGHT_KW = ['normal', 'bold', 'lighter', 'bolder'] as const

/** font-size 关键字：8 阶 absolute + 2 个 relative。 */
const FONT_SIZE_KW = [
  'xxSmall',
  'xSmall',
  'small',
  'medium',
  'large',
  'xLarge',
  'xxLarge',
  'xxxLarge',
  'smaller',
  'larger',
] as const

/** font-family generic family + ui-* 现代系列。 */
const FONT_FAMILY_KW = [
  'serif',
  'sansSerif',
  'monospace',
  'cursive',
  'fantasy',
  'systemUi',
  'uiSerif',
  'uiSansSerif',
  'uiMonospace',
  'uiRounded',
  'emoji',
  'math',
  'fangsong',
] as const

/** border-width / outline-width / column-rule-width 用 thin/medium/thick。 */
const BORDER_WIDTH_KW = ['thin', 'medium', 'thick'] as const

/** background-position / object-position / transform-origin 的方位关键字。 */
const POSITION_VALUES_KW = ['top', 'bottom', 'left', 'right', 'center'] as const

/**
 * 增强属性元数据 —— 类型 ↔ 运行时双向对齐的 **single source of truth**。
 *
 * - 类型层 `IcxPropMethods<TSelf, T>` 由 `scripts/generate-properties.mjs`
 *   读 csstype Properties 接口 + 本表派生，零漂移
 * - 运行时 `getOrCreateCarrier` 按本表分派 token / keyword / unit 解析
 *
 * 新增 / 修改 ENHANCED_PROPS 后必须重跑 `pnpm generate`。
 */
export const ENHANCED_PROPS: Record<string, EnhancedPropConfig> = {
  // ─── 颜色（ColorPropCarrier；token 命中返回 ColorTokenValue 带 .alpha(n)） ───
  color: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  backgroundColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderTopColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderRightColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderBottomColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderLeftColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  outlineColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  textDecorationColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  caretColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  accentColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  fill: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  stroke: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },

  // ─── 间距（spacing；LengthUnits + 'auto'） ───
  padding: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingTop: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingRight: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingBottom: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingLeft: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingBlock: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingInline: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  margin: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginTop: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginRight: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginBottom: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginLeft: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginBlock: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginInline: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  gap: { tokenCat: 'spacing', unitClass: 'length', keywords: ['normal'] },
  rowGap: { tokenCat: 'spacing', unitClass: 'length', keywords: ['normal'] },
  columnGap: { tokenCat: 'spacing', unitClass: 'length', keywords: ['normal'] },
  inset: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  top: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  right: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  bottom: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  left: { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },

  // ─── 尺寸（sizes；LengthUnits + 'auto'/min-content/...） ───
  width: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  height: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  minWidth: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  minHeight: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  maxWidth: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  maxHeight: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },

  // ─── 字体 ───
  fontSize: { tokenCat: 'fontSize', unitClass: 'length', keywords: FONT_SIZE_KW },
  fontWeight: { tokenCat: 'fontWeight', unitClass: null, keywords: FONT_WEIGHT_KW },
  lineHeight: { tokenCat: 'lineHeight', unitClass: 'length', keywords: ['normal'] },
  letterSpacing: { tokenCat: 'letterSpacing', unitClass: 'length', keywords: ['normal'] },
  fontFamily: { tokenCat: 'fonts', unitClass: null, keywords: FONT_FAMILY_KW },

  // ─── 圆角（radius；LengthUnits） ───
  borderRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderTopLeftRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderTopRightRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderBottomLeftRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderBottomRightRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },

  // ─── 边框宽度（borders；LengthUnits + thin/medium/thick） ───
  borderWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },
  borderTopWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },
  borderRightWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },
  borderBottomWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },
  borderLeftWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },
  outlineWidth: { tokenCat: 'borders', unitClass: 'length', keywords: BORDER_WIDTH_KW },

  // ─── 边框样式（无 token；BORDER_STYLE_KW） ───
  borderStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  borderTopStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  borderRightStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  borderBottomStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  borderLeftStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  outlineStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  outlineOffset: { tokenCat: null, unitClass: 'length', keywords: null },

  // ─── 阴影 / 层级 / 透明度 / 长宽比 ───
  boxShadow: { tokenCat: 'shadow', unitClass: null, keywords: ['none'] },
  textShadow: { tokenCat: 'shadow', unitClass: null, keywords: ['none'] },
  zIndex: { tokenCat: 'zIndex', unitClass: null, keywords: ['auto'] },
  opacity: { tokenCat: 'opacity', unitClass: null, keywords: null },
  aspectRatio: { tokenCat: 'aspectRatio', unitClass: null, keywords: ['auto'] },

  // ─── 布局 / 显示 / 可见性 / 溢出 / 鼠标 ───
  display: { tokenCat: null, unitClass: null, keywords: DISPLAY_KW },
  position: { tokenCat: null, unitClass: null, keywords: POSITION_KW },
  cursor: { tokenCat: 'cursor', unitClass: null, keywords: CURSOR_KW },
  visibility: { tokenCat: null, unitClass: null, keywords: VISIBILITY_KW },
  overflow: { tokenCat: null, unitClass: null, keywords: OVERFLOW_KW },
  overflowX: { tokenCat: null, unitClass: null, keywords: OVERFLOW_KW },
  overflowY: { tokenCat: null, unitClass: null, keywords: OVERFLOW_KW },

  // ─── Flex 容器 ───
  flexDirection: { tokenCat: null, unitClass: null, keywords: FLEX_DIRECTION_KW },
  flexWrap: { tokenCat: null, unitClass: null, keywords: FLEX_WRAP_KW },
  justifyContent: { tokenCat: null, unitClass: null, keywords: JUSTIFY_KW },
  justifyItems: { tokenCat: null, unitClass: null, keywords: JUSTIFY_KW },
  justifySelf: { tokenCat: null, unitClass: null, keywords: [...JUSTIFY_KW, 'auto'] },
  alignItems: { tokenCat: null, unitClass: null, keywords: ALIGN_KW },
  alignContent: {
    tokenCat: null,
    unitClass: null,
    keywords: [...ALIGN_KW, 'spaceBetween', 'spaceAround', 'spaceEvenly'],
  },
  alignSelf: { tokenCat: null, unitClass: null, keywords: [...ALIGN_KW, 'auto'] },

  // ─── Flex 项目 ───
  flexGrow: { tokenCat: null, unitClass: null, keywords: null },
  flexShrink: { tokenCat: null, unitClass: null, keywords: null },
  flexBasis: { tokenCat: 'sizes', unitClass: 'length', keywords: FLEX_BASIS_KW },
  order: { tokenCat: null, unitClass: null, keywords: null },

  // ─── Grid ───
  gridAutoFlow: { tokenCat: null, unitClass: null, keywords: GRID_AUTO_FLOW_KW },
  gridColumn: { tokenCat: null, unitClass: null, keywords: ['auto'] },
  gridRow: { tokenCat: null, unitClass: null, keywords: ['auto'] },
  gridArea: { tokenCat: null, unitClass: null, keywords: ['auto'] },

  // ─── 过渡 / 动画 ───
  transitionDuration: { tokenCat: 'duration', unitClass: 'time', keywords: null },
  transitionTimingFunction: { tokenCat: 'easing', unitClass: null, keywords: TIMING_FUNCTION_KW },
  transitionProperty: { tokenCat: 'transitionProperty', unitClass: null, keywords: ['none', 'all'] },
  transitionDelay: { tokenCat: 'duration', unitClass: 'time', keywords: null },
  animationDuration: { tokenCat: 'duration', unitClass: 'time', keywords: null },
  animationDelay: { tokenCat: 'duration', unitClass: 'time', keywords: null },
  animationTimingFunction: { tokenCat: 'easing', unitClass: null, keywords: TIMING_FUNCTION_KW },
  animationIterationCount: { tokenCat: null, unitClass: null, keywords: ['infinite'] },
  animationName: { tokenCat: null, unitClass: null, keywords: ['none'] },
  animationDirection: { tokenCat: null, unitClass: null, keywords: ANIMATION_DIRECTION_KW },
  animationFillMode: { tokenCat: null, unitClass: null, keywords: ANIMATION_FILL_KW },
  animationPlayState: { tokenCat: null, unitClass: null, keywords: ANIMATION_PLAY_KW },

  // ─── Transform ───
  transformOrigin: { tokenCat: null, unitClass: 'length', keywords: POSITION_VALUES_KW },
  rotate: { tokenCat: null, unitClass: 'angle', keywords: ['none'] },
  scale: { tokenCat: null, unitClass: null, keywords: ['none'] },
  translate: { tokenCat: null, unitClass: 'length', keywords: ['none'] },
  perspective: { tokenCat: null, unitClass: 'length', keywords: ['none'] },

  // ─── Object ───
  objectFit: { tokenCat: null, unitClass: null, keywords: OBJECT_FIT_KW },
  objectPosition: { tokenCat: null, unitClass: 'length', keywords: POSITION_VALUES_KW },

  // ─── 文字 ───
  textAlign: { tokenCat: null, unitClass: null, keywords: TEXT_ALIGN_KW },
  textDecorationLine: { tokenCat: null, unitClass: null, keywords: TEXT_DECO_LINE_KW },
  textDecorationStyle: { tokenCat: null, unitClass: null, keywords: TEXT_DECO_STYLE_KW },
  textDecorationThickness: { tokenCat: null, unitClass: 'length', keywords: ['auto', 'fromFont'] },
  textTransform: { tokenCat: null, unitClass: null, keywords: TEXT_TRANSFORM_KW },
  textOverflow: { tokenCat: null, unitClass: null, keywords: TEXT_OVERFLOW_KW },
  textIndent: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  whiteSpace: { tokenCat: null, unitClass: null, keywords: WHITE_SPACE_KW },
  wordBreak: { tokenCat: null, unitClass: null, keywords: WORD_BREAK_KW },
  wordSpacing: { tokenCat: null, unitClass: 'length', keywords: ['normal'] },

  // ─── 背景 ───
  backgroundPosition: { tokenCat: null, unitClass: 'length', keywords: POSITION_VALUES_KW },
  backgroundSize: { tokenCat: null, unitClass: 'length', keywords: BG_SIZE_KW },
  backgroundRepeat: { tokenCat: null, unitClass: null, keywords: BG_REPEAT_KW },
  backgroundClip: { tokenCat: null, unitClass: null, keywords: BG_CLIP_KW },

  // ─── 杂项交互 ───
  userSelect: { tokenCat: null, unitClass: null, keywords: USER_SELECT_KW },
  pointerEvents: { tokenCat: null, unitClass: null, keywords: POINTER_EVENTS_KW },
  resize: { tokenCat: null, unitClass: null, keywords: RESIZE_KW },
  scrollBehavior: { tokenCat: null, unitClass: null, keywords: SCROLL_BEHAVIOR_KW },

  // ═════════════════════════════════════════════════════════════════════
  // W1.6' / W1.7 补完（按 Tailwind v3/v4 高频度，~50 条）
  // ═════════════════════════════════════════════════════════════════════

  // ─── Filter / Backdrop（★ 必须，W1.4 helper 前置） ───
  filter: { tokenCat: null, unitClass: null, keywords: ['none'] },
  backdropFilter: { tokenCat: null, unitClass: null, keywords: ['none'] },

  // ─── 表格 ───
  borderCollapse: { tokenCat: null, unitClass: null, keywords: BORDER_COLLAPSE_KW },
  borderSpacing: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  tableLayout: { tokenCat: null, unitClass: null, keywords: TABLE_LAYOUT_KW },
  captionSide: { tokenCat: null, unitClass: null, keywords: CAPTION_SIDE_KW },

  // ─── 列表 ───
  listStyleType: { tokenCat: null, unitClass: null, keywords: LIST_STYLE_TYPE_KW },
  listStylePosition: { tokenCat: null, unitClass: null, keywords: LIST_STYLE_POSITION_KW },
  listStyleImage: { tokenCat: null, unitClass: null, keywords: ['none'] },

  // ─── SVG ───
  strokeWidth: { tokenCat: 'borders', unitClass: 'length', keywords: null },
  strokeLinecap: { tokenCat: null, unitClass: null, keywords: STROKE_LINECAP_KW },
  strokeLinejoin: { tokenCat: null, unitClass: null, keywords: STROKE_LINEJOIN_KW },
  strokeDasharray: { tokenCat: null, unitClass: null, keywords: ['none'] },
  strokeDashoffset: { tokenCat: null, unitClass: 'length', keywords: null },

  // ─── Scroll snap ───
  scrollSnapType: { tokenCat: null, unitClass: null, keywords: SCROLL_SNAP_TYPE_KW },
  scrollSnapAlign: { tokenCat: null, unitClass: null, keywords: SCROLL_SNAP_ALIGN_KW },
  scrollSnapStop: { tokenCat: null, unitClass: null, keywords: SCROLL_SNAP_STOP_KW },
  scrollMargin: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginTop: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginRight: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginBottom: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginLeft: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginBlock: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollMarginInline: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPadding: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingTop: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingRight: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingBottom: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingLeft: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingBlock: { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  scrollPaddingInline: { tokenCat: 'spacing', unitClass: 'length', keywords: null },

  // ─── Pointer / 系统 ───
  touchAction: { tokenCat: null, unitClass: null, keywords: TOUCH_ACTION_KW },
  appearance: { tokenCat: null, unitClass: null, keywords: APPEARANCE_KW },
  willChange: { tokenCat: null, unitClass: null, keywords: WILL_CHANGE_KW },
  colorScheme: { tokenCat: null, unitClass: null, keywords: COLOR_SCHEME_KW },

  // ─── Layout ───
  boxSizing: { tokenCat: null, unitClass: null, keywords: BOX_SIZING_KW },
  boxDecorationBreak: { tokenCat: null, unitClass: null, keywords: BOX_DECORATION_BREAK_KW },
  float: { tokenCat: null, unitClass: null, keywords: FLOAT_KW },
  clear: { tokenCat: null, unitClass: null, keywords: CLEAR_KW },
  isolation: { tokenCat: null, unitClass: null, keywords: ISOLATION_KW },

  // ─── 混合模式 ───
  mixBlendMode: { tokenCat: null, unitClass: null, keywords: BLEND_MODE_KW },
  backgroundBlendMode: { tokenCat: null, unitClass: null, keywords: BLEND_MODE_KW },

  // ─── 书写方向 ───
  writingMode: { tokenCat: null, unitClass: null, keywords: WRITING_MODE_KW },
  direction: { tokenCat: null, unitClass: null, keywords: DIRECTION_KW },
  textOrientation: { tokenCat: null, unitClass: null, keywords: TEXT_ORIENTATION_KW },

  // ─── Columns（多栏） ───
  columns: { tokenCat: null, unitClass: 'length', keywords: ['auto'] },
  columnCount: { tokenCat: null, unitClass: null, keywords: ['auto'] },
  columnWidth: { tokenCat: null, unitClass: 'length', keywords: ['auto'] },
  columnSpan: { tokenCat: null, unitClass: null, keywords: COLUMN_SPAN_KW },
  columnFill: { tokenCat: null, unitClass: null, keywords: COLUMN_FILL_KW },
  columnRuleWidth: { tokenCat: 'borders', unitClass: 'length', keywords: null },
  columnRuleStyle: { tokenCat: null, unitClass: null, keywords: BORDER_STYLE_KW },
  columnRuleColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  breakBefore: { tokenCat: null, unitClass: null, keywords: BREAK_KW },
  breakAfter: { tokenCat: null, unitClass: null, keywords: BREAK_KW },
  breakInside: {
    tokenCat: null,
    unitClass: null,
    keywords: ['auto', 'avoid', 'avoidPage', 'avoidColumn', 'avoidRegion'],
  },

  // ─── 现代 CSS 4 ───
  textWrap: { tokenCat: null, unitClass: null, keywords: TEXT_WRAP_KW },
  fieldSizing: { tokenCat: null, unitClass: null, keywords: FIELD_SIZING_KW },
  interpolateSize: { tokenCat: null, unitClass: null, keywords: INTERPOLATE_SIZE_KW },
  overflowAnchor: { tokenCat: null, unitClass: null, keywords: OVERFLOW_ANCHOR_KW },
  anchorName: { tokenCat: null, unitClass: null, keywords: ['none'] },
  positionAnchor: { tokenCat: null, unitClass: null, keywords: ['auto'] },

  // ─── 内容生成（伪元素 ::before/::after 用） ───
  content: { tokenCat: null, unitClass: null, keywords: ['none', 'normal'] },
  counterReset: { tokenCat: null, unitClass: null, keywords: ['none'] },
  counterIncrement: { tokenCat: null, unitClass: null, keywords: ['none'] },
  counterSet: { tokenCat: null, unitClass: null, keywords: ['none'] },
}
