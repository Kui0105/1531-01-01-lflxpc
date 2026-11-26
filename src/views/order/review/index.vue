<template>
    <div class="review-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称" clearable class="!w-[150px]" />
            <el-select v-model="store" placeholder="门店" clearable class="!w-[120px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="therapist" placeholder="康复师" clearable class="!w-[120px]">
                <el-option v-for="item in therapistOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-input v-model="serviceName" placeholder="服务/商品名称" clearable class="!w-[150px]" />
            <el-select v-model="rating" placeholder="评分星级" clearable class="!w-[120px]">
                <el-option v-for="item in ratingOptions" :key="item" :label="`${item} 星`" :value="item" />
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

            <el-table class="review-table" :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="reviewNo" label="评价编号" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column label="用户信息" min-width="220" align="center">
                    <template #default="{ row }">
                        <div class="user-cell">
                            <span class="avatar" :style="{ background: row.avatarColor }">
                                {{ row.nickname.charAt(0) }}
                            </span>
                            <span class="user-text">{{ row.nickname }} / {{ row.mobile }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单编号" min-width="150" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openDetail(row)">{{ row.orderNo }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="服务/商品名称" min-width="150" align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.serviceName }}
                        <el-tag :type="row.orderType === 'goods' ? 'warning' : 'success'" size="small" effect="plain">
                            {{ row.orderType === 'goods' ? '商品' : '服务' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="store" label="服务门店" min-width="110" align="center" />
                <el-table-column label="康复师" min-width="100" align="center">
                    <template #default="{ row }">
                        {{ row.therapist || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="评分星级" min-width="130" align="center">
                    <template #default="{ row }">
                        <div class="rating-cell">
                            <el-rate :model-value="row.rating" disabled allow-half :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
                            <span class="rating-value">{{ row.rating }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="评价内容" min-width="240" align="center" show-overflow-tooltip />
                <el-table-column label="评价图片" min-width="130" align="center">
                    <template #default="{ row }">
                        <div class="image-list">
                            <el-image
                                v-for="(img, index) in row.images"
                                :key="index"
                                :src="imageUrl(img)"
                                :preview-src-list="row.images.map(imageUrl)"
                                :initial-index="index"
                                fit="cover"
                                class="proof-image"
                                preview-teleported
                            />
                            <span v-if="!row.images.length" class="cell-sub">无</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评价时间" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>{{ row.reviewTime.slice(0, 10) }}</span>
                            <span class="cell-sub">{{ row.reviewTime.slice(11) }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTagTypes[row.status as ReviewStatus]" size="small" effect="light">
                            {{ statusLabels[row.status as ReviewStatus] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="230" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看评价</el-button>
                        <el-button
                            v-if="row.status === 'shown'"
                            type="warning"
                            link
                            size="small"
                            @click="toggleReview(row, 'hidden')"
                        >
                            隐藏评价
                        </el-button>
                        <el-button
                            v-else
                            type="success"
                            link
                            size="small"
                            @click="toggleReview(row, 'shown')"
                        >
                            展示评价
                        </el-button>
                        <el-button type="danger" link size="small" @click="deleteReview(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 查看评价弹窗 -->
        <el-drawer v-model="detailVisible" size="820px">
            <template #header>
                <span class="header-title">评价详情 - {{ currentItem?.reviewNo }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">评价信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">用户昵称</span><span class="info-value">{{ currentItem.nickname }}</span></div>
                        <div class="info-item"><span class="info-label">联系电话</span><span class="info-value">{{ currentItem.mobile }}</span></div>
                        <div class="info-item"><span class="info-label">订单编号</span><span class="info-value">{{ currentItem.orderNo }}</span></div>
                        <div class="info-item"><span class="info-label">服务/商品</span><span class="info-value">{{ currentItem.serviceName }}</span></div>
                        <div class="info-item"><span class="info-label">服务门店</span><span class="info-value">{{ currentItem.store }}</span></div>
                        <div class="info-item"><span class="info-label">康复师</span><span class="info-value">{{ currentItem.therapist || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">评分星级</span><span class="info-value">{{ currentItem.rating }} 星</span></div>
                        <div class="info-item"><span class="info-label">评价时间</span><span class="info-value">{{ currentItem.reviewTime }}</span></div>
                        <div class="info-item"><span class="info-label">状态</span><span class="info-value">{{ statusLabels[currentItem.status] }}</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">评价内容</span></template>
                    <div class="review-content">{{ currentItem.content }}</div>
                    <div class="tag-list">
                        <el-tag v-for="tag in currentItem.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                    </div>
                    <div v-if="currentItem.images.length" class="image-list detail-images">
                        <el-image
                            v-for="(img, index) in currentItem.images"
                            :key="index"
                            :src="imageUrl(img)"
                            :preview-src-list="currentItem.images.map(imageUrl)"
                            :initial-index="index"
                            fit="cover"
                            class="proof-image detail-proof-image"
                            preview-teleported
                        />
                    </div>
                    <div v-if="currentItem.reply" class="reply-box">
                        <span class="reply-label">商家回复：</span>{{ currentItem.reply }}
                    </div>
                </el-card>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup name="reviewList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { exportCsv } from '@/utils/export-csv'

import {
    ratingOptions,
    reviews,
    statusLabels,
    statusTabs,
    statusTagTypes,
    storeOptions,
    therapistOptions
} from './data'
import type { ReviewItem, ReviewStatus } from './data'

// mock 图片文字生成 SVG 占位图（data URI），支持 el-image 点击放大预览
const imageUrl = (label: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="600" height="450" fill="#eef2ff"/><rect x="20" y="20" width="560" height="410" fill="#ffffff" stroke="#d9e0ff" stroke-width="2" rx="10"/><text x="300" y="225" font-size="40" fill="#4A5DFF" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const data = reactive(cloneDeep(reviews))
const keyword = ref('')
const store = ref('')
const therapist = ref('')
const serviceName = ref('')
const rating = ref<number | ''>('')
const dateRange = ref<string[]>([])
const activeTab = ref('')
const query = reactive({
    keyword: '',
    store: '',
    therapist: '',
    serviceName: '',
    rating: '' as number | '',
    startDate: '',
    endDate: ''
})

const filteredList = computed(() =>
    data.filter((item) => {
        const matchKeyword = !query.keyword || item.nickname.includes(query.keyword)
        const matchStore = !query.store || item.store === query.store
        const matchTherapist = !query.therapist || item.therapist === query.therapist
        const matchService = !query.serviceName || item.serviceName.includes(query.serviceName)
        const matchRating = query.rating === '' || item.rating === query.rating
        const matchStatus = !activeTab.value || item.status === activeTab.value
        const matchStart = !query.startDate || item.reviewTime.slice(0, 10) >= query.startDate
        const matchEnd = !query.endDate || item.reviewTime.slice(0, 10) <= query.endDate
        return matchKeyword && matchStore && matchTherapist && matchService && matchRating && matchStatus && matchStart && matchEnd
    })
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.store = store.value
    query.therapist = therapist.value
    query.serviceName = serviceName.value.trim()
    query.rating = rating.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
}
const resetSearch = () => {
    keyword.value = ''
    store.value = ''
    therapist.value = ''
    serviceName.value = ''
    rating.value = ''
    dateRange.value = []
    activeTab.value = ''
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '订单评价',
        ['评价编号', '用户昵称', '手机号', '订单编号', '服务/商品名称', '服务门店', '康复师', '评分星级', '评价内容', '评价时间', '状态'],
        filteredList.value.map((row) => [
            row.reviewNo,
            row.nickname,
            row.mobile,
            row.orderNo,
            row.serviceName,
            row.store,
            row.therapist || '-',
            row.rating,
            row.content,
            row.reviewTime,
            statusLabels[row.status]
        ])
    )
}

// 查看评价详情
const detailVisible = ref(false)
const currentItem = ref<ReviewItem | null>(null)
const openDetail = (row: ReviewItem) => {
    currentItem.value = row
    detailVisible.value = true
}

// 隐藏 / 展示评价（二次确认）
const toggleReview = (row: ReviewItem, target: ReviewStatus) => {
    const isHide = target === 'hidden'
    ElMessageBox.confirm(
        isHide
            ? '确认隐藏该评价？隐藏后用户端服务详情与康复师详情将不再展示该评价。'
            : '确认展示该评价？展示后用户端服务详情与康复师详情将重新展示该评价。',
        isHide ? '隐藏评价二次确认' : '展示评价二次确认',
        { type: isHide ? 'warning' : 'info' }
    )
        .then(() => {
            row.status = target
            ElMessage.success(isHide ? '评价已隐藏' : '评价已展示')
        })
        .catch(() => {})
}

// 删除评价（二次确认）
const deleteReview = (row: ReviewItem) => {
    ElMessageBox.confirm(
        `确认删除评价「${row.reviewNo}」？删除后不可恢复。`,
        '删除评价二次确认',
        { type: 'warning' }
    )
        .then(() => {
            const index = data.findIndex((item) => item.id === row.id)
            if (index > -1) data.splice(index, 1)
            if (currentItem.value?.id === row.id) detailVisible.value = false
            ElMessage.success('评价已删除')
        })
        .catch(() => {})
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

.rating-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.rating-value {
    font-size: 13px;
    font-weight: 600;
    color: #f7ba2a;
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
    width: 44px;
    height: 44px;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    cursor: pointer;
}

.detail-proof-image {
    width: 80px;
    height: 80px;
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

.review-content {
    font-size: 14px;
    line-height: 1.8;
    color: #303133;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.detail-images {
    justify-content: flex-start;
    margin-top: 12px;
}

.reply-box {
    margin-top: 14px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.7;
    color: #606266;
    background: #f5f7fa;
    border-radius: 6px;
}

.reply-label {
    color: var(--el-color-primary);
}

:deep(.review-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
