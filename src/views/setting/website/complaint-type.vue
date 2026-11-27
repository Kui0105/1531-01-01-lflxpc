<template>
    <div class="complaint-type-page">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="font-medium">投诉类型</span>
            </template>
            <div class="tip-text">多个类型名称请用英文逗号分隔</div>
            <el-form label-width="90px">
                <el-form-item label="投诉类型">
                    <el-input
                        v-model="typesText"
                        type="textarea"
                        :rows="6"
                        placeholder="如：服务态度,环境卫生,技术培训,收费问题"
                    />
                </el-form-item>
            </el-form>
            <div class="preview" v-if="typeList.length">
                <div class="preview-label">已配置类型（{{ typeList.length }}）</div>
                <el-tag v-for="t in typeList" :key="t" size="small" effect="plain" class="mr-2 mb-2">{{ t }}</el-tag>
            </div>
        </el-card>
        <footer-btns v-perms="['setting.web.web_setting/setComplaintType']">
            <el-button type="primary" @click="handleSave">保存</el-button>
        </footer-btns>
    </div>
</template>

<script setup lang="ts" name="webComplaintType">
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'website_complaint_types'
const typesText = ref('')

const typeList = computed(() =>
    typesText.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
)

const load = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        typesText.value = saved || ''
    } catch {
        typesText.value = ''
    }
}
const handleSave = async () => {
    if (!typeList.value.length) {
        ElMessage.warning('请至少填写一个投诉类型')
        return
    }
    localStorage.setItem(STORAGE_KEY, typesText.value)
    ElMessage.success('保存成功')
}
load()
</script>

<style scoped lang="scss">
.tip-text {
    margin-bottom: 12px;
    font-size: 13px;
    color: #909399;
}
.preview {
    padding: 12px 0 0 90px;
}
.preview-label {
    margin-bottom: 8px;
    font-size: 13px;
    color: #606266;
}
</style>
