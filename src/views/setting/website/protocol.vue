<template>
    <div class="xl:flex">
        <el-card class="!border-none flex-1 xl:mr-4 mb-4" shadow="never">
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
        <el-card class="!border-none flex-1 mb-4" shadow="never">
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
        <el-card class="!border-none flex-1 xl:mr-4 mb-4" shadow="never">
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
        <el-card class="!border-none flex-1 mb-4" shadow="never">
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
