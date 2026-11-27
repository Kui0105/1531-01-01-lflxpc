/**
 * 佣金明细演示数据
 * 后续可由后端接口替换
 */

export type CommissionType = 'service' | 'goods' // 服务订单 / 商品订单
export type SettleStatus = 'pending' | 'settled' | 'invalid' // 待到账 / 已到账 / 已失效

export const commissionTypeOptions = [
    { label: '服务订单', value: 'service' },
    { label: '商品订单', value: 'goods' }
]
export const settleStatusOptions = [
    { label: '待到账', value: 'pending' },
    { label: '已到账', value: 'settled' },
    { label: '已失效', value: 'invalid' }
]
// 分销等级对应返利比例（与分销等级配置一致）
export const levelRateMap: Record<string, number> = {
    黄铜分销: 10,
    白银分销: 8,
    黄金分销: 5,
    钻石分销: 15
}

export interface CommissionRecord {
    id: number
    serialNo: string // 明细编号
    nickname: string // 推广用户昵称
    phone: string // 手机号
    orderNo: string // 来源订单编号
    level: string // 分销等级
    rate: number // 返利比例（%）
    amount: number // 佣金金额
    status: SettleStatus // 结算状态
    commissionType: CommissionType // 佣金类型
    settleTime: string // 结算时间
    remark: string // 备注
}

export const commissionList: CommissionRecord[] = [
    {
        id: 1,
        serialNo: 'YJ202611270001',
        nickname: '赵一鸣',
        phone: '13866886688',
        orderNo: 'SO20261127001',
        level: '黄铜分销',
        rate: 10,
        amount: 59.8,
        status: 'pending',
        commissionType: 'service',
        settleTime: '2026-11-27 09:15',
        remark: '服务订单待到店核销后结算'
    },
    {
        id: 2,
        serialNo: 'YJ202611260002',
        nickname: '孙晓丽',
        phone: '13912341234',
        orderNo: 'GO20261126004',
        level: '白银分销',
        rate: 8,
        amount: 26.24,
        status: 'settled',
        commissionType: 'goods',
        settleTime: '2026-11-26 16:40',
        remark: '商品订单完成且超出售后期，佣金已到账'
    },
    {
        id: 3,
        serialNo: 'YJ202611260003',
        nickname: '周建国',
        phone: '13755665566',
        orderNo: 'SO20261126008',
        level: '黄金分销',
        rate: 5,
        amount: 7.5,
        status: 'invalid',
        commissionType: 'service',
        settleTime: '2026-11-26 14:20',
        remark: '订单售后退款，佣金失效'
    },
    {
        id: 4,
        serialNo: 'YJ202611250004',
        nickname: '吴雨桐',
        phone: '13688998899',
        orderNo: 'SO20261125003',
        level: '钻石分销',
        rate: 15,
        amount: 192,
        status: 'settled',
        commissionType: 'service',
        settleTime: '2026-11-25 11:05',
        remark: '服务订单已核销，佣金已到账'
    },
    {
        id: 5,
        serialNo: 'YJ202611240005',
        nickname: '郑浩',
        phone: '13543214321',
        orderNo: 'GO20261124006',
        level: '黄铜分销',
        rate: 10,
        amount: 8.8,
        status: 'pending',
        commissionType: 'goods',
        settleTime: '2026-11-24 10:30',
        remark: '商品订单完成，售后期内待结算'
    },
    {
        id: 6,
        serialNo: 'YJ202611230006',
        nickname: '黄敏',
        phone: '13420882088',
        orderNo: 'SO20261122005',
        level: '白银分销',
        rate: 8,
        amount: 36.8,
        status: 'settled',
        commissionType: 'service',
        settleTime: '2026-11-23 15:50',
        remark: '服务订单已核销，佣金已到账'
    },
    {
        id: 7,
        serialNo: 'YJ202611220007',
        nickname: '赵一鸣',
        phone: '13866886688',
        orderNo: 'GO20261122005',
        level: '黄铜分销',
        rate: 10,
        amount: 46,
        status: 'settled',
        commissionType: 'goods',
        settleTime: '2026-11-22 09:40',
        remark: '商品订单完成且超出售后期，佣金已到账'
    },
    {
        id: 8,
        serialNo: 'YJ202611210008',
        nickname: '孙晓丽',
        phone: '13912341234',
        orderNo: 'GO20261121005',
        level: '黄金分销',
        rate: 5,
        amount: 19.95,
        status: 'invalid',
        commissionType: 'goods',
        settleTime: '2026-11-21 17:25',
        remark: '订单售后退款，佣金失效'
    },
    {
        id: 9,
        serialNo: 'YJ202611200009',
        nickname: '周建国',
        phone: '13755665566',
        orderNo: 'SO20261120003',
        level: '钻石分销',
        rate: 15,
        amount: 102,
        status: 'pending',
        commissionType: 'service',
        settleTime: '2026-11-20 13:10',
        remark: '服务订单待到店核销后结算'
    },
    {
        id: 10,
        serialNo: 'YJ202611190010',
        nickname: '郑浩',
        phone: '13543214321',
        orderNo: 'GO20261119011',
        level: '白银分销',
        rate: 8,
        amount: 54.4,
        status: 'settled',
        commissionType: 'goods',
        settleTime: '2026-11-19 08:55',
        remark: '商品订单完成且超出售后期，佣金已到账'
    }
]
