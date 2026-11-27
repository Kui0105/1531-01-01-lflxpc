<template>
    <div class="order-setting-page">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="font-medium">订单设置</span>
            </template>
            <el-form :model="form" label-width="220px" class="order-form">
                <el-form-item label="服务订单取消时间（分钟）">
                    <el-input-number v-model="form.serviceCancelMinutes" :min="0" />
                </el-form-item>
                <el-form-item label="商品订单取消时间（分钟）">
                    <el-input-number v-model="form.goodsCancelMinutes" :min="0" />
                </el-form-item>
                <el-form-item label="商品订单自动确认收货（天）">
                    <el-input-number v-model="form.goodsAutoConfirmDays" :min="0" />
                </el-form-item>
                <el-form-item label="商品订单售后期限（天）">
                    <el-input-number v-model="form.goodsAfterSaleDays" :min="0" />
                </el-form-item>
            </el-form>
        </el-card>
        <footer-btns v-perms="['setting.web.web_setting/setOrderConfig']">
            <el-button type="primary" @click="handleSave">保存</el-button>
        </footer-btns>
    </div>
</template>

<script setup lang="ts" name="webOrderSetting">
import { ElMessage } from 'element-plus'

interface OrderSetting {
    serviceCancelMinutes: number
    goodsCancelMinutes: number
    goodsAutoConfirmDays: number
    goodsAfterSaleDays: number
}
const STORAGE_KEY = 'website_order_setting'

const form = reactive<OrderSetting>({
    serviceCancelMinutes: 30,
    goodsCancelMinutes: 15,
    goodsAutoConfirmDays: 10,
    goodsAfterSaleDays: 7
})

const load = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) Object.assign(form, JSON.parse(saved))
    } catch {
        // 使用默认值
    }
}
const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    ElMessage.success('保存成功')
}
load()
</script>

<style scoped lang="scss">
.order-form {
    max-width: 520px;
    :deep(.el-input-number) {
        width: 220px;
    }
}
</style>
