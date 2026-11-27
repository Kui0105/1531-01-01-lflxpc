<template>
    <div class="freight-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="模板名称" clearable class="!w-[220px]" />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" class="ml-auto" @click="openEdit()">新增运费模板</el-button>
        </div>

        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="name" label="模板名称" min-width="150" align="center" />
                <el-table-column label="计费方式" min-width="120" align="center">
                    <template #default="{ row }">{{ billingLabel(row.billingType) }}</template>
                </el-table-column>
                <el-table-column label="配置区域及运费" min-width="260" align="center">
                    <template #default="{ row }">
                        <div v-for="item in row.regions" :key="item.region" class="region-row">
                            {{ item.region }}：¥{{ item.fee }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="指定区域包邮" min-width="130" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.freeShipRegions.length ? 'success' : 'info'" size="small" effect="light">
                            {{ row.freeShipRegions.length ? row.freeShipRegions.join('、') : '无' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="指定不送达区域" min-width="160" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.unDeliveryRegions.length" type="danger" size="small" effect="light">
                            {{ row.unDeliveryRegions.join('、') }}
                        </el-tag>
                        <span v-else class="cell-sub">无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" min-width="80" align="center" />
                <el-table-column label="操作" min-width="140" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteTemplate(row)">删除</el-button>
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

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editId ? '编辑运费模板' : '新增运费模板'" width="760px" :close-on-click-modal="false">
            <el-form :model="form" label-width="130px" class="freight-form">
                <el-form-item label="模板名称">
                    <el-input v-model="form.name" placeholder="请输入模板名称" />
                </el-form-item>
                <el-form-item label="计费方式">
                    <el-radio-group v-model="form.billingType">
                        <el-radio value="weight">按重量计费</el-radio>
                        <el-radio value="quantity">按件数计费</el-radio>
                        <el-radio value="fixed">固定运费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="配置区域及运费">
                    <div class="region-config">
                        <div v-for="(item, index) in form.regions" :key="index" class="region-config-row">
                            <el-select v-model="item.region" placeholder="选择区域" class="region-select">
                                <el-option v-for="r in regionOptions" :key="r" :label="r" :value="r" />
                            </el-select>
                            <el-input-number v-model="item.fee" :min="0" :precision="2" class="region-fee" controls-position="right" />
                            <span class="region-unit">元</span>
                            <el-button type="danger" link size="small" @click="removeRegion(index)">删除</el-button>
                        </div>
                        <el-button type="primary" link size="small" @click="addRegion">+ 添加区域</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="指定区域包邮">
                    <el-select v-model="form.freeShipRegions" multiple placeholder="选择包邮区域" class="!w-full">
                        <el-option v-for="r in regionOptions" :key="r" :label="r" :value="r" />
                    </el-select>
                </el-form-item>
                <el-form-item label="指定不送达区域">
                    <el-select v-model="form.unDeliveryRegions" multiple placeholder="选择不送达区域" class="!w-full">
                        <el-option v-for="r in regionOptions" :key="r" :label="r" :value="r" />
                    </el-select>
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

<script lang="ts" setup name="webFreightTemplate">
import { ElMessage, ElMessageBox } from 'element-plus'

type BillingType = 'weight' | 'quantity' | 'fixed'
interface RegionFee { region: string; fee: number }
interface FreightTemplate {
    id: number
    name: string
    billingType: BillingType
    regions: RegionFee[]
    freeShipRegions: string[]
    unDeliveryRegions: string[]
    sort: number
}

const STORAGE_KEY = 'website_freight_templates'
const regionOptions = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省', '湖北省', '其他地区']

const billingLabel = (t: BillingType) => ({ weight: '按重量计费', quantity: '按件数计费', fixed: '固定运费' })[t]

const templateList = ref<FreightTemplate[]>([
    { id: 1, name: '全国通用', billingType: 'fixed', regions: [{ region: '其他地区', fee: 10 }], freeShipRegions: ['北京市', '上海市'], unDeliveryRegions: [], sort: 10 },
    { id: 2, name: '广东省内专享', billingType: 'quantity', regions: [{ region: '广东省', fee: 5 }], freeShipRegions: ['广东省'], unDeliveryRegions: ['其他地区'], sort: 20 },
    { id: 3, name: '偏远地区加收', billingType: 'weight', regions: [{ region: '四川省', fee: 15 }, { region: '湖北省', fee: 12 }], freeShipRegions: [], unDeliveryRegions: [], sort: 5 }
])

// 筛选
const keyword = ref('')
const query = ref('')
const filteredList = computed(() =>
    [...templateList.value]
        .filter((item) => !query.value || item.name.includes(query.value))
        .sort((a, b) => b.sort - a.sort)
)
const handleSearch = () => { query.value = keyword.value.trim(); pageNo.value = 1 }
const resetSearch = () => { keyword.value = ''; query.value = ''; pageNo.value = 1 }

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 新增/编辑
const editVisible = ref(false)
const editId = ref<number | null>(null)
const emptyForm = (): Omit<FreightTemplate, 'id'> => ({
    name: '', billingType: 'fixed', regions: [{ region: '', fee: 0 }], freeShipRegions: [], unDeliveryRegions: [], sort: 10
})
const form = reactive(emptyForm())

const openEdit = (row?: FreightTemplate) => {
    editId.value = row?.id ?? null
    if (row) {
        Object.assign(form, {
            name: row.name, billingType: row.billingType,
            regions: row.regions.map((r) => ({ ...r })),
            freeShipRegions: [...row.freeShipRegions],
            unDeliveryRegions: [...row.unDeliveryRegions],
            sort: row.sort
        })
    } else {
        Object.assign(form, emptyForm())
    }
    editVisible.value = true
}
const addRegion = () => form.regions.push({ region: '', fee: 0 })
const removeRegion = (index: number) => form.regions.splice(index, 1)

const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(templateList.value))
const submitEdit = () => {
    if (!form.name.trim()) { ElMessage.warning('请输入模板名称'); return }
    if (!form.regions.length || form.regions.some((r) => !r.region)) {
        ElMessage.warning('请完整配置区域及运费')
        return
    }
    const payload: Omit<FreightTemplate, 'id'> = {
        name: form.name.trim(),
        billingType: form.billingType,
        regions: form.regions.map((r) => ({ ...r })),
        freeShipRegions: [...form.freeShipRegions],
        unDeliveryRegions: [...form.unDeliveryRegions],
        sort: form.sort
    }
    if (editId.value) {
        const idx = templateList.value.findIndex((t) => t.id === editId.value)
        if (idx > -1) templateList.value[idx] = { ...templateList.value[idx], ...payload }
        ElMessage.success('编辑成功')
    } else {
        templateList.value.push({ id: Date.now(), ...payload })
        ElMessage.success('新增成功')
    }
    persist()
    editVisible.value = false
}
const deleteTemplate = (row: FreightTemplate) => {
    ElMessageBox.confirm(`确认删除运费模板「${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
            templateList.value = templateList.value.filter((t) => t.id !== row.id)
            persist()
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}

// 加载本地数据
const load = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) templateList.value = JSON.parse(saved)
    } catch {
        // 使用默认数据
    }
}
load()
</script>

<style lang="scss" scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid #e8ebf5;
    border-radius: 8px;
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
.list-card { border-radius: 8px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
.cell-sub { font-size: 12px; color: #909399; }
.region-row { line-height: 1.8; }
.freight-form {
    :deep(.el-form-item) { margin-bottom: 16px; }
}
.region-config {
    width: 100%;
    .region-config-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }
    .region-select { width: 220px; }
    .region-fee { width: 160px; }
    .region-unit { color: #606266; }
}
</style>
