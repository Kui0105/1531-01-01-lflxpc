<template>
    <div class="marketing-config">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">营销配置</span>
                    <el-button type="primary" :disabled="!isDirty" @click="saveConfig">保存配置</el-button>
                </div>
            </template>

            <el-form :model="form" label-width="180px" class="config-form">
                <el-form-item label="积分抵扣比例">
                    <el-input-number v-model="form.pointRatio" :min="0" :max="100" :precision="2" class="config-input" />
                    <span class="unit">%</span>
                    <div class="form-hint">每笔订单可用积分按此比例抵扣金额</div>
                </el-form-item>
                <el-form-item label="单笔订单最高抵扣比例">
                    <el-input-number v-model="form.maxOrderRatio" :min="0" :max="100" :precision="2" class="config-input" />
                    <span class="unit">%</span>
                    <div class="form-hint">单笔订单中积分抵扣金额占应付金额的最高比例</div>
                </el-form-item>
                <el-form-item label="第三方券码核销单价">
                    <el-input-number v-model="form.couponPrice" :min="0" :precision="2" class="config-input" />
                    <span class="unit">元</span>
                    <div class="form-hint">第三方券码核销时每个券码对应的抵扣金额</div>
                </el-form-item>
            </el-form>

            <div v-if="isDirty" class="dirty-tip">
                <el-icon><InfoFilled /></el-icon>
                配置已修改，请点击右上角「保存配置」使其生效
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="marketingConfig">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

interface ConfigForm {
    pointRatio: number // 积分抵扣比例（%）
    maxOrderRatio: number // 单笔订单最高抵扣比例（%）
    couponPrice: number // 第三方券码核销单价（元）
}

// 已生效配置（mock，后续可由后端接口替换）
const savedConfig = reactive<ConfigForm>({
    pointRatio: 1,
    maxOrderRatio: 30,
    couponPrice: 5
})

const form = reactive<ConfigForm>(cloneDeep(savedConfig))

const isDirty = computed(
    () =>
        form.pointRatio !== savedConfig.pointRatio ||
        form.maxOrderRatio !== savedConfig.maxOrderRatio ||
        form.couponPrice !== savedConfig.couponPrice
)

const saveConfig = () => {
    ElMessageBox.confirm('确认保存当前营销配置？保存后新配置立即生效。', '保存二次确认', { type: 'warning' })
        .then(() => {
            Object.assign(savedConfig, cloneDeep(form))
            ElMessage.success('营销配置已保存并生效')
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

.config-form {
    max-width: 620px;
    padding: 8px 0 4px;
}

.config-input {
    width: 220px;
}

.unit {
    margin-left: 8px;
    color: #606266;
}

.form-hint {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #909399;
}

.dirty-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 620px;
    margin-top: 14px;
    padding: 10px 14px;
    font-size: 13px;
    color: #e6a23c;
    background: #fdf6ec;
    border-radius: 6px;
}
</style>
