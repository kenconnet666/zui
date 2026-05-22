<script lang="ts" setup>
/**
 * ZIcon 演示页 —— v3 chain factory props + iem 单位(2026-05-22):
 *   - 4 个外观维度全是单 carrier factory:size / color / depth / spin
 *   - size 接 width carrier;height 自动镜像 width
 *   - spin 接 animationDuration carrier;name + iteration + timing 自动加
 *   - 任何兜底需求走 cssRoot
 *   - iem = "我自己使用的 em",跟 rem 对称,默认 1iem = 16px,Provider 切换基准
 */
import { computed, ref, shallowRef, watchEffect } from 'vue'
import type { ZIconProps, ZuiSchema } from '@kenconnet666/zui-vue'
import { ZBox, ZIcon, ZIemPreset } from '@kenconnet666/zui-vue'
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

// ─── 4 维度预定义 factory ─────────────────────────────────────────────────
type SizeFactory = NonNullable<ZIconProps['size']>
type ColorFactory = NonNullable<ZIconProps['color']>
type DepthFactory = NonNullable<ZIconProps['depth']>
type SpinFactory = NonNullable<ZIconProps['spin']>

/** size 预制:iem 倍率(默认基准)/ em(跟父字号)/ px 字面量。 */
const sizes: Record<string, SizeFactory> = {
  'iem(0.75)  极小(12px @ default)': (w) => w.iem(0.75),
  'iem(0.875) 小(14px @ default)': (w) => w.iem(0.875),
  'iem(1)     中(16px @ default,默认)': (w) => w.iem(1),
  'iem(1.25)  大(20px @ default)': (w) => w.iem(1.25),
  'iem(1.5)   极大(24px @ default)': (w) => w.iem(1.5),
  'iem(2)     2 倍(32px @ default)': (w) => w.iem(2),
  'em(1.25)   跟父字号(罕见)': (w) => w.em(1.25),
  'px(24)     字面量': (w) => w.px(24),
}

/** color 预制:语义色 + 字面量 + currentColor + modifier 链。 */
const colors: Record<string, ColorFactory> = {
  'currentColor (默认)': (c) => c.currentColor,
  '_primary  schema token': (c) => c._primary,
  _success: (c) => c._success,
  _warning: (c) => c._warning,
  _danger: (c) => c._danger,
  _info: (c) => c._info,
  '_primary.alpha(50)  半透明': (c) => c._primary.alpha(50),
  '_danger.darken(20)  暗化': (c) => c._danger.darken(20),
  "'#ff7849' 字面量": (c) => c('#ff7849'),
}

/** depth 预制:不传 = 100% / 字面量 / schema token。 */
const depths: Record<string, DepthFactory | undefined> = {
  '(不传 = 100%)': undefined,
  'o(0.8)  字面量': (o) => o(0.8),
  'o(0.5)  字面量': (o) => o(0.5),
  'o._strong  schema token (0.75)': (o) => o._strong,
  'o._half    schema token (0.5)': (o) => o._half,
  'o._dim     schema token (0.25)': (o) => o._dim,
  'o._faint   schema token (0.05)': (o) => o._faint,
}

/** spin 预制:不传 = 不旋转 / 字面量 s+ms / schema duration token。 */
const spins: Record<string, SpinFactory | undefined> = {
  '(不传 = 不旋转)': undefined,
  'd.s(0.3)   最快': (d) => d.s(0.3),
  'd.s(0.5)': (d) => d.s(0.5),
  'd.s(1)     默认节奏': (d) => d.s(1),
  'd.s(2)': (d) => d.s(2),
  'd.s(3)     最慢': (d) => d.s(3),
  'd.ms(300)  毫秒字面量': (d) => d.ms(300),
  'd._middle  schema token (300ms)': (d) => d._middle,
}

// ─── cssRoot 兜底示例 ─────────────────────────────────────────────────────
const cssExamples: Record<string, ((s: Chain<ZuiSchema>) => void) | undefined> = {
  '(none)': undefined,
  'hover 高亮 _primary': (s) => {
    s.cursor('pointer')
    s._hover((h) => {
      h.color((c) => c._primary)
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
      a.backgroundColor((c) => c._danger)
    })
  },
  '非正方形 24×32': (s) => {
    s.width.px(24)
    s.height.px(32)
  },
  'spin 自定义 easing + 反向': (s) => {
    s.animationTimingFunction('ease-in-out')
    s.animationDirection.reverse
  },
  '媒体查询 _middle 断点放大': (s) => {
    s._media('_middle', (m) => {
      m.fontSize('2em')
    })
  },
}

