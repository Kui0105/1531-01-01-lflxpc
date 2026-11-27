<template>
    <div class="ad-list-page">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">广告列表</span>
                    <el-button type="primary" size="small" @click="openEdit()">新增</el-button>
                </div>
            </template>
            <el-table :data="adData" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="adId" label="广告ID" min-width="150" align="center" />
                <el-table-column label="广告图片" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-image v-if="row.image" :src="row.image" :preview-src-list="[row.image]" class="ad-image" fit="cover" preview-teleported />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="position" label="广告位置" min-width="130" align="center" />
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'on' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="90" align="center" />
                <el-table-column prop="createdAt" label="创建时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="140" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteAd(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editId ? '编辑广告' : '新增广告'" width="560px" :close-on-click-modal="false">
            <el-form :model="form" label-width="100px" class="ad-form">
                <el-form-item label="广告图片">
                    <el-upload class="ad-uploader" accept=".png,.jpg,.jpeg" :auto-upload="false" :show-file-list="false" :on-change="handleImageChange" action="#">
                        <div v-if="form.image" class="image-preview">
                            <img :src="form.image" class="image-img" />
                            <div class="image-mask">点击更换</div>
                        </div>
                        <div v-else class="image-placeholder">
                            <el-icon :size="24"><Plus /></el-icon>
                            <div>点击上传广告图片</div>
                            <div class="image-tip">支持 PNG/JPG，不超过 2MB</div>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="广告位置">
                    <el-select v-model="form.position" placeholder="请选择广告位置" class="!w-full">
                        <el-option v-for="item in adPositionOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio value="on">启用</el-radio>
                        <el-radio value="off">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sort" :min="0" :max="999" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="contentAd">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { adList, adPositionOptions, type AdItem } from './data'

const adDataRaw = ref<AdItem[]>(adList.map((item) => ({ ...item })))
// 排序数字越大排名越靠前
const adData = computed(() => [...adDataRaw.value].sort((a, b) => b.sort - a.sort))

// 新增/编辑
const editVisible = ref(false)
const editId = ref<number | null>(null)
const emptyForm = (): Omit<AdItem, 'id' | 'adId' | 'createdAt'> => ({
    image: '', position: '', status: 'on', sort: 10
})
const form = reactive(emptyForm())

const openEdit = (row?: AdItem) => {
    editId.value = row?.id ?? null
    Object.assign(form, row ? { image: row.image, position: row.position, status: row.status, sort: row.sort } : emptyForm())
    editVisible.value = true
}
const handleImageChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('广告图片仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('广告图片大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => { form.image = String(e.target?.result || '') }
    reader.readAsDataURL(file)
}
const submitEdit = () => {
    if (!form.image) { ElMessage.warning('请上传广告图片'); return }
    if (!form.position) { ElMessage.warning('请选择广告位置'); return }
    if (editId.value) {
        const idx = adDataRaw.value.findIndex((a) => a.id === editId.value)
        if (idx > -1) adDataRaw.value[idx] = { ...adDataRaw.value[idx], ...form }
        ElMessage.success('编辑成功')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        adDataRaw.value.push({
            id: Date.now(),
            adId: `AD${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${String(adDataRaw.value.length + 1).padStart(3, '0')}`,
            ...form,
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('新增成功')
    }
    editVisible.value = false
}

// 删除
const deleteAd = (row: AdItem) => {
    ElMessageBox.confirm(`确认删除广告「${row.adId}」？`, '提示', { type: 'warning' })
        .then(() => {
            adDataRaw.value = adDataRaw.value.filter((a) => a.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.ad-list-page {
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

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.ad-image {
    width: 100px;
    height: 34px;
    border-radius: 4px;
}

.ad-form {
    :deep(.el-form-item) {
        margin-bottom: 16px;
    }
}

.ad-uploader {
    display: inline-block;
    line-height: 0;

    :deep(.el-upload) {
        display: block;
        line-height: 0;
    }
}

.image-preview {
    position: relative;
    box-sizing: border-box;
    width: 240px;
    height: 90px;
    overflow: hidden;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
    cursor: pointer;
    line-height: normal;

    .image-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image-mask {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.45);
        opacity: 0;
        transition: opacity 0.2s;
    }

    &:hover .image-mask {
        opacity: 1;
    }
}

.image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 240px;
    height: 90px;
    line-height: normal;
    color: #909399;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
    }

    .image-tip {
        margin-top: 4px;
        font-size: 11px;
    }
}
</style>
