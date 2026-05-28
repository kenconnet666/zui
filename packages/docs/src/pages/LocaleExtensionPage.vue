<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">Locale 扩展</ZTitle>
    <ZParagraph>
      zui-vue 的国际化系统<strong>不依赖 vue-i18n</strong>(L14 决策),用一个扁平的
      <ZCode code="ZLocale" /> 字典契约表达组件文案。用户工程通过 <ZCode code="declare module" /> 给
      <ZCode code="ZLocaleRegistry" /> 扩展自家组件的 namespace,跟主题扩展同思路。
    </ZParagraph>

    <ZTitle :level="2">设计原则</ZTitle>
    <ApiTable
      :columns="[
        { key: 'topic', label: '原则', mono: true, width: '220px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          topic: '扁平 namespace',
          desc: '一级 namespace = 组件名(common / button / input / ...),二级 key = 具体文案,不嵌套深结构。',
        },
        {
          topic: '不接入 vue-i18n',
          desc: '避免强依赖。用户可在外层包 vue-i18n 把翻译后字符串塞进来作为 partial 喂给 ZBox。',
        },
        {
          topic: 'declaration merging 扩展',
          desc: '用户自定义组件通过 declare module 给 ZLocaleRegistry 扩 namespace,自动获得类型补全。',
        },
        {
          topic: 'mergeLocale 浅合并',
          desc: '嵌套 ZBox 用 :localePatch 局部覆盖,namespace + 字段两级浅合并;数组整体替换。',
        },
      ]"
    />

    <ZTitle :level="2">内建 namespace</ZTitle>
    <ZParagraph>
      <ZCode code="ZLocaleRegistry" /> 定义在 <ZCode code="provider/locale/types.ts" />, 8 个内建
      namespace:
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'ns', label: 'namespace', mono: true, width: '160px' },
        { key: 'iface', label: 'interface', mono: true, width: '200px' },
        { key: 'keys', label: '字段', mono: true, width: '320px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          ns: 'common',
          iface: 'ZLocaleCommon',
          keys: 'ok / cancel / confirm / close / clear / reset / search / loading / noData / empty / prev / next / back / more / retry',
          desc: '跨组件复用的公共词条。',
        },
        {
          ns: 'button',
          iface: 'ZLocaleButton',
          keys: 'loading',
          desc: 'ZButton loading 状态显示文案。',
        },
        {
          ns: 'input',
          iface: 'ZLocaleInput',
          keys: 'placeholder / clear',
          desc: 'ZInput 占位 + 清空提示。',
        },
        {
          ns: 'select',
          iface: 'ZLocaleSelect',
          keys: 'placeholder / noOptions',
          desc: 'ZSelect 占位 + 无选项提示。',
        },
        {
          ns: 'dialog',
          iface: 'ZLocaleDialog',
          keys: 'title / ok / cancel',
          desc: 'ZModal / Modal.confirm 默认标题与按钮文案。',
        },
        {
          ns: 'pagination',
          iface: 'ZLocalePagination',
          keys: 'prev / next / page / of / total / jumpTo / goto / pageSize',
          desc: 'ZPagination 上下页 / 总数 / 跳转。',
        },
        {
          ns: 'form',
          iface: 'ZLocaleForm',
          keys: 'required / invalid',
          desc: 'ZForm 默认校验提示。',
        },
        {
          ns: 'datePicker',
          iface: 'ZLocaleDatePicker',
          keys: 'placeholder / today / now / clear / confirm / weekdaysShort[7] / monthsShort[12] / months[12]',
          desc: 'ZDatePicker 完整文案 + 星期 / 月份名(数组,整体替换)。',
        },
      ]"
    />

    <ZTitle :level="2">两个内建 locale</ZTitle>
    <ZParagraph>
      <ZCode code="zhCN" />(默认)和 <ZCode code="enUS" /> 开箱即用,均为
      <ZCode code="ZLocale" /> 类型(含 <ZCode code="name" /> 字段用于调试 / 缓存 key)。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { zhCN, enUS, type ZLocale } from '@kenconnet666/zui-vue'

zhCN.name              // 'zh-CN'
zhCN.common.confirm    // '确认'
zhCN.button.loading    // '加载中'
zhCN.datePicker.weekdaysShort  // ['日', '一', '二', '三', '四', '五', '六']

