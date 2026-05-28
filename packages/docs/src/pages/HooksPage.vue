<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">内置 hooks</ZTitle>
    <ZParagraph>
      <ZCode code="@kenconnet666/zui-vue" /> 在
      <ZCode code="_hooks/" /> 目录提供一组「轻量包装」composable,
      给组件库自身和业务方共用。优先包装 <strong>VueUse</strong>,不够再 wrap floating-ui / Teleport,
      最后自写。这些 hook 标注为 <em>internal</em> —— 业务方可用但不算核心 API surface, API 变更不算
      BREAKING。
    </ZParagraph>

    <ZTitle :level="2">速查</ZTitle>
    <ApiTable
      :columns="[
        { key: 'name', label: 'hook', mono: true, width: '200px' },
        { key: 'source', label: '来源', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'useZId',
          source: '包装 Vue useId',
          desc: 'SSR-friendly 唯一 id,加 zui- 前缀,可加语义后缀。',
        },
        {
          name: 'usePortal',
          source: '包装 Teleport',
          desc: '把浮层渲染到 body 或自定义 target;附带 <ZPortal> 组件版。',
        },
        {
          name: 'useEscapeStack',
          source: '自写',
          desc: 'LIFO 栈 ESC 监听,多层浮层按下 Escape 只关最顶层。',
        },
        {
          name: 'usePopper',
          source: '包装 floating-ui',
          desc: 'useFloating 上层,内置 offset + flip + shift + autoUpdate。',
        },
        {
          name: 'useRipple',
          source: '自写',
          desc: 'Material Design 波纹效果,pointerdown 触发,animationend 自清。',
        },
      ]"
    />

    <ZTitle :level="2">useZId</ZTitle>
    <ZParagraph>
      包装 Vue 3.5+ 内置 <ZCode code="useId()" />,加 <ZCode code="zui-" /> 前缀避免与宿主页面 id
      冲突。 可选语义后缀,用于复合组件区分多个子节点 id。SSR 安全(Vue 内置 useId 跨端一致)。
    </ZParagraph>
    <ZCode :inline="false" lang="ts" :code="`function useZId(suffix?: string): string`" />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { useZId } from '@kenconnet666/zui-vue'

const labelId = useZId()              // 'zui-v-1'
const inputId = useZId('input')       // 'zui-v-1-input'
const descId  = useZId('desc')        // 'zui-v-1-desc'
<\/script>

<template>
  <label :id=&quot;labelId&quot; :for=&quot;inputId&quot;>名称</label>
  <input :id=&quot;inputId&quot; :aria-labelledby=&quot;labelId&quot; :aria-describedby=&quot;descId&quot; />
  <p :id=&quot;descId&quot;>请输入您的名字</p>
</template>`"
    />
    <ApiTable
      :columns="[
        { key: 'name', label: '参数', mono: true, width: '140px' },
        { key: 'type', label: '类型', mono: true, width: '160px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'suffix',
          type: 'string | undefined',
          desc: '可选语义后缀。无 → zui-{vueId};有 → zui-{vueId}-{suffix}。',
        },
      ]"
    />

    <ZTitle :level="2">usePortal &amp; ZPortal</ZTitle>
    <ZParagraph>
      Modal / Drawer / Tooltip / Popover 等浮层用 <ZCode code="&lt;Teleport&gt;" /> 渲染到
      <ZCode code="&lt;body&gt;" />(或自定义 target)的统一工具。两种形式:
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// composable 形式(setup 内拿到 target ref)
function usePortal(target?: string | HTMLElement | null): Ref<HTMLElement | null>

// 组件形式(模板内直接包一层)
const ZPortal: { props: { to: string | HTMLElement; disabled: boolean } }`"
    />
    <ZParagraph>使用 ZPortal 组件版:</ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZPortal } from '@kenconnet666/zui-vue'
<\/script>

<template>
  <!-- 默认 to=&quot;body&quot; -->
  <ZPortal>
    <Modal />
  </ZPortal>

  <!-- 自定义目标 -->
  <ZPortal to=&quot;#tooltip-layer&quot;>
    <Tooltip />
  </ZPortal>

  <!-- 禁用 portal(原地渲染),适合测试 -->
  <ZPortal :disabled=&quot;isTest&quot;>
    <Drawer />
  </ZPortal>
