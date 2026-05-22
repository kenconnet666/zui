/**
 * `usePopper` —— `@floating-ui/vue` 的 `useFloating` 上薄薄包一层,给 zui 默认 `placement` /
 * `offset` / `middleware` 预设,降低使用心智。
 *
 * **使用场景**:Popover / Tooltip / Dropdown / Select 列表层定位。
 *
 * @example
 * ```vue
 * <script setup>
 * const reference = ref<HTMLElement | null>(null)
 * const floating = ref<HTMLElement | null>(null)
 * const { floatingStyles, placement, update } = usePopper(reference, floating, {
 *   placement: 'bottom-start',
 *   offset: 8,
 * })
 * </script>
 * <template>
 *   <button ref="reference">触发</button>
 *   <div ref="floating" :style="floatingStyles">浮层</div>
 * </template>
 * ```
 */
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type FloatingElement,
  type Middleware,
  type Placement,
  type ReferenceElement,
  type Strategy,
} from '@floating-ui/vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface UsePopperOptions {
  /** 推荐 placement,默认 `'bottom'`。floating-ui 会按 `flip` middleware 自动翻转避开 viewport 边界。 */
  placement?: MaybeRefOrGetter<Placement | undefined>
  /** CSS position 策略,默认 `'absolute'`(嵌套 transform 容器内建议 `'fixed'`)。 */
  strategy?: MaybeRefOrGetter<Strategy | undefined>
  /** 浮层跟 reference 元素之间的距离 px,默认 `8`(zui 默认间距)。 */
  offset?: number
  /** 是否打开。控制 floating-ui 是否计算 / 是否启用 autoUpdate。默认 `true`(始终计算)。 */
  open?: MaybeRefOrGetter<boolean | undefined>
  /** 额外 middleware(追加在内置 `offset + flip + shift` 之后)。 */
  middleware?: Middleware[]
}

/**
 * 包装 `useFloating`,内置 `offset + flip + shift` 三件套 + autoUpdate。
 */
export function usePopper(
  reference: Readonly<Ref<ReferenceElement | null | undefined>>,
  floating: Readonly<Ref<FloatingElement | null | undefined>>,
  opts: UsePopperOptions = {},
): ReturnType<typeof useFloating> {
  const extra = opts.middleware ?? []
  return useFloating(reference, floating, {
    placement: opts.placement ?? 'bottom',
    strategy: opts.strategy ?? 'absolute',
    open: opts.open,
    middleware: [offset(opts.offset ?? 8), flip(), shift({ padding: 8 }), ...extra],
    whileElementsMounted: autoUpdate,
  })
}
