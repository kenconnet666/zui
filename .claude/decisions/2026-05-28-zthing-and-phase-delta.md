# 2026-05-28 · ZThing + Phase δ 取舍决策

> **背景**:文档补完任务进入收尾,路线图 §5 Stage 8(`display/ZThing` 未做)和 Stage 9
> Phase δ(VirtualList / 富文本 / DataGrid 企业版 / Schema-driven Form)需要明确取舍,
> 决定哪些列入"无限期推迟",哪些已经隐式完成。

---

## 1. `display/ZThing` —— 不做

### 决策

**Stage 8 Phase γ 的 ZThing 永久从路线图删除**,不进入 Phase δ。

### 理由

1. **"thing" 语义模糊**:Naive UI / Element Plus 都不存在对应组件。Naive UI 的 `n-thing` 在
   官方文档里也是一个"占位用复合容器"(头像/标题/描述/操作四区),但实际业务里完全可以用 `ZCard`
   - `ZSpace` 或者 `ZList.item` 拼出来,**没有不可替代性**。
2. **现有组件已覆盖**:`ZCard`(head/body/foot + sx 平铺) + `ZAvatar` + `ZSpace` 已足够覆盖
   "头像 + 标题 + 描述 + 操作"的常见场景。
3. **不做不影响**任何 P0/P1 业务场景。

### 迁移建议(给后续如果有人想用)

```vue
<ZCard :css="s => s.padding._middle">
  <template #header>
    <ZSpace>
      <ZAvatar :src="user.avatar" />
      <ZSpace direction="vertical" :size="0">
        <ZText weight="bold">{{ user.name }}</ZText>
        <ZText color="textSecondary" size="small">{{ user.desc }}</ZText>
      </ZSpace>
    </ZSpace>
  </template>
  <slot />
  <template #footer>
    <ZButton variant="text">操作</ZButton>
  </template>
</ZCard>
```

### 路线图操作

- `.claude/zui-vue-roadmap.md` §5 Stage 8 中的 `- [ ] display/ZThing` 改为
  `- [x] display/ZThing —— 永久 skip(参见 decisions/2026-05-28-zthing-and-phase-delta.md)`

---

## 2. Phase δ 四件套取舍

### 2.1 VirtualList —— **已交付**(2026-05-24 S0-S9 sprint)

路线图原文档"按需开,可能新增依赖 `@tanstack/vue-virtual`"。**实际上 2026-05-24 已经完成**:

- ✅ `useZVirtualScroll<T>(opts)` —— 通用算法 hook(rAF 节流 + 二分 + autoMeasure)
- ✅ `<ZVirtualList>` —— 通用虚拟滚动列表(`@vueuse/core` ResizeObserver,**不用 tanstack**)
- ✅ `<ZDataTable>` —— 数据表格(行虚拟 + sticky header)
- ✅ `ZList` / `ZTree` / `ZSelect` / `ZAutoComplete` / `ZMention` / `ZTransfer` / `ZTreeSelect`
  / `ZCascader` 全部接入虚拟滚动

**结论**:**Phase δ.VirtualList 完成,改路线图标 `[x]`**。

### 2.2 富文本(TipTap 等)—— 不做

#### 决策

不做。

#### 理由

1. **依赖体积**:TipTap 核心 ~30KB + 各扩展(图片/表格/链接/Mention/...)累计 60-100KB,
   会让 ui-vue 总体积翻倍。
2. **业务高度定制**:富文本需求差异巨大,业务方往往要做自己的 toolbar / schema / 协作集成。
   提供一个"通用 ZRichText" 反而成累赘。
3. **替代方案明确**:推荐业务方按需直接装 TipTap / Lexical / Slate / Quill,然后用
   `<ZBox>` + `:css` 兜底加我们的主题样式。

#### 路线图操作

`Stage 9` 中的 `- [ ] 富文本(TipTap 等)` 改为 `- [-] 富文本 —— 不做,业务方直接集成 TipTap/Lexical 自行处理`。

