/**
 * 门店明细演示数据
 * 后续可由后端接口替换
 */

export type StoreAccountStatus = 'active' | 'suspended' // 正常 / 停用
export type StoreFlowType = 'pay' | 'refund' // 支付 / 退款

export interface StoreAccount {
    id: number
    store: string // 门店名称
    monthIncome: number // 本月收入
    monthRefund: number // 本月退款
    monthNet: number // 本月净收入
    status: StoreAccountStatus // 状态
}

export interface StoreFlow {
    id: number
    store: string // 门店
    serialNo: string // 流水编号
    orderNo: string // 订单编号
    flowType: StoreFlowType // 收支类型
    amount: number // 金额
    arriveTime: string // 到账时间
    remark: string // 备注
}

export const storeAccounts: StoreAccount[] = [
    { id: 1, store: '天河店', monthIncome: 38680, monthRefund: 1250, monthNet: 37430, status: 'active' },
    { id: 2, store: '越秀店', monthIncome: 25420, monthRefund: 860, monthNet: 24560, status: 'active' },
    { id: 3, store: '海珠店', monthIncome: 19850, monthRefund: 420, monthNet: 19430, status: 'active' },
    { id: 4, store: '番禺店', monthIncome: 12300, monthRefund: 0, monthNet: 12300, status: 'suspended' }
]

export const storeFlows: StoreFlow[] = [
    { id: 1, store: '天河店', serialNo: 'MD202611270001', orderNo: 'SO20261127001', flowType: 'pay', amount: 598, arriveTime: '2026-11-27 09:15', remark: '服务订单支付到账' },
    { id: 2, store: '天河店', serialNo: 'MD202611260002', orderNo: 'GO20261126004', flowType: 'pay', amount: 328, arriveTime: '2026-11-26 16:40', remark: '商品订单支付到账' },
    { id: 3, store: '天河店', serialNo: 'MD202611260003', orderNo: 'SO20261126008', flowType: 'refund', amount: 150, arriveTime: '2026-11-26 14:20', remark: '订单退款原路冲减' },
    { id: 4, store: '天河店', serialNo: 'MD202611250004', orderNo: 'SO20261125003', flowType: 'pay', amount: 1280, arriveTime: '2026-11-25 11:05', remark: '服务订单支付到账' },
    { id: 5, store: '越秀店', serialNo: 'MD202611270005', orderNo: 'GO20261127002', flowType: 'pay', amount: 460, arriveTime: '2026-11-27 10:30', remark: '商品订单支付到账' },
    { id: 6, store: '越秀店', serialNo: 'MD202611260006', orderNo: 'SO20261126005', flowType: 'pay', amount: 680, arriveTime: '2026-11-26 15:20', remark: '服务订单支付到账' },
    { id: 7, store: '越秀店', serialNo: 'MD202611230007', orderNo: 'GO20261123007', flowType: 'refund', amount: 260, arriveTime: '2026-11-23 15:50', remark: '订单退款原路冲减' },
    { id: 8, store: '海珠店', serialNo: 'MD202611260008', orderNo: 'SO20261126004', flowType: 'pay', amount: 520, arriveTime: '2026-11-26 13:40', remark: '服务订单支付到账' },
    { id: 9, store: '海珠店', serialNo: 'MD202611220009', orderNo: 'GO20261122005', flowType: 'pay', amount: 399, arriveTime: '2026-11-22 09:40', remark: '商品订单支付到账' },
    { id: 10, store: '海珠店', serialNo: 'MD202611210010', orderNo: 'SO20261121009', flowType: 'refund', amount: 75, arriveTime: '2026-11-21 17:25', remark: '订单退款原路冲减' },
    { id: 11, store: '番禺店', serialNo: 'MD202611240011', orderNo: 'GO20261124006', flowType: 'pay', amount: 88, arriveTime: '2026-11-24 10:30', remark: '商品订单支付到账' },
    { id: 12, store: '番禺店', serialNo: 'MD202611200012', orderNo: 'SO20261120003', flowType: 'pay', amount: 680, arriveTime: '2026-11-20 13:10', remark: '服务订单支付到账' }
]
