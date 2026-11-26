/**
 * 商品列表演示数据
 * 后续可由后端接口替换
 */

export type OnSaleStatus = 'on' | 'off'
export type DeliveryType = 'express' | 'pickup'
export type SpecType = 'single' | 'multi' // 单规格 / 多规格

export interface SpecItem {
    id: number
    name: string // 规格名称，如「10包/盒」
    price: number // 售价
    originPrice: number // 原价
    memberPrice: number // 会员价
    stock: number // 库存
}

export interface GiftCoupon {
    id: number
    threshold: number // 订单金额门槛
    couponId: string // 发放优惠券（选择项）
}

export interface GoodsItem {
    id: number
    mainImage: string // 主图文字（生成占位图）
    images: string[] // 轮播图文字
    name: string
    category1: string
    category2: string
    specType: SpecType // 规格类型
    specs: SpecItem[] // 规格列表（单规格时仅 1 条）
    price: number // 售价（单规格取规格值，多规格取最低价）
    originPrice: number // 原价
    memberPrice: number // 会员价
    sold: number // 已售
    stock: number // 总库存（各规格求和）
    spec: string // 规格展示文字
    sort: number // 排序值
    tags: string[]
    onSale: OnSaleStatus
    deliveryType: DeliveryType
    freightTemplate: string // 运费模板名称
    packingService: boolean // 支持分装服务
    packingDesc: string // 分装服务说明
    giftCoupons: GiftCoupon[]
    afterSaleDays: number // 售后期限（天）
    detail: string // 商品详情（富文本）
    deleted?: boolean // 是否进入回收站
}

// 一级/二级分类联动
export const categoryOptions: Record<string, string[]> = {
    养生保健: ['足浴包', '热敷用品', '养生茶'],
    康复辅具: ['护具', '理疗仪器'],
    健康礼盒: ['礼盒套装', '单品礼盒']
}

export const category1Options = Object.keys(categoryOptions)

// 运费模板选项
export const freightTemplates = [
    { name: '全国包邮', desc: '全国范围免运费' },
    { name: '统一运费 ¥8', desc: '全国范围统一收取 ¥8' },
    { name: '偏远地区加收', desc: '偏远地区加收 ¥10，其他包邮' },
    { name: '门店自提', desc: '仅支持到店自提，无运费' }
]

// 优惠券选项（购买送券选择项）
export const couponOptions = [
    { id: 'CP001', name: '满100减10优惠券' },
    { id: 'CP002', name: '满200减30优惠券' },
    { id: 'CP003', name: '新客专享5元券' },
    { id: 'CP004', name: '会员专属20元券' },
    { id: 'CP005', name: '满500减80优惠券' }
]

export const couponName = (id: string) => couponOptions.find((item) => item.id === id)?.name || '-'

