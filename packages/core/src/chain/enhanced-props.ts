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
  'block', 'inline', 'inlineBlock',
  'flex', 'inlineFlex',
  'grid', 'inlineGrid',
  'none', 'contents',
] as const
const POSITION_KW = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const
const CURSOR_KW = [
  'auto', 'default', 'pointer', 'text', 'wait', 'move',
  'help', 'notAllowed', 'none', 'grab', 'grabbing',
] as const
const VISIBILITY_KW = ['visible', 'hidden', 'collapse'] as const
const OVERFLOW_KW = ['visible', 'hidden', 'scroll', 'auto', 'clip'] as const

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
  color:               { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  backgroundColor:     { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderColor:         { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderTopColor:      { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderRightColor:    { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderBottomColor:   { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  borderLeftColor:     { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  outlineColor:        { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  textDecorationColor: { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  caretColor:          { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  accentColor:         { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  fill:                { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },
  stroke:              { tokenCat: 'color', unitClass: null, keywords: COLOR_KW },

  // ─── 间距（spacing；LengthUnits + 'auto'） ───
  padding:        { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingTop:     { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingRight:   { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingBottom:  { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingLeft:    { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingBlock:   { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  paddingInline:  { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  margin:         { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginTop:      { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginRight:    { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginBottom:   { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginLeft:     { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginBlock:    { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  marginInline:   { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  gap:            { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  rowGap:         { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  columnGap:      { tokenCat: 'spacing', unitClass: 'length', keywords: null },
  inset:          { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  top:            { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  right:          { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  bottom:         { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },
  left:           { tokenCat: 'spacing', unitClass: 'length', keywords: SPACING_KW },

  // ─── 尺寸（sizes；LengthUnits + 'auto'/min-content/...） ───
  width:     { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  height:    { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  minWidth:  { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  minHeight: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  maxWidth:  { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },
  maxHeight: { tokenCat: 'sizes', unitClass: 'length', keywords: SIZE_KW },

  // ─── 字体 ───
  fontSize:       { tokenCat: 'fontSize', unitClass: 'length', keywords: null },
  fontWeight:     { tokenCat: 'fontWeight', unitClass: null, keywords: ['normal', 'bold'] },
  lineHeight:     { tokenCat: 'lineHeight', unitClass: 'length', keywords: ['normal'] },
  letterSpacing:  { tokenCat: 'letterSpacing', unitClass: 'length', keywords: ['normal'] },
  fontFamily:     { tokenCat: 'fonts', unitClass: null, keywords: null },

  // ─── 圆角（radius；LengthUnits） ───
  borderRadius:            { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderTopLeftRadius:     { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderTopRightRadius:    { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderBottomLeftRadius:  { tokenCat: 'radius', unitClass: 'length', keywords: null },
  borderBottomRightRadius: { tokenCat: 'radius', unitClass: 'length', keywords: null },

  // ─── 边框宽度（borders；LengthUnits） ───
  borderWidth:       { tokenCat: 'borders', unitClass: 'length', keywords: null },
  borderTopWidth:    { tokenCat: 'borders', unitClass: 'length', keywords: null },
  borderRightWidth:  { tokenCat: 'borders', unitClass: 'length', keywords: null },
  borderBottomWidth: { tokenCat: 'borders', unitClass: 'length', keywords: null },
  borderLeftWidth:   { tokenCat: 'borders', unitClass: 'length', keywords: null },
  outlineWidth:      { tokenCat: 'borders', unitClass: 'length', keywords: null },

  // ─── 阴影 / 层级 / 透明度 / 长宽比 ───
  boxShadow:    { tokenCat: 'shadow',      unitClass: null, keywords: ['none'] },
  zIndex:       { tokenCat: 'zIndex',      unitClass: null, keywords: ['auto'] },
  opacity:      { tokenCat: 'opacity',     unitClass: null, keywords: null },
  aspectRatio:  { tokenCat: 'aspectRatio', unitClass: null, keywords: ['auto'] },

  // ─── 布局 / 显示 / 可见性 / 溢出 / 鼠标 ───
  display:    { tokenCat: null,     unitClass: null, keywords: DISPLAY_KW },
  position:   { tokenCat: null,     unitClass: null, keywords: POSITION_KW },
  cursor:     { tokenCat: 'cursor', unitClass: null, keywords: CURSOR_KW },
  visibility: { tokenCat: null,     unitClass: null, keywords: VISIBILITY_KW },
  overflow:   { tokenCat: null,     unitClass: null, keywords: OVERFLOW_KW },
  overflowX:  { tokenCat: null,     unitClass: null, keywords: OVERFLOW_KW },
  overflowY:  { tokenCat: null,     unitClass: null, keywords: OVERFLOW_KW },

  // ─── 过渡 / 动画 ───
  transitionDuration:       { tokenCat: 'duration',           unitClass: 'time', keywords: null },
  transitionTimingFunction: { tokenCat: 'easing',             unitClass: null,   keywords: null },
  transitionProperty:       { tokenCat: 'transitionProperty', unitClass: null,   keywords: null },
  animationDuration:        { tokenCat: 'duration',           unitClass: 'time', keywords: null },
}
