<template>
    <div class="distribution-list">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="query.name" placeholder="用户昵称" clearable class="!w-[160px]" />
            <el-input v-model="query.phone" placeholder="手机号" clearable class="!w-[160px]" />
            <el-select v-model="query.level" placeholder="分销等级" clearable class="!w-[140px]">
                <el-option v-for="item in distributionLevelOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="query.status" placeholder="状态" clearable class="!w-[120px]">
                <el-option label="启用" value="on" />
                <el-option label="停用" value="off" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" plain class="ml-auto" @click="openAssign">指定分销</el-button>
        </div>

        <!-- 列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="用户头像" width="90" align="center">
                    <template #default="{ row }">
                        <el-image :src="row.avatar" fit="cover" class="user-avatar" :preview-src-list="[row.avatar]" preview-teleported />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="用户昵称" min-width="120" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'disabled-name': row.status === 'off' }">{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" min-width="130" align="center" />
                <el-table-column label="分销等级" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" effect="plain">{{ row.level }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="teamCount" label="推广人数" min-width="100" align="center" />
                <el-table-column prop="orderCount" label="推广订单数" min-width="110" align="center" />
                <el-table-column label="佣金余额" min-width="110" align="center">
                    <template #default="{ row }"><span class="money">¥{{ money(row.balance) }}</span></template>
                </el-table-column>
                <el-table-column label="累计佣金" min-width="110" align="center">
                    <template #default="{ row }">¥{{ money(row.totalCommission) }}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="90" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'on' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="注册时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="230" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                        <el-button type="primary" link size="small" @click="openAdjust(row)">调整等级</el-button>
                        <el-button v-if="row.status === 'on'" type="warning" link size="small" @click="toggleStatus(row)">停用</el-button>
                        <el-button v-else type="success" link size="small" @click="toggleStatus(row)">启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 指定分销弹窗 -->
        <el-dialog v-model="assignVisible" title="指定分销" width="520px" class="distribution-dialog">
            <el-form :model="assignForm" label-width="100px">
                <el-form-item label="选择用户" required>
                    <el-select v-model="assignForm.userId" filterable placeholder="请选择系统内用户" class="!w-full">
                        <el-option
                            v-for="u in systemUsers"
                            :key="u.id"
                            :label="`${u.name}（${u.phone}）`"
                            :value="u.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="分销等级" required>
                    <el-select v-model="assignForm.level" placeholder="请选择分销等级" class="!w-full">
                        <el-option v-for="item in distributionLevelOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="权限说明">
                    <div class="form-hint">指定系统内用户成为分销权限用户，其推广将获得佣金</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="assignVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAssign">确认</el-button>
            </template>
        </el-dialog>

        <!-- 调整等级弹窗 -->
        <el-dialog v-model="adjustVisible" title="调整分销等级" width="480px" class="distribution-dialog">
            <div class="adjust-info">当前用户：<b>{{ adjustRow?.name }}</b>（{{ adjustRow?.phone }}）</div>
            <el-form :model="adjustForm" label-width="100px" class="mt-4">
                <el-form-item label="分销等级" required>
                    <el-select v-model="adjustForm.level" placeholder="请选择分销等级" class="!w-full">
                        <el-option v-for="item in distributionLevelOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="等级规则">
                    <div class="form-hint">等级调整后，未结算订单按结算时等级对应的返利比例计算</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="adjustVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdjust">确认提交</el-button>
            </template>
        </el-dialog>

        <!-- 分销详情弹窗 -->
        <el-dialog v-model="detailVisible" :title="`分销详情 - ${currentItem?.name || ''}`" width="1000px" class="distribution-detail-dialog" top="5vh">
            <el-tabs v-model="detailTab">
                <el-tab-pane label="推广团队" name="team">
                    <el-table :data="currentItem?.team || []" border size="small" style="width: 100%">
                        <el-table-column prop="userId" label="用户ID" min-width="110" align="center" />
                        <el-table-column label="用户头像" width="80" align="center">
                            <template #default="{ row }">
                                <el-image :src="row.avatar" fit="cover" class="user-avatar-sm" :preview-src-list="[row.avatar]" preview-teleported />
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="用户昵称" min-width="110" align="center" />
                        <el-table-column prop="phone" label="手机号码" min-width="120" align="center" />
                        <el-table-column prop="createdAt" label="注册时间" min-width="150" align="center" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="推广订单" name="order">
                    <el-table :data="currentItem?.orders || []" border size="small" style="width: 100%">
                        <el-table-column label="订单编号" min-width="150" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="用户昵称" min-width="110" align="center" />
                        <el-table-column prop="phone" label="手机号码" min-width="120" align="center" />
                        <el-table-column prop="goodsName" label="服务/商品名称" min-width="140" align="center" />
                        <el-table-column label="实付金额" min-width="100" align="center">
                            <template #default="{ row }">¥{{ money(row.payAmount) }}</template>
                        </el-table-column>
                        <el-table-column label="获得佣金" min-width="100" align="center">
                            <template #default="{ row }"><span class="money">¥{{ money(row.commission) }}</span></template>
                        </el-table-column>
                        <el-table-column prop="createdAt" label="下单时间" min-width="150" align="center" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="佣金明细" name="commission">
                    <el-table :data="currentItem?.commissions || []" border size="small" style="width: 100%">
                        <el-table-column label="关联订单号" min-width="160" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" link size="small" @click="openOrderDetail(row.orderNo)">{{ row.orderNo }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="获得佣金" min-width="110" align="center">
                            <template #default="{ row }"><span class="money">¥{{ money(row.commission) }}</span></template>
                        </el-table-column>
                        <el-table-column label="状态" min-width="100" align="center">
                            <template #default="{ row }">
                                <el-tag :type="row.status === 'settled' ? 'success' : 'warning'" size="small" effect="light">
                                    {{ row.status === 'settled' ? '已结算' : '待结算' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createdAt" label="生成时间" min-width="150" align="center" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <el-button type="primary" @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="distributionList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'

import {
    distributionLevelOptions,
    distributionList,
    systemUsers,
    type DistributionItem
} from './data'

const router = useRouter()
const money = (value: number) => Number(value || 0).toFixed(2)

// 点击订单编号进入对应订单详情（GO 商品订单 / SO 服务订单）
const openOrderDetail = (orderNo: string) => {
    if (!orderNo) return
    const path = orderNo.startsWith('GO') ? '/order/goods' : orderNo.startsWith('SO') ? '/order/service' : ''
    if (!path) {
        ElMessage.warning('未识别的订单编号')
        return
    }
    detailVisible.value = false
    router.push({ path, query: { orderNo } })
}

// 筛选
const query = reactive({ name: '', phone: '', level: '', status: '' })
const filteredList = computed(() =>
    distributionList.filter((item) => {
        const matchName = !query.name || item.name.includes(query.name)
        const matchPhone = !query.phone || item.phone.includes(query.phone)
        const matchLevel = !query.level || item.level === query.level
        const matchStatus = !query.status || item.status === query.status
        return matchName && matchPhone && matchLevel && matchStatus
    })
)
const handleSearch = () => {}
const resetQuery = () => {
    Object.assign(query, { name: '', phone: '', level: '', status: '' })
}

// 指定分销
const assignVisible = ref(false)
const assignForm = reactive({ userId: '', level: '' })
const openAssign = () => {
    Object.assign(assignForm, { userId: '', level: '' })
    assignVisible.value = true
}
const submitAssign = () => {
    if (!assignForm.userId) {
        ElMessage.warning('请选择系统内用户')
        return
    }
    if (!assignForm.level) {
        ElMessage.warning('请选择分销等级')
        return
    }
    if (distributionList.some((item) => item.phone === systemUsers.find((u) => u.id === assignForm.userId)?.phone)) {
        ElMessage.warning('该用户已成为分销用户')
        return
    }
    const user = systemUsers.find((u) => u.id === assignForm.userId)!
    distributionList.unshift({
        id: Date.now(),
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        level: assignForm.level,
        teamCount: 0,
        orderCount: 0,
        balance: 0,
        totalCommission: 0,
        status: 'on',
        source: 'manual',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        team: [],
        orders: [],
        commissions: []
    })
    ElMessage.success('已指定为分销用户')
    assignVisible.value = false
}

// 调整等级
const adjustVisible = ref(false)
const adjustRow = ref<DistributionItem | null>(null)
const adjustForm = reactive({ level: '' })
const openAdjust = (row: DistributionItem) => {
    adjustRow.value = row
    adjustForm.level = row.level
    adjustVisible.value = true
}
const submitAdjust = () => {
    if (!adjustForm.level) {
        ElMessage.warning('请选择分销等级')
        return
    }
    if (!adjustRow.value) return
    const name = adjustRow.value.name
    const level = adjustForm.level
    ElMessageBox.confirm(`确认将「${name}」的分销等级调整为「${level}」？未结算订单按结算时等级对应的返利比例计算。`, '调整等级二次确认', { type: 'warning' })
        .then(() => {
            const item = distributionList.find((x) => x.id === adjustRow.value?.id)
            if (item) item.level = level
            ElMessage.success('分销等级已调整')
            adjustVisible.value = false
        })
        .catch(() => {})
}

// 停用/启用
const toggleStatus = (row: DistributionItem) => {
    const target = row.status === 'on' ? 'off' : 'on'
    const tip = target === 'off' ? '停用后该用户推广不再产生佣金。' : ''
    ElMessageBox.confirm(`确认${target === 'off' ? '停用' : '启用'}「${row.name}」的分销权限？${tip}`, target === 'off' ? '停用二次确认' : '启用二次确认', { type: 'warning' })
        .then(() => {
            row.status = target
            ElMessage.success(target === 'off' ? '分销权限已停用' : '分销权限已启用')
        })
        .catch(() => {})
}

// 详情
const detailVisible = ref(false)
const detailTab = ref('team')
const currentItem = ref<DistributionItem | null>(null)
const openDetail = (row: DistributionItem) => {
    currentItem.value = cloneDeep(row)
    detailTab.value = 'team'
    detailVisible.value = true
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

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.user-avatar-sm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.disabled-name {
    color: #c0c4cc;
}

.money {
    font-weight: 600;
    color: #f56c6c;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #909399;
}

.adjust-info {
    font-size: 14px;
    color: #606266;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>

<style lang="scss">
/* 弹窗渲染在 body 上，需用全局样式控制内部滚动 */
.distribution-detail-dialog {
    display: flex;
    flex-direction: column;
    height: 78vh;
    min-height: 520px;
    max-height: 90vh;
    margin-bottom: 2vh;
    overflow: hidden;

    .el-dialog__header {
        flex: 0 0 auto;
        padding-bottom: 12px;
    }

    .el-dialog__body {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        padding-top: 8px;
    }

    .el-dialog__footer {
        flex: 0 0 auto;
        padding-top: 12px;
        border-top: 1px solid #e8ebf5;
    }
}
</style>
