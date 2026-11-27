<template>
    <div class="notice-page">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">平台公告</span>
                    <el-button type="primary" size="small" @click="openEdit()">新增</el-button>
                </div>
            </template>
            <el-table :data="noticeData" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column prop="title" label="公告标题" min-width="200" align="center" show-overflow-tooltip />
                <el-table-column prop="summary" label="公告简介" min-width="280" align="center" show-overflow-tooltip />
                <el-table-column prop="publishedAt" label="发布时间" min-width="150" align="center" />
                <el-table-column label="操作" min-width="140" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                        <el-button type="danger" link size="small" @click="deleteNotice(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑公告弹窗 -->
        <el-dialog v-model="editVisible" :title="editId ? '编辑公告' : '新增公告'" width="760px" :close-on-click-modal="false">
            <el-form :model="form" label-width="90px" class="notice-form">
                <el-form-item label="公告标题">
                    <el-input v-model="form.title" placeholder="请输入公告标题" />
                </el-form-item>
                <el-form-item label="公告简介">
                    <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入公告简介" />
                </el-form-item>
                <el-form-item label="富文本内容">
                    <editor v-model="form.content" :height="360" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="contentNotice">
import { ElMessage, ElMessageBox } from 'element-plus'

import { noticeList, type NoticeItem } from './data'

const noticeData = ref<NoticeItem[]>(noticeList.map((item) => ({ ...item })))

// 新增/编辑
const editVisible = ref(false)
const editId = ref<number | null>(null)
const emptyForm = (): Omit<NoticeItem, 'id' | 'publishedAt'> => ({ title: '', summary: '', content: '' })
const form = reactive(emptyForm())

const openEdit = (row?: NoticeItem) => {
    editId.value = row?.id ?? null
    Object.assign(form, row ? { title: row.title, summary: row.summary, content: row.content } : emptyForm())
    editVisible.value = true
}
const submitEdit = () => {
    if (!form.title.trim()) { ElMessage.warning('请输入公告标题'); return }
    if (!form.summary.trim()) { ElMessage.warning('请输入公告简介'); return }
    if (!form.content || !form.content.replace(/<[^>]*>/g, '').trim()) {
        ElMessage.warning('请输入富文本内容')
        return
    }
    if (editId.value) {
        const idx = noticeData.value.findIndex((n) => n.id === editId.value)
        if (idx > -1) noticeData.value[idx] = { ...noticeData.value[idx], ...form }
        ElMessage.success('编辑成功')
    } else {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        noticeData.value.unshift({
            id: Date.now(),
            ...form,
            publishedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
        })
        ElMessage.success('新增成功')
    }
    editVisible.value = false
}

// 删除
const deleteNotice = (row: NoticeItem) => {
    ElMessageBox.confirm(`确认删除公告「${row.title}」？`, '提示', { type: 'warning' })
        .then(() => {
            noticeData.value = noticeData.value.filter((n) => n.id !== row.id)
            ElMessage.success('删除成功')
        })
        .catch(() => {})
}
</script>

<style lang="scss" scoped>
.notice-page {
    padding: 4px;
}

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

.notice-form {
    :deep(.el-form-item) {
        margin-bottom: 16px;
    }
}
</style>
