/**
 * `_internal/sx.ts` —— 复合组件子节点配置 `SxObject` 类型与 helper。
 *
 * **背景**(L5):复合组件(ZCard / ZModal / ZTabs ...)的每个子节点(head / body / foot /
 * mask / panel ...)需要让用户能传:
 * - `css` —— chain factory,该节点样式逃生口
 * - `class` / `style` —— Vue 标准三种形式
 * - `ref` —— template ref(用户拿到子节点 DOM)
 * - 任意 HTML 属性(`onClick` / `id` / `role` / `aria-*` / `data-*` ...)平铺透传
 *
 * 用一个 `SxObject` 平铺对象表达上述全部能力,组件内部用 `applySx` + `extractSxAttrs`
 * helper 拆开使用。
 *
 * **不对外暴露**:文件名带 `_` 前缀,仅供 ui-vue 包内组件使用;`SxObject` 类型在用户侧
 * 通过组件 props(如 `sxHead?: SxObject`)间接出现,不直接 import。
 */
import type { Chain, ThemeSchema } from '@kenconnet666/zui-core'
import type { HTMLAttributes, VNodeRef } from 'vue'
import type { ZuiSchema } from '../provider/theme'

/**
 * 复合组件子节点配置 —— **平铺**该子节点的所有 props 和 DOM attrs。
 *
 * **支持的字段**:
 * - `css`:chain factory(样式逃生口)
 * - `class` / `style`:Vue 标准 binding
 * - `ref`:template ref(string / function / Ref 对象 — Vue VNodeRef)
 * - 任意 HTMLAttributes(`onClick` / `id` / `aria-*` ...)+ 任意自定义 attr(放宽到 `unknown`)
 *
 * @example
 * <ZCard
 *   :sx-head="{
 *     css: (s) => { s.background.color._primary.alpha(8) },
 *     onClick: handleHeadClick,
 *     'aria-label': 'card header',
 *     ref: headDomRef,                  // 拿到 head DOM
 *     'data-custom': 'value',           // 自定义 attr 不报错
 *   }"
 * />
 */
export type SxObject<S extends ThemeSchema = ZuiSchema> = {
  /** chain factory —— 该节点样式逃生口。 */
  css?: (s: Chain<S>) => void
  /** Vue 标准 class 形式(字符串 / 数组 / 对象)。 */
  class?: string | string[] | Record<string, boolean>
  /** Vue 标准 style 形式(字符串 / 对象)。 */
  style?: string | Record<string, string | number>
  /** template ref(string / function / Ref 对象)— 让用户拿到该子节点 DOM。 */
  ref?: VNodeRef
} & Omit<HTMLAttributes, 'class' | 'style' | 'ref'>
  & Record<string, unknown>

/**
 * 应用 SxObject 的 `css` factory 到 chain(若有)。
 *
 * 用于组件内部 `icss(theme, (s) => { ... applySx(s, props.sxHead) })` 链式调用。
 */
export function applySx(s: Chain<ZuiSchema>, sx?: SxObject): void {
  if (sx?.css) sx.css(s)
}

/**
 * 从 SxObject 中分离 `class` / `style` / `ref` / 其它 attrs,供模板使用。
 *
 * `css` 字段已被 `applySx` 消费,这里直接丢弃。
 *
 * @example
 * const sxHeadAttrs = computed(() => extractSxAttrs(props.sxHead))
 * // <div
 * //   :ref="sxHeadAttrs.ref"
 * //   :class="[headClass, sxHeadAttrs.class]"
 * //   :style="sxHeadAttrs.style"
 * //   v-bind="sxHeadAttrs.attrs"
 * // />
 */
export function extractSxAttrs(sx?: SxObject): {
  class: SxObject['class'] | undefined
  style: SxObject['style'] | undefined
  ref: VNodeRef | undefined
  attrs: Record<string, unknown>
} {
  if (!sx) return { class: undefined, style: undefined, ref: undefined, attrs: {} }

  const { css: _css, class: cls, style, ref, ...attrs } = sx
  return { class: cls, style, ref: ref as VNodeRef | undefined, attrs }
}
