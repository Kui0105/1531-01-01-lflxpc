/**
 * 流水账单演示数据
 * 后续可由后端接口替换
 */

export type FlowType = 'pay' | 'refund' // 支付 / 退款
export type BillStatus = 'success' | 'processing' | 'failed' // 成功 / 处理中 / 失败

export const storeOptions = ['天河店', '越秀店', '海珠店', '番禺店']
export const payMethodOptions = ['微信支付', '支付宝', '银行卡', '余额支付']
export const flowTypeOptions = [
    { label: '支付', value: 'pay' },
    { label: '退款', value: 'refund' }
]

export interface BillRecord {
    id: number
    serialNo: string // 流水编号
    orderNo: string // 订单编号
    nickname: string // 用户昵称
    phone: string // 手机号
    store: string // 门店
    flowType: FlowType // 收支类型
    payMethod: string // 支付方式
    amount: number // 金额（正数）
    account: string // 到账账户
    createdAt: string // 交易时间
    status: BillStatus // 状态
}

export const billList: BillRecord[] = [
    {
        id: 1,
        serialNo: 'LS202611270001',
        orderNo: 'SO20261127001',
        nickname: '赵一鸣',
        phone: '13866886688',
        store: '天河店',
        flowType: 'pay',
        payMethod: '微信支付',
        amount: 598,
        account: '天河店账户',
        createdAt: '2026-11-27 09:15',
        status: 'success'
    },
    {
        id: 2,
        serialNo: 'LS202611260002',
        orderNo: 'GO20261126004',
        nickname: '孙晓丽',
        phone: '13912341234',
        store: '越秀店',
        flowType: 'pay',
        payMethod: '支付宝',
        amount: 328,
        account: '越秀店账户',
        createdAt: '2026-11-26 16:40',
        status: 'success'
    },
    {
        id: 3,
        serialNo: 'LS202611260003',
        orderNo: 'SO20261126008',
        nickname: '周建国',
        phone: '13755665566',
        store: '海珠店',
        flowType: 'refund',
        payMethod: '微信支付',
        amount: 150,
        account: '海珠店账户',
        createdAt: '2026-11-26 14:20',
        status: 'success'
    },
    {
        id: 4,
        serialNo: 'LS202611250004',
        orderNo: 'SO20261125003',
        nickname: '吴雨桐',
        phone: '13688998899',
        store: '天河店',
        flowType: 'pay',
        payMethod: '银行卡',
        amount: 1280,
        account: '天河店账户',
        createdAt: '2026-11-25 11:05',
        status: 'success'
    },
    {
        id: 5,
        serialNo: 'LS202611240005',
        orderNo: 'GO20261124006',
        nickname: '郑浩',
        phone: '13543214321',
        store: '番禺店',
        flowType: 'pay',
        payMethod: '余额支付',
        amount: 88,
        account: '番禺店账户',
        createdAt: '2026-11-24 10:30',
        status: 'processing'
    },
    {
        id: 6,
        serialNo: 'LS202611230006',
        orderNo: 'GO20261123007',
        nickname: '黄敏',
        phone: '13420882088',
        store: '越秀店',
        flowType: 'refund',
        payMethod: '支付宝',
        amount: 260,
        account: '越秀店账户',
        createdAt: '2026-11-23 15:50',
        status: 'success'
    },
    {
        id: 7,
        serialNo: 'LS202611220007',
        orderNo: 'SO20261122005',
        nickname: '赵一鸣',
        phone: '13866886688',
        store: '海珠店',
        flowType: 'pay',
        payMethod: '微信支付',
        amount: 460,
        account: '海珠店账户',
        createdAt: '2026-11-22 09:40',
        status: 'success'
    },
    {
        id: 8,
        serialNo: 'LS202611210008',
        orderNo: 'SO20261121009',
        nickname: '孙晓丽',
        phone: '13912341234',
        store: '天河店',
        flowType: 'refund',
        payMethod: '微信支付',
        amount: 75,
        account: '天河店账户',
        createdAt: '2026-11-21 17:25',
        status: 'failed'
    },
    {
        id: 9,
        serialNo: 'LS202611200009',
        orderNo: 'GO20261120002',
        nickname: '周建国',
        phone: '13755665566',
        store: '番禺店',
        flowType: 'pay',
        payMethod: '支付宝',
        amount: 399,
        account: '番禺店账户',
        createdAt: '2026-11-20 13:10',
        status: 'success'
    },
    {
        id: 10,
        serialNo: 'LS202611190010',
        orderNo: 'SO20261119011',
        nickname: '郑浩',
        phone: '13543214321',
        store: '越秀店',
        flowType: 'pay',
        payMethod: '银行卡',
        amount: 680,
        account: '越秀店账户',
        createdAt: '2026-11-19 08:55',
        status: 'success'
    }
]
