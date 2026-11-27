<template>
    <div class="store-page">
        <!-- 账户列表 -->
        <template v-if="!currentStore">
            <!-- 筛选搜索 -->
            <div class="filter-bar">
                <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                <el-date-picker
                    v-model="billMonth"
                    type="month"
                    value-format="YYYY-MM"
                    placeholder="账单时间"
                    class="!w-[200px]"
                />
                <el-button type="primary" @click="handleMonthSearch">查询</el-button>
                <el-button @click="resetMonthSearch">重置</el-button>
            </div>

            <el-card class="list-card mt-4" shadow="never">
                <el-table :data="filteredAccounts" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                    <el-table-column prop="billMonth" label="账单时间" min-width="120" align="center" />
                    <el-table-column prop="store" label="门店名称" min-width="140" align="center" />
                    <el-table-column label="本月收入" min-width="130" align="center">
                        <template #default="{ row }"><span class="value-income">¥{{ money(row.monthIncome) }}</span></template>
                    </el-table-column>
                    <el-table-column label="本月退款" min-width="130" align="center">
                        <template #default="{ row }"><span class="value-expense">¥{{ money(row.monthRefund) }}</span></template>
                    </el-table-column>
                    <el-table-column label="本月净收入" min-width="130" align="center">
                        <template #default="{ row }"><span class="value-net">¥{{ money(row.monthNet) }}</span></template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="openDetail(row.store)">查看明细</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </template>

        <!-- 账户明细 -->
        <template v-else>
            <div class="detail-head">
                <el-button link @click="backToList"><el-icon><ArrowLeft /></el-icon>返回账户列表</el-button>
                <span class="detail-title">{{ currentStore }} - 账户明细</span>
            </div>

            <!-- 筛选搜索 -->
            <div class="filter-bar">
                <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
                <el-select v-model="flowType" placeholder="收支类型" clearable class="!w-[130px]">
                    <el-option label="支付" value="pay" />
                    <el-option label="退款" value="refund" />
                </el-select>
                <div class="date-range-wrap">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        unlink-panels
                    />
                </div>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
                <el-button class="ml-auto" @click="exportData">导出</el-button>
            </div>

            <el-card class="list-card mt-4" shadow="never">
                <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                    <el-table-column prop="serialNo" label="流水编号" min-width="150" align="center" />
                    <el-table-column label="订单编号" min-width="150" align="center">
                        <template #default="{ row }">
                            <el-button type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="收支类型" min-width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.flowType === 'pay' ? 'success' : 'warning'" size="small" effect="light">
                                {{ row.flowType === 'pay' ? '支付' : '退款' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="110" align="center">
                        <template #default="{ row }">
                            <span :class="row.flowType === 'pay' ? 'value-income' : 'value-expense'">
                                {{ row.flowType === 'pay' ? '+' : '-' }}¥{{ money(row.amount) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="arriveTime" label="到账时间" min-width="150" align="center" />
                    <el-table-column prop="remark" label="备注" min-width="200" align="center" show-overflow-tooltip />
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
        </template>
    </div>
</template>

<script lang="ts" setup name="financeStore">
import { useRouter } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import { storeAccounts, storeFlows, type StoreFlow } from './data'

const router = useRouter()

const money = (n: number) => n.toFixed(2)

// 筛选（账户列表 - 账单时间年月）
const billMonth = ref('')
const queryMonth = ref('')
const filteredAccounts = computed(() =>
    storeAccounts
        .filter((item) => !queryMonth.value || item.billMonth === queryMonth.value)
        .sort((a, b) => b.billMonth.localeCompare(a.billMonth) || a.store.localeCompare(b.store))
)
const handleMonthSearch = () => {
    queryMonth.value = billMonth.value
}
const resetMonthSearch = () => {
    billMonth.value = ''
    queryMonth.value = ''
}

// 明细视图
const currentStore = ref('')
const openDetail = (store: string) => {
    currentStore.value = store
    resetSearch()
}
const backToList = () => {
    currentStore.value = ''
}

// 筛选（账户明细）
const flowType = ref('')
const dateRange = ref<string[]>([])
const query = reactive({ flowType: '', startDate: '', endDate: '' })

const filteredList = computed(() =>
    storeFlows
        .filter((item) => {
            const matchStore = item.store === currentStore.value
            const matchType = !query.flowType || item.flowType === query.flowType
            const day = item.arriveTime.slice(0, 10)
            const matchStart = !query.startDate || day >= query.startDate
            const matchEnd = !query.endDate || day <= query.endDate
            return matchStore && matchType && matchStart && matchEnd
        })
        .sort((a, b) => b.arriveTime.localeCompare(a.arriveTime))
)

const handleSearch = () => {
    query.flowType = flowType.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
    pageNo.value = 1
}
const resetSearch = () => {
    flowType.value = ''
    dateRange.value = []
    Object.assign(query, { flowType: '', startDate: '', endDate: '' })
    pageNo.value = 1
}

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 导出：按门店与时间段
const headers = ['流水编号', '门店', '订单编号', '收支类型', '金额', '到账时间', '备注']
const toRow = (item: StoreFlow) => [
    item.serialNo,
    item.store,
    item.orderNo,
    item.flowType === 'pay' ? '支付' : '退款',
    item.amount,
    item.arriveTime,
    item.remark
]
const exportData = () => exportCsv(`门店流水_${currentStore.value}`, headers, filteredList.value.map(toRow))

// 点击订单编号跳转对应订单详情（GO 商品订单 / SO 服务订单）
const openOrderDetail = (orderNo: string) => {
    const path = orderNo.startsWith('GO') ? '/order/goods' : orderNo.startsWith('SO') ? '/order/service' : ''
    if (!path) return
    router.push({ path, query: { orderNo } })
}
</script>

<style lang="scss" scoped>
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

.pagination-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.value-income {
    font-weight: 600;
    color: #67c23a;
}

.value-expense {
    font-weight: 600;
    color: #f56c6c;
}

.value-net {
    font-weight: 600;
    color: var(--el-color-primary);
}
</style>

<!-- 全局样式：Element Plus 日期组件宽度由内部 CSS 变量控制，需非 scoped 命中真实 DOM -->
<style lang="scss">
.store-page {
    .date-range-wrap {
        width: 400px;
        flex: 0 0 400px;

        .el-date-editor--daterange,
        .el-date-editor.el-input__wrapper {
            width: 400px !important;
            --el-date-editor-width: 400px;
            --el-date-editor-daterange-width: 400px;
        }
    }
}
</style>
