/**
 * 优惠券列表演示数据
 * 后续可由后端接口替换
 */

export type CouponType = 'discount' | 'reduction' | 'no_threshold' // 折扣券 / 满减券 / 无门槛优惠券
export type ApplyScope = 'all_service' | 'service' | 'all_goods' | 'goods' // 全部服务 / 指定服务 / 全部商品 / 指定商品
export type IssueMethod = 'manual' | 'auto' | 'designated' | 'gift' | 'manager' // 手动领取 / 自动发放 / 指定发放 / 购买赠送 / 店长发放
export type CouponStatus = 'on' | 'off' // 启用 / 停用

export interface CouponItem {
    id: number
    name: string // 券名称
    type: CouponType // 券类型
    faceValue: number // 面额（满减/无门槛：金额元；折扣券：折扣值如 8.5）
    threshold: number // 使用门槛（满多少元可用，0 表示无门槛）
    applyScope: ApplyScope // 适用对象
    issueMethod: IssueMethod // 发放方式
    totalCount: number // 发放数量
    claimedCount: number // 已领取数量
    usedCount: number // 已使用数量
    validStart: string // 有效期开始
    validEnd: string // 有效期结束
    status: CouponStatus // 状态
    serviceIds: number[] // 指定服务 ID（适用对象=指定服务时）
    goodsIds: number[] // 指定商品 ID（适用对象=指定商品时）
    birthdayBenefit: boolean // 生日福利（勾选项）
    newUserBenefit: boolean // 新人福利（勾选项）
    autoDay: number // 自动发放：每月几日
    generateAmount: number // 生成条件：满多少金额生成（购买赠送/店长发放）
    managerConfirm: boolean // 是否需店长确认后发放（店长发放）
    commissionEnabled: boolean // 提成类型勾选
    commissionRate: number // 提成比例（%）
    createdAt: string // 创建时间
}

export const couponTypeLabels: Record<CouponType, string> = {
    discount: '折扣券',
    reduction: '满减券',
    no_threshold: '无门槛优惠券'
}

export const applyScopeLabels: Record<ApplyScope, string> = {
    all_service: '全部服务',
    service: '指定服务',
    all_goods: '全部商品',
    goods: '指定商品'
}

export const issueMethodLabels: Record<IssueMethod, string> = {
    manual: '手动领取',
    auto: '自动发放',
    designated: '指定发放',
    gift: '购买赠送',
    manager: '店长发放'
}

export const couponList: CouponItem[] = [
    {
        id: 1,
        name: '新人专享满100减20券',
        type: 'reduction',
        faceValue: 20,
        threshold: 100,
        applyScope: 'all_service',
        issueMethod: 'manual',
        totalCount: 1000,
        claimedCount: 326,
        usedCount: 189,
        validStart: '2026-01-01',
        validEnd: '2026-12-31',
        status: 'on',
        serviceIds: [],
        goodsIds: [],
        birthdayBenefit: false,
        newUserBenefit: true,
        autoDay: 1,
        generateAmount: 0,
        managerConfirm: false,
        commissionEnabled: false,
        commissionRate: 0,
        createdAt: '2026-01-05 10:30'
    },
    {
        id: 2,
        name: '生日福利8.5折券',
        type: 'discount',
        faceValue: 8.5,
        threshold: 0,
        applyScope: 'all_service',
        issueMethod: 'manual',
        totalCount: 500,
        claimedCount: 88,
        usedCount: 52,
        validStart: '2026-01-01',
        validEnd: '2026-12-31',
        status: 'on',
        serviceIds: [],
        goodsIds: [],
        birthdayBenefit: true,
        newUserBenefit: false,
        autoDay: 1,
        generateAmount: 0,
        managerConfirm: false,
        commissionEnabled: false,
        commissionRate: 0,
        createdAt: '2026-01-18 14:20'
    },
    {
        id: 3,
        name: '肩颈理疗专属满200减50券',
        type: 'reduction',
        faceValue: 50,
        threshold: 200,
        applyScope: 'service',
        issueMethod: 'designated',
        totalCount: 200,
        claimedCount: 45,
        usedCount: 30,
        validStart: '2026-03-01',
        validEnd: '2026-06-30',
        status: 'on',
        serviceIds: [2],
        goodsIds: [],
        birthdayBenefit: false,
        newUserBenefit: false,
        autoDay: 1,
        generateAmount: 0,
        managerConfirm: false,
        commissionEnabled: true,
        commissionRate: 5,
        createdAt: '2026-02-20 09:15'
    },
    {
        id: 4,
        name: '每月会员日无门槛10元券',
        type: 'no_threshold',
        faceValue: 10,
        threshold: 0,
        applyScope: 'all_service',
        issueMethod: 'auto',
        totalCount: 5000,
        claimedCount: 1200,
        usedCount: 860,
        validStart: '2026-01-01',
        validEnd: '2026-12-31',
        status: 'on',
        serviceIds: [],
        goodsIds: [],
        birthdayBenefit: false,
        newUserBenefit: false,
        autoDay: 15,
        generateAmount: 0,
        managerConfirm: false,
        commissionEnabled: false,
        commissionRate: 0,
        createdAt: '2026-03-11 16:45'
    },
    {
        id: 5,
        name: '购买足浴包赠送商品券',
        type: 'no_threshold',
        faceValue: 5,
        threshold: 0,
        applyScope: 'goods',
        issueMethod: 'gift',
        totalCount: 800,
        claimedCount: 210,
        usedCount: 96,
        validStart: '2026-04-01',
        validEnd: '2026-09-30',
        status: 'on',
        serviceIds: [],
        goodsIds: [2, 3],
        birthdayBenefit: false,
        newUserBenefit: false,
        autoDay: 1,
        generateAmount: 100,
        managerConfirm: false,
        commissionEnabled: true,
        commissionRate: 5,
        createdAt: '2026-04-20 11:00'
    },
    {
        id: 6,
        name: '店长赠送满300减80券',
        type: 'reduction',
        faceValue: 80,
        threshold: 300,
        applyScope: 'service',
        issueMethod: 'manager',
        totalCount: 300,
        claimedCount: 62,
        usedCount: 40,
        validStart: '2026-05-01',
        validEnd: '2026-10-31',
        status: 'off',
        serviceIds: [1, 3],
        goodsIds: [],
        birthdayBenefit: false,
        newUserBenefit: false,
        autoDay: 1,
        generateAmount: 300,
        managerConfirm: true,
        commissionEnabled: true,
        commissionRate: 8,
        createdAt: '2026-05-06 15:40'
    }
]
