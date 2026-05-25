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
    ...legacyRedirects,
  ],
  scrollBehavior: () => ({ top: 0 }),
})
