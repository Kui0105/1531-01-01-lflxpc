<template>
    <div class="service-order-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称" clearable class="!w-[160px]" />
            <el-input v-model="mobile" placeholder="手机号" clearable class="!w-[160px]" />
            <el-select v-model="store" placeholder="门店" clearable class="!w-[130px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="orderType" placeholder="订单类型" clearable class="!w-[130px]">
                <el-option label="评估订单" value="assess" />
                <el-option label="服务订单" value="service" />
            </el-select>
            <el-select v-model="status" placeholder="状态" clearable class="!w-[140px]">
                <el-option
                    v-for="tab in statusTabs.filter((item) => item.value)"
                    :key="tab.value"
                    :label="tab.label"
                    :value="tab.value"
                />
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
            <el-button class="ml-auto" @click="exportList">导出</el-button>
        </div>

        <!-- 状态TAB + 列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-tabs v-model="activeTab">
                <el-tab-pane
                    v-for="tab in statusTabs"
                    :key="tab.value"
                    :label="tab.label"
                    :name="tab.value"
                />
            </el-tabs>

            <el-table class="order-table" :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openDetail(row)">{{ row.orderNo }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" min-width="105" align="center">
                    <template #default="{ row }">
                        <el-tag :type="orderTypeTagTypes[row.orderType as OrderType]" size="small" effect="light">
                            {{ orderTypeLabels[row.orderType as OrderType] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" min-width="250" align="center">
                    <template #default="{ row }">
                        <div class="user-cell">
                            <span class="avatar" :style="{ background: row.avatarColor }">
                                {{ row.nickname.charAt(0) }}
                            </span>
                            <span class="user-text">{{ row.nickname }} / {{ row.mobile }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单信息" min-width="220" align="center">
                    <template #default="{ row }">
                        <div class="order-info-cell">
                            <span class="service-image" :style="{ background: row.avatarColor }">
                                {{ row.serviceName.charAt(0) }}
                            </span>
                            <div class="cell-lines">
                                <span>{{ row.serviceName }}</span>
                                <span class="cell-sub">¥{{ money(row.price) }} × {{ row.quantity }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="优惠信息" min-width="170" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>会员折扣 ¥{{ money(row.memberDiscount) }}</span>
                            <span class="cell-sub">
                                券 ¥{{ money(row.couponDiscount) }} / 积分 ¥{{ money(row.pointDiscount) }}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="支付信息" min-width="140" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>订单 ¥{{ money(row.totalAmount) }}</span>
                            <span class="cell-sub">实付 ¥{{ money(row.paidAmount) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" min-width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagTypes[row.status as OrderStatus]" size="small" effect="light">
                            {{ statusLabels[row.status as OrderStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="核销进度" min-width="110" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'verify-active': row.verifyCount > 0 }">
                            {{ row.verifyCount }} / {{ row.totalCount }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderTime" label="下单时间" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column label="操作" min-width="140" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openDetail(row)">详情</el-button>
                        <el-button type="primary" link size="small" @click="openVerify(row)">核销记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 订单详情 -->
        <el-drawer v-model="detailVisible" size="760px">
            <template #header>
                <span class="header-title">订单详情 - {{ currentItem?.orderNo }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">订单信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">订单编号</span><span class="info-value">{{ currentItem.orderNo }}</span></div>
                        <div class="info-item"><span class="info-label">订单类型</span><span class="info-value">{{ orderTypeLabels[currentItem.orderType] }}</span></div>
                        <div class="info-item"><span class="info-label">订单状态</span><span class="info-value">{{ statusLabels[currentItem.status] }}</span></div>
                        <div class="info-item"><span class="info-label">支付状态</span><span class="info-value">{{ payStatusLabels[currentItem.payStatus] }}</span></div>
                        <div class="info-item"><span class="info-label">服务名称</span><span class="info-value">{{ currentItem.serviceName }}</span></div>
                        <div class="info-item"><span class="info-label">用户昵称</span><span class="info-value">{{ currentItem.nickname }}</span></div>
                        <div class="info-item"><span class="info-label">真实姓名</span><span class="info-value">{{ currentItem.realName || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">联系电话</span><span class="info-value">{{ currentItem.mobile }}</span></div>
                        <div class="info-item"><span class="info-label">下单时间</span><span class="info-value">{{ currentItem.orderTime }}</span></div>
                        <div class="info-item"><span class="info-label">支付时间</span><span class="info-value">{{ currentItem.payTime || '-' }}</span></div>
                        <template v-if="currentItem.orderType === 'assess'">
                            <div class="info-item"><span class="info-label">渠道来源</span><span class="info-value">{{ currentItem.channel || '-' }}</span></div>
                            <div class="info-item"><span class="info-label">第三方券码</span><span class="info-value">{{ currentItem.voucherCode || '-' }}</span></div>
                        </template>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">项目信息</span></template>
                    <div class="project-info">
                        <div class="project-cover" :style="{ background: currentItem.avatarColor }">
                            {{ currentItem.serviceName.charAt(0) }}
                        </div>
                        <div class="project-detail">
                            <div class="project-name">{{ currentItem.serviceName }}</div>
                            <div class="project-meta">单价 ¥{{ money(currentItem.price) }} × 数量 {{ currentItem.quantity }}</div>
                        </div>
                        <div class="project-amount">项目总价 ¥{{ money(currentItem.totalAmount) }}</div>
                    </div>
                    <div class="amount-grid">
                        <div class="amount-item"><span>会员折扣金额</span><strong>-¥{{ money(currentItem.memberDiscount) }}</strong></div>
                        <div class="amount-item"><span>优惠券抵扣金额</span><strong>-¥{{ money(currentItem.couponDiscount) }}</strong></div>
                        <div class="amount-item"><span>积分抵扣金额</span><strong>-¥{{ money(currentItem.pointDiscount) }}</strong></div>
                        <div class="amount-item amount-paid"><span>实付金额</span><strong>¥{{ money(currentItem.paidAmount) }}</strong></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">订单日志</span></template>
                    <el-table :data="currentItem.logs" style="width: 100%">
                        <el-table-column prop="operator" label="操作人" min-width="150" />
                        <el-table-column prop="action" label="操作内容" min-width="240" />
                        <el-table-column prop="time" label="记录日期" min-width="170" />
                    </el-table>
                </el-card>
            </template>
        </el-drawer>

        <!-- 核销记录 -->
        <el-dialog v-model="verifyVisible" title="核销记录" width="720px">
            <el-table :data="verifyRecords" style="width: 100%">
                <el-table-column prop="store" label="核销门店" min-width="160" align="center" />
                <el-table-column prop="operator" label="核销人员" min-width="180" align="center" />
                <el-table-column prop="time" label="核销时间" min-width="180" align="center" />
            </el-table>
            <template v-if="!verifyRecords.length">
                <div class="empty-tip">暂无核销记录</div>
            </template>
            <template #footer>
                <el-button @click="verifyVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="serviceOrderList">
import { cloneDeep } from 'lodash-es'
import { useRoute } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import {
    orderTypeLabels,
    orderTypeTagTypes,
    payStatusLabels,
    serviceOrders,
    statusLabels,
    statusTabs,
    statusTagTypes,
    storeOptions
} from './data'
import type { OrderStatus, OrderType, ServiceOrderItem } from './data'

const money = (value: number) => value.toFixed(2)

const data = reactive(cloneDeep(serviceOrders))
const keyword = ref('')
const mobile = ref('')
const store = ref('')
const orderType = ref('')
const status = ref('')
const dateRange = ref<string[]>([])
const activeTab = ref('')
const query = reactive({
    keyword: '',
    mobile: '',
    store: '',
    orderType: '',
    status: '',
    startDate: '',
    endDate: ''
})

const filteredList = computed(() =>
    data.filter((item) => {
        const matchKeyword = !query.keyword || item.nickname.includes(query.keyword)
        const matchMobile = !query.mobile || item.mobile.includes(query.mobile)
        const matchStore = !query.store || item.store === query.store
        const matchType = !query.orderType || item.orderType === query.orderType
        const matchStatus = query.status ? item.status === query.status : !activeTab.value || item.status === activeTab.value
        const matchStart = !query.startDate || item.orderTime.slice(0, 10) >= query.startDate
        const matchEnd = !query.endDate || item.orderTime.slice(0, 10) <= query.endDate
        return matchKeyword && matchMobile && matchStore && matchType && matchStatus && matchStart && matchEnd
    }).sort((a, b) => b.orderTime.localeCompare(a.orderTime))
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.mobile = mobile.value.trim()
    query.store = store.value
    query.orderType = orderType.value
    query.status = status.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
}
const resetSearch = () => {
    keyword.value = ''
    mobile.value = ''
    store.value = ''
    orderType.value = ''
    status.value = ''
    dateRange.value = []
    activeTab.value = ''
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '服务订单',
        [
            '订单编号', '订单类型', '用户昵称', '手机号', '门店', '服务名称', '单价', '数量',
            '会员折扣', '优惠券抵扣', '积分抵扣', '订单总额', '实付金额', '订单状态', '核销次数', '总次数', '下单时间'
        ],
        filteredList.value.map((row) => [
            row.orderNo,
            orderTypeLabels[row.orderType as OrderType],
            row.nickname,
            row.mobile,
            row.store,
            row.serviceName,
            row.price,
            row.quantity,
            row.memberDiscount,
            row.couponDiscount,
            row.pointDiscount,
            row.totalAmount,
            row.paidAmount,
            statusLabels[row.status as OrderStatus],
            row.verifyCount,
            row.totalCount,
            row.orderTime
        ])
    )
}

const detailVisible = ref(false)
const currentItem = ref<ServiceOrderItem | null>(null)
const openDetail = (row: ServiceOrderItem) => {
    currentItem.value = row
    detailVisible.value = true
}

// 支持从售后订单跳转，通过 orderNo 参数自动打开详情
const route = useRoute()
watch(
    () => route.query.orderNo,
    (orderNo) => {
        if (orderNo && typeof orderNo === 'string') {
            const target = data.find((item) => item.orderNo === orderNo)
            if (target) openDetail(target)
        }
    },
    { immediate: true }
)

const verifyVisible = ref(false)
const verifyRecords = ref<ServiceOrderItem['verifications']>([])
const openVerify = (row: ServiceOrderItem) => {
    verifyRecords.value = row.verifications
    verifyVisible.value = true
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

.date-range-wrap {
    width: 250px;
    :deep(.el-date-editor) {
        width: 100% !important;
    }
}

.list-card,
.info-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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

.user-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.user-text {
    color: #303133;
}

.avatar {
    display: inline-flex;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    width: 32px;
    min-width: 32px;
    height: 32px;
    min-height: 32px;
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    color: #fff;
    border-radius: 50%;
}

.cell-lines {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    line-height: 1.5;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.order-info-cell {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.service-image {
    display: inline-flex;
    flex: 0 0 40px;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    border-radius: 6px;
}

.verify-active {
    font-weight: 600;
    color: var(--el-color-primary);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.info-label {
    font-size: 12px;
    color: #909399;
}

.info-value {
    font-size: 14px;
    color: #303133;
}

.project-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.project-cover {
    display: inline-flex;
    flex: 0 0 64px;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    border-radius: 8px;
}

.project-detail {
    flex: 1;
}

.project-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
}

.project-meta {
    margin-top: 4px;
    font-size: 13px;
    color: #909399;
}

.project-amount {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
}

.amount-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px 20px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
}

.amount-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: #909399;

    strong {
        font-size: 15px;
        color: #f56c6c;
    }
}

.amount-paid strong {
    color: var(--el-color-primary);
}

.empty-tip {
    padding: 30px 0;
    font-size: 14px;
    color: #909399;
    text-align: center;
}

:deep(.order-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
