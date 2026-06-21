<script lang="ts">
/**
 * `ZUpload` —— 文件上传(点击 + 拖拽,本地状态管理;实际上传由用户提供 `onUpload` 处理)。
 *
 * **API**:
 * - `v-model:fileList` —— 文件列表(`UploadedFile[]`)
 * - `accept?: string` —— input accept(`image/*` 等)
 * - `multiple?: boolean` —— 多选
 * - `disabled?: boolean`
 * - `dragDrop?: boolean` —— 启用拖拽区(默认 true)
 *
 * **emit**:`change(files)` / `drop(files)`(用户自行决定上传逻辑)
 *
 * **slot**:default(拖拽区内容,默认提示文字)
 */
import type { Chain } from '@kenconnet666/zui-core'
import type { ZuiSchema } from '../provider/theme'

export interface ZUploadedFile {
  uid: string
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  /** 原始 File 对象引用(供 onUpload 调用)。 */
  raw?: File
  /** 进度 0~100。 */
  progress?: number
  /** 错误信息(status=error 时)。 */
  error?: string
}

export interface ZUploadProps {
  fileList?: ZUploadedFile[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
  dragDrop?: boolean
  showFileList?: boolean
  css?: ((s: Chain<ZuiSchema>) => void) | undefined
}

export interface ZUploadEmits {
  (e: 'update:fileList', list: ZUploadedFile[]): void
  (e: 'change', files: File[]): void
  (e: 'remove', file: ZUploadedFile): void
}
</script>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { icss } from '@kenconnet666/zui-core'
import { useZTheme } from '../provider'
import { BuiltinIcons, ZIcon } from '../gene'
import ZButton from '../gene/ZButton.vue'

/**
 * 盒子模型(px,1 单位 = 16px):
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ <input type="file" hidden>(隐藏触发器)         │
 *   │                                                  │
 *   │  dragDrop=true(默认):                          │   drop zone:
 *   │  ┌────────────────────────────────────────────┐  │     flex column / center / center
 *   │  │ drop zone                                  │  │     pad _huge
 *   │  │   pad _huge  border-radius _small          │  │     border _thin DASHED _border
 *   │  │   border _thin DASHED _border              │  │     dragOver → border _primary
 *   │  │   bg _bg  color _textSecondary             │  │     bg dragOver→_bgMuted / 默认 _bg
 *   │  │   dragOver: border _primary / bg _bgMuted  │  │
 *   │  │   flex column / center / gap _small        │  │
 *   │  │   ┌──────┐                                 │  │
 *   │  │   │ icon │ + "点击或拖拽文件…"            │  │
 *   │  │   └──────┘                                 │  │
 *   │  └────────────────────────────────────────────┘  │
 *   │                                                  │
 *   │  dragDrop=false:                                 │   picker btn:
 *   │  ┌─────────────────────┐                         │     pad _small,pad-x _middle
 *   │  │ [+] 选择文件         │  pad-y _small          │     border _thin solid _border
 *   │  └─────────────────────┘  border _thin           │     hover: borderColor _primary
 *   │                                                  │
 *   │  file list(showFileList && 有文件):            │   file row:
 *   │  ┌────────────────────────────────────────────┐  │     border _thin _border
 *   │  │ ▢ name.ext (ellipsis)   12.3 KB    × close│  │     border-radius _tiny
 *   │  │   pad _tiny pad-x _small  border _thin     │  │     pad _tiny pad-x _small
 *   │  └────────────────────────────────────────────┘  │     fontSize _small
 *   │  (列表 flex column gap _tiny  marginTop _small)│
 *   └──────────────────────────────────────────────────┘
 */
const props = withDefaults(defineProps<ZUploadProps>(), {
  multiple: false,
  disabled: false,
  dragDrop: true,
  showFileList: true,
})

const emit = defineEmits<ZUploadEmits>()

const theme = useZTheme()

const inputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

const internalList = computed<ZUploadedFile[]>(() => props.fileList ?? [])

function fileToUploaded(f: File): ZUploadedFile {
  return {
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: f.name,
    size: f.size,
    type: f.type,
    status: 'pending',
    raw: f,
  }
}

function addFiles(files: FileList | null): void {
  if (!files || files.length === 0) return
  const arr = Array.from(files)
  const next: ZUploadedFile[] = props.multiple
    ? [...internalList.value, ...arr.map(fileToUploaded)]
    : [fileToUploaded(arr[0]!)]
  emit('update:fileList', next)
  emit('change', arr)
}

function openPicker(): void {
  if (props.disabled) return
  inputRef.value?.click()
}

function onPick(e: Event): void {
  const t = e.target as HTMLInputElement
  addFiles(t.files)
  t.value = '' // 允许重复选同一文件
}

function onDrop(e: DragEvent): void {
  e.preventDefault()
  dragOver.value = false
  if (props.disabled) return
  addFiles(e.dataTransfer?.files ?? null)
}

function onDragOver(e: DragEvent): void {
  e.preventDefault()
  if (props.disabled) return
  dragOver.value = true
}

function onDragLeave(): void {
  dragOver.value = false
}

function removeFile(f: ZUploadedFile): void {
  emit(
    'update:fileList',
    internalList.value.filter(x => x.uid !== f.uid),
  )
  emit('remove', f)
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const dropZoneClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.alignItems.center
    s.justifyContent.center
    s.gap._small
    s.padding._huge
    s.borderRadius._small
    s.borderWidth._thin
    s.borderStyle.dashed
    s.borderColor(dragOver.value ? '_primary' : '_border')
    s.backgroundColor(dragOver.value ? '_bgMuted' : '_bg')
    s.color._textSecondary
    s.cursor(props.disabled ? 'not-allowed' : 'pointer')
    s.fontSize._small
    s.transitionProperty._colors
    s.transitionDuration._small
    if (props.disabled) s.opacity._dim
    props.css?.(s)
  }),
)


const listClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.flexDirection.column
    s.gap._tiny
    s.marginTop._small
  }),
)

const fileNameClass = computed(() =>
  icss(theme.value, s => {
    s.flexGrow(1)
    s.overflow.hidden
    s.textOverflow.ellipsis
    s.whiteSpace.nowrap
  }),
)

const fileSizeClass = computed(() =>
  icss(theme.value, s => {
    s.color._textSecondary
    s.flexShrink(0)
  }),
)

const fileRowClass = computed(() =>
  icss(theme.value, s => {
    s.display.flex
    s.alignItems.center
    s.gap._small
    s.padding._tiny
    s.paddingLeft._small
    s.paddingRight._small
    s.borderRadius._tiny
    s.borderWidth._thin
    s.borderStyle.solid
    s.borderColor._border
    s.fontSize._small
  }),
)

// 移除按钮(复用 ZButton ghost circle):中性灰 + hover 变 danger 红(危险操作提示)。
const removeBtnColor = (c: Chain<ZuiSchema>['color']): void => {
  c._textSecondary
}
const removeBtnCss = (s: Chain<ZuiSchema>): void => {
  s._hover(h2 => {
    h2.color._danger
  })
}

const closeIcon = computed(() => h(ZIcon, { component: BuiltinIcons.close }))
const uploadIcon = computed(() => h(ZIcon, { component: BuiltinIcons.add }))
</script>

<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      style="display: none"
      @change="onPick"
    />

    <template v-if="dragDrop">
      <div
        :class="dropZoneClass"
        role="button"
        :tabindex="disabled ? -1 : 0"
        :aria-disabled="disabled"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        @keydown.space.prevent="openPicker"
        @drop="onDrop"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
      >
        <slot>
          <component :is="uploadIcon" />
          <span>点击或拖拽文件到此区域上传</span>
        </slot>
      </div>
    </template>
    <template v-else>
      <ZButton variant="outlined" :disabled="disabled" @click="openPicker">
        <template #prefixIcon>
          <component :is="uploadIcon" />
        </template>
        选择文件
      </ZButton>
    </template>

    <div v-if="showFileList && internalList.length > 0" :class="listClass">
      <div v-for="f in internalList" :key="f.uid" :class="fileRowClass">
        <span :class="fileNameClass">{{ f.name }}</span>
        <span :class="fileSizeClass">{{ formatSize(f.size) }}</span>
        <ZButton
          variant="ghost"
          shape="circle"
          :color="removeBtnColor"
          :size="0.875"
          :ripple="false"
          :css="removeBtnCss"
          aria-label="移除"
          @click="removeFile(f)"
        >
          <component :is="closeIcon" />
        </ZButton>
      </div>
    </div>
  </div>
</template>
