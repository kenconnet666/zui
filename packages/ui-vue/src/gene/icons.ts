/**
 * `gene/icons` —— `@vicons/material` 命名导出 + `BuiltinIcons` 语义 map。
 *
 * **设计**:
 * - 不在 ui-vue 包内打包任何图标(全部走 peerDep `@vicons/material`,tree-shake 由消费方负责)
 * - `BuiltinIcons` 是组件库内部 / 用户业务都可用的「语义图标」字典 ── `close` / `check` /
 *   `success` / `error` 等通用语义对应一个 Material Design 默认图标(Outlined 变体)
 * - 用户用 `<ZIcon :component="BuiltinIcons.close" />` 或在自定义组件中 `import { BuiltinIcons }`
 *   后直接传组件,**统一一处改全站**(例如把所有 `success` 从 `CheckCircleOutlined` 换成
 *   `DoneOutlined`,只改这里)
 *
 * **包导出**:
 * - `export * from '@vicons/material'` —— 用户可以从 `@kenconnet666/zui-vue` 主入口直接
 *   `import { HomeOutlined } from '@kenconnet666/zui-vue'` 拿到 material 全套(类型 +
 *   组件)而不必额外装 `@vicons/material`(因为已是 peerDep)
 * - `BuiltinIcons` —— 语义 map
 */
export * from '@vicons/material'

import {
  AddOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  CloseOutlined,
  ErrorOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  InfoOutlined,
  MoreVertOutlined,
  RefreshOutlined,
  RemoveOutlined,
  SearchOutlined,
  UnfoldMoreOutlined,
  WarningOutlined,
} from '@vicons/material'

/**
 * `BuiltinIcons` —— ui-vue 内置语义图标 map。默认走 Material Design **Outlined** 变体。
 *
 * 用户想换某个语义图标(例 `success` 用 `DoneOutlined` 代替 `CheckCircleOutlined`):
 * 1. 业务方包装一个 `useIconRegistry()` composable 自己维护映射,或
 * 2. fork 本包,改这里
 *
 * **不开放 runtime 覆盖**:语义图标是组件库的 hardcoded 视觉默认,业务级覆盖应走 prop 直传
 * `<ZAlert :icon="MyCheck" />`,而不是改全局字典。
 */
export const BuiltinIcons = {
  /** 关闭 ──── 通用 close 按钮 / Modal 右上角 / Tag 删除 */
  close: CloseOutlined,
  /** 勾选 ──── 选中态 / 完成态(简单的 ✓) */
  check: CheckOutlined,
  /** 向下展开 ──── Select / Dropdown / Collapse 折叠箭头 */
  chevronDown: ExpandMoreOutlined,
  /** 向上收起 ──── 同上反向 */
  chevronUp: ExpandLessOutlined,
  /** 向左 ──── Breadcrumb / Pagination 上一页 */
  chevronLeft: ChevronLeftOutlined,
  /** 向右 ──── Menu submenu / Pagination 下一页 */
  chevronRight: ChevronRightOutlined,
  /** 警告 ──── Alert.warning / 表单校验失败提示 */
  warning: WarningOutlined,
  /** 信息 ──── Alert.info / Tooltip 提示 */
  info: InfoOutlined,
  /** 成功 ──── Alert.success / Message.success */
  success: CheckCircleOutlined,
  /** 错误 ──── Alert.danger / Message.error */
  error: ErrorOutlined,
  /** 搜索 ──── Input.search prefix / Select filter */
  search: SearchOutlined,
  /** 刷新 ──── Table 刷新 / 重试按钮 */
  refresh: RefreshOutlined,
  /** 更多 ──── 三点垂直菜单(竖排) */
  more: MoreVertOutlined,
  /** 添加 ──── Tabs.addable / Form 增加一行 */
  add: AddOutlined,
  /** 移除 ──── 减少 / 删除一项 */
  remove: RemoveOutlined,
  /** 排序中立 ──── 表格可排序列的未激活状态（双向箭头 ⇕） */
  sortNeutral: UnfoldMoreOutlined,
} as const

/** `BuiltinIcons` 的 key union ── 类型层面可用作 prop 约束。 */
export type BuiltinIconName = keyof typeof BuiltinIcons
