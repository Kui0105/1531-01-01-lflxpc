/**
 * 售后订单演示数据
 * 后续可由后端接口替换
 */

export type AfterSaleStatus =
    | 'pending' // 待处理（待审核）
    | 'waiting_receive' // 待收货（用户已寄回并填写物流）
    | 'waiting_refund' // 待退款（已确认收货，可操作退款）
    | 'agreed' // 已同意（退款完成）
    | 'rejected' // 已拒绝
export type OriginOrderType = 'assess' | 'service' | 'goods'
export type AfterSaleType = 'refund' | 'return'

export interface AfterSaleItem {
    id: number
    afterSaleNo: string
    originOrderNo: string
    originOrderType: OriginOrderType
    afterSaleType: AfterSaleType
    avatarColor: string
    nickname: string
    mobile: string
    reason: string
    remark: string
    images: string[]
    refundAmount: number // 申请退款金额
    actualRefundAmount: number // 实际退款金额（0 表示尚未退款）
    refundableAmount: number
    refundRule: string
    returnExpressCompany: string // 用户寄回的快递公司
    returnTrackingNo: string // 用户寄回的物流单号
    status: AfterSaleStatus
    applyTime: string
    rejectReason: string
    originOrder: {
        orderNo: string
        serviceName: string
        totalAmount: number
        paidAmount: number
        quantity: number
        usedCount: number
        orderTime: string
        orderStatus: string
    }
}

export const statusTabs = [
    { label: '全部', value: '' },
    { label: '待处理', value: 'pending' },
    { label: '待收货', value: 'waiting_receive' },
    { label: '待退款', value: 'waiting_refund' },
    { label: '已同意', value: 'agreed' },
    { label: '已拒绝', value: 'rejected' }
] as const

export const statusLabels: Record<AfterSaleStatus, string> = {
    pending: '待处理',
    waiting_receive: '待收货',
    waiting_refund: '待退款',
    agreed: '已同意',
    rejected: '已拒绝'
}

export const statusTagTypes: Record<
    AfterSaleStatus,
    'warning' | 'primary' | 'success' | 'danger'
> = {
    pending: 'warning',
    waiting_receive: 'primary',
    waiting_refund: 'warning',
    agreed: 'success',
    rejected: 'danger'
}

export const orderTypeLabels: Record<OriginOrderType, string> = {
    assess: '评估订单',
    service: '服务订单',
    goods: '商品订单'
}

export const orderTypeTagTypes: Record<OriginOrderType, 'primary' | 'success' | 'warning'> = {
    assess: 'primary',
    service: 'success',
    goods: 'warning'
}

// 售后类型针对商品订单售后：仅退款 / 退货退款
export const afterSaleTypeLabels: Record<AfterSaleType, string> = {
    refund: '仅退款',
    return: '退货退款'
}

