---
'@kenconnet666/zui-core': minor
---

Batch 3 — W3.2 完整 stack-trace label（dev 体验）

把 `Chain` 构造的 `debug: true` 选项从简化版升级为完整版：

- 抽到新模块 `src/dev/stackTrace.ts`，方便测试与复用
- 跨 runtime 解析 stack 行：V8（Chrome / Node）/ SpiderMonkey（Firefox）/ JavaScriptCore（Safari）三种格式
- framework frame 过滤：跳过 `Chain.ts` / `proxy.ts` / `carrier.ts` / `stackTrace.ts` / `node_modules` / `@kenconnet666/zui-core` 等
- 输出 `fileName_LINE` 格式 label（去扩展名 / 去路径，对 emotion devtools 友好）
- `isProductionEnv()` 提取：production 下 `debug: true` 自动降级 noop（避免栈泄露）
- 与 C2 `label()` join 协作：手动 `c.label('Button')` 后会拼成 `App_42.Button`

新增 26 测试（共 224 / 198 → 224）。

新导出（dev 工具）：
- `makeCallsiteLabel(stack?: string): string | null`
- `parseStackLine(line: string): StackFrame | null`
- `findUserCallsite(stackLines: string[]): StackFrame | null`
- `isProductionEnv(): boolean`
- type `StackFrame`
