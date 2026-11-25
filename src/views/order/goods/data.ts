/**
 * 商品订单演示数据
 * 后续可由后端接口替换
 */

export type OrderStatus =
    | 'unpaid'
    | 'pending_ship'
    | 'pending_pickup'
    | 'pending_receive'
    | 'done'
    | 'after_sale'
    | 'canceled'
export type DeliveryType = 'express' | 'pickup'
export type PayStatus = 'unpaid' | 'paid' | 'refunded'

export interface OrderLog {
    operator: string
    action: string
    time: string
}

export interface GoodsOrderItem {
    id: number
    orderNo: string
    avatarColor: string
    nickname: string
    mobile: string
    goodsName: string
    goodsSpec: string
    goodsQuantity: number
    goodsPrice: number
    goodsColor: string
    deliveryType: DeliveryType
    pickupStore: string
    packagingService: string
    memberDiscount: number
    couponDiscount: number
    pointDiscount: number
    freight: number
    paidAmount: number
    status: OrderStatus
    payStatus: PayStatus
    orderTime: string
    payTime: string
    payMethod: string
    receiverName: string
    receiverMobile: string
    receiverAddress: string
    remark: string
    expressCompany: string
    trackingNo: string
    shipTime: string
    logs: OrderLog[]
}

export const statusTabs = [
    { label: '全部', value: '' },
    { label: '待付款', value: 'unpaid' },
    { label: '待发货', value: 'pending_ship' },
    { label: '待自提', value: 'pending_pickup' },
    { label: '待收货', value: 'pending_receive' },
    { label: '已完成', value: 'done' },
    { label: '售后中', value: 'after_sale' },
    { label: '已取消', value: 'canceled' }
] as const

export const statusLabels: Record<OrderStatus, string> = {
    unpaid: '待付款',
    pending_ship: '待发货',
    pending_pickup: '待自提',
    pending_receive: '待收货',
    done: '已完成',
    after_sale: '售后中',
    canceled: '已取消'
}

export const statusTagTypes: Record<
    OrderStatus,
    'warning' | 'primary' | 'success' | 'info' | 'danger'
> = {
    unpaid: 'warning',
    pending_ship: 'warning',
    pending_pickup: 'primary',
    pending_receive: 'primary',
    done: 'success',
    after_sale: 'danger',
    canceled: 'info'
}

export const deliveryLabels: Record<DeliveryType, string> = {
    express: '快递',
    pickup: '门店自提'
}

export const payStatusLabels: Record<PayStatus, string> = {
    unpaid: '未支付',
    paid: '已支付',
    refunded: '已退款'
}

export const expressCompanies = ['顺丰速运', '中通快递', '圆通速递', '韵达快递', '京东物流']

