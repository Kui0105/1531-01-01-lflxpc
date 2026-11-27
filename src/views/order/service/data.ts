/**
 * 服务订单演示数据
 * 后续可由后端接口替换
 */

export type OrderType = 'assess' | 'service'
export type OrderStatus = 'unpaid' | 'pending' | 'serving' | 'done' | 'canceled'
export type PayStatus = 'unpaid' | 'paid' | 'refunded'

export interface OrderLog {
    operator: string
    action: string
    time: string
}

export interface VerificationRecord {
    store: string
    operator: string
    time: string
}

export interface ServiceOrderItem {
    id: number
    orderNo: string
    orderType: OrderType
    avatarColor: string
    nickname: string
    realName: string
    mobile: string
    store: string
    serviceName: string
    price: number
    quantity: number
    memberDiscount: number
    couponDiscount: number
    pointDiscount: number
    totalAmount: number
    paidAmount: number
    status: OrderStatus
    payStatus: PayStatus
    verifyCount: number
    totalCount: number
    orderTime: string
    payTime: string
    channel?: string
    voucherCode?: string
    logs: OrderLog[]
    verifications: VerificationRecord[]
}

export const statusTabs = [
    { label: '全部', value: '' },
    { label: '待付款', value: 'unpaid' },
    { label: '待服务/待评估', value: 'pending' },
    { label: '服务中', value: 'serving' },
    { label: '已完成', value: 'done' },
    { label: '已取消', value: 'canceled' }
] as const

export const statusLabels: Record<OrderStatus, string> = {
    unpaid: '待付款',
    pending: '待服务/待评估',
    serving: '服务中',
    done: '已完成',
    canceled: '已取消'
}

export const statusTagTypes: Record<
    OrderStatus,
    'warning' | 'primary' | 'success' | 'info' | 'danger'
> = {
    unpaid: 'warning',
    pending: 'primary',
    serving: 'warning',
    done: 'success',
    canceled: 'info'
}

export const orderTypeLabels: Record<OrderType, string> = {
    assess: '评估订单',
    service: '服务订单'
}

export const orderTypeTagTypes: Record<OrderType, 'primary' | 'success'> = {
    assess: 'primary',
    service: 'success'
}

export const payStatusLabels: Record<PayStatus, string> = {
    unpaid: '未支付',
    paid: '已支付',
    refunded: '已退款'
}

export const storeOptions = ['天河店', '越秀店', '海珠店']

