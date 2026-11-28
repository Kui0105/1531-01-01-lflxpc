<template>
    <div class="nutrition-page">
        <el-tabs v-model="activeTab" class="main-tabs">
            <!-- 题目配置 -->
            <el-tab-pane label="题目配置" name="questions">
                <div class="filter-bar">
                    <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                    <el-input v-model="keyword" placeholder="字段名称" clearable class="!w-[200px]" />
                    <el-select v-model="typeFilter" placeholder="字段类型" clearable class="!w-[130px]">
                        <el-option v-for="(label, value) in fieldTypeLabels" :key="value" :label="label" :value="value" />
                    </el-select>
                    <el-select v-model="groupFilter" placeholder="所属题组" clearable class="!w-[180px]">
                        <el-option v-for="g in groupOptions" :key="g.id" :label="g.label" :value="g.id" />
                    </el-select>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="resetSearch">重置</el-button>
                    <el-button type="primary" class="ml-auto" @click="openQuestionEdit()">新增题目</el-button>
                </div>

                <el-card class="list-card mt-4" shadow="never">
                    <el-table :data="filteredQuestions" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                        <el-table-column prop="fieldName" label="字段名称" min-width="180" align="center" show-overflow-tooltip />
                        <el-table-column label="关联服务商品" min-width="220" align="center">
                            <template #default="{ row }">
                                <div class="service-tags">
                                    <el-tag
                                        v-for="sid in row.serviceIds"
                                        :key="sid"
                                        size="small"
                                        effect="plain"
                                        class="service-tag"
                                    >
                                        {{ serviceProductName(sid) }}
                                    </el-tag>
                                    <span v-if="!row.serviceIds?.length" class="cell-sub">未关联</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="字段类型" min-width="100" align="center">
                            <template #default="{ row }">
                                <el-tag size="small" effect="plain">{{ fieldTypeLabels[row.fieldType as FieldType] }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="所属题组" min-width="180" align="center">
                            <template #default="{ row }">
                                <span v-if="row.groupId">{{ groupFullName(row.groupId) }}</span>
                                <span v-else class="cell-sub">独立题目</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="选项数" min-width="90" align="center">
                            <template #default="{ row }">{{ row.options.length }}</template>
                        </el-table-column>
                        <el-table-column label="评分方式" min-width="110" align="center">
                            <template #default="{ row }">
                                <el-tag v-if="row.useScore" type="warning" size="small" effect="light">1-5分</el-tag>
                                <span v-else class="cell-sub">无</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="必填" min-width="80" align="center">
                            <template #default="{ row }">{{ row.required ? '是' : '否' }}</template>
                        </el-table-column>
                        <el-table-column prop="sort" label="排序" min-width="80" align="center" />
                        <el-table-column label="状态" min-width="90" align="center">
                            <template #default="{ row }">
                                <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                                    {{ row.status === 'on' ? '启用' : '停用' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="140" align="center" fixed="right" class-name="operation-cell">
                            <template #default="{ row }">
                                <el-button type="primary" link size="small" @click="openQuestionEdit(row)">编辑</el-button>
                                <el-button type="danger" link size="small" @click="deleteQuestion(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-tab-pane>

            <!-- 题组管理 -->
            <el-tab-pane label="题组管理" name="groups">
                <div class="filter-bar">
                    <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                    <el-input v-model="groupKeyword" placeholder="题组名称/分类" clearable class="!w-[220px]" />
                    <el-button type="primary" @click="handleGroupSearch">查询</el-button>
                    <el-button @click="resetGroupSearch">重置</el-button>
                    <el-button type="primary" class="ml-auto" @click="openGroupEdit()">新增题组</el-button>
                </div>
                <el-card class="list-card mt-4" shadow="never">
                    <el-table :data="filteredGroups" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                        <el-table-column prop="category" label="分类" min-width="140" align="center" />
                        <el-table-column prop="name" label="题组名称" min-width="160" align="center" />
                        <el-table-column label="题目数" min-width="100" align="center">
                            <template #default="{ row }">{{ getGroupQuestionCount(row.id) }}</template>
                        </el-table-column>
                        <el-table-column label="分值范围" min-width="110" align="center">
                            <template #default="{ row }">{{ row.scoreMin }} ~ {{ row.scoreMax }} 分</template>
                        </el-table-column>
                        <el-table-column prop="description" label="说明" min-width="260" align="center" show-overflow-tooltip />
                        <el-table-column label="操作" min-width="140" align="center" fixed="right" class-name="operation-cell">
                            <template #default="{ row }">
                                <el-button type="primary" link size="small" @click="openGroupEdit(row)">编辑</el-button>
                                <el-button type="danger" link size="small" @click="deleteGroup(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-tab-pane>
        </el-tabs>

        <!-- 新增/编辑题目弹窗 -->
        <el-dialog v-model="questionDialogVisible" :title="questionEditId ? '编辑题目' : '新增题目'" width="760px" :close-on-click-modal="false">
            <el-form :model="questionForm" label-width="110px" class="question-form">
                <el-form-item label="字段名称">
                    <el-input v-model="questionForm.fieldName" placeholder="请输入字段名称" />
                </el-form-item>
                <el-form-item label="关联服务商品">
                    <el-select
                        v-model="questionForm.serviceIds"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        placeholder="请选择关联的服务商品（可多选）"
                        clearable
                        class="!w-full"
                    >
                        <el-option v-for="s in serviceProductOptions" :key="s.id" :label="s.name" :value="s.id" />
                    </el-select>
                    <div class="form-tip">题目根据服务商品关联，可同时关联多个服务商品</div>
                </el-form-item>
                <el-form-item label="字段类型">
                    <el-radio-group v-model="questionForm.fieldType" @change="onFieldTypeChange">
                        <el-radio value="radio">单选</el-radio>
                        <el-radio value="checkbox">多选</el-radio>
                        <el-radio value="text">填写</el-radio>
                        <el-radio value="date">日期选择</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="所属题组">
                    <el-select v-model="questionForm.groupId" placeholder="独立题目（不选则独立）" clearable class="!w-full">
                        <el-option v-for="g in groupOptions" :key="g.id" :label="g.label" :value="g.id" />
                    </el-select>
                    <div class="form-tip">选择题组后，该题按题组分值范围（默认 1-5 分）进行评分</div>
                </el-form-item>
                <el-form-item label="评分方式">
                    <el-switch v-model="questionForm.useScore" />
                    <span class="form-tip inline">开启后按分值评分（题组题常用）</span>
                </el-form-item>

                <!-- 选项配置（单选/多选） -->
                <el-form-item v-if="questionForm.fieldType === 'radio' || questionForm.fieldType === 'checkbox'" label="选择项配置">
                    <div class="option-config">
                        <div v-for="(opt, index) in questionForm.options" :key="index" class="option-row">
                            <el-input v-model="opt.label" placeholder="选项文本" class="option-label" />
                            <el-checkbox v-model="opt.withRemark">补充说明</el-checkbox>
                            <el-input
                                v-if="opt.withRemark"
                                v-model="opt.remarkTip"
                                placeholder="说明提示内容"
                                class="option-remark"
                            />
                            <el-button type="danger" link size="small" @click="removeOption(index)">删除</el-button>
                        </div>
                        <el-button type="primary" link size="small" @click="addOption">+ 添加选项</el-button>
                    </div>
                </el-form-item>

                <el-row :gutter="12">
                    <el-col :span="12"><el-form-item label="必填"><el-switch v-model="questionForm.required" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="排序"><el-input-number v-model="questionForm.sort" :min="0" :max="999" /></el-form-item></el-col>
                </el-row>
                <el-form-item label="状态">
                    <el-radio-group v-model="questionForm.status">
                        <el-radio value="on">启用</el-radio>
                        <el-radio value="off">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="questionForm.remark" type="textarea" :rows="2" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="questionDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitQuestion">确定</el-button>
            </template>
        </el-dialog>

        <!-- 新增/编辑题组弹窗 -->
        <el-dialog v-model="groupDialogVisible" :title="groupEditId ? '编辑题组' : '新增题组'" width="560px" append-to-body :close-on-click-modal="false">
            <el-form :model="groupForm" label-width="100px" class="group-form">
                <el-form-item label="分类">
                    <el-input v-model="groupForm.category" placeholder="如 神经系统" />
                </el-form-item>
                <el-form-item label="题组名称">
                    <el-input v-model="groupForm.name" placeholder="如 心理状况" />
                </el-form-item>
                <el-form-item label="分值范围">
                    <div class="score-range">
                        <el-input-number v-model="groupForm.scoreMin" :min="1" :max="20" controls-position="right" class="group-number" />
                        <span>~</span>
                        <el-input-number v-model="groupForm.scoreMax" :min="1" :max="20" controls-position="right" class="group-number" />
                        <span>分</span>
                    </div>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="groupForm.description" type="textarea" :rows="3" placeholder="请输入题组说明" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="groupDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitGroup">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="webNutritionAssessment">
import { ElMessage, ElMessageBox } from 'element-plus'

import {
    questionList,
    questionGroups,
    fieldTypeLabels,
    serviceProductOptions,
    type QuestionItem,
    type QuestionOption,
    type QuestionGroup,
    type FieldType
} from './data'

const activeTab = ref('questions')

const questions = ref<QuestionItem[]>(questionList.map((item) => ({ ...item, options: item.options.map((o) => ({ ...o })) })))
const groups = ref<QuestionGroup[]>(questionGroups.map((item) => ({ ...item })))

// 题组选项（分类-名称）
const groupOptions = computed(() => groups.value.map((g) => ({ id: g.id, label: `${g.category}-${g.name}` })))
const groupFullName = (id: number) => {
    const g = groups.value.find((item) => item.id === id)
    return g ? `${g.category}-${g.name}` : ''
}
const getGroupQuestionCount = (id: number) => questions.value.filter((q) => q.groupId === id).length

const serviceProductName = (id: number) => serviceProductOptions.find((s) => s.id === id)?.name || ''

// ===== 题目筛选 =====
const keyword = ref('')
const typeFilter = ref('')
const groupFilter = ref<number | ''>('')
const query = reactive({ keyword: '', fieldType: '', groupId: '' as number | '' })
const filteredQuestions = computed(() =>
    questions.value
        .filter((item) => {
            const matchKeyword = !query.keyword || item.fieldName.includes(query.keyword)
            const matchType = !query.fieldType || item.fieldType === query.fieldType
            const matchGroup = query.groupId === '' || item.groupId === query.groupId
            return matchKeyword && matchType && matchGroup
        })
        .sort((a, b) => b.sort - a.sort)
)
const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.fieldType = typeFilter.value
    query.groupId = groupFilter.value
}
const resetSearch = () => {
    keyword.value = ''
    typeFilter.value = ''
    groupFilter.value = ''
    Object.assign(query, { keyword: '', fieldType: '', groupId: '' })
}

// ===== 题目新增/编辑 =====
const questionDialogVisible = ref(false)
const questionEditId = ref<number | null>(null)
const emptyQuestion = (): Omit<QuestionItem, 'id'> => ({
    fieldName: '', fieldType: 'radio', serviceIds: [], groupId: undefined, options: [],
    useScore: false, required: true, remark: '', sort: 10, status: 'on'
})
const questionForm = reactive({ ...emptyQuestion(), options: [] as QuestionOption[] })

const openQuestionEdit = (row?: QuestionItem) => {
    questionEditId.value = row?.id ?? null
    if (row) {
        Object.assign(questionForm, {
            fieldName: row.fieldName, fieldType: row.fieldType,
            serviceIds: [...(row.serviceIds || [])],
            groupId: row.groupId,
            options: row.options.map((o) => ({ ...o })),
            useScore: row.useScore, required: row.required, remark: row.remark, sort: row.sort, status: row.status
        })
    } else {
        Object.assign(questionForm, emptyQuestion())
        questionForm.options = []
    }
    questionDialogVisible.value = true
}
const onFieldTypeChange = (val?: string | number | boolean) => {
    if (val === 'text' || val === 'date') return
    if (!questionForm.options.length) addOption()
}
const addOption = () => questionForm.options.push({ id: Date.now() + Math.random(), label: '', withRemark: false, remarkTip: '' })
const removeOption = (index: number) => questionForm.options.splice(index, 1)
const submitQuestion = () => {
    if (!questionForm.fieldName.trim()) { ElMessage.warning('请输入字段名称'); return }
    if (!questionForm.serviceIds.length) { ElMessage.warning('请选择关联的服务商品'); return }
    if (questionForm.fieldType === 'radio' || questionForm.fieldType === 'checkbox') {
        if (!questionForm.options.length || questionForm.options.some((o) => !o.label.trim())) {
            ElMessage.warning('请完整填写选择项')
            return
        }
        if (questionForm.options.some((o) => o.withRemark && !o.remarkTip.trim())) {
            ElMessage.warning('请填写补充说明内容')
            return
        }
    }
    const payload: Omit<QuestionItem, 'id'> = {
        fieldName: questionForm.fieldName.trim(),
        fieldType: questionForm.fieldType,
        serviceIds: [...questionForm.serviceIds],
        groupId: questionForm.groupId,
        options: questionForm.fieldType === 'radio' || questionForm.fieldType === 'checkbox'
            ? questionForm.options.map((o) => ({ ...o }))
            : [],
        useScore: questionForm.useScore,
        required: questionForm.required,
        remark: questionForm.remark,
        sort: questionForm.sort,
        status: questionForm.status
    }
    if (questionEditId.value) {
        const idx = questions.value.findIndex((q) => q.id === questionEditId.value)
        if (idx > -1) questions.value[idx] = { ...questions.value[idx], ...payload }
        ElMessage.success('编辑成功')
    } else {
        questions.value.push({ id: Date.now(), ...payload })
        ElMessage.success('新增成功')
    }
    questionDialogVisible.value = false
}
const deleteQuestion = (row: QuestionItem) => {
    ElMessageBox.confirm(`确认删除题目「${row.fieldName}」？`, '提示', { type: 'warning' })
        .then(() => {
            questions.value = questions.value.filter((q) => q.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// ===== 题组筛选 =====
const groupKeyword = ref('')
const groupQuery = ref('')
const filteredGroups = computed(() =>
    groups.value.filter((g) => !groupQuery.value || g.name.includes(groupQuery.value) || g.category.includes(groupQuery.value))
)
const handleGroupSearch = () => { groupQuery.value = groupKeyword.value.trim() }
const resetGroupSearch = () => { groupKeyword.value = ''; groupQuery.value = '' }

// ===== 题组新增/编辑 =====
const groupDialogVisible = ref(false)
const groupEditId = ref<number | null>(null)
const emptyGroup = (): Omit<QuestionGroup, 'id'> => ({ category: '', name: '', description: '', scoreMin: 1, scoreMax: 5 })
const groupForm = reactive(emptyGroup())

const openGroupEdit = (row?: QuestionGroup) => {
    groupEditId.value = row?.id ?? null
    Object.assign(groupForm, row ? { category: row.category, name: row.name, description: row.description, scoreMin: row.scoreMin, scoreMax: row.scoreMax } : emptyGroup())
    groupDialogVisible.value = true
}
const submitGroup = () => {
    if (!groupForm.category.trim() || !groupForm.name.trim()) { ElMessage.warning('请填写分类与题组名称'); return }
    if (groupForm.scoreMin > groupForm.scoreMax) { ElMessage.warning('分值起始不能大于结束'); return }
    if (groupEditId.value) {
        const idx = groups.value.findIndex((g) => g.id === groupEditId.value)
        if (idx > -1) groups.value[idx] = { ...groups.value[idx], ...groupForm }
        ElMessage.success('编辑成功')
    } else {
        groups.value.push({ id: Date.now(), ...groupForm })
        ElMessage.success('新增成功')
    }
    groupDialogVisible.value = false
}
const deleteGroup = (row: QuestionGroup) => {
    if (getGroupQuestionCount(row.id) > 0) {
        ElMessage.warning('该题组下存在题目，无法删除')
        return
    }
    ElMessageBox.confirm(`确认删除题组「${row.category}-${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
            groups.value = groups.value.filter((g) => g.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.nutrition-page {
    padding: 4px;
}

.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: #fff;
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

.list-card { border-radius: 8px; }
.cell-sub { font-size: 12px; color: #909399; }
.service-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;

    .service-tag { max-width: 130px; }
}
.form-tip { margin-top: 4px; font-size: 12px; color: #909399; }
.form-tip.inline { display: inline-block; margin: 0 0 0 10px; }
.main-tabs { :deep(.el-tabs__header) { margin-bottom: 16px; } }

.question-form {
    :deep(.el-form-item) { margin-bottom: 14px; }
}
.option-config {
    width: 100%;
    .option-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }
    .option-label { width: 200px; }
    .option-remark { width: 200px; }
}
.group-form {
    :deep(.el-form-item) { margin-bottom: 14px; }
}
.score-range {
    display: flex;
    align-items: center;
    gap: 8px;
    .group-number { width: 130px; }
}
</style>
