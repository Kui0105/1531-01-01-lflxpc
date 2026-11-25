<template>
    <div class="consumer-lists">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input
                v-model="keyword"
                placeholder="用户昵称"
                clearable
                class="!w-[200px]"
            />
            <el-input
                v-model="mobile"
                placeholder="手机号"
                clearable
                class="!w-[200px]"
            />
            <div class="date-range-wrap">
                <daterange-picker v-model:startTime="startTime" v-model:endTime="endTime" />
            </div>
            <el-button type="primary" @click="queryParams.keyword = keyword.trim()">
                查询
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button class="ml-auto" @click="exportList">导出</el-button>
        </div>

        <!-- 用户列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <template #header>
                <span class="header-title">用户列表</span>
            </template>
            <el-table :data="filteredUsers" style="width: 100%">
                <el-table-column prop="id" label="用户ID" min-width="140" align="center" />
                <el-table-column label="用户头像" min-width="140" align="center">
                    <template #default="{ row }">
                        <span class="avatar" :style="{ background: row.avatarColor }">
                            {{ row.nickname.charAt(0) }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称" min-width="140" align="center" />
                <el-table-column prop="mobile" label="手机号码" min-width="140" align="center" />
                <el-table-column label="会员等级" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-tag :type="levelTag(row.level)" size="small" effect="light">
                            {{ row.level }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="积分余额" min-width="140" align="center">
                    <template #default="{ row }">
                        <span class="points">{{ row.points.toLocaleString('zh-CN') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-tag
                            :type="row.status === 'normal' ? 'success' : 'info'"
                            size="small"
                            effect="light"
                        >
                            {{ row.status === 'normal' ? '正常' : '已禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="registerTime" label="注册时间" min-width="140" align="center" />
                <el-table-column label="操作" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openDetail(row)">查看详情</el-button>
                        <el-button type="primary" link @click="openArchive(row)">康复档案</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 用户详情：当前路由下切换，保留左侧导航 -->
        <el-drawer v-model="detailVisible" size="1000px">
            <template #header>
                <span class="header-title">用户详情 - {{ currentDetailName }}</span>
            </template>
            <detail-panel v-if="currentDetailId" :user-id="currentDetailId" />
        </el-drawer>

        <!-- 康复档案：时间轴 -->
        <el-drawer v-model="archiveVisible" size="900px">
            <template #header>
                <span class="header-title">康复档案 - {{ currentUser?.nickname }}</span>
            </template>
            <div class="drawer-tip">
                档案类型分为评估报告、康复纪要、康复小结；评估报告为评估服务完成后生成的报告结果，
                康复纪要为康复服务完成后康复师填写的内容，康复小结为单次服务完成时填写的内容。
            </div>
            <el-timeline>
                <el-timeline-item
                    v-for="item in archives"
                    :key="item.time"
                    :timestamp="item.time"
                    placement="top"
                >
                    <el-card class="archive-item" shadow="never">
                        <div class="archive-head">
                            <el-tag :type="archiveTag(item.type)" size="small" effect="light">
                                {{ item.type }}
                            </el-tag>
                            <span class="archive-name">{{ item.name }}</span>
                        </div>
                        <div class="archive-line">记录内容：{{ item.content }}</div>
                        <div class="archive-line">
                            门店名称：{{ item.store }}　康复师姓名：{{ item.therapist }}
                        </div>
                        <el-button type="primary" link @click="openReport(item)">查看报告</el-button>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-drawer>

        <!-- 评估报告结果 -->
        <el-dialog v-model="reportVisible" title="评估报告结果" width="560px">
            <div class="report-meta">
                <span>{{ currentArchive?.name }}</span>
                <span class="report-time">{{ currentArchive?.time }}</span>
            </div>
            <div class="report-content">{{ currentArchive?.result }}</div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="consumerLists">
import { exportCsv } from '@/utils/export-csv'

import DetailPanel from './components/detail-panel.vue'
import { detailData, users } from './data'
import type { ArchiveRecord, UserItem } from './data'

const keyword = ref('')
const mobile = ref('')
const startTime = ref('')
const endTime = ref('')
const queryParams = reactive({ keyword: '' })

const filteredUsers = computed(() =>
    users.filter((user) => {
        const matchKeyword =
            !queryParams.keyword || user.nickname.includes(queryParams.keyword)
        const matchMobile = !mobile.value || user.mobile.includes(mobile.value)
        const day = user.registerTime.slice(0, 10)
        const matchStart = !startTime.value || day >= startTime.value
        const matchEnd = !endTime.value || day <= endTime.value
        return matchKeyword && matchMobile && matchStart && matchEnd
    })
)

const resetSearch = () => {
    keyword.value = ''
    mobile.value = ''
    startTime.value = ''
    endTime.value = ''
    queryParams.keyword = ''
}

const exportList = () => {
    exportCsv(
        '用户列表',
        ['用户ID', '用户昵称', '手机号码', '会员等级', '积分余额', '状态', '注册时间'],
        filteredUsers.value.map((user) => [
            user.id,
            user.nickname,
            user.mobile,
            user.level,
            user.points,
            user.status === 'normal' ? '正常' : '已禁用',
            user.registerTime
        ])
    )
}

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

const levelTag = (level: string): TagType => {
    const map: Record<string, TagType> = {
        铂金会员: 'warning',
        黄金会员: 'primary',
        白银会员: 'info',
        普通会员: 'info'
    }
    return map[level] || 'info'
}

// 用户详情改为当前路由下抽屉展示，保留左侧导航
const detailVisible = ref(false)
const currentDetailId = ref(0)
const currentDetailName = computed(
    () => users.find((item) => item.id === currentDetailId.value)?.nickname || ''
)
const openDetail = (row: UserItem) => {
    currentDetailId.value = row.id
    detailVisible.value = true
}

const archiveVisible = ref(false)
const reportVisible = ref(false)
const currentUser = ref<UserItem | null>(null)
const currentArchive = ref<ArchiveRecord | null>(null)
const archives = computed(() => (currentUser.value ? detailData[currentUser.value.id]?.archives || [] : []))

const openArchive = (row: UserItem) => {
    currentUser.value = row
    archiveVisible.value = true
}

const archiveTag = (type: ArchiveRecord['type']): TagType => {
    const map: Record<ArchiveRecord['type'], TagType> = {
        评估报告: 'primary',
        康复纪要: 'success',
        康复小结: 'warning'
    }
    return map[type]
}

const openReport = (row: ArchiveRecord) => {
    currentArchive.value = row
    reportVisible.value = true
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

.date-range-wrap {
    width: 400px;

    :deep(.el-date-editor) {
        width: 100% !important;
    }
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
    width: 34px;
    height: 34px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 50%;
}

.points {
    font-weight: 600;
    color: #e6a23c;
}

.drawer-tip {
    margin-bottom: 18px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.7;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
}

.archive-item {
    border-radius: 8px;

    .archive-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .archive-name {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
    }

    .archive-line {
        margin: 6px 0;
        font-size: 13px;
        color: #606266;
    }
}

.report-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.report-time {
    font-size: 12px;
    font-weight: 400;
    color: #909399;
}

.report-content {
    padding: 16px;
    font-size: 14px;
    line-height: 1.9;
    color: #606266;
    background: #f8f9fb;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}
</style>