</template>`"
    />
    <ZParagraph>使用 composable 版:</ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { usePortal } from '@kenconnet666/zui-vue'

// 默认 body
const target = usePortal()

// 自定义 CSS selector
const tip = usePortal('#tooltip-layer')

// 已知 Element
const root = usePortal(document.getElementById('app'))
<\/script>

<template>
  <Teleport :to=&quot;target&quot; v-if=&quot;target&quot;>
    <Modal />
  </Teleport>
</template>`"
    />
    <ApiTable
      :columns="[
        { key: 'name', label: '参数', mono: true, width: '120px' },
        { key: 'type', label: '类型', mono: true, width: '300px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          name: 'target',
          type: 'string | HTMLElement | null',
          desc: 'CSS selector 字符串 / Element / null;null/undefined → document.body。',
        },
      ]"
    />

    <ZTitle :level="2">useEscapeStack</ZTitle>
    <ZParagraph>
      多层浮层(Modal 套 Popover、Dropdown 套 Tooltip 等)同时监听 Escape 时, 朴素的
      <ZCode code="window.addEventListener" /> 会让所有 handler 一起触发——全部关闭,错。
      <ZCode code="useEscapeStack" /> 维护一个全局 LIFO 栈,按下 Escape
      <strong>只 dispatch 给最顶层 enabled 的 handler</strong>。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`function useEscapeStack(
  onEscape: () => void,
  opts?: { enabled?: Ref<boolean> },
): void`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ref } from 'vue'
import { useEscapeStack } from '@kenconnet666/zui-vue'

const open = ref(false)

// 仅当 open=true 时才响应 Escape
useEscapeStack(() => (open.value = false), { enabled: open })
<\/script>`"
    />
    <ZParagraph>
      底层细节:全局只附加<strong>一个</strong> <ZCode code="keydown" /> listener(capture);
      调度时从栈顶往下找第一个 enabled 的 entry 并 <ZCode code="stopPropagation" />; 组件销毁时自动
      pop,栈空则 detach listener,零泄漏。
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'name', label: '参数', mono: true, width: '160px' },
        { key: 'type', label: '类型', mono: true, width: '220px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        { name: 'onEscape', type: '() => void', desc: '按下 Escape 时的回调。' },
        {
          name: 'opts.enabled',
          type: 'Ref<boolean>',
          desc: '控制此 handler 是否生效。默认 ref(true)(始终生效)。设为 false 时 dispatch 会跳过此 entry 找下一层。',
        },
      ]"
    />

    <ZTitle :level="2">usePopper</ZTitle>
    <ZParagraph>
      <ZCode code="@floating-ui/vue" /> 的 <ZCode code="useFloating" /> 上薄薄包一层, 给 zui 默认的
      placement / offset / middleware 预设—— <ZCode code="offset(8)" /> + <ZCode code="flip()" /> +
      <ZCode code="shift({ padding: 8 })" /> 三件套,加 <ZCode code="autoUpdate" />。降低使用心智,让
      Tooltip / Popover / Dropdown / Select 列表层定位的样板代码大幅缩减。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface UsePopperOptions {
  /** 推荐 placement,默认 'bottom'(flip 会自动避开 viewport 边界) */
  placement?: MaybeRefOrGetter<Placement | undefined>
  /** CSS position 策略,默认 'absolute'(嵌套 transform 容器内建议 'fixed') */
  strategy?: MaybeRefOrGetter<Strategy | undefined>
  /** 浮层跟 reference 之间的距离 px,默认 8 */
  offset?: number
  /** 是否打开。控制 floating-ui 是否计算 / 是否启用 autoUpdate。默认 true */
  open?: MaybeRefOrGetter<boolean | undefined>
  /** 额外 middleware(追加在内置 offset + flip + shift 之后) */
  middleware?: Middleware[]
}

function usePopper(
  reference: Readonly<Ref<ReferenceElement | null | undefined>>,
  floating:  Readonly<Ref<FloatingElement | null | undefined>>,
  opts?: UsePopperOptions,
): ReturnType<typeof useFloating>`"
    />

    <ZTitle :level="3">基础用法</ZTitle>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ref } from 'vue'
import { usePopper } from '@kenconnet666/zui-vue'

const reference = ref<HTMLElement | null>(null)
const floating  = ref<HTMLElement | null>(null)

const { floatingStyles, placement } = usePopper(reference, floating)
<\/script>

