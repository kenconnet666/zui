/**
 * 内建支持的 CSS 关键字（无 `_` 前缀）。
 *
 * 用户访问 `chain.display.flex` 时会通过这里转换成 CSS 值（驼峰 → kebab）。
 */
export const KEYWORD_TO_CSS: Record<string, string> = {
  // 全局
  inherit: 'inherit',
  unset: 'unset',
  initial: 'initial',
  revert: 'revert',
  revertLayer: 'revert-layer',

  // display
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  flex: 'flex',
  inlineFlex: 'inline-flex',
  grid: 'grid',
  inlineGrid: 'inline-grid',
  none: 'none',
  contents: 'contents',

  // position
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',

  // 通用
  auto: 'auto',
  normal: 'normal',
  bold: 'bold',

  // size keywords
  minContent: 'min-content',
  maxContent: 'max-content',
  fitContent: 'fit-content',

  // color keywords
  white: 'white',
  black: 'black',
  transparent: 'transparent',
  currentColor: 'currentColor',

  // cursor
  default: 'default',
  pointer: 'pointer',
  text: 'text',
  wait: 'wait',
  move: 'move',
  help: 'help',
  notAllowed: 'not-allowed',
  grab: 'grab',
  grabbing: 'grabbing',

  // visibility
  visible: 'visible',
  hidden: 'hidden',
  collapse: 'collapse',

  // overflow
  scroll: 'scroll',
  clip: 'clip',
}

export const GLOBAL_KEYWORDS = ['inherit', 'unset', 'initial', 'revert', 'revertLayer'] as const
