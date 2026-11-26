<template>
    <div class="distribution-level">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">分销等级</span>
                    <el-button type="primary" @click="openAdd">新增等级</el-button>
                </div>
            </template>

            <el-table :data="sortedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="等级名称" min-width="140" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'disabled-name': row.status === 'off' }">{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="等级图标" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-image
                            v-if="row.icon"
                            :src="row.icon"
                            :preview-src-list="[row.icon]"
                            fit="cover"
                            class="level-icon"
                            preview-teleported
                        />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="佣金返利比例" min-width="130" align="center">
                    <template #default="{ row }"><span class="rate">{{ row.commissionRate }}%</span></template>
                </el-table-column>
                <el-table-column label="积分返利比例" min-width="130" align="center">
                    <template #default="{ row }">{{ row.pointRate }}%</template>
                </el-table-column>
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'on' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" min-width="100" align="center" sortable />
                <el-table-column label="操作" min-width="150" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button v-if="row.status === 'on'" type="warning" link size="small" @click="toggleStatus(row)">停用</el-button>
                        <el-button v-else type="success" link size="small" @click="toggleStatus(row)">启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="formVisible" :title="isEdit ? '编辑分销等级' : '新增分销等级'" width="560px" class="level-dialog">
            <el-form :model="form" label-width="120px">
                <el-form-item label="等级名称" required>
                    <el-input v-model="form.name" placeholder="请输入等级名称" />
                </el-form-item>
                <el-form-item label="等级图标" required>
                    <div class="icon-form">
                        <el-upload
                            accept=".png,.jpg,.jpeg"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleIconChange"
                            class="icon-uploader"
                        >
                            <div v-if="form.icon" class="icon-card has-image">
                                <img :src="form.icon" class="icon-card-img" />
                                <div class="icon-card-mask">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                    <span>更换图标</span>
                                </div>
                            </div>
                            <div v-else class="icon-card">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                <span class="icon-card-text">点击上传</span>
                            </div>
                        </el-upload>
                        <div class="icon-actions">
                            <el-button v-if="form.icon" type="danger" link size="small" @click="form.icon = ''">删除图标</el-button>
                        </div>
                        <div class="form-hint">支持 PNG、JPG，大小不超过 2MB，建议 64×64 正方形</div>
                    </div>
                </el-form-item>
                <el-form-item label="佣金返利比例" required>
                    <el-input-number v-model="form.commissionRate" :min="0" :max="100" :precision="1" class="!w-full" />
                    <div class="form-hint">按订单实付金额 × 此比例计算佣金；订单售后退款则返利失效</div>
                </el-form-item>
                <el-form-item label="积分返利比例" required>
                    <el-input-number v-model="form.pointRate" :min="0" :max="100" :precision="1" class="!w-full" />
                    <div class="form-hint">按订单实付金额 × 此比例计算推广积分</div>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input-number v-model="form.sort" :min="0" class="!w-full" />
                    <div class="form-hint">数字越大展示越靠前，保存后同步更新等级展示顺序</div>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status" active-value="on" inactive-value="off" active-text="启用" inactive-text="停用" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="distributionLevel">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { distributionList } from '@/views/distribution/list/data'

import { distributionLevels, type DistributionLevelItem } from './data'

// 按排序值降序（数字越大越靠前）
const sortedList = computed(() => [...distributionLevels].sort((a, b) => b.sort - a.sort))

// 该等级下是否已有分销用户
const hasUsers = (row: DistributionLevelItem) => distributionList.some((item) => item.level === row.name)

const handleIconChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('等级图标仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('图标大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        form.icon = String(e.target?.result || '')
    }
    reader.readAsDataURL(file)
}

const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const emptyForm = (): DistributionLevelItem => ({
    id: 0,
    name: '',
    icon: '',
    commissionRate: 0,
    pointRate: 0,
    status: 'on',
    sort: 0
})
const form = reactive<DistributionLevelItem>(emptyForm())

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, emptyForm())
    formVisible.value = true
}
const openEdit = (row: DistributionLevelItem) => {
    isEdit.value = true
    editingId.value = row.id
    Object.assign(form, cloneDeep(row))
    formVisible.value = true
}

const submitForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入等级名称')
        return
    }
    if (!form.icon) {
        ElMessage.warning('请上传等级图标')
        return
    }
    if (distributionLevels.some((item) => item.name === form.name.trim() && item.id !== editingId.value)) {
        ElMessage.warning('等级名称已存在')
        return
    }
    if (isEdit.value) {
        const index = distributionLevels.findIndex((item) => item.id === editingId.value)
        if (index > -1) distributionLevels[index] = { ...cloneDeep(form), id: editingId.value, name: form.name.trim() }
        ElMessage.success('分销等级已更新，展示顺序已同步')
    } else {
        distributionLevels.push({ ...cloneDeep(form), id: Date.now(), name: form.name.trim() })
        ElMessage.success('分销等级已新增')
    }
    formVisible.value = false
}

const toggleStatus = (row: DistributionLevelItem) => {
    const target = row.status === 'on' ? 'off' : 'on'
    if (target === 'off' && hasUsers(row)) {
        ElMessage.warning(`等级「${row.name}」下已有分销用户，不可停用`)
        return
    }
    ElMessageBox.confirm(`确认${target === 'off' ? '停用' : '启用'}分销等级「${row.name}」？`, target === 'off' ? '停用二次确认' : '启用二次确认', { type: 'warning' })
        .then(() => {
            row.status = target
            ElMessage.success(target === 'off' ? '分销等级已停用' : '分销等级已启用')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
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

.level-icon {
    width: 36px;
    height: 36px;
    border-radius: 6px;
}

.disabled-name {
    color: #c0c4cc;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.rate {
    font-weight: 600;
    color: #f56c6c;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #909399;
}

.icon-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.icon-uploader :deep(.el-upload) {
    display: block;
}

.icon-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 104px;
    height: 104px;
    color: #a8abb2;
    background: #fafafa;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        color: var(--el-color-primary);
        background: #f5f7ff;
        border-color: var(--el-color-primary);
    }

    &.has-image {
        padding: 0;
        overflow: hidden;
        border-style: solid;
        border-color: #ebeef5;
        background: #fff;
    }
}

.icon-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.icon-card-text {
    font-size: 12px;
}

.icon-card-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s;

    .icon-card:hover & {
        opacity: 1;
    }
}

.icon-actions {
    line-height: 1;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>
