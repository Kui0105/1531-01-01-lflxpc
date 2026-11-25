# 更新日志

## v0.7.1 (2026-11-25)

### 本次更新

- 移除页面底部「功能规则」模块（规则仅用于后续开发参考，不在页面展示）
- 优化列表显示：单元格上下内边距调整为 12px，行间距加大，整体不再拥挤；精简列宽分配
- 用户信息列加宽至 250px 并取消文本截断 ellipsis，昵称与手机号完整显示
- 订单信息列增加服务图片展示（40×40 圆角色块占位）
- 订单编号改为可点击链接，点击直接进入订单详情抽屉

### 说明

- 修改文件：`src/views/order/service/index.vue`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/service

## v0.7.0 (2026-11-25)

### 本次更新

- 侧边栏「订单管理」下新增「服务订单」导航（图标 ShoppingBag），路由 `/admin/order/service`
- 新增服务订单页，按截图需求实现：
  - 筛选搜索：用户昵称、手机号、门店、订单类型、状态、自定义时间段
  - 列表展示：订单编号、订单类型、用户信息（头像/昵称/手机号）、订单信息（服务名称/单价/数量）、优惠信息（会员折扣/优惠券/积分抵扣）、支付信息（订单金额/实付金额）、订单状态、核销次数/总次数、下单时间，操作列提供详情与核销记录
  - 详情抽屉：订单信息、项目信息（服务图片/服务名称/单价/数量/项目总价/各项抵扣/实付金额）、订单日志（操作人/操作内容/记录日期）；评估订单额外展示渠道来源与第三方券码
  - 核销记录弹窗：核销门店、核销人员、核销时间，无记录时显示空提示
  - 页面底部展示完整功能规则说明（多次核销、核销规则、评估订单、待服务订单、渠道来源、第三方券码、订单金额互斥、支付到账）
- mock 数据覆盖待付款、待服务/待评估、服务中、已完成、已取消等状态，全部使用本地数据
- 增强「订单管理」菜单注入：后端已存在该菜单时逐项补充缺失的子菜单

### 说明

- 修改文件：新增 `src/views/order/service/index.vue`、`src/views/order/service/data.ts`，修改 `src/router/routes.ts`、`src/layout/default/components/sidebar/side.vue`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/service

## v0.6.5 (2026-11-25)

### 本次更新

- 预约详情移除「更换康复师」操作：删除康复师信息卡片中的操作按钮、更换康复师弹窗及全部关联脚本与样式
- 保留康复师基础信息展示与筛选下拉中的康复师选项

### 说明

- 修改文件：`src/views/order/appointment/index.vue`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.6.4 (2026-11-25)

### 本次更新

- 预约列表末尾新增「操作」列（右侧固定），提供明确的「详情」按钮，点击打开预约详情抽屉
- 关联订单号改为普通文本展示，详情入口统一收敛到操作列

### 说明

- 修改文件：`src/views/order/appointment/index.vue`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.6.3 (2026-11-25)

### 本次更新

- 预约日期/时段按业务规则调整：时段只记录开始时间（整点、半点为时段起点，每段半小时），列表展示为 `2026-11-26 10:00` 单行格式
- mock 数据 6 条预约时段统一去掉结束时间（如 `10:00-10:30` → `10:00`），详情抽屉与 CSV 导出同步生效
- 详情规则说明补充「整点/半点为时段起点、仅记录开始时间」的口径

### 说明

- 修改文件：`src/views/order/appointment/index.vue`、`src/views/order/appointment/data.ts`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.6.2 (2026-11-25)

### 本次更新

- 预约列表「预约日期/时段」字段改为日期与时段上下两行展示，列宽调整为 160px，内容完整可见不再被截断

### 说明

- 修改文件：`src/views/order/appointment/index.vue`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.6.1 (2026-11-25)

### 本次更新

- 预约列表：列表首列「预约单号」改为「关联订单号」，点击仍可打开预约详情
- 预约列表：移除「渠道来源」字段，导出 CSV 同步移除该列并改用关联订单号
- 预约列表：修复用户信息头像显示不完全，头像固定 32×32 且不压缩，用户列加宽至 220px
- 修复侧边栏菜单链接无条件拼接 `?` 导致地址出现 `?undefined` 的问题
- 修复静态路由重复叠加 `/admin` 前缀导致地址出现 `/admin/admin/...` 的问题（Vite base 已包含 `/admin/`）
- 增强「订单管理」菜单注入：后端已存在该菜单时只补充「预约列表」子菜单，避免重复

### 说明

- 修改文件：`src/views/order/appointment/index.vue`、`src/layout/default/components/sidebar/menu-item.vue`、`src/layout/default/components/sidebar/side.vue`、`src/router/routes.ts`，以及版本文件
- 验证：类型检查通过（仅保留既有历史报错，新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.6.0 (2026-11-25)

### 本次更新

