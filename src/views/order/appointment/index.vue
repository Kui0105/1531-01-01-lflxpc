<template>
    <div class="appointment-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称" clearable class="!w-[160px]" />
            <el-input v-model="mobile" placeholder="手机号" clearable class="!w-[160px]" />
            <el-select v-model="store" placeholder="门店" clearable class="!w-[130px]">
                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="therapist" placeholder="康复师" clearable class="!w-[130px]">
                <el-option v-for="item in therapists" :key="item.name" :label="item.name" :value="item.name" />
            </el-select>
            <el-date-picker
                v-model="date"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="预约日期"
                class="!w-[160px]"
            />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button class="ml-auto" @click="exportList">导出</el-button>
        </div>

        <!-- 状态TAB -->
        <el-card class="list-card mt-4" shadow="never">
            <el-tabs v-model="activeTab">
                <el-tab-pane
                    v-for="tab in statusTabs"
                    :key="tab.value"
                    :label="tab.label"
                    :name="tab.value"
                />
            </el-tabs>

            <el-table class="appointment-table" :data="filteredList" style="width: 100%">
                <el-table-column prop="orderNo" label="关联订单号" min-width="140" align="center" show-overflow-tooltip />
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
                <el-table-column prop="store" label="预约门店" min-width="140" align="center" />
                <el-table-column prop="therapist" label="预约康复师" min-width="140" align="center" />
                <el-table-column prop="service" label="预约服务/评估项目" min-width="140" align="center" show-overflow-tooltip />
                <el-table-column label="预约日期/时段" min-width="160" align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.date }} {{ row.timeslot }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="140" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusTag(row.status)" size="small" effect="light">
                            {{ getStatusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="submitTime" label="提交时间" min-width="140" align="center" show-overflow-tooltip />
                <el-table-column label="操作" min-width="100" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 预约详情 -->
        <el-drawer v-model="detailVisible" size="760px">
            <template #header>
                <span class="header-title">预约详情 - {{ currentItem?.no }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">门店信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">预约门店</span><span class="info-value">{{ currentItem.store }}</span></div>
                        <div class="info-item"><span class="info-label">门店地址</span><span class="info-value">{{ currentItem.store }}中心店</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">康复师信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">康复师</span><span class="info-value">{{ currentItem.therapist }}</span></div>
                        <div class="info-item"><span class="info-label">职称</span><span class="info-value">{{ currentItem.therapistTitle }}</span></div>
                        <div class="info-item"><span class="info-label">联系电话</span><span class="info-value">020-8888xxxx</span></div>
                        <div class="info-item">
                            <span class="info-label">操作</span>
                            <el-button type="primary" link size="small" @click="openChange">更换康复师</el-button>
                        </div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">预约信息</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">预约服务</span><span class="info-value">{{ currentItem.service }}</span></div>
                        <div class="info-item"><span class="info-label">关联职称</span><span class="info-value">{{ currentItem.serviceTitle === 'chief' ? '仅首席康复师' : '所有职称' }}</span></div>
                        <div class="info-item"><span class="info-label">预约时间</span><span class="info-value">{{ currentItem.date }} {{ currentItem.timeslot }}</span></div>
                        <div class="info-item"><span class="info-label">关联订单</span><span class="info-value">{{ currentItem.orderNo }}</span></div>
                        <div class="info-item"><span class="info-label">状态</span><span class="info-value">{{ getStatusLabel(currentItem.status) }}</span></div>
                        <div class="info-item"><span class="info-label">提交时间</span><span class="info-value">{{ currentItem.submitTime }}</span></div>
                    </div>
                    <div class="rule-tip">
                        预约以整点、半点为时段起点，每段半小时，仅记录开始时间（如 10:00）；同一时段并发提交时锁定该时段，已被预约的时段不可被员工手动占用；
                        预约时间前 ≤1 小时不可改期/取消，员工端与管理端操作口径一致。
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">操作日志</span></template>
                    <el-table :data="currentItem.logs" style="width: 100%">
                        <el-table-column prop="time" label="操作时间" min-width="160" />
                        <el-table-column prop="operator" label="操作人" min-width="140" />
                        <el-table-column prop="action" label="操作内容" min-width="240" />
                    </el-table>
                </el-card>
            </template>
        </el-drawer>

        <!-- 更换康复师 -->
        <el-dialog v-model="changeVisible" title="更换康复师" width="460px">
            <div class="form-row">
                <span class="form-label">康复师</span>
                <el-select v-model="selectedTherapist" class="!w-[260px]" placeholder="请选择康复师">
                    <el-option
                        v-for="item in availableTherapists"
                        :key="item.name"
                        :label="`${item.name}（${item.title}）`"
                        :value="item.name"
                    />
                </el-select>
            </div>
            <div class="change-tip">根据服务关联职称筛选可更换的康复师，保存后同步记录操作人及操作内容。</div>
            <template #footer>
                <el-button @click="changeVisible = false">取消</el-button>
                <el-button type="primary" @click="submitChange">确认更换</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="appointmentList">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { appointments, statusLabels, statusTabs, statusTagTypes, storeOptions, therapists } from './data'
import type { AppointmentItem, AppointmentStatus } from './data'

const getStatusTag = (status: any) => statusTagTypes[status as AppointmentStatus]
const getStatusLabel = (status: any) => statusLabels[status as AppointmentStatus]

const data = reactive(cloneDeep(appointments))
const keyword = ref('')
const mobile = ref('')
const store = ref('')
const therapist = ref('')
const date = ref('')
const activeTab = ref('')
const query = reactive({ keyword: '', mobile: '', store: '', therapist: '', date: '' })

const filteredList = computed(() =>
    data.filter((item) => {
        const matchKeyword = !query.keyword || item.nickname.includes(query.keyword)
        const matchMobile = !query.mobile || item.mobile.includes(query.mobile)
        const matchStore = !query.store || item.store === query.store
        const matchTherapist = !query.therapist || item.therapist === query.therapist
        const matchDate = !query.date || item.date === query.date
        const matchStatus = !activeTab.value || item.status === activeTab.value
        return matchKeyword && matchMobile && matchStore && matchTherapist && matchDate && matchStatus
    })
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.mobile = mobile.value.trim()
    query.store = store.value
    query.therapist = therapist.value
    query.date = date.value
}
const resetSearch = () => {
    keyword.value = ''
    mobile.value = ''
    store.value = ''
    therapist.value = ''
    date.value = ''
    activeTab.value = ''
    handleSearch()
}

const detailVisible = ref(false)
const currentItem = ref<AppointmentItem | null>(null)
const openDetail = (row: AppointmentItem) => {
    currentItem.value = row
    detailVisible.value = true
}

const changeVisible = ref(false)
const selectedTherapist = ref('')
const availableTherapists = computed(() => {
    if (!currentItem.value) return []
    return currentItem.value.serviceTitle === 'chief'
        ? therapists.filter((item) => item.title === '首席康复师')
        : therapists
})
const openChange = () => {
    selectedTherapist.value = currentItem.value?.therapist || ''
    changeVisible.value = true
}
const submitChange = () => {
    if (!currentItem.value || !selectedTherapist.value) return
    if (selectedTherapist.value === currentItem.value.therapist) {
        ElMessage.warning('康复师未变更')
        return
    }
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    currentItem.value.therapist = selectedTherapist.value
    currentItem.value.therapistTitle =
        therapists.find((item) => item.name === selectedTherapist.value)?.title || ''
    currentItem.value.logs.unshift({
        time,
        operator: '管理员',
        action: `更换康复师为 ${selectedTherapist.value}`
    })
    changeVisible.value = false
    ElMessage.success('康复师已更换')
}

const exportList = () => {
    const headers = ['关联订单号', '用户昵称', '手机号', '预约门店', '预约康复师', '预约服务', '预约日期/时段', '状态', '提交时间']
    const rows = filteredList.value.map((item) => [
        item.orderNo,
        item.nickname,
        item.mobile,
        item.store,
        item.therapist,
        item.service,
        `${item.date} ${item.timeslot}`,
        getStatusLabel(item.status),
        item.submitTime
    ])
    const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `预约列表_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
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
    max-width: 100%;
    white-space: nowrap;
}

.user-text {
    overflow: hidden;
    text-overflow: ellipsis;
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

.rule-tip {
    margin-top: 16px;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.8;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.form-label {
    flex: 0 0 70px;
    font-size: 14px;
    color: #606266;
}

.change-tip {
    margin-top: 14px;
    font-size: 12px;
    color: #909399;
}

:deep(.appointment-table .el-table__cell .cell) {
    white-space: nowrap;
}
</style>
