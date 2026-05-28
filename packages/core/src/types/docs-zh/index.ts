/**
 * docs-zh 聚合入口。
 *
 * 各分组通过 default export 暴露 `Record<propName, PropertyDocZh>`，
 * 本文件汇总所有分组到 `PROPERTY_DOCS_ZH` 并校验 key 不重复。
 *
 * 用法：`scripts/generate-properties.mjs` 读 banner 与 PROPERTY_DOCS_ZH，
 * 把中文文档注入到 `properties.generated.ts` 的 JSDoc。
 */

import animation from './animation'
import background from './background'
import border from './border'
import box from './box'
import colors from './colors'
import container from './container'
import flex from './flex'
import grid from './grid'
import interaction from './interaction'
import layout from './layout'
import mask from './mask'
import misc from './misc'
import scroll from './scroll'
import svg from './svg'
import transform from './transform'
import typography from './typography'

import type { DocsGroup } from './_common'

export { FILE_BANNER_ZH } from './banner'
export type {
  PropertyDocZh,
  FullPropertyDoc,
  ExtendsPropertyDoc,
  KeywordGroup,
  SyntaxRow,
  DocsGroup,
} from './_common'

/** 按分组返回所有 docs；generator 用来报"重复 key 在哪两个分组里"的诊断。 */
export const DOCS_BY_GROUP: Record<string, DocsGroup> = {
  animation,
  background,
  border,
  box,
  colors,
  container,
  flex,
  grid,
  interaction,
  layout,
  mask,
  misc,
  scroll,
  svg,
  transform,
  typography,
}

/** 聚合所有分组到单一 map。重复 key 在 generator 中报错。 */
export const PROPERTY_DOCS_ZH: DocsGroup = (() => {
  const acc: DocsGroup = {}
  for (const [groupName, group] of Object.entries(DOCS_BY_GROUP)) {
    for (const [propName, doc] of Object.entries(group)) {
      if (propName in acc) {
        throw new Error(
          `[docs-zh] 属性 \`${propName}\` 在多个分组中重复定义：` +
            `第二次出现在 ${groupName} 分组。请确保每个属性只在一个分组文件中声明。`,
        )
      }
      acc[propName] = doc
    }
  }
  return acc
})()
