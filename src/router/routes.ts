/**
 * Note: 路由配置项
 *
 * path: '/path'                    // 路由路径
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
	title: 'title'                  // 设置该路由在侧边栏的名字
	icon: 'icon-name'                // 设置该路由的图标
	activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
	query: '{"id": 1}'             // 访问路由的默认传递参数
	hidden: true                   // 当设置 true 的时候该路由不会在侧边栏出现 
    hideTab: true                   //当设置 true 的时候该路由不会在多标签tab栏出现
  }
 */

import type { RouteRecordRaw } from 'vue-router'

import { PageEnum } from '@/enums/pageEnum'
import Layout from '@/layout/default/index.vue'

export const LAYOUT = () => Promise.resolve(Layout)

export const INDEX_ROUTE_NAME = Symbol()

// 互评任务导航（静态注入到工作台与用户管理之间）
export const APPROISE_ROUTE: RouteRecordRaw = {
    path: '/appraise',
    name: Symbol('admin-appraise'),
    component: LAYOUT,
    meta: {
        title: '互评任务',
        icon: 'el-icon-DocumentChecked'
    },
    children: [
        {
            path: 'task',
            name: Symbol('admin-appraise-task'),
            component: () => import('@/views/appraise/task/index.vue'),
            meta: {
                title: '任务列表',
                icon: 'el-icon-Tickets'
            }
        }
    ]
}

// 投诉反馈导航（静态注入到用户列表下方）
export const COMPLAINT_ROUTE: RouteRecordRaw = {
    path: '/consumer/complaint',
    name: Symbol('admin-consumer-complaint'),
    component: LAYOUT,
    meta: {
        title: '投诉反馈',
        icon: 'el-icon-ChatDotRound'
    },
    children: [
        {
            path: '',
            name: Symbol('admin-consumer-complaint-list'),
            component: () => import('@/views/consumer/complaint/index.vue'),
            meta: {
                title: '投诉反馈',
                hidden: true,
                icon: 'el-icon-ChatDotRound'
            }
        }
    ]
}

// 订单管理导航（静态注入到用户管理下方）
export const ORDER_ROUTE: RouteRecordRaw = {
    path: '/order',
    name: Symbol('admin-order'),
    component: LAYOUT,
    meta: {
        title: '订单管理',
        icon: 'el-icon-ShoppingCart'
    },
    children: [
        {
            path: 'appointment',
            name: Symbol('admin-order-appointment'),
            component: () => import('@/views/order/appointment/index.vue'),
            meta: {
                title: '预约列表',
                icon: 'el-icon-Calendar'
            }
        },
        {
            path: 'service',
            name: Symbol('admin-order-service'),
            component: () => import('@/views/order/service/index.vue'),
            meta: {
                title: '服务订单',
                icon: 'el-icon-ShoppingBag'
            }
        },
        {
            path: 'goods',
            name: Symbol('admin-order-goods'),
            component: () => import('@/views/order/goods/index.vue'),
            meta: {
                title: '商品订单',
                icon: 'el-icon-Box'
            }
        },
        {
            path: 'aftersale',
            name: Symbol('admin-order-aftersale'),
            component: () => import('@/views/order/aftersale/index.vue'),
            meta: {
                title: '售后订单',
                icon: 'el-icon-RefreshLeft'
            }
        },
        {
            path: 'review',
            name: Symbol('admin-order-review'),
            component: () => import('@/views/order/review/index.vue'),
            meta: {
                title: '订单评价',
                icon: 'el-icon-Star'
            }
        }
    ]
}

export const constantRoutes: Array<RouteRecordRaw> = [
    APPROISE_ROUTE,
    COMPLAINT_ROUTE,
    ORDER_ROUTE,
    {
        path: '/consumer/lists/detail',
        name: Symbol('admin-consumer-detail'),
        component: () => import('@/views/consumer/lists/detail.vue'),
        meta: {
            title: '用户详情',
            hidden: true,
            activeMenu: '/consumer/lists'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/error/404.vue')
    },
    {
        path: PageEnum.ERROR_403,
        component: () => import('@/views/error/403.vue')
    },
    {
        path: PageEnum.LOGIN,
        component: () => import('@/views/account/login.vue')
    },
    {
        path: '/user',
        component: LAYOUT,
        children: [
            {
                path: 'setting',
                component: () => import('@/views/user/setting.vue'),
                name: Symbol(),
                meta: {
                    title: '个人设置'
                }
            }
        ]
    },
    {
        path: '/decoration/pc_details',
        component: () => import('@/views/decoration/pc_details.vue')
    }
    // {
    //     path: '/dev_tools',
    //     component: LAYOUT,
    //     children: [
    //         {
    //             path: 'code/edit',
    //             component: () => import('@/views/dev_tools/code/edit.vue'),
    //             meta: {
    //                 title: '编辑数据表',
    //                 activeMenu: '/dev_tools/code'
    //             }
    //         }
    //     ]
    // },
    // {
    //     path: '/setting',
    //     component: LAYOUT,
    //     children: [
    //         {
    //             path: 'dict/data',
    //             component: () => import('@/views/setting/dict/data/index.vue'),
    //             meta: {
    //                 title: '数据管理',
    //                 activeMenu: '/setting/dict'
    //             }
    //         }
    //     ]
    // }
]

export const INDEX_ROUTE: RouteRecordRaw = {
    path: PageEnum.INDEX,
    component: LAYOUT,
    name: INDEX_ROUTE_NAME
}
