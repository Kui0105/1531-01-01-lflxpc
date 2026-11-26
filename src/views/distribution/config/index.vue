<template>
    <div class="distribution-config">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">分销配置</span>
                    <el-button type="primary" :disabled="!isDirty" @click="saveConfig">保存配置</el-button>
                </div>
            </template>

            <!-- 基础配置 -->
            <div class="section-title">基础配置</div>
            <el-form :model="form" label-width="150px" class="config-form">
                <el-form-item label="分销开关">
                    <el-switch v-model="form.enabled" active-text="开启" inactive-text="关闭" />
                    <div class="form-hint">关闭后全部分销推广功能停用</div>
                </el-form-item>
                <el-form-item label="评估订单返利节点">
                    <el-select v-model="form.assessNode" class="config-input">
                        <el-option v-for="item in assessNodeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="服务订单返利节点">
                    <el-select v-model="form.serviceNode" class="config-input">
                        <el-option v-for="item in serviceNodeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品订单返利节点">
                    <el-select v-model="form.goodsNode" class="config-input">
                        <el-option v-for="item in goodsNodeOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="结算周期">
                    <el-select v-model="form.settleCycle" class="config-input">
                        <el-option v-for="item in settleCycleOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                    <div class="form-hint">选择返利节点后保存，佣金明细状态将按节点自动流转</div>
                </el-form-item>
            </el-form>

            <!-- 推广海报 -->
            <div class="section-title">推广海报</div>
            <el-form :model="form" label-width="150px" class="config-form">
                <el-form-item label="推广海报背景图">
                    <div class="poster-form">
                        <el-upload
                            accept=".png,.jpg,.jpeg"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="handlePosterChange"
                            class="poster-uploader"
                        >
                            <div v-if="form.poster" class="poster-card has-image">
                                <img :src="form.poster" class="poster-card-img" />
                                <div class="poster-card-mask">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                    <span>更换海报</span>
                                </div>
                            </div>
                            <div v-else class="poster-card">
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                                <span class="poster-card-text">点击上传</span>
                            </div>
                        </el-upload>
                        <div class="poster-actions">
                            <el-button v-if="form.poster" type="danger" link size="small" @click="form.poster = ''">删除海报</el-button>
                        </div>
                        <div class="form-hint">支持 PNG、JPG，大小不超过 2MB；保存后前端同步生效展示最新海报背景图</div>
                    </div>
                </el-form-item>
            </el-form>

            <!-- 提现配置 -->
            <div class="section-title">提现配置</div>
            <el-form :model="form" label-width="150px" class="config-form">
                <el-form-item label="最低提现金额">
                    <el-input-number v-model="form.minWithdraw" :min="0" :precision="2" class="config-input" />
                    <span class="unit">元</span>
                </el-form-item>
                <el-form-item label="提现手续费">
                    <el-input-number v-model="form.withdrawFee" :min="0" :max="100" :precision="2" class="config-input" />
                    <span class="unit">%</span>
                    <div class="form-hint">按提现金额收取的手续费比例</div>
                </el-form-item>
                <el-form-item label="到账周期">
                    <el-select v-model="form.withdrawCycle" class="config-input">
                        <el-option v-for="item in withdrawCycleOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
            </el-form>

            <div v-if="isDirty" class="dirty-tip">
                <el-icon><InfoFilled /></el-icon>
                配置已修改，请点击右上角「保存配置」使其生效
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="distributionConfig">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

interface ConfigForm {
    enabled: boolean // 分销开关
    assessNode: string // 评估订单返利节点
    serviceNode: string // 服务订单返利节点
    goodsNode: string // 商品订单返利节点
    settleCycle: string // 结算周期
    poster: string // 推广海报背景图（data URI）
    minWithdraw: number // 最低提现金额（元）
    withdrawFee: number // 提现手续费（%）
    withdrawCycle: string // 到账周期
}

const assessNodeOptions = ['到店核销后到账']
const serviceNodeOptions = ['到店核销后到账']
const goodsNodeOptions = ['完成订单且超出售后期后到账']
const settleCycleOptions = ['即时结算', '每日结算', '每周结算', '每月结算']
const withdrawCycleOptions = ['实时到账', '1 个工作日', '3 个工作日', '7 个工作日']

// 生成推广海报占位图
const posterPlaceholder = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A5DFF"/><stop offset="1" stop-color="#8e44ad"/></linearGradient></defs><rect width="400" height="220" rx="10" fill="url(#g)"/><text x="200" y="110" font-size="28" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">推广海报</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

// 已生效配置（mock，后续可由后端接口替换）
const savedConfig = reactive<ConfigForm>({
    enabled: true,
    assessNode: '到店核销后到账',
    serviceNode: '到店核销后到账',
    goodsNode: '完成订单且超出售后期后到账',
    settleCycle: '每周结算',
    poster: posterPlaceholder(),
    minWithdraw: 10,
    withdrawFee: 0,
    withdrawCycle: '1 个工作日'
})

const form = reactive<ConfigForm>(cloneDeep(savedConfig))

const isDirty = computed(
    () => (Object.keys(form) as Array<keyof ConfigForm>).some((key) => form[key] !== savedConfig[key])
)

const handlePosterChange = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('推广海报仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('海报图片大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
        form.poster = String(e.target?.result || '')
    }
    reader.readAsDataURL(file)
}

const saveConfig = () => {
    ElMessageBox.confirm('确认保存当前分销配置？保存后新配置立即生效，佣金明细状态将按返利节点自动流转。', '保存二次确认', { type: 'warning' })
        .then(() => {
            Object.assign(savedConfig, cloneDeep(form))
            ElMessage.success('分销配置已保存并生效')
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

.section-title {
    position: relative;
    margin: 18px 0 14px;
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

.config-form {
    max-width: 620px;
    padding: 4px 0;
}

.config-input {
    width: 260px;
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

.poster-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.poster-uploader :deep(.el-upload) {
    display: block;
}

.poster-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 200px;
    height: 112px;
    color: #a8abb2;
    background: #fafafa;
    border: 1px dashed #dcdfe6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        color: var(--el-color-primary);
        background: #f5f7ff;
        border-color: var(--el-color-primary);
    }

    &.has-image {
        padding: 0;
        overflow: hidden;
        border-style: solid;
        border-color: #ebeef5;
        background: #fff;
    }
}

.poster-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.poster-card-text {
    font-size: 12px;
}

.poster-card-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s;

    .poster-card:hover & {
        opacity: 1;
    }
}

.poster-actions {
    line-height: 1;
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
