/**
 * `useRipple` —— Material Design 风波纹效果。**ui-vue 自写**(VueUse 无对应)。
 *
 * **机制**:
 * 1. pointerdown 监听 → 基于点击坐标 + element bounding 计算 ripple 中心
 * 2. 动态插入 `<span class="zui-ripple">`,scale + opacity 动画(`@keyframes`)
 * 3. animationend 时自动移除 DOM,不留泄漏
 *
 * **样式注入**(全局一次性):
 * 第一次使用时往 `<head>` 注入 keyframes + ripple span 基础样式;包装 ripple 容器需要
 * `position: relative` + `overflow: hidden`(组件自己加,这里只管 ripple 行为)。
 *
 * @example
 * ```vue
 * <script setup>
 * const target = ref<HTMLElement | null>(null)
 * useRipple(target, { color: 'rgba(255,255,255,0.4)' })
 * </script>
 * <template>
 *   <button ref="target" style="position: relative; overflow: hidden;">按钮</button>
 * </template>
 * ```
 */
import { onScopeDispose, watch, type Ref } from 'vue'

export interface UseRippleOptions {
  /**
   * ripple 颜色,默认 `'currentColor'` —— 继承宿主元素 `color`,自动适配按钮 variant 与亮/暗主题。
   * 透明度由 `.zui-ripple` 基础 `opacity`(0.35)统一控制,故传 token 实色即可,不必自带 alpha。
   */
  color?: string
  /** 动画时长 ms,默认 `400`(Material 推荐 350~450)。 */
  duration?: number
  /** 是否禁用(响应式),默认 `false`(启用)。 */
  disabled?: Ref<boolean> | boolean
}

const RIPPLE_STYLE_ID = 'zui-ripple-style'
const RIPPLE_KEYFRAMES = `
@keyframes zui-ripple-scale {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}
.zui-ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  opacity: 0.35;
  pointer-events: none;
  animation-name: zui-ripple-scale;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: forwards;
}
`

function ensureGlobalStyle(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(RIPPLE_STYLE_ID)) return
  const style = document.createElement('style')
  style.id = RIPPLE_STYLE_ID
  style.textContent = RIPPLE_KEYFRAMES
  document.head.appendChild(style)
}

function isDisabled(d: UseRippleOptions['disabled']): boolean {
  if (typeof d === 'boolean') return d
  if (d && 'value' in d) return d.value
  return false
}

/**
 * 在 `targetRef` 元素上启用波纹效果。
 *
 * 组件 setup 内调用,组件销毁时自动 cleanup pointerdown listener。
 */
export function useRipple(
  targetRef: Readonly<Ref<HTMLElement | null | undefined>>,
  opts: UseRippleOptions = {},
): void {
  const color = opts.color ?? 'currentColor'
  const duration = opts.duration ?? 400

  function onPointerDown(e: PointerEvent): void {
    if (isDisabled(opts.disabled)) return
    const target = targetRef.value
    if (!target) return

    ensureGlobalStyle()

    const rect = target.getBoundingClientRect()
    // ripple 直径取 element 对角线的 2 倍,保证从任意点击位置都能扩散到全元素
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.className = 'zui-ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.backgroundColor = color
    ripple.style.animationDuration = `${duration}ms`

    target.appendChild(ripple)
    ripple.addEventListener(
      'animationend',
      () => {
        ripple.remove()
      },
      { once: true },
    )
  }

  // 用 watch 跟随 targetRef 挂载/卸载来 attach/detach listener
  let attachedTo: HTMLElement | null = null

  watch(
    targetRef,
    el => {
      if (attachedTo) {
        attachedTo.removeEventListener('pointerdown', onPointerDown)
        attachedTo = null
      }
      if (el) {
        el.addEventListener('pointerdown', onPointerDown)
        attachedTo = el
      }
    },
    { immediate: true, flush: 'post' },
  )

  onScopeDispose(() => {
    if (attachedTo) {
      attachedTo.removeEventListener('pointerdown', onPointerDown)
      attachedTo = null
    }
  })
}
