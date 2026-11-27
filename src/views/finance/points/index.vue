<template>
    <div class="point-record-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称/手机号" clearable class="!w-[180px]" />
            <el-select v-model="changeType" placeholder="变动类型" clearable class="!w-[130px]">
                <el-option label="收入" value="income" />
                <el-option label="支出" value="expense" />
            </el-select>
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                class="date-range-picker"
                style="--el-date-editor-daterange-width: 400px; --el-date-editor-width: 400px"
            />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button class="ml-auto" @click="exportData">导出</el-button>
        </div>

        <!-- 列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="serialNo" label="流水编号" min-width="150" align="center" />
                <el-table-column label="用户信息" min-width="150" align="center">
                    <template #default="{ row }">
                        <div>{{ row.nickname }}</div>
                        <div class="cell-sub">{{ row.phone }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="变动类型" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.changeType === 'income' ? 'success' : 'danger'" size="small" effect="light">
                            {{ row.changeType === 'income' ? '收入' : '支出' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="变动值" min-width="100" align="center">
                    <template #default="{ row }">
                        <span :class="row.changeType === 'income' ? 'value-income' : 'value-expense'">
                            {{ row.value > 0 ? '+' : '' }}{{ row.value }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="变动后余额" min-width="110" align="center">
                    <template #default="{ row }">{{ row.balance }}</template>
                </el-table-column>
                <el-table-column label="变动原因" min-width="190" align="center">
                    <template #default="{ row }">
                        <span>{{ row.reason }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="关联订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button v-if="row.orderNo && row.orderNo !== '-'" type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column prop="createdAt" label="变动时间" min-width="150" align="center" />
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

<script lang="ts" setup name="financePoints">
import { useRouter } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import { pointList, type PointRecord } from './data'

const router = useRouter()

// 筛选
const keyword = ref('')
const changeType = ref('')
const dateRange = ref<string[]>([])
const query = reactive({ keyword: '', changeType: '', startDate: '', endDate: '' })

const filteredList = computed(() =>
    pointList
        .filter((item) => {
            const matchKeyword =
                !query.keyword || item.nickname.includes(query.keyword) || item.phone.includes(query.keyword)
            const matchType = !query.changeType || item.changeType === query.changeType
            const day = item.createdAt.slice(0, 10)
            const matchStart = !query.startDate || day >= query.startDate
            const matchEnd = !query.endDate || day <= query.endDate
            return matchKeyword && matchType && matchStart && matchEnd
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.changeType = changeType.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    changeType.value = ''
    dateRange.value = []
    Object.assign(query, { keyword: '', changeType: '', startDate: '', endDate: '' })
    pageNo.value = 1
}

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 导出
const headers = ['流水编号', '用户昵称', '手机号', '变动类型', '变动值', '变动后余额', '变动原因', '关联订单编号', '备注', '变动时间']
const toRow = (item: PointRecord) => [
    item.serialNo,
    item.nickname,
    item.phone,
    item.changeType === 'income' ? '收入' : '支出',
    item.value,
    item.balance,
    item.reason,
    item.orderNo,
    item.remark,
    item.createdAt
]
// 有筛选条件时导出筛选结果，无筛选时导出全部数据
const hasFilter = computed(
    () => !!(query.keyword || query.changeType || query.startDate || query.endDate)
)
const exportData = () => {
    const rows = hasFilter.value ? filteredList.value : pointList
    exportCsv('积分明细', headers, rows.map(toRow))
}

// 点击关联订单编号进入订单详情（GO 商品订单 / SO 服务订单）
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
.point-record-list {
    .el-date-editor--daterange {
        width: 400px !important;
        --el-date-editor-width: 400px;
        --el-date-editor-daterange-width: 400px;
    }
}
</style>
