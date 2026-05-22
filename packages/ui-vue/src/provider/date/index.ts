/**
 * `@kenconnet666/zui-vue/provider/date` —— 日期 / 时区配置子入口。
 *
 * 仅供 `provider/` 根 `index.ts` 内部 re-export 使用,**不作为业务侧 import 路径**
 * (全包单入口,业务方一律 `from '@kenconnet666/zui-vue'`)。
 */
export { useZDate, type UseZDateReturn } from './useZDate'