export const goodsList: GoodsItem[] = [
    {
        id: 1,
        mainImage: '中药足浴包',
        images: ['中药足浴包', '足浴包细节', '使用场景'],
        name: '中药足浴包',
        category1: '养生保健',
        category2: '足浴包',
        specType: 'multi',
        specs: [
            { id: 11, name: '10包/盒', price: 48.5, originPrice: 68, memberPrice: 43.5, stock: 98 },
            { id: 12, name: '20包/盒', price: 88, originPrice: 128, memberPrice: 79, stock: 60 }
        ],
        price: 48.5,
        originPrice: 68,
        memberPrice: 43.5,
        sold: 326,
        stock: 158,
        spec: '10包/盒、20包/盒',
        sort: 30,
        tags: ['热销', '好评'],
        onSale: 'on',
        deliveryType: 'express',
        freightTemplate: '统一运费 ¥8',
        packingService: true,
        packingDesc: '可按单次用量分装，方便携带',
        giftCoupons: [{ id: 1, threshold: 100, couponId: 'CP001' }],
        afterSaleDays: 7,
        detail: '<p>精选多种中药材搭配而成，温水冲泡即可使用，缓解疲劳、改善睡眠。</p>'
    },
    {
        id: 2,
        mainImage: '肩颈热敷包',
        images: ['肩颈热敷包'],
        name: '肩颈热敷包',
        category1: '养生保健',
        category2: '热敷用品',
        specType: 'single',
        specs: [{ id: 21, name: '1个装', price: 88, originPrice: 128, memberPrice: 79, stock: 64 }],
        price: 88,
        originPrice: 128,
        memberPrice: 79,
        sold: 189,
        stock: 64,
        spec: '1个装',
        sort: 25,
        tags: ['推荐'],
        onSale: 'on',
        deliveryType: 'express',
        freightTemplate: '统一运费 ¥8',
        packingService: false,
        packingDesc: '',
        giftCoupons: [],
        afterSaleDays: 7,
        detail: '<p>可循环使用的肩颈热敷包，热敷放松肩颈肌肉，缓解酸痛。</p>'
    },
    {
        id: 3,
        mainImage: '养生茶礼盒',
        images: ['养生茶礼盒', '礼盒内页'],
        name: '养生茶礼盒',
        category1: '健康礼盒',
        category2: '礼盒套装',
        specType: 'multi',
        specs: [
            { id: 31, name: '6罐装', price: 98, originPrice: 138, memberPrice: 88, stock: 20 },
            { id: 32, name: '12罐装', price: 168, originPrice: 228, memberPrice: 150, stock: 15 }
        ],
        price: 98,
        originPrice: 228,
        memberPrice: 88,
        sold: 92,
        stock: 35,
        spec: '6罐装、12罐装',
        sort: 20,
        tags: ['礼盒', '送礼'],
        onSale: 'on',
        deliveryType: 'express',
        freightTemplate: '全国包邮',
        packingService: true,
        packingDesc: '支持礼盒分装及贺卡定制',
        giftCoupons: [
            { id: 1, threshold: 100, couponId: 'CP001' },
            { id: 2, threshold: 200, couponId: 'CP002' }
        ],
        afterSaleDays: 15,
        detail: '<p>多款养生茶组合礼盒，适合送礼与自用，品质保证。</p>'
    },
    {
        id: 4,
        mainImage: '护腰带',
        images: ['护腰带'],
        name: '护腰带',
        category1: '康复辅具',
        category2: '护具',
        specType: 'single',
        specs: [{ id: 41, name: '均码', price: 129, originPrice: 159, memberPrice: 116, stock: 0 }],
        price: 129,
        originPrice: 159,
        memberPrice: 116,
        sold: 58,
        stock: 0,
        spec: '均码',
        sort: 15,
        tags: [],
        onSale: 'on',
        deliveryType: 'express',
        freightTemplate: '全国包邮',
        packingService: false,
        packingDesc: '',
        giftCoupons: [],
        afterSaleDays: 7,
        detail: '<p>弹力护腰带，支撑腰部、缓解劳损，适合久坐人群。</p>'
    },
    {
        id: 5,
        mainImage: '艾灸理疗仪',
        images: ['艾灸理疗仪'],
        name: '艾灸理疗仪',
        category1: '康复辅具',
        category2: '理疗仪器',
        specType: 'single',
        specs: [{ id: 51, name: '标准版', price: 398, originPrice: 498, memberPrice: 358, stock: 12 }],
        price: 398,
        originPrice: 498,
        memberPrice: 358,
        sold: 24,
        stock: 12,
        spec: '标准版',
        sort: 10,
        tags: ['新品'],
        onSale: 'off',
        deliveryType: 'pickup',
        freightTemplate: '门店自提',
        packingService: true,
        packingDesc: '门店自提时可现场分装体验',
        giftCoupons: [],
        afterSaleDays: 30,
        detail: '<p>家用艾灸理疗仪，温经通络、驱寒除湿，操作简单。</p>'
    }
]
