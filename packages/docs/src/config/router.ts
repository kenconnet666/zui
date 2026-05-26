import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const guideRoutes: RouteRecordRaw[] = [
  { path: '/guide/quick-start', component: () => import('../pages/QuickStartPage.vue') },
  { path: '/guide/theme',       component: () => import('../pages/ThemePage.vue') },
  { path: '/guide/iem',         component: () => import('../pages/IemPage.vue') },
  { path: '/guide/core',        component: () => import('../pages/ZuiCorePage.vue') },
]

const geneRoutes: RouteRecordRaw[] = [
  { path: '/gene/button',        component: () => import('../gene/ZButtonPage.vue') },
  { path: '/gene/icon',          component: () => import('../gene/ZIconPage.vue') },
  { path: '/gene/text',          component: () => import('../gene/ZTextPage.vue') },
  { path: '/gene/title',         component: () => import('../gene/ZTitlePage.vue') },
  { path: '/gene/paragraph',     component: () => import('../gene/ZParagraphPage.vue') },
  { path: '/gene/link',          component: () => import('../gene/ZLinkPage.vue') },
  { path: '/gene/tag',           component: () => import('../gene/ZTagPage.vue') },
  { path: '/gene/badge',         component: () => import('../gene/ZBadgePage.vue') },
  { path: '/gene/avatar',        component: () => import('../gene/ZAvatarPage.vue') },
  { path: '/gene/divider',       component: () => import('../gene/ZDividerPage.vue') },
  { path: '/gene/code',          component: () => import('../gene/ZCodePage.vue') },
  { path: '/gene/code-card',     component: () => import('../gene/ZCodeCardPage.vue') },
  { path: '/gene/copy-button',   component: () => import('../gene/ZCopyButtonPage.vue') },
  { path: '/gene/ellipsis',      component: () => import('../gene/ZEllipsisPage.vue') },
  { path: '/gene/gradient-text', component: () => import('../gene/ZGradientTextPage.vue') },
  { path: '/gene/blockquote',    component: () => import('../gene/ZBlockquotePage.vue') },
  { path: '/gene/segmented',     component: () => import('../gene/ZSegmentedPage.vue') },
]

const layoutRoutes: RouteRecordRaw[] = [
  { path: '/layout/flex',      component: () => import('../layout/ZFlexPage.vue') },
  { path: '/layout/grid',      component: () => import('../layout/ZGridPage.vue') },
  { path: '/layout/space',     component: () => import('../layout/ZSpacePage.vue') },
  { path: '/layout/spacer',    component: () => import('../layout/ZSpacerPage.vue') },
  { path: '/layout/split',     component: () => import('../layout/ZSplitPage.vue') },
  { path: '/layout/scrollbar', component: () => import('../layout/ZScrollbarPage.vue') },
  { path: '/layout/affix',     component: () => import('../layout/ZAffixPage.vue') },
]

const displayRoutes: RouteRecordRaw[] = [
  { path: '/display/card',         component: () => import('../display/ZCardPage.vue') },
  { path: '/display/image',        component: () => import('../display/ZImagePage.vue') },
  { path: '/display/empty',        component: () => import('../display/ZEmptyPage.vue') },
  { path: '/display/progress',     component: () => import('../display/ZProgressPage.vue') },
  { path: '/display/result',       component: () => import('../display/ZResultPage.vue') },
  { path: '/display/skeleton',     component: () => import('../display/ZSkeletonPage.vue') },
  { path: '/display/statistic',    component: () => import('../display/ZStatisticPage.vue') },
  { path: '/display/timeline',     component: () => import('../display/ZTimelinePage.vue') },
  { path: '/display/tooltip',      component: () => import('../display/ZTooltipPage.vue') },
  { path: '/display/popover',      component: () => import('../display/ZPopoverPage.vue') },
  { path: '/display/carousel',     component: () => import('../display/ZCarouselPage.vue') },
  { path: '/display/collapse',     component: () => import('../display/ZCollapsePage.vue') },
  { path: '/display/descriptions', component: () => import('../display/ZDescriptionsPage.vue') },
  { path: '/display/calendar',     component: () => import('../display/ZCalendarPage.vue') },
  { path: '/display/list',         component: () => import('../display/ZListPage.vue') },
  { path: '/display/table',        component: () => import('../display/ZTablePage.vue') },
  { path: '/display/data-table',   component: () => import('../display/ZDataTablePage.vue') },
  { path: '/display/tree',         component: () => import('../display/ZTreePage.vue') },
  { path: '/display/virtual-list', component: () => import('../display/ZVirtualListPage.vue') },
]

