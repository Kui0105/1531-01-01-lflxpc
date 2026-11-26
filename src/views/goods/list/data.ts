/**
 * 商品列表演示数据
 * 后续可由后端接口替换
 */

export type OnSaleStatus = 'on' | 'off'
export type DeliveryType = 'express' | 'pickup'

export interface GiftCoupon {
    id: number
    threshold: number // 订单金额门槛
    couponName: string // 发放优惠券
}

export interface GoodsItem {
    id: number
    mainImage: string // 主图文字（生成占位图）
    images: string[] // 轮播图文字
    name: string
    category1: string
    category2: string
    price: number // 售价
    originPrice: number // 原价
    memberPrice: number // 会员价
    sold: number // 已售
    stock: number // 库存
    spec: string // 规格
    sort: number // 排序值
    tags: string[]
    onSale: OnSaleStatus
    deliveryType: DeliveryType
    freight: number // 快递运费
    packingService: boolean // 支持分装服务
    packingDesc: string // 分装服务说明
    giftCoupons: GiftCoupon[]
    afterSaleDays: number // 售后期限（天）
    detail: string // 商品详情（富文本）
}

// 一级/二级分类联动
export const categoryOptions: Record<string, string[]> = {
    养生保健: ['足浴包', '热敷用品', '养生茶'],
    康复辅具: ['护具', '理疗仪器'],
    健康礼盒: ['礼盒套装', '单品礼盒']
}

export const category1Options = Object.keys(categoryOptions)

export const goodsList: GoodsItem[] = [
    {
        id: 1,
        mainImage: '中药足浴包',
        images: ['中药足浴包', '足浴包细节', '使用场景'],
        name: '中药足浴包',
        category1: '养生保健',
        category2: '足浴包',
        price: 48.5,
        originPrice: 68,
        memberPrice: 43.5,
        sold: 326,
        stock: 158,
        spec: '10包/盒',
        sort: 30,
        tags: ['热销', '好评'],
        onSale: 'on',
        deliveryType: 'express',
        freight: 8,
        packingService: true,
        packingDesc: '可按单次用量分装，方便携带',
        giftCoupons: [{ id: 1, threshold: 100, couponName: '满100减10优惠券' }],
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
        freight: 10,
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
        price: 168,
        originPrice: 228,
        memberPrice: 150,
        sold: 92,
        stock: 35,
        spec: '12罐装',
        sort: 20,
        tags: ['礼盒', '送礼'],
        onSale: 'on',
        deliveryType: 'express',
        freight: 0,
        packingService: true,
        packingDesc: '支持礼盒分装及贺卡定制',
        giftCoupons: [
            { id: 1, threshold: 100, couponName: '满100减10优惠券' },
            { id: 2, threshold: 200, couponName: '满200减30优惠券' }
        ],
        afterSaleDays: 15,
        detail: '<p>多款养生茶组合礼盒，适合送礼与自用，品质保证。</p>'
    },
    {
        id: 4,
        mainImage: '护腰带上',
        images: ['护腰带'],
        name: '护腰带',
        category1: '康复辅具',
        category2: '护具',
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
        freight: 0,
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
        freight: 0,
        packingService: true,
        packingDesc: '门店自提时可现场分装体验',
        giftCoupons: [],
        afterSaleDays: 30,
        detail: '<p>家用艾灸理疗仪，温经通络、驱寒除湿，操作简单。</p>'
    }
]