// ─── interactive controls ──────────────────────────────────────────────────
const sizeKey = ref<keyof typeof sizes>('iem(1)     中(16px @ default,默认)')
const colorKey = ref<keyof typeof colors>('currentColor (默认)')
const depthKey = ref<keyof typeof depths>('(不传 = 100%)')
const spinKey = ref<keyof typeof spins>('(不传 = 不旋转)')
const cssKey = ref<keyof typeof cssExamples>('(none)')

const currentSize = computed(() => sizes[sizeKey.value])
const currentColor = computed(() => colors[colorKey.value])
const currentDepth = computed(() => depths[depthKey.value])
const currentSpin = computed(() => spins[spinKey.value])
const currentCss = computed(() => cssExamples[cssKey.value])

// ─── 实时操控选中的 component ────────────────────────────────────────────
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
const currentComponent = shallowRef(HomeOutline)
watchEffect(() => {
  currentComponent.value = allIcons[currentIconName.value]
})
</script>

<template>
  <article>
    <h1>ZIcon</h1>
    <p>
      框架无关图标容器 —— <strong>4 维度全 chain factory props</strong>(<code>size</code> /
      <code>color</code> / <code>depth</code> / <code>spin</code>)。每个维度接一个 carrier factory,
      <code>(c) =&gt; c._primary</code> 这种工厂直传给组件 prop。
    </p>
    <ul>
      <li>
        <code>size</code> 接 <code>width</code> carrier;<strong>height 自动镜像 width</strong>;默认
        <code>(w) =&gt; w.iem(1)</code>(1 个 iem,默认 16px)
      </li>
      <li><code>color</code> 接 <code>color</code> carrier</li>
      <li><code>depth</code> 接 <code>opacity</code> carrier</li>
      <li>
        <code>spin</code> 接 <code>animationDuration</code> carrier;启用时自动加 name + iteration +
        timing
      </li>
      <li>任何不在 4 维度的需求 → <code>:css-root="(s) =&gt; { ... }"</code> 兜底</li>
    </ul>

    <!-- ─── 1. 双模式接入 ─── -->
    <section>
      <h2>1. 双模式接入(slot vs <code>:component</code>)</h2>
      <div class="row">
        <div class="cell">
          <h3>slot 模式</h3>
          <pre><code>&lt;ZIcon :size="(w) =&gt; w.iem(1.25)"&gt;&lt;HomeOutline /&gt;&lt;/ZIcon&gt;</code></pre>
          <ZIcon :size="(w) => w.iem(1.25)">
            <HomeOutline />
          </ZIcon>
        </div>
        <div class="cell">
          <h3>component prop 模式</h3>
          <pre><code>&lt;ZIcon :component="HomeOutline" :size="(w) =&gt; w.iem(1.25)" /&gt;</code></pre>
          <ZIcon :component="HomeOutline" :size="(w) => w.iem(1.25)" />
        </div>
      </div>
    </section>

    <!-- ─── 2. size factory(width carrier;height 镜像)─── -->
    <section>
      <h2>2. <code>size</code> factory —— <code>width</code> carrier(height 自动镜像)</h2>
      <p class="note">
        <code>:size="(w) =&gt; w.iem(1.25)"</code> 一行表达。height 永远等于 width。 物理像素取决于
        <code>&lt;ZBox :iem&gt;</code> 注入的基准(默认 16px)。
        非正方形场景走 <code>cssRoot</code>。
      </p>
      <div class="row baseline">
        <div v-for="(fn, key) in sizes" :key="key" class="cell-mini">
          <ZIcon :component="StarOutline" :size="fn" />
          <code>{{ key }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 3. color factory ─── -->
    <section>
      <h2>3. <code>color</code> factory —— <code>color</code> carrier</h2>
      <p class="note">
        IDE 补全展开 schema 全部 color token + 146 CSS 命名色 + modifier 链。 输入
        <code>_p</code> 可模糊筛选 <code>_primary</code> / <code>_primaryHover</code> 等。
      </p>
      <div class="row">
        <div v-for="(fn, key) in colors" :key="key" class="cell-mini">
          <ZIcon :color="fn" :component="HeartOutline" :size="(w) => w.iem(1.5)" />
          <code>{{ key }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 4. depth factory ─── -->
    <section>
      <h2>4. <code>depth</code> factory —— <code>opacity</code> carrier</h2>
      <div class="row">
        <div v-for="(fn, key) in depths" :key="key" class="cell-mini">
          <ZIcon :component="StarOutline" :depth="fn" :size="(w) => w.iem(1.5)" />
          <code>{{ key }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 5. spin factory ─── -->
    <section>
      <h2>5. <code>spin</code> factory —— <code>animationDuration</code> carrier</h2>
      <p class="note">
        用户只控制旋转速度;<code>animationName(presetAnimations.spin)</code> +
        <code>infinite</code> + <code>linear</code> 启用时自动加上。要自定义 easing / 反向 → cssRoot。
      </p>
      <div class="row">
        <div v-for="(fn, key) in spins" :key="key" class="cell-mini">
          <ZIcon :component="Reload" :spin="fn" :size="(w) => w.iem(1.5)" />
          <code>{{ key }}</code>
        </div>
      </div>
    </section>

    <!-- ─── 6. cssRoot factory ─── -->
    <section>
      <h2>6. <code>:css-root</code> factory —— 兜底逃生口</h2>
      <p>
        在 4 维度之后应用,可覆盖任意属性。所有 Chain 内建方法
        (<code>_hover</code> / <code>_media</code> / <code>_before</code>
        / <code>_after</code> 等)都能用。<strong>非正方形</strong>、<strong>自定义 easing
        / 反向旋转</strong>等需求也走这里。
      </p>
      <div class="controls">
        <label>
          预设示例
          <select v-model="cssKey">
            <option v-for="k in Object.keys(cssExamples)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
      </div>
      <div class="preview">
        <ZIcon
          :component="StarOutline"
          :size="(w) => w.iem(2)"
          v-bind="currentCss ? { cssRoot: currentCss } : {}"
        />
      </div>
    </section>

    <!-- ─── 7. 实时操控 ─── -->
    <section>
      <h2>7. 实时操控(4 维度 + cssRoot)</h2>
      <div class="controls">
        <label>
          icon
          <select v-model="currentIconName">
            <option v-for="k in Object.keys(allIcons)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          size
          <select v-model="sizeKey">
            <option v-for="k in Object.keys(sizes)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          color
          <select v-model="colorKey">
            <option v-for="k in Object.keys(colors)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          depth
          <select v-model="depthKey">
            <option v-for="k in Object.keys(depths)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
        <label>
          spin
          <select v-model="spinKey">
            <option v-for="k in Object.keys(spins)" :key="k" :value="k">{{ k }}</option>
          </select>
        </label>
      </div>
      <div class="preview">
        <ZIcon
          :component="currentComponent"
          :size="currentSize"
          :color="currentColor"
          v-bind="{
            ...(currentDepth ? { depth: currentDepth } : {}),
            ...(currentSpin ? { spin: currentSpin } : {}),
          }"
        />
      </div>
    </section>

    <!-- ─── 8. a11y ─── -->
    <section>
      <h2>8. a11y — <code>label</code> prop</h2>
      <div class="row">
        <div class="cell-mini">
          <ZIcon :component="Trash" :size="(w) => w.iem(1.5)" />
          <code>无 label → aria-hidden(装饰性)</code>
        </div>
        <div class="cell-mini">
          <ZIcon :component="Trash" :size="(w) => w.iem(1.5)" label="删除" />
          <code>有 label → aria-label + role="img"</code>
        </div>
      </div>
    </section>

    <!-- ─── 9. 用户扩展 token ─── -->
    <section class="extension">
      <h2>9. 用户扩自家 token —— augmentation + extend() 零样板</h2>
      <p>
        zui 的 token 体系是<strong>三层 schema 继承</strong>:
      </p>

      <pre><code>core      BaseSchema  // 仅 Tailwind palette 242 色
            ▲ extends
ui-vue    ZuiSchema   // + 11 语义色 + 5 阶 size + ...
            ▲ augmentation
user      用户在 zui.d.ts 一次 augmentation</code></pre>

      <h3>用户扩 brand 色 —— 两步走</h3>
      <pre><code>// 步骤 1: user/zui.d.ts
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandRoyal: string
    brandSunset: string
    brandForest: string
  }
}

