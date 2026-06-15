/**
 * docs 站点导航数据 —— 喂给 `<ZMenu :items>`。
 *
 * **约定**:
 * - `key` —— 唯一,同时充当 `ZMenu` v-model:value 的选中标识(顶层用类目名,叶子用组件英文名 lower)
 * - `label` —— 中文展示
 * - `route` —— vue-router 路径,有则点击 navigate;无则当分组容器
 * - `disabled` —— `true` 表示页面尚未实现(P1 只 ZButton + ZIcon + Home 三个可点)
 * - `children` —— 子项;`ZMenu` 内联展开
 *
 * 类目顺序按"使用频率高 → 低":通用 gene → 布局 layout → 展示 display →
 * 输入 input → 反馈 feedback → 导航 navigation → 工具 tool。
 *
 * 后续 Phase 实现一个组件就把对应 `disabled` 去掉,无需改其它结构。
 */
/**
 * 自包含定义,**故意不 extends `ZMenuItem`** —— docs 的 tsconfig 不配 path alias,
 * 直接从 `@kenconnet666/zui-vue` 引类型会走 node_modules dist(可能过期);
 * 字段结构与 `ZMenuItem` 兼容,运行时可直接 `:items="docNav"` 喂给 `<ZMenu>`。
 */
export interface DocNavItem {
  key: string
  label: string
  disabled?: boolean
  icon?: unknown
  children?: DocNavItem[]
  /** vue-router 路径,有则点击 navigate;无则当分组容器。 */
  route?: string
}

/** 路由 key → route path 反查表,供 ZMenu select 事件 → router.push 使用。 */
export const docRouteMap: Record<string, string> = {}

function indexRoutes(items: DocNavItem[]): void {
  for (const item of items) {
    if (item.route) docRouteMap[item.key] = item.route
    if (item.children) indexRoutes(item.children)
  }
}

