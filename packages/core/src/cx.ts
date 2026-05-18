import { cx as emotionCx } from '@emotion/css'

/** 透传 emotion `cx`，过滤掉 false/null/undefined。 */
export function cx(...args: (string | false | null | undefined)[]): string {
  return emotionCx(...args.filter((v): v is string => typeof v === 'string'))
}
