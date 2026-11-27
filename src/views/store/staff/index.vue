<template>
    <div class="store-staff-page">
        <el-card class="list-card" shadow="never">
            <template #header>
                <div class="card-head">
                    <span class="header-title">人员列表</span>
                </div>
            </template>
            <el-empty description="人员列表功能待完善" />
        </el-card>
    </div>
</template>

<script lang="ts" setup name="storeStaff"></script>

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
</style>
