<template>
    <div class="commission-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称/手机号" clearable class="!w-[180px]" />
            <el-select v-model="commissionType" placeholder="佣金类型" clearable class="!w-[130px]">
                <el-option v-for="item in commissionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="status" placeholder="结算状态" clearable class="!w-[130px]">
                <el-option v-for="item in settleStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
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

        <!-- 佣金明细列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="serialNo" label="明细编号" min-width="150" align="center" />
                <el-table-column label="推广用户" min-width="150" align="center">
                    <template #default="{ row }">
                        <div>{{ row.nickname }}</div>
                        <div class="cell-sub">{{ row.phone }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="来源订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="分销等级" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" effect="plain">{{ row.level }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="返利比例" min-width="100" align="center">
                    <template #default="{ row }">{{ row.rate }}%</template>
                </el-table-column>
                <el-table-column label="佣金金额" min-width="110" align="center">
                    <template #default="{ row }"><span class="commission-amount">¥{{ money(row.amount) }}</span></template>
                </el-table-column>
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagType(row.status)" size="small" effect="light">
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="settleTime" label="结算时间" min-width="150" align="center" />
                <el-table-column prop="remark" label="备注" min-width="220" align="center" show-overflow-tooltip />
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

<script lang="ts" setup name="financeCommission">
import { useRouter } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import {
    commissionList,
    commissionTypeOptions,
    settleStatusOptions,
    type CommissionRecord,
    type SettleStatus
} from './data'

const router = useRouter()

// 筛选
const keyword = ref('')
const commissionType = ref('')
const status = ref('')
const dateRange = ref<string[]>([])
const query = reactive({ keyword: '', commissionType: '', status: '', startDate: '', endDate: '' })

const filteredList = computed(() =>
    commissionList
        .filter((item) => {
            const matchKeyword =
                !query.keyword || item.nickname.includes(query.keyword) || item.phone.includes(query.keyword)
            const matchType = !query.commissionType || item.commissionType === query.commissionType
            const matchStatus = !query.status || item.status === query.status
            const day = item.settleTime.slice(0, 10)
            const matchStart = !query.startDate || day >= query.startDate
            const matchEnd = !query.endDate || day <= query.endDate
            return matchKeyword && matchType && matchStatus && matchStart && matchEnd
        })
        .sort((a, b) => b.settleTime.localeCompare(a.settleTime))
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.commissionType = commissionType.value
    query.status = status.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    commissionType.value = ''
    status.value = ''
    dateRange.value = []
    Object.assign(query, { keyword: '', commissionType: '', status: '', startDate: '', endDate: '' })
    pageNo.value = 1
}

const money = (n: number) => n.toFixed(2)
const statusLabel = (s: SettleStatus) => ({ pending: '待到账', settled: '已到账', invalid: '已失效' })[s]
const statusTagType = (s: SettleStatus): 'warning' | 'success' | 'info' =>
    s === 'pending' ? 'warning' : s === 'settled' ? 'success' : 'info'

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 导出：按筛选条件
const headers = ['明细编号', '推广用户', '手机号', '来源订单编号', '分销等级', '返利比例', '佣金金额', '状态', '结算时间', '备注']
const toRow = (item: CommissionRecord) => [
    item.serialNo,
    item.nickname,
    item.phone,
    item.orderNo,
    item.level,
    `${item.rate}%`,
    item.amount,
    statusLabel(item.status),
    item.settleTime,
    item.remark
]
const exportData = () => exportCsv('佣金明细', headers, filteredList.value.map(toRow))

// 点击来源订单编号跳转对应订单详情（GO 商品订单 / SO 服务订单）
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

.commission-amount {
    font-weight: 600;
    color: var(--el-color-primary);
}
</style>

<!-- 全局样式：Element Plus 日期组件宽度由内部 CSS 变量控制，需非 scoped 命中真实 DOM -->
<style lang="scss">
.commission-page {
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
