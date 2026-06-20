<script setup lang="ts">
import { ZTitle, ZParagraph, ZCode } from '@kenconnet666/zui-vue'
import ApiTable from '../components/ApiTable.vue'
import CodeBlock from '../components/CodeBlock.vue'
</script>

<template>
  <section>
    <ZTitle :level="1">SSR &amp; tree-shake</ZTitle>
    <ZParagraph>
      zui 基于 <ZCode code="@emotion/css" />,SSR 支持需要业务方在<strong
        >服务端创建独立 emotion 实例</strong
      >
      并在响应结束时 flush critical CSS。tree-shake 由 zui 自身的
      <strong>单入口 + rollup preserveModules</strong>
      打包策略保证——业务方无需特殊配置。本文给出当前的能力边界、 推荐打包配置与已知坑。
    </ZParagraph>

    <ZTitle :level="2">当前 SSR 支持现状</ZTitle>
    <ApiTable
      :columns="[
        { key: 'topic', label: '能力', mono: true, width: '260px' },
        { key: 'status', label: '状态', mono: true, width: '140px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          topic: 'createIcssInstance 多实例',
          status: '已实现',
          desc: 'zui-core 导出 createIcssInstance(emotion),给请求级 emotion cache 绑定独立 icss / cx / toClassName。',
        },
        {
          topic: '内置 hooks SSR-friendly',
          status: '已实现',
          desc: 'usePortal 在 onMounted 后再访问 document;useZId 用 Vue 3.5 内置 useId,跨端一致。',
        },
        {
          topic: 'docs 站点是否启用 SSR',
          status: '未启用(SPA)',
          desc: 'packages/docs 是 hash 路由 SPA,纯 Vite build,无 SSR / SSG。zui-vue 自身的 SSR 集成范例待补充。',
        },
        {
          topic: 'extractCritical 风格 critical CSS',
          status: '部分',
          desc: '通过 cache.flush() 获取本请求注入的 className,业务方手动拼到 <head>(详见下方代码)。',
        },
        {
          topic: 'Nuxt 一键集成',
          status: '未提供',
          desc: '未来可能出 @kenconnet666/zui-nuxt module。当前需要业务方手写 server plugin。',
        },
      ]"
    />

    <ZTitle :level="2">createIcssInstance —— 多实例入口</ZTitle>
    <ZParagraph>
      <ZCode code="@emotion/css" /> 默认导出的 <ZCode code="css" /> / <ZCode code="cx" /> 等
      <strong>全局共享一份 cache</strong>,SSR 场景多个请求并发会污染缓存。
      <ZCode code="createIcssInstance(emotion)" /> 把所有 zui 操作绑到给定 emotion 实例,
      每次请求新建 cache,响应结束 flush + 注入到 HTML <ZCode code="&lt;head&gt;" />。
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`import { createIcssInstance } from '@kenconnet666/zui-core'
import createCache from '@emotion/cache'
import createEmotion from '@emotion/css/create-instance'

// 1. 每次请求新建 cache
const cache = createCache({ key: 'zui' })
const emotion = createEmotion(cache)

// 2. 绑定 zui 操作到此 emotion 实例
const { icss, cx, toClassName, ikeyframes, injectGlobal, createTheme } =
  createIcssInstance(emotion)

// 3. 用上面拿到的 icss / cx 渲染整个 SSR 树
// ... 渲染逻辑

// 4. 渲染完后 flush critical CSS
const criticalIds = emotion.flush()
const criticalCss = criticalIds
  .map((id) => cache.inserted[id])
  .filter((v): v is string => typeof v === 'string')
  .join('\\n')

// 5. 注入到 HTML <head>
const html = \`<style data-emotion=&quot;zui\${criticalIds.join(' ')}&quot;>\${criticalCss}</style>\``"
    />

    <ZTitle :level="2">Nuxt 集成模板</ZTitle>
    <ZParagraph>
      Nuxt 用 <ZCode code="useState" /> 或 server plugin 注入 emotion cache,render hook 里 flush。
      下面是一个简化模板(具体实现可根据 Nuxt 版本调整):
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// server/plugins/zui.ts(Nuxt 3+)
import createCache from '@emotion/cache'
import createEmotion from '@emotion/css/create-instance'
import { createIcssInstance } from '@kenconnet666/zui-core'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html, { event }) => {
    const cache = createCache({ key: 'zui' })
    const emotion = createEmotion(cache)
    const zui = createIcssInstance(emotion)

    // 把 zui 实例放进 event.context,供组件 useState 取
    event.context.zui = zui
    event.context.emotion = emotion
    event.context.cache = cache

    // render 完成后 flush
    const ids = emotion.flush()
    const css = ids
      .map((id) => cache.inserted[id])
      .filter((v): v is string => typeof v === 'string')
      .join('')

    html.head.push(\`<style data-emotion=&quot;zui \${ids.join(' ')}&quot;>\${css}</style>\`)
  })
})`"
    />

    <ZTitle :level="2">SSR-friendly 设计要点</ZTitle>
    <ApiTable
      :columns="[
        { key: 'feature', label: '特性', mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          feature: 'useZId(suffix?)',
          desc: '基于 Vue 3.5+ 内置 useId(),服务端与客户端生成同 id,hydration 不报错。',
        },
        {
          feature: 'usePortal',
          desc: 'target 解析延迟到 onMounted,服务端不访问 document,避免 ReferenceError。',
        },
        {
          feature: '<ZPortal :disabled>',
          desc: '在 SSR 阶段可以 disabled,渲染到原地;hydration 后开启 disabled=false,自动切到 body。',
        },
        {
          feature: 'icss 无状态副作用',
          desc: 'icss 是同步的纯函数调用,生成的 className 与渲染顺序无关,服务端与客户端结果一致。',
        },
        {
          feature: 'icss 同步返回 className',
          desc: 'icss 是同步的(emotion 风格),不依赖客户端事件,适合 SSR string concat 渲染流程。',
        },
      ]"
    />

    <ZTitle :level="2">单入口 + preserveModules tree-shake</ZTitle>
    <ZParagraph>
      <ZCode code="@kenconnet666/zui-vue" /> v0.2(L12 决策,2026-05-23)<strong
        >取消了所有 subpath exports</strong
      >(<ZCode code="/provider" /> / <ZCode code="/locale" /> / <ZCode code="/composables" />
      全部废弃),只暴露主入口。tree-shake 由 zui 的打包策略 + 业务方 bundler 共同保证:
    </ZParagraph>
    <ApiTable
      :columns="[
        { key: 'side', label: '层', mono: true, width: '180px' },
        { key: 'tech', label: '技术', mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          side: 'zui-vue 打包',
          tech: 'rollup preserveModules',
          desc: '保留源文件结构 → bundler 能按文件粒度 tree-shake;每个组件独立 chunk。',
        },
        {
          side: 'zui-vue 打包',
          tech: '不 minify',
          desc: '保留可读性 + pure marker,业务方 bundler 才能正确判定 side-effect-free。',
        },
        {
          side: 'zui-vue 打包',
          tech: 'dts rollupTypes: false',
          desc: '保留源类型结构,IDE go-to-def 看得到注释 + 注释里的 @example。',
        },
        {
          side: 'package.json',
          tech: '\\&quot;sideEffects\\&quot;: false',
          desc: '所有 ESM import 标记为 side-effect-free,bundler 安全 drop 未用到的 export。',
        },
        {
          side: '业务方 bundler',
          tech: 'Vite / Rollup / esbuild',
          desc: '配合 zui 的 sideEffects: false + ESM 入口,自动只打包真正用到的组件。',
        },
      ]"
    />

    <ZTitle :level="2">业务方 import 写法</ZTitle>
    <ZParagraph>
      推荐:<strong>统一从主入口 named import</strong>。bundler 会按真实使用情况裁剪:
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// ✅ 推荐
import {
  ZBox, zuiLight,
  ZButton, ZText, ZTitle,
  useZTheme, useZLocale,
  icss,
} from '@kenconnet666/zui-vue'

