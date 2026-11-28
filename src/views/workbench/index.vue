<template>
    <div class="workbench">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-select
                v-model="selectedStore"
                placeholder="全部门店"
                clearable
                class="!w-[220px]"
            >
                <el-option label="全部门店" value="" />
                <el-option
                    v-for="item in data.stores"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
            <el-button @click="selectedStore = ''">重置</el-button>
            <el-button type="primary" :loading="loading" @click="getData">刷新</el-button>
            <span class="filter-scope">
                当前统计范围：<b>{{ storeName }}</b>
            </span>
        </div>

        <!-- 今日数据 / 累计数据 -->
        <div class="lg:flex gap-4 mt-4">
            <el-card class="stat-card flex-1" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">今日数据</span>
                        <span class="header-scope">{{ storeName }}</span>
                    </div>
                </template>
                <div class="stat-grid">
                    <div v-for="item in todayItems" :key="item.label" class="stat-item">
                        <div class="stat-label">{{ item.label }}</div>
                        <div class="stat-value">{{ item.value }}</div>
                        <div v-if="item.sub" class="stat-sub">{{ item.sub }}</div>
                    </div>
                </div>
            </el-card>
            <el-card class="stat-card lg:w-1/3 mt-4 lg:mt-0" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">累计数据</span>
                        <span class="header-scope">累计至今日</span>
                    </div>
                </template>
                <div class="stat-grid stat-grid--three">
                    <div v-for="item in totalItems" :key="item.label" class="stat-item">
                        <div class="stat-label">{{ item.label }}</div>
                        <div class="stat-value stat-value--total">{{ item.value }}</div>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 复测待办 + 近七日营收趋势图 并列 -->
        <div class="lg:flex gap-4 mt-4">
            <!-- 复测待办（管理端只展示，处理状态由用户端店长操作） -->
            <el-card class="retest-card lg:w-2/5 mt-4 lg:mt-0" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">复测待办</span>
                        <span class="header-scope">待处理 {{ retestFiltered.length }} 人</span>
                    </div>
                </template>
                <div class="retest-tip">状态由用户端店长操作，管理端仅作展示</div>
                <el-table :data="retestTodos" style="width: 100%" :cell-style="{ padding: '8px 0' }">
                    <el-table-column label="头像" min-width="70" width="70" align="center">
                        <template #default="{ row }">
                            <span class="retest-avatar" :style="{ background: row.avatarColor }">
                                {{ row.nickname.charAt(0) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="昵称/姓名" min-width="110" align="center">
                        <template #default="{ row }">
                            <div class="retest-user">
                                <span class="retest-nickname">{{ row.nickname }}</span>
                                <span class="retest-realname">{{ row.realName }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="retestTime" label="复测时间" min-width="140" align="center" />
                    <el-table-column prop="store" label="归属门店" min-width="85" align="center" />
                    <el-table-column label="状态" min-width="80" align="center">
                        <template #default>
                            <el-tag type="warning" size="small" effect="light">待处理</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="retest-pagination">
                    <el-pagination
                        v-model:current-page="retestPage"
                        :page-size="retestPageSize"
                        :total="retestFiltered.length"
                        layout="total, prev, pager, next"
                        background
                        small
                    />
                </div>
            </el-card>

            <!-- 近七日营收趋势图 -->
            <el-card class="chart-card flex-1 mt-4 lg:mt-0" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span class="header-title">近七日营收趋势图</span>
                        <div class="chart-summary">
                            <span class="summary-item">
                                日均营收 <b>{{ formatMoney(trendSummary.avg) }}</b>
                            </span>
                            <i class="summary-divider" />
                            <span class="summary-item">
                                最高营收 <b class="summary-high">{{ formatMoney(trendSummary.max) }}</b>
                            </span>
                            <i class="summary-divider" />
                            <span class="summary-item">
                                最低营收 <b class="summary-low">{{ formatMoney(trendSummary.min) }}</b>
                            </span>
                        </div>
                    </div>
                </template>
                <div class="chart-body">
                    <v-charts :option="trendOption" :autoresize="true" />
                </div>
            </el-card>
        </div>

        <!-- 本月排行 -->
        <div class="lg:flex gap-4 mt-4">
            <el-card
                v-for="rank in rankCards"
                :key="rank.title"
                class="rank-card flex-1 mt-4 lg:mt-0"
                shadow="never"
            >
                <template #header>
                    <div class="card-header">
                        <span class="header-title">{{ rank.title }}</span>
                        <span class="header-scope">TOP {{ rank.rows.length }}</span>
                    </div>
                </template>
                <div class="rank-list">
                    <div v-for="row in rank.rows" :key="row.rank" class="rank-row">
                        <span class="rank-badge" :class="`rank-badge--${row.rank}`">
                            {{ row.rank }}
                        </span>
                        <div class="rank-info">
                            <div class="rank-line">
                                <span class="rank-name">{{ row.name }}</span>
                                <span class="rank-amount">{{ formatMoney(row.amount) }}</span>
                            </div>
                            <div class="rank-progress">
                                <div
                                    class="rank-progress-inner"
                                    :style="{ width: rankWidth(rank.rows, row.amount) }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup name="workbench">
import vCharts from 'vue-echarts'
import { cloneDeep } from 'lodash-es'

import { getWorkbench } from '@/api/app'
import useSettingStore from '@/stores/modules/setting'

import { overviewData } from './data'
import type { RankItem, RetestTodo, TodayData, TotalData } from './data'

const settingStore = useSettingStore()

const data = reactive(cloneDeep(overviewData))
const selectedStore = ref('')
const loading = ref(false)

const formatMoney = (value: number) => `¥${value.toLocaleString('zh-CN')}`

const storeName = computed(
    () => data.stores.find((item) => item.id === selectedStore.value)?.name || '全部门店'
)

const currentToday = computed<TodayData>(
    () =>
        (selectedStore.value && data.storeData[selectedStore.value]?.today) || data.platform.today
)
const currentTotal = computed<TotalData>(
    () =>
        (selectedStore.value && data.storeData[selectedStore.value]?.total) || data.platform.total
)

const todayItems = computed(() => {
    const today = currentToday.value
    const items = [
        { label: '今日营收', value: formatMoney(today.revenue), sub: '' },
        { label: '今日产值', value: formatMoney(today.output), sub: '' },
        { label: '今日预约', value: String(today.appointment), sub: '单' },
        {
            label: '服务订单',
            value: String(today.serviceOrders),
            sub: `金额 ${formatMoney(today.serviceAmount)}`
        }
    ]
    // 选择门店后不展示商品订单
    if (!selectedStore.value) {
        items.push({
            label: '商品订单',
            value: String(today.goodsOrders),
            sub: `金额 ${formatMoney(today.goodsAmount)}`
        })
    }
    return items
})

const totalItems = computed(() => [
    { label: '总营收金额', value: formatMoney(currentTotal.value.revenue) },
    { label: '总产值金额', value: formatMoney(currentTotal.value.output) },
    { label: '总预付金额', value: formatMoney(currentTotal.value.prepay) }
])

const trendSummary = computed(() => {
    const list = data.trend.revenue
    return {
        max: Math.max(...list),
        min: Math.min(...list),
        avg: Math.round(list.reduce((sum, value) => sum + value, 0) / (list.length || 1))
    }
})

const rankWidth = (rows: RankItem[], amount: number) => {
    const max = Math.max(...rows.map((item) => item.amount))
    return `${Math.round((amount / max) * 100)}%`
}

const rankCards = computed(() => [
    { title: '营收排行（本月）', rows: data.revenueRank },
    { title: '产值排行（本月）', rows: data.outputRank }
])

// 复测待办：跟随门店筛选联动，管理端只展示不操作
const retestFiltered = computed<RetestTodo[]>(() => {
    const all = data.retestTodos || []
    const store = selectedStore.value
    const list = store ? all.filter((item) => data.stores.find((s) => s.id === store)?.name === item.store) : all
    return [...list].sort((a, b) => b.retestTime.localeCompare(a.retestTime))
})

// 复测待办分页
const retestPage = ref(1)
const retestPageSize = ref(5)
const retestTodos = computed<RetestTodo[]>(() => {
    const start = (retestPage.value - 1) * retestPageSize.value
    return retestFiltered.value.slice(start, start + retestPageSize.value)
})
// 门店切换后回到第一页
watch(selectedStore, () => { retestPage.value = 1 })

const trendOption = computed(() => ({
    tooltip: {
        trigger: 'axis',
        valueFormatter: (value: any) => formatMoney(Number(value))
    },
    grid: { left: 10, right: 10, top: 30, bottom: 10, containLabel: true },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.trend.date,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#909399' }
    },
    yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: {
            color: '#909399',
            formatter: (value: number) => (value >= 10000 ? `${value / 10000}万` : `${value}`)
        }
    },
    series: [
        {
            name: '营收',
            type: 'line',
            smooth: true,
            symbolSize: 7,
            data: data.trend.revenue,
            lineStyle: { color: settingStore.theme, width: 3 },
            itemStyle: { color: settingStore.theme, borderColor: '#fff', borderWidth: 2 },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: settingStore.theme },
                        { offset: 1, color: settingStore.theme }
                    ]
                },
                opacity: 0.16
            }
        }
    ]
}))

