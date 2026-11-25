<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-page-header content="用户详情" @back="$router.back()" />
        </el-card>
        <div class="mt-4">
            <detail-panel :user-id="userId" />
        </div>
    </div>
</template>

<script lang="ts" setup name="consumerDetail">
import DetailPanel from './components/detail-panel.vue'

const route = useRoute()
const userId = Number(route.query.id) || 10001
</script>
