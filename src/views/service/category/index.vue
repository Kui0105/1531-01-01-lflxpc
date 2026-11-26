<template>
    <div class="service-category">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">服务分类</span>
                    <el-button type="primary" @click="openAdd">新增分类</el-button>
                </div>
            </template>
            <div class="category-tip">
                列表按排序值从大到小展示；用户端服务页 TAB 按启用的二级分类展示，排序与此处同步。
            </div>
            <el-table :data="sortedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="分类图标" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-image
                            v-if="row.icon"
                            :src="row.icon"
                            :preview-src-list="[row.icon]"
                            fit="contain"
                            class="category-icon"
                            preview-teleported
                        />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="分类名称" min-width="160" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'disabled-name': !row.enabled }">{{ row.name }}</span>
                        <el-tag v-if="row.level === 1" size="small" effect="plain" class="ml-1">一级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" min-width="100" align="center" />
                <el-table-column label="所属上级分类" min-width="160" align="center">
                    <template #default="{ row }">
                        {{ row.parentName || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.enabled ? 'success' : 'info'" size="small" effect="light">
                            {{ row.enabled ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="220" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button
                            v-if="row.enabled"
                            type="warning"
                            link
                            size="small"
                            @click="toggleEnabled(row)"
                        >
                            停用
                        </el-button>
                        <el-button v-else type="success" link size="small" @click="toggleEnabled(row)">启用</el-button>
                        <el-button type="danger" link size="small" @click="deleteCategory(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="formVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="520px">
            <el-form :model="form" label-width="100px" class="category-form">
                <el-form-item label="上级分类">
                    <el-select
                        v-model="form.parentName"
                        clearable
                        placeholder="不选则为一级分类，选择则新增二级分类"
                        class="!w-full"
                        :disabled="isEdit && form.level === 1"
                    >
                        <el-option
                            v-for="item in firstLevelNames"
                            :key="item"
                            :label="item"
                            :value="item"
                            :disabled="isEdit && item === form.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" required>
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="分类图标" required>
                    <div class="icon-form">
                        <el-upload
                            accept=".png,.jpg,.jpeg"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handleIconChange"
                        >
                            <img v-if="form.icon" :src="form.icon" class="icon-preview" />
                            <div v-else class="icon-upload-box">点击上传</div>
                        </el-upload>
                        <div class="icon-hint">仅支持 PNG、JPG 格式，建议 64×64 正方形</div>
                    </div>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input-number v-model="form.sort" :min="0" class="!w-full" />
                    <div class="form-hint">数值越大排序越靠前，用户端 TAB 同步更新</div>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="serviceCategory">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { services } from '@/views/service/list/data'

interface CategoryItem {
    id: number
    name: string
    level: number // 1 一级分类 / 2 二级分类
    parentName: string
    icon: string // 图标图片（PNG/JPG，data URI）
    sort: number
    enabled: boolean
}

// mock 图标占位图（SVG data URI 作为演示图片），上传时替换为真实 PNG/JPG
const mockIcon = (label: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${color}"/><text x="32" y="32" font-size="22" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const categoryList = reactive<CategoryItem[]>([
    { id: 1, name: '康复理疗', level: 1, parentName: '', icon: mockIcon('理', '#4A5DFF'), sort: 30, enabled: true },
    { id: 2, name: '肩颈理疗', level: 2, parentName: '康复理疗', icon: mockIcon('肩', '#67c23a'), sort: 25, enabled: true },
    { id: 3, name: '腰背理疗', level: 2, parentName: '康复理疗', icon: mockIcon('腰', '#e6a23c'), sort: 20, enabled: true },
    { id: 4, name: '康复评估', level: 1, parentName: '', icon: mockIcon('评', '#9b59b6'), sort: 28, enabled: true },
    { id: 5, name: '体态评估', level: 2, parentName: '康复评估', icon: mockIcon('态', '#17a2b8'), sort: 22, enabled: true },
    { id: 6, name: '护理服务', level: 1, parentName: '', icon: mockIcon('护', '#f56c6c'), sort: 18, enabled: true },
    { id: 7, name: '经络护理', level: 2, parentName: '护理服务', icon: mockIcon('经', '#4A5DFF'), sort: 15, enabled: true },
    { id: 8, name: '舒缓护理', level: 2, parentName: '护理服务', icon: mockIcon('舒', '#67c23a'), sort: 10, enabled: false }
])

// 列表按排序值降序，用户端 TAB 同步此顺序
const sortedList = computed(() => [...categoryList].sort((a, b) => b.sort - a.sort))

const firstLevelNames = computed(() => categoryList.filter((item) => item.level === 1).map((item) => item.name))

// 分类下是否有上架服务（停用/删除前校验）
const hasOnSaleService = (row: CategoryItem) =>
    services.some(
        (s) =>
            !s.deleted &&
            s.onSale === 'on' &&
            (s.category1 === row.name || s.category2 === row.name)
    )

const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const form = reactive<CategoryItem>({
    id: 0,
    name: '',
    level: 1,
    parentName: '',
    icon: '',
    sort: 0,
    enabled: true
})

// 上传图标：校验 PNG/JPG 格式与大小，读取为 base64
const handleIconChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    const isPngOrJpg = ['image/png', 'image/jpeg'].includes(file.type)
    if (!isPngOrJpg) {
        ElMessage.error('分类图标仅支持 PNG、JPG 格式')
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

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, {
        id: 0,
        name: '',
        level: 1,
        parentName: '',
        icon: '',
        sort: 0,
        enabled: true
    })
    formVisible.value = true
}
const openEdit = (row: CategoryItem) => {
    isEdit.value = true
    editingId.value = row.id
    Object.assign(form, cloneDeep(row))
    formVisible.value = true
}
const submitForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入分类名称')
        return
    }
    if (!form.icon) {
        ElMessage.warning('请上传分类图标')
        return
    }
    if (categoryList.some((item) => item.name === form.name.trim() && item.id !== editingId.value)) {
        ElMessage.warning('分类名称已存在')
        return
    }
    // 选择上级分类即为二级分类
    const level = form.parentName ? 2 : 1
    if (isEdit.value) {
        const index = categoryList.findIndex((item) => item.id === editingId.value)
        if (index > -1) {
            categoryList[index] = { ...cloneDeep(form), id: editingId.value, name: form.name.trim(), level }
        }
        ElMessage.success('分类已更新，用户端 TAB 同步更新')
    } else {
        categoryList.push({
            ...cloneDeep(form),
            id: Date.now(),
            name: form.name.trim(),
            level
        })
        ElMessage.success(level === 2 ? '二级分类已新增，用户端服务页 TAB 同步展示' : '一级分类已新增')
    }
    formVisible.value = false
}