// 步骤 2: App.vue
import { ZBox, zuiLight } from '@kenconnet666/zui-vue'

const myLight = zuiLight.extend({
  color: { brandRoyal: '#1a3a8f', brandSunset: '#ff7849', brandForest: '#1f7a3c' },
})

&lt;ZBox :theme="myLight"&gt;&lt;App /&gt;&lt;/ZBox&gt;</code></pre>

      <h3>使用处 —— 零类型注解,IDE 直接补全 ✨</h3>
      <pre><code>&lt;ZIcon :color="(c) =&gt; c._brandRoyal" /&gt;
&lt;ZIcon :color="(c) =&gt; c._primary" /&gt;
&lt;ZIcon :color="(c) =&gt; c._blue500" /&gt;
&lt;ZIcon :css-root="(s) =&gt; {
  s._hover(h =&gt; h.color(c =&gt; c._brandRoyal.shade(20)))
}" /&gt;</code></pre>

      <h3>本 docs 站实际效果</h3>
      <p class="note">
        docs 工程 `src/zui.d.ts` 已做 augmentation;App.vue 已用 <code>zuiLight.extend(...)</code>
        注入 3 个 brand 色:
      </p>
      <div class="row">
        <div class="cell-mini">
          <ZIcon
            :component="HeartOutline"
            :size="(w) => w.iem(2)"
            :color="(c) => c._brandRoyal"
          />
          <code>c._brandRoyal</code>
        </div>
        <div class="cell-mini">
          <ZIcon
            :component="HeartOutline"
            :size="(w) => w.iem(2)"
            :color="(c) => c._brandSunset"
          />
          <code>c._brandSunset</code>
        </div>
        <div class="cell-mini">
          <ZIcon
            :component="HeartOutline"
            :size="(w) => w.iem(2)"
            :color="(c) => c._brandForest"
          />
          <code>c._brandForest</code>
        </div>
      </div>
    </section>

    <!-- ─── 10. ZBox :iem —— 全站 sizing 单点切换 ─── -->
    <section>
      <h2>10. <code>:iem</code> —— 全站 sizing 单点切换</h2>
      <p>
        <code>iem</code> = <strong>"我自己使用的 em"</strong>,跟 CSS <code>rem</code>(root em)
        对称 —— Provider 注入的基准倍率,默认 <code>1iem = 16px</code>(等同 1rem)。
      </p>
      <p>
        <code>&lt;ZBox :iem&gt;</code> 写入 wrapper inline
        <code>style="--zui-iem: ..."</code>。所有 iem 化 token(spacing / radius / fontSize /
        blur 等)经 <code>calc(N * var(--zui-iem, 16px))</code> 自动 resolve 到该基准。
        <strong>ZIcon 默认 size 也走 iem</strong>,跟 Provider 字号联动。
      </p>

      <div class="row">
        <div class="cell">
          <h3>默认 <code>:iem="ZIemPreset.default"</code> (1iem = 16px)</h3>
          <ZBox :iem="ZIemPreset.default">
            <div :style="{ padding: '16px', border: '1px solid #ccc', display: 'flex', gap: '16px', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" />
              <span style="font-size: 16px">默认 16px 基准</span>
            </div>
          </ZBox>
        </div>
        <div class="cell">
          <h3><code>:iem="ZIemPreset.large"</code> (1iem = 20px,整站放大 25%)</h3>
          <ZBox :iem="ZIemPreset.large">
            <div :style="{ padding: 'calc(1 * var(--zui-iem, 16px))', border: '1px solid #ccc', display: 'flex', gap: 'calc(1 * var(--zui-iem, 16px))', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">20px 大字模式</span>
            </div>
          </ZBox>
        </div>
        <div class="cell">
          <h3><code>:iem="ZIemPreset.compact"</code> (1iem = 14px,紧凑)</h3>
          <ZBox :iem="ZIemPreset.compact">
            <div :style="{ padding: 'calc(1 * var(--zui-iem, 16px))', border: '1px solid #ccc', display: 'flex', gap: 'calc(1 * var(--zui-iem, 16px))', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">14px 紧凑模式</span>
            </div>
          </ZBox>
        </div>
        <div class="cell">
          <h3><code>:iem="ZIemPreset.rem"</code> (跟浏览器根字号,a11y)</h3>
          <ZBox :iem="ZIemPreset.rem">
            <div :style="{ padding: 'calc(1 * var(--zui-iem, 16px))', border: '1px solid #ccc', display: 'flex', gap: 'calc(1 * var(--zui-iem, 16px))', alignItems: 'center' }">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">浏览器大字模式整站同步放大</span>
            </div>
          </ZBox>
        </div>
      </div>
    </section>

    <!-- ─── 11. 嵌套 Provider 互不影响 ─── -->
    <section>
      <h2>11. 嵌套 Provider · 兄弟独立 · 零运行时合并</h2>
      <p>
        CSS cascade 天然支持嵌套作用域和兄弟隔离 —— 每个 Provider 在 wrapper 写
        <code>style="--zui-iem: ..."</code>,子组件 <code>calc(N * var(--zui-iem))</code>
        通过浏览器 CSS 引擎自动找最近祖先的值。**零运行时合并开销**。
      </p>

      <h3>嵌套覆盖:子树独立设定,不影响兄弟</h3>
      <ZBox :iem="ZIemPreset.default">
        <div class="nested-demo">
          <div class="nest-card outer">
            <div class="nest-label">外层 Provider: <code>:iem="ZIemPreset.default"</code> (16px)</div>
            <div class="nest-row">
              <ZIcon :component="HomeOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">外层文字 + ZIcon(1iem)</span>
            </div>

            <ZBox :iem="ZIemPreset.large">
              <div class="nest-card inner">
                <div class="nest-label">嵌套子树: <code>:iem="ZIemPreset.large"</code> (20px) ← 只影响这一子树</div>
                <div class="nest-row">
                  <ZIcon :component="HomeOutline" />
                  <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">子树文字 + ZIcon(1iem = 20px)</span>
                </div>
              </div>
            </ZBox>

            <div class="nest-row">
              <ZIcon :component="HomeOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">外层兄弟节点(回到 16px,不受嵌套影响)</span>
            </div>
          </div>
        </div>
      </ZBox>

      <h3>兄弟 Provider:各自独立,完全不影响</h3>
      <div class="sibling-row">
        <ZBox :iem="ZIemPreset.compact">
          <div class="nest-card sibling">
            <div class="nest-label">兄弟 A: <code>compact</code> (14px)</div>
            <div class="nest-row">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">14px 紧凑</span>
            </div>
          </div>
        </ZBox>

        <ZBox :iem="ZIemPreset.default">
          <div class="nest-card sibling">
            <div class="nest-label">兄弟 B: <code>default</code> (16px)</div>
            <div class="nest-row">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">16px 默认</span>
            </div>
          </div>
        </ZBox>

        <ZBox :iem="ZIemPreset.large">
          <div class="nest-card sibling">
            <div class="nest-label">兄弟 C: <code>large</code> (20px)</div>
            <div class="nest-row">
              <ZIcon :component="HeartOutline" />
              <span :style="{ fontSize: 'calc(1 * var(--zui-iem, 16px))' }">20px 大字</span>
            </div>
          </div>
        </ZBox>
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
  min-width: 160px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 28px;
}
.cell-mini code {
  font-size: 11px;
  text-align: center;
  white-space: pre;
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
.note {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 8px;
}
.extension .note {
  margin: 6px 0 10px;
  font-size: 12px;
}
.extension pre {
  font-size: 12px;
  margin: 8px 0;
}

/* ─── 嵌套 Provider 演示样式 ─── */
.nested-demo {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}
.nest-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin: 8px 0;
}
.nest-card.outer {
  border-color: #3b82f6;
  border-width: 2px;
}
.nest-card.inner {
  background: #eff6ff;
  border-color: #f59e0b;
  border-width: 2px;
  margin: 12px 0;
}
.nest-card.sibling {
  flex: 1 1 200px;
}
.nest-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}
.nest-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}
.sibling-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
}
</style>
