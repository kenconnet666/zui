/**
 * `useZIem` —— 取最近祖先 `<ZBox>` 注入的 iem 当前像素值。
 *
 * **设计动机**:zui 默认 `:iem='0.8333vw'`(响应式 vw)情况下,CSS cascade 能让组件
 * 自然渲染出对应像素,但 **JS 算法层(虚拟列表 / scrollTop 计算)需要数字**。本 hook
 * 让子组件无需 DOM probe 就能拿到当前 iem 的实际 px 数值,且**响应式跟随窗口 resize**。
 *
 * **行为**:
 * - 在 `<ZBox>` 子树内 → inject `Z_IEM_PX_KEY`,返回响应式数值
 * - 树外 / 无 `<ZBox>` → dev 警告 + fallback `shallowRef(16)`
 *
 * **典型用法**(虚拟列表):
 * ```ts
 * const iemPx = useZIem()
 * const itemSizePx = computed(() => props.itemSize * iemPx.value)
 * // iemPx 跟随 ZBox vw 模式 + 窗口 resize 自动变,itemSizePx 也自动响应
 * ```
 */
import { inject, shallowRef, type Ref } from 'vue'
import { Z_IEM_PX_KEY } from '../provider/keys'

export function useZIem(): Ref<number> {
  const injected = inject(Z_IEM_PX_KEY, null)
  if (injected) return injected
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    console.warn(
      '[zui-vue/useZIem] 调用点不在 <ZBox> 子树内,回落 shallowRef(16)。' +
        '\n  需要响应式 iem(虚拟列表等)请在根组件外包一层 <ZBox :iem="ZIemPreset.default">。',
    )
  }
  return shallowRef(16)
}
