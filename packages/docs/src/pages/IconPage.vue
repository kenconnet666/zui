<script lang="ts" setup>
/**
 * ZIcon 演示页 —— v2.1 全离散版：5 阶 size / 6 色 / 5 阶 depth / 5 阶 spin / css factory。
 * + 嵌套 ZConfigProvider 实时切 componentTokens。
 */
import { computed, ref, shallowRef, watchEffect } from 'vue'
import type { ZIconColor, ZIconDepth, ZIconSize, ZIconSpinPreset } from '@kenconnet666/zui-vue'
import { ZConfigProvider, ZIcon } from '@kenconnet666/zui-vue'
import type { Chain, DefaultSchema } from '@kenconnet666/zui-core'
import {
  CheckmarkCircle,
  CloseCircle,
  HeartOutline,
  HomeOutline,
  InformationCircleOutline,
  Reload,
  StarOutline,
  Trash,
  WarningOutline,
} from '@vicons/ionicons5'

const sizes: ZIconSize[] = ['tiny', 'small', 'middle', 'large', 'huge']
const colors: ZIconColor[] = ['default', 'primary', 'success', 'warning', 'danger', 'info']
const depths: ZIconDepth[] = ['none', 'subtle', 'muted', 'dim', 'faded', 'ghost']
const spinPresets: ZIconSpinPreset[] = ['tiny', 'small', 'middle', 'large', 'huge']

// ─── interactive controls ───
const sizeC = ref<ZIconSize>('middle')
const colorC = ref<ZIconColor>('default')
const depthC = ref<ZIconDepth>('none')
const spinOn = ref<boolean>(false)
const spinSpeed = ref<ZIconSpinPreset>('middle')

const spinValue = computed(() => (spinOn.value ? spinSpeed.value : false))

// ─── css factory 预制示例 ───
const cssExamples: Record<string, ((s: Chain<DefaultSchema>) => void) | undefined> = {
  '(none)': undefined,
  'hover 高亮 _primary': (s) => {
    s.cursor('pointer')
    s._hover((h) => {
      h.color._primary
    })
  },
  '旋转 15deg + 加描边': (s) => {
    s.transform('rotate(15deg)')
    s.padding('4px')
    s.border('2px solid currentColor')
    s.borderRadius('999px')
  },
  '伪元素 ::after 红点': (s) => {
    s.position('relative')
    s._after((a) => {
      a.content('""')
      a.position('absolute')
      a.top('0')
      a.right('0')
      a.width('6px')
      a.height('6px')
      a.borderRadius('999px')
      a.backgroundColor._danger
    })
  },
  '媒体查询 _middle 断点放大': (s) => {
    s._media('_middle', (m) => {
      m.fontSize('2em')
    })
  },
}
const cssExampleKey = ref<keyof typeof cssExamples>('(none)')
const currentCss = computed(() => cssExamples[cssExampleKey.value])

// ─── nested ZConfigProvider 演示 ───
const overridePrimaryColor = ref<string>('#ff00aa')
const overrideSizeLarge = ref<string>('64px')
const overrideSpinMiddle = ref<string>('2.5s')
const overrideDepthDim = ref<string>('0.5')

const componentTokens = computed(() => ({
  icon: {
    primaryColor: overridePrimaryColor.value,
    sizeLarge: overrideSizeLarge.value,
    spinMiddleDuration: overrideSpinMiddle.value,
    depthDimOpacity: overrideDepthDim.value,
  },
}))

