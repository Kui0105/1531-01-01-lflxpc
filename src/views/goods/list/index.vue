<template>
    <div class="goods-list-page">
        <!-- 筛选搜索 -->
        <div class="filter-bar">
            <span class="filter-title"><i class="filter-dot" />筛选搜索</span>
            <el-input v-model="keyword" placeholder="商品名称" clearable class="!w-[160px]" />
            <el-select v-model="category1" placeholder="一级分类" clearable class="!w-[130px]" @change="handleCategory1Change">
                <el-option v-for="item in category1Options" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="category2" placeholder="二级分类" clearable class="!w-[130px]" :disabled="!category2Options.length">
                <el-option v-for="item in category2Options" :key="item" :label="item" :value="item" />
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
            <el-table class="goods-table" :data="filteredList" style="width: 100%" :cell-style="{ padding: '12px 0' }">
                <el-table-column label="商品主图" min-width="110" align="center">
                    <template #default="{ row }">
                        <el-image
                            :src="coverUrl(row.mainImage)"
                            :preview-src-list="row.images.map(coverUrl)"
                            fit="cover"
                            class="goods-image"
                            preview-teleported
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" min-width="150" align="center" show-overflow-tooltip />
                <el-table-column label="一级/二级分类" min-width="140" align="center">
                    <template #default="{ row }">
                        <div class="cell-lines">
                            <span>{{ row.category1 }}</span>
                            <span class="cell-sub">{{ row.category2 }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="售价" min-width="90" align="center">
                    <template #default="{ row }"><span class="price">¥{{ money(row.price) }}</span></template>
                </el-table-column>
                <el-table-column label="原价" min-width="90" align="center">
                    <template #default="{ row }"><span class="origin-price">¥{{ money(row.originPrice) }}</span></template>
                </el-table-column>
                <el-table-column label="会员价" min-width="90" align="center">
                    <template #default="{ row }"><span class="member-price">¥{{ money(row.memberPrice) }}</span></template>
                </el-table-column>
                <el-table-column prop="sold" label="已售" min-width="80" align="center" />
                <el-table-column label="库存" min-width="90" align="center">
                    <template #default="{ row }">
                        <span :class="{ 'stock-zero': row.stock === 0 }">{{ row.stock }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" min-width="120" align="center">
                    <template #default="{ row }">
                        <span>{{ row.spec }}</span>
                        <el-tag size="small" effect="plain" class="ml-1">{{ row.specType === 'multi' ? '多' : '单' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" min-width="90" align="center" />
                <el-table-column label="商品标签" min-width="120" align="center">
                    <template #default="{ row }">
                        <div class="tag-list">
                            <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                            <span v-if="!row.tags.length" class="cell-sub">无</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" min-width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.onSale === 'on' ? 'success' : 'info'" size="small" effect="light">
                            {{ row.onSale === 'on' ? '上架' : '下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="230" align="center" fixed="right" class-name="operation-cell">
                    <template #default="{ row }">
                        <template v-if="activeTab === 'recycle'">
                            <el-button type="primary" link size="small" @click="restoreGoods(row)">恢复</el-button>
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
                            <el-button type="primary" link size="small" @click="openDetail(row)">查看详情</el-button>
                            <el-button type="danger" link size="small" @click="deleteGoods(row)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            v-model="formVisible"
            :title="isEdit ? '编辑商品' : '新增商品'"
            width="940px"
            top="5vh"
        >
            <el-form :model="form" label-width="120px" class="goods-form">
                <el-tabs v-model="formTab" class="form-tabs">
                    <el-tab-pane label="基础信息" name="base">
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <el-form-item label="商品名称" required>
                                    <el-input v-model="form.name" placeholder="请输入商品名称" />
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
                            <el-col :span="12">
                                <el-form-item label="商品标签">
                                    <el-select v-model="form.tags" multiple allow-create filterable default-first-option placeholder="请输入标签" class="!w-full" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                        <el-form-item label="商品轮播图">
                            <div class="image-upload-list">
                                <div v-for="(img, index) in form.images" :key="index" class="image-item">
                                    <el-image :src="coverUrl(img)" fit="cover" class="form-image" :preview-src-list="form.images.map(coverUrl)" :initial-index="index" preview-teleported />
                                    <span v-if="index === 0" class="image-index">主图</span>
                                    <div class="image-actions">
                                        <el-upload
                                            accept=".png,.jpg,.jpeg"
                                            :auto-upload="false"
                                            :show-file-list="false"
                                            :on-change="(file) => replaceFormImage(file, index)"
                                        >
                                            <el-button type="primary" link size="small">替换</el-button>
                                        </el-upload>
                                        <el-button type="danger" link size="small" @click="removeFormImage(index)">删除</el-button>
                                    </div>
                                </div>
                                <el-upload
                                    accept=".png,.jpg,.jpeg"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    :on-change="addFormImage"
                                >
                                    <div class="image-add">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                        <span>添加图片</span>
                                    </div>
                                </el-upload>
                            </div>
                            <div class="image-hint">支持 PNG、JPG 格式，第一张为主图，可替换或删除</div>
                        </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="商品详情">
                                    <editor v-model="form.detail" :height="360" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="价格与库存" name="price">
                        <div class="section-title">规格设置</div>
                        <el-form-item label="规格类型">
                            <el-radio-group v-model="form.specType" @change="handleSpecTypeChange">
                                <el-radio value="single">单规格</el-radio>
                                <el-radio value="multi">多规格</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <!-- 单规格：简洁的一行 -->
                        <div v-if="form.specType === 'single'" class="spec-block">
                            <div class="spec-single-row">
                                <div class="spec-field">
                                    <span class="spec-field-label">规格名称</span>
                                    <el-input v-model="form.specs[0].name" placeholder="如：10包/盒" />
                                </div>
                                <div class="spec-field">
                                    <span class="spec-field-label">售价</span>
                                    <el-input-number v-model="form.specs[0].price" :min="0" :precision="2" controls-position="right" class="!w-full" />
                                </div>
                                <div class="spec-field">
                                    <span class="spec-field-label">原价</span>
                                    <el-input-number v-model="form.specs[0].originPrice" :min="0" :precision="2" controls-position="right" class="!w-full" />
                                </div>
                                <div class="spec-field">
                                    <span class="spec-field-label">会员价</span>
                                    <el-input-number v-model="form.specs[0].memberPrice" :min="0" :precision="2" controls-position="right" class="!w-full" />
                                </div>
                                <div class="spec-field">
                                    <span class="spec-field-label">库存</span>
                                    <el-input-number v-model="form.specs[0].stock" :min="0" controls-position="right" class="!w-full" />
                                </div>
                            </div>
                        </div>

                        <!-- 多规格：规格项 + 规格值，组合生成 SKU -->
                        <div v-else class="spec-block">
                            <div class="spec-group-list">
                                <div v-for="(group, gIndex) in form.specGroups" :key="group.id" class="spec-group">
                                    <div class="spec-group-head">
                                        <span class="spec-field-label">规格项 {{ gIndex + 1 }}</span>
                                        <el-input
                                            v-model="group.name"
                                            size="small"
                                            class="spec-group-name"
                                            placeholder="如：颜色 / 尺码"
                                            @change="regenerateSkus"
                                        />
                                        <el-button type="danger" link size="small" @click="removeGroup(gIndex)">删除规格项</el-button>
                                    </div>
                                    <div class="spec-values">
                                        <div class="spec-value-tags">
                                            <el-tag
                                                v-for="value in group.values"
                                                :key="value"
                                                closable
                                                size="small"
                                                @close="removeValue(gIndex, value)"
                                            >
                                                {{ value }}
                                            </el-tag>
                                            <span v-if="!group.values.length" class="spec-value-empty">暂无规格值，请在下方添加</span>
                                        </div>
                                        <div class="spec-value-add">
                                            <el-input
                                                v-model="newValueMap[group.id]"
                                                size="small"
                                                class="spec-value-input"
                                                placeholder="输入规格值后回车"
                                                @keyup.enter="addValue(gIndex)"
                                            />
                                            <el-button size="small" type="primary" plain @click="addValue(gIndex)">添加</el-button>
                                        </div>
                                    </div>
                                </div>
                                <el-button type="primary" plain size="small" @click="addGroup">+ 添加规格项</el-button>
                            </div>

                            <!-- SKU 组合表格 -->
                            <div v-if="form.specs.length" class="sku-section">
                                <div class="sku-title">规格组合（{{ form.specs.length }} 个 SKU）</div>
                                <el-table :data="form.specs" border size="small" max-height="300">
                                    <el-table-column label="规格组合" min-width="160" align="center" fixed="left">
                                        <template #default="{ row }">
                                            <span>{{ row.name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="售价" min-width="130" align="center">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.price" :min="0" :precision="2" size="small" controls-position="right" class="!w-full" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="原价" min-width="130" align="center">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.originPrice" :min="0" :precision="2" size="small" controls-position="right" class="!w-full" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="会员价" min-width="130" align="center">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.memberPrice" :min="0" :precision="2" size="small" controls-position="right" class="!w-full" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="库存" min-width="120" align="center">
                                        <template #default="{ row }">
                                            <el-input-number v-model="row.stock" :min="0" size="small" controls-position="right" class="!w-full" />
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div v-else class="sku-empty">请添加规格项并勾选规格值，系统将自动生成规格组合</div>
                        </div>

                        <div class="section-title mt-4">价格与库存汇总</div>
                        <el-row :gutter="16" class="summary-row">
                            <el-col :span="6">
                                <el-form-item label="售价">
                                    <el-input :model-value="`¥${money(summaryPrice)}`" disabled class="!w-full" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="原价">
                                    <el-input :model-value="`¥${money(summaryOrigin)}`" disabled class="!w-full" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="会员价">
                                    <el-input :model-value="`¥${money(summaryMember)}`" disabled class="!w-full" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="总库存">
                                    <el-input :model-value="totalStock" disabled class="!w-full" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <el-form-item label="排序值">
                                    <el-input-number v-model="form.sort" :min="0" class="!w-full" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="售后期限（天）">
                                    <el-input-number v-model="form.afterSaleDays" :min="0" class="!w-full" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="配送与服务" name="delivery">
                        <el-row :gutter="16">
                            <el-col :span="12">
                                <el-form-item label="配送方式">
                                    <el-select v-model="form.deliveryType" class="!w-full">
                                        <el-option label="快递" value="express" />
                                        <el-option label="门店自提" value="pickup" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="form.deliveryType === 'express'" :span="12">
                                <el-form-item label="运费模板">
                                    <el-select v-model="form.freightTemplate" placeholder="请选择运费模板" class="!w-full">
                                        <el-option
                                            v-for="item in freightTemplates"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.name"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col v-if="form.deliveryType === 'express' && form.freightTemplate" :span="24">
                                <div class="template-desc">
                                    模板说明：{{ freightTemplates.find((t) => t.name === form.freightTemplate)?.desc }}
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="分装服务">
                                    <el-switch v-model="form.packingService" active-text="支持" inactive-text="不支持" />
                                </el-form-item>
                            </el-col>
                            <el-col v-if="form.packingService" :span="24">
                                <el-form-item label="分装服务说明">
                                    <el-input v-model="form.packingDesc" type="textarea" :rows="2" placeholder="请输入分装服务说明" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="购买送券" name="coupon">
                        <div class="coupon-tip">配置购买指定商品发放优惠券及订单金额门槛（如满1000发券A、满2000发券B）</div>
                        <div class="coupon-list">
                            <div v-for="(coupon, index) in form.giftCoupons" :key="coupon.id" class="coupon-row">
                                <span class="coupon-label">订单满</span>
                                <el-input-number v-model="coupon.threshold" :min="0" :precision="2" class="coupon-threshold" />
                                <span class="coupon-label">元，发放</span>
                                <el-select v-model="coupon.couponId" placeholder="请选择优惠券" class="coupon-select">
                                    <el-option
                                        v-for="item in couponOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"
                                    />
                                </el-select>
                                <el-button type="danger" link @click="form.giftCoupons.splice(index, 1)">删除</el-button>
                            </div>
                            <el-button type="primary" plain @click="addCoupon">添加送券配置</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <template #footer>
                <el-button @click="formVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认提交</el-button>
            </template>
        </el-dialog>

        <!-- 查看详情弹窗 -->
        <el-drawer v-model="detailVisible" size="760px">
            <template #header>
                <span class="header-title">商品详情 - {{ currentItem?.name }}</span>
            </template>
            <template v-if="currentItem">
                <el-card class="info-card" shadow="never">
                    <template #header><span class="header-title">基础信息</span></template>
                    <div class="detail-images">
                        <el-image
                            v-for="(img, index) in currentItem.images"
                            :key="index"
                            :src="coverUrl(img)"
                            :preview-src-list="currentItem.images.map(coverUrl)"
                            :initial-index="index"
                            fit="cover"
                            class="detail-image"
                            preview-teleported
                        />
                    </div>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">商品名称</span><span class="info-value">{{ currentItem.name }}</span></div>
                        <div class="info-item"><span class="info-label">一级分类</span><span class="info-value">{{ currentItem.category1 }}</span></div>
                        <div class="info-item"><span class="info-label">二级分类</span><span class="info-value">{{ currentItem.category2 }}</span></div>
                        <div class="info-item"><span class="info-label">售价/原价</span><span class="info-value">¥{{ money(currentItem.price) }} / ¥{{ money(currentItem.originPrice) }}</span></div>
                        <div class="info-item"><span class="info-label">会员价</span><span class="info-value">¥{{ money(currentItem.memberPrice) }}</span></div>
                        <div class="info-item"><span class="info-label">已售</span><span class="info-value">{{ currentItem.sold }}</span></div>
                        <div class="info-item"><span class="info-label">总库存</span><span class="info-value">{{ currentItem.stock }}</span></div>
                        <div class="info-item"><span class="info-label">排序值</span><span class="info-value">{{ currentItem.sort }}</span></div>
                        <div class="info-item"><span class="info-label">售后期限</span><span class="info-value">{{ currentItem.afterSaleDays }} 天</span></div>
                        <div class="info-item"><span class="info-label">上架状态</span><span class="info-value">{{ currentItem.onSale === 'on' ? '上架' : '下架' }}</span></div>
                    </div>
                    <div class="tag-list mt-2">
                        <el-tag v-for="tag in currentItem.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">规格（{{ currentItem.specType === 'multi' ? '多规格' : '单规格' }}）</span></template>
                    <el-table :data="currentItem.specs" border size="small">
                        <el-table-column prop="name" label="规格名称" min-width="140" align="center" />
                        <el-table-column label="售价" min-width="100" align="center">
                            <template #default="{ row }">¥{{ money(row.price) }}</template>
                        </el-table-column>
                        <el-table-column label="原价" min-width="100" align="center">
                            <template #default="{ row }">¥{{ money(row.originPrice) }}</template>
                        </el-table-column>
                        <el-table-column label="会员价" min-width="100" align="center">
                            <template #default="{ row }">¥{{ money(row.memberPrice) }}</template>
                        </el-table-column>
                        <el-table-column prop="stock" label="库存" min-width="90" align="center" />
                    </el-table>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">配送与服务</span></template>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">配送方式</span><span class="info-value">{{ currentItem.deliveryType === 'express' ? '快递' : '门店自提' }}</span></div>
                        <div v-if="currentItem.deliveryType === 'express'" class="info-item"><span class="info-label">运费模板</span><span class="info-value">{{ currentItem.freightTemplate }}</span></div>
                        <div class="info-item"><span class="info-label">分装服务</span><span class="info-value">{{ currentItem.packingService ? '支持' : '不支持' }}</span></div>
                        <div v-if="currentItem.packingService" class="info-item full-width"><span class="info-label">分装说明</span><span class="info-value">{{ currentItem.packingDesc }}</span></div>
                    </div>
                </el-card>
                <el-card v-if="currentItem.giftCoupons.length" class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">购买送券</span></template>
                    <div v-for="coupon in currentItem.giftCoupons" :key="coupon.id" class="coupon-view">
                        订单满 ¥{{ money(coupon.threshold) }} 发放「{{ couponName(coupon.couponId) }}」
                    </div>
                </el-card>
                <el-card class="info-card mt-4" shadow="never">
                    <template #header><span class="header-title">商品详情</span></template>
                    <div class="detail-content" v-html="currentItem.detail" />
                </el-card>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup name="goodsList">
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

import { exportCsv } from '@/utils/export-csv'

import {
    category1Options,
    categoryOptions,
    couponName,
    couponOptions,
    freightTemplates,
    goodsList
} from './data'
import type { GoodsItem, SpecItem } from './data'

const money = (value: number) => value.toFixed(2)

const coverUrl = (label: string) => {
    if (label.startsWith('data:image') || label.startsWith('http')) return label
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#eef2ff"/><text x="200" y="150" font-size="26" fill="#4A5DFF" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const data = reactive(cloneDeep(goodsList))

// 筛选
const keyword = ref('')
const category1 = ref('')
const category2 = ref('')
const activeTab = ref('all')
const query = reactive({ keyword: '', category1: '', category2: '' })

const category2Options = computed(() => (category1.value ? categoryOptions[category1.value] || [] : []))
const handleCategory1Change = () => {
    category2.value = ''
}

// 状态 TAB + 排序值降序
const filteredList = computed(() =>
    data
        .filter((item) => {
            const matchKeyword = !query.keyword || item.name.includes(query.keyword)
            const matchC1 = !query.category1 || item.category1 === query.category1
            const matchC2 = !query.category2 || item.category2 === query.category2
            let matchTab = true
            if (activeTab.value === 'recycle') matchTab = !!item.deleted
            else if (activeTab.value === 'on') matchTab = !item.deleted && item.onSale === 'on'
            else if (activeTab.value === 'off') matchTab = !item.deleted && item.onSale === 'off'
            else matchTab = !item.deleted
            return matchKeyword && matchC1 && matchC2 && matchTab
        })
        .sort((a, b) => b.sort - a.sort)
)

const handleSearch = () => {
    query.keyword = keyword.value.trim()
    query.category1 = category1.value
    query.category2 = category2.value
}
const resetSearch = () => {
    keyword.value = ''
    category1.value = ''
    category2.value = ''
    activeTab.value = 'all'
    handleSearch()
}

const exportList = () => {
    exportCsv(
        '商品列表',
        ['商品名称', '一级分类', '二级分类', '售价', '原价', '会员价', '已售', '库存', '规格', '排序值', '商品标签', '上架状态'],
        filteredList.value.map((row) => [
            row.name,
            row.category1,
            row.category2,
            row.price,
            row.originPrice,
            row.memberPrice,
            row.sold,
            row.stock,
            row.spec,
            row.sort,
            row.tags.join('、'),
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

const emptySpec = (): SpecItem => ({ id: Date.now(), name: '', price: 0, originPrice: 0, memberPrice: 0, stock: 0 })
const emptyForm = (): GoodsItem => ({
    id: 0,
    mainImage: '',
    images: [],
    name: '',
    category1: '',
    category2: '',
    specType: 'single',
    specGroups: [],
    specs: [emptySpec()],
    price: 0,
    originPrice: 0,
    memberPrice: 0,
    sold: 0,
    stock: 0,
    spec: '',
    sort: 0,
    tags: [],
    onSale: 'on',
    deliveryType: 'express',
    freightTemplate: freightTemplates[0].name,
    packingService: false,
    packingDesc: '',
    giftCoupons: [],
    afterSaleDays: 7,
    detail: ''
})
const form = reactive<GoodsItem>(emptyForm())

// ===== 规格处理 =====
// 新增规格值的输入框映射（按规格项 id）
const newValueMap = reactive<Record<number, string>>({})

const totalStock = computed(() => form.specs.reduce((sum, item) => sum + (item.stock || 0), 0))
// 汇总价格：单规格取规格值，多规格取最低售价/会员价、最高原价
const summaryPrice = computed(() =>
    form.specType === 'single'
        ? form.specs[0]?.price || 0
        : form.specs.length ? Math.min(...form.specs.map((s) => s.price)) : 0
)
const summaryMember = computed(() =>
    form.specType === 'single'
        ? form.specs[0]?.memberPrice || 0
        : form.specs.length ? Math.min(...form.specs.map((s) => s.memberPrice)) : 0
)
const summaryOrigin = computed(() =>
    form.specType === 'single'
        ? form.specs[0]?.originPrice || 0
        : form.specs.length ? Math.max(...form.specs.map((s) => s.originPrice)) : 0
)

const handleSpecTypeChange = () => {
    if (form.specType === 'single') {
        // 切回单规格：保留第一条 SKU，清空规格项
        form.specGroups = []
        form.specs = [form.specs[0] || emptySpec()]
    } else {
        // 切到多规格：初始化一个空规格项
        form.specGroups = [{ id: Date.now(), name: '', values: [] }]
        form.specs = []
    }
}

// 添加规格项
const addGroup = () => {
    form.specGroups.push({ id: Date.now(), name: '', values: [] })
}
// 删除规格项
const removeGroup = (index: number) => {
    form.specGroups.splice(index, 1)
    regenerateSkus()
}
// 添加规格值
const addValue = (gIndex: number) => {
    const group = form.specGroups[gIndex]
    const val = (newValueMap[group.id] || '').trim()
    if (!val) {
        ElMessage.warning('请输入规格值')
        return
    }
    if (group.values.includes(val)) {
        ElMessage.warning('该规格值已存在')
        return
    }
    group.values.push(val)
    newValueMap[group.id] = ''
    regenerateSkus()
}
// 删除规格值
const removeValue = (gIndex: number, value: string) => {
    const group = form.specGroups[gIndex]
    group.values = group.values.filter((v) => v !== value)
    regenerateSkus()
}

// 根据规格项生成 SKU 组合（笛卡尔积），保留已有 SKU 的价格库存
const regenerateSkus = () => {
    const validGroups = form.specGroups.filter((g) => g.name.trim() && g.values.length)
    if (!validGroups.length) {
        form.specs = []
        return
    }
    // 笛卡尔积
    const combos = validGroups.reduce<string[][]>(
        (acc, group) => acc.flatMap((combo) => group.values.map((v) => [...combo, v])),
        [[]]
    )
    // 按组合名称保留旧 SKU 数据
    const oldMap = new Map(form.specs.map((s) => [s.name, s]))
    form.specs = combos.map((combo) => {
        const name = combo.join(' / ')
        const old = oldMap.get(name)
        return old
            ? { ...old, name }
            : { id: Date.now() + Math.random(), name, price: 0, originPrice: 0, memberPrice: 0, stock: 0 }
    })
}

const openAdd = () => {
    isEdit.value = false
    editingId.value = 0
    formTab.value = 'base'
    Object.assign(form, emptyForm())
    formVisible.value = true
}
const openEdit = (row: GoodsItem) => {
    isEdit.value = true
    editingId.value = row.id
    formTab.value = 'base'
    Object.assign(form, cloneDeep(row))
    formVisible.value = true
}
// 读取本地图片为 base64
const readImage = (file: File, callback: (data: string) => void) => {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
        ElMessage.error('图片仅支持 PNG、JPG 格式')
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过 2MB')
        return
    }
    const reader = new FileReader()
    reader.onload = (e) => callback(String(e.target?.result || ''))
    reader.readAsDataURL(file)
}
// 添加图片
const addFormImage = (uploadFile: { raw?: File }) => {
    const file = uploadFile.raw
    if (!file) return
    readImage(file, (data) => {
        form.images.push(data)
        if (!form.mainImage) form.mainImage = data
    })
}
// 替换图片
const replaceFormImage = (uploadFile: { raw?: File }, index: number) => {
    const file = uploadFile.raw
    if (!file) return
    readImage(file, (data) => {
        form.images[index] = data
        if (index === 0) form.mainImage = data
    })
}
// 删除图片
const removeFormImage = (index: number) => {
    form.images.splice(index, 1)
    form.mainImage = form.images[0] || ''
}
const addCoupon = () => {
    form.giftCoupons.push({ id: Date.now(), threshold: 0, couponId: '' })
}
const submitForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入商品名称')
        return
    }
    if (!form.category1 || !form.category2) {
        ElMessage.warning('请选择一级分类与二级分类')
        return
    }
    if (!form.images.length) {
        ElMessage.warning('请添加商品轮播图')
        return
    }
    if (!form.specs.length || form.specs.some((s) => !s.name.trim())) {
        ElMessage.warning('请填写规格名称')
        return
    }
    if (form.giftCoupons.some((c) => !c.couponId)) {
        ElMessage.warning('请选择发放的优惠券')
        return
    }

    // 由规格汇总价格与库存
    const first = form.specs[0]
    const minPrice = Math.min(...form.specs.map((s) => s.price))
    const minMember = Math.min(...form.specs.map((s) => s.memberPrice))
    const maxOrigin = Math.max(...form.specs.map((s) => s.originPrice))
    const payload: GoodsItem = {
        ...cloneDeep(form),
        price: form.specType === 'single' ? first.price : minPrice,
        memberPrice: form.specType === 'single' ? first.memberPrice : minMember,
        originPrice: form.specType === 'single' ? first.originPrice : maxOrigin,
        stock: totalStock.value,
        spec: form.specs.map((s) => s.name).join('、'),
        mainImage: form.mainImage || form.images[0]
    }
    if (isEdit.value) {
        const index = data.findIndex((item) => item.id === editingId.value)
        if (index > -1) data[index] = { ...payload, id: editingId.value }
        ElMessage.success('商品已更新')
    } else {
        data.unshift({ ...payload, id: Date.now() })
        ElMessage.success('商品已新增')
    }
    formVisible.value = false
}

// 上下架（二次确认）
const toggleSale = (row: GoodsItem) => {
    const target = row.onSale === 'on' ? 'off' : 'on'
    const isOn = target === 'on'
    if (isOn && row.stock === 0) {
        ElMessage.warning('总库存为 0 的商品无法上架，请先补充库存')
        return
    }
    ElMessageBox.confirm(
        isOn ? '确认上架该商品？上架后用户端可下单。' : '确认下架该商品？下架后用户端标记为已失效商品，不可下单。',
        isOn ? '上架二次确认' : '下架二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.onSale = target
            ElMessage.success(isOn ? '商品已上架' : '商品已下架')
        })
        .catch(() => {})
}

// 删除 / 回收站
const deleteGoods = (row: GoodsItem) => {
    ElMessageBox.confirm(
        `确认删除商品「${row.name}」？删除后可在回收站恢复或彻底删除。`,
        '删除二次确认',
        { type: 'warning' }
    )
        .then(() => {
            row.deleted = true
            ElMessage.success('商品已移入回收站')
        })
        .catch(() => {})
}
const restoreGoods = (row: GoodsItem) => {
    ElMessageBox.confirm(`确认恢复商品「${row.name}」？`, '恢复二次确认', { type: 'info' })
        .then(() => {
            row.deleted = false
            ElMessage.success('商品已恢复')
        })
        .catch(() => {})
}
const permanentDelete = (row: GoodsItem) => {
    ElMessageBox.confirm(`确认彻底删除商品「${row.name}」？删除后不可恢复。`, '彻底删除二次确认', { type: 'warning' })
        .then(() => {
            const index = data.findIndex((item) => item.id === row.id)
            if (index > -1) data.splice(index, 1)
            ElMessage.success('商品已彻底删除')
        })
        .catch(() => {})
}

// 查看详情
const detailVisible = ref(false)
const currentItem = ref<GoodsItem | null>(null)
const openDetail = (row: GoodsItem) => {
    currentItem.value = row
    detailVisible.value = true
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

.goods-image {
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

.member-price {
    font-weight: 600;
    color: #e6a23c;
}

.stock-zero {
    color: #f56c6c;
}

.goods-form {
    min-height: 380px;
}

.form-tabs {
    :deep(.el-tabs__content) {
        padding-top: 18px;
    }
}

.image-upload-list {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
}

.image-item {
    position: relative;
    width: 100px;
}

.form-image {
    width: 100px;
    height: 80px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}

.image-index {
    position: absolute;
    top: 4px;
    left: 4px;
    padding: 1px 6px;
    font-size: 11px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
}

.image-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 4px;
}

.image-add {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100px;
    height: 80px;
    font-size: 12px;
    color: #a8abb2;
    background: #fafafa;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        color: var(--el-color-primary);
        background: #f5f7ff;
        border-color: var(--el-color-primary);
    }
}

.image-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
}

.spec-block {
    padding: 12px;
    background: #fafafa;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}

.section-title {
    margin: 4px 0 14px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-color-primary);
    border-left: 3px solid var(--el-color-primary);
}

.spec-field-label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
}

.spec-single-row {
    display: grid;
    grid-template-columns: 1.4fr repeat(4, 1fr);
    gap: 14px;
}

.spec-group-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.spec-group {
    padding: 12px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
}

.spec-group-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.spec-group-name {
    width: 220px;
}

.spec-values {
    padding-left: 4px;
}

.spec-value-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 24px;
    margin-bottom: 10px;
}

.spec-value-empty {
    font-size: 12px;
    color: #c0c4cc;
}

.spec-value-add {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spec-value-input {
    width: 180px;
}

.sku-section {
    margin-top: 16px;
}

.sku-title {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #606266;
}

.sku-empty {
    margin-top: 16px;
    padding: 20px;
    font-size: 13px;
    color: #c0c4cc;
    text-align: center;
    background: #fff;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
}

.summary-row {
    margin-bottom: 4px;
}

.template-desc {
    margin: -6px 0 12px;
    padding: 8px 12px;
    font-size: 12px;
    color: #606266;
    background: #f5f7ff;
    border-radius: 4px;
}

.coupon-tip {
    margin-bottom: 14px;
    padding: 8px 12px;
    font-size: 12px;
    color: #909399;
    background: #f5f7ff;
    border-radius: 4px;
}

.coupon-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.coupon-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.coupon-label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
}

.coupon-threshold {
    width: 150px;
}

.coupon-select {
    width: 240px;
}

.detail-images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
}

.detail-image {
    width: 90px;
    height: 68px;
    border-radius: 4px;
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

.full-width {
    grid-column: 1 / -1;
}

.info-label {
    font-size: 12px;
    color: #909399;
}

.info-value {
    font-size: 14px;
    color: #303133;
}

.detail-content {
    font-size: 14px;
    line-height: 1.8;
    color: #303133;
}

.coupon-view {
    padding: 6px 0;
    font-size: 14px;
    color: #303133;
}

:deep(.goods-table .el-table__cell .cell) {
    white-space: nowrap;
}

:deep(.operation-cell .cell) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 6px 4px;
}
</style>
