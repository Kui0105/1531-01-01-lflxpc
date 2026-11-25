<template>
    <div class="side" :style="sideStyle">
        <side-logo v-if="settingStore.showLogo" :show-title="!isCollapsed" :theme="sideTheme" />
        <side-menu
            :routes="routes"
            :is-collapsed="isCollapsed"
            :width="settingStore.sideWidth"
            :unique-opened="settingStore.isUniqueOpened"
            :config="menuProp"
            :theme="sideTheme"
            @select="handleSelect"
        />
    </div>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

import { APPROISE_ROUTE, COMPLAINT_ROUTE } from '@/router/routes'
import useAppStore from '@/stores/modules/app'
import useSettingStore from '@/stores/modules/setting'
import useUserStore from '@/stores/modules/user'

import SideLogo from './logo.vue'
import SideMenu from './menu.vue'

const appStore = useAppStore()
const isCollapsed = computed(() => {
    if (appStore.isMobile) {
        return false
    } else {
        return appStore.isCollapsed
    }
})

const settingStore = useSettingStore()
const sideTheme = computed(() => settingStore.sideTheme)
const userStore = useUserStore()

const routes = computed(() => {
    const list = userStore.routes.map((item) => ({
        ...item,
        children: item.children ? [...item.children] : undefined
    })) as RouteRecordRaw[]
    // 静态注入「互评任务」导航：工作台下方、用户管理上方
    if (!list.some((item) => item.path === APPROISE_ROUTE.path)) {
        const workbenchIndex = list.findIndex(
            (item) => item.meta?.title === '工作台' || item.path.includes('workbench')
        )
        const userIndex = list.findIndex(
            (item) => item.meta?.title === '用户管理' || item.path.includes('user')
        )
        const insertAt =
            workbenchIndex >= 0 ? workbenchIndex + 1 : userIndex >= 0 ? userIndex : list.length
        list.splice(insertAt, 0, APPROISE_ROUTE)
    }

    // 「投诉反馈」插入到「用户管理」目录下的「用户列表」下方
    const complaintChild = {
        path: COMPLAINT_ROUTE.path,
        name: Symbol('admin-consumer-complaint'),
        component: COMPLAINT_ROUTE.children?.[0]?.component,
        meta: { title: '投诉反馈', icon: 'el-icon-ChatDotRound' }
    } as RouteRecordRaw
    let injected = false
    for (const item of list) {
        const children = item.children
        if (!children?.length) continue
        const userListIndex = children.findIndex(
            (child) =>
                child.meta?.title === '用户列表' || child.path?.includes('consumer/lists')
        )
        if (userListIndex >= 0) {
            if (!children.some((child) => child.meta?.title === '投诉反馈')) {
                children.splice(userListIndex + 1, 0, complaintChild)
            }
            injected = true
            break
        }
    }
    // 兼容菜单中「用户列表」为顶层的情况
    if (!injected && !list.some((item) => item.path === COMPLAINT_ROUTE.path)) {
        const userListIndex = list.findIndex(
            (item) => item.meta?.title === '用户列表' || item.path.includes('consumer/lists')
        )
        const insertAt = userListIndex >= 0 ? userListIndex + 1 : list.length
        list.splice(insertAt, 0, COMPLAINT_ROUTE)
    }
    return list
})

const sideStyle = computed(() => {
    return sideTheme.value == 'dark'
        ? {
              '--side-dark-color': settingStore.sideDarkColor
          }
        : ''
})
const menuProp = computed(() => {
    return {
        backgroundColor: sideTheme.value == 'dark' ? settingStore.sideDarkColor : '',
        textColor: sideTheme.value == 'dark' ? 'var(--el-color-white)' : '',
        activeTextColor: sideTheme.value == 'dark' ? 'var(--el-color-white)' : ''
    }
})
const handleSelect = () => {
    if (appStore.isMobile) {
        appStore.toggleCollapsed(true)
    }
}
</script>

<style lang="scss" scoped>
.side {
    position: relative;
    z-index: 999;
    @apply border-r border-br-light h-full flex flex-col;
    background-color: var(--side-dark-color, var(--el-bg-color));
}
</style>
