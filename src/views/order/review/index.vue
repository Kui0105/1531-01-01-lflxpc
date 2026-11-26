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
                            <span
                                v-for="(img, index) in row.images"
                                :key="index"
                                class="proof-image"
                                @click="openDetail(row)"
                            >
                                {{ img }}
                            </span>
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
                <el-table-column label="操作" min-width="160" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看评价</el-button>
                        <el-button
                            v-if="row.status === 'shown'"
                            type="warning"
                            link
                            size="small"
                            @click="hideReview(row)"
                        >
                            隐藏评价
                        </el-button>
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
                        <span v-for="(img, index) in currentItem.images" :key="index" class="proof-image">{{ img }}</span>
                    </div>
                    <div v-if="currentItem.reply" class="reply-box">
                        <span class="reply-label">商家回复：</span>{{ currentItem.reply }}
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">用户端展示效果</span></template>
                    <div class="preview-wrap">
                        <div class="preview-card">
                            <div class="preview-head">
                                <span class="avatar" :style="{ background: currentItem.avatarColor }">
                                    {{ currentItem.nickname.charAt(0) }}
                                </span>
                                <div class="preview-head-main">
                                    <div class="preview-name">{{ currentItem.nickname }}</div>
                                    <el-rate :model-value="currentItem.rating" disabled allow-half size="small" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
                                </div>
                                <span class="preview-time">{{ currentItem.reviewTime.slice(0, 10) }}</span>
                            </div>
                            <div class="preview-content">{{ currentItem.content }}</div>
                            <div class="preview-tags">
                                <el-tag v-for="tag in currentItem.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                            </div>
                            <div v-if="currentItem.images.length" class="preview-images">
                                <span v-for="(img, index) in currentItem.images" :key="index" class="preview-image">{{ img }}</span>
                            </div>
                            <div v-if="currentItem.reply" class="preview-reply">商家回复：{{ currentItem.reply }}</div>
                        </div>
                        <div v-if="currentItem.status === 'hidden'" class="preview-hidden-tip">
                            该评价已隐藏，用户端服务详情与康复师详情不再展示
                        </div>
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

// 隐藏评价（二次确认）
const hideReview = (row: ReviewItem) => {
    ElMessageBox.confirm(
        `确认隐藏该评价？隐藏后用户端服务详情与康复师详情将不再展示该评价。`,
        '隐藏评价二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.status = 'hidden'
            ElMessage.success('评价已隐藏')
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

.preview-wrap {
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
}

.preview-card {
    padding: 16px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 8px;
}

.preview-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.preview-head-main {
    flex: 1;
}

.preview-name {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.preview-time {
    font-size: 12px;
    color: #c0c4cc;
}

.preview-content {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.8;
    color: #303133;
}

.preview-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.preview-images {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.preview-image {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    font-size: 11px;
    color: #909399;
    background: #f5f7fa;
    border-radius: 4px;
}

.preview-reply {
    margin-top: 10px;
    padding: 8px 10px;
    font-size: 13px;
    color: #606266;
    background: #f5f7fa;
    border-radius: 4px;
}

.preview-hidden-tip {
    margin-top: 12px;
    padding: 10px 14px;
    font-size: 13px;
    color: #909399;
    text-align: center;
    background: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
}

:deep(.review-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
