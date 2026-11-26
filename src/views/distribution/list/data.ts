/**
 * 分销列表演示数据
 * 后续可由后端接口替换
 */

export type DistributionStatus = 'on' | 'off' // 启用 / 停用
export type SourceType = 'consume' | 'manual' // 权限来源：下单消费 / 管理端指定

// 推广团队成员
export interface TeamMember {
    id: number
    userId: string // 用户ID
    avatar: string // 用户头像（SVG data URI）
    name: string // 用户昵称
    phone: string // 手机号码
    createdAt: string // 注册时间
}

// 推广订单
export interface PromoOrder {
    id: number
    orderNo: string // 订单编号
    name: string // 用户昵称
    phone: string // 手机号码
    goodsName: string // 服务/商品名称
    payAmount: number // 实付金额
    commission: number // 获得佣金
    createdAt: string // 下单时间
}

// 佣金明细
export interface CommissionRecord {
    id: number
    orderNo: string // 关联订单号
    commission: number // 获得佣金
    status: 'settled' | 'pending' // 已结算 / 待结算
    createdAt: string // 生成时间
}

export interface DistributionItem {
    id: number
    avatar: string // 用户头像（SVG data URI）
    name: string // 用户昵称
    phone: string // 手机号码
    level: string // 分销等级
    teamCount: number // 推广人数
    orderCount: number // 推广订单数
    balance: number // 佣金余额
    totalCommission: number // 累计佣金
    status: DistributionStatus // 状态
    source: SourceType // 权限来源
    createdAt: string // 注册时间
    team: TeamMember[] // 推广团队
    orders: PromoOrder[] // 推广订单
    commissions: CommissionRecord[] // 佣金明细
}

export const distributionLevelOptions = ['一级分销', '二级分销', '三级分销']

