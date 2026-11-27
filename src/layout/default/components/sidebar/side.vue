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

import { APPROISE_ROUTE, COMPLAINT_ROUTE, DISTRIBUTION_ROUTE, FINANCE_ROUTE, GOODS_ROUTE, MARKET_ROUTE, ORDER_ROUTE, SERVICE_ROUTE, TITLE_ROUTE } from '@/router/routes'
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
    // 静态注入「订单管理 → 预约列表 / 服务订单」导航到用户管理下方
    const orderParent = list.find((item) => item.path === ORDER_ROUTE.path)
    if (orderParent) {
        // 后端已存在「订单管理」时，逐项补充缺少的子菜单
        const existingPaths = new Set(orderParent.children?.map((child) => child.path) || [])
        const missingChildren = (ORDER_ROUTE.children || []).filter(
            (child) => !existingPaths.has(child.path)
        )
        if (missingChildren.length) {
            orderParent.children = [...(orderParent.children || []), ...missingChildren]
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('order/appointment')))
    ) {
        const userManageIndex = list.findIndex(
            (item) => item.meta?.title === '用户管理' || item.path.includes('user')
        )
        const insertAt = userManageIndex >= 0 ? userManageIndex + 1 : list.length
        list.splice(insertAt, 0, ORDER_ROUTE)
    }

    // 静态注入「服务管理」主导航（服务列表/服务分类）到订单管理下方
    const serviceParent = list.find((item) => item.path === SERVICE_ROUTE.path)
    if (serviceParent) {
        const existingPaths = new Set(serviceParent.children?.map((child) => child.path) || [])
        const missingChildren = (SERVICE_ROUTE.children || []).filter(
            (child) => !existingPaths.has(child.path)
        )
        if (missingChildren.length) {
            serviceParent.children = [...(serviceParent.children || []), ...missingChildren]
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('service/list')))
    ) {
        const orderIndex = list.findIndex((item) => item.path === ORDER_ROUTE.path)
        const insertAt = orderIndex >= 0 ? orderIndex + 1 : list.length
        list.splice(insertAt, 0, SERVICE_ROUTE)
    }

    // 静态注入「商品管理」主导航（商品列表/商品分类）到服务管理下方
    const goodsParent = list.find((item) => item.path === GOODS_ROUTE.path)
    if (goodsParent) {
        const existingPaths = new Set(goodsParent.children?.map((child) => child.path) || [])
        const missingChildren = (GOODS_ROUTE.children || []).filter(
            (child) => !existingPaths.has(child.path)
        )
        if (missingChildren.length) {
            goodsParent.children = [...(goodsParent.children || []), ...missingChildren]
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('goods/list')))
    ) {
        const serviceIndex = list.findIndex((item) => item.path === SERVICE_ROUTE.path)
        const insertAt = serviceIndex >= 0 ? serviceIndex + 1 : list.length
        list.splice(insertAt, 0, GOODS_ROUTE)
    }

    // 静态注入「营销管理」主导航（会员等级/营销配置/优惠券列表）到商品管理下方
    const marketParent = list.find((item) => item.path === MARKET_ROUTE.path)
    if (marketParent) {
        const existingPaths = new Set(marketParent.children?.map((child) => child.path) || [])
        const missingChildren = (MARKET_ROUTE.children || []).filter(
            (child) => !existingPaths.has(child.path)
        )
        if (missingChildren.length) {
            marketParent.children = [...(marketParent.children || []), ...missingChildren]
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('marketing/level')))
    ) {
        const goodsIndex = list.findIndex((item) => item.path === GOODS_ROUTE.path)
        const insertAt = goodsIndex >= 0 ? goodsIndex + 1 : list.length
        list.splice(insertAt, 0, MARKET_ROUTE)
    }

    // 静态注入「分销推广」主导航（分销列表/分销等级/分销配置）到营销管理下方
    const distributionParent = list.find((item) => item.path === DISTRIBUTION_ROUTE.path)
    if (distributionParent) {
        const existingPaths = new Set(distributionParent.children?.map((child) => child.path) || [])
        const missingChildren = (DISTRIBUTION_ROUTE.children || []).filter(
            (child) => !existingPaths.has(child.path)
        )
        if (missingChildren.length) {
            distributionParent.children = [...(distributionParent.children || []), ...missingChildren]
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('distribution/list')))
    ) {
        const marketIndex = list.findIndex((item) => item.path === MARKET_ROUTE.path)
        const insertAt = marketIndex >= 0 ? marketIndex + 1 : list.length
        list.splice(insertAt, 0, DISTRIBUTION_ROUTE)
    }

    // 静态注入「财务管理」主导航（积分明细/流水账单/佣金明细/提现记录/门店明细）到分销推广下方
    // 后端菜单可能已存在 /finance 项（但被隐藏或子菜单不全），此处统一用完整定义覆盖，确保正常显示
    const financeIndex = list.findIndex((item) => item.path === FINANCE_ROUTE.path)
    if (financeIndex >= 0) {
        list[financeIndex] = {
            ...FINANCE_ROUTE,
            meta: { ...FINANCE_ROUTE.meta, hidden: false }
        }
    } else if (
        !list.some((item) => item.children?.some((child) => child.path?.includes('finance/points')))
    ) {
        const distributionIndex = list.findIndex((item) => item.path === DISTRIBUTION_ROUTE.path)
        const insertAt = distributionIndex >= 0 ? distributionIndex + 1 : list.length
        list.splice(insertAt, 0, {
            ...FINANCE_ROUTE,
            meta: { ...FINANCE_ROUTE.meta, hidden: false }
        })
    }

    // 静态注入「职称管理」主导航（职称列表）到财务管理下方
    const titleParent = list.find((item) => item.path === TITLE_ROUTE.path)
    if (titleParent) {
        const existingPaths = new Set(titleParent.children?.map((child) => child.path) || [])
        const missingChildren = (TITLE_ROUTE.children || []).filter((child) => !existingPaths.has(child.path))
        if (missingChildren.length) {
            titleParent.children = [...(titleParent.children || []), ...missingChildren]
        }
    } else if (!list.some((item) => item.children?.some((child) => child.path?.includes('title/list')))) {
        const financeIndex = list.findIndex((item) => item.path === FINANCE_ROUTE.path)
        const insertAt = financeIndex >= 0 ? financeIndex + 1 : list.length
        list.splice(insertAt, 0, {
            ...TITLE_ROUTE,
            meta: { ...TITLE_ROUTE.meta, hidden: false }
        })
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
