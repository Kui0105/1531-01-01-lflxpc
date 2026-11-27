<template>
    <div class="title-list-page">
        <!-- 职称列表 -->
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">职称列表</span>
                    <el-button type="primary" size="small" @click="openTitleEdit()">新增</el-button>
                </div>
            </template>
            <el-table :data="titleData" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="name" label="职称名称" min-width="140" align="center" />
                <el-table-column label="职级数量" min-width="110" align="center">
                    <template #default="{ row }">{{ getLevelCount(row.id) }}</template>
                </el-table-column>
                <el-table-column prop="staffType" label="人员类型" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" effect="plain">{{ row.staffType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="90" align="center" />
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'on' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="280" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openTitleEdit(row)">编辑</el-button>
                        <el-button type="warning" link size="small" @click="openPerformance(row)">绩效评分</el-button>
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                        <el-button type="danger" link size="small" @click="deleteTitle(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑职称弹窗 -->
        <el-dialog v-model="titleDialogVisible" :title="titleEditId ? '编辑职称' : '新增职称'" width="480px" :close-on-click-modal="false">
            <el-form :model="titleForm" label-width="90px">
                <el-form-item label="职称名称">
                    <el-input v-model="titleForm.name" placeholder="请输入职称名称" />
                </el-form-item>
                <el-form-item label="人员类型">
                    <el-radio-group v-model="titleForm.staffType">
                        <el-radio value="店员">店员</el-radio>
                        <el-radio value="店长">店长</el-radio>
                        <el-radio value="技术店长">技术店长</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="titleForm.sort" :min="0" :max="999" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="titleForm.status">
                        <el-radio value="on">启用</el-radio>
                        <el-radio value="off">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="titleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitTitle">确定</el-button>
            </template>
        </el-dialog>

        <!-- 绩效评分弹窗 -->
        <el-dialog v-model="performanceVisible" title="绩效评分" width="760px" :close-on-click-modal="false">
            <div class="dialog-toolbar">
                <span class="dialog-subtitle">{{ currentTitle?.name }} - 绩效评分配置</span>
                <el-button type="primary" size="small" @click="openScoreEdit()">新增</el-button>
            </div>
            <el-table :data="scoreData" style="width: 100%" size="small">
                <el-table-column prop="level" label="绩效等级" min-width="100" align="center" />
                <el-table-column label="得分区间" min-width="140" align="center">
                    <template #default="{ row }">{{ row.minScore }} ~ {{ row.maxScore }}</template>
                </el-table-column>
                <el-table-column prop="factor" label="绩效系数" min-width="100" align="center" />
                <el-table-column label="操作" min-width="160" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openScoreEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteScore(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 新增/编辑绩效评分弹窗 -->
        <el-dialog v-model="scoreDialogVisible" :title="scoreEditId ? '编辑绩效评分' : '新增绩效评分'" width="520px" append-to-body :close-on-click-modal="false">
            <el-form :model="scoreForm" label-width="100px" class="score-form">
                <el-form-item label="绩效等级">
                    <el-input v-model="scoreForm.level" placeholder="如 A" class="score-input" />
                </el-form-item>
                <el-form-item label="得分区间">
                    <div class="score-range">
                        <el-input-number v-model="scoreForm.minScore" :min="0" :max="100" controls-position="right" class="score-number" />
                        <span class="score-separator">~</span>
                        <el-input-number v-model="scoreForm.maxScore" :min="0" :max="100" controls-position="right" class="score-number" />
                    </div>
                </el-form-item>
                <el-form-item label="绩效系数">
                    <el-input-number v-model="scoreForm.factor" :min="0" :max="10" :precision="2" :step="0.1" class="score-number" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="scoreDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitScore">确定</el-button>
            </template>
        </el-dialog>

        <!-- 职称详情弹窗（职级列表） -->
        <el-dialog v-model="detailVisible" :title="`${currentTitle?.name || ''} - 职称详情`" width="1200px" :close-on-click-modal="false">
            <div class="dialog-toolbar">
                <span class="dialog-subtitle">职级列表</span>
                <el-button type="primary" size="small" @click="openLevelEdit()">新增</el-button>
            </div>
            <el-table :data="levelData" style="width: 100%" size="small">
                <el-table-column prop="level" label="职级" min-width="70" align="center" />
                <el-table-column prop="baseSalary" label="基础薪资" min-width="100" align="center" />
                <el-table-column prop="postAllowance" label="岗位津贴" min-width="100" align="center" />
                <el-table-column prop="performanceBonus" label="绩效奖金" min-width="100" align="center" />
                <el-table-column prop="monthTargetCount" label="月目标人次" min-width="110" align="center" />
                <el-table-column prop="overtimeFee" label="超额工时费" min-width="110" align="center" />
                <el-table-column prop="newCustomerRate" label="新客提成%" min-width="110" align="center" />
                <el-table-column prop="oldCustomerRate" label="老客提成%" min-width="110" align="center" />
                <el-table-column prop="storeNewRate" label="门店提成(新客)%" min-width="130" align="center" />
                <el-table-column prop="storeOldRate" label="门店提成(老客)%" min-width="130" align="center" />
                <el-table-column prop="outputRate" label="产值提成%" min-width="110" align="center" />
                <el-table-column prop="quarterBonus" label="季度奖金" min-width="100" align="center" />
                <el-table-column label="操作" min-width="120" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openLevelEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteLevel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 新增/编辑职级弹窗 -->
        <el-dialog v-model="levelDialogVisible" :title="levelEditId ? '编辑职级' : '新增职级'" width="720px" append-to-body :close-on-click-modal="false">
            <el-form :model="levelForm" label-width="130px" class="level-form">
                <el-row :gutter="12">
                    <el-col :span="12"><el-form-item label="职级"><el-input-number v-model="levelForm.level" :min="1" :max="99" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="基础薪资"><el-input-number v-model="levelForm.baseSalary" :min="0" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="岗位津贴"><el-input-number v-model="levelForm.postAllowance" :min="0" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="绩效奖金"><el-input-number v-model="levelForm.performanceBonus" :min="0" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="月目标人次"><el-input-number v-model="levelForm.monthTargetCount" :min="0" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="超额工时费"><el-input-number v-model="levelForm.overtimeFee" :min="0" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="新客提成比例(%)"><el-input-number v-model="levelForm.newCustomerRate" :min="0" :max="100" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="老客提成比例(%)"><el-input-number v-model="levelForm.oldCustomerRate" :min="0" :max="100" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="门店提成(新客)(%)"><el-input-number v-model="levelForm.storeNewRate" :min="0" :max="100" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="门店提成(老客)(%)"><el-input-number v-model="levelForm.storeOldRate" :min="0" :max="100" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="产值提成(%)"><el-input-number v-model="levelForm.outputRate" :min="0" :max="100" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="季度奖金"><el-input-number v-model="levelForm.quarterBonus" :min="0" /></el-form-item></el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="levelDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitLevel">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="titleList">
import { ElMessage, ElMessageBox } from 'element-plus'

import {
    titleList,
    performanceScores,
    titleLevels,
    type TitleItem,
    type StaffType,
    type TitleStatus,
    type PerformanceScore,
    type TitleLevel
} from './data'

// 职称数据（响应式）
const titleData = ref<TitleItem[]>(titleList.map((item) => ({ ...item })))
const scoreData = ref<PerformanceScore[]>(performanceScores.map((item) => ({ ...item })))
const levelData = ref<TitleLevel[]>([])
const currentTitle = ref<TitleItem | null>(null)

const getLevelCount = (titleId: number) => levelDataAll.value.filter((l) => l.titleId === titleId).length
const levelDataAll = ref<TitleLevel[]>(titleLevels.map((item) => ({ ...item })))

// ===== 职称新增/编辑 =====
const titleDialogVisible = ref(false)
const titleEditId = ref<number | null>(null)
const emptyTitleForm = (): { name: string; staffType: StaffType; sort: number; status: TitleStatus } => ({
    name: '',
    staffType: '店员',
    sort: 10,
    status: 'on'
})
const titleForm = reactive(emptyTitleForm())

const openTitleEdit = (row?: TitleItem) => {
    titleEditId.value = row?.id ?? null
    Object.assign(titleForm, row ? { ...row } : emptyTitleForm())
    titleDialogVisible.value = true
}
const submitTitle = () => {
    if (!titleForm.name.trim()) {
        ElMessage.warning('请输入职称名称')
        return
    }
    if (!titleForm.staffType) {
        ElMessage.warning('请选择人员类型')
        return
    }
    if (titleEditId.value) {
        const idx = titleData.value.findIndex((t) => t.id === titleEditId.value)
        if (idx > -1) titleData.value[idx] = { ...titleData.value[idx], ...titleForm }
        ElMessage.success('编辑成功')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        titleData.value.push({
            id: Date.now(),
            ...titleForm,
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('新增成功')
    }
    titleDialogVisible.value = false
}
const deleteTitle = (row: TitleItem) => {
    if (getLevelCount(row.id) > 0) {
        ElMessage.warning('该职称下存在职级数据，无法删除')
        return
    }
    ElMessageBox.confirm(`确认删除职称「${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
            titleData.value = titleData.value.filter((t) => t.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// ===== 绩效评分 =====
const performanceVisible = ref(false)
const openPerformance = (row: TitleItem) => {
    currentTitle.value = row
    performanceVisible.value = true
}
const scoreDialogVisible = ref(false)
const scoreEditId = ref<number | null>(null)
const emptyScoreForm = (): Omit<PerformanceScore, 'id'> => ({ level: '', minScore: 0, maxScore: 100, factor: 1 })
const scoreForm = reactive(emptyScoreForm())

const openScoreEdit = (row?: PerformanceScore) => {
    scoreEditId.value = row?.id ?? null
    Object.assign(scoreForm, row ? { level: row.level, minScore: row.minScore, maxScore: row.maxScore, factor: row.factor } : emptyScoreForm())
    scoreDialogVisible.value = true
}
const submitScore = () => {
    if (!scoreForm.level.trim()) {
        ElMessage.warning('请输入绩效等级')
        return
    }
    if (scoreForm.minScore > scoreForm.maxScore) {
        ElMessage.warning('得分区间起始值不能大于结束值')
        return
    }
    if (scoreEditId.value) {
        const idx = scoreData.value.findIndex((s) => s.id === scoreEditId.value)
        if (idx > -1) scoreData.value[idx] = { ...scoreData.value[idx], ...scoreForm }
        ElMessage.success('编辑成功')
    } else {
        scoreData.value.push({ id: Date.now(), ...scoreForm })
        ElMessage.success('新增成功')
    }
    scoreDialogVisible.value = false
}
const deleteScore = (row: PerformanceScore) => {
    ElMessageBox.confirm(`确认删除绩效等级「${row.level}」？`, '提示', { type: 'warning' })
        .then(() => {
            scoreData.value = scoreData.value.filter((s) => s.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// ===== 职称详情（职级） =====
const detailVisible = ref(false)
const openDetail = (row: TitleItem) => {
    currentTitle.value = row
    refreshLevelData()
    detailVisible.value = true
}
const refreshLevelData = () => {
    levelData.value = levelDataAll.value
        .filter((l) => l.titleId === currentTitle.value?.id)
        .sort((a, b) => a.level - b.level)
        .map((item) => ({ ...item }))
}
const levelDialogVisible = ref(false)
const levelEditId = ref<number | null>(null)
const emptyLevelForm = (): Omit<TitleLevel, 'id' | 'titleId'> => ({
    level: 1, baseSalary: 0, postAllowance: 0, performanceBonus: 0, monthTargetCount: 0,
    overtimeFee: 0, newCustomerRate: 0, oldCustomerRate: 0, storeNewRate: 0, storeOldRate: 0, outputRate: 0, quarterBonus: 0
})
const levelForm = reactive(emptyLevelForm())

const openLevelEdit = (row?: TitleLevel) => {
    levelEditId.value = row?.id ?? null
    const { level, baseSalary, postAllowance, performanceBonus, monthTargetCount, overtimeFee, newCustomerRate, oldCustomerRate, storeNewRate, storeOldRate, outputRate, quarterBonus } = row || emptyLevelForm()
    Object.assign(levelForm, { level, baseSalary, postAllowance, performanceBonus, monthTargetCount, overtimeFee, newCustomerRate, oldCustomerRate, storeNewRate, storeOldRate, outputRate, quarterBonus })
    levelDialogVisible.value = true
}
const submitLevel = () => {
    if (levelEditId.value) {
        const idx = levelDataAll.value.findIndex((l) => l.id === levelEditId.value)
        if (idx > -1) levelDataAll.value[idx] = { ...levelDataAll.value[idx], ...levelForm }
        ElMessage.success('编辑成功')
    } else {
        levelDataAll.value.push({ id: Date.now(), titleId: currentTitle.value!.id, ...levelForm })
        ElMessage.success('新增成功')
    }
    refreshLevelData()
    levelDialogVisible.value = false
}
const deleteLevel = (row: TitleLevel) => {
    ElMessageBox.confirm(`确认删除职级 ${row.level}？`, '提示', { type: 'warning' })
        .then(() => {
            levelDataAll.value = levelDataAll.value.filter((l) => l.id !== row.id)
            refreshLevelData()
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.title-list-page {
    padding: 4px;
}

.list-card {
    border-radius: 8px;
}

.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.dialog-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.dialog-subtitle {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.score-form {
    .score-input {
        width: 100%;
    }

    .score-number {
        width: 140px;
    }
}

.score-range {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .score-separator {
        flex: 0 0 auto;
        color: #909399;
    }
}

.level-form {
    :deep(.el-form-item) {
        margin-bottom: 14px;
    }
}
</style>
