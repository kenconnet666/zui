import { injectGlobal as emotionInjectGlobal } from '@emotion/css'
import type { CSSObject } from '@emotion/css/create-instance'

/** 透传 emotion `injectGlobal`。 */
export function injectGlobal(styles: CSSObject | string): void {
  emotionInjectGlobal(styles as never)
}
