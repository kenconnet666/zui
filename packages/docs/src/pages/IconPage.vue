<script lang="ts" setup>
/**
 * ZIcon 演示页 —— v2.2 全离散版：5 阶 size + number escape / 6 色 / 5 阶 depth /
 * 5 阶 spin / cssRoot factory。配 `:unit` 全站 sizing 单点切换演示。
 */
import { computed, ref, shallowRef, watchEffect } from 'vue'
import type { ZIconProps, ZuiSchema } from '@kenconnet666/zui-vue'
import { ZConfigProvider, ZIcon, ZUnitPreset } from '@kenconnet666/zui-vue'
import type { Chain } from '@kenconnet666/zui-core'
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

// 4 维度可选值 —— `as const` 让数组拥有 readonly tuple 类型，
// 各 `ref<typeof xxx[number]>` 自动同步 prop union，无需独立 type alias。
const sizes = ['tiny', 'small', 'middle', 'large', 'huge'] as const
const colors = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
const depths = ['none', 'subtle', 'muted', 'dim', 'faded', 'ghost'] as const
const spinPresets = ['tiny', 'small', 'middle', 'large', 'huge'] as const

// ─── interactive controls ───
const sizeC = ref<(typeof sizes)[number]>('middle')
const colorC = ref<(typeof colors)[number]>('default')
const depthC = ref<(typeof depths)[number]>('none')
const spinOn = ref<boolean>(false)
const spinSpeed = ref<(typeof spinPresets)[number]>('middle')

const spinValue = computed<ZIconProps['spin']>(() =>
  spinOn.value ? spinSpeed.value : 'none',
)

// ─── cssRoot factory 预制示例 ───
/**
 * cssExamples —— 演示 `:css-root` factory 的若干典型用法。
 *
 * 回调参数 `Chain<ZuiSchema>` 与 ZIcon `:css-root` prop 类型对齐；直接 access
 * `_primary / _danger` 等 11 个语义色 token 与 5 阶 scale，IDE 自动补全。
 *
 * 用户工程要扩自家 brand：定义 `interface MySchema extends ZuiSchema { ... }`，
 * cssExamples 改 `Chain<MySchema>` 即可。
 */
const cssExamples: Record<string, ((s: Chain<ZuiSchema>) => void) | undefined> = {
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
      框架无关图标容器 —— <strong>4 维度全离散</strong>（size / color / depth / spin），所有维度
      直接在 setup 内 <code>icss</code> chain 内联（极简组件不上 <code>defineVariants</code>）。
      <code>size</code> 支持 <code>| number</code> escape hatch 接受任意 em 倍率。任何不在维度
      里的需求（hover / 媒体查询 / 任意 chain 方法）通过 <code>:css-root="s =&gt; { ... }"</code>
      用 zui-core chain 自由写。
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

    <!-- ─── 6. cssRoot factory：用 core chain 自由覆盖 ─── -->
    <section>
      <h2>6. <code>:css-root</code> factory（用 zui-core chain 自由覆盖）</h2>
      <p>
        <code>:css-root="s =&gt; { ... }"</code> 在 variants 之后应用，可覆盖任意属性。 所有
        Chain 内建方法（<code>_hover</code> / <code>_media</code> / <code>_before</code> 等）都能用。
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
          v-bind="currentCss ? { cssRoot: currentCss } : {}"
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

    <!-- ─── 8. a11y ─── -->
    <section>
      <h2>8. a11y — <code>label</code> prop</h2>
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

    <!-- ─── 9. 用户扩展 token：augmentation + extend() 真正零样板 ─── -->
    <section class="extension">
      <h2>9. 用户扩自家 token —— 真正的零样板隐式推导（三层覆盖模型的"加 token"层）</h2>
      <p>
        zui 的 token 体系是<strong>三层 schema 继承</strong>：
      </p>

      <pre><code>core      BaseSchema  // 仅 Tailwind palette 242 色（CSS 原语）
            ▲ extends
ui-vue    ZuiSchema   // + 11 语义色 + 5 阶 size scale + fontWeight / easing / ...
                       // 每个 category & Partial&lt;UserXxxExt&gt; 留扩展锚点
            ▲ augmentation
user      用户在 zui.d.ts 一次 augmentation</code></pre>

      <h3>已默认拥有 —— <code>zuiLight</code> 注入即享</h3>
      <pre><code>// 任意组件，IDE 实时补全
&lt;ZIcon :css-root="(s) =&gt; {
  s.color._primary       // ZuiSchema 语义色
  s.padding._middle       // ZuiSchema spacing
  s.borderRadius._large   // ZuiSchema radius
  s.fontSize._small       // ZuiSchema fontSize
  s.fontWeight._bold      // ZuiSchema fontWeight
  s.color._blue500        // core palette（继承自 BaseSchema）
}" /&gt;</code></pre>

      <h3>用户扩 brand 色 —— 两步走</h3>
      <pre><code>// 步骤 1: user/zui.d.ts —— 类型层一次 augmentation
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandRoyal: string
    brandSunset: string
    brandForest: string
  }
  // 也可同时扩 UserSpacingExt / UserRadiusExt / ...
}

