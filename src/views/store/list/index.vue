<template>
    <div class="store-list-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="门店名称" clearable class="!w-[200px]" />
            <el-select v-model="status" placeholder="营业状态" clearable class="!w-[140px]">
                <el-option label="营业中" value="open" />
                <el-option label="已停用" value="closed" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" class="ml-auto" @click="openEdit()">新增门店</el-button>
        </div>

        <!-- 门店列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="name" label="门店名称" min-width="130" align="center" />
                <el-table-column label="封面图" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-image v-if="row.cover" :src="row.cover" :preview-src-list="[row.cover]" class="store-cover" fit="cover" preview-teleported />
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" min-width="130" align="center" />
                <el-table-column prop="businessHours" label="营业时间" min-width="120" align="center" />
                <el-table-column prop="region" label="省市区" min-width="160" align="center" show-overflow-tooltip />
                <el-table-column prop="address" label="详细地址" min-width="180" align="center" show-overflow-tooltip />
                <el-table-column label="门店账户" min-width="120" align="center">
                    <template #default="{ row }"><span class="cell-sub">{{ row.account || '第三方资料待确认' }}</span></template>
                </el-table-column>
                <el-table-column label="营业状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'open' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'open' ? '营业中' : '已停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="280" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                        <el-button :type="row.status === 'open' ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">
                            {{ row.status === 'open' ? '停用' : '启用' }}
                        </el-button>
                        <el-button type="danger" link size="small" @click="deleteStore(row)">删除</el-button>
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

        <!-- 新增/编辑门店弹窗 -->
        <el-dialog v-model="editVisible" :title="editId ? '编辑门店' : '新增门店'" width="900px" :close-on-click-modal="false">
            <el-form :model="form" label-width="100px" class="store-form">
                <el-divider content-position="left">基础信息</el-divider>
                <el-row :gutter="12">
                    <el-col :span="12">
                        <el-form-item label="门店名称"><el-input v-model="form.name" placeholder="请输入门店名称" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话"><el-input v-model="form.phone" placeholder="请输入联系电话" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="营业时间"><el-input v-model="form.businessHours" placeholder="如 09:00-21:00" /></el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="省市区">
                            <el-select v-model="form.region" placeholder="请选择省市区" class="!w-full">
                                <el-option v-for="item in regionOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="详细地址">
                            <el-input v-model="form.address" placeholder="请输入详细地址">
                                <template #append><el-button @click="locateAddress">地图定位</el-button></template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="封面图/轮播图">
                            <el-upload accept=".png,.jpg,.jpeg" :auto-upload="false" :show-file-list="false" :on-change="handleCoverChange" action="#">
                                <div v-if="form.cover" class="cover-preview">
                                    <img :src="form.cover" class="cover-img" />
                                    <div class="cover-mask">点击更换</div>
                                </div>
                                <div v-else class="cover-placeholder">
                                    <el-icon :size="24"><Plus /></el-icon>
                                    <div>点击上传封面图</div>
                                    <div class="cover-tip">支持 PNG/JPG，不超过 2MB</div>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">门店信息</el-divider>
                <el-row :gutter="12">
                    <el-col :span="12"><el-form-item label="休息区域"><el-input v-model="form.restArea" placeholder="请输入休息区域" /></el-form-item></el-col>
                    <el-col :span="12"><el-form-item label="特色设备"><el-input v-model="form.features" placeholder="请输入特色设备" /></el-form-item></el-col>
                    <el-col :span="24"><el-form-item label="预约方式"><el-input v-model="form.bookingMethod" placeholder="请输入预约方式" /></el-form-item></el-col>
                </el-row>

                <el-divider content-position="left">门店目标</el-divider>
                <el-row :gutter="12">
                    <el-col :span="8"><el-form-item label="产值目标"><el-input-number v-model="form.outputTarget" :min="0" class="!w-full" /></el-form-item></el-col>
                    <el-col :span="8"><el-form-item label="营收目标"><el-input-number v-model="form.revenueTarget" :min="0" class="!w-full" /></el-form-item></el-col>
                    <el-col :span="8"><el-form-item label="月净利润目标"><el-input-number v-model="form.profitTarget" :min="0" class="!w-full" /></el-form-item></el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>

        <!-- 查看详情弹窗 -->
        <el-dialog v-model="detailVisible" title="门店详情" width="760px">
            <div v-if="current" class="detail-content">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="门店名称">{{ current.name }}</el-descriptions-item>
                    <el-descriptions-item label="营业状态">{{ current.status === 'open' ? '营业中' : '已停用' }}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{ current.phone }}</el-descriptions-item>
                    <el-descriptions-item label="营业时间">{{ current.businessHours }}</el-descriptions-item>
                    <el-descriptions-item label="省市区">{{ current.region }}</el-descriptions-item>
                    <el-descriptions-item label="详细地址">{{ current.address }}</el-descriptions-item>
                    <el-descriptions-item label="经纬度">{{ current.latitude }}, {{ current.longitude }}</el-descriptions-item>
                    <el-descriptions-item label="门店账户">{{ current.account || '第三方资料待确认' }}</el-descriptions-item>
                    <el-descriptions-item label="休息区域">{{ current.restArea || '-' }}</el-descriptions-item>
                    <el-descriptions-item label="特色设备">{{ current.features || '-' }}</el-descriptions-item>
                    <el-descriptions-item label="预约方式">{{ current.bookingMethod || '-' }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ current.createdAt }}</el-descriptions-item>
                </el-descriptions>
                <el-divider content-position="left">门店目标</el-divider>
                <el-descriptions :column="3" border>
                    <el-descriptions-item label="产值目标">¥{{ current.outputTarget }}</el-descriptions-item>
                    <el-descriptions-item label="营收目标">¥{{ current.revenueTarget }}</el-descriptions-item>
                    <el-descriptions-item label="每月净利润目标">¥{{ current.profitTarget }}</el-descriptions-item>
                </el-descriptions>
                <div v-if="current.cover" class="detail-cover">
                    <div class="detail-cover-label">门店封面图</div>
                    <el-image :src="current.cover" :preview-src-list="[current.cover]" class="detail-cover-img" fit="cover" preview-teleported />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="storeList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { storeItemList, regionOptions, type StoreItem, type StoreStatus } from './data'