// 生成头像占位图
const avatar = (label: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${color}"/><text x="32" y="32" font-size="24" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

// 系统内用户（供「指定分销」选择，后续可由用户接口替换）
export const systemUsers = [
    { id: 'U10021', name: '张小满', phone: '138****2211', avatar: avatar('张', '#4A5DFF') },
    { id: 'U10035', name: '李mei', phone: '139****3588', avatar: avatar('李', '#67c23a') },
    { id: 'U10048', name: '王子轩', phone: '137****4826', avatar: avatar('王', '#e6a23c') },
    { id: 'U10102', name: '陈静', phone: '136****1023', avatar: avatar('陈', '#9b59b6') },
    { id: 'U10119', name: '刘洋', phone: '135****1902', avatar: avatar('刘', '#17a2b8') },
    { id: 'U10208', name: '黄敏', phone: '134****2088', avatar: avatar('黄', '#f56c6c') }
]

const teamA: TeamMember[] = [
    { id: 1, userId: 'U10021', avatar: avatar('张', '#4A5DFF'), name: '张小满', phone: '138****2211', createdAt: '2026-03-12 10:30' },
    { id: 2, userId: 'U10035', avatar: avatar('李', '#67c23a'), name: '李mei', phone: '139****3588', createdAt: '2026-04-08 15:20' },
    { id: 3, userId: 'U10048', avatar: avatar('王', '#e6a23c'), name: '王子轩', phone: '137****4826', createdAt: '2026-05-19 09:45' }
]
const ordersA: PromoOrder[] = [
    { id: 1, orderNo: 'DD20260601001', name: '张小满', phone: '138****2211', goodsName: '肩颈理疗套餐', payAmount: 298, commission: 29.8, createdAt: '2026-06-01 11:20' },
    { id: 2, orderNo: 'DD20260603002', name: '李mei', phone: '139****3588', goodsName: '中药足浴包', payAmount: 88, commission: 8.8, createdAt: '2026-06-03 16:40' },
    { id: 3, orderNo: 'DD20260605003', name: '王子轩', phone: '137****4826', goodsName: '体态评估', payAmount: 199, commission: 19.9, createdAt: '2026-06-05 10:15' }
]
const commissionsA: CommissionRecord[] = [
    { id: 1, orderNo: 'DD20260601001', commission: 29.8, status: 'settled', createdAt: '2026-06-02 09:00' },
    { id: 2, orderNo: 'DD20260603002', commission: 8.8, status: 'settled', createdAt: '2026-06-04 09:00' },
    { id: 3, orderNo: 'DD20260605003', commission: 19.9, status: 'pending', createdAt: '2026-06-06 09:00' }
]

const teamB: TeamMember[] = [
    { id: 4, userId: 'U10102', avatar: avatar('陈', '#9b59b6'), name: '陈静', phone: '136****1023', createdAt: '2026-02-18 14:10' },
    { id: 5, userId: 'U10119', avatar: avatar('刘', '#17a2b8'), name: '刘洋', phone: '135****1902', createdAt: '2026-03-25 11:30' }
]
const ordersB: PromoOrder[] = [
    { id: 4, orderNo: 'DD20260528004', name: '陈静', phone: '136****1023', goodsName: '养生茶礼盒', payAmount: 168, commission: 25.2, createdAt: '2026-05-28 13:50' },
    { id: 5, orderNo: 'DD20260530005', name: '刘洋', phone: '135****1902', goodsName: '护腰带', payAmount: 129, commission: 19.35, createdAt: '2026-05-30 09:20' }
]
const commissionsB: CommissionRecord[] = [
    { id: 4, orderNo: 'DD20260528004', commission: 25.2, status: 'settled', createdAt: '2026-05-29 09:00' },
    { id: 5, orderNo: 'DD20260530005', commission: 19.35, status: 'pending', createdAt: '2026-05-31 09:00' }
]

export const distributionList: DistributionItem[] = [
    {
        id: 1,
        avatar: avatar('赵', '#4A5DFF'),
        name: '赵一鸣',
        phone: '138****6688',
        level: '一级分销',
        teamCount: 12,
        orderCount: 36,
        balance: 258.6,
        totalCommission: 1280.5,
        status: 'on',
        source: 'manual',
        createdAt: '2026-01-15 09:30',
        team: teamA,
        orders: ordersA,
        commissions: commissionsA
    },
    {
        id: 2,
        avatar: avatar('孙', '#67c23a'),
        name: '孙晓丽',
        phone: '139****1234',
        level: '二级分销',
        teamCount: 8,
        orderCount: 21,
        balance: 186.3,
        totalCommission: 860.2,
        status: 'on',
        source: 'consume',
        createdAt: '2026-02-20 14:20',
        team: teamB,
        orders: ordersB,
        commissions: commissionsB
    },
    {
        id: 3,
        avatar: avatar('周', '#e6a23c'),
        name: '周建国',
        phone: '137****5566',
        level: '三级分销',
        teamCount: 25,
        orderCount: 58,
        balance: 520.8,
        totalCommission: 2360.9,
        status: 'on',
        source: 'manual',
        createdAt: '2026-01-08 10:45',
        team: teamA,
        orders: ordersA,
        commissions: commissionsA
    },
    {
        id: 4,
        avatar: avatar('吴', '#9b59b6'),
        name: '吴雨桐',
        phone: '136****8899',
        level: '一级分销',
        teamCount: 3,
        orderCount: 7,
        balance: 45.5,
        totalCommission: 210,
        status: 'off',
        source: 'consume',
        createdAt: '2026-03-11 16:00',
        team: teamB,
        orders: ordersB,
        commissions: commissionsB
    },
    {
        id: 5,
        avatar: avatar('郑', '#17a2b8'),
        name: '郑浩',
        phone: '135****4321',
        level: '二级分销',
        teamCount: 6,
        orderCount: 15,
        balance: 128,
        totalCommission: 545.6,
        status: 'on',
        source: 'manual',
        createdAt: '2026-04-02 11:15',
        team: teamA,
        orders: ordersA,
        commissions: commissionsA
    }
]