// 停用 / 启用（二次确认，有上架服务不可停用）
const toggleEnabled = (row: CategoryItem) => {
    if (row.enabled && hasOnSaleService(row)) {
        ElMessage.warning(`分类「${row.name}」下仍有上架服务，请先下架或转移该分类下的服务后再停用`)
        return
    }
    const target = !row.enabled
    ElMessageBox.confirm(
        target
            ? `确认启用分类「${row.name}」？启用后用户端服务页 TAB 将展示该分类。`
            : `确认停用分类「${row.name}」？停用后用户端不再展示该分类。`,
        target ? '启用二次确认' : '停用二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.enabled = target
            ElMessage.success(target ? '分类已启用' : '分类已停用')
        })
        .catch(() => {})
}

// 删除（有上架服务不可删除）
const deleteCategory = (row: CategoryItem) => {
    if (hasOnSaleService(row)) {
        ElMessage.warning(`分类「${row.name}」下仍有上架服务，请先下架或转移该分类下的服务后再删除`)
        return
    }
    if (categoryList.some((item) => item.parentName === row.name)) {
        ElMessage.warning('该分类下存在二级分类，请先删除子分类')
        return
    }
    ElMessageBox.confirm(`确认删除分类「${row.name}」？已有订单的分类数据保留不删除。`, '删除二次确认', {
        type: 'warning'
    })
        .then(() => {
            const index = categoryList.findIndex((item) => item.id === row.id)
            if (index > -1) categoryList.splice(index, 1)
            ElMessage.success('分类已删除')
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

.category-tip {
    margin-bottom: 12px;
    padding: 8px 12px;
    font-size: 12px;
    color: #909399;
    background: #f5f7ff;
    border-radius: 4px;
}

.category-icon {
    width: 36px;
    height: 36px;
}

.disabled-name {
    color: #c0c4cc;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.icon-form {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-preview {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    cursor: pointer;
}

.icon-upload-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 12px;
    color: #909399;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }
}

.icon-hint {
    font-size: 12px;
    color: #909399;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>
