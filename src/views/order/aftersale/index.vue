<template>
    <div class="aftersale-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="orderNo" placeholder="订单编号" clearable class="!w-[160px]" />
            <el-input v-model="keyword" placeholder="用户昵称/手机号" clearable class="!w-[170px]" />
            <el-select v-model="afterType" placeholder="售后类型" clearable class="!w-[130px]">
                <el-option label="仅退款" value="refund" />
                <el-option label="退货退款" value="return" />
            </el-select>
            <el-select v-model="status" placeholder="处理状态" clearable class="!w-[130px]">
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

            <el-table class="aftersale-table" :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="afterSaleNo" label="售后单号" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column label="原订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openOriginOrder(row)">{{ row.originOrderNo }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="orderTypeTagTypes[row.originOrderType as OriginOrderType]" size="small" effect="light">
                            {{ orderTypeLabels[row.originOrderType as OriginOrderType] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="用户信息" min-width="240" align="center">
                    <template #default="{ row }">
                        <div class="user-cell">
                            <span class="avatar" :style="{ background: row.avatarColor }">
                                {{ row.nickname.charAt(0) }}
                            </span>
                            <span class="user-text">{{ row.nickname }} / {{ row.mobile }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="售后原因" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column prop="remark" label="备注说明" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column label="图片凭证" min-width="130" align="center">
                    <template #default="{ row }">
                        <div class="image-list">
                            <span
                                v-for="(img, index) in row.images"
                                :key="index"
                                class="proof-image"
                                @click="openProof(row, index)"
                            >
                                {{ img }}
                            </span>
                            <span v-if="!row.images.length" class="cell-sub">无</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="申请退款金额" min-width="130" align="center">
                    <template #default="{ row }">
                        <span class="refund-amount">¥{{ money(row.refundAmount) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagTypes[row.status as AfterSaleStatus]" size="small" effect="light">
                            {{ statusLabels[row.status as AfterSaleStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="申请时间" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>{{ row.applyTime.slice(0, 10) }}</span>
                            <span class="cell-sub">{{ row.applyTime.slice(11) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.status === 'pending'"
                            type="primary"
                            link
                            size="small"
                            @click="openAudit(row)"
                        >
                            审核处理
                        </el-button>
                        <span v-else class="text-muted">-</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 审核处理弹窗 -->
        <el-dialog v-model="auditVisible" title="售后审核处理" width="560px">
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">原订单信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">订单编号</span><span class="info-value">{{ currentItem.originOrder.orderNo }}</span></div>
                        <div class="info-item"><span class="info-label">订单类型</span><span class="info-value">{{ orderTypeLabels[currentItem.originOrderType] }}</span></div>
                        <div class="info-item"><span class="info-label">服务/商品</span><span class="info-value">{{ currentItem.originOrder.serviceName }}</span></div>
                        <div class="info-item"><span class="info-label">订单状态</span><span class="info-value">{{ currentItem.originOrder.orderStatus }}</span></div>
                        <div class="info-item"><span class="info-label">实付金额</span><span class="info-value">¥{{ money(currentItem.originOrder.paidAmount) }}</span></div>
                        <div class="info-item"><span class="info-label">下单时间</span><span class="info-value">{{ currentItem.originOrder.orderTime }}</span></div>
                    </div>
                </el-card>
                <div class="refund-info">
                    <div class="refund-row">
                        <span class="refund-label">可退款金额</span>
                        <span class="refund-value">¥{{ money(currentItem.refundableAmount) }}</span>
                    </div>
                    <div class="refund-row">
                        <span class="refund-label">计算规则</span>
                        <span class="refund-rule">{{ currentItem.refundRule }}</span>
                    </div>
                </div>
                <div class="audit-form">
                    <div class="audit-row">
                        <span class="audit-label">处理结果</span>
                        <el-radio-group v-model="auditResult">
                            <el-radio value="agree">同意退款</el-radio>
                            <el-radio value="reject">拒绝退款</el-radio>
                        </el-radio-group>
                    </div>
                    <div v-if="auditResult === 'reject'" class="audit-row">
                        <span class="audit-label">拒绝原因</span>
                        <el-input
                            v-model="rejectReason"
                            type="textarea"
                            :rows="3"
                            class="!w-[360px]"
                            placeholder="请输入拒绝原因（用户端可见）"
                        />
                    </div>
                </div>
            </template>
            <template #footer>
                <el-button @click="auditVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAudit">确认提交</el-button>
            </template>
        </el-dialog>

        <!-- 图片凭证预览 -->
        <el-dialog v-model="proofVisible" title="图片凭证" width="500px">
            <div class="proof-preview">{{ currentProof }}</div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="aftersaleList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'

import { exportCsv } from '@/utils/export-csv'

import {
    afterSaleOrders,
    afterSaleTypeLabels,
    orderTypeLabels,
    orderTypeTagTypes,
    statusLabels,
    statusTabs,
    statusTagTypes
} from './data'
import type { AfterSaleItem, AfterSaleStatus, OriginOrderType } from './data'

const router = useRouter()
const money = (value: number) => value.toFixed(2)

const data = reactive(cloneDeep(afterSaleOrders))
const orderNo = ref('')
const keyword = ref('')
const afterType = ref('')
const status = ref('')
const dateRange = ref<string[]>([])
const activeTab = ref('')
const query = reactive({
    orderNo: '',
    keyword: '',
    afterType: '',
    status: '',
    startDate: '',
    endDate: ''
})

const filteredList = computed(() =>
    data.filter((item) => {
        const matchOrderNo =
            !query.orderNo ||
            item.afterSaleNo.includes(query.orderNo) ||
            item.originOrderNo.includes(query.orderNo)
        const matchKeyword =
            !query.keyword || item.nickname.includes(query.keyword) || item.mobile.includes(query.keyword)
        const matchType = !query.afterType || item.afterSaleType === query.afterType
        const matchStatus = query.status
            ? item.status === query.status
            : !activeTab.value || item.status === activeTab.value
        const matchStart = !query.startDate || item.applyTime.slice(0, 10) >= query.startDate
        const matchEnd = !query.endDate || item.applyTime.slice(0, 10) <= query.endDate
        return matchOrderNo && matchKeyword && matchType && matchStatus && matchStart && matchEnd
    })
)

const handleSearch = () => {
    query.orderNo = orderNo.value.trim()
    query.keyword = keyword.value.trim()
    query.afterType = afterType.value
    query.status = status.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
}
const resetSearch = () => {
    orderNo.value = ''
    keyword.value = ''
    afterType.value = ''
    status.value = ''
    dateRange.value = []
    activeTab.value = ''
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '售后订单',
        ['售后单号', '原订单编号', '订单类型', '售后类型', '用户昵称', '手机号', '售后原因', '备注说明', '申请退款金额', '状态', '申请时间'],
        filteredList.value.map((row) => [
            row.afterSaleNo,
            row.originOrderNo,
            orderTypeLabels[row.originOrderType],
            afterSaleTypeLabels[row.afterSaleType],
            row.nickname,
            row.mobile,
            row.reason,
            row.remark,
            row.refundAmount,
            statusLabels[row.status],
            row.applyTime
        ])
    )
}

// 点击原订单编号跳转对应订单详情
const openOriginOrder = (row: AfterSaleItem) => {
    const path =
        row.originOrderType === 'goods'
            ? '/order/goods'
            : '/order/service'
    router.push({ path, query: { orderNo: row.originOrderNo } })
}

// 图片凭证预览
const proofVisible = ref(false)
const currentProof = ref('')
const openProof = (row: AfterSaleItem, index: number) => {
    currentProof.value = `${row.nickname} 的图片凭证 ${index + 1}：${row.images[index]}`
    proofVisible.value = true
}

// 审核处理
const auditVisible = ref(false)
const currentItem = ref<AfterSaleItem | null>(null)
const auditResult = ref<'agree' | 'reject'>('agree')
const rejectReason = ref('')
const openAudit = (row: AfterSaleItem) => {
    currentItem.value = row
    auditResult.value = 'agree'
    rejectReason.value = ''
    auditVisible.value = true
}

const submitAudit = () => {
    if (!currentItem.value) return
    if (auditResult.value === 'reject' && !rejectReason.value.trim()) {
        ElMessage.warning('请填写拒绝原因')
        return
    }
    if (auditResult.value === 'agree') {
        ElMessageBox.confirm(
            `确认同意退款 ¥${money(currentItem.value.refundableAmount)}？确认后将原路退还退款金额。`,
            '退款二次确认',
            { type: 'warning' }
        )
            .then(() => {
                if (!currentItem.value) return
                currentItem.value.status = 'agreed'
                auditVisible.value = false
                ElMessage.success('已同意退款，金额将原路退还')
            })
            .catch(() => {})
    } else {
        currentItem.value.status = 'rejected'
        currentItem.value.rejectReason = rejectReason.value.trim()
        auditVisible.value = false
        ElMessage.success('已拒绝退款，拒绝原因将展示给用户')
    }
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
    gap: 3px;
    line-height: 1.5;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
}

.proof-image {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 30px;
    padding: 0 6px;
    font-size: 11px;
    color: #409eff;
    background: #ecf5ff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    cursor: pointer;
}

.refund-amount {
    font-weight: 600;
    color: #f56c6c;
}

.text-muted {
    color: #c0c4cc;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

.refund-info {
    margin-top: 16px;
    padding: 14px;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
}

.refund-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0;
}

.refund-label {
    flex: 0 0 80px;
    font-size: 13px;
    color: #909399;
}

.refund-value {
    font-size: 18px;
    font-weight: 600;
    color: #f56c6c;
}

.refund-rule {
    flex: 1;
    font-size: 13px;
    line-height: 1.6;
    color: #606266;
}

.audit-form {
    margin-top: 16px;
}

.audit-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
}

.audit-label {
    flex: 0 0 80px;
    padding-top: 6px;
    font-size: 14px;
    color: #606266;
}

.proof-preview {
    padding: 30px;
    font-size: 15px;
    color: #606266;
    text-align: center;
    background: #f5f7fa;
    border-radius: 6px;
}

:deep(.aftersale-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
