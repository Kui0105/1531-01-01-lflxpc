/**
 * 积分明细演示数据
 * 后续可由后端接口替换
 */

export type PointChangeType = 'income' | 'expense' // 收入 / 支出

// 变动原因枚举（与截图功能规则一致）
export const pointReasons = [
    '推广用户下单获得积分',
    '商品订单抵扣扣减积分',
    '服务订单抵扣扣减积分',
    '平台充值增加积分',
    '平台扣减少积分',
    '订单取消退回积分'
] as const

export type PointReason = (typeof pointReasons)[number]

export interface PointRecord {
    id: number
    serialNo: string // 流水编号
    nickname: string // 用户昵称
    phone: string // 手机号码
    changeType: PointChangeType // 变动类型
    value: number // 变动值（收入为正、支出为负）
    balance: number // 变动后余额
    reason: PointReason // 变动原因
    orderNo: string // 关联订单编号
    remark: string // 备注
    createdAt: string // 变动时间
}

export const pointList: PointRecord[] = [
    {
        id: 1,
        serialNo: 'JF202611270001',
        nickname: '赵一鸣',
        phone: '138****6688',
        changeType: 'income',
        value: 120,
        balance: 680,
        reason: '推广用户下单获得积分',
        orderNo: 'SO20261125001',
        remark: '推广服务订单返利积分',
        createdAt: '2026-11-27 09:15'
    },
    {
        id: 2,
        serialNo: 'JF202611260002',
        nickname: '孙晓丽',
        phone: '139****1234',
        changeType: 'expense',
        value: -50,
        balance: 230,
        reason: '商品订单抵扣扣减积分',
        orderNo: 'GO20261126004',
        remark: '商品订单使用积分抵扣 50 元',
        createdAt: '2026-11-26 16:40'
    },
    {
        id: 3,
        serialNo: 'JF202611260003',
        nickname: '周建国',
        phone: '137****5566',
        changeType: 'expense',
        value: -30,
        balance: 520,
        reason: '服务订单抵扣扣减积分',
        orderNo: 'SO20261126004',
        remark: '服务订单使用积分抵扣 30 元',
        createdAt: '2026-11-26 14:20'
    },
    {
        id: 4,
        serialNo: 'JF202611250004',
        nickname: '吴雨桐',
        phone: '136****8899',
        changeType: 'income',
        value: 500,
        balance: 500,
        reason: '平台充值增加积分',
        orderNo: '-',
        remark: '平台后台充值',
        createdAt: '2026-11-25 11:05'
    },
    {
        id: 5,
        serialNo: 'JF202611240005',
        nickname: '郑浩',
        phone: '135****4321',
        changeType: 'expense',
        value: -20,
        balance: 180,
        reason: '平台扣减少积分',
        orderNo: '-',
        remark: '平台违规扣减',
        createdAt: '2026-11-24 10:30'
    },
    {
        id: 6,
        serialNo: 'JF202611230006',
        nickname: '黄敏',
        phone: '134****2088',
        changeType: 'income',
        value: 35,
        balance: 415,
        reason: '订单取消退回积分',
        orderNo: 'GO20261123007',
        remark: '订单取消原路退回积分并生成退回流水',
        createdAt: '2026-11-23 15:50'
    },
    {
        id: 7,
        serialNo: 'JF202611220007',
        nickname: '赵一鸣',
        phone: '138****6688',
        changeType: 'income',
        value: 88,
        balance: 560,
        reason: '推广用户下单获得积分',
        orderNo: 'GO20261122005',
        remark: '推广商品订单返利积分',
        createdAt: '2026-11-22 09:40'
    },
    {
        id: 8,
        serialNo: 'JF202611210008',
        nickname: '孙晓丽',
        phone: '139****1234',
        changeType: 'expense',
        value: -15,
        balance: 280,
        reason: '服务订单抵扣扣减积分',
        orderNo: 'SO20261121008',
        remark: '服务订单使用积分抵扣 15 元',
        createdAt: '2026-11-21 17:25'
    },
    {
        id: 9,
        serialNo: 'JF202611200009',
        nickname: '周建国',
        phone: '137****5566',
        changeType: 'income',
        value: 200,
        balance: 550,
        reason: '平台充值增加积分',
        orderNo: '-',
        remark: '平台活动赠送积分',
        createdAt: '2026-11-20 13:10'
    },
    {
        id: 10,
        serialNo: 'JF202611190010',
        nickname: '郑浩',
        phone: '135****4321',
        changeType: 'expense',
        value: -60,
        balance: 200,
        reason: '商品订单抵扣扣减积分',
        orderNo: 'GO20261119010',
        remark: '商品订单使用积分抵扣 60 元',
        createdAt: '2026-11-19 08:55'
    }
]
