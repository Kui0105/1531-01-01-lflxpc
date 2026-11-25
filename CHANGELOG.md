# 更新日志

## v0.2.0 (2026-11-25)

### 本次更新

- 侧边栏新增「互评任务」导航（位于工作台与用户管理之间），下设「任务列表」
- 任务列表页按需求实现：年月筛选、六项统计展示、门店评价进度列表
- 新增查看详情（门店人员进度）、查看评价（评价内容）、立即评价（评分+补充评价弹窗）
- 使用 mock 数据：支持按月切换、评价提交后自动更新进度与门店平均分；特殊人员 5 分制、职能部门 10 分制

### 说明

- 修改文件：`src/router/routes.ts`、`src/layout/default/components/sidebar/side.vue`、`src/views/appraise/task/index.vue`、`src/views/appraise/task/data.ts`、`package.json`、`VERSION`、`CHANGELOG.md`
- 验证：类型检查通过（新增文件无报错）
- 预览：http://localhost:5173/admin/appraise/task

## v0.1.0 (2026-11-25)

### 本次更新

- 工作台页面改造为「数据概览」：新增门店筛选、今日数据、累计数据、近七日营收趋势图、本月营收/产值排行
- 移除工作台原「版本信息」与「互评任务」模块，移除页面大标题
- 优化整体布局与配色：筛选工具条、分色指标卡、趋势摘要、奖牌式排行榜

### 说明

- 修改文件：`src/views/workbench/index.vue`、`src/views/workbench/data.ts`、`package.json`、`VERSION`、`CHANGELOG.md`
- 验证：类型检查通过（工作台文件无报错）
- 预览：http://localhost:5173/admin/workbench
