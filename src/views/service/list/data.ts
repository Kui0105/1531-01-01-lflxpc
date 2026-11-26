/**
 * 服务列表演示数据
 * 后续可由后端接口替换
 */

export type ServiceType = 'assess' | 'recover' // 评估服务 / 康复服务
export type OnSaleStatus = 'on' | 'off' // 上架 / 下架

export interface ServiceItem {
    id: number
    cover: string // 封面文字（生成占位图）
    images: string[] // 轮播图文字
    name: string
    category1: string
    category2: string
    type: ServiceType
    duration: number // 时长（分钟）
    price: number // 售价
    originPrice: number // 原价
    tags: string[]
    therapistTitle: string // 关联康复师职称
    validCountFactor: number // 有效服务人次系数
    sort: number // 排序值
    hotTag: string // 热门标签
    onSale: OnSaleStatus
    validDays: number // 有效期（天）
    stores: string[] // 适用门店
    discountTag: string // 优惠标签
    intro: string // 服务简介
    detail: string // 服务详情（富文本）
    notice: string // 服务须知
}

// 一级/二级分类联动
export const categoryOptions: Record<string, string[]> = {
    康复理疗: ['肩颈理疗', '腰背理疗', '全身理疗'],
    康复评估: ['体态评估', '功能评估', '康复评定'],
    护理服务: ['经络护理', '舒缓护理']
}

export const category1Options = Object.keys(categoryOptions)

export const serviceTypeLabels: Record<ServiceType, string> = {
    assess: '评估服务',
    recover: '康复服务'
}

export const therapistTitleOptions = ['所有康复师', '首席康复师', '康复师']

export const storeOptions = ['天河店', '越秀店', '海珠店']

export const services: ServiceItem[] = [
    {
        id: 1,
        cover: '全身经络理疗',
        images: ['全身经络理疗', '服务场景1', '服务场景2'],
        name: '全身经络理疗',
        category1: '康复理疗',
        category2: '全身理疗',
        type: 'recover',
        duration: 90,
        price: 298,
        originPrice: 398,
        tags: ['热销', '好评'],
        therapistTitle: '所有康复师',
        validCountFactor: 1,
        sort: 10,
        hotTag: '热门',
        onSale: 'on',
        validDays: 365,
        stores: ['天河店', '越秀店', '海珠店'],
        discountTag: '限时8折',
        intro: '通过专业手法疏通全身经络，缓解疲劳与肌肉紧张。',
        detail: '<p>全身经络理疗采用专业推拿手法，疏通经络、活血化瘀，有效缓解疲劳、改善睡眠。适合长期伏案、肩颈腰背不适人群。</p>',
        notice: '预约前请确认身体状况，急性损伤期不建议进行理疗。',
    },
    {
        id: 2,
        cover: '肩颈康复评估',
        images: ['肩颈康复评估'],
        name: '肩颈康复评估',
        category1: '康复评估',
        category2: '康复评定',
        type: 'assess',
        duration: 30,
        price: 128,
        originPrice: 168,
        tags: ['专业'],
        therapistTitle: '首席康复师',
        validCountFactor: 1,
        sort: 20,
        hotTag: '',
        onSale: 'on',
        validDays: 365,
        stores: ['天河店', '海珠店'],
        discountTag: '',
        intro: '由首席康复师进行肩颈功能评估，给出专业康复建议。',
        detail: '<p>通过专业评估设备与康复师经验，全面评估肩颈活动度、肌肉状态，出具个性化康复方案。</p>',
        notice: '请穿着宽松衣物以便评估。',
    },
    {
        id: 3,
        cover: '腰部舒缓护理',
        images: ['腰部舒缓护理'],
        name: '腰部舒缓护理',
        category1: '护理服务',
        category2: '舒缓护理',
        type: 'recover',
        duration: 60,
        price: 198,
        originPrice: 258,
        tags: [],
        therapistTitle: '康复师',
        validCountFactor: 1,
        sort: 30,
        hotTag: '',
        onSale: 'off',
        validDays: 180,
        stores: ['越秀店'],
        discountTag: '新客立减',
        intro: '针对腰部肌肉劳损的舒缓护理，放松腰背肌群。',
        detail: '<p>采用热敷与手法结合的方式，缓解腰部肌肉紧张，改善局部血液循环。</p>',
        notice: '孕妇及腰部急性损伤者不宜预约。',
    },
    {
        id: 4,
        cover: '体态评估',
        images: ['体态评估', '体态分析'],
        name: '体态评估',
        category1: '康复评估',
        category2: '体态评估',
        type: 'assess',
        duration: 45,
        price: 98,
        originPrice: 138,
        tags: ['热门'],
        therapistTitle: '所有康复师',
        validCountFactor: 1,
        sort: 15,
        hotTag: '热门',
        onSale: 'on',
        validDays: 365,
        stores: ['天河店', '越秀店', '海珠店'],
        discountTag: '',
        intro: '通过体态分析评估脊柱与关节状态。',
        detail: '<p>利用体态评估系统，检测脊柱侧弯、骨盆倾斜等问题，提供改善建议。</p>',
        notice: '评估需穿着贴身衣物以便准确分析。',
    },
    {
        id: 5,
        cover: '经络护理套餐',
        images: ['经络护理套餐'],
        name: '经络护理套餐',
        category1: '护理服务',
        category2: '经络护理',
        type: 'recover',
        duration: 120,
        price: 399,
        originPrice: 599,
        tags: ['套餐'],
        therapistTitle: '首席康复师',
        validCountFactor: 1.5,
        sort: 5,
        hotTag: '热门',
        onSale: 'on',
        validDays: 365,
        stores: ['天河店'],
        discountTag: '套餐优惠',
        intro: '多次经络护理组合套餐，性价比更高。',
        detail: '<p>包含 4 次全身经络护理，由首席康复师服务，适合长期调理人群。</p>',
        notice: '套餐有效期 365 天，过期未使用次数作废。',
    }
]