<template>
  <button ref=&quot;reference&quot;>触发</button>
  <div ref=&quot;floating&quot; :style=&quot;floatingStyles&quot;>浮层</div>
</template>`"
    />

    <ZTitle :level="3">placement / offset</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`const { floatingStyles } = usePopper(reference, floating, {
  placement: 'bottom-start',
  offset: 12,
})

// placement 也可以是响应式
const dynamicPlacement = ref<Placement>('bottom')
const { floatingStyles } = usePopper(reference, floating, {
  placement: dynamicPlacement,    // ref 自动 unwrap
})`"
    />

    <ZTitle :level="3">追加 middleware</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { arrow, size } from '@floating-ui/vue'

const arrowEl = ref<HTMLElement | null>(null)

const { floatingStyles, middlewareData } = usePopper(reference, floating, {
  middleware: [
    arrow({ element: arrowEl }),                                  // 加箭头
    size({                                                          // 限制最大尺寸
      apply({ availableHeight, elements }) {
        elements.floating.style.maxHeight = \`\${availableHeight}px\`
      },
    }),
  ],
})`"
    />

    <ZTitle :level="2">useRipple</ZTitle>
    <ZParagraph>
      Material Design 风波纹效果。VueUse 无对应实现,zui-vue <strong>自写</strong>。 基于 pointerdown
      坐标 + element bounding 计算波纹中心,动态插入
      <ZCode code="&lt;span class='zui-ripple'&gt;" />,scale + opacity 动画,animationend 自动移除
      DOM。 第一次使用时往 <ZCode code="&lt;head&gt;" /> 注入 keyframes(全局一次),包装 ripple
      容器需要 <ZCode code="position: relative" /> + <ZCode code="overflow: hidden" />(组件自己加)。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`interface UseRippleOptions {
  /** ripple 颜色,默认 'rgba(255,255,255,0.35)' */
  color?: string
  /** 动画时长 ms,默认 400(Material 推荐 350~450) */
  duration?: number
  /** 是否禁用(响应式),默认 false */
  disabled?: Ref<boolean> | boolean
}

function useRipple(
  targetRef: Readonly<Ref<HTMLElement | null | undefined>>,
  opts?: UseRippleOptions,
): void`"
    />

    <ZTitle :level="3">默认开启的组件</ZTitle>
    <ZParagraph>
      <ZCode code="ZButton" /> 默认在 setup 内调用 <ZCode code="useRipple(rootRef)" />, 传入的
      <ZCode code="disabled" /> 是组件 prop 派生的响应式 ref——禁用按钮自动不出波纹。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ref, toRef } from 'vue'
import { useRipple } from '@kenconnet666/zui-vue'

const props = defineProps<{ disabled?: boolean }>()
const root = ref<HTMLElement | null>(null)

useRipple(root, { disabled: toRef(props, 'disabled') })
<\/script>

<template>
  <button ref=&quot;root&quot; style=&quot;position: relative; overflow: hidden&quot;>
    <slot />
  </button>
</template>`"
    />

    <ZTitle :level="3">自定义颜色 / 时长</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// 暗色按钮用浅色波纹
useRipple(root, {
  color: 'rgba(255, 255, 255, 0.4)',
  duration: 500,
})

// 浅色按钮用深色波纹
useRipple(root, {
  color: 'rgba(0, 0, 0, 0.15)',
})

// 跟随当前文字色(text variant 按钮)
useRipple(root, {
  color: 'currentColor',
})`"
    />

    <ZTitle :level="3">关闭波纹</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// 静态关闭:不调用即可
// 动态关闭:传 disabled
const noRipple = ref(false)
useRipple(root, { disabled: noRipple })

// 整组组件关闭(业务侧约定):传 prop 控制
defineProps<{ ripple?: boolean }>()
useRipple(root, {
  disabled: computed(() => props.ripple === false),
})`"
    />

    <ZTitle :level="2">导入路径</ZTitle>
    <ZParagraph>
      所有 hook 都通过<strong>主入口</strong>导出(2026-05-23,L12 决策:取消所有 subpath exports):
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import {
  useZId,
  usePortal, ZPortal,
  useEscapeStack,
  usePopper, type UsePopperOptions,
  useRipple, type UseRippleOptions,
} from '@kenconnet666/zui-vue'`"
    />
  </section>
</template>
