<template>
    <div class="goods-order-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="orderNo" placeholder="订单编号" clearable class="!w-[170px]" />
            <el-input v-model="keyword" placeholder="用户昵称/手机号" clearable class="!w-[180px]" />
            <el-select v-model="deliveryType" placeholder="配送方式" clearable class="!w-[130px]">
                <el-option label="快递" value="express" />
                <el-option label="门店自提" value="pickup" />
            </el-select>
            <el-select v-model="status" placeholder="订单状态" clearable class="!w-[140px]">
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
            <el-button type="primary" plain @click="openBatchShip">批量发货</el-button>
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
                <el-table-column label="商品信息" min-width="250" align="center">
                    <template #default="{ row }">
                        <div class="goods-info-cell">
                            <span class="goods-image" :style="{ background: row.goodsColor }">
                                {{ row.goodsName.charAt(0) }}
                            </span>
                            <div class="cell-lines">
                                <span>{{ row.goodsName }}</span>
                                <span class="cell-sub">{{ row.goodsSpec }}</span>
                                <span class="cell-sub">¥{{ money(row.goodsPrice) }} × {{ row.goodsQuantity }}</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="配送方式" min-width="110" align="center">
                    <template #default="{ row }">
                        {{ deliveryLabels[row.deliveryType as DeliveryType] }}
                    </template>
                </el-table-column>
                <el-table-column label="自提门店" min-width="110" align="center">
                    <template #default="{ row }">
                        {{ row.pickupStore || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="分装服务" min-width="110" align="center">
                    <template #default="{ row }">
                        {{ row.packagingService || '-' }}
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
                <el-table-column label="运费" min-width="90" align="center">
                    <template #default="{ row }">
                        ¥{{ money(row.freight) }}
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>订单总额 ¥{{ money(row.goodsPrice * row.goodsQuantity + row.freight) }}</span>
                            <span class="cell-sub paid-amount">实付 ¥{{ money(row.paidAmount) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagTypes[row.status as OrderStatus]" size="small" effect="light">
                            {{ statusLabels[row.status as OrderStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>{{ row.orderTime.slice(0, 10) }}</span>
                            <span class="cell-sub">{{ row.orderTime.slice(11) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="140" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-if="row.status === 'pending_ship'"
                            type="primary"
                            link
                            size="small"
                            @click="openShip(row)"
                        >
                            发货
                        </el-button>
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 订单详情 -->
        <el-drawer v-model="detailVisible" size="760px">
            <template #header>
                <span class="header-title">商品订单详情 - {{ currentItem?.orderNo }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">下单人信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">用户昵称</span><span class="info-value">{{ currentItem.nickname }}</span></div>
                        <div class="info-item"><span class="info-label">真实姓名</span><span class="info-value">{{ currentItem.realName || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">联系电话</span><span class="info-value">{{ currentItem.mobile }}</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header>
                        <span class="header-title">
                            {{ currentItem.deliveryType === 'express' ? '收货信息' : '自提信息' }}
                        </span>
                    </template>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">{{ currentItem.deliveryType === 'express' ? '收货人' : '自提人' }}</span>
                            <span class="info-value">{{ currentItem.receiverName }}</span>
                        </div>
                        <div class="info-item"><span class="info-label">联系电话</span><span class="info-value">{{ currentItem.receiverMobile }}</span></div>
                        <div v-if="currentItem.deliveryType === 'express'" class="info-item info-full">
                            <span class="info-label">收货地址</span><span class="info-value">{{ currentItem.receiverAddress }}</span>
                        </div>
                        <div v-else class="info-item"><span class="info-label">自提门店</span><span class="info-value">{{ currentItem.pickupStore }}</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">商品清单</span></template>
                    <div class="goods-detail">
                        <span class="goods-image" :style="{ background: currentItem.goodsColor }">
                            {{ currentItem.goodsName.charAt(0) }}
                        </span>
                        <div class="goods-detail-main">
                            <div class="goods-name">{{ currentItem.goodsName }}</div>
                            <div class="cell-sub">规格：{{ currentItem.goodsSpec }}</div>
                        </div>
                        <div class="goods-detail-right">
                            <div>¥{{ money(currentItem.goodsPrice) }} × {{ currentItem.goodsQuantity }}</div>
                            <div class="cell-sub">小计 ¥{{ money(currentItem.goodsPrice * currentItem.goodsQuantity) }}</div>
                        </div>
                    </div>
                    <div v-if="currentItem.packagingService" class="detail-tip">
                        分装服务说明：{{ currentItem.packagingService }}
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">优惠明细与支付信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">商品小计</span><span class="info-value">¥{{ money(currentItem.goodsPrice * currentItem.goodsQuantity) }}</span></div>
                        <div class="info-item"><span class="info-label">会员折扣</span><span class="info-value">-¥{{ money(currentItem.memberDiscount) }}</span></div>
                        <div class="info-item"><span class="info-label">优惠券抵扣</span><span class="info-value">-¥{{ money(currentItem.couponDiscount) }}</span></div>
                        <div class="info-item"><span class="info-label">积分抵扣</span><span class="info-value">-¥{{ money(currentItem.pointDiscount) }}</span></div>
                        <div class="info-item"><span class="info-label">运费</span><span class="info-value">¥{{ money(currentItem.freight) }}</span></div>
                        <div class="info-item"><span class="info-label">实付金额</span><span class="info-value paid-amount">¥{{ money(currentItem.paidAmount) }}</span></div>
                        <div class="info-item"><span class="info-label">支付方式</span><span class="info-value">{{ currentItem.payMethod || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">支付时间</span><span class="info-value">{{ currentItem.payTime || '-' }}</span></div>
                    </div>
                </el-card>
                <el-card v-if="currentItem.deliveryType === 'express'" class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">物流信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">快递公司</span><span class="info-value">{{ currentItem.expressCompany || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">物流单号</span><span class="info-value">{{ currentItem.trackingNo || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">发货时间</span><span class="info-value">{{ currentItem.shipTime || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">订单状态</span><span class="info-value">{{ statusLabels[currentItem.status] }}</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">订单备注</span></template>
                    <div class="detail-tip">{{ currentItem.remark || '无' }}</div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">订单日志</span></template>
                    <el-table :data="currentItem.logs" style="width: 100%">
                        <el-table-column prop="operator" label="操作人" min-width="150" />
                        <el-table-column prop="action" label="操作内容" min-width="260" />
                        <el-table-column prop="time" label="记录日期" min-width="170" />
                    </el-table>
                </el-card>
            </template>
        </el-drawer>

        <!-- 订单发货 -->
        <el-dialog v-model="shipVisible" title="订单发货" width="480px">
            <div class="ship-form">
                <div class="ship-row">
                    <span class="ship-label">订单编号</span>
                    <span class="ship-value">{{ shipItem?.orderNo }}</span>
                </div>
                <div class="ship-row">
                    <span class="ship-label">快递公司</span>
                    <el-select v-model="expressCompany" class="!w-[300px]" placeholder="请选择快递公司">
                        <el-option
                            v-for="item in expressCompanies"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </div>
                <div class="ship-row">
                    <span class="ship-label">物流单号</span>
                    <el-input v-model="trackingNo" class="!w-[300px]" placeholder="请输入物流单号" clearable />
                </div>
            </div>
            <template #footer>
                <el-button @click="shipVisible = false">取消</el-button>
                <el-button type="primary" @click="submitShip">确认发货</el-button>
            </template>
        </el-dialog>

        <!-- 批量发货 -->
        <el-dialog v-model="batchShipVisible" title="批量发货" width="560px">
            <div class="batch-ship">
                <div class="batch-step">
                    <span class="batch-step-no">1</span>
                    <span class="batch-step-text">下载模板并填写</span>
                    <el-button type="primary" link @click="downloadTemplate">下载模板文件</el-button>
                </div>
                <div class="batch-hint">
                    模板表头为「订单号、快递公司、物流单号」，其中快递公司、物流单号需人工填写后上传。
                </div>
                <div class="batch-step">
                    <span class="batch-step-no">2</span>
                    <span class="batch-step-text">上传填写好的文件</span>
                </div>
                <el-upload
                    class="batch-upload"
                    accept=".xlsx,.xls"
                    :auto-upload="false"
                    :show-file-list="false"
                    :limit="1"
                    :on-change="handleBatchFile"
                >
                    <el-button type="primary" plain>选择 Excel 文件</el-button>
                </el-upload>
                <div v-if="batchFileName" class="batch-file-name">
                    已选择：{{ batchFileName }}
                </div>
                <div v-if="batchRows.length" class="batch-preview">
                    <div class="batch-preview-title">解析结果（共 {{ batchRows.length }} 条）</div>
                    <el-table :data="batchRows" style="width: 100%" max-height="220">
                        <el-table-column prop="orderNo" label="订单号" min-width="140" align="center" />
                        <el-table-column prop="expressCompany" label="快递公司" min-width="120" align="center" />
                        <el-table-column prop="trackingNo" label="物流单号" min-width="140" align="center" />
                        <el-table-column label="匹配状态" min-width="120" align="center">
                            <template #default="{ row }">
                                <el-tag :type="row.matched ? 'success' : 'danger'" size="small" effect="light">
                                    {{ row.matched ? '可发货' : row.message }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <template #footer>
                <el-button @click="batchShipVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    :disabled="!batchRows.length"
                    @click="submitBatchShip"
                >
                    确认批量发货
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="goodsOrderList">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useRoute } from 'vue-router'
import * as XLSX from 'xlsx'

import { exportCsv } from '@/utils/export-csv'

import {
    deliveryLabels,
    expressCompanies,
    goodsOrders,
    statusLabels,
    statusTabs,
    statusTagTypes
} from './data'
import type { DeliveryType, GoodsOrderItem, OrderStatus } from './data'

const money = (value: number) => value.toFixed(2)

const data = reactive(cloneDeep(goodsOrders))
const orderNo = ref('')
const keyword = ref('')
const deliveryType = ref('')
const status = ref('')
const dateRange = ref<string[]>([])
const activeTab = ref('')
const query = reactive({
    orderNo: '',
    keyword: '',
    deliveryType: '',
    status: '',
    startDate: '',
    endDate: ''
})

const filteredList = computed(() =>
    data.filter((item) => {
        const matchOrderNo = !query.orderNo || item.orderNo.includes(query.orderNo)
        const matchKeyword =
            !query.keyword || item.nickname.includes(query.keyword) || item.mobile.includes(query.keyword)
        const matchDelivery = !query.deliveryType || item.deliveryType === query.deliveryType
        const matchStatus = query.status
            ? item.status === query.status
            : !activeTab.value || item.status === activeTab.value
        const matchStart = !query.startDate || item.orderTime.slice(0, 10) >= query.startDate
        const matchEnd = !query.endDate || item.orderTime.slice(0, 10) <= query.endDate
        return matchOrderNo && matchKeyword && matchDelivery && matchStatus && matchStart && matchEnd
    }).sort((a, b) => b.orderTime.localeCompare(a.orderTime))
)

const handleSearch = () => {
    query.orderNo = orderNo.value.trim()
    query.keyword = keyword.value.trim()
    query.deliveryType = deliveryType.value
    query.status = status.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
}
const resetSearch = () => {
    orderNo.value = ''
    keyword.value = ''
    deliveryType.value = ''
    status.value = ''
    dateRange.value = []
    activeTab.value = ''
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '商品订单',
        [
            '订单编号', '用户昵称', '手机号', '商品名称', '规格', '数量', '单价', '配送方式',
            '自提门店', '分装服务', '会员折扣', '优惠券抵扣', '积分抵扣', '运费', '订单总额', '实付金额', '状态', '下单时间'
        ],
        filteredList.value.map((row) => [
            row.orderNo,
            row.nickname,
            row.mobile,
            row.goodsName,
            row.goodsSpec,
            row.goodsQuantity,
            row.goodsPrice,
            deliveryLabels[row.deliveryType as DeliveryType],
            row.pickupStore || '-',
            row.packagingService || '-',
            row.memberDiscount,
            row.couponDiscount,
            row.pointDiscount,
            row.freight,
            row.goodsPrice * row.goodsQuantity + row.freight,
            row.paidAmount,
            statusLabels[row.status as OrderStatus],
            row.orderTime
        ])
    )
}

const detailVisible = ref(false)
const currentItem = ref<GoodsOrderItem | null>(null)
const openDetail = (row: GoodsOrderItem) => {
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

const shipVisible = ref(false)
const shipItem = ref<GoodsOrderItem | null>(null)
const expressCompany = ref('')
const trackingNo = ref('')
const openShip = (row: GoodsOrderItem) => {
    shipItem.value = row
    expressCompany.value = ''
    trackingNo.value = ''
    shipVisible.value = true
}
const submitShip = () => {
    if (!shipItem.value) return
    if (!expressCompany.value) {
        ElMessage.warning('请选择快递公司')
        return
    }
    if (!trackingNo.value.trim()) {
        ElMessage.warning('请输入物流单号')
        return
    }
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    shipItem.value.status = 'pending_receive'
    shipItem.value.expressCompany = expressCompany.value
    shipItem.value.trackingNo = trackingNo.value.trim()
    shipItem.value.shipTime = time
    shipItem.value.logs.unshift({
        operator: '管理员',
        action: `订单发货（${expressCompany.value} ${trackingNo.value.trim()}）`,
        time
    })
    shipVisible.value = false
    ElMessage.success('发货成功，订单状态已更新为待收货')
}

// 批量发货
interface BatchShipRow {
    orderNo: string
    expressCompany: string
    trackingNo: string
    matched: boolean
    message: string
}

const batchShipVisible = ref(false)
const batchFileName = ref('')
const batchRows = ref<BatchShipRow[]>([])

const openBatchShip = () => {
    batchFileName.value = ''
    batchRows.value = []
    batchShipVisible.value = true
}

// 下载批量发货模板（仅表头，快递公司与物流单号留空人工填写）
const downloadTemplate = () => {
    const header = ['订单号', '快递公司', '物流单号']
    const worksheet = XLSX.utils.aoa_to_sheet([header])
    worksheet['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 24 }]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '批量发货')
    XLSX.writeFile(workbook, '批量发货模板.xlsx')
    ElMessage.success('模板已下载')
}

// 读取上传的 Excel 并解析
const handleBatchFile = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    batchFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const binary = e.target?.result
            const workbook = XLSX.read(binary, { type: 'array' })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
            batchRows.value = rows.map((row) => {
                const orderNo = String(row['订单号'] ?? '').trim()
                const expressCompany = String(row['快递公司'] ?? '').trim()
                const trackingNo = String(row['物流单号'] ?? '').trim()
                const target = data.find((item) => item.orderNo === orderNo)
                let matched = false
                let message = '可发货'
                if (!orderNo) {
                    message = '订单号为空'
                } else if (!target) {
                    message = '订单不存在'
                } else if (target.status !== 'pending_ship') {
                    message = '非待发货'
                } else if (!expressCompany || !trackingNo) {
                    message = '信息不全'
                } else {
                    matched = true
                }
                return { orderNo, expressCompany, trackingNo, matched, message }
            })
            if (!batchRows.value.length) {
                ElMessage.warning('文件中未读取到有效数据')
            }
        } catch (error) {
            batchRows.value = []
            ElMessage.error('文件解析失败，请检查格式')
        }
    }
    reader.readAsArrayBuffer(file)
}

// 确认批量发货
const submitBatchShip = () => {
    const validRows = batchRows.value.filter((row) => row.matched)
    if (!validRows.length) {
        ElMessage.warning('没有可发货的订单')
        return
    }
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    let count = 0
    validRows.forEach((row) => {
        const target = data.find((item) => item.orderNo === row.orderNo)
        if (!target || target.status !== 'pending_ship') return
        target.status = 'pending_receive'
        target.expressCompany = row.expressCompany
        target.trackingNo = row.trackingNo
        target.shipTime = time
        target.logs.unshift({
            operator: '管理员',
            action: `批量发货（${row.expressCompany} ${row.trackingNo}）`,
            time
        })
        count++
    })
    batchShipVisible.value = false
    batchRows.value = []
    batchFileName.value = ''
    ElMessage.success(`批量发货成功，共发货 ${count} 单`)
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

.goods-info-cell {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.goods-image {
    display: inline-flex;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    width: 44px;
    min-width: 44px;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    border-radius: 6px;
}

.paid-amount {
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

.info-full {
    grid-column: 1 / -1;
}

.info-label {
    font-size: 12px;
    color: #909399;
}

.info-value {
    font-size: 14px;
    color: #303133;
}

.goods-detail {
    display: flex;
    align-items: center;
    gap: 14px;
}

.goods-detail-main {
    flex: 1;
}

.goods-name {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
}

.goods-detail-right {
    font-size: 14px;
    color: #303133;
    text-align: right;
}

.detail-tip {
    margin-top: 14px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.8;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
}

.ship-form {
    padding: 6px 0;
}

.ship-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.ship-label {
    flex: 0 0 80px;
    font-size: 14px;
    color: #606266;
}

.ship-value {
    font-size: 14px;
    color: #303133;
}

.batch-step {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.batch-step-no {
    display: inline-flex;
    flex: 0 0 22px;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    font-size: 12px;
    color: #fff;
    background: var(--el-color-primary);
    border-radius: 50%;
}

.batch-step-text {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.batch-hint {
    margin: 0 0 16px 32px;
    font-size: 12px;
    line-height: 1.7;
    color: #909399;
}

.batch-upload {
    margin-left: 32px;
}

.batch-file-name {
    margin: 10px 0 0 32px;
    font-size: 13px;
    color: #606266;
}

.batch-preview {
    margin-top: 16px;
}

.batch-preview-title {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

:deep(.order-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