// ❌ 已废弃(v0.2 后不支持)
import { ZBox } from '@kenconnet666/zui-vue/provider'
import { ZButton } from '@kenconnet666/zui-vue/components/button'`"
    />

    <ZTitle :level="2">已知坑</ZTitle>
    <ApiTable
      :columns="[
        { key: 'topic', label: '坑', mono: true, width: '300px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          topic: 'emotion 全局 cache 污染',
          desc: '不要在 SSR 入口 import 默认 @emotion/css 的 css/cx——必须走 createEmotion + createIcssInstance,否则多请求共享 cache 导致 CSS 错乱。',
        },
        {
          topic: 'theme 对象不能跨请求共享',
          desc: 'Theme 内部缓存 keymap;高并发场景每请求新建 theme(或 freeze 后只读共享亦可,因为 keymap 是纯函数缓存)。',
        },
        {
          topic: 'theme 必须由 ZBox 注入',
          desc: 'SSR 渲染如果忘了套 ZBox,CSS 变量 token 没值,组件样式无法正常渲染。',
        },
        {
          topic: 'createIcssInstance 的副作用',
          desc: 'injectGlobal / injectPreflight / registerFont / registerCustomProperty 写到 document.head;服务端没有 document,要确保只在 onMounted 或客户端入口调用。',
        },
        {
          topic: 'extractCritical 未直接暴露',
          desc: 'zui 目前不封装 extractCritical helper,业务方手动 cache.flush() + 拼字符串。未来可能加 createIcssInstance(emotion).flush() 的 wrapper。',
        },
        {
          topic: '@emotion/server 不是 peerDep',
          desc: 'SSR critical CSS 抽取走 @emotion/css 自带 flush + cache.inserted,无需额外装 @emotion/server。如想用其 renderStylesToString,业务方自行安装。',
        },
      ]"
    />

    <ZTitle :level="2">useId 跨端一致性</ZTitle>
    <ZParagraph>
      Vue 3.5+ 内置 <ZCode code="useId()" /> 自动保证服务端与客户端生成同 id, 避免 hydration
      mismatch。<ZCode code="useZId" /> 透传这个保证,加上 <ZCode code="zui-" />
      前缀。早期(Vue &lt; 3.5)的项目升级 Vue 3.5+ 后即可使用 zui-vue,无需额外配置。
    </ZParagraph>
    <CodeBlock
      lang="ts"
      :code="`// 服务端渲染:
const id = useZId()   // 'zui-v-0-1'

// 客户端 hydration:
const id = useZId()   // 'zui-v-0-1'(同一个 id,无 mismatch)`"
    />

    <ZTitle :level="2">推荐打包配置(业务方)</ZTitle>
    <CodeBlock
      lang="ts"
      :code="`// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],

  // 让 Vite dev 不预打包 zui(保留源结构 + tree-shake)
  optimizeDeps: {
    exclude: ['@kenconnet666/zui-vue', '@kenconnet666/zui-core'],
  },

  // 生产打包:rollup 自动按 sideEffects: false tree-shake
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 把 zui 单独成 chunk 便于浏览器缓存
          if (id.includes('@kenconnet666/zui')) return 'zui'
        },
      },
    },
  },
})`"
    />

    <ZTitle :level="2">checklist —— SSR 接入</ZTitle>
    <ApiTable
      :columns="[
        { key: 'step', label: '步骤', mono: true, width: '80px' },
        { key: 'desc', label: '内容' },
      ]"
      :rows="[
        {
          step: '1',
          desc: '每个请求新建 @emotion/cache → createEmotion → createIcssInstance,绑定到请求上下文。',
        },
        {
          step: '2',
          desc: '组件用 useZTheme / useZLocale / useZId,不直接 import 默认 @emotion/css 实例。',
        },
        {
          step: '3',
          desc: '渲染入口套 ZBox,传 theme / locale(SSR + client 同值,避免 hydration mismatch)。',
        },
        {
          step: '4',
          desc: '渲染完后 cache.flush() 取本请求注入的 className → 拼成 <style> 注入 HTML <head>。',
        },
        {
          step: '5',
          desc: 'Client hydration 阶段无需重复注入(emotion 会自动复用 server-rendered className)。',
        },
        {
          step: '6',
          desc: '业务方测试:同一请求多次访问,响应 HTML 包含的 <style> 不应包含上次请求的样式(隔离正确)。',
        },
      ]"
    />

    <ZTitle :level="2">未来计划</ZTitle>
    <ApiTable
      :columns="[
        { key: 'item', label: '计划项', mono: true, width: '260px' },
        { key: 'desc', label: '说明' },
      ]"
      :rows="[
        {
          item: '@kenconnet666/zui-nuxt module',
          desc: 'Nuxt 一键集成,自动注入 server plugin + cache flush + critical CSS。',
        },
        {
          item: 'extractCritical helper',
          desc: '封装 createIcssInstance(emotion).flush() → critical CSS string,免业务方手拼。',
        },
        {
          item: 'SSR demo 项目',
          desc: '在 examples/ 加一个 Vue SSR / Nuxt SSR 示例,验证多请求隔离 + critical CSS 正确性。',
        },
      ]"
    />
  </section>
</template>