export const serviceOrders: ServiceOrderItem[] = [
    {
        id: 1,
        orderNo: 'SO20261125001',
        orderType: 'service',
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        realName: '陈健康',
        mobile: '13800138001',
        store: '天河店',
        serviceName: '全身经络理疗',
        price: 298,
        quantity: 3,
        memberDiscount: 30,
        couponDiscount: 50,
        pointDiscount: 0,
        totalAmount: 894,
        paidAmount: 814,
        status: 'serving',
        payStatus: 'paid',
        verifyCount: 1,
        totalCount: 3,
        orderTime: '2026-11-25 09:20',
        payTime: '2026-11-25 09:22',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 09:20' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 09:22' },
            { operator: '店长/刘敏', action: '核销订单（第1次）', time: '2026-11-25 15:30' }
        ],
        verifications: [
            { store: '天河店', operator: '店长/刘敏', time: '2026-11-25 15:30' }
        ]
    },
    {
        id: 2,
        orderNo: 'SO20261125002',
        orderType: 'assess',
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        realName: '李春雨',
        mobile: '13800138002',
        store: '越秀店',
        serviceName: '肩颈康复评估',
        price: 128,
        quantity: 1,
        memberDiscount: 12.8,
        couponDiscount: 0,
        pointDiscount: 20,
        totalAmount: 128,
        paidAmount: 95.2,
        status: 'pending',
        payStatus: 'paid',
        verifyCount: 0,
        totalCount: 1,
        orderTime: '2026-11-25 10:05',
        payTime: '2026-11-25 10:06',
        channel: '渠道来源-美团',
        voucherCode: 'MT202611250088',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 10:05' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 10:06' }
        ],
        verifications: []
    },
    {
        id: 3,
        orderNo: 'SO20261124003',
        orderType: 'service',
        avatarColor: '#67c23a',
        nickname: '康养达人',
        realName: '王康',
        mobile: '13800138003',
        store: '海珠店',
        serviceName: '腰部舒缓护理',
        price: 198,
        quantity: 2,
        memberDiscount: 20,
        couponDiscount: 0,
        pointDiscount: 0,
        totalAmount: 396,
        paidAmount: 376,
        status: 'done',
        payStatus: 'paid',
        verifyCount: 2,
        totalCount: 2,
        orderTime: '2026-11-24 11:10',
        payTime: '2026-11-24 11:12',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-24 11:10' },
            { operator: '用户', action: '支付订单', time: '2026-11-24 11:12' },
            { operator: '康复师/李强', action: '核销订单（第1次）', time: '2026-11-24 14:35' },
            { operator: '康复师/李强', action: '核销订单（第2次）', time: '2026-11-25 14:40' }
        ],
        verifications: [
            { store: '海珠店', operator: '康复师/李强', time: '2026-11-24 14:35' },
            { store: '海珠店', operator: '康复师/李强', time: '2026-11-25 14:40' }
        ]
    },
    {
        id: 4,
        orderNo: 'SO20261126004',
        orderType: 'service',
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        realName: '刘养正',
        mobile: '13800138005',
        store: '天河店',
        serviceName: '体态评估与护理套餐',
        price: 399,
        quantity: 1,
        memberDiscount: 40,
        couponDiscount: 60,
        pointDiscount: 0,
        totalAmount: 399,
        paidAmount: 299,
        status: 'unpaid',
        payStatus: 'unpaid',
        verifyCount: 0,
        totalCount: 1,
        orderTime: '2026-11-26 08:15',
        payTime: '',
        logs: [{ operator: '用户', action: '提交订单', time: '2026-11-26 08:15' }],
        verifications: []
    },
    {
        id: 5,
        orderNo: 'SO20261122005',
        orderType: 'service',
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        realName: '赵安泰',
        mobile: '13800138006',
        store: '越秀店',
        serviceName: '全身经络理疗',
        price: 298,
        quantity: 2,
        memberDiscount: 30,
        couponDiscount: 0,
        pointDiscount: 0,
        totalAmount: 596,
        paidAmount: 566,
        status: 'canceled',
        payStatus: 'refunded',
        verifyCount: 0,
        totalCount: 2,
        orderTime: '2026-11-22 10:05',
        payTime: '2026-11-22 10:07',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-22 10:05' },
            { operator: '用户', action: '支付订单', time: '2026-11-22 10:07' },
            { operator: '用户', action: '取消订单，原路退款', time: '2026-11-22 15:20' }
        ],
        verifications: []
    },
    {
        id: 6,
        orderNo: 'SO20261125006',
        orderType: 'assess',
        avatarColor: '#409eff',
        nickname: '静待花开',
        realName: '孙调理',
        mobile: '13800138004',
        store: '海珠店',
        serviceName: '康复评估报告',
        price: 98,
        quantity: 1,
        memberDiscount: 0,
        couponDiscount: 0,
        pointDiscount: 30,
        totalAmount: 98,
        paidAmount: 68,
        status: 'serving',
        payStatus: 'paid',
        verifyCount: 1,
        totalCount: 1,
        orderTime: '2026-11-25 13:30',
        payTime: '2026-11-25 13:31',
        channel: '渠道来源-抖音',
        voucherCode: 'DY202611250129',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 13:30' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 13:31' },
            { operator: '康复师/王芳', action: '核销订单', time: '2026-11-25 14:10' },
            { operator: '康复师/王芳', action: '提交评估报告', time: '2026-11-25 16:00' }
        ],
        verifications: [
            { store: '海珠店', operator: '康复师/王芳', time: '2026-11-25 14:10' }
        ]
    },
    {
        id: 7,
        orderNo: 'SO20261123007',
        orderType: 'service',
        avatarColor: '#17a2b8',
        nickname: '岁月静好',
        realName: '周复健',
        mobile: '13800138007',
        store: '天河店',
        serviceName: '肩颈康复评估',
        price: 128,
        quantity: 4,
        memberDiscount: 12.8,
        couponDiscount: 0,
        pointDiscount: 40,
        totalAmount: 512,
        paidAmount: 459.2,
        status: 'serving',
        payStatus: 'paid',
        verifyCount: 2,
        totalCount: 4,
        orderTime: '2026-11-23 16:45',
        payTime: '2026-11-23 16:47',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-23 16:45' },
            { operator: '用户', action: '支付订单', time: '2026-11-23 16:47' },
            { operator: '康复师/张敏', action: '核销订单（第1次）', time: '2026-11-24 10:00' },
            { operator: '康复师/张敏', action: '核销订单（第2次）', time: '2026-11-25 10:00' }
        ],
        verifications: [
            { store: '天河店', operator: '康复师/张敏', time: '2026-11-24 10:00' },
            { store: '天河店', operator: '康复师/张敏', time: '2026-11-25 10:00' }
        ]
    }
]
