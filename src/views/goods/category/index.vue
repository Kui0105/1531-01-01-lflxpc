<template>
    <div class="goods-category">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">商品分类</span>
                    <el-button type="primary" @click="openAdd">新增分类</el-button>
                </div>
            </template>
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
                    <template #default="{ row }">{{ row.parentName || '-' }}</template>
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
                        <el-button v-if="row.enabled" type="warning" link size="small" @click="toggleEnabled(row)">停用</el-button>
                        <el-button v-else type="success" link size="small" @click="toggleEnabled(row)">启用</el-button>
                        <el-button type="danger" link size="small" @click="deleteCategory(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="formVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="520px">
            <el-form :model="form" label-width="100px">
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
                        <div v-if="form.icon" class="icon-actions">
                            <el-button type="danger" link size="small" @click="form.icon = ''">删除图标</el-button>
                        </div>
                        <div class="icon-hint">支持 PNG、JPG 格式，大小不超过 2MB，建议 64×64 正方形</div>
                    </div>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input-number v-model="form.sort" :min="0" class="!w-full" />
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

<script lang="ts" setup name="goodsCategory">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { goodsList } from '@/views/goods/list/data'

interface CategoryItem {
    id: number
    name: string
    level: number
    parentName: string
    icon: string
    sort: number
    enabled: boolean
}

const mockIcon = (label: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${color}"/><text x="32" y="32" font-size="22" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const categoryList = reactive<CategoryItem[]>([
    { id: 1, name: '养生保健', level: 1, parentName: '', icon: mockIcon('养', '#4A5DFF'), sort: 30, enabled: true },
    { id: 2, name: '足浴包', level: 2, parentName: '养生保健', icon: mockIcon('足', '#67c23a'), sort: 25, enabled: true },
    { id: 3, name: '热敷用品', level: 2, parentName: '养生保健', icon: mockIcon('热', '#e6a23c'), sort: 20, enabled: true },
    { id: 4, name: '养生茶', level: 2, parentName: '养生保健', icon: mockIcon('茶', '#9b59b6'), sort: 18, enabled: true },
    { id: 5, name: '康复辅具', level: 1, parentName: '', icon: mockIcon('康', '#17a2b8'), sort: 28, enabled: true },
    { id: 6, name: '护具', level: 2, parentName: '康复辅具', icon: mockIcon('护', '#f56c6c'), sort: 15, enabled: true },
    { id: 7, name: '理疗仪器', level: 2, parentName: '康复辅具', icon: mockIcon('理', '#4A5DFF'), sort: 12, enabled: true },
    { id: 8, name: '健康礼盒', level: 1, parentName: '', icon: mockIcon('礼', '#e6a23c'), sort: 26, enabled: true },
    { id: 9, name: '礼盒套装', level: 2, parentName: '健康礼盒', icon: mockIcon('套', '#67c23a'), sort: 10, enabled: true }
])

const sortedList = computed(() => [...categoryList].sort((a, b) => b.sort - a.sort))
const firstLevelNames = computed(() => categoryList.filter((item) => item.level === 1).map((item) => item.name))

const hasOnSaleGoods = (row: CategoryItem) =>
    goodsList.some(
        (g) => g.onSale === 'on' && (g.category1 === row.name || g.category2 === row.name)
    )

const handleIconChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
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

const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const form = reactive<CategoryItem>({ id: 0, name: '', level: 1, parentName: '', icon: '', sort: 0, enabled: true })

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, { id: 0, name: '', level: 1, parentName: '', icon: '', sort: 0, enabled: true })
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
    const level = form.parentName ? 2 : 1
    if (isEdit.value) {
        const index = categoryList.findIndex((item) => item.id === editingId.value)
        if (index > -1) categoryList[index] = { ...cloneDeep(form), id: editingId.value, name: form.name.trim(), level }
        ElMessage.success('分类已更新')
    } else {
        categoryList.push({ ...cloneDeep(form), id: Date.now(), name: form.name.trim(), level })
        ElMessage.success(level === 2 ? '二级分类已新增' : '一级分类已新增')
    }
    formVisible.value = false
}

const toggleEnabled = (row: CategoryItem) => {
    if (row.enabled && hasOnSaleGoods(row)) {
        ElMessage.warning(`分类「${row.name}」下仍有上架商品，请先下架或转移后再停用`)
        return
    }
    const target = !row.enabled
    ElMessageBox.confirm(target ? `确认启用分类「${row.name}」？` : `确认停用分类「${row.name}」？`, target ? '启用二次确认' : '停用二次确认', { type: 'warning' })
        .then(() => {
            row.enabled = target
            ElMessage.success(target ? '分类已启用' : '分类已停用')
        })
        .catch(() => {})
}

const deleteCategory = (row: CategoryItem) => {
    if (hasOnSaleGoods(row)) {
        ElMessage.warning(`分类「${row.name}」下仍有上架商品，请先下架或转移后再删除`)
        return
    }
    if (categoryList.some((item) => item.parentName === row.name)) {
        ElMessage.warning('该分类下存在二级分类，请先删除子分类')
        return
    }
    ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '删除二次确认', { type: 'warning' })
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

.icon-hint {
    font-size: 12px;
    line-height: 1.5;
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
