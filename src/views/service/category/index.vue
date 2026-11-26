<template>
    <div class="service-category">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">服务分类</span>
                    <el-button type="primary" @click="openAdd">新增分类</el-button>
                </div>
            </template>
            <el-table :data="categoryList" style="width: 100%">
                <el-table-column prop="id" label="分类ID" min-width="120" align="center" />
                <el-table-column prop="name" label="分类名称" min-width="180" align="center" />
                <el-table-column label="分类层级" min-width="120" align="center">
                    <template #default="{ row }">
                        {{ row.level === 1 ? '一级分类' : '二级分类' }}
                    </template>
                </el-table-column>
                <el-table-column label="所属上级" min-width="160" align="center">
                    <template #default="{ row }">
                        {{ row.parentName || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" min-width="100" align="center" />
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.enabled ? 'success' : 'info'" size="small" effect="light">
                            {{ row.enabled ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="160" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteCategory(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="formVisible" :title="isEdit ? '编辑分类' : '新增分类'" width="460px">
            <el-form :model="form" label-width="90px">
                <el-form-item label="分类名称" required>
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
                <el-form-item label="分类层级" required>
                    <el-select v-model="form.level" class="!w-full" @change="form.parentName = ''">
                        <el-option label="一级分类" :value="1" />
                        <el-option label="二级分类" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.level === 2" label="所属上级" required>
                    <el-select v-model="form.parentName" class="!w-full" placeholder="请选择一级分类">
                        <el-option v-for="item in firstLevelNames" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input-number v-model="form.sort" :min="0" class="!w-full" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.enabled" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="serviceCategory">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

interface CategoryItem {
    id: number
    name: string
    level: number
    parentName: string
    sort: number
    enabled: boolean
}

const categoryList = reactive<CategoryItem[]>([
    { id: 1, name: '康复理疗', level: 1, parentName: '', sort: 10, enabled: true },
    { id: 2, name: '肩颈理疗', level: 2, parentName: '康复理疗', sort: 10, enabled: true },
    { id: 3, name: '腰背理疗', level: 2, parentName: '康复理疗', sort: 20, enabled: true },
    { id: 4, name: '康复评估', level: 1, parentName: '', sort: 20, enabled: true },
    { id: 5, name: '体态评估', level: 2, parentName: '康复评估', sort: 10, enabled: true },
    { id: 6, name: '护理服务', level: 1, parentName: '', sort: 30, enabled: true },
    { id: 7, name: '经络护理', level: 2, parentName: '护理服务', sort: 10, enabled: false }
])

const firstLevelNames = computed(() => categoryList.filter((item) => item.level === 1).map((item) => item.name))

const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const form = reactive<CategoryItem>({ id: 0, name: '', level: 1, parentName: '', sort: 0, enabled: true })

const openAdd = () => {
    isEdit.value = false
    Object.assign(form, { id: 0, name: '', level: 1, parentName: '', sort: 0, enabled: true })
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
    if (form.level === 2 && !form.parentName) {
        ElMessage.warning('请选择所属上级')
        return
    }
    if (isEdit.value) {
        const index = categoryList.findIndex((item) => item.id === editingId.value)
        if (index > -1) categoryList[index] = { ...cloneDeep(form), id: editingId.value }
        ElMessage.success('分类已更新')
    } else {
        categoryList.push({ ...cloneDeep(form), id: Date.now() })
        ElMessage.success('分类已新增')
    }
    formVisible.value = false
}
const deleteCategory = (row: CategoryItem) => {
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
</style>