export const docNav: DocNavItem[] = [
  {
    key: 'guide',
    label: '指南',
    children: [
      { key: 'getting-started', label: '快速开始', disabled: true },
      { key: 'theme', label: '主题与 ZBox', disabled: true },
    ],
  },

  {
    key: 'gene',
    label: '通用 (gene)',
    children: [
      { key: 'button', label: 'ZButton 按钮', route: '/components/button' },
      { key: 'icon', label: 'ZIcon 图标', route: '/components/icon' },
      { key: 'text', label: 'ZText 文本', disabled: true },
      { key: 'title', label: 'ZTitle 标题', disabled: true },
      { key: 'paragraph', label: 'ZParagraph 段落', disabled: true },
      { key: 'link', label: 'ZLink 链接', disabled: true },
      { key: 'tag', label: 'ZTag 标签', disabled: true },
      { key: 'badge', label: 'ZBadge 徽标', disabled: true },
      { key: 'avatar', label: 'ZAvatar 头像', disabled: true },
      { key: 'divider', label: 'ZDivider 分割线', disabled: true },
      { key: 'code', label: 'ZCode 代码', disabled: true },
      { key: 'code-card', label: 'ZCodeCard 代码卡片', disabled: true },
      { key: 'copy-button', label: 'ZCopyButton 复制按钮', disabled: true },
      { key: 'ellipsis', label: 'ZEllipsis 省略', disabled: true },
      { key: 'gradient-text', label: 'ZGradientText 渐变文字', disabled: true },
      { key: 'blockquote', label: 'ZBlockquote 引用', disabled: true },
      { key: 'segmented', label: 'ZSegmented 分段控制', disabled: true },
    ],
  },

  {
    key: 'layout',
    label: '布局 (layout)',
    children: [
      { key: 'flex', label: 'ZFlex 弹性布局', disabled: true },
      { key: 'grid', label: 'ZGrid 网格', disabled: true },
      { key: 'space', label: 'ZSpace 间距', disabled: true },
      { key: 'spacer', label: 'ZSpacer 占位', disabled: true },
      { key: 'split', label: 'ZSplit 拆分面板', disabled: true },
      { key: 'scrollbar', label: 'ZScrollbar 滚动条', disabled: true },
      { key: 'affix', label: 'ZAffix 固钉', disabled: true },
    ],
  },

  {
    key: 'display',
    label: '展示 (display)',
    children: [
      { key: 'card', label: 'ZCard 卡片', disabled: true },
      { key: 'image', label: 'ZImage 图片', disabled: true },
      { key: 'list', label: 'ZList 列表', disabled: true },
      { key: 'table', label: 'ZTable 表格', disabled: true },
      { key: 'data-table', label: 'ZDataTable 数据表格', disabled: true },
      { key: 'descriptions', label: 'ZDescriptions 描述', disabled: true },
      { key: 'tree', label: 'ZTree 树', disabled: true },
      { key: 'timeline', label: 'ZTimeline 时间线', disabled: true },
      { key: 'tooltip', label: 'ZTooltip 文字提示', disabled: true },
      { key: 'popover', label: 'ZPopover 气泡', disabled: true },
      { key: 'carousel', label: 'ZCarousel 走马灯', disabled: true },
      { key: 'collapse', label: 'ZCollapse 折叠面板', disabled: true },
      { key: 'calendar', label: 'ZCalendar 日历', disabled: true },
      { key: 'empty', label: 'ZEmpty 空状态', disabled: true },
      { key: 'progress', label: 'ZProgress 进度条', disabled: true },
      { key: 'result', label: 'ZResult 结果', disabled: true },
      { key: 'skeleton', label: 'ZSkeleton 骨架屏', disabled: true },
      { key: 'statistic', label: 'ZStatistic 统计数值', disabled: true },
      { key: 'virtual-list', label: 'ZVirtualList 虚拟列表', disabled: true },
    ],
  },

  {
    key: 'input',
    label: '输入 (input)',
    children: [
      { key: 'input', label: 'ZInput 输入框', disabled: true },
      { key: 'textarea', label: 'ZTextarea 多行输入', disabled: true },
      { key: 'input-number', label: 'ZInputNumber 数字输入', disabled: true },
      { key: 'auto-complete', label: 'ZAutoComplete 自动完成', disabled: true },
      { key: 'mention', label: 'ZMention 提及', disabled: true },
      { key: 'select', label: 'ZSelect 选择器', disabled: true },
      { key: 'cascader', label: 'ZCascader 级联选择', disabled: true },
      { key: 'tree-select', label: 'ZTreeSelect 树选择', disabled: true },
      { key: 'transfer', label: 'ZTransfer 穿梭框', disabled: true },
      { key: 'date-picker', label: 'ZDatePicker 日期选择', disabled: true },
      { key: 'time-picker', label: 'ZTimePicker 时间选择', disabled: true },
      { key: 'checkbox', label: 'ZCheckbox 复选框', disabled: true },
      { key: 'checkbox-group', label: 'ZCheckboxGroup 复选组', disabled: true },
      { key: 'radio', label: 'ZRadio 单选框', disabled: true },
      { key: 'radio-group', label: 'ZRadioGroup 单选组', disabled: true },
      { key: 'switch', label: 'ZSwitch 开关', disabled: true },
      { key: 'slider', label: 'ZSlider 滑块', disabled: true },
      { key: 'rate', label: 'ZRate 评分', disabled: true },
      { key: 'color-picker', label: 'ZColorPicker 颜色选择', disabled: true },
      { key: 'upload', label: 'ZUpload 上传', disabled: true },
      { key: 'dynamic-tags', label: 'ZDynamicTags 动态标签', disabled: true },
      { key: 'form', label: 'ZForm 表单', disabled: true },
      { key: 'form-item', label: 'ZFormItem 表单项', disabled: true },
    ],
  },

  {
    key: 'feedback',
    label: '反馈 (feedback)',
    children: [
      { key: 'alert', label: 'ZAlert 警告', disabled: true },
      { key: 'message', label: 'ZMessage 消息', disabled: true },
      { key: 'notification', label: 'ZNotification 通知', disabled: true },
      { key: 'modal', label: 'ZModal 对话框', disabled: true },
      { key: 'drawer', label: 'ZDrawer 抽屉', disabled: true },
      { key: 'popconfirm', label: 'ZPopconfirm 气泡确认', disabled: true },
      { key: 'loading-bar', label: 'ZLoadingBar 加载条', disabled: true },
      { key: 'spin', label: 'ZSpin 加载', disabled: true },
      { key: 'tour', label: 'ZTour 漫游', disabled: true },
    ],
  },

  {
    key: 'navigation',
    label: '导航 (navigation)',
    children: [
      { key: 'menu', label: 'ZMenu 菜单', disabled: true },
      { key: 'tabs', label: 'ZTabs 标签页', disabled: true },
      { key: 'steps', label: 'ZSteps 步骤条', disabled: true },
      { key: 'breadcrumb', label: 'ZBreadcrumb 面包屑', disabled: true },
      { key: 'dropdown', label: 'ZDropdown 下拉菜单', disabled: true },
      { key: 'pagination', label: 'ZPagination 分页', disabled: true },
      { key: 'anchor', label: 'ZAnchor 锚点', disabled: true },
      { key: 'back-top', label: 'ZBackTop 回到顶部', disabled: true },
      { key: 'page-header', label: 'ZPageHeader 页头', disabled: true },
    ],
  },

  {
    key: 'tool',
    label: '工具 (tool)',
    children: [
      { key: 'countdown', label: 'ZCountdown 倒计时', disabled: true },
      { key: 'marquee', label: 'ZMarquee 跑马灯', disabled: true },
      { key: 'number-animation', label: 'ZNumberAnimation 数字动画', disabled: true },
      { key: 'qr-code', label: 'ZQRCode 二维码', disabled: true },
      { key: 'watermark', label: 'ZWatermark 水印', disabled: true },
    ],
  },
]

indexRoutes(docNav)
