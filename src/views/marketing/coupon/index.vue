<template>
    <div class="marketing-coupon">
        <!-- 筛选搜索（独立模块） -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="query.name" placeholder="优惠券名称" clearable class="!w-[180px]" />
            <el-select v-model="query.type" placeholder="券类型" clearable class="!w-[140px]">
                <el-option v-for="(label, key) in couponTypeLabels" :key="key" :label="label" :value="key" />
            </el-select>
            <el-select v-model="query.issueMethod" placeholder="发放方式" clearable class="!w-[140px]">
                <el-option v-for="(label, key) in issueMethodLabels" :key="key" :label="label" :value="key" />
            </el-select>
            <el-select v-model="query.status" placeholder="状态" clearable class="!w-[120px]">
                <el-option label="启用" value="on" />
                <el-option label="停用" value="off" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
        </div>

        <!-- 列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">优惠券列表</span>
                    <el-button type="primary" @click="openAdd">新增优惠券</el-button>
                </div>
            </template>

            <el-table :data="pagedList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="券名称" min-width="180" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'disabled-name': row.status === 'off' }">{{ row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="券类型" min-width="120" align="center">
                    <template #default="{ row }">
                        <el-tag size="small" effect="plain">{{ typeLabel(row.type) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="面额/折扣" min-width="110" align="center">
                    <template #default="{ row }">
                        <span class="face-value">{{ row.type === 'discount' ? `${row.faceValue} 折` : `¥${row.faceValue}` }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用门槛" min-width="110" align="center">
                    <template #default="{ row }">{{ row.threshold ? `满 ${row.threshold} 元` : '无门槛' }}</template>
                </el-table-column>
                <el-table-column label="适用对象" min-width="120" align="center">
                    <template #default="{ row }">{{ scopeLabel(row.applyScope) }}</template>
                </el-table-column>
                <el-table-column label="发放方式" min-width="120" align="center">
                    <template #default="{ row }">{{ issueLabel(row.issueMethod) }}</template>
                </el-table-column>
                <el-table-column prop="totalCount" label="发放数量" min-width="100" align="center" />
                <el-table-column label="已领取/已使用" min-width="130" align="center">
                    <template #default="{ row }">{{ row.claimedCount }} / {{ row.usedCount }}</template>
                </el-table-column>
                <el-table-column label="有效期" min-width="200" align="center">
                    <template #default="{ row }">{{ row.validStart }} ~ {{ row.validEnd }}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="90" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.status === 'on' ? '启用' : '停用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="170" align="center" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button v-if="row.status === 'on'" type="warning" link size="small" @click="toggleStatus(row)">停用</el-button>
                        <el-button v-else type="success" link size="small" @click="toggleStatus(row)">启用</el-button>
                        <el-button type="danger" link size="small" @click="deleteCoupon(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="pagination"
                background
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredList.length"
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50]"
            />
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            v-model="formVisible"
            class="coupon-edit-dialog"
            :title="isEdit ? '编辑优惠券' : '新增优惠券'"
            width="820px"
            top="5vh"
        >
            <el-form :model="form" label-width="130px" class="coupon-form">
                <div class="section-title">基础信息</div>
                <el-row :gutter="16">
                    <el-col :span="12">
                        <el-form-item label="券名称" required>
                            <el-input v-model="form.name" placeholder="请输入券名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="券类型" required>
                            <el-select v-model="form.type" class="!w-full">
                                <el-option v-for="(label, key) in couponTypeLabels" :key="key" :label="label" :value="key" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="form.type === 'discount' ? '折扣' : '面额'" required>
                            <el-input-number
                                v-model="form.faceValue"
                                :min="0"
                                :max="form.type === 'discount' ? 10 : undefined"
                                :precision="form.type === 'discount' ? 1 : 2"
                                class="!w-full"
                            />
                            <div class="form-hint">{{ form.type === 'discount' ? '如 8.5 表示 8.5 折' : '抵扣金额（元）' }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用门槛">
                            <el-input-number v-model="form.threshold" :min="0" class="!w-full" />
                            <div class="form-hint">0 表示无门槛；券面额大于订单金额时提醒用户可继续选商品抵扣</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="适用范围" required>
                            <el-radio-group v-model="form.applyScope">
                                <el-radio value="all_service">全部服务</el-radio>
                                <el-radio value="service">指定服务</el-radio>
                                <el-radio value="all_goods">全部商品</el-radio>
                                <el-radio value="goods">指定商品</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.applyScope === 'service'" :span="24">
                        <el-form-item label="指定服务项目" required>
                            <el-select v-model="form.serviceIds" multiple filterable placeholder="至少选择一个服务项目" class="!w-full">
                                <el-option v-for="item in serviceOptions" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                            <div class="form-hint">选择「全部服务」则全平台服务项目可用</div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.applyScope === 'goods'" :span="24">
                        <el-form-item label="指定商品" required>
                            <el-select v-model="form.goodsIds" multiple filterable placeholder="至少选择一个商品" class="!w-full">
                                <el-option v-for="item in goodsOptions" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="有效期" required>
                            <el-date-picker
                                v-model="validRange"
                                type="daterange"
                                value-format="YYYY-MM-DD"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                class="!w-full"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="section-title">发放设置</div>
                <el-row :gutter="16">
                    <el-col :span="24">
                        <el-form-item label="发放方式" required>
                            <el-select v-model="form.issueMethod" class="!w-full">
                                <el-option v-for="(label, key) in issueMethodLabels" :key="key" :label="label" :value="key" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发放数量" required>
                            <el-input-number v-model="form.totalCount" :min="0" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-switch v-model="form.status" active-value="on" inactive-value="off" active-text="启用" inactive-text="停用" />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.issueMethod === 'auto'" :span="24">
                        <el-form-item label="每月发放日">
                            <el-input-number v-model="form.autoDay" :min="1" :max="31" class="!w-full" />
                            <div class="form-hint">每月此日固定发放给所有用户</div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.issueMethod === 'gift' || form.issueMethod === 'manager'" :span="24">
                        <el-form-item label="生成条件">
                            <el-input-number v-model="form.generateAmount" :min="0" class="!w-full" />
                            <div class="form-hint">购买指定服务/商品满该金额后可生成赠送优惠券</div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.issueMethod === 'manager'" :span="24">
                        <el-form-item label="店长确认发放">
                            <el-switch v-model="form.managerConfirm" active-text="需店长确认" inactive-text="自动发放" />
                            <div class="form-hint">勾选后需店长在员工端选择店内消费过的用户并确认发放；不勾选则自动发放至用户优惠券账户</div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.issueMethod === 'manual'" :span="24">
                        <el-form-item label="领取类型" required>
                            <div class="benefit-switches">
                                <el-switch v-model="form.birthdayBenefit" active-text="生日福利" />
                                <el-switch v-model="form.newUserBenefit" active-text="新人福利" />
                            </div>
                            <div class="form-hint">
                                生日福利与新人福利至少选择一项<br />
                                生日福利：根据出生日期判断发送提醒，用户可在个人中心-生日福利页面领取优惠券<br />
                                新人福利：新用户注册登录判定为新用户时弹窗领取优惠券
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.issueMethod === 'designated'" :span="24">
                        <div class="method-tip">指定发放：由管理端指定用户发放优惠券</div>
                    </el-col>
                </el-row>

                <div class="section-title">提成设置</div>
                <el-row :gutter="16">
                    <el-col :span="24">
                        <el-form-item label="提成类型">
                            <el-switch v-model="form.commissionEnabled" active-text="启用" inactive-text="不启用" />
                            <div class="form-hint">
                                券被使用后按券面额提成给到康复师<br />
                                店长获得订单总额 2% 提成；提成比例由管理端配置
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.commissionEnabled" :span="12">
                        <el-form-item label="提成比例">
                            <el-input-number v-model="form.commissionRate" :min="0" :max="100" :precision="1" class="!w-full" />
                            <div class="form-hint">按券面额提成的比例（%），如 5 表示券面额的 5%</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="marketingCoupon">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { goodsList } from '@/views/goods/list/data'
import { services } from '@/views/service/list/data'

import {
    applyScopeLabels,
    couponList,
    couponTypeLabels,
    issueMethodLabels,
    type ApplyScope,
    type CouponItem,
    type CouponType,
    type IssueMethod
} from './data'

// 枚举标签（表格 slot 的 row 为 any，需用断言索引）
const typeLabel = (v: CouponType) => couponTypeLabels[v] || '-'
const scopeLabel = (v: ApplyScope) => applyScopeLabels[v] || '-'
const issueLabel = (v: IssueMethod) => issueMethodLabels[v] || '-'

const serviceOptions = services.map((item) => ({ id: item.id, name: item.name }))
const goodsOptions = goodsList.map((item) => ({ id: item.id, name: item.name }))

// 筛选
const query = reactive({ name: '', type: '', issueMethod: '', status: '' })
const filteredList = computed(() =>
    couponList.filter((item) => {
        const matchName = !query.name || item.name.includes(query.name)
        const matchType = !query.type || item.type === query.type
        const matchIssue = !query.issueMethod || item.issueMethod === query.issueMethod
        const matchStatus = !query.status || item.status === query.status
        return matchName && matchType && matchIssue && matchStatus
    })
)
const handleSearch = () => {
    pageNo.value = 1
}
const resetQuery = () => {
    Object.assign(query, { name: '', type: '', issueMethod: '', status: '' })
    pageNo.value = 1
}

// 分页
const pageNo = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => filteredList.value.slice((pageNo.value - 1) * pageSize.value, pageNo.value * pageSize.value))

// 表单
const formVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(0)
const validRange = ref<string[]>([])
const emptyForm = (): CouponItem => ({
    id: 0,
    name: '',
    type: 'reduction',
    faceValue: 0,
    threshold: 0,
    applyScope: 'all_service',
    issueMethod: 'manual',
    totalCount: 100,
    claimedCount: 0,
    usedCount: 0,
    validStart: '',
    validEnd: '',
    status: 'on',
    serviceIds: [],
    goodsIds: [],
    birthdayBenefit: false,
    newUserBenefit: false,
    autoDay: 1,
    generateAmount: 0,
    managerConfirm: false,
    commissionEnabled: false,
    commissionRate: 0,
    createdAt: ''
})
const form = reactive<CouponItem>(emptyForm())

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    Object.assign(form, emptyForm())
    validRange.value = []
    formVisible.value = true
}
const openEdit = (row: CouponItem) => {
    isEdit.value = true
    editingId.value = row.id
    Object.assign(form, cloneDeep(row))
    validRange.value = [row.validStart, row.validEnd]
    formVisible.value = true
}

const submitForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入券名称')
        return
    }
    if (form.faceValue <= 0) {
        ElMessage.warning(form.type === 'discount' ? '请输入折扣值' : '请输入面额')
        return
    }
    if (form.applyScope === 'service' && !form.serviceIds.length) {
        ElMessage.warning('选择「指定服务」时请至少选择一个服务项目')
        return
    }
    if (form.applyScope === 'goods' && !form.goodsIds.length) {
        ElMessage.warning('选择「指定商品」时请至少选择一个商品')
        return
    }
    if (form.issueMethod === 'manual' && !form.birthdayBenefit && !form.newUserBenefit) {
        ElMessage.warning('手动领取类型需在「生日福利」与「新人福利」中至少选择一项')
        return
    }
    if (!validRange.value?.length) {
        ElMessage.warning('请选择有效期')
        return
    }
    form.validStart = validRange.value[0]
    form.validEnd = validRange.value[1]

    if (isEdit.value) {
        const index = couponList.findIndex((item) => item.id === editingId.value)
        if (index > -1) {
            couponList[index] = { ...cloneDeep(form), id: editingId.value, createdAt: couponList[index].createdAt }
        }
        ElMessage.success('优惠券已更新')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        couponList.unshift({
            ...cloneDeep(form),
            id: Date.now(),
            createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('优惠券已新增')
    }
    formVisible.value = false
}

const toggleStatus = (row: CouponItem) => {
    const target = row.status === 'on' ? 'off' : 'on'
    const tip = target === 'off' ? '停用后不可领取，已发放至用户账户的券不受影响。' : ''
    ElMessageBox.confirm(`确认${target === 'off' ? '停用' : '启用'}优惠券「${row.name}」？${tip}`, target === 'off' ? '停用二次确认' : '启用二次确认', { type: 'warning' })
        .then(() => {
            row.status = target
            ElMessage.success(target === 'off' ? '优惠券已停用' : '优惠券已启用')
        })
        .catch(() => {})
}

const deleteCoupon = (row: CouponItem) => {
    ElMessageBox.confirm(`确认删除优惠券「${row.name}」？已发放至用户账户的券不受影响。`, '删除二次确认', { type: 'warning' })
        .then(() => {
            const index = couponList.findIndex((item) => item.id === row.id)
            if (index > -1) couponList.splice(index, 1)
            ElMessage.success('优惠券已删除')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.list-card {
    border-radius: 8px;
}

.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.pagination {
    justify-content: flex-end;
    margin-top: 16px;
}

.disabled-name {
    color: #c0c4cc;
}

.face-value {
    font-weight: 600;
    color: #f56c6c;
}

.benefit-switches {
    display: flex;
    align-items: center;
    gap: 24px;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.8;
    color: #909399;
}

.method-tip {
    margin-bottom: 12px;
    padding: 10px 14px;
    font-size: 13px;
    color: #606266;
    background: #f5f7ff;
    border-radius: 6px;
}

.section-title {
    position: relative;
    margin: 4px 0 14px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #303133;

    &::before {
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 0;
        width: 3px;
        background: var(--el-color-primary);
        border-radius: 2px;
        content: '';
    }
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
.coupon-edit-dialog {
    display: flex;
    flex-direction: column;
    height: 82vh;
    min-height: 560px;
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
