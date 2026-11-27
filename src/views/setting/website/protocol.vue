<template>
    <div class="protocol-grid">
        <el-card class="protocol-card" shadow="never">
            <template #header>
                <span class="font-medium">服务协议</span>
            </template>
            <el-form :model="formData" label-width="80px">
                <el-form-item label="协议名称">
                    <el-input v-model="formData.service_title" />
                </el-form-item>
            </el-form>

            <editor class="mb-10" v-model="formData.service_content" height="500"></editor>
        </el-card>
        <el-card class="protocol-card" shadow="never">
            <template #header>
                <span class="font-medium">隐私协议</span>
            </template>
            <el-form :model="formData" label-width="80px">
                <el-form-item label="协议名称">
                    <el-input v-model="formData.privacy_title" />
                </el-form-item>
            </el-form>

            <editor class="mb-10" v-model="formData.privacy_content" height="500"></editor>
        </el-card>
        <el-card class="protocol-card" shadow="never">
            <template #header>
                <span class="font-medium">康复须知</span>
            </template>
            <el-form :model="formData" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="formData.rehab_title" />
                </el-form-item>
            </el-form>

            <editor class="mb-10" v-model="formData.rehab_content" height="500"></editor>
        </el-card>
        <el-card class="protocol-card" shadow="never">
            <template #header>
                <span class="font-medium">成长值规则</span>
            </template>
            <el-form :model="formData" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="formData.growth_title" />
                </el-form-item>
            </el-form>

            <editor class="mb-10" v-model="formData.growth_content" height="500"></editor>
        </el-card>
    </div>
    <footer-btns v-perms="['setting.web.web_setting/setAgreement']">
        <el-button type="primary" @click="handleProtocolEdit">保存</el-button>
    </footer-btns>
</template>

<script setup lang="ts" naem="webProtocol">
import { getProtocol, setProtocol } from '@/api/setting/website'

interface formDataObj {
    service_title: string
    service_content: string
    privacy_title: string
    privacy_content: string
    rehab_title: string
    rehab_content: string
    growth_title: string
    growth_content: string
}
const formData = ref<formDataObj>({
    service_title: '',
    service_content: '',
    privacy_title: '',
    privacy_content: '',
    rehab_title: '',
    rehab_content: '',
    growth_title: '',
    growth_content: ''
})
const protocolGet = async () => {
    const res = await getProtocol()
    // 后端尚未返回新字段时兜底，避免富文本组件绑定 undefined
    formData.value = {
        ...formData.value,
        ...res,
        rehab_title: res?.rehab_title ?? '',
        rehab_content: res?.rehab_content ?? '',
        growth_title: res?.growth_title ?? '',
        growth_content: res?.growth_content ?? ''
    }
}

const handleProtocolEdit = async (): Promise<void> => {
    await setProtocol({ ...formData.value })
    protocolGet()
}
protocolGet()
</script>

<style scoped lang="scss">
.protocol-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.protocol-card {
    border: 1px solid #e8ebf5;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;

    // 交替浅背景，明确区分相邻卡片
    &:nth-child(2n) {
        background: #f9fafd;
    }

    :deep(.el-card__header) {
        border-bottom: 1px solid #eef0f7;
        background: inherit;
    }
}

@media (max-width: 1280px) {
    .protocol-grid {
        grid-template-columns: 1fr;
    }
}
</style>
