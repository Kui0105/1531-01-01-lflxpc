<template>
    <div class="bill-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="订单编号" clearable class="!w-[180px]" />
            <el-select v-model="store" placeholder="门店" clearable class="!w-[130px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="flowType" placeholder="收支类型" clearable class="!w-[130px]">
                <el-option v-for="item in flowTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="payMethod" placeholder="支付方式" clearable class="!w-[140px]">
                <el-option v-for="item in payMethodOptions" :key="item" :label="item" :value="item" />
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

        <!-- 汇总数据 -->
        <div class="stat-row">
            <div class="stat-card">
                <div class="stat-label">总收入</div>
                <div class="stat-value income">¥{{ money(summary.income) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">退款金额</div>
                <div class="stat-value refund">¥{{ money(summary.refund) }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">净收入</div>
                <div class="stat-value net">¥{{ money(summary.net) }}</div>
            </div>
        </div>

        <!-- 流水列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="serialNo" label="流水编号" min-width="150" align="center" />
                <el-table-column label="订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" min-width="150" align="center">
                    <template #default="{ row }">
                        <div>{{ row.nickname }}</div>
                        <div class="cell-sub">{{ row.phone }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="store" label="门店" min-width="100" align="center" />
                <el-table-column label="收支类型" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.flowType === 'pay' ? 'success' : 'warning'" size="small" effect="light">
                            {{ row.flowType === 'pay' ? '支付' : '退款' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="payMethod" label="支付方式" min-width="110" align="center" />
                <el-table-column label="金额" min-width="110" align="center">
                    <template #default="{ row }">
                        <span :class="row.flowType === 'pay' ? 'value-income' : 'value-expense'">
                            {{ row.flowType === 'pay' ? '+' : '-' }}¥{{ money(row.amount) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="account" label="到账账户" min-width="120" align="center" />
                <el-table-column prop="createdAt" label="交易时间" min-width="150" align="center" />
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagType(row.status)" size="small" effect="light">
                            {{ statusLabel(row.status) }}
                        </el-tag>
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
    </div>
</template>

<script lang="ts" setup name="financeBill">
import { useRouter } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import { billList, flowTypeOptions, payMethodOptions, storeOptions, type BillRecord, type BillStatus } from './data'

const router = useRouter()

// 筛选
const keyword = ref('')
const store = ref('')
const flowType = ref('')
const payMethod = ref('')
const dateRange = ref<string[]>([])
const query = reactive({ keyword: '', store: '', flowType: '', payMethod: '', startDate: '', endDate: '' })

const filteredList = computed(() =>
    billList
        .filter((item) => {
            const matchKeyword = !query.keyword || item.orderNo.includes(query.keyword)
            const matchStore = !query.store || item.store === query.store
            const matchType = !query.flowType || item.flowType === query.flowType
            const matchPay = !query.payMethod || item.payMethod === query.payMethod
            const day = item.createdAt.slice(0, 10)
            const matchStart = !query.startDate || day >= query.startDate
            const matchEnd = !query.endDate || day <= query.endDate
            return matchKeyword && matchStore && matchType && matchPay && matchStart && matchEnd
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.store = store.value
    query.flowType = flowType.value
    query.payMethod = payMethod.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    store.value = ''
    flowType.value = ''
    payMethod.value = ''
    dateRange.value = []
    Object.assign(query, { keyword: '', store: '', flowType: '', payMethod: '', startDate: '', endDate: '' })
    pageNo.value = 1
}

// 汇总数据（基于筛选结果）
const summary = computed(() => {
    const rows = filteredList.value
    const income = rows.filter((r) => r.flowType === 'pay' && r.status === 'success').reduce((s, r) => s + r.amount, 0)
    const refund = rows.filter((r) => r.flowType === 'refund' && r.status === 'success').reduce((s, r) => s + r.amount, 0)
    return { income, refund, net: income - refund }
})

const money = (n: number) => n.toFixed(2)

const statusLabel = (s: BillStatus) => ({ success: '成功', processing: '处理中', failed: '失败' })[s]
const statusTagType = (s: BillStatus): 'success' | 'warning' | 'danger' =>
    s === 'success' ? 'success' : s === 'processing' ? 'warning' : 'danger'

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 导出：按门店与时间段
const headers = ['流水编号', '订单编号', '用户昵称', '手机号', '门店', '收支类型', '支付方式', '金额', '到账账户', '交易时间', '状态']
const toRow = (item: BillRecord) => [
    item.serialNo,
    item.orderNo,
    item.nickname,
    item.phone,
    item.store,
    item.flowType === 'pay' ? '支付' : '退款',
    item.payMethod,
    item.amount,
    item.account,
    item.createdAt,
    statusLabel(item.status)
]
const exportData = () => {
    const rows = filteredList.value
    const suffix = query.store ? `_${query.store}` : ''
    exportCsv(`流水账单${suffix}`, headers, rows.map(toRow))
}

// 点击订单编号跳转对应订单详情（GO 商品订单 / SO 服务订单）
const openOrderDetail = (orderNo: string) => {
    const path = orderNo.startsWith('GO') ? '/order/goods' : orderNo.startsWith('SO') ? '/order/service' : ''
    if (!path) return
    router.push({ path, query: { orderNo } })
}
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

.stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 14px;
}

.stat-card {
    padding: 16px 20px;
    background: #fff;
    border: 1px solid #e8ebf5;
    border-radius: 8px;
}

.stat-label {
    margin-bottom: 8px;
    font-size: 13px;
    color: #909399;
}

.stat-value {
    font-size: 22px;
    font-weight: 600;

    &.income { color: #67c23a; }
    &.refund { color: #f56c6c; }
    &.net { color: var(--el-color-primary); }
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
    margin-top: 2px;
    font-size: 12px;
    color: #909399;
}

.value-income {
    font-weight: 600;
    color: #67c23a;
}

.value-expense {
    font-weight: 600;
    color: #f56c6c;
}

</style>

<!-- 全局样式：Element Plus 日期组件宽度由内部 CSS 变量控制，需非 scoped 命中真实 DOM -->
<style lang="scss">
.bill-page {
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