export const afterSaleOrders: AfterSaleItem[] = [
    {
        id: 1,
        afterSaleNo: 'AS20261125001',
        originOrderNo: 'SO20261125001',
        originOrderType: 'service',
        afterSaleType: 'refund',
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        mobile: '13800138001',
        reason: '服务与描述不符',
        remark: '康复师服务态度差，申请退还剩余次数费用',
        images: ['凭证1', '凭证2'],
        refundAmount: 542.67,
        actualRefundAmount: 0,
        refundableAmount: 542.67,
        refundRule: '实付金额 ¥814 ÷ 3 次 × 剩余 2 次 = ¥542.67',
        returnExpressCompany: '',
        returnTrackingNo: '',
        status: 'pending',
        applyTime: '2026-11-25 16:30',
        rejectReason: '',
        originOrder: {
            orderNo: 'SO20261125001',
            serviceName: '全身经络理疗',
            totalAmount: 894,
            paidAmount: 814,
            quantity: 3,
            usedCount: 1,
            orderTime: '2026-11-25 09:20',
            orderStatus: '服务中'
        }
    },
    {
        id: 2,
        afterSaleNo: 'AS20261125002',
        originOrderNo: 'GO20261124003',
        originOrderType: 'goods',
        afterSaleType: 'return',
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        mobile: '13800138002',
        reason: '商品破损',
        remark: '收到的足浴包外包装破损，申请退货退款',
        images: ['凭证1'],
        refundAmount: 133.5,
        actualRefundAmount: 0,
        refundableAmount: 133.5,
        refundRule: '商品订单售后期限内，实付金额 ¥133.5 全额可退',
        returnExpressCompany: '',
        returnTrackingNo: '',
        status: 'pending',
        applyTime: '2026-11-25 14:15',
        rejectReason: '',
        originOrder: {
            orderNo: 'GO20261124003',
            serviceName: '中药足浴包',
            totalAmount: 145.5,
            paidAmount: 133.5,
            quantity: 3,
            usedCount: 0,
            orderTime: '2026-11-24 11:10',
            orderStatus: '待收货'
        }
    },
    {
        id: 3,
        afterSaleNo: 'AS20261124003',
        originOrderNo: 'SO20261123003',
        originOrderType: 'service',
        afterSaleType: 'refund',
        avatarColor: '#67c23a',
        nickname: '康养达人',
        mobile: '13800138003',
        reason: '时间冲突',
        remark: '预约时间与工作冲突，申请退还全部费用',
        images: [],
        refundAmount: 376,
        actualRefundAmount: 376,
        refundableAmount: 376,
        refundRule: '实付金额 ¥376 ÷ 2 次 × 剩余 2 次 = ¥376',
        returnExpressCompany: '',
        returnTrackingNo: '',
        status: 'agreed',
        applyTime: '2026-11-24 10:20',
        rejectReason: '',
        originOrder: {
            orderNo: 'SO20261123003',
            serviceName: '腰部舒缓护理',
            totalAmount: 396,
            paidAmount: 376,
            quantity: 2,
            usedCount: 0,
            orderTime: '2026-11-23 14:00',
            orderStatus: '待服务'
        }
    },
    {
        id: 4,
        afterSaleNo: 'AS20261123004',
        originOrderNo: 'GO20261122005',
        originOrderType: 'goods',
        afterSaleType: 'return',
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        mobile: '13800138005',
        reason: '不喜欢/效果不佳',
        remark: '使用后感觉效果一般，申请退货退款',
        images: ['凭证1', '凭证2', '凭证3'],
        refundAmount: 96.2,
        actualRefundAmount: 0,
        refundableAmount: 96.2,
        refundRule: '商品订单售后期限内，实付金额 ¥96.2 全额可退',
        returnExpressCompany: '',
        returnTrackingNo: '',
        status: 'rejected',
        applyTime: '2026-11-23 09:40',
        rejectReason: '商品已拆封使用，影响二次销售，不符合退款条件',
        originOrder: {
            orderNo: 'GO20261122005',
            serviceName: '热敷眼罩',
            totalAmount: 122,
            paidAmount: 96.2,
            quantity: 2,
            usedCount: 0,
            orderTime: '2026-11-22 10:05',
            orderStatus: '已完成'
        }
    },
    {
        id: 5,
        afterSaleNo: 'AS20261122005',
        originOrderNo: 'SO20261120005',
        originOrderType: 'assess',
        afterSaleType: 'refund',
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        mobile: '13800138006',
        reason: '重复下单',
        remark: '不小心重复购买了评估服务，申请退款',
        images: [],
        refundAmount: 68,
        actualRefundAmount: 68,
        refundableAmount: 68,
        refundRule: '实付金额 ¥68 ÷ 1 次 × 剩余 1 次 = ¥68',
        returnExpressCompany: '',
        returnTrackingNo: '',
        status: 'agreed',
        applyTime: '2026-11-22 15:50',
        rejectReason: '',
        originOrder: {
            orderNo: 'SO20261120005',
            serviceName: '康复评估报告',
            totalAmount: 98,
            paidAmount: 68,
            quantity: 1,
            usedCount: 0,
            orderTime: '2026-11-20 11:00',
            orderStatus: '待评估'
        }
    },
    {
        id: 6,
        afterSaleNo: 'AS20261121006',
        originOrderNo: 'GO20261120006',
        originOrderType: 'goods',
        afterSaleType: 'return',
        avatarColor: '#409eff',
        nickname: '静待花开',
        mobile: '13800138004',
        reason: '收到的商品与下单不符',
        remark: '下单的是咖色热敷包，收到的是灰色，已寄回商品',
        images: ['凭证1'],
        refundAmount: 123.2,
        actualRefundAmount: 0,
        refundableAmount: 123.2,
        refundRule: '商品订单售后期限内，实付金额 ¥123.2 全额可退',
        returnExpressCompany: '顺丰速运',
        returnTrackingNo: 'SF9988776655',
        status: 'waiting_receive',
        applyTime: '2026-11-21 11:30',
        rejectReason: '',
        originOrder: {
            orderNo: 'GO20261120006',
            serviceName: '肩颈热敷包',
            totalAmount: 136,
            paidAmount: 123.2,
            quantity: 1,
            usedCount: 0,
            orderTime: '2026-11-20 16:00',
            orderStatus: '待收货'
        }
    },
    {
        id: 7,
        afterSaleNo: 'AS20261120007',
        originOrderNo: 'GO20261119007',
        originOrderType: 'goods',
        afterSaleType: 'return',
        avatarColor: '#17a2b8',
        nickname: '岁月静好',
        mobile: '13800138007',
        reason: '尺码不合适',
        remark: '已按要求寄回商品，管理端已确认收货，待退款',
        images: [],
        refundAmount: 88,
        actualRefundAmount: 0,
        refundableAmount: 88,
        refundRule: '商品订单售后期限内，实付金额 ¥88 全额可退',
        returnExpressCompany: '中通快递',
        returnTrackingNo: 'ZT5566778899',
        status: 'waiting_refund',
        applyTime: '2026-11-20 09:10',
        rejectReason: '',
        originOrder: {
            orderNo: 'GO20261119007',
            serviceName: '养生茶礼盒',
            totalAmount: 96,
            paidAmount: 88,
            quantity: 1,
            usedCount: 0,
            orderTime: '2026-11-19 15:20',
            orderStatus: '已完成'
        }
    },
    {
        id: 8,
        afterSaleNo: 'AS20261119008',
        originOrderNo: 'GO20261118008',
        originOrderType: 'goods',
        afterSaleType: 'return',
        avatarColor: '#607d8b',
        nickname: '前程似锦',
        mobile: '13800138008',
        reason: '商品有瑕疵',
        remark: '寄回商品后确认部分退款 ¥50',
        images: ['凭证1'],
        refundAmount: 128,
        actualRefundAmount: 50,
        refundableAmount: 128,
        refundRule: '商品订单售后期限内，实付金额 ¥128 全额可退',
        returnExpressCompany: '圆通速递',
        returnTrackingNo: 'YT1122334455',
        status: 'agreed',
        applyTime: '2026-11-19 13:40',
        rejectReason: '',
        originOrder: {
            orderNo: 'GO20261118008',
            serviceName: '肩颈热敷包',
            totalAmount: 136,
            paidAmount: 128,
            quantity: 1,
            usedCount: 0,
            orderTime: '2026-11-18 10:00',
            orderStatus: '已完成'
        }
    }
]
