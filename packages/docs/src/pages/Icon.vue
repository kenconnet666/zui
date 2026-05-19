<script setup lang="ts">
/**
 * ZIcon 演示页 —— 覆盖 size / color / intent / depth / spin / 双模式接入
 * + 嵌套 ZConfigProvider 实时切 componentTokens。
 */
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { ZConfigProvider, ZIcon } from '@kenconnet666/zui-vue'
import type { ZIconDepth, ZIconIntent } from '@kenconnet666/zui-vue'
import {
  HomeOutline,
  HeartOutline,
  Trash,
  Reload,
  CheckmarkCircle,
  WarningOutline,
  CloseCircle,
  InformationCircleOutline,
  StarOutline,
} from '@vicons/ionicons5'

// ─── interactive controls ───
const size = ref<number>(24)
const intent = ref<ZIconIntent>('default')
const depth = ref<ZIconDepth>('none')
const spinning = ref<boolean>(false)
const customColor = ref<string>('')

// ─── nested ZConfigProvider 演示 ───
const overrideDangerColor = ref<string>('#ff00aa')
const overrideSpinDuration = ref<string>('2.5s')
const overrideDepth1 = ref<string>('1')
const overrideDepth5 = ref<string>('0.1')

const componentTokens = computed(() => ({
  icon: {
    dangerColor: overrideDangerColor.value,
    spinDuration: overrideSpinDuration.value,
    depth1Opacity: overrideDepth1.value,
    depth5Opacity: overrideDepth5.value,
  },
}))

const intents: ZIconIntent[] = ['default', 'success', 'warning', 'danger', 'info']
const depths: ZIconDepth[] = ['none', '1', '2', '3', '4', '5']

// 当前选中的 component（用于双模式演示左侧 "component prop" 那栏）
const currentComponent = shallowRef(HomeOutline)
const allIcons = {
  HomeOutline,
  HeartOutline,
  Trash,
  Reload,
  CheckmarkCircle,
  WarningOutline,
  CloseCircle,
  InformationCircleOutline,
  StarOutline,
}
const currentIconName = ref<keyof typeof allIcons>('HomeOutline')
watchEffect(() => {
  currentComponent.value = allIcons[currentIconName.value]
})
</script>