// ─── 当前选中的 component（用于"实时操控"那栏）───
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
      框架无关图标容器 —— <strong>4 维度全离散</strong>（size / color / depth / spin）， 所有维度走
      <code>defineVariants</code>。任何不在维度里的需求（hover / 媒体查询 / 任意 chain 方法）通过
      <code>:css="s =&gt; { ... }"</code> 用 zui-core chain 自由写。21 项 component token 全部可被
      <code>ZConfigProvider</code> 覆盖。
    </p>

    <!-- ─── 1. 双模式接入 ─── -->
    <section>
      <h2>1. 双模式接入（slot vs <code>:component</code> prop）</h2>
      <div class="row">
        <div class="cell">
          <h3>slot 模式</h3>
          <pre><code>&lt;ZIcon size="large"&gt;&lt;HomeOutline /&gt;&lt;/ZIcon&gt;</code></pre>
          <ZIcon size="large">
            <HomeOutline />
          </ZIcon>
        </div>
        <div class="cell">
          <h3>component prop 模式</h3>
          <pre><code>&lt;ZIcon :component="HomeOutline" size="large" /&gt;</code></pre>
          <ZIcon :component="HomeOutline" size="large" />
        </div>
      </div>
    </section>

    <!-- ─── 2. size 5 阶 ─── -->
    <section>
      <h2>2. <code>size</code> 5 阶（em 单位，跟父字号缩放）</h2>
      <div class="row baseline">
        <div v-for="s in sizes" :key="s" class="cell-mini">
          <ZIcon :component="StarOutline" :size="s" />
          <code>{{ s }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 3. color 6 种 ─── -->
    <section>
      <h2>3. <code>color</code> 6 种语义色</h2>
      <div class="row">
        <div v-for="c in colors" :key="c" class="cell-mini">
          <ZIcon :color="c" :component="HeartOutline" size="large" />
          <code>{{ c }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 4. depth 5 阶 + none ─── -->
    <section>
      <h2>4. <code>depth</code> 5 阶 + none</h2>
      <div class="row">
        <div v-for="d in depths" :key="d" class="cell-mini">
          <ZIcon :component="StarOutline" :depth="d" size="large" />
          <code>{{ d }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 5. spin 5 阶（none + 快慢） ─── -->
    <section>
      <h2>5. <code>spin</code> 5 阶（tiny 极快 → huge 极慢）</h2>
      <div class="row">
        <div v-for="sp in spinPresets" :key="sp" class="cell-mini">
          <ZIcon :component="Reload" :spin="sp" size="large" />
          <code>{{ sp }}</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Reload" :spin="true" size="large" />
          <code>:spin="true"（≡ middle）</code>
        </div>
      </div>
    </section>

    <!-- ─── 6. css factory：用 core chain 自由覆盖 ─── -->
    <section>
      <h2>6. <code>:css</code> factory（用 zui-core chain 自由覆盖）</h2>
      <p>
        <code>:css="s =&gt; { ... }"</code> 在 variants 之后应用，可覆盖任意属性。 所有 Chain
        内建方法（<code>_hover</code> / <code>_media</code> / <code>_before</code> 等）都能用。
      </p>
      <div class="controls">
        <label>
          预设示例
          <select v-model="cssExampleKey">
            <option v-for="k in Object.keys(cssExamples)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
      </div>
      <div class="preview">
        <ZIcon
          :component="StarOutline"
          size="huge"
          v-bind="currentCss ? { css: currentCss } : {}"
        />
      </div>
    </section>

    <!-- ─── 7. 实时操控 ─── -->
    <section>
      <h2>7. 实时操控</h2>
      <div class="controls">
        <label>
          icon
          <select v-model="currentIconName">
            <option v-for="k in Object.keys(allIcons)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          size
          <select v-model="sizeC">
            <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <label>
          color
          <select v-model="colorC">
            <option v-for="c in colors" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <label>
          depth
          <select v-model="depthC">
            <option v-for="d in depths" :key="d" :value="d">{{ d }}</option>
          </select>
        </label>
        <label>
          spin
          <input v-model="spinOn" type="checkbox" />
        </label>
        <label v-if="spinOn">
          speed
          <select v-model="spinSpeed">
            <option v-for="sp in spinPresets" :key="sp" :value="sp">{{ sp }}</option>
          </select>
        </label>
      </div>
      <div class="preview">
        <ZIcon
          :color="colorC"
          :component="currentComponent"
          :depth="depthC"
          :size="sizeC"
          :spin="spinValue"
        />
      </div>
    </section>

    <!-- ─── 8. componentTokens 嵌套覆盖 ─── -->
    <section>
      <h2>8. <code>ZConfigProvider</code> componentTokens 嵌套覆盖</h2>
      <p>
        外层全局 <code>defaultLight</code>；内层 Provider 改 4 个 icon token：
        <code>primaryColor</code> / <code>sizeLarge</code> / <code>spinMiddleDuration</code> /
        <code>depthDimOpacity</code>。两侧同步对比。
      </p>

      <div class="controls">
        <label>
          primaryColor
          <input v-model="overridePrimaryColor" type="color" />
        </label>
        <label>
          sizeLarge
          <input v-model="overrideSizeLarge" placeholder="64px" type="text" />
        </label>
        <label>
          spinMiddleDuration
          <input v-model="overrideSpinMiddle" placeholder="2.5s" type="text" />
        </label>
        <label>
          depthDimOpacity
          <input v-model="overrideDepthDim" max="1" min="0" step="0.1" type="number" />
        </label>
      </div>

      <div class="row">
        <div class="cell">
          <h3>外层（默认 token）</h3>
          <div class="demo-grid">
            <ZIcon :component="HeartOutline" color="primary" size="large" />
            <ZIcon :component="Reload" size="large" spin />
            <ZIcon :component="StarOutline" depth="dim" size="large" />
            <ZIcon :component="StarOutline" depth="ghost" size="large" />
          </div>
        </div>
        <div class="cell">
          <h3>内层 <code>:component-tokens</code> 覆盖</h3>
          <ZConfigProvider :component-tokens="componentTokens">
            <div class="demo-grid">
              <ZIcon :component="HeartOutline" color="primary" size="large" />
              <ZIcon :component="Reload" size="large" spin />
              <ZIcon :component="StarOutline" depth="dim" size="large" />
              <ZIcon :component="StarOutline" depth="ghost" size="large" />
            </div>
          </ZConfigProvider>
        </div>
      </div>
    </section>

    <!-- ─── 9. a11y ─── -->
    <section>
      <h2>9. a11y — <code>label</code> prop</h2>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="Trash" size="large" />
          <code>无 label → aria-hidden（装饰性）</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Trash" label="删除" size="large" />
          <code>有 label → aria-label + role="img"</code>
        </div>
      </div>
    </section>

    <!-- ─── 10. 扩展自定义 token：module augmentation ─── -->
    <section class="extension">
      <h2>10. 扩展自定义 token —— <code>module augmentation</code> 模式</h2>
      <p>
        ZIcon 的 <code>:css</code> 回调签名是
        <code>(s: Chain&lt;ThemeSchema&gt;) =&gt; void</code> —— 组件层不穿透 <code>S</code> 泛型。
        想让 <code>s.color._brandRoyal</code> 等自定义 token 在 IDE 里**有补全**，
        在用户工程做一次 module augmentation 即可。
      </p>

      <h3>步骤一 —— 工程根目录 <code>src/zui.d.ts</code></h3>
      <pre><code>import type { ThemeValue } from '@kenconnet666/zui-core'

declare module '@kenconnet666/zui-core' {
  interface ThemeSchema {
    color?: Record&lt;string, ThemeValue&gt; &amp; {
      brandRoyal?: string
      brandSunset?: string
      brandForest?: string
    }
  }
}</code></pre>

      <h3>步骤二 —— 顶层 ConfigProvider 喂入对应字面量</h3>
      <pre><code>import { defaultLight, Theme } from '@kenconnet666/zui-core'

const brandTheme = new Theme({
  ...defaultLight.schema,
  color: {
    ...defaultLight.schema.color,
    brandRoyal: '#1a3a8f',
    brandSunset: '#ff7849',
    brandForest: '#1f7a3c',
  },
})

// App.vue
&lt;ZConfigProvider :theme="brandTheme"&gt;
  &lt;App /&gt;
&lt;/ZConfigProvider&gt;</code></pre>

      <h3>步骤三 —— 使用处直接补全</h3>
      <pre><code>&lt;ZIcon :css="s =&gt; { s.color._brandRoyal }" /&gt;</code></pre>
      <p class="note">
        IDE 中输入 <code>s.color._brand</code> 时会列出 <code>brandRoyal</code> /
        <code>brandSunset</code> / <code>brandForest</code>；拼错会即时报错。
        与字面量 <code>s.color('#1a3a8f')</code> 相比，主要收益是**重命名安全** + **拼写校验**。
      </p>

      <h3>运行预览（字面量替代）</h3>
      <p class="note">
        docs 站没真的做全局 augmentation，下面用字面量字符串等价模拟运行结果：
      </p>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css="(s) => { s.color('#1a3a8f') }" />
          <code>brandRoyal</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css="(s) => { s.color('#ff7849') }" />
          <code>brandSunset</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css="(s) => { s.color('#1f7a3c') }" />
          <code>brandForest</code>
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
.row.baseline {
  align-items: baseline;
  font-size: 28px;
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
  font-size: 28px;
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
  font-size: 16px;
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
  font-size: 40px;
}
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 24px;
  justify-content: start;
  font-size: 32px;
}

/* ─── 10. 扩展示例 ─── */
.extension .note {
  margin: 6px 0 10px;
  font-size: 12px;
  color: #6b7280;
}
.extension pre {
  font-size: 12px;
  margin: 8px 0;
}
</style>
