/** overlay 滚动条轨道上下各保留的内边距（px）。 */
export const SCROLL_TRACK_MARGIN = 4

/** thumb 最小高度（px），防止内容极长时 thumb 缩到不可用。 */
export const SCROLL_THUMB_MIN_PX = 24

/** 返回亮/暗主题下 thumb 的普通色与 hover 色。 */
export function scrollbarThumbColors(dark: boolean): { normal: string; hover: string } {
  return dark
    ? { normal: 'rgba(255,255,255,0.32)', hover: 'rgba(255,255,255,0.52)' }
    : { normal: 'rgba(0,0,0,0.32)',       hover: 'rgba(0,0,0,0.52)' }
}

/** 计算 thumb 高度（px）。 */
export function calcScrollThumbPx(viewport: number, total: number): number {
  const track = viewport - SCROLL_TRACK_MARGIN
  return Math.max(SCROLL_THUMB_MIN_PX, (viewport / total) * track)
}

/** 计算 thumb 相对轨道顶部的偏移（px）。 */
export function calcScrollThumbTop(
  scrollPos: number,
  total: number,
  viewport: number,
  thumbPx: number,
): number {
  const maxScroll = total - viewport
  if (maxScroll <= 0) return 0
  const track = viewport - SCROLL_TRACK_MARGIN
  return (scrollPos / maxScroll) * (track - thumbPx)
}