<template>
  <article>
    <h1>ZIcon</h1>
    <p>
      框架无关图标容器 —— 通过 <code>default slot</code> 或 <code>:component</code> prop 接入任意图标库；
      离散维度（intent / depth）走 variants，连续维度（size / color / spin）走 dynamic styles；
      所有外观（默认色、5 阶 depth opacity、4 种 intent 色、spin 时长）都是 component token，
      <strong>ZConfigProvider 可全量覆盖</strong>。
    </p>

    <!-- ─── 1. 双模式接入 ─── -->
    <section>
      <h2>1. 双模式接入（slot vs <code>:component</code> prop）</h2>
      <div class="row">
        <div class="cell">
          <h3>slot 模式</h3>
          <pre><code>&lt;ZIcon size="32"&gt;&lt;HomeOutline /&gt;&lt;/ZIcon&gt;</code></pre>
          <ZIcon size="32">
            <HomeOutline />
          </ZIcon>
        </div>
        <div class="cell">
          <h3>component prop 模式</h3>
          <pre><code>&lt;ZIcon :component="HomeOutline" size="32" /&gt;</code></pre>
          <ZIcon :component="HomeOutline" size="32" />
        </div>
      </div>
    </section>

    <!-- ─── 2. intent ─── -->
    <section>
      <h2>2. <code>intent</code>（5 种语义色）</h2>
      <div class="row">
        <div v-for="i in intents" :key="i" class="cell-mini">
          <ZIcon :component="HeartOutline" :intent="i" size="32" />
          <code>{{ i }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 3. depth ─── -->
    <section>
      <h2>3. <code>depth</code>（5 阶 + none，遵循 5 阶哲学）</h2>
      <div class="row">
        <div v-for="d in depths" :key="d" class="cell-mini">
          <ZIcon :component="StarOutline" :depth="d" size="32" />
          <code>{{ d }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 4. size 响应式 ─── -->
    <section>
      <h2>4. <code>size</code> 数字 / 字符串 / 响应式</h2>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="HomeOutline" :size="16" />
          <code>16</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HomeOutline" :size="32" />
          <code>32</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HomeOutline" size="3rem" />
          <code>'3rem'</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HomeOutline" :size="{ base: 16, _middle: 32, _huge: 48 }" />
          <code>{ base: 16, _middle: 32, _huge: 48 }（缩窗口看变化）</code>
        </div>
      </div>
    </section>

    <!-- ─── 5. spin loading ─── -->
    <section>
      <h2>5. <code>spin</code> loading</h2>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="Reload" spin size="32" />
          <code>spin</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Reload" :spin="2" size="32" />
          <code>:spin="2"（2s）</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Reload" spin="500ms" size="32" />
          <code>spin="500ms"</code>
        </div>
      </div>
    </section>

    <!-- ─── 6. 实时操控 ─── -->
    <section>
      <h2>6. 实时操控</h2>
      <div class="controls">
        <label>
          icon
          <select v-model="currentIconName">
            <option v-for="k in Object.keys(allIcons)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          size
          <input type="range" min="12" max="96" step="2" v-model.number="size" />
          {{ size }}px
        </label>
        <label>
          intent
          <select v-model="intent">
            <option v-for="i in intents" :key="i" :value="i">{{ i }}</option>
          </select>
        </label>
        <label>
          depth
          <select v-model="depth">
            <option v-for="d in depths" :key="d" :value="d">{{ d }}</option>
          </select>
        </label>
        <label>
          color
          <input type="text" v-model="customColor" placeholder="留空 / #f00 / _primary" />
        </label>
        <label>
          spin
          <input type="checkbox" v-model="spinning" />
        </label>
      </div>
      <div class="preview">
        <ZIcon
          :component="currentComponent"
          :size="size"
          :intent="intent"
          :depth="depth"
          :spin="spinning"
          v-bind="customColor ? { color: customColor } : {}"
        />
      </div>
    </section>

    <!-- ─── 7. componentTokens 嵌套覆盖 ─── -->
    <section>
      <h2>7. <code>ZConfigProvider</code> componentTokens 嵌套覆盖</h2>
      <p>
        外层全局 <code>defaultLight</code>；内层 Provider 改 4 个 icon token：
        <code>dangerColor</code> / <code>spinDuration</code> / <code>depth1Opacity</code> /
        <code>depth5Opacity</code>。两侧同步对比。
      </p>

      <div class="controls">
        <label>
          dangerColor
          <input type="color" v-model="overrideDangerColor" />
        </label>
        <label>
          spinDuration
          <input type="text" v-model="overrideSpinDuration" placeholder="2.5s" />
        </label>
        <label>
          depth1Opacity
          <input type="number" step="0.1" min="0" max="1" v-model="overrideDepth1" />
        </label>
        <label>
          depth5Opacity
          <input type="number" step="0.05" min="0" max="1" v-model="overrideDepth5" />
        </label>
      </div>

      <div class="row">
        <div class="cell">
          <h3>外层（默认 token）</h3>
          <div class="demo-grid">
            <ZIcon :component="CloseCircle" intent="danger" size="36" />
            <ZIcon :component="Reload" spin size="36" />
            <ZIcon :component="StarOutline" depth="1" size="36" />
            <ZIcon :component="StarOutline" depth="5" size="36" />
          </div>
        </div>
        <div class="cell">
          <h3>内层 <code>:component-tokens</code> 覆盖</h3>
          <ZConfigProvider :component-tokens="componentTokens">
            <div class="demo-grid">
              <ZIcon :component="CloseCircle" intent="danger" size="36" />
              <ZIcon :component="Reload" spin size="36" />
              <ZIcon :component="StarOutline" depth="1" size="36" />
              <ZIcon :component="StarOutline" depth="5" size="36" />
            </div>
          </ZConfigProvider>
        </div>
      </div>
    </section>

    <!-- ─── 8. a11y ─── -->
    <section>
      <h2>8. a11y — <code>label</code> prop</h2>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="Trash" size="28" />
          <code>无 label → aria-hidden="true"（装饰性）</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Trash" size="28" label="删除" />
          <code>有 label → aria-label + role="img"</code>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
article {
  line-height: 1.7;
}
h1 {
  margin-top: 0;
}
h2 {
  margin-top: 32px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}
h3 {
  margin: 12px 0 8px;
  font-size: 14px;
  color: #4b5563;
}
code {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  background: #f3f4f6;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 13px;
}
pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
}
pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}
.row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 12px;
}
.cell {
  flex: 1 1 320px;
  background: #fff;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.cell-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 90px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin: 16px 0;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
}
.preview {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  justify-content: center;
}
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 24px;
  justify-content: start;
}
</style>