// 获取工作台数据，接口不可用时保留本地演示数据
const getData = async () => {
    loading.value = true
    try {
        const res: any = await getWorkbench()
        const overview = res?.overview
        if (overview) {
            if (overview.stores?.length) data.stores = overview.stores
            if (overview.platform) Object.assign(data.platform, overview.platform)
            if (overview.storeData) Object.assign(data.storeData, overview.storeData)
            if (overview.trend) Object.assign(data.trend, overview.trend)
            if (overview.revenueRank?.length) data.revenueRank = overview.revenueRank
            if (overview.outputRank?.length) data.outputRank = overview.outputRank
            if (overview.retestTodos?.length) data.retestTodos = overview.retestTodos
        }
    } catch (error) {
        // 使用本地演示数据
    } finally {
        loading.value = false
    }
}

onMounted(getData)
</script>

<style lang="scss" scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: #fff;
    border: 1px solid #ebedf0;
    border-radius: 10px;
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

.filter-scope {
    margin-left: auto;
    font-size: 13px;
    color: #909399;

    b {
        font-weight: 600;
        color: var(--el-color-primary);
    }
}

.stat-card,
.chart-card,
.rank-card,
.retest-card {
    border: 1px solid #ebedf0;
    border-radius: 10px;
    box-shadow: none;
}