// 步骤 2: App.vue —— 运行时 extend() 喂入值
import { ZConfigProvider, zuiLight } from '@kenconnet666/zui-vue'

const myLight = zuiLight.extend({
  color: {
    brandRoyal: '#1a3a8f',
    brandSunset: '#ff7849',
    brandForest: '#1f7a3c',
  },
})

&lt;ZConfigProvider :theme="myLight"&gt;&lt;App /&gt;&lt;/ZConfigProvider&gt;</code></pre>

      <h3>使用处 —— <strong>零类型注解，隐式推导直接生效</strong> ✨</h3>
      <pre><code>&lt;ZIcon :css-root="(s) =&gt; {
  s.color._brandRoyal    // ← 来自 UserColorExt augmentation
  s.color._primary        // ← ZuiSchema 内置
  s.color._blue500        // ← BaseSchema palette
  s._hover((h) =&gt; { h.color._brandRoyal.shade(20) })
}" /&gt;</code></pre>

      <h3>本 docs 站实际效果</h3>
      <p class="note">
        docs 工程 `src/zui.d.ts` 已做 augmentation；App.vue 已用 <code>zuiLight.extend(...)</code>
        注入 3 个 brand 色。下面 3 个图标直接走 <code>s.color._brandRoyal / _brandSunset / _brandForest</code>
        token 访问，**无任何类型注解**：
      </p>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css-root="(s) => { s.color._brandRoyal }" />
          <code>s.color._brandRoyal</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css-root="(s) => { s.color._brandSunset }" />
          <code>s.color._brandSunset</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="HeartOutline" size="huge" :css-root="(s) => { s.color._brandForest }" />
          <code>s.color._brandForest</code>
        </div>
      </div>
    </section>

    <!-- ─── 10. ZConfigProvider :unit —— 全站 sizing 单点切换 ─── -->
    <section>
      <h2>10. <code>:unit</code> —— 全站 sizing 单点切换</h2>
      <p>
        <code>&lt;ZConfigProvider :unit&gt;</code> 写入 wrapper inline
        <code>style="--zui-unit: ..."</code>。所有 zu 化 token（spacing / radius / fontSize /
        blur 等）经 <code>calc(N * var(--zui-unit, 1px))</code> 自动 resolve 到该基准。
        **ZIcon 走 em（跟随父字号），不受 unit 影响**，所以下方 demo 用 spacing/fontSize
        组合展示效果（每行外框 padding 走 spacing.middle）。
      </p>
      <p>
        嵌套 Provider 通过 css cascade 自然覆盖，无运行时合并开销。
        预设：<code>ZUnitPreset.pixel</code>（默认 1px）/ <code>ZUnitPreset.rem</code>（a11y 1/16rem）/
        <code>ZUnitPreset.retina</code>（2px）；也可传任意 css length 字符串。
      </p>

      <div class="row">
        <div class="cell">
          <h3>默认 <code>:unit="ZUnitPreset.pixel"</code> (1zu = 1px)</h3>
          <ZConfigProvider :unit="ZUnitPreset.pixel">
            <div :style="{ padding: '16px', border: '1px solid #ccc', display: 'flex', gap: '16px', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" size="large" />
              <span style="font-size: 16px">spacing.middle = 16px</span>
            </div>
          </ZConfigProvider>
        </div>
        <div class="cell">
          <h3><code>:unit="ZUnitPreset.retina"</code> (1zu = 2px，整站放大 2×)</h3>
          <ZConfigProvider :unit="ZUnitPreset.retina">
            <div :style="{ padding: 'calc(16 * var(--zui-unit, 1px))', border: '1px solid #ccc', display: 'flex', gap: 'calc(16 * var(--zui-unit, 1px))', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" size="large" />
              <span :style="{ fontSize: 'calc(16 * var(--zui-unit, 1px))' }">spacing.middle = 32px</span>
            </div>
          </ZConfigProvider>
        </div>
        <div class="cell">
          <h3><code>:unit="ZUnitPreset.rem"</code> (跟浏览器根字号，a11y)</h3>
          <ZConfigProvider :unit="ZUnitPreset.rem">
            <div :style="{ padding: 'calc(16 * var(--zui-unit, 1px))', border: '1px solid #ccc', display: 'flex', gap: 'calc(16 * var(--zui-unit, 1px))', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" size="large" />
              <span :style="{ fontSize: 'calc(16 * var(--zui-unit, 1px))' }">浏览器大字模式整站同步放大</span>
            </div>
          </ZConfigProvider>
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

/* ─── controls 内的 unit 提示 ─── */
.controls .hint {
  font-size: 11px;
  color: #9ca3af;
  font-weight: normal;
  margin-left: 2px;
}
</style>
