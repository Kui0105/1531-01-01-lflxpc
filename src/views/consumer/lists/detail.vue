<template>
    <div class="consumer-detail">
        <el-card class="!border-none" shadow="never">
            <el-page-header content="用户详情" @back="$router.back()" />
        </el-card>

        <!-- 基础信息 -->
        <el-card class="info-card mt-4" shadow="never">
            <template #header>
                <span class="header-title">基础信息</span>
            </template>
            <div class="info-grid">
                <div v-for="item in baseItems" :key="item.label" class="info-item">
                    <span class="info-label">{{ item.label }}</span>
                    <span class="info-value">{{ item.value }}</span>
                </div>
            </div>
            <div class="points-bar">
                <span>积分余额：<b>{{ user.points.toLocaleString('zh-CN') }}</b></span>
                <el-button type="primary" size="small" @click="openPointDialog">积分充值</el-button>
            </div>
        </el-card>

        <!-- 明细数据 -->
        <el-card class="data-card mt-4" shadow="never">
            <el-tabs v-model="activeTab">
                <!-- 积分明细 -->
                <el-tab-pane label="积分明细" name="points">
                    <el-table :data="detail.points" style="width: 100%">
                        <el-table-column prop="time" label="记录时间" min-width="160" />
                        <el-table-column label="变动值" width="110" align="center">
                            <template #default="{ row }">
                                <span :class="row.change > 0 ? 'text-success' : 'text-danger'">
                                    {{ row.change > 0 ? '+' : '' }}{{ row.change }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="balance" label="变动后余额" width="120" align="right" />
                        <el-table-column prop="reason" label="变动原因" min-width="200" />
                        <el-table-column prop="remark" label="备注" min-width="180" />
                    </el-table>
                </el-tab-pane>

                <!-- 订单记录 -->
                <el-tab-pane label="订单记录" name="orders">
                    <el-table :data="detail.orders" style="width: 100%">
                        <el-table-column label="订单编号" min-width="160">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="openOrder(row)">
                                    {{ row.no }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="订单类型" width="100" />
                        <el-table-column prop="name" label="服务/商品名称" min-width="160" />
                        <el-table-column prop="store" label="门店名称" min-width="110" />
                        <el-table-column prop="amount" label="订单金额" width="110" align="right" />
                        <el-table-column label="优惠信息" min-width="200">
                            <template #default="{ row }">
                                {{ row.coupon }} / {{ row.pointDeduct }} / {{ row.discount }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="paid" label="实付金额" width="110" align="right">
                            <template #default="{ row }">
                                <span class="text-danger">¥{{ row.paid }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100" />
                        <el-table-column prop="time" label="下单时间" min-width="160" />
                    </el-table>
                </el-tab-pane>

                <!-- 预约记录 -->
                <el-tab-pane label="预约记录" name="appointments">
                    <el-table :data="detail.appointments" style="width: 100%">
                        <el-table-column prop="name" label="服务名称" min-width="160" />
                        <el-table-column label="预约门店/康复师" min-width="170">
                            <template #default="{ row }">
                                {{ row.store }} / {{ row.therapist }}
                            </template>
                        </el-table-column>
                        <el-table-column label="预约日期/时间段" min-width="190">
                            <template #default="{ row }">
                                {{ row.date }} {{ row.timeslot }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100" />
                        <el-table-column prop="submitTime" label="提交时间" min-width="160" />
                    </el-table>
                </el-tab-pane>

                <!-- 待服务订单 -->
                <el-tab-pane label="待服务订单" name="service">
                    <div class="drawer-tip">
                        待服务订单统计未完成核销的评估/服务订单，共 {{ detail.serviceOrders.length }} 笔。
                    </div>
                    <el-table :data="detail.serviceOrders" style="width: 100%">
                        <el-table-column label="订单编号" min-width="160">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="openOrder(row)">
                                    {{ row.no }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="服务名称" min-width="190" />
                        <el-table-column prop="store" label="下单门店" min-width="110" />
                        <el-table-column label="核销次数/剩余次数" min-width="160" align="center">
                            <template #default="{ row }">
                                {{ row.used }} / {{ row.remain }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="100" />
                        <el-table-column prop="valid" label="有效期" width="120" />
                        <el-table-column prop="submitTime" label="提交时间" min-width="160" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 积分充值 -->
        <el-dialog v-model="pointVisible" title="积分充值" width="460px">
            <div class="form-row">
                <span class="form-label">操作类型</span>
                <el-select v-model="pointForm.type" class="!w-[200px]">
                    <el-option label="充值积分" value="充值" />
                    <el-option label="扣减积分" value="扣减" />
                </el-select>
            </div>
            <div class="form-row">
                <span class="form-label">变动值</span>
                <el-input-number v-model="pointForm.value" :min="1" :max="99999" />
            </div>
            <div class="form-row form-row--top">
                <span class="form-label">备注</span>
                <el-input
                    v-model="pointForm.remark"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注"
                    class="!w-[300px]"
                />
            </div>
            <template #footer>
                <el-button @click="pointVisible = false">取消</el-button>
                <el-button type="primary" @click="submitPoint">确认提交</el-button>
            </template>
        </el-dialog>

        <!-- 订单详情 -->
        <el-dialog v-model="orderVisible" :title="`订单详情 - ${currentOrder?.no}`" width="560px">
            <div class="info-grid">
                <div v-for="item in orderItems" :key="item.label" class="info-item">
                    <span class="info-label">{{ item.label }}</span>
                    <span class="info-value">{{ item.value }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="consumerDetail">
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { detailData, users } from './data'
import type { OrderRecord, UserItem } from './data'

const route = useRoute()
const userId = Number(route.query.id) || 10001
const user = reactive<UserItem>({ ...(users.find((item) => item.id === userId) || users[0]) })
const detail = reactive(cloneDeep(detailData[userId] || detailData[10001]))
const activeTab = ref('points')

const baseItems = computed(() => [
    { label: '用户ID', value: user.id },
    { label: '用户昵称', value: user.nickname },
    { label: '手机号码', value: user.mobile },
    { label: '会员等级', value: user.level },
    { label: '真实姓名', value: user.realName },
    { label: '性别', value: user.gender },
    { label: '出生日期', value: user.birthday },
    { label: '来源渠道', value: user.source },
    { label: '注册时间', value: user.registerTime },
    { label: '状态', value: user.status === 'normal' ? '正常' : '已禁用' }
])

const nowText = () => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

// 积分充值 / 扣减
const pointVisible = ref(false)
const pointForm = reactive({ type: '充值', value: 100, remark: '' })
const openPointDialog = () => {
    pointForm.type = '充值'
    pointForm.value = 100
    pointForm.remark = ''
    pointVisible.value = true
}
const submitPoint = () => {
    const isRecharge = pointForm.type === '充值'
    const change = isRecharge ? pointForm.value : -pointForm.value
    user.points += change
    detail.points.unshift({
        time: nowText(),
        change,
        balance: user.points,
        reason: isRecharge ? '平台充值增加积分' : '平台扣除减少积分',
        remark: pointForm.remark || (isRecharge ? '手动充值' : '手动扣减')
    })
    pointVisible.value = false
    ElMessage.success('积分操作成功')
}

// 订单详情
const orderVisible = ref(false)
const currentOrder = ref<OrderRecord | null>(null)
const orderItems = computed(() => {
    const order = currentOrder.value
    if (!order) return []
    return [
        { label: '订单编号', value: order.no },
        { label: '订单类型', value: order.type },
        { label: '服务/商品名称', value: order.name },
        { label: '门店名称', value: order.store },
        { label: '订单金额', value: `¥${order.amount}` },
        { label: '优惠信息', value: `${order.coupon} / ${order.pointDeduct} / ${order.discount}` },
        { label: '实付金额', value: `¥${order.paid}` },
        { label: '状态', value: order.status },
        { label: '下单时间', value: order.time }
    ]
})
const openOrder = (row: OrderRecord) => {
    currentOrder.value = row
    orderVisible.value = true
}
</script>

<style lang="scss" scoped>
.info-card,
.data-card {
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

.info-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 14px 20px;
}

@media (max-width: 1200px) {
    .info-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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

.points-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 18px;
    padding: 12px 16px;
    font-size: 14px;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;

    b {
        font-size: 18px;
        color: #e6a23c;
    }
}

.text-success {
    font-weight: 600;
    color: #67c23a;
}

.text-danger {
    font-weight: 600;
    color: #f56c6c;
}

.drawer-tip {
    margin-bottom: 14px;
    padding: 10px 14px;
    font-size: 13px;
    color: #606266;
    background: #f5f7ff;
    border: 1px solid #e8ebf5;
    border-radius: 6px;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    &--top {
        align-items: flex-start;
    }
}

.form-label {
    flex: 0 0 70px;
    padding-top: 6px;
    font-size: 14px;
    color: #606266;
}
</style>
