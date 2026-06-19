/**
 * docs 站点导航数据 —— 喂给 `<ZMenu :items>`。
 *
 * **约定**:
 * - `key` —— 唯一,同时充当 `ZMenu` v-model:value 的选中标识
 * - `route` —— vue-router 路径,有则点击 navigate;无则当分组容器
 * - `disabled` —— `true` 表示页面尚未实现
 * - `children` —— 子项;`ZMenu` 内联展开
 */
export interface DocNavItem {
  key: string
  label: string
  disabled?: boolean
  icon?: unknown
  children?: DocNavItem[]
  route?: string
}

/** 路由 key → route path 反查表。 */
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
      { key: 'getting-started', label: '快速开始', route: '/guide/quick-start' },
      { key: 'theme', label: '主题与 ZBox', route: '/guide/theme' },
      { key: 'core', label: 'zui-core 模块', route: '/guide/core' },
      { key: 'prop-shape', label: 'props 范式', route: '/guide/prop-shape' },
      { key: 'sx-object', label: 'SxObject 模型', route: '/guide/sx-object' },
      { key: 'hooks', label: '内置 hooks', route: '/guide/hooks' },
      { key: 'theme-ext', label: '主题扩展', route: '/guide/theme-ext' },
      { key: 'locale-ext', label: 'Locale 扩展', route: '/guide/locale-ext' },
      { key: 'ssr', label: 'SSR & tree-shake', route: '/guide/ssr' },
    ],
  },

  {
    key: 'gene',
    label: '通用 (gene)',
    children: [
      { key: 'button', label: 'ZButton 按钮', route: '/gene/button' },
      { key: 'button-group', label: 'ZButtonGroup 按钮组', route: '/gene/button-group' },
      { key: 'icon', label: 'ZIcon 图标', route: '/gene/icon' },
      { key: 'text', label: 'ZText 文本', route: '/gene/text' },
      { key: 'title', label: 'ZTitle 标题', route: '/gene/title' },
      { key: 'paragraph', label: 'ZParagraph 段落', route: '/gene/paragraph' },
      { key: 'link', label: 'ZLink 链接', route: '/gene/link' },
      { key: 'tag', label: 'ZTag 标签', route: '/gene/tag' },
      { key: 'badge', label: 'ZBadge 徽标', route: '/gene/badge' },
      { key: 'avatar', label: 'ZAvatar 头像', route: '/gene/avatar' },
      { key: 'avatar-group', label: 'ZAvatarGroup 头像组', route: '/gene/avatar-group' },
      { key: 'divider', label: 'ZDivider 分割线', route: '/gene/divider' },
      { key: 'code', label: 'ZCode 代码', route: '/gene/code' },
      { key: 'code-card', label: 'ZCodeCard 代码卡片', route: '/gene/code-card' },
      { key: 'copy-button', label: 'ZCopyButton 复制按钮', route: '/gene/copy-button' },
      { key: 'ellipsis', label: 'ZEllipsis 省略', route: '/gene/ellipsis' },
      { key: 'gradient-text', label: 'ZGradientText 渐变文字', route: '/gene/gradient-text' },
      { key: 'blockquote', label: 'ZBlockquote 引用', route: '/gene/blockquote' },
      { key: 'segmented', label: 'ZSegmented 分段控制', route: '/gene/segmented' },
    ],
  },

  {
    key: 'layout',
    label: '布局 (layout)',
    children: [
      { key: 'flex', label: 'ZFlex 弹性布局', route: '/layout/flex' },
      { key: 'grid', label: 'ZGrid 网格', route: '/layout/grid' },
      { key: 'space', label: 'ZSpace 间距', route: '/layout/space' },
      { key: 'spacer', label: 'ZSpacer 占位', route: '/layout/spacer' },
      { key: 'split', label: 'ZSplit 拆分面板', route: '/layout/split' },
      { key: 'scrollbar', label: 'ZScrollbar 滚动条', route: '/layout/scrollbar' },
      { key: 'affix', label: 'ZAffix 固钉', route: '/layout/affix' },
    ],
  },

  {
    key: 'display',
    label: '展示 (display)',
    children: [
      { key: 'card', label: 'ZCard 卡片', route: '/display/card' },
      { key: 'image', label: 'ZImage 图片', route: '/display/image' },
      { key: 'empty', label: 'ZEmpty 空状态', route: '/display/empty' },
      { key: 'progress', label: 'ZProgress 进度条', route: '/display/progress' },
      { key: 'result', label: 'ZResult 结果', route: '/display/result' },
      { key: 'skeleton', label: 'ZSkeleton 骨架屏', route: '/display/skeleton' },
      { key: 'statistic', label: 'ZStatistic 统计数值', route: '/display/statistic' },
      { key: 'list', label: 'ZList 列表', route: '/display/list' },
      { key: 'table', label: 'ZTable 表格', route: '/display/table' },
      { key: 'data-table', label: 'ZDataTable 数据表格', route: '/display/data-table' },
      { key: 'descriptions', label: 'ZDescriptions 描述', route: '/display/descriptions' },
      { key: 'tree', label: 'ZTree 树', route: '/display/tree' },
      { key: 'timeline', label: 'ZTimeline 时间线', route: '/display/timeline' },
      { key: 'tooltip', label: 'ZTooltip 文字提示', route: '/display/tooltip' },
      { key: 'popover', label: 'ZPopover 气泡', route: '/display/popover' },
      { key: 'carousel', label: 'ZCarousel 走马灯', route: '/display/carousel' },
      { key: 'collapse', label: 'ZCollapse 折叠面板', route: '/display/collapse' },
      { key: 'calendar', label: 'ZCalendar 日历', route: '/display/calendar' },
      { key: 'virtual-list', label: 'ZVirtualList 虚拟列表', route: '/display/virtual-list' },
    ],
  },

  {
    key: 'input',
    label: '输入 (input)',
    children: [
      { key: 'input', label: 'ZInput 输入框', route: '/input/input' },
      { key: 'textarea', label: 'ZTextarea 多行输入', route: '/input/textarea' },
      { key: 'input-number', label: 'ZInputNumber 数字输入', route: '/input/input-number' },
      { key: 'input-otp', label: 'ZInputOTP 验证码', route: '/input/input-otp' },
      { key: 'select', label: 'ZSelect 选择器', route: '/input/select' },
      { key: 'checkbox', label: 'ZCheckbox 复选框', route: '/input/checkbox' },
      { key: 'checkbox-group', label: 'ZCheckboxGroup 复选组', route: '/input/checkbox' },
      { key: 'radio', label: 'ZRadio 单选框', route: '/input/radio' },
      { key: 'radio-group', label: 'ZRadioGroup 单选组', route: '/input/radio' },
      { key: 'switch', label: 'ZSwitch 开关', route: '/input/switch' },
      { key: 'slider', label: 'ZSlider 滑块', route: '/input/slider' },
      { key: 'rate', label: 'ZRate 评分', route: '/input/rate' },
      { key: 'date-picker', label: 'ZDatePicker 日期选择', route: '/input/date-picker' },
      { key: 'date-range-picker', label: 'ZDateRangePicker 日期范围', route: '/input/date-range-picker' },
      { key: 'time-picker', label: 'ZTimePicker 时间选择', route: '/input/time-picker' },
      { key: 'upload', label: 'ZUpload 上传', route: '/input/upload' },
      { key: 'form', label: 'ZForm 表单', route: '/input/form' },
      { key: 'form-item', label: 'ZFormItem 表单项', route: '/input/form' },
      { key: 'auto-complete', label: 'ZAutoComplete 自动完成', route: '/input/auto-complete' },
      { key: 'mention', label: 'ZMention 提及', route: '/input/mention' },
      { key: 'cascader', label: 'ZCascader 级联选择', route: '/input/cascader' },
      { key: 'tree-select', label: 'ZTreeSelect 树选择', route: '/input/tree-select' },
      { key: 'transfer', label: 'ZTransfer 穿梭框', route: '/input/transfer' },
      { key: 'dynamic-tags', label: 'ZDynamicTags 动态标签', route: '/input/dynamic-tags' },
      { key: 'color-picker', label: 'ZColorPicker 颜色选择', route: '/input/color-picker' },
    ],
  },

  {
    key: 'feedback',
    label: '反馈 (feedback)',
    children: [
      { key: 'alert', label: 'ZAlert 警告', route: '/feedback/alert' },
      { key: 'message', label: 'ZMessage 消息', route: '/feedback/message' },
      { key: 'notification', label: 'ZNotification 通知', route: '/feedback/notification' },
      { key: 'loading-bar', label: 'ZLoadingBar 加载条', route: '/feedback/loading-bar' },
      { key: 'spin', label: 'ZSpin 加载', route: '/feedback/spin' },
      { key: 'modal', label: 'ZModal 对话框', route: '/feedback/modal' },
      { key: 'drawer', label: 'ZDrawer 抽屉', route: '/feedback/drawer' },
      { key: 'popconfirm', label: 'ZPopconfirm 气泡确认', route: '/feedback/popconfirm' },
      { key: 'tour', label: 'ZTour 漫游', route: '/feedback/tour' },
    ],
  },

  {
    key: 'navigation',
    label: '导航 (navigation)',
    children: [
      { key: 'menu', label: 'ZMenu 菜单', route: '/navigation/menu' },
      { key: 'tabs', label: 'ZTabs 标签页', route: '/navigation/tabs' },
      { key: 'steps', label: 'ZSteps 步骤条', route: '/navigation/steps' },
      { key: 'breadcrumb', label: 'ZBreadcrumb 面包屑', route: '/navigation/breadcrumb' },
      { key: 'dropdown', label: 'ZDropdown 下拉菜单', route: '/navigation/dropdown' },
      { key: 'pagination', label: 'ZPagination 分页', route: '/navigation/pagination' },
      { key: 'anchor', label: 'ZAnchor 锚点', route: '/navigation/anchor' },
      { key: 'back-top', label: 'ZBackTop 回到顶部', route: '/navigation/back-top' },
      { key: 'page-header', label: 'ZPageHeader 页头', route: '/navigation/page-header' },
    ],
  },

  {
    key: 'tool',
    label: '工具 (tool)',
    children: [
      { key: 'countdown', label: 'ZCountdown 倒计时', route: '/tool/countdown' },
      { key: 'marquee', label: 'ZMarquee 跑马灯', route: '/tool/marquee' },
      {
        key: 'number-animation',
        label: 'ZNumberAnimation 数字动画',
        route: '/tool/number-animation',
      },
      { key: 'qr-code', label: 'ZQRCode 二维码', route: '/tool/qr-code' },
      { key: 'watermark', label: 'ZWatermark 水印', route: '/tool/watermark' },
    ],
  },
]

indexRoutes(docNav)