export const goodsOrders: GoodsOrderItem[] = [
    {
        id: 1,
        orderNo: 'GO20261125001',
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        mobile: '13800138001',
        goodsName: '艾草舒缓贴',
        goodsSpec: '10贴/盒',
        goodsQuantity: 2,
        goodsPrice: 68,
        goodsColor: '#4A5DFF',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '礼盒分装',
        memberDiscount: 6.8,
        couponDiscount: 20,
        pointDiscount: 10,
        freight: 8,
        paidAmount: 107.2,
        status: 'pending_ship',
        payStatus: 'paid',
        orderTime: '2026-11-25 09:20',
        payTime: '2026-11-25 09:22',
        payMethod: '微信支付',
        receiverName: '陈健康',
        receiverMobile: '13800138001',
        receiverAddress: '广东省广州市天河区体育西路100号',
        remark: '工作日送达',
        expressCompany: '',
        trackingNo: '',
        shipTime: '',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 09:20' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 09:22' }
        ]
    },
    {
        id: 2,
        orderNo: 'GO20261125002',
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        mobile: '13800138002',
        goodsName: '肩颈热敷包',
        goodsSpec: '标准款/咖色',
        goodsQuantity: 1,
        goodsPrice: 128,
        goodsColor: '#e6a23c',
        deliveryType: 'pickup',
        pickupStore: '越秀店',
        packagingService: '',
        memberDiscount: 12.8,
        couponDiscount: 0,
        pointDiscount: 30,
        freight: 0,
        paidAmount: 85.2,
        status: 'pending_pickup',
        payStatus: 'paid',
        orderTime: '2026-11-25 10:05',
        payTime: '2026-11-25 10:06',
        payMethod: '微信支付',
        receiverName: '李春雨',
        receiverMobile: '13800138002',
        receiverAddress: '',
        remark: '',
        expressCompany: '',
        trackingNo: '',
        shipTime: '',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 10:05' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 10:06' }
        ]
    },
    {
        id: 3,
        orderNo: 'GO20261124003',
        avatarColor: '#67c23a',
        nickname: '康养达人',
        mobile: '13800138003',
        goodsName: '中药足浴包',
        goodsSpec: '30包/袋',
        goodsQuantity: 3,
        goodsPrice: 45,
        goodsColor: '#67c23a',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '',
        memberDiscount: 13.5,
        couponDiscount: 0,
        pointDiscount: 0,
        freight: 12,
        paidAmount: 133.5,
        status: 'pending_receive',
        payStatus: 'paid',
        orderTime: '2026-11-24 11:10',
        payTime: '2026-11-24 11:12',
        payMethod: '支付宝',
        receiverName: '王康',
        receiverMobile: '13800138003',
        receiverAddress: '广东省广州市海珠区新港中路88号',
        remark: '',
        expressCompany: '顺丰速运',
        trackingNo: 'SF1234567890',
        shipTime: '2026-11-24 15:30',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-24 11:10' },
            { operator: '用户', action: '支付订单', time: '2026-11-24 11:12' },
            { operator: '管理员', action: '订单发货（顺丰速运 SF1234567890）', time: '2026-11-24 15:30' }
        ]
    },
    {
        id: 4,
        orderNo: 'GO20261126004',
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        mobile: '13800138005',
        goodsName: '精油按摩套装',
        goodsSpec: '三瓶装/礼盒',
        goodsQuantity: 1,
        goodsPrice: 299,
        goodsColor: '#9b59b6',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '礼盒分装',
        memberDiscount: 30,
        couponDiscount: 50,
        pointDiscount: 0,
        freight: 0,
        paidAmount: 219,
        status: 'unpaid',
        payStatus: 'unpaid',
        orderTime: '2026-11-26 08:15',
        payTime: '',
        payMethod: '',
        receiverName: '孙阳光',
        receiverMobile: '13800138005',
        receiverAddress: '广东省广州市天河区珠江新城',
        remark: '',
        expressCompany: '',
        trackingNo: '',
        shipTime: '',
        logs: [{ operator: '用户', action: '提交订单', time: '2026-11-26 08:15' }]
    },
    {
        id: 5,
        orderNo: 'GO20261122005',
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        mobile: '13800138006',
        goodsName: '热敷眼罩',
        goodsSpec: '5片/盒',
        goodsQuantity: 2,
        goodsPrice: 58,
        goodsColor: '#f56c6c',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '',
        memberDiscount: 5.8,
        couponDiscount: 0,
        pointDiscount: 20,
        freight: 6,
        paidAmount: 96.2,
        status: 'done',
        payStatus: 'paid',
        orderTime: '2026-11-22 10:05',
        payTime: '2026-11-22 10:07',
        payMethod: '微信支付',
        receiverName: '周安然',
        receiverMobile: '13800138006',
        receiverAddress: '广东省广州市越秀区东风中路',
        remark: '',
        expressCompany: '中通快递',
        trackingNo: 'ZT9876543210',
        shipTime: '2026-11-22 16:00',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-22 10:05' },
            { operator: '用户', action: '支付订单', time: '2026-11-22 10:07' },
            { operator: '管理员', action: '订单发货（中通快递 ZT9876543210）', time: '2026-11-22 16:00' },
            { operator: '系统', action: '订单已完成', time: '2026-11-24 09:30' }
        ]
    },
    {
        id: 6,
        orderNo: 'GO20261125006',
        avatarColor: '#409eff',
        nickname: '静待花开',
        mobile: '13800138004',
        goodsName: '养生茶礼盒',
        goodsSpec: '10袋/盒',
        goodsQuantity: 2,
        goodsPrice: 88,
        goodsColor: '#409eff',
        deliveryType: 'pickup',
        pickupStore: '海珠店',
        packagingService: '礼盒分装',
        memberDiscount: 8.8,
        couponDiscount: 0,
        pointDiscount: 40,
        freight: 0,
        paidAmount: 127.2,
        status: 'done',
        payStatus: 'paid',
        orderTime: '2026-11-25 13:30',
        payTime: '2026-11-25 13:31',
        payMethod: '微信支付',
        receiverName: '吴静',
        receiverMobile: '13800138004',
        receiverAddress: '',
        remark: '',
        expressCompany: '',
        trackingNo: '',
        shipTime: '',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-25 13:30' },
            { operator: '用户', action: '支付订单', time: '2026-11-25 13:31' },
            { operator: '店长/刘敏', action: '到店核销，订单完成', time: '2026-11-25 16:20' }
        ]
    },
    {
        id: 7,
        orderNo: 'GO20261123007',
        avatarColor: '#17a2b8',
        nickname: '岁月静好',
        mobile: '13800138007',
        goodsName: '艾草舒缓贴',
        goodsSpec: '10贴/盒',
        goodsQuantity: 1,
        goodsPrice: 68,
        goodsColor: '#17a2b8',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '',
        memberDiscount: 6.8,
        couponDiscount: 0,
        pointDiscount: 0,
        freight: 8,
        paidAmount: 69.2,
        status: 'after_sale',
        payStatus: 'paid',
        orderTime: '2026-11-23 16:45',
        payTime: '2026-11-23 16:47',
        payMethod: '微信支付',
        receiverName: '郑岁月',
        receiverMobile: '13800138007',
        receiverAddress: '广东省广州市天河区天河北路',
        remark: '商品破损申请售后',
        expressCompany: '圆通速递',
        trackingNo: 'YT1122334455',
        shipTime: '2026-11-23 18:00',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-23 16:45' },
            { operator: '用户', action: '支付订单', time: '2026-11-23 16:47' },
            { operator: '管理员', action: '订单发货（圆通速递 YT1122334455）', time: '2026-11-23 18:00' },
            { operator: '用户', action: '申请售后', time: '2026-11-25 14:00' }
        ]
    },
    {
        id: 8,
        orderNo: 'GO20261121008',
        avatarColor: '#607d8b',
        nickname: '前程似锦',
        mobile: '13800138008',
        goodsName: '肩颈热敷包',
        goodsSpec: '标准款/灰色',
        goodsQuantity: 1,
        goodsPrice: 128,
        goodsColor: '#607d8b',
        deliveryType: 'express',
        pickupStore: '',
        packagingService: '',
        memberDiscount: 12.8,
        couponDiscount: 0,
        pointDiscount: 0,
        freight: 8,
        paidAmount: 123.2,
        status: 'canceled',
        payStatus: 'refunded',
        orderTime: '2026-11-21 12:00',
        payTime: '2026-11-21 12:02',
        payMethod: '微信支付',
        receiverName: '钱锦程',
        receiverMobile: '13800138008',
        receiverAddress: '广东省广州市白云区机场路',
        remark: '用户主动取消',
        expressCompany: '',
        trackingNo: '',
        shipTime: '',
        logs: [
            { operator: '用户', action: '提交订单', time: '2026-11-21 12:00' },
            { operator: '用户', action: '支付订单', time: '2026-11-21 12:02' },
            { operator: '用户', action: '取消订单，原路退款', time: '2026-11-21 14:30' }
        ]
    }
]
