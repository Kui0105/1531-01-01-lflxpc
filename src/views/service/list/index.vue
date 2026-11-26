<template>
    <div class="service-list-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="服务名称" clearable class="!w-[160px]" />
            <el-select v-model="category1" placeholder="一级分类" clearable class="!w-[130px]" @change="handleCategory1Change">
                <el-option v-for="item in category1Options" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="category2" placeholder="二级分类" clearable class="!w-[130px]" :disabled="!category2Options.length">
                <el-option v-for="item in category2Options" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="serviceType" placeholder="服务类型" clearable class="!w-[130px]">
                <el-option label="评估服务" value="assess" />
                <el-option label="康复服务" value="recover" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
            <el-button class="ml-auto" @click="exportList">导出</el-button>
            <el-button type="primary" @click="openAdd">新增</el-button>
        </div>

        <!-- 列表 -->
        <el-card class="list-card mt-4" shadow="never">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="全部" name="all" />
                <el-tab-pane label="上架" name="on" />
                <el-tab-pane label="下架" name="off" />
                <el-tab-pane label="回收站" name="recycle" />
            </el-tabs>
            <el-table class="service-table" :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="服务封面图" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-image
                            :src="coverUrl(row.cover)"
                            :preview-src-list="row.images.map(coverUrl)"
                            fit="cover"
                            class="cover-image"
                            preview-teleported
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="服务名称" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column label="一级分类/二级分类" min-width="150" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>{{ row.category1 }}</span>
                            <span class="cell-sub">{{ row.category2 }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="服务类型" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.type === 'assess' ? 'primary' : 'success'" size="small" effect="light">
                            {{ serviceTypeLabels[row.type as ServiceType] }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="时长" min-width="90" align="center">
                    <template #default="{ row }">{{ row.duration }} 分钟</template>
                </el-table-column>
                <el-table-column label="售价" min-width="100" align="center">
                    <template #default="{ row }"><span class="price">¥{{ money(row.price) }}</span></template>
                </el-table-column>
                <el-table-column label="原价" min-width="100" align="center">
                    <template #default="{ row }"><span class="origin-price">¥{{ money(row.originPrice) }}</span></template>
                </el-table-column>
                <el-table-column label="标签" min-width="120" align="center">
                    <template #default="{ row }">
                        <div class="tag-list">
                            <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                            <span v-if="!row.tags.length" class="cell-sub">无</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="therapistTitle" label="关联康复师职称" min-width="140" align="center" />
                <el-table-column label="有效服务人次系数" min-width="140" align="center">
                    <template #default="{ row }">{{ row.validCountFactor }}</template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" min-width="90" align="center" />
                <el-table-column label="热门标签" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag v-if="row.hotTag" type="danger" size="small" effect="light">{{ row.hotTag }}</el-tag>
                        <span v-else class="cell-sub">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.onSale === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.onSale === 'on' ? '上架' : '下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="300" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <template v-if="activeTab === 'recycle'">
                            <el-button type="primary" link size="small" @click="restoreService(row)">恢复</el-button>
                            <el-button type="danger" link size="small" @click="permanentDelete(row)">彻底删除</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
                            <el-button
                                :type="row.onSale === 'on' ? 'warning' : 'success'"
                                link
                                size="small"
                                @click="toggleSale(row)"
                            >
                                {{ row.onSale === 'on' ? '下架' : '上架' }}
                            </el-button>
                            <el-button type="primary" link size="small" @click="openTitle(row)">关联职称</el-button>
                            <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                            <el-button type="danger" link size="small" @click="deleteService(row)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            v-model="formVisible"
            :title="isEdit ? '编辑服务' : '新增服务'"
            width="900px"
            top="5vh"
        >
            <el-form :model="form" label-width="120px" class="service-form">
                <el-tabs v-model="formTab" class="form-tabs">
                    <el-tab-pane label="基础信息" name="base">
                <el-row :gutter="16">
                    <el-col :span="12">
                        <el-form-item label="服务名称" required>
                            <el-input v-model="form.name" placeholder="请输入服务名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="服务类型" required>
                            <el-select v-model="form.type" placeholder="请选择服务类型" class="!w-full">
                                <el-option label="评估服务" value="assess" />
                                <el-option label="康复服务" value="recover" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="一级分类" required>
                            <el-select v-model="form.category1" placeholder="请选择一级分类" class="!w-full" @change="handleFormCategory1Change">
                                <el-option v-for="item in category1Options" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="二级分类" required>
                            <el-select v-model="form.category2" placeholder="请选择二级分类" class="!w-full" :disabled="!formCategory2Options.length">
                                <el-option v-for="item in formCategory2Options" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="封面图/轮播图">
                            <div class="image-upload-list">
                                <el-image
                                    v-for="(img, index) in form.images"
                                    :key="index"
                                    :src="coverUrl(img)"
                                    fit="cover"
                                    class="form-image"
                                />
                                <el-button type="primary" plain @click="addFormImage">添加图片</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="服务简介">
                            <el-input v-model="form.intro" type="textarea" :rows="2" placeholder="请输入服务简介" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="服务详情">
                            <editor v-model="form.detail" :height="420" />
                        </el-form-item>
                    </el-col>
                </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="价格与规则" name="price">
                <el-row :gutter="16">
                    <el-col :span="8">
                        <el-form-item label="时长（分钟）">
                            <el-input-number v-model="form.duration" :min="1" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="售价">
                            <el-input-number v-model="form.price" :min="0" :precision="2" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="原价">
                            <el-input-number v-model="form.originPrice" :min="0" :precision="2" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效期（天）">
                            <el-input-number v-model="form.validDays" :min="1" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效服务人次">
                            <el-input-number v-model="form.validCountFactor" :min="0" :precision="1" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排序值">
                            <el-input-number v-model="form.sort" :min="0" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="适用门店">
                            <el-select v-model="form.stores" multiple placeholder="请选择适用门店" class="!w-full">
                                <el-option v-for="item in storeOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="关联康复师职称">
                            <el-select v-model="form.therapistTitle" placeholder="请选择关联职称" class="!w-full">
                                <el-option v-for="item in therapistTitleOptions" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="营销设置" name="market">
                <el-row :gutter="16">
                    <el-col :span="8">
                        <el-form-item label="标签">
                            <el-select v-model="form.tags" multiple allow-create filterable default-first-option placeholder="请输入标签" class="!w-full" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="热门标签">
                            <el-select v-model="form.hotTag" clearable placeholder="请选择" class="!w-full">
                                <el-option label="热门" value="热门" />
                                <el-option label="推荐" value="推荐" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="优惠标签">
                            <el-input v-model="form.discountTag" placeholder="请输入优惠标签" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="服务须知">
                            <el-input v-model="form.notice" type="textarea" :rows="3" placeholder="请输入服务须知" />
                        </el-form-item>
                    </el-col>
                </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认提交</el-button>
            </template>
        </el-dialog>

        <!-- 关联职称弹窗 -->
        <el-dialog v-model="titleVisible" title="关联康复师职称" width="460px">
            <div class="title-tip">选择可预约该服务的康复师职称范围，保存后用户端预约康复师列表将按职称过滤。</div>
            <el-radio-group v-model="titleForm.therapistTitle" class="title-group">
                <el-radio v-for="item in therapistTitleOptions" :key="item" :value="item">{{ item }}</el-radio>
            </el-radio-group>
            <template #footer>
                <el-button @click="titleVisible = false">取消</el-button>
                <el-button type="primary" @click="submitTitle">保存</el-button>
            </template>
        </el-dialog>

        <!-- 查看详情弹窗 -->
        <el-drawer v-model="detailVisible" size="760px">
            <template #header>
                <span class="header-title">服务详情 - {{ currentItem?.name }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">基础信息</span></template>
                    <div class="detail-cover">
                        <el-image :src="coverUrl(currentItem.cover)" fit="cover" class="detail-cover-image" />
                    </div>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">服务名称</span><span class="info-value">{{ currentItem.name }}</span></div>
                        <div class="info-item"><span class="info-label">服务类型</span><span class="info-value">{{ serviceTypeLabels[currentItem.type] }}</span></div>
                        <div class="info-item"><span class="info-label">一级分类</span><span class="info-value">{{ currentItem.category1 }}</span></div>
                        <div class="info-item"><span class="info-label">二级分类</span><span class="info-value">{{ currentItem.category2 }}</span></div>
                        <div class="info-item"><span class="info-label">时长</span><span class="info-value">{{ currentItem.duration }} 分钟</span></div>
                        <div class="info-item"><span class="info-label">售价/原价</span><span class="info-value">¥{{ money(currentItem.price) }} / ¥{{ money(currentItem.originPrice) }}</span></div>
                        <div class="info-item"><span class="info-label">有效期</span><span class="info-value">{{ currentItem.validDays }} 天</span></div>
                        <div class="info-item"><span class="info-label">关联康复师职称</span><span class="info-value">{{ currentItem.therapistTitle }}</span></div>
                        <div class="info-item"><span class="info-label">有效服务人次系数</span><span class="info-value">{{ currentItem.validCountFactor }}</span></div>
                        <div class="info-item"><span class="info-label">排序值</span><span class="info-value">{{ currentItem.sort }}</span></div>
                        <div class="info-item"><span class="info-label">热门标签</span><span class="info-value">{{ currentItem.hotTag || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">优惠标签</span><span class="info-value">{{ currentItem.discountTag || '-' }}</span></div>
                        <div class="info-item"><span class="info-label">上架状态</span><span class="info-value">{{ currentItem.onSale === 'on' ? '上架' : '下架' }}</span></div>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">服务简介</span></template>
                    <div class="review-content">{{ currentItem.intro }}</div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">服务详情</span></template>
                    <div class="detail-content" v-html="currentItem.detail" />
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">服务须知</span></template>
                    <div class="review-content">{{ currentItem.notice }}</div>
                </el-card>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup name="serviceList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { exportCsv } from '@/utils/export-csv'

import {
    category1Options,
    categoryOptions,
    services,
    serviceTypeLabels,
    storeOptions,
    therapistTitleOptions
} from './data'
import type { OnSaleStatus, ServiceItem, ServiceType } from './data'

const money = (value: number) => value.toFixed(2)

// mock 文字生成 SVG 占位图
const coverUrl = (label: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#eef2ff"/><text x="200" y="150" font-size="26" fill="#4A5DFF" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const data = reactive(cloneDeep(services))

// 筛选
const keyword = ref('')
const category1 = ref('')
const category2 = ref('')
const serviceType = ref('')
const activeTab = ref('all')
const query = reactive({ keyword: '', category1: '', category2: '', type: '' })

const category2Options = computed(() => (category1.value ? categoryOptions[category1.value] || [] : []))
const handleCategory1Change = () => {
    category2.value = ''
}

const filteredList = computed(() =>
    data
        .filter((item) => {
            const matchKeyword = !query.keyword || item.name.includes(query.keyword)
            const matchC1 = !query.category1 || item.category1 === query.category1
            const matchC2 = !query.category2 || item.category2 === query.category2
            const matchType = !query.type || item.type === query.type
            // 状态 TAB：全部/上架/下架/回收站
            let matchTab = true
            if (activeTab.value === 'recycle') matchTab = !!item.deleted
            else if (activeTab.value === 'on') matchTab = !item.deleted && item.onSale === 'on'
            else if (activeTab.value === 'off') matchTab = !item.deleted && item.onSale === 'off'
            else matchTab = !item.deleted
            return matchKeyword && matchC1 && matchC2 && matchType && matchTab
        })
        .sort((a, b) => b.sort - a.sort) // 排序值大的排前面
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.category1 = category1.value
    query.category2 = category2.value
    query.type = serviceType.value
}
const resetSearch = () => {
    keyword.value = ''
    category1.value = ''
    category2.value = ''
    serviceType.value = ''
    activeTab.value = 'all'
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '服务列表',
        ['服务名称', '一级分类', '二级分类', '服务类型', '时长', '售价', '原价', '关联康复师职称', '有效服务人次系数', '排序值', '热门标签', '上架状态'],
        filteredList.value.map((row) => [
            row.name,
            row.category1,
            row.category2,
            serviceTypeLabels[row.type],
            `${row.duration}分钟`,
            row.price,
            row.originPrice,
            row.therapistTitle,
            row.validCountFactor,
            row.sort,
            row.hotTag || '-',
            row.onSale === 'on' ? '上架' : '下架'
        ])
    )
}

// 新增/编辑表单
const formVisible = ref(false)
const formTab = ref('base')
const isEdit = ref(false)
const editingId = ref(0)
const formCategory2Options = computed(() => (form.category1 ? categoryOptions[form.category1] || [] : []))
const handleFormCategory1Change = () => {
    form.category2 = ''
}
const emptyForm = (): ServiceItem => ({
    id: 0,
    cover: '',
    images: [],
    name: '',
    category1: '',
    category2: '',
    type: 'recover',
    duration: 60,
    price: 0,
    originPrice: 0,
    tags: [],
    therapistTitle: '所有康复师',
    validCountFactor: 1,
    sort: 0,
    hotTag: '',
    onSale: 'on',
    validDays: 365,
    stores: [],
    discountTag: '',
    intro: '',
    detail: '',
    notice: ''
})
const form = reactive<ServiceItem>(emptyForm())

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    formTab.value = 'base'
    Object.assign(form, emptyForm())
    formVisible.value = true
}
const openEdit = (row: ServiceItem) => {
    isEdit.value = true
    editingId.value = row.id
    formTab.value = 'base'
    Object.assign(form, cloneDeep(row))
    formVisible.value = true
}
const addFormImage = () => {
    form.images.push(`服务图片${form.images.length + 1}`)
    if (!form.cover) form.cover = form.images[0]
}
const submitForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入服务名称')
        return
    }
    if (!form.category1 || !form.category2) {
        ElMessage.warning('请选择一级分类与二级分类')
        return
    }
    if (!form.images.length) {
        ElMessage.warning('请添加服务图片')
        return
    }
    if (isEdit.value) {
        const index = data.findIndex((item) => item.id === editingId.value)
        if (index > -1) data[index] = { ...cloneDeep(form), id: editingId.value }
        ElMessage.success('服务已更新')
    } else {
        data.unshift({ ...cloneDeep(form), id: Date.now() })
        ElMessage.success('服务已新增')
    }
    formVisible.value = false
}

// 上下架
const toggleSale = (row: ServiceItem) => {
    const target: OnSaleStatus = row.onSale === 'on' ? 'off' : 'on'
    const isOn = target === 'on'
    ElMessageBox.confirm(
        isOn ? '确认上架该服务？上架后用户端可见且可下单。' : '确认下架该服务？下架后用户端不可见且不可下单。',
        isOn ? '上架二次确认' : '下架二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.onSale = target
            ElMessage.success(isOn ? '服务已上架' : '服务已下架')
        })
        .catch(() => {})
}

// 关联职称
const titleVisible = ref(false)
const titleForm = reactive({ therapistTitle: '所有康复师', id: 0 })
const openTitle = (row: ServiceItem) => {
    titleForm.id = row.id
    titleForm.therapistTitle = row.therapistTitle
    titleVisible.value = true
}
const submitTitle = () => {
    const target = data.find((item) => item.id === titleForm.id)
    if (target) target.therapistTitle = titleForm.therapistTitle
    titleVisible.value = false
    ElMessage.success('关联职称已保存')
}

// 查看详情
const detailVisible = ref(false)
const currentItem = ref<ServiceItem | null>(null)
const openDetail = (row: ServiceItem) => {
    currentItem.value = row
    detailVisible.value = true
}

// 删除（进入回收站）
const deleteService = (row: ServiceItem) => {
    ElMessageBox.confirm(
        `确认删除服务「${row.name}」？删除后可在回收站恢复或彻底删除。`,
        '删除二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.deleted = true
            ElMessage.success('服务已移入回收站')
        })
        .catch(() => {})
}