enUS.name              // 'en-US'
enUS.common.confirm    // 'Confirm'
enUS.datePicker.weekdaysShort  // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`"
    />

    <ZTitle :level="2">ZBox locale 注入</ZTitle>
    <ZParagraph>
      跟 theme 同款 API:<ZCode code=":locale" /> 完整替换 / <ZCode code=":localePatch" /> 局部
      patch。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { ZBox, enUS, zhCN } from '@kenconnet666/zui-vue'
import { ref, computed } from 'vue'

const lang = ref<'zh' | 'en'>('zh')
const locale = computed(() => lang.value === 'en' ? enUS : zhCN)
<\/script>

<template>
  <ZBox :locale=&quot;locale&quot;>
    <button @click=&quot;lang = 'zh'&quot;>中文</button>
    <button @click=&quot;lang = 'en'&quot;>English</button>
    <App />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">useZLocale</ZTitle>
    <ZParagraph>
      子组件通过 <ZCode code="useZLocale()" /> 取当前字典。两种调用形态:全量 / 单 namespace。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// 全量(取整个 ZLocale)
function useZLocale(): Ref<ZLocale>

// 单 namespace(只订阅一个,推荐)
function useZLocale<NS extends keyof ZLocaleRegistry>(
  ns: NS,
): ComputedRef<ZLocaleRegistry[NS]>`"
    />
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { useZLocale } from '@kenconnet666/zui-vue'

// 单 namespace,IDE 自动补全字段
const t = useZLocale('button')
t.value.loading                  // '加载中' / 'Loading'

// common 是最常用的(确认 / 取消 / 关闭等通用词条)
const c = useZLocale('common')
c.value.confirm                  // '确认' / 'Confirm'

// 全量字典(罕见,debug 用)
const all = useZLocale()
all.value.name                   // 'zh-CN'
<\/script>

<template>
  <button>{{ c.confirm }}</button>
  <span v-if=&quot;loading&quot;>{{ t.loading }}</span>
</template>`"
    />

    <ZTitle :level="2">局部覆盖(localePatch)</ZTitle>
    <ZParagraph>
      嵌套 <ZCode code="ZBox" /> 用 <ZCode code=":locale-patch" /> 增量覆盖父字典—— namespace +
      字段两级浅合并,缺失字段继承父;数组(<ZCode code="weekdaysShort" /> /
      <ZCode code="monthsShort" />)整体替换。
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<template>
  <ZBox :locale=&quot;zhCN&quot;>
    <Header />

    <!-- 这棵子树用「您」代替「你」,其它字段继承 zhCN -->
    <ZBox :locale-patch=&quot;{
      common: { confirm: '您确定吗?', cancel: '稍候' },
      dialog: { title: '请您注意' },
    }&quot;>
      <FormalContent />
    </ZBox>
  </ZBox>
</template>`"
    />
    <ZParagraph>
      <ZCode code="mergeLocale" /> 也可作为 helper 直接调用,用于构造 ZLocale 字面量:
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`import { mergeLocale, zhCN } from '@kenconnet666/zui-vue'

const polite = mergeLocale(zhCN, {
  common:  { confirm: '您确定吗?', cancel: '稍候' },
  dialog:  { title: '请您注意' },
})

// polite.name === 'zh-CN'(继承父)
// polite.common.confirm === '您确定吗?'(覆盖)
// polite.common.ok === '确定'(继承父)`"
    />

    <ZTitle :level="2">新增自定义 namespace</ZTitle>
    <ZParagraph>
      用户自定义组件用 <ZCode code="declare module" /> 给 <ZCode code="ZLocaleRegistry" /> 扩
      namespace, 所有内建 + 用户 namespace 共用一套 <ZCode code="useZLocale" /> 入口与
      <ZCode code="locale-patch" />
      合并机制。
    </ZParagraph>

    <ZTitle :level="3">① 扩 Registry 类型</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// src/types/zui-locale.d.ts
declare module '@kenconnet666/zui-vue' {
  interface ZLocaleRegistry {
    myCard: {
      readMore: string
      collapse: string
    }
    productGrid: {
      addToCart: string
      outOfStock: string
      sortBy: string
    }
  }
}

