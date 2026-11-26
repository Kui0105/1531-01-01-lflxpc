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
                        <span class="category-icon" :style="{ background: row.color }">{{ row.icon }}</span>
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
                <el-form-item label="分类图标">
                    <div class="icon-form">
                        <el-input v-model="form.icon" class="icon-input" maxlength="2" placeholder="图标字符" />
                        <span class="icon-preview" :style="{ background: form.color }">{{ form.icon }}</span>
                        <el-select v-model="form.color" class="icon-color">
                            <el-option
                                v-for="c in iconColors"
                                :key="c"
                                :label="c"
                                :value="c"
                            >
                                <span class="color-dot" :style="{ background: c }" />
                            </el-option>
                        </el-select>
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
    icon: string
    color: string
    sort: number
    enabled: boolean
}

const iconColors = ['#4A5DFF', '#67c23a', '#e6a23c', '#f56c6c', '#9b59b6', '#17a2b8']

const categoryList = reactive<CategoryItem[]>([
    { id: 1, name: '康复理疗', level: 1, parentName: '', icon: '理', color: '#4A5DFF', sort: 30, enabled: true },
    { id: 2, name: '肩颈理疗', level: 2, parentName: '康复理疗', icon: '肩', color: '#67c23a', sort: 25, enabled: true },
    { id: 3, name: '腰背理疗', level: 2, parentName: '康复理疗', icon: '腰', color: '#e6a23c', sort: 20, enabled: true },
    { id: 4, name: '康复评估', level: 1, parentName: '', icon: '评', color: '#9b59b6', sort: 28, enabled: true },
    { id: 5, name: '体态评估', level: 2, parentName: '康复评估', icon: '态', color: '#17a2b8', sort: 22, enabled: true },
    { id: 6, name: '护理服务', level: 1, parentName: '', icon: '护', color: '#f56c6c', sort: 18, enabled: true },
    { id: 7, name: '经络护理', level: 2, parentName: '护理服务', icon: '经', color: '#4A5DFF', sort: 15, enabled: true },
    { id: 8, name: '舒缓护理', level: 2, parentName: '护理服务', icon: '舒', color: '#67c23a', sort: 10, enabled: false }
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
    color: '#4A5DFF',
    sort: 0,
    enabled: true
})

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, {
        id: 0,
        name: '',
        level: 1,
        parentName: '',
        icon: '',
        color: '#4A5DFF',
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
    if (!form.icon.trim()) {
        ElMessage.warning('请输入分类图标')
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 6px;
}

.disabled-name {
    color: #c0c4cc;
}

.icon-form {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon-input {
    width: 140px;
}

.icon-preview {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 6px;
}

.icon-color {
    width: 130px;
}

.color-dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    border-radius: 50%;
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
