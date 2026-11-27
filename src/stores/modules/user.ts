import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { getUserInfo, login, logout } from '@/api/user'
import { MenuEnum } from '@/enums/appEnums'
import { TOKEN_KEY } from '@/enums/cacheEnums'
import { PageEnum } from '@/enums/pageEnum'
import router, { filterAsyncRoutes } from '@/router'
import { clearAuthInfo, getToken } from '@/utils/auth'
import cache from '@/utils/cache'

export interface UserState {
    token: string
    userInfo: Record<string, any>
    routes: RouteRecordRaw[]
    perms: string[]
}

// 需在「系统设置 → 网站设置」下追加的子菜单（后端原始数据格式）
const extraWebsiteMenus = [
    { paths: 'complaint-type', name: '投诉类型', component: 'setting/website/complaint-type', icon: 'el-icon-ChatLineSquare' },
    { paths: 'order-setting', name: '订单设置', component: 'setting/website/order-setting', icon: 'el-icon-Setting' },
    { paths: 'freight-template', name: '运费模板', component: 'setting/website/freight-template', icon: 'el-icon-Tickets' }
]

// 递归查找「网站设置」节点并注入子菜单，返回是否命中
function injectWebsiteMenus(menus: any[]): boolean {
    if (!Array.isArray(menus)) return false
    for (const node of menus) {
        const children = node.children
        const isWebsite =
            node.name === '网站设置' ||
            String(node.paths || '').includes('website') ||
            children?.some(
                (c: any) =>
                    String(c.paths || '').includes('protocol') ||
                    String(c.component || '').includes('website/protocol') ||
                    String(c.component || '').includes('website/information')
            )
        if (isWebsite && Array.isArray(children)) {
            const existing = new Set(children.map((c: any) => String(c.paths || '')))
            for (const item of extraWebsiteMenus) {
                if (!existing.has(item.paths)) {
                    children.push({
                        paths: item.paths,
                        name: item.name,
                        type: MenuEnum.MENU,
                        component: item.component,
                        is_show: 1,
                        is_cache: 0,
                        perms: '',
                        icon: item.icon,
                        params: '',
                        selected: ''
                    })
                }
            }
            return true
        }
        if (children?.length && injectWebsiteMenus(children)) return true
    }
    return false
}

// 兜底：未找到「网站设置」节点时，在系统设置下创建/追加网站设置分组
function injectWebsiteMenusFallback(menus: any[]): boolean {
    if (!Array.isArray(menus)) return false
    for (const node of menus) {
        const name = String(node.name || '')
        const paths = String(node.paths || '')
        const isSystemSetting = name.includes('系统设置') || paths.includes('setting')
        if (isSystemSetting && Array.isArray(node.children)) {
            let websiteNode = node.children.find(
                (c: any) => c.name === '网站设置' || String(c.paths || '').includes('website')
            )
            if (!websiteNode) {
                websiteNode = {
                    paths: 'website',
                    name: '网站设置',
                    type: MenuEnum.CATALOGUE,
                    component: '',
                    is_show: 1,
                    is_cache: 0,
                    perms: '',
                    icon: 'el-icon-Setting',
                    params: '',
                    selected: '',
                    children: []
                }
                node.children.push(websiteNode)
            }
            if (!Array.isArray(websiteNode.children)) websiteNode.children = []
            const existing = new Set(websiteNode.children.map((c: any) => String(c.paths || '')))
            for (const item of extraWebsiteMenus) {
                if (!existing.has(item.paths)) {
                    websiteNode.children.push({
                        paths: item.paths,
                        name: item.name,
                        type: MenuEnum.MENU,
                        component: item.component,
                        is_show: 1,
                        is_cache: 0,
                        perms: '',
                        icon: item.icon,
                        params: '',
                        selected: ''
                    })
                }
            }
            return true
        }
        if (node.children?.length && injectWebsiteMenusFallback(node.children)) return true
    }
    return false
}

const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        token: getToken() || '',
        // 用户信息
        userInfo: {},
        // 路由
        routes: [],
        // 权限
        perms: []
    }),
    getters: {},
    actions: {
        resetState() {
            this.token = ''
            this.userInfo = {}
            this.perms = []
        },
        login(playload: any) {
            const { account, password } = playload
            return new Promise((resolve, reject) => {
                login({
                    account: account.trim(),
                    password: password
                })
                    .then((data) => {
                        this.token = data.token
                        cache.set(TOKEN_KEY, data.token)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        logout() {
            return new Promise((resolve, reject) => {
                logout()
                    .then(async (data) => {
                        this.token = ''
                        await router.push(PageEnum.LOGIN)
                        clearAuthInfo()
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getUserInfo() {
            return new Promise((resolve, reject) => {
                getUserInfo()
                    .then((data) => {
                        this.userInfo = data.user
                        this.perms = data.permissions
                        // 在「系统设置 → 网站设置」下注入投诉类型/订单设置/运费模板入口
                        if (!injectWebsiteMenus(data.menu)) {
                            injectWebsiteMenusFallback(data.menu)
                        }
                        this.routes = filterAsyncRoutes(data.menu)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})

export default useUserStore