export {}`"
    />

    <ZTitle :level="3">② 提供运行时翻译</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// src/locales/zh.ts
import { zhCN, mergeLocale } from '@kenconnet666/zui-vue'

export const myZh = mergeLocale(zhCN, {
  myCard: {
    readMore: '查看更多',
    collapse: '收起',
  },
  productGrid: {
    addToCart:  '加入购物车',
    outOfStock: '已售罄',
    sortBy:     '排序',
  },
})

// src/locales/en.ts
import { enUS, mergeLocale } from '@kenconnet666/zui-vue'

export const myEn = mergeLocale(enUS, {
  myCard: {
    readMore: 'Read more',
    collapse: 'Collapse',
  },
  productGrid: {
    addToCart:  'Add to cart',
    outOfStock: 'Out of stock',
    sortBy:     'Sort by',
  },
})`"
    />

    <ZTitle :level="3">③ 自定义组件内消费</ZTitle>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { useZLocale } from '@kenconnet666/zui-vue'

// IDE 自动补全 myCard.readMore / myCard.collapse
const t = useZLocale('myCard')
<\/script>

<template>
  <a>{{ t.readMore }}</a>
  <button>{{ t.collapse }}</button>
</template>`"
    />

    <ZTitle :level="3">④ 切语言</ZTitle>
    <ZCode
      :inline="false"
      lang="vue"
      :code="`<script setup lang=&quot;ts&quot;>
import { computed, ref } from 'vue'
import { ZBox } from '@kenconnet666/zui-vue'
import { myZh } from './locales/zh'
import { myEn } from './locales/en'

const lang = ref<'zh' | 'en'>('zh')
const locale = computed(() => lang.value === 'en' ? myEn : myZh)
<\/script>

<template>
  <ZBox :locale=&quot;locale&quot;>
    <MyCard />
    <ProductGrid />
  </ZBox>
</template>`"
    />

    <ZTitle :level="2">mergeLocale 合并规则</ZTitle>
    <ApiTable
      :columns="[
        { key: 'kind', label: '字段类型', mono: true, width: '180px' },
        { key: 'rule', label: '合并行为', mono: true, width: '200px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          kind: 'namespace 顶层',
          rule: '浅合并',
          desc: '父 + 子各自存在的 namespace 用子覆盖父,缺失的从父继承。',
        },
        {
          kind: 'namespace 内字段',
          rule: '浅合并',
          desc: '同 namespace 同 key 子覆盖父;缺失字段继承父。',
        },
        {
          kind: '数组(如 weekdaysShort)',
          rule: '整体替换',
          desc: '不做下标级合并 —— 传一半数组会丢另一半。',
        },
        { kind: 'name', rule: '子覆盖父', desc: '没传则保留父名称。' },
      ]"
    />

    <ZTitle :level="2">类型签名</ZTitle>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`/**
 * 完整 locale 对象。
 * name 用于调试与缓存 key;保持唯一(IETF BCP47 风格如 'zh-CN' / 'en-US')。
 */
export interface ZLocale extends ZLocaleRegistry {
  name: string
}

/** 嵌套 Provider 覆盖时允许只传部分字段。 */
export type DeepPartialLocale<T> = {
  [K in keyof T]?: T[K] extends ReadonlyArray<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartialLocale<T[K]>
      : T[K]
}

export type ZLocalePartial = DeepPartialLocale<ZLocale>`"
    />

    <ZTitle :level="2">与 vue-i18n 互操作</ZTitle>
    <ZParagraph>
      <ZCode code="ZLocale" /> 是<strong>静态字典</strong>——一次性提供整套翻译,不做运行时插值。
      如果业务方已经用了 vue-i18n(支持 ICU / 插值 / 多复数等),可以在 ZBox 上层
      <strong>把 i18n 的当前 locale 转译成 ZLocale 字面量</strong>喂进来:
    </ZParagraph>
    <ZCode
      :inline="false"
      lang="ts"
      :code="`// 把 vue-i18n 的翻译拍平成 ZLocale 形态
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { mergeLocale, zhCN } from '@kenconnet666/zui-vue'

const { t } = useI18n()

const locale = computed(() => mergeLocale(zhCN, {
  common: {
    ok:      t('zui.common.ok'),
    cancel:  t('zui.common.cancel'),
    confirm: t('zui.common.confirm'),
  },
  button: {
    loading: t('zui.button.loading'),
  },
}))

// 然后:<ZBox :locale=&quot;locale&quot;> ...`"
    />
    <ZParagraph>
      这样组件库内部继续用 <ZCode code="useZLocale" />,业务层享受 vue-i18n 的运行时能力。
    </ZParagraph>
  </section>
</template>