// 筛选
const keyword = ref('')
const status = ref('')
const query = reactive({ keyword: '', status: '' })
const storeData = ref<StoreItem[]>(storeItemList.map((item) => ({ ...item, slides: [...item.slides] })))

const filteredList = computed(() =>
    storeData.value
        .filter((item) => {
            const matchKeyword = !query.keyword || item.name.includes(query.keyword)
            const matchStatus = !query.status || item.status === query.status
            return matchKeyword && matchStatus
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
)
const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.status = status.value
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    status.value = ''
    Object.assign(query, { keyword: '', status: '' })
    pageNo.value = 1
}

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 新增/编辑
const editVisible = ref(false)
const editId = ref<number | null>(null)
const emptyForm = (): Omit<StoreItem, 'id' | 'createdAt'> => ({
    name: '', cover: '', slides: [], phone: '', businessHours: '', region: '', address: '',
    latitude: 0, longitude: 0, account: '', status: 'open',
    restArea: '', features: '', bookingMethod: '',
    outputTarget: 0, revenueTarget: 0, profitTarget: 0
})
const form = reactive(emptyForm())

const openEdit = (row?: StoreItem) => {
    editId.value = row?.id ?? null
    if (row) {
        const { id, createdAt, ...rest } = row
        Object.assign(form, { ...rest, slides: [...row.slides] })
    } else {
        Object.assign(form, emptyForm())
    }
    editVisible.value = true
}
const handleCoverChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('封面图仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('封面图大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => { form.cover = String(e.target?.result || '') }
    reader.readAsDataURL(file)
}
// 地图定位（演示：对接第三方地图 API 后填充经纬度）
const locateAddress = () => {
    if (!form.address.trim()) {
        ElMessage.warning('请先填写详细地址')
        return
    }
    form.latitude = 23.1291
    form.longitude = 113.2644
    ElMessage.success('已获取经纬度（演示数据）')
}
const submitEdit = () => {
    if (!form.name.trim()) { ElMessage.warning('请输入门店名称'); return }
    if (!form.phone.trim()) { ElMessage.warning('请输入联系电话'); return }
    if (editId.value) {
        const idx = storeData.value.findIndex((s) => s.id === editId.value)
        if (idx > -1) storeData.value[idx] = { ...storeData.value[idx], ...form, slides: [...form.slides] }
        ElMessage.success('编辑成功')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        storeData.value.push({
            id: Date.now(),
            ...form,
            slides: [...form.slides],
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('新增成功，用户端门店列表与预约门店选择已同步展示')
    }
    editVisible.value = false
}

// 查看详情
const detailVisible = ref(false)
const current = ref<StoreItem | null>(null)
const openDetail = (row: StoreItem) => {
    current.value = row
    detailVisible.value = true
}

// 启用/停用
const toggleStatus = (row: StoreItem) => {
    const target: StoreStatus = row.status === 'open' ? 'closed' : 'open'
    const action = target === 'closed' ? '停用' : '启用'
    ElMessageBox.confirm(`确认${action}门店「${row.name}」？${target === 'closed' ? '停用后用户端不可切换与预约该门店。' : ''}`, `${action}二次确认`, { type: 'warning' })
        .then(() => {
            row.status = target
            ElMessage.success(`已${action}`)
        })
        .catch(() => {})
}

// 删除
const deleteStore = (row: StoreItem) => {
    ElMessageBox.confirm(`确认删除门店「${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
            storeData.value = storeData.value.filter((s) => s.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.store-list-page {
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

.store-cover {
    width: 70px;
    height: 44px;
    border-radius: 4px;
}

.store-form {
    :deep(.el-form-item) {
        margin-bottom: 14px;
    }
}

.cover-preview {
    position: relative;
    width: 160px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
    cursor: pointer;

    .cover-img { width: 100%; height: 100%; object-fit: cover; }
    .cover-mask {
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
    &:hover .cover-mask { opacity: 1; }
}

.cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 100px;
    color: #909399;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    &:hover { border-color: var(--el-color-primary); color: var(--el-color-primary); }
    .cover-tip { margin-top: 4px; font-size: 11px; }
}

.detail-content {
    .detail-cover {
        margin-top: 16px;
        .detail-cover-label { margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #303133; }
        .detail-cover-img { width: 240px; height: 144px; border-radius: 6px; }
    }
}
</style>
