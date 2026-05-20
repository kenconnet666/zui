/**
 * docs 工程的 zui module augmentation —— 演示用户扩 brand 色的标准模式。
 *
 * 在用户 zui.d.ts 里通过 `declare module '@kenconnet666/zui-vue'` augmentation
 * `UserColorExt` / `UserSpacingExt` 等扩展锚点，zui-vue 的 ZuiSchema 各 category
 * 通过 `& Partial<UserXxxExt>` intersection 自动拉入用户字段。
 *
 * augmentation 之后：
 * - `<ZIcon :css="(s) => { s.color._brandRoyal }" />` **隐式推导直接生效**
 * - 不需要写 `interface MySchema extends ZuiSchema { ... }` 与 `new Theme<MySchema>(...)`
 * - 运行时配 `zuiLight.extend({ color: { brandRoyal: '#1a3a8f' } })` 喂入值
 */
declare module '@kenconnet666/zui-vue' {
  interface UserColorExt {
    brandRoyal: string
    brandSunset: string
    brandForest: string
  }
}

export {}
