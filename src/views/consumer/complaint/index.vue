<template>
    <div class="complaint-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-select v-model="store" placeholder="投诉门店" clearable class="!w-[160px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="status" placeholder="状态" clearable class="!w-[160px]">
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <div class="date-range-wrap">
                <daterange-picker v-model:startTime="startTime" v-model:endTime="endTime" />
            </div>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button class="ml-auto" @click="exportList">导出</el-button>
        </div>

        <!-- 规则说明 -->
        <div class="rule-tip">
            <p>
                标记扣分：扣除投诉当月康复师绩效评分【客户满意度综合平均分】，标记一次扣除 1 分；
                每月最后一天 0 点核算扣分，在此之前都可取消扣分；未标记的投诉超出当月后不展示标记按钮。
            </p>
            <p>
                处理结果：管理端处理投诉为已完成后给用户发送投诉处理结果提醒，并同步提醒服务门店店长查看。
            </p>
            <p>
                订阅消息：用户提交投诉时接入订阅消息，同意则同时发送订阅消息与站内消息，拒绝则只发送站内消息。
            </p>
        </div>

        <!-- 投诉反馈列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <template #header>
                <span class="header-title">投诉反馈</span>
            </template>
            <el-table class="complaint-table" :data="filteredList" style="width: 100%">
                <el-table-column prop="userId" label="用户ID" min-width="130" align="center" />
                <el-table-column label="用户头像" min-width="130" align="center">
                    <template #default="{ row }">
                        <span class="avatar" :style="{ background: row.avatarColor }">
                            {{ row.nickname.charAt(0) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称" min-width="130" align="center" show-overflow-tooltip />
                <el-table-column prop="mobile" label="联系电话" min-width="130" align="center" />
                <el-table-column prop="store" label="投诉门店" min-width="130" align="center" />
                <el-table-column prop="therapist" label="投诉康复师" min-width="130" align="center" />
                <el-table-column prop="type" label="投诉类型" min-width="130" align="center" />
                <el-table-column prop="content" label="投诉内容" min-width="130" align="center" show-overflow-tooltip />
                <el-table-column label="状态" min-width="130" align="center">
                    <template #default="{ row }">
                        <el-tag :type="statusTag(row.status)" size="small" effect="light">
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="投诉时间" min-width="130" align="center" show-overflow-tooltip />
                <el-table-column label="操作" min-width="130" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button
                            v-if="canOperate(row) && !row.deducted"
                            type="primary"
                            link
                            @click="markDeduct(row)"
                        >
                            标记扣分
                        </el-button>
                        <el-button
                            v-if="canOperate(row) && row.deducted"
                            type="warning"
                            link
                            @click="cancelDeduct(row)"
                        >
                            取消扣分
                        </el-button>
                        <span v-if="!canOperate(row)" class="text-muted">-</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="complaintList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { exportCsv } from '@/utils/export-csv'

import { complaints, statusOptions, storeOptions } from './data'
import type { ComplaintItem, ComplaintStatus } from './data'

const data = reactive(cloneDeep(complaints))
const store = ref('')
const status = ref<ComplaintStatus | ''>('')
const startTime = ref('')
const endTime = ref('')
const query = reactive({ store: '', status: '' as ComplaintStatus | '', startTime: '', endTime: '' })

const filteredList = computed(() =>
    data.filter((item) => {
        const matchStore = !query.store || item.store === query.store
        const matchStatus = !query.status || item.status === query.status
        const day = item.time.slice(0, 10)
        const matchStart = !query.startTime || day >= query.startTime
        const matchEnd = !query.endTime || day <= query.endTime
        return matchStore && matchStatus && matchStart && matchEnd
    }).sort((a, b) => b.time.localeCompare(a.time))
)

const handleSearch = () => {
    query.store = store.value
    query.status = status.value
    query.startTime = startTime.value
    query.endTime = endTime.value
}
const resetSearch = () => {
    store.value = ''
    status.value = ''
    startTime.value = ''
    endTime.value = ''
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '投诉反馈',
        ['用户ID', '用户昵称', '联系电话', '投诉门店', '投诉康复师', '投诉类型', '投诉内容', '状态', '投诉时间'],
        filteredList.value.map((item) => [
            item.userId,
            item.nickname,
            item.mobile,
            item.store,
            item.therapist,
            item.type,
            item.content,
            statusLabel(item.status),
            item.time
        ])
    )
}

const statusLabel = (value: ComplaintStatus) => {
    const map: Record<ComplaintStatus, string> = {
        pending: '待处理',
        processing: '处理中',
        done: '已完成'
    }
    return map[value]
}
const statusTag = (value: ComplaintStatus): 'warning' | 'primary' | 'success' => {
    const map: Record<ComplaintStatus, 'warning' | 'primary' | 'success'> = {
        pending: 'warning',
        processing: 'primary',
        done: 'success'
    }
    return map[value]
}

// 仅当月投诉可标记/取消扣分，超出当月不可操作
const currentMonth = '2026-11'
const canOperate = (row: ComplaintItem) => row.time.startsWith(currentMonth)

const markDeduct = async (row: ComplaintItem) => {
    await ElMessageBox.confirm(
        `确认标记扣分？将扣除康复师「${row.therapist}」当月客户满意度综合平均分 1 分。`,
        '标记扣分',
        { type: 'warning', confirmButtonText: '确认标记', cancelButtonText: '取消' }
    )
    row.deducted = true
    ElMessage.success('标记成功')
}

const cancelDeduct = async (row: ComplaintItem) => {
    await ElMessageBox.confirm(
        `确认取消扣分？将恢复康复师「${row.therapist}」当月客户满意度综合平均分 1 分。`,
        '取消扣分',
        { type: 'warning', confirmButtonText: '确认取消', cancelButtonText: '返回' }
    )
    row.deducted = false
    ElMessage.success('取消成功')
}
</script>

<style lang="scss" scoped>
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
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
    width: 400px;

    :deep(.el-date-editor) {
        width: 100% !important;
    }
}

.rule-tip {
    margin-top: 14px;
    padding: 12px 16px;
    font-size: 13px;
    line-height: 1.8;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 8px;

    p {
        margin: 0;
    }
}

.list-card {
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

.avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 50%;
}

.text-muted {
    color: #c0c4cc;
}

:deep(.complaint-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
