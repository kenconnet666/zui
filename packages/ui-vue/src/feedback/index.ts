/**
 * `feedback/` —— 反馈类组件。
 */
export { default as ZAlert } from './ZAlert.vue'
export type { ZAlertProps, ZAlertType, ZAlertEmits } from './ZAlert.vue'

export { default as ZSpin } from './ZSpin.vue'
export type { ZSpinProps, ZSpinSize } from './ZSpin.vue'

export { default as ZModal } from './ZModal.vue'
export type { ZModalProps, ZModalEmits } from './ZModal.vue'

export { default as ZMessage } from './ZMessage.vue'
export type { ZMessageProps, ZMessageItem, ZMessageType, ZMessageEmits } from './ZMessage.vue'

export { createMessageApi, type ZMessageApi, type CreateMessageApiOptions } from './messageApi'

// ─── Phase β feedback 补全 ───
export { default as ZDrawer } from './ZDrawer.vue'
export type { ZDrawerProps, ZDrawerEmits, ZDrawerPlacement } from './ZDrawer.vue'

export { default as ZPopconfirm } from './ZPopconfirm.vue'
export type { ZPopconfirmProps, ZPopconfirmEmits } from './ZPopconfirm.vue'

export { default as ZNotification } from './ZNotification.vue'
export type {
  ZNotificationProps,
  ZNotificationEmits,
  ZNotificationItem,
  ZNotificationType,
} from './ZNotification.vue'

export {
  createNotificationApi,
  type ZNotificationApi,
  type CreateNotificationApiOptions,
} from './notificationApi'

export { default as ZLoadingBar } from './ZLoadingBar.vue'
export type { ZLoadingBarProps } from './ZLoadingBar.vue'