// 恢复
const restoreService = (row: ServiceItem) => {
    ElMessageBox.confirm(`确认恢复服务「${row.name}」？`, '恢复二次确认', { type: 'info' })
        .then(() => {
            row.deleted = false
            ElMessage.success('服务已恢复')
        })
        .catch(() => {})
}

// 彻底删除
const permanentDelete = (row: ServiceItem) => {
    ElMessageBox.confirm(
        `确认彻底删除服务「${row.name}」？删除后不可恢复。`,
        '彻底删除二次确认',
        { type: 'warning' }
    )
        .then(() => {
            const index = data.findIndex((item) => item.id === row.id)
            if (index > -1) data.splice(index, 1)
            ElMessage.success('服务已彻底删除')
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

.list-card,
.info-card {
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

.cover-image {
    width: 60px;
    height: 45px;
    border-radius: 4px;
}

.cell-lines {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    line-height: 1.5;
}

.cell-sub {
    font-size: 12px;
    color: #909399;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
}

.price {
    font-weight: 600;
    color: #f56c6c;
}

.origin-price {
    color: #c0c4cc;
    text-decoration: line-through;
}

.service-form {
    min-height: 380px;
}

.form-tabs {
    :deep(.el-tabs__content) {
        padding-top: 18px;
    }
}

.image-upload-list {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.form-image {
    width: 80px;
    height: 60px;
    border-radius: 4px;
}

.title-tip {
    margin-bottom: 16px;
    font-size: 13px;
    line-height: 1.7;
    color: #606266;
}

.title-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.detail-cover {
    margin-bottom: 16px;
}

.detail-cover-image {
    width: 200px;
    height: 150px;
    border-radius: 6px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px 20px;
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

.review-content {
    font-size: 14px;
    line-height: 1.8;
    color: #303133;
}

.detail-content {
    font-size: 14px;
    line-height: 1.8;
    color: #303133;
}

:deep(.service-table .el-table__cell .cell) {
    white-space: nowrap;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
    white-space: normal;
}
</style>
