<template>
    <div class="staff-list-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="姓名/手机号" clearable class="!w-[180px]" />
            <el-select v-model="titleFilter" placeholder="职称" clearable class="!w-[140px]">
                <el-option v-for="item in titleOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="storeFilter" placeholder="所属门店" clearable class="!w-[150px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="statusFilter" placeholder="状态" clearable class="!w-[120px]">
                <el-option label="启用" value="enabled" />
                <el-option label="停用" value="disabled" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" class="ml-auto" @click="openEdit()">新增人员</el-button>
        </div>

        <!-- 人员列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="人员照片" min-width="90" align="center">
                    <template #default="{ row }">
                        <el-image v-if="row.photo" :src="row.photo" :preview-src-list="[row.photo]" class="staff-photo" fit="cover" preview-teleported />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="100" align="center" />
                <el-table-column prop="phone" label="手机号" min-width="130" align="center" />
                <el-table-column label="职称/职级" min-width="140" align="center">
                    <template #default="{ row }">{{ row.title }} / {{ row.level }}级</template>
                </el-table-column>
                <el-table-column prop="store" label="所属门店" min-width="130" align="center" />
                <el-table-column label="上班状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.workStatus === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.workStatus === 'on' ? '上班' : '休息' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="90" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'" size="small" effect="light">
                            {{ row.status === 'enabled' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="warning" link size="small" @click="openPerformance(row)">查看绩效</el-button>
                        <el-button type="danger" link size="small" @click="deleteStaff(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="pagination-wrap"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredList.length"
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50]"
            />
        </el-card>

        <!-- 新增/编辑人员弹窗 -->
        <el-dialog v-model="editVisible" :title="editId ? '编辑人员' : '新增人员'" width="680px" :close-on-click-modal="false">
            <el-form :model="form" label-width="110px" class="staff-form">
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-form-item label="姓名"><el-input v-model="form.name" placeholder="请输入姓名" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号"><el-input v-model="form.phone" placeholder="请输入手机号" /></el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="照片">
                            <div class="photo-upload-wrap">
                                <el-upload class="photo-uploader" accept=".png,.jpg,.jpeg" :auto-upload="false" :show-file-list="false" :on-change="handlePhotoChange" action="#">
                                    <div v-if="form.photo" class="photo-preview">
                                        <img :src="form.photo" class="photo-img" />
                                        <div class="photo-mask">更换</div>
                                    </div>
                                    <div v-else class="photo-placeholder">
                                        <el-icon :size="26"><Plus /></el-icon>
                                    </div>
                                </el-upload>
                                <div class="photo-tip">支持 PNG/JPG，不超过 2MB</div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职称">
                            <el-select v-model="form.title" placeholder="请选择职称" class="!w-full">
                                <el-option v-for="item in titleOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职级">
                            <el-input-number v-model="form.level" :min="1" :max="99" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属门店">
                            <el-select v-model="form.store" placeholder="请选择门店" class="!w-full">
                                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上班状态">
                            <el-radio-group v-model="form.workStatus">
                                <el-radio value="on">上班</el-radio>
                                <el-radio value="off">休息</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="可预约服务关联">
                            <el-select v-model="form.services" multiple placeholder="请选择可预约服务" class="!w-full">
                                <el-option v-for="item in serviceOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio value="enabled">启用</el-radio>
                                <el-radio value="disabled">停用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>

        <!-- 查看绩效弹窗 -->
        <el-dialog v-model="performanceVisible" :title="`${current?.name || ''} - 绩效数据`" width="820px" :close-on-click-modal="false">
            <div class="filter-bar dialog-filter">
                <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                <el-date-picker
                    v-model="perfMonth"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="年/月"
                    class="!w-[180px]"
                />
                <el-button type="primary" @click="handlePerfSearch">查询</el-button>
                <el-button @click="resetPerfSearch">重置</el-button>
            </div>
            <el-table :data="perfList" class="mt-3" size="small" style="width: 100%">
                <el-table-column prop="yearMonth" label="年/月" min-width="110" align="center" />
                <el-table-column prop="level" label="绩效等级" min-width="100" align="center" />
                <el-table-column label="客户满意度" min-width="110" align="center">
                    <template #default="{ row }">{{ row.satisfaction }}%</template>
                </el-table-column>
                <el-table-column prop="complaintDeduct" label="投诉扣分" min-width="100" align="center" />
                <el-table-column prop="factor" label="绩效系数" min-width="100" align="center" />
                <el-table-column label="完成人次/月目标人次" min-width="180" align="center">
                    <template #default="{ row }">{{ row.completedCount }} / {{ row.targetCount }}</template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="staffList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { titleList } from '@/views/title/list/data'
import { storeItemList } from '@/views/store/list/data'

import { staffList, staffPerformanceList, type StaffItem } from './data'

// 选项
const titleOptions = titleList.map((t) => t.name)
const storeOptions = storeItemList.filter((s) => s.status === 'open').map((s) => s.name)
const serviceOptions = ['肩颈理疗', '腰部推拿', '面部护理', '艾灸理疗', '基础推拿', '足部按摩']

// 筛选
const keyword = ref('')
const titleFilter = ref('')
const storeFilter = ref('')
const statusFilter = ref('')
const query = reactive({ keyword: '', title: '', store: '', status: '' })
const staffData = ref<StaffItem[]>(staffList.map((item) => ({ ...item, services: [...item.services] })))

const filteredList = computed(() =>
    staffData.value
        .filter((item) => {
            const matchKeyword = !query.keyword || item.name.includes(query.keyword) || item.phone.includes(query.keyword)
            const matchTitle = !query.title || item.title === query.title
            const matchStore = !query.store || item.store === query.store
            const matchStatus = !query.status || item.status === query.status
            return matchKeyword && matchTitle && matchStore && matchStatus
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
)
const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.title = titleFilter.value
    query.store = storeFilter.value
    query.status = statusFilter.value
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    titleFilter.value = ''
    storeFilter.value = ''
    statusFilter.value = ''
    Object.assign(query, { keyword: '', title: '', store: '', status: '' })
    pageNo.value = 1
}

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 新增/编辑
const editVisible = ref(false)
const editId = ref<number | null>(null)
const emptyForm = (): Omit<StaffItem, 'id' | 'createdAt'> => ({
    name: '', phone: '', photo: '', title: '', level: 1, store: '',
    workStatus: 'on', status: 'enabled', services: []
})
const form = reactive(emptyForm())

const openEdit = (row?: StaffItem) => {
    editId.value = row?.id ?? null
    if (row) {
        const { id, createdAt, ...rest } = row
        Object.assign(form, { ...rest, services: [...row.services] })
    } else {
        Object.assign(form, emptyForm())
    }
    editVisible.value = true
}
const handlePhotoChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('照片仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('照片大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => { form.photo = String(e.target?.result || '') }
    reader.readAsDataURL(file)
}
const submitEdit = () => {
    if (!form.name.trim()) { ElMessage.warning('请输入姓名'); return }
    if (!form.phone.trim()) { ElMessage.warning('请输入手机号'); return }
    if (!form.title) { ElMessage.warning('请选择职称'); return }
    if (!form.store) { ElMessage.warning('请选择所属门店'); return }
    if (editId.value) {
        const idx = staffData.value.findIndex((s) => s.id === editId.value)
        if (idx > -1) staffData.value[idx] = { ...staffData.value[idx], ...form, services: [...form.services] }
        ElMessage.success('编辑成功')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        staffData.value.push({
            id: Date.now(),
            ...form,
            services: [...form.services],
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('新增成功，员工端可根据手机号识别身份并进入对应工作台')
    }
    editVisible.value = false
}

// 删除
const deleteStaff = (row: StaffItem) => {
    if (row.status === 'enabled') {
        ElMessage.warning('人员正常启用时无法删除，请先停用')
        return
    }
    ElMessageBox.confirm(`确认删除人员「${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
            staffData.value = staffData.value.filter((s) => s.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// 查看绩效
const performanceVisible = ref(false)
const current = ref<StaffItem | null>(null)
const perfMonth = ref('')
const queryPerfMonth = ref('')
const openPerformance = (row: StaffItem) => {
    current.value = row
    perfMonth.value = ''
    queryPerfMonth.value = ''
    performanceVisible.value = true
}
const perfList = computed(() =>
    staffPerformanceList
        .filter((p) => p.staffId === current.value?.id && (!queryPerfMonth.value || p.yearMonth === queryPerfMonth.value))
        .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
)
const handlePerfSearch = () => { queryPerfMonth.value = perfMonth.value }
const resetPerfSearch = () => { perfMonth.value = ''; queryPerfMonth.value = '' }
</script>

<style lang="scss" scoped>
.staff-list-page {
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

.list-card {
    border-radius: 8px;
}

.pagination-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.staff-photo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
}

.staff-form {
    :deep(.el-form-item) {
        margin-bottom: 12px;
    }
}

.photo-upload-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.photo-uploader {
    display: inline-block;
    line-height: 0;

    :deep(.el-upload) {
        display: block;
        line-height: 0;
    }
}

.photo-preview {
    position: relative;
    box-sizing: border-box;
    width: 88px;
    height: 88px;
    overflow: hidden;
    border: 1px solid #e8ebf5;
    border-radius: 50%;
    cursor: pointer;
    line-height: normal;

    .photo-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .photo-mask {
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

    &:hover .photo-mask {
        opacity: 1;
    }
}

.photo-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 88px;
    height: 88px;
    line-height: normal;
    color: #909399;
    border: 1px dashed #dcdfe6;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
    }
}

.photo-tip {
    font-size: 12px;
    color: #909399;
}

.dialog-filter {
    box-shadow: none;
}
</style>
