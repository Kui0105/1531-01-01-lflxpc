<template>
    <div class="member-level">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">会员等级</span>
                    <el-button type="primary" @click="openAdd">新增等级</el-button>
                </div>
            </template>

            <el-table :data="sortedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="等级名称" min-width="150" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'disabled-name': !row.enabled }">{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="levelValue" label="等级数值" min-width="110" align="center" sortable />
                <el-table-column label="会员等级背景" min-width="180" align="center">
                    <template #default="{ row }">
                        <el-image
                            v-if="row.background"
                            :src="row.background"
                            :preview-src-list="[row.background]"
                            fit="cover"
                            class="level-bg"
                            preview-teleported
                        />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="会员折扣" min-width="110" align="center">
                    <template #default="{ row }">
                        <span class="discount">{{ row.discount }} 折</span>
                    </template>
                </el-table-column>
                <el-table-column label="所需成长值" min-width="120" align="center">
                    <template #default="{ row }">{{ row.growthValue }}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.enabled ? 'success' : 'info'" size="small" effect="light">
                            {{ row.enabled ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="权益内容" min-width="220" align="center">
                    <template #default="{ row }">
                        <div class="benefit-tags">
                            <el-tag v-for="b in row.benefits" :key="b" size="small" effect="plain">{{ b }}</el-tag>
                            <span v-if="!row.benefits.length" class="cell-sub">-</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="150" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteLevel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="formVisible" :title="isEdit ? '编辑会员等级' : '新增会员等级'" width="560px">
            <el-form :model="form" label-width="110px">
                <el-form-item label="等级名称" required>
                    <el-input v-model="form.name" placeholder="请输入等级名称" />
                </el-form-item>
                <el-form-item label="等级数值" required>
                    <el-input-number v-model="form.levelValue" :min="1" class="!w-full" />
                    <div class="form-hint">数字越大等级越高</div>
                </el-form-item>
                <el-form-item label="会员等级背景" required>
                    <div class="bg-upload-row">
                        <el-upload
                            accept=".png,.jpg,.jpeg"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleBgChange"
                            class="bg-uploader"
                        >
                            <img v-if="form.background" :src="form.background" class="bg-preview" />
                            <div v-else class="bg-add">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span>上传背景</span>
                            </div>
                        </el-upload>
                        <div class="bg-actions">
                            <div class="form-hint">支持 PNG、JPG，大小不超过 2MB</div>
                            <el-button v-if="form.background" type="danger" link size="small" @click="form.background = ''">删除背景</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="会员折扣" required>
                    <el-input-number v-model="form.discount" :min="0.1" :max="10" :precision="1" class="!w-full" />
                    <div class="form-hint">如 9.5 表示 9.5 折，10 表示无折扣；服务/商品可叠加优惠券折扣，折扣基准为优惠抵扣后的金额</div>
                </el-form-item>
                <el-form-item label="所需成长值" required>
                    <el-input-number v-model="form.growthValue" :min="0" class="!w-full" />
                    <div class="form-hint">累计成长值达到该值即升级至此等级</div>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
                </el-form-item>
                <el-form-item label="权益内容">
                    <el-select
                        v-model="form.benefits"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="输入权益后回车添加"
                        class="!w-full"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="marketingLevel">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { memberLevelList, type MemberLevelItem } from './data'

// 等级数值越高，排序越靠后（升序）
const sortedList = computed(() => [...memberLevelList].sort((a, b) => a.levelValue - b.levelValue))

const handleBgChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('等级背景仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('背景图片大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        form.background = String(e.target?.result || '')
    }
    reader.readAsDataURL(file)
}

const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const emptyForm = (): MemberLevelItem => ({
    id: 0,
    name: '',
    levelValue: 1,
    background: '',
    discount: 10,
    growthValue: 0,
    enabled: true,
    benefits: [],
    createdAt: ''
})
const form = reactive<MemberLevelItem>(emptyForm())

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, emptyForm())
    formVisible.value = true
}
const openEdit = (row: MemberLevelItem) => {
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
    if (!form.background) {
        ElMessage.warning('请上传会员等级背景')
        return
    }
    if (memberLevelList.some((item) => item.name === form.name.trim() && item.id !== editingId.value)) {
        ElMessage.warning('等级名称已存在')
        return
    }
    if (memberLevelList.some((item) => item.levelValue === form.levelValue && item.id !== editingId.value)) {
        ElMessage.warning('等级数值已存在，数字越大等级越高')
        return
    }
    if (memberLevelList.some((item) => item.growthValue === form.growthValue && item.id !== editingId.value)) {
        ElMessage.warning('所需成长值已存在，请设置不同的成长值区间')
        return
    }
    if (isEdit.value) {
        const index = memberLevelList.findIndex((item) => item.id === editingId.value)
        if (index > -1) {
            memberLevelList[index] = { ...cloneDeep(form), id: editingId.value, name: form.name.trim(), createdAt: memberLevelList[index].createdAt }
        }
        ElMessage.success('会员等级已更新，成长值区间已同步用户端')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        memberLevelList.push({
            ...cloneDeep(form),
            id: Date.now(),
            name: form.name.trim(),
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('会员等级已新增，用户端等级升级规则已同步')
    }
    formVisible.value = false
}

const deleteLevel = (row: MemberLevelItem) => {
    ElMessageBox.confirm(`确认删除会员等级「${row.name}」？删除后该等级用户将按成长值重新判定等级。`, '删除二次确认', { type: 'warning' })
        .then(() => {
            const index = memberLevelList.findIndex((item) => item.id === row.id)
            if (index > -1) memberLevelList.splice(index, 1)
            ElMessage.success('会员等级已删除')
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

.level-bg {
    width: 110px;
    height: 42px;
    border-radius: 4px;
}

.disabled-name {
    color: #c0c4cc;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.discount {
    font-weight: 600;
    color: #f56c6c;
}

.benefit-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #909399;
}

.bg-upload-row {
    display: flex;
    align-items: center;
    gap: 14px;
}

.bg-uploader :deep(.el-upload) {
    display: block;
}

.bg-preview,
.bg-add {
    width: 140px;
    height: 56px;
    border-radius: 6px;
}

.bg-preview {
    object-fit: cover;
    border: 1px solid #ebeef5;
}

.bg-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 12px;
    color: #a8abb2;
    background: #fafafa;
    border: 1px dashed #dcdfe6;
    cursor: pointer;

    &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }
}

.bg-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>