- 侧边栏新增「订单管理 → 预约列表」导航，路由 `/admin/order/appointment`
- 预约列表页按需求实现：用户昵称/手机号/门店/康复师/预约日期/状态筛选、状态 TAB、预约信息列表、按筛选条件导出 CSV
- 预约详情抽屉：门店信息、康复师信息、预约信息、关联订单、操作日志
- 更换康复师：按服务关联职称筛选可选康复师，保存后记录操作人及操作内容
- 页面展示时段锁定、职称关联、改期/取消限制等规则说明，全部使用 mock 数据

### 说明

- 修改文件：`src/views/order/appointment/index.vue`、新增 `data.ts`、`src/router/routes.ts`、`src/layout/default/components/sidebar/side.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/order/appointment

## v0.5.3 (2026-11-25)

### 本次更新

- 修复点击「投诉反馈」导航显示 404 的问题：菜单项改用绝对路径，菜单组件支持绝对路径不再拼接父级

### 说明

- 修改文件：`src/layout/default/components/sidebar/menu-item.vue`、`side.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/complaint

## v0.5.2 (2026-11-25)

### 本次更新

- 为「互评任务」「任务列表」「投诉反馈」导航补充图标，与其它导航保持一致

### 说明

- 修改文件：`src/router/routes.ts`、`src/layout/default/components/sidebar/side.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/lists

## v0.5.1 (2026-11-25)

### 本次更新

- 调整「投诉反馈」导航位置：由顶层菜单改为「用户管理」目录下，排在「用户列表」下方

### 说明

- 修改文件：`src/layout/default/components/sidebar/side.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/complaint

## v0.5.0 (2026-11-25)

### 本次更新

- 侧边栏用户列表下方新增「投诉反馈」导航，路由 `/admin/consumer/complaint`
- 投诉反馈页按需求实现：门店/状态/自定义时间段筛选、投诉信息列表（用户ID、头像、昵称、联系电话、投诉门店、投诉康复师、投诉类型、投诉内容、状态、投诉时间）
- 新增标记扣分/取消扣分操作，点击弹窗二次确认后生效；仅当月投诉可操作，超出当月不展示按钮
- 页面展示扣分核算、处理结果提醒、订阅消息等规则说明，全部使用 mock 数据

### 说明

- 修改文件：`src/views/consumer/complaint/index.vue`、新增 `data.ts`、`src/router/routes.ts`、`src/layout/default/components/sidebar/side.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/complaint

## v0.4.3 (2026-11-25)

### 本次更新

- 用户详情四个标签页的表格字段统一列宽、平均分布，单元格内容不换行，超长内容悬停显示
- 订单记录与订单详情弹窗的优惠信息改为显示实际优惠金额（券/积分/折扣及合计），并同步修正 mock 数据的实付金额

### 说明

- 修改文件：`src/views/consumer/lists/components/detail-panel.vue`、`src/views/consumer/lists/data.ts`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/lists

## v0.4.2 (2026-11-25)

### 本次更新

- 「查看详情」改为在用户列表当前路由下以抽屉展示，保留左侧导航，不再跳转独立页面
- 详情主体抽成可复用组件 `detail-panel.vue`，原详情路由继续保留兼容

### 说明

- 修改文件：`src/views/consumer/lists/index.vue`、`detail.vue`、新增 `components/detail-panel.vue`，以及版本文件
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/lists

## v0.4.1 (2026-11-25)

### 本次更新

- 用户列表搜索栏背景改为纯白，移除渐变
- 时间段搜索组件宽度固定为 400px
- 用户列表字段统一最小宽度并平均分布

### 说明

- 修改文件：`src/views/consumer/lists/index.vue`、`package.json`、`VERSION`、`CHANGELOG.md`
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/lists

## v0.4.0 (2026-11-25)

### 本次更新

- 用户列表页按需求重构：昵称/手机号/注册时间段筛选，列表展示用户ID、头像、昵称、手机号、会员等级、积分余额、状态、注册时间，操作增加「查看详情」「康复档案」
- 用户详情页重构：基础信息 + 积分明细/订单记录/预约记录/待服务订单四个标签页
- 新增积分充值弹窗（充值/扣减、变动值、备注），提交后更新积分余额与明细
- 订单编号点击弹出订单详情；康复档案以时间轴展示评估报告/康复纪要/康复小结，点击弹窗查看报告结果
- 全部使用 mock 数据，并补充用户详情静态路由

### 说明

- 修改文件：`src/views/consumer/lists/index.vue`、`detail.vue`、新增 `data.ts`、`src/router/routes.ts`、`package.json`、`VERSION`、`CHANGELOG.md`
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/consumer/lists

## v0.3.0 (2026-11-25)

### 本次更新

- 任务列表右上角新增「任务配置」入口，点击弹窗配置
- 配置项：生成节点（生成本月互评任务 / 生成上月互评任务）、生成时间（自然月 1~30 日任意一天）
- 保存后页面展示当前配置摘要，配置保存在页面状态中（mock 数据）

### 说明

- 修改文件：`src/views/appraise/task/index.vue`、`package.json`、`VERSION`、`CHANGELOG.md`
- 验证：类型检查通过（新增代码无报错）
- 预览：http://localhost:5173/admin/appraise/task

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
