<template>
    <div class="appraise-task">
        <!-- 数据筛选 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />数据筛选</span>
            <el-date-picker
                v-model="month"
                type="month"
                value-format="YYYY-MM"
                placeholder="选择年月"
                class="!w-[200px]"
            />
            <span class="filter-scope">
                当前统计月份：<b>{{ month || '全部' }}</b>
            </span>
        </div>

        <!-- 统计展示 -->
        <el-card class="stat-card mt-4" shadow="never">
            <template #header>
                <div class="card-header">
                    <span class="header-title">统计展示</span>
                    <span class="header-scope">{{ currentData.task.period }}</span>
                </div>
            </template>
            <div class="stat-grid">
                <div
                    v-for="(item, index) in statItems"
                    :key="item.label"
                    class="stat-item"
                    :style="{ '--item-color': statColors[index % statColors.length] }"
                >
                    <div class="stat-label">{{ item.label }}</div>
                    <div class="stat-value" :class="{ 'stat-value--text': item.text }">
                        {{ item.value }}
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 任务列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <template #header>
                <div class="card-header">
                    <span class="header-title">任务列表</span>
                    <div class="header-actions">
                        <span class="config-summary">
                            {{ nodeLabel }} · 每月 {{ taskConfig.day }} 日生成
                        </span>
                        <el-button type="primary" plain size="small" @click="openConfig">
                            任务配置
                        </el-button>
                    </div>
                </div>
            </template>
            <el-table :data="currentData.stores" style="width: 100%">
                <el-table-column prop="name" label="门店名称" min-width="140" />
                <el-table-column prop="joinCount" label="参与人数" min-width="100" align="center" />
                <el-table-column prop="doneCount" label="已完成人数" min-width="110" align="center" />
                <el-table-column prop="pendingCount" label="待完成人数" min-width="110" align="center">
                    <template #default="{ row }">
                        <span :class="row.pendingCount > 0 ? 'text-warning' : ''">
                            {{ row.pendingCount }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="110" align="center">
                    <template #default="{ row }">
                        <el-tag
                            :type="row.status === 'ongoing' ? 'primary' : 'info'"
                            size="small"
                            effect="light"
                        >
                            {{ row.status === 'ongoing' ? '进行中' : '已完成' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openDetail(row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 查看详情：门店人员评价进度 -->
        <el-drawer v-model="detailVisible" size="820px">
            <template #header>
                <span class="header-title">查看详情 - {{ currentStore?.name }}</span>
            </template>
            <div class="drawer-tip">
                门店平均分（职能部门）：<b>{{ currentStore?.average }}</b> 分 / 10分制；
                特殊人员（康复专家、总经理）为 5 分制，员工共享门店平均分
            </div>
            <el-table :data="currentStore?.members || []" style="width: 100%">
                <el-table-column label="图片" width="70" align="center">
                    <template #default="{ row }">
                        <span class="avatar" :style="{ background: row.avatarColor }">
                            {{ row.name.charAt(0) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="90" />
                <el-table-column prop="title" label="职称/职级" min-width="150" />
                <el-table-column label="待评价/已评价/总数" min-width="160" align="center">
                    <template #default="{ row }">
                        <span class="progress-text">
                            <b class="text-warning">{{ row.pending }}</b>
                            /
                            <b class="text-success">{{ row.evaluated }}</b>
                            /
                            {{ row.total }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="所属门店" min-width="100">
                    <template #default>
                        {{ currentStore?.name }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openEvalList">查看评价</el-button>
                        <el-button v-if="isAdmin" type="primary" link @click="openEvaluate(row)">
                            立即评价
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>

        <!-- 查看评价：门店人员评价内容 -->
        <el-drawer v-model="evalListVisible" size="820px">
            <template #header>
                <span class="header-title">查看评价 - {{ currentStore?.name }}</span>
            </template>
            <el-table :data="currentStore?.evaluations || []" style="width: 100%">
                <el-table-column label="图片" width="70" align="center">
                    <template #default="{ row }">
                        <span class="avatar" :style="{ background: row.avatarColor }">
                            {{ row.name.charAt(0) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="90" />
                <el-table-column prop="title" label="职称/职级" min-width="150" />
                <el-table-column label="评分" width="90" align="center">
                    <template #default="{ row }">
                        <span class="score">{{ row.score }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="补充评价" min-width="200" show-overflow-tooltip />
                <el-table-column prop="time" label="评价时间" min-width="150" />
            </el-table>
        </el-drawer>

        <!-- 立即评价：评分弹窗 -->
        <el-dialog v-model="evaluateVisible" title="立即评价" width="460px">
            <div class="evaluate-info">
                <span class="avatar" :style="{ background: currentMember?.avatarColor }">
                    {{ currentMember?.name.charAt(0) }}
                </span>
                <div>
                    <div class="evaluate-name">{{ currentMember?.name }}</div>
                    <div class="evaluate-title">
                        {{ currentMember?.title }} · {{ currentMember?.special ? '5分制' : '10分制' }}
                    </div>
                </div>
            </div>
            <div class="form-row">
                <span class="form-label">评分</span>
                <el-select v-model="score" class="!w-[200px]">
                    <el-option
                        v-for="n in currentMember?.special ? 5 : 10"
                        :key="n"
                        :label="`${n} 分`"
                        :value="n"
                    />
                </el-select>
            </div>
            <div class="form-row form-row--top">
                <span class="form-label">补充评价</span>
                <el-input
                    v-model="comment"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入补充评价内容"
                    class="!w-[300px]"
                />
            </div>
            <template #footer>
                <el-button @click="evaluateVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEvaluate">提交</el-button>
            </template>
        </el-dialog>

        <!-- 任务配置 -->
        <el-dialog v-model="configVisible" title="任务配置" width="480px">
            <div class="form-row">
                <span class="form-label">生成节点</span>
                <el-radio-group v-model="taskConfig.node">
                    <el-radio value="current">生成本月互评任务</el-radio>
                    <el-radio value="last">生成上月互评任务</el-radio>
                </el-radio-group>
            </div>
            <div class="form-row form-row--top">
                <span class="form-label">生成时间</span>
                <div>
                    <el-select v-model="taskConfig.day" class="!w-[160px]">
                        <el-option
                            v-for="day in 30"
                            :key="day"
                            :label="`${day} 日`"
                            :value="day"
                        />
                    </el-select>
                    <div class="config-tip">按自然月 30 日选择，每月 1~30 任意一天进行生成</div>
                </div>
            </div>
            <template #footer>
                <el-button @click="configVisible = false">取消</el-button>
                <el-button type="primary" @click="saveConfig">保存配置</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="appraiseTask">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { taskData } from './data'
import type { MemberItem, StoreItem } from './data'

const data = reactive(cloneDeep(taskData))
const month = ref('2026-11')
// 管理后端人员显示「立即评价」按钮；超管账号不需要评价
const isAdmin = ref(true)

// 任务配置（mock 数据，保存在页面状态中）
const configVisible = ref(false)
const taskConfig = reactive({ node: 'current' as 'current' | 'last', day: 15 })
const nodeLabel = computed(() =>
    taskConfig.node === 'current' ? '生成本月互评任务' : '生成上月互评任务'
)
const openConfig = () => {
    configVisible.value = true
}
const saveConfig = () => {
    configVisible.value = false
    ElMessage.success('任务配置已保存')
}

const statColors = ['#4A5DFF', '#e6a23c', '#f56c6c', '#67c23a', '#409eff', '#9b59b6']

const currentData = computed(() => data[month.value] || data['2026-11'])

const statItems = computed(() => {
    const task = currentData.value.task
    return [
        { label: '任务名称', value: task.name, text: true },
        { label: '任务周期', value: task.period, text: true },
        { label: '评价进度', value: task.progress, text: false },
        { label: '参与门店数', value: `${task.storeCount} 家`, text: false },
        { label: '参与评价人员数', value: `${task.memberCount} 人`, text: false },
        { label: '待完成人员数', value: `${task.pendingCount} 人`, text: false }
    ]
})

const detailVisible = ref(false)
const evalListVisible = ref(false)
const evaluateVisible = ref(false)
const currentStore = ref<StoreItem | null>(null)
const currentMember = ref<MemberItem | null>(null)
const score = ref(10)
const comment = ref('')

const openDetail = (row: StoreItem) => {
    currentStore.value = row
    detailVisible.value = true
}

const openEvalList = () => {
    evalListVisible.value = true
}

const openEvaluate = (row: MemberItem) => {
    currentMember.value = row
    score.value = row.special ? 5 : 10
    comment.value = ''
    evaluateVisible.value = true
}

const nowText = () => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const submitEvaluate = () => {
    const member = currentMember.value
    const store = currentStore.value
    if (!member || !store) return

    if (member.pending > 0) {
        member.pending--
        member.evaluated++
    }
    store.doneCount = store.members.filter((item) => item.pending === 0).length
    store.pendingCount = store.members.reduce((sum, item) => sum + item.pending, 0)

    // 职能部门 10 分制平均分，特殊人员不参与门店平均分计算
    const normalScores = store.evaluations
        .filter((item) => !/康复专家|总经理/.test(item.title))
        .map((item) => item.score)
    store.average = normalScores.length
        ? Number((normalScores.reduce((sum, item) => sum + item, 0) / normalScores.length).toFixed(1))
        : store.average

    store.evaluations.unshift({
        id: Date.now(),
        name: member.name,
        title: member.title,
        avatarColor: member.avatarColor,
        score: score.value,
        comment: comment.value || '无补充评价',
        time: nowText()
    })

    evaluateVisible.value = false
    ElMessage.success('评价已提交')
}
</script>

<style lang="scss" scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: linear-gradient(90deg, #f5f7ff 0%, #fff 60%);
    border: 1px solid #e8ebf5;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(74, 93, 255, 0.04);
}

.filter-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.filter-dot {
    width: 4px;
    height: 16px;
    background: var(--el-color-primary);
    border-radius: 2px;
}

.filter-scope {
    margin-left: auto;
    font-size: 13px;
    color: #909399;

    b {
        font-weight: 600;
        color: var(--el-color-primary);
    }
}

.stat-card,
.list-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.header-title {
    position: relative;
    padding-left: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;

    &::before {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 0;
        width: 3px;
        background: var(--el-color-primary);
        border-radius: 2px;
        content: '';
    }
}

.header-scope {
    font-size: 12px;
    color: #909399;
}

.header-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.config-summary {
    font-size: 12px;
    color: #909399;
}

.config-tip {
    margin-top: 6px;
    font-size: 12px;
    color: #909399;
}

.stat-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 12px;
}

@media (max-width: 1400px) {
    .stat-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.stat-item {
    position: relative;
    padding: 16px 10px;
    overflow: hidden;
    text-align: center;
    background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
    border: 1px solid #ebeef5;
    border-radius: 8px;

    &::before {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 3px;
        background: var(--item-color);
        content: '';
    }
}

.stat-label {
    font-size: 13px;
    color: #909399;
}

.stat-value {
    margin-top: 8px;
    font-size: 20px;
    font-weight: 700;
    color: var(--item-color);

    &--text {
        font-size: 14px;
        line-height: 1.6;
    }
}

.text-warning {
    font-weight: 600;
    color: #e6a23c;
}

.text-success {
    font-weight: 600;
    color: #67c23a;
}

.drawer-tip {
    margin-bottom: 16px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.7;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;

    b {
        color: var(--el-color-primary);
    }
}

.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 50%;
}

.progress-text {
    font-size: 14px;
    color: #606266;
}

.score {
    font-size: 16px;
    font-weight: 700;
    color: #f56c6c;
}

.evaluate-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.evaluate-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
}

.evaluate-title {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    &--top {
        align-items: flex-start;
    }
}

.form-label {
    flex: 0 0 70px;
    padding-top: 6px;
    font-size: 14px;
    color: #606266;
}
</style>
