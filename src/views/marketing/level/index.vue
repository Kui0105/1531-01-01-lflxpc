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
                        <el-button type="primary" link size="small" @click="openBenefit(row)">
                            {{ stripHtml(row.benefits) || '查看权益' }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="150" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button v-if="!isDefaultLevel(row)" type="danger" link size="small" @click="deleteLevel(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            v-model="formVisible"
            class="level-edit-dialog"
            :title="isEdit ? '编辑会员等级' : '新增会员等级'"
            width="760px"
            top="5vh"
        >
            <el-form :model="form" label-width="110px" class="level-form">
                <div class="section-title">基础信息</div>
                <el-row :gutter="16">
                    <el-col :span="12">
                        <el-form-item label="等级名称" required>
                            <el-input v-model="form.name" placeholder="请输入等级名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="等级数值" required>
                            <el-input-number v-model="form.levelValue" :min="1" :disabled="isEdit && isDefaultLevel(form)" class="!w-full" />
                            <div class="form-hint">数字越大等级越高{{ isEdit && isDefaultLevel(form) ? '；普通会员为系统默认等级，数值固定为 1 不可更改' : '' }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="会员折扣" required>
                            <el-input-number v-model="form.discount" :min="0.1" :max="10" :precision="1" class="!w-full" />
                            <div class="form-hint">如 9.5 表示 9.5 折，10 表示无折扣；服务/商品可叠加优惠券折扣，折扣基准为优惠抵扣后的金额</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所需成长值" required>
                            <el-input-number v-model="form.growthValue" :min="0" class="!w-full" />
                            <div class="form-hint">累计成长值达到该值即升级至此等级</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态">
                            <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="section-title">会员等级背景</div>
                <el-form-item label="等级背景" required>
                    <div class="bg-form">
                        <el-upload
                            accept=".png,.jpg,.jpeg"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleBgChange"
                            class="bg-uploader"
                        >
                            <div v-if="form.background" class="bg-card has-image">
                                <img :src="form.background" class="bg-card-img" />
                                <div class="bg-card-mask">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                    <span>更换背景</span>
                                </div>
                            </div>
                            <div v-else class="bg-card">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                <span class="bg-card-text">点击上传</span>
                            </div>
                        </el-upload>
                        <div class="bg-actions">
                            <el-button v-if="form.background" type="danger" link size="small" @click="form.background = ''">删除背景</el-button>
                        </div>
                        <div class="form-hint">支持 PNG、JPG，大小不超过 2MB，展示按 1:1 居中裁切</div>
                    </div>
                </el-form-item>

                <div class="section-title">权益内容</div>
                <el-form-item label="权益内容">
                    <editor v-model="form.benefits" :height="240" />
                    <div class="form-hint">权益内容以富文本展示在用户端会员权益页面</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </template>
        </el-dialog>

        <!-- 权益内容查看弹窗（用户端展示效果） -->
        <el-dialog v-model="benefitVisible" title="权益内容" width="560px">
            <div class="benefit-content" v-html="currentBenefits" />
            <template #footer>
                <el-button type="primary" @click="benefitVisible = false">关闭</el-button>
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

// 普通会员为系统默认等级（数值固定为 1），不可删除、数值不可更改
const isDefaultLevel = (row: MemberLevelItem) => row.levelValue === 1 || row.name === '普通会员'

// 富文本转纯文本（列表摘要展示）
const stripHtml = (html: string) =>
    String(html || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
        .slice(0, 40)

const benefitVisible = ref(false)
const currentBenefits = ref('')
const openBenefit = (row: MemberLevelItem) => {
    currentBenefits.value = row.benefits || ''
    benefitVisible.value = true
}

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
    benefits: '',
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
    width: 48px;
    height: 48px;
    border-radius: 6px;
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

.benefit-content {
    min-height: 80px;
    font-size: 14px;
    line-height: 1.8;
    color: #303133;

    :deep(ul),
    :deep(ol) {
        padding-left: 22px;
        list-style: disc;
    }
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #909399;
}

.bg-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.bg-uploader :deep(.el-upload) {
    display: block;
}

/* 1:1 正方形上传卡片，图片非正方形时居中裁切填充 */
.bg-card {
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

.bg-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.bg-card-text {
    font-size: 12px;
}

.bg-card-mask {
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

    .bg-card:hover & {
        opacity: 1;
    }
}

.bg-actions {
    line-height: 1;
}

.section-title {
    position: relative;
    margin: 4px 0 14px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;

    &::before {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 0;
        width: 3px;
        background: var(--el-color-primary);
        border-radius: 2px;
        content: '';
    }
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>

<!-- 弹窗渲染在 body 上，需用全局样式控制内部滚动（与商品/服务列表一致） -->
<style lang="scss">
.level-edit-dialog {
    display: flex;
    flex-direction: column;
    height: 82vh;
    min-height: 560px;
    max-height: 90vh;
    margin-bottom: 2vh;
    overflow: hidden;

    .el-dialog__header {
        flex: 0 0 auto;
        padding-bottom: 12px;
    }

    .el-dialog__body {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        padding-top: 8px;
    }

    .el-dialog__footer {
        flex: 0 0 auto;
        padding-top: 12px;
        border-top: 1px solid #e8ebf5;
    }
}
</style>
