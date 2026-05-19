# @kenconnet666/zui-core

## 0.3.0

### Minor Changes

- Phase 3 全量落地：新增 ComponentTokenRegistry / StyleProps / \_stack / \_grid / \_inspect / assertSchemaConsistency / createIcssInstance SSR wrapper / injectPreflight / registerCustomProperty / injectLayer / registerFont 等约 20 个 API。default schema 补 8 个 token category（duration / easing / breakpoint / zIndex / opacity / lineHeight / letterSpacing / aspectRatio）。bench 提升 21×（icss 19k → 404k ops/s）。测试 95 → 174。

  新增 API：
  - `ComponentTokenRegistry` declaration merging 注册槽 + `FlattenComponentTokens` 工具 + `withComponentTokens` 派生 helper
  - `StyleProps<T>` 类型 + `applyStyleProps(chain, props)` 运行时（30+ alias：color/bg/p/m/rounded/shadow/...）
  - `TokenOf<Cat, T>` 工具类型
  - 通用属性 variant：`_data` / `_aria` / `_has` / `_not` / `_is` / `_where`
  - 状态 variant：`_open` / `_closed` / `_loading` / `_inert` / `_forcedColors` / `_starting`
  - container query 简写：`_containerSm` / `_containerMd` 等
  - group / peer data 变种：`_groupData` / `_peerData` / `_groupAria` / `_peerAria`
  - Transform longhand：`_translate` / `_translateX/Y/Z` / `_rotate` / `_rotateX/Y/Z` / `_scale` / `_scaleX/Y/Z` / `_skew` / `_perspective` / `_transformOrigin` / `_preserve3d`
  - Filter / Backdrop helpers：`_filterBlur` / `_filterBrightness` 等共 18 个
  - Gradient helpers：`_linearGradient` / `_radialGradient` / `_conicGradient`
  - Pattern 库：`_stack` / `_grid` / `_aspectVideo/Square/Portrait/Landscape` / `_focusRing` / `_visuallyHidden` / `_fillParent` / `_skipLink`
  - Dev 工具：`_inspect({ format })` / `assertSchemaConsistency()`
  - SSR：`createIcssInstance(emotion)` 工厂返回完整工具集（icss / chain / cx / injectGlobal / ikeyframes / registerAnimation / injectPreflight / registerCustomProperty / injectLayer / injectLayerOrder / registerFont / extractCritical）

  性能优化：
  - `Theme.getKeymap()` 懒缓存（W4.1）：bench icss 19k → 404k ops/s（21× 提速）
  - `resolveTheme()` 末尾 `Object.freeze` 每个 category（V8 sealed class）

  类型系统：
  - `PropCarrier` / `ColorPropCarrier` 扩 `TExtraKeywords` slot
  - generator 接管 extra-keywords 扩展槽 + 校验 `_` 前缀
  - LENGTH_UNITS 从 16 扩到 30（容器查询单位 cqw/cqh/cqi/cqb/cqmin/cqmax + 动态视口单位 svw/lvw/dvw 等）
  - ENHANCED_PROPS 从 129 扩到 195（filter / tables / lists / SVG / scroll-snap / pointer / layout / blend / writing / columns / break / 现代 CSS 4 / counter）

  非破坏性 minor 升级：所有 0.2.x API 保留。
