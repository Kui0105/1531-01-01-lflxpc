<template>
    <div class="performance-page">
        <!-- 账单列表 -->
        <template v-if="!currentBill">
            <!-- 筛选搜索 -->
            <div class="filter-bar">
                <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                <el-select v-model="store" placeholder="门店" clearable class="!w-[150px]">
                    <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
                </el-select>
                <el-date-picker
                    v-model="billMonth"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="账单时间"
                    class="!w-[180px]"
                />
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
                <el-button class="ml-auto" @click="exportBills">导出</el-button>
            </div>

            <el-card class="list-card mt-4" shadow="never">
                <el-table :data="filteredBills" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                    <el-table-column prop="billMonth" label="账单时间" min-width="130" align="center" />
                    <el-table-column prop="store" label="门店" min-width="140" align="center" />
                    <el-table-column label="工资合计" min-width="140" align="center">
                        <template #default="{ row }"><span class="value-net">¥{{ money(row.totalSalary) }}</span></template>
                    </el-table-column>
                    <el-table-column label="门店人数" min-width="120" align="center">
                        <template #default="{ row }">{{ row.staffCount }} 人</template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="openDetail(row)">查看明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </template>

        <!-- 账单明细 -->
        <template v-else>
            <div class="detail-head">
                <el-button link @click="backToList"><el-icon><ArrowLeft /></el-icon>返回账单列表</el-button>
                <span class="detail-title">{{ currentBill.billMonth }} {{ currentBill.store }} - 绩效薪资明细</span>
                <el-button class="ml-auto" @click="exportDetails">导出</el-button>
            </div>

            <el-card class="list-card" shadow="never">
                <el-table :data="detailList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                    <el-table-column prop="name" label="姓名" min-width="100" align="center" />
                    <el-table-column label="职称\职级" min-width="150" align="center">
                        <template #default="{ row }">{{ row.title }} / {{ row.level }}级</template>
                    </el-table-column>
                    <el-table-column label="绩效等级" min-width="110" align="center">
                        <template #default="{ row }">
                            <el-tag :type="perfTagType(row.performanceLevel)" size="small" effect="light">{{ row.performanceLevel }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="基本薪资" min-width="110" align="center">
                        <template #default="{ row }">¥{{ money(row.baseSalary) }}</template>
                    </el-table-column>
                    <el-table-column label="岗位津贴" min-width="110" align="center">
                        <template #default="{ row }">¥{{ money(row.postAllowance) }}</template>
                    </el-table-column>
                    <el-table-column label="绩效奖金" min-width="110" align="center">
                        <template #default="{ row }">¥{{ money(row.performanceBonus) }}</template>
                    </el-table-column>
                    <el-table-column label="超额工时费" min-width="120" align="center">
                        <template #default="{ row }">¥{{ money(row.overtimeFee) }}</template>
                    </el-table-column>
                    <el-table-column label="提成" min-width="100" align="center">
                        <template #default="{ row }">¥{{ money(row.commission) }}</template>
                    </el-table-column>
                    <el-table-column label="合计工资" min-width="120" align="center">
                        <template #default="{ row }"><span class="value-net">¥{{ money(row.totalSalary) }}</span></template>
                    </el-table-column>
                </el-table>
            </el-card>
        </template>
    </div>
</template>

<script lang="ts" setup name="financePerformance">
import { exportCsv } from '@/utils/export-csv'

import { performanceBills, salaryDetails, storeOptions, type PerformanceBill, type SalaryDetail } from './data'

const money = (n: number) => n.toFixed(2)
const perfTagType = (level: string): 'success' | 'primary' | 'warning' | 'info' =>
    level === 'A' ? 'success' : level === 'B' ? 'primary' : level === 'C' ? 'warning' : 'info'

// 筛选（账单列表）
const store = ref('')
const billMonth = ref('')
const query = reactive({ store: '', billMonth: '' })

const filteredBills = computed(() =>
    performanceBills
        .filter((item) => {
            const matchStore = !query.store || item.store === query.store
            const matchMonth = !query.billMonth || item.billMonth === query.billMonth
            return matchStore && matchMonth
        })
        .sort((a, b) => b.billMonth.localeCompare(a.billMonth) || a.store.localeCompare(b.store))
)
const handleSearch = () => {
    query.store = store.value
    query.billMonth = billMonth.value
}
const resetSearch = () => {
    store.value = ''
    billMonth.value = ''
    Object.assign(query, { store: '', billMonth: '' })
}

// 导出账单列表
const billHeaders = ['账单时间', '门店', '工资合计', '门店人数']
const exportBills = () =>
    exportCsv('绩效薪资', billHeaders, filteredBills.value.map((item: PerformanceBill) => [
        item.billMonth, item.store, item.totalSalary, item.staffCount
    ]))

// 账单明细（两级视图）
const currentBill = ref<PerformanceBill | null>(null)
const openDetail = (row: PerformanceBill) => { currentBill.value = row }
const backToList = () => { currentBill.value = null }
const detailList = computed(() =>
    salaryDetails.filter((item) => item.billId === currentBill.value?.id)
)

// 导出明细（所有明细）
const detailHeaders = ['姓名', '职称', '职级', '绩效等级', '基本薪资', '岗位津贴', '绩效奖金', '超额工时费', '提成', '合计工资']
const exportDetails = () =>
    exportCsv(`绩效薪资明细_${currentBill.value?.billMonth}_${currentBill.value?.store}`,
        detailHeaders,
        detailList.value.map((item: SalaryDetail) => [
            item.name, item.title, item.level, item.performanceLevel, item.baseSalary,
            item.postAllowance, item.performanceBonus, item.overtimeFee, item.commission, item.totalSalary
        ]))
</script>

<style lang="scss" scoped>
.performance-page {
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

.detail-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
}

.detail-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.value-net {
    font-weight: 600;
    color: var(--el-color-primary);
}
</style>