const feedbackRoutes: RouteRecordRaw[] = [
  { path: '/feedback/alert',        component: () => import('../feedback/ZAlertPage.vue') },
  { path: '/feedback/message',      component: () => import('../feedback/ZMessagePage.vue') },
  { path: '/feedback/notification',  component: () => import('../feedback/ZNotificationPage.vue') },
  { path: '/feedback/loading-bar',  component: () => import('../feedback/ZLoadingBarPage.vue') },
  { path: '/feedback/spin',         component: () => import('../feedback/ZSpinPage.vue') },
  { path: '/feedback/modal',        component: () => import('../feedback/ZModalPage.vue') },
  { path: '/feedback/drawer',       component: () => import('../feedback/ZDrawerPage.vue') },
  { path: '/feedback/popconfirm',   component: () => import('../feedback/ZPopconfirmPage.vue') },
  { path: '/feedback/tour',         component: () => import('../feedback/ZTourPage.vue') },
]

const toolRoutes: RouteRecordRaw[] = [
  { path: '/tool/countdown',        component: () => import('../tool/ZCountdownPage.vue') },
  { path: '/tool/marquee',          component: () => import('../tool/ZMarqueePage.vue') },
  { path: '/tool/number-animation', component: () => import('../tool/ZNumberAnimationPage.vue') },
  { path: '/tool/qr-code',          component: () => import('../tool/ZQRCodePage.vue') },
  { path: '/tool/watermark',        component: () => import('../tool/ZWatermarkPage.vue') },
]

const navigationRoutes: RouteRecordRaw[] = [
  { path: '/navigation/menu',        component: () => import('../navigation/ZMenuPage.vue') },
  { path: '/navigation/tabs',        component: () => import('../navigation/ZTabsPage.vue') },
  { path: '/navigation/steps',       component: () => import('../navigation/ZStepsPage.vue') },
  { path: '/navigation/breadcrumb',  component: () => import('../navigation/ZBreadcrumbPage.vue') },
  { path: '/navigation/dropdown',    component: () => import('../navigation/ZDropdownPage.vue') },
  { path: '/navigation/pagination',  component: () => import('../navigation/ZPaginationPage.vue') },
  { path: '/navigation/anchor',      component: () => import('../navigation/ZAnchorPage.vue') },
  { path: '/navigation/back-top',    component: () => import('../navigation/ZBackTopPage.vue') },
  { path: '/navigation/page-header', component: () => import('../navigation/ZPageHeaderPage.vue') },
]

const inputRoutes: RouteRecordRaw[] = [
  { path: '/input/input',        component: () => import('../input/ZInputPage.vue') },
  { path: '/input/textarea',     component: () => import('../input/ZTextareaPage.vue') },
  { path: '/input/input-number', component: () => import('../input/ZInputNumberPage.vue') },
  { path: '/input/select',       component: () => import('../input/ZSelectPage.vue') },
  { path: '/input/checkbox',     component: () => import('../input/ZCheckboxPage.vue') },
  { path: '/input/radio',        component: () => import('../input/ZRadioPage.vue') },
  { path: '/input/switch',       component: () => import('../input/ZSwitchPage.vue') },
  { path: '/input/slider',       component: () => import('../input/ZSliderPage.vue') },
  { path: '/input/rate',         component: () => import('../input/ZRatePage.vue') },
  { path: '/input/date-picker',  component: () => import('../input/ZDatePickerPage.vue') },
  { path: '/input/time-picker',  component: () => import('../input/ZTimePickerPage.vue') },
  { path: '/input/upload',       component: () => import('../input/ZUploadPage.vue') },
  { path: '/input/form',         component: () => import('../input/ZFormPage.vue') },
  { path: '/input/auto-complete',component: () => import('../input/ZAutoCompletePage.vue') },
  { path: '/input/mention',      component: () => import('../input/ZMentionPage.vue') },
  { path: '/input/cascader',     component: () => import('../input/ZCascaderPage.vue') },
  { path: '/input/tree-select',  component: () => import('../input/ZTreeSelectPage.vue') },
  { path: '/input/transfer',     component: () => import('../input/ZTransferPage.vue') },
  { path: '/input/dynamic-tags', component: () => import('../input/ZDynamicTagsPage.vue') },
  { path: '/input/color-picker', component: () => import('../input/ZColorPickerPage.vue') },
]

/** 旧路由兼容（已有外链/收藏）。 */
const legacyRedirects: RouteRecordRaw[] = [
  { path: '/components/button', redirect: '/gene/button' },
  { path: '/components/icon',   redirect: '/gene/icon' },
  { path: '/icon',              redirect: '/gene/icon' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',                    component: () => import('../pages/HomePage.vue') },
    { path: '/:pathMatch(.*)*',     component: () => import('../pages/NotFoundPage.vue') },
    ...guideRoutes,
    ...geneRoutes,
    ...layoutRoutes,
    ...displayRoutes,
    ...feedbackRoutes,
    ...toolRoutes,
    ...navigationRoutes,
    ...inputRoutes,
    ...legacyRedirects,
  ],
  scrollBehavior: () => ({ top: 0 }),
})
