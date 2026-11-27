<template>
    <div class="withdraw-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="用户昵称/手机号" clearable class="!w-[180px]" />
            <el-select v-model="status" placeholder="提现状态" clearable class="!w-[130px]">
                <el-option v-for="item in withdrawStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        </div>

        <!-- 提现记录列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="serialNo" label="提现单号" min-width="150" align="center" />
                <el-table-column label="用户信息" min-width="150" align="center">
                    <template #default="{ row }">
                        <div>{{ row.nickname }}</div>
                        <div class="cell-sub">{{ row.phone }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="提现金额" min-width="110" align="center">
                    <template #default="{ row }">¥{{ money(row.amount) }}</template>
                </el-table-column>
                <el-table-column label="手续费" min-width="100" align="center">
                    <template #default="{ row }">¥{{ money(row.fee) }}</template>
                </el-table-column>
                <el-table-column label="到账金额" min-width="110" align="center">
                    <template #default="{ row }"><span class="actual-amount">¥{{ money(row.actualAmount) }}</span></template>
                </el-table-column>
                <el-table-column prop="bank" label="开户银行" min-width="130" align="center" />
                <el-table-column prop="bankName" label="开户姓名" min-width="110" align="center" />
                <el-table-column prop="bankAccount" label="银行账号" min-width="180" align="center" />
                <el-table-column prop="applyTime" label="申请时间" min-width="150" align="center" />
                <el-table-column label="状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tooltip v-if="row.status === 'rejected' && row.rejectReason" :content="row.rejectReason" placement="top">
                            <el-tag type="danger" size="small" effect="light">{{ statusLabel(row.status) }}</el-tag>
                        </el-tooltip>
                        <el-tag v-else :type="statusTagType(row.status)" size="small" effect="light">
                            {{ statusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="160" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="openAudit(row)">审核</el-button>
                        <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="payOut(row)">打款</el-button>
                        <span v-if="row.status === 'paid' || row.status === 'rejected'" class="cell-sub">-</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="pagination-wrap"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredList.length"
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50]"
            />
        </el-card>

        <!-- 审核弹窗 -->
        <el-dialog v-model="auditVisible" title="提现审核" width="520px" :close-on-click-modal="false">
            <div v-if="current" class="audit-info">
                <div class="audit-row"><span class="audit-label">提现单号</span><span>{{ current.serialNo }}</span></div>
                <div class="audit-row"><span class="audit-label">用户信息</span><span>{{ current.nickname }}（{{ current.phone }}）</span></div>
                <div class="audit-row"><span class="audit-label">提现金额</span><span>¥{{ money(current.amount) }}</span></div>
                <div class="audit-row"><span class="audit-label">手续费</span><span>¥{{ money(current.fee) }}</span></div>
                <div class="audit-row"><span class="audit-label">到账金额</span><span>¥{{ money(current.actualAmount) }}</span></div>
                <div class="audit-row"><span class="audit-label">开户银行</span><span>{{ current.bank }}</span></div>
                <div class="audit-row"><span class="audit-label">开户姓名</span><span>{{ current.bankName }}</span></div>
                <div class="audit-row"><span class="audit-label">银行账号</span><span>{{ current.bankAccount }}</span></div>
                <div class="audit-row"><span class="audit-label">申请时间</span><span>{{ current.applyTime }}</span></div>
            </div>
            <el-divider />
            <el-form label-width="90px">
                <el-form-item label="审核结果">
                    <el-radio-group v-model="auditResult">
                        <el-radio value="approved">通过</el-radio>
                        <el-radio value="rejected">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="auditResult === 'rejected'" label="拒绝原因">
                    <el-input v-model="rejectReason" type="textarea" :rows="3" placeholder="请填写拒绝原因" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="auditVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAudit">确认提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="financeWithdraw">
import { ElMessage, ElMessageBox } from 'element-plus'

import {
    withdrawList,
    withdrawStatusOptions,
    type WithdrawRecord,
    type WithdrawStatus
} from './data'

// 筛选
const keyword = ref('')
const status = ref('')
const dateRange = ref<string[]>([])
const query = reactive({ keyword: '', status: '', startDate: '', endDate: '' })

const filteredList = computed(() =>
    withdrawList
        .filter((item) => {
            const matchKeyword =
                !query.keyword || item.nickname.includes(query.keyword) || item.phone.includes(query.keyword)
            const matchStatus = !query.status || item.status === query.status
            const day = item.applyTime.slice(0, 10)
            const matchStart = !query.startDate || day >= query.startDate
            const matchEnd = !query.endDate || day <= query.endDate
            return matchKeyword && matchStatus && matchStart && matchEnd
        })
        .sort((a, b) => b.applyTime.localeCompare(a.applyTime))
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.status = status.value
    query.startDate = dateRange.value?.[0] || ''
    query.endDate = dateRange.value?.[1] || ''
    pageNo.value = 1
}
const resetSearch = () => {
    keyword.value = ''
    status.value = ''
    dateRange.value = []
    Object.assign(query, { keyword: '', status: '', startDate: '', endDate: '' })
    pageNo.value = 1
}

const money = (n: number) => n.toFixed(2)
const statusLabel = (s: WithdrawStatus) => ({ pending: '待审核', approved: '待打款', paid: '已打款', rejected: '已拒绝' })[s]
const statusTagType = (s: WithdrawStatus): 'warning' | 'primary' | 'success' | 'danger' =>
    s === 'pending' ? 'warning' : s === 'approved' ? 'primary' : s === 'paid' ? 'success' : 'danger'

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 审核
const auditVisible = ref(false)
const current = ref<WithdrawRecord | null>(null)
const auditResult = ref<'approved' | 'rejected'>('approved')
const rejectReason = ref('')

const openAudit = (row: WithdrawRecord) => {
    current.value = row
    auditResult.value = 'approved'
    rejectReason.value = ''
    auditVisible.value = true
}
const submitAudit = () => {
    if (!current.value) return
    if (auditResult.value === 'rejected' && !rejectReason.value.trim()) {
        ElMessage.warning('请填写拒绝原因')
        return
    }
    current.value.status = auditResult.value
    current.value.rejectReason = auditResult.value === 'rejected' ? rejectReason.value.trim() : ''
    auditVisible.value = false
    ElMessage.success(auditResult.value === 'approved' ? '审核通过，待打款' : '已拒绝该提现申请')
}

// 打款（二次确认）
const payOut = (row: WithdrawRecord) => {
    ElMessageBox.confirm(
        `确认对 ${row.nickname} 的提现单 ${row.serialNo} 打款 ¥${money(row.actualAmount)}？打款后状态变更为已打款。`,
        '打款二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.status = 'paid'
            ElMessage.success('打款成功，状态已变更为已打款')
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

.list-card {
    border-radius: 8px;
}

.pagination-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.actual-amount {
    font-weight: 600;
    color: var(--el-color-primary);
}

.audit-info {
    padding: 4px 0;
}

.audit-row {
    display: flex;
    gap: 12px;
    padding: 6px 0;
    font-size: 13px;
    color: #606266;
}

.audit-label {
    flex: 0 0 80px;
    color: #909399;
}
</style>

<!-- 全局样式：Element Plus 日期组件宽度由内部 CSS 变量控制，需非 scoped 命中真实 DOM -->
<style lang="scss">
.withdraw-page {
    .date-range-wrap {
        width: 400px;
        flex: 0 0 400px;

        .el-date-editor--daterange,
        .el-date-editor.el-input__wrapper {
            width: 400px !important;
            --el-date-editor-width: 400px;
            --el-date-editor-daterange-width: 400px;
        }
    }
}
</style>
