/**
 * `feedback/` —— 反馈类组件。
 */
export { default as ZAlert } from './ZAlert.vue'
export type { ZAlertProps, ZAlertEmits } from './ZAlert.vue'

export { default as ZSpin } from './ZSpin.vue'
export type { ZSpinProps } from './ZSpin.vue'

export { default as ZModal } from './ZModal.vue'
export type { ZModalProps, ZModalEmits } from './ZModal.vue'

export { default as ZMessage } from './ZMessage.vue'
export type { ZMessageProps, ZMessageItem, ZMessageEmits } from './ZMessage.vue'

export { createMessageApi, type ZMessageApi, type CreateMessageApiOptions } from './messageApi'

// ─── Phase β feedback 补全 ───
export { default as ZDrawer } from './ZDrawer.vue'
export type { ZDrawerProps, ZDrawerEmits, ZDrawerPlacement } from './ZDrawer.vue'

export { default as ZPopconfirm } from './ZPopconfirm.vue'
export type { ZPopconfirmProps, ZPopconfirmEmits } from './ZPopconfirm.vue'

export { default as ZNotification } from './ZNotification.vue'
export type { ZNotificationProps, ZNotificationEmits, ZNotificationItem, ZNotificationPlacement } from './ZNotification.vue'

export {
  createNotificationApi,
  type ZNotificationApi,
  type CreateNotificationApiOptions,
} from './notificationApi'

export {
  createDialogApi,
  type ZDialogApi,
  type ZDialogOptions,
  type ZDialogKind,
  type CreateDialogApiOptions,
} from './dialogApi'

export { default as ZLoadingBar } from './ZLoadingBar.vue'
export type { ZLoadingBarProps } from './ZLoadingBar.vue'

// ─── Phase γ feedback 补全 ───
export { default as ZTour } from './ZTour.vue'
export type { ZTourProps, ZTourEmits, ZTourStep } from './ZTour.vue'