### 2.3 DataGrid 企业版(列冻结 / expandable rows / 虚拟滚动)—— 部分完成,剩余推迟

#### 已完成

- ✅ 虚拟滚动 —— `<ZDataTable>` 已支持
- ✅ 排序 / 选择 / 边框 / 斑马纹 / loading / 空态 —— 已支持
- ✅ sticky header —— 已支持

#### 仍待开

- 🔲 **列冻结**(left / right):typed sticky 列,需要 sticky-left/right offset 累积计算
- 🔲 **expandable rows**:行级展开 panel
- 🔲 **column resize**:用户拖拽列宽
- 🔲 **row groupBy / aggregations**:聚合行

#### 决策

按需开,**不进入主路线图**。如有业务诉求,单独开 sprint(预计 3-5 天工作量)。

期间 `ZDataTable` 保持现有能力,符合 80% 业务需求。

#### 路线图操作

`Stage 9` 中的 `- [ ] DataGrid 企业版` 改为 `- [~] DataGrid 企业版 —— 50% 完成(虚拟/排序/选择)。列冻结/expandable/resize/groupBy 按需开`。

### 2.4 Schema-driven Form —— 不做

#### 决策

不做。

#### 理由

1. **`<ZForm>` 已足够**:`ZForm` + `ZFormItem` 走 async-validator + reactive model,
   v-model 双向绑定足够清晰。
2. **schema 抽象成本高,收益低**:JSON schema → form 的方案(react-jsonschema-form / formily)
   学习曲线陡,定制性反而差。
3. **替代方案明确**:业务方需要动态 schema 表单,可以基于 `<ZForm>` 自行包装一个 `<DynamicZForm>`
   wrapper —— 100 行代码以内的事。

#### 路线图操作

`Stage 9` 中的 `- [ ] Schema-driven Form` 改为 `- [-] Schema-driven Form —— 不做,业务方基于 ZForm 自行包装`。

---

## 3. Phase δ 整体收尾

Stage 9 整体改写为:

```markdown
### Stage 9 ── Phase δ / P3(收尾决策)

> 决策日期:2026-05-28
> 决策文档:.claude/decisions/2026-05-28-zthing-and-phase-delta.md

- [x] VirtualList —— **已交付**(2026-05-24 S0-S9 sprint;ZVirtualList / ZDataTable + 8 个
      数据组件接入)
- [-] 富文本 —— **不做**,业务方直接集成 TipTap/Lexical
- [~] DataGrid 企业版 —— **50% 完成**(虚拟/排序/选择/sticky)。列冻结/expandable rows/
  column resize/groupBy 按需开 sprint
- [-] Schema-driven Form —— **不做**,业务方基于 ZForm 自行包装

**Stage 9 状态:closed**。后续业务诉求驱动新需求 → 开新 sprint,不属于"路线图主线"。
```

---

## 4. 影响

### 测试 / 验证

无代码变更,纯文档。

### 文档站点

- `ZVirtualList` / `ZDataTable` 已有 page,不动。
- 不为 ZThing 写 docs page(从 `nav.ts` / `router.ts` 移除占位 —— 检查发现实际上 nav.ts 中
  display 段也没有 ZThing,**无需改动**)。

### 路线图更新

直接修改 `.claude/zui-vue-roadmap.md` §5 Stage 8 + Stage 9,见上文。

---

## 5. 后续触发条件

如果以下情况发生,重新打开 Phase δ 决策:

1. **业务方明确诉求**:列冻结 / 行展开 / column resize 至少一个有真实 PR/issue
2. **富文本**:有具体业务场景明确需要"开箱即用富文本"(而不是业务方自集成)
3. **Schema-driven Form**:有 ≥3 个项目反馈"动态表单需求频繁,ZForm wrapper 重复造轮子"

满足任一条件 → 写新决策文档 → 开 sprint。
