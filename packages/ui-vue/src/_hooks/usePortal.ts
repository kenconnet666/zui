/**
 * `usePortal` —— Modal / Drawer / Tooltip / Popover 等浮层用 `<Teleport>` 渲染到 `<body>`(或自定义
 * target)的统一工具。
 *
 * **能力**:
 * 1. `usePortal(target?)` composable —— 解析 target 字符串选择器或 Element,返回 `Readonly<Ref<HTMLElement | null>>`,
 *    并在 SSR 友好的 onMounted 时机解析(避免 server side `document` 调用)
 * 2. `<ZPortal>` 组件 —— 模板侧直接 `<ZPortal :to="'#my-target'">...</ZPortal>` 包装 `<Teleport>`
 *
 * 默认 target:`document.body`。
 *
 * @example
 * ```vue
 * <ZPortal>
 *   <Modal />
 * </ZPortal>
 * <!-- 等价于 -->
 * <Teleport to="body"><Modal /></Teleport>
 * ```
 */
import { defineComponent, h, onMounted, ref, type Ref } from 'vue'

/**
 * 解析 portal target,返回 ref。
 *
 * @param target - css selector(`'#root'` / `'.dialog-container'`)或 Element / null;
 *                  null / undefined 表示 `document.body`
 */
export function usePortal(target?: string | HTMLElement | null): Ref<HTMLElement | null> {
  const el = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!target) {
      el.value = document.body
      return
    }
    if (typeof target === 'string') {
      el.value = document.querySelector<HTMLElement>(target)
      return
    }
    el.value = target
  })

  return el
}

/**
 * `<ZPortal>` —— 内置 `<Teleport>` 包装组件,默认 to=`'body'`。
 *
 * **用途**:供需要 portal 渲染的组件直接在模板里包一层,无需手写 `<Teleport>` + 处理 `disabled`。
 */
export const ZPortal = defineComponent({
  name: 'ZPortal',
  props: {
    /** Teleport 目标 css selector / Element / null;默认 `'body'`。 */
    to: {
      type: [String, Object] as unknown as () => string | HTMLElement,
      default: 'body',
    },
    /** 禁用 portal(原地渲染)。 */
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h(
        // Vue Teleport 走 <Teleport> 组件;runtime 自动找
        // 这里写 'Teleport' 字符串名走 Vue 编译期内建组件查找。
        'Teleport' as unknown as ReturnType<typeof defineComponent>,
        { to: props.to, disabled: props.disabled },
        slots.default?.(),
      )
  },
})