// 趋势图卡片撑满与左侧等高，消除底部留白
.chart-card {
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
        flex: 1;
        display: flex;
        min-height: 0;
        padding-top: 8px;
    }

    .chart-body {
        flex: 1;
        min-height: 320px;
    }
}

.retest-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #f0f2f5;
}

.retest-tip {
    margin-bottom: 10px;
    font-size: 12px;
    color: #909399;
}

.retest-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    border-radius: 50%;
}

.retest-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.retest-nickname {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
}

.retest-realname {
    font-size: 12px;
    color: #909399;
}

.card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
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

.header-scope {
    font-size: 12px;
    color: #909399;
}

.stat-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
}

.stat-grid--three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1200px) {
    .stat-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .stat-grid,
    .stat-grid--three {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 108px;
    padding: 14px 12px;
    text-align: center;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
        background: #fafbff;
        border-color: #d9def5;
    }
}

.stat-label {
    font-size: 13px;
    color: #909399;
}

.stat-value {
    margin-top: 8px;
    font-size: 22px;
    font-weight: 700;
    color: var(--el-color-primary);
    white-space: nowrap;
}

.stat-value--total {
    font-size: 18px;
}

.stat-sub {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 10px;
    font-size: 12px;
    color: #a0a6b0;
    background: #f6f8fb;
    border-radius: 12px;
}

.chart-summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
}

.summary-item {
    font-size: 12px;
    color: #909399;

    b {
        margin-left: 4px;
        font-weight: 600;
        color: #303133;
    }
}

.summary-high {
    color: #f56c6c !important;
}

.summary-low {
    color: #67c23a !important;
}

.summary-divider {
    width: 1px;
    height: 12px;
    background: #e5e7eb;
}

.rank-list {
    padding: 2px 0;
}

.rank-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
}

.rank-badge {
    display: inline-flex;
    flex: 0 0 28px;
    align-items: center;
    justify-content: center;
    height: 28px;
    font-size: 14px;
    font-weight: 600;
    color: #909399;
    background: #f4f4f5;
    border-radius: 8px;

    &--1 {
        color: #fff;
        background: #f0a020;
    }

    &--2 {
        color: #fff;
        background: #a8b0bd;
    }

    &--3 {
        color: #fff;
        background: #d09a6c;
    }
}

.rank-info {
    flex: 1;
    min-width: 0;
}

.rank-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
}

.rank-name {
    color: #303133;
}

.rank-amount {
    font-weight: 600;
    color: #303133;
}

.rank-progress {
    height: 4px;
    margin-top: 8px;
    overflow: hidden;
    background: #f0f2f5;
    border-radius: 2px;
}

.rank-progress-inner {
    height: 100%;
    background: var(--el-color-primary);
    border-radius: 2px;
}
</style>
