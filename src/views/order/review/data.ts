/**
 * 订单评价演示数据
 * 后续可由后端接口替换
 */

export type ReviewStatus = 'shown' | 'hidden'

export interface ReviewItem {
    id: number
    reviewNo: string
    avatarColor: string
    nickname: string
    mobile: string
    orderNo: string
    orderType: 'service' | 'goods'
    serviceName: string
    store: string
    therapist: string
    rating: number // 评分星级（0.5 分阶梯）
    content: string
    images: string[]
    reviewTime: string
    status: ReviewStatus
    tags: string[]
    reply: string
}

export const statusTabs = [
    { label: '全部', value: '' },
    { label: '已展示', value: 'shown' },
    { label: '已隐藏', value: 'hidden' }
] as const

export const statusLabels: Record<ReviewStatus, string> = {
    shown: '已展示',
    hidden: '已隐藏'
}

export const statusTagTypes: Record<ReviewStatus, 'success' | 'info'> = {
    shown: 'success',
    hidden: 'info'
}

export const storeOptions = ['天河店', '越秀店', '海珠店']

export const therapistOptions = ['张敏', '李强', '王芳', '陈杰', '赵慧']

export const ratingOptions = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]

export const reviews: ReviewItem[] = [
    {
        id: 1,
        reviewNo: 'RV20261125001',
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        mobile: '13800138001',
        orderNo: 'SO20261122001',
        orderType: 'service',
        serviceName: '全身经络理疗',
        store: '天河店',
        therapist: '张敏',
        rating: 5,
        content: '康复师非常专业，手法到位，服务态度很好，做完之后肩颈轻松了很多，强烈推荐！',
        images: ['评价图1', '评价图2'],
        reviewTime: '2026-11-25 15:30',
        status: 'shown',
        tags: ['服务专业', '态度很好'],
        reply: '感谢您的认可，我们会继续努力！'
    },
    {
        id: 2,
        reviewNo: 'RV20261125002',
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        mobile: '13800138002',
        orderNo: 'GO20261122002',
        orderType: 'goods',
        serviceName: '中药足浴包',
        store: '越秀店',
        therapist: '',
        rating: 4.5,
        content: '足浴包质量不错，包装严实，用起来很舒服，物流也很快。',
        images: ['评价图1'],
        reviewTime: '2026-11-25 11:20',
        status: 'shown',
        tags: ['质量不错', '物流快'],
        reply: ''
    },
    {
        id: 3,
        reviewNo: 'RV20261124003',
        avatarColor: '#67c23a',
        nickname: '康养达人',
        mobile: '13800138003',
        orderNo: 'SO20261120003',
        orderType: 'service',
        serviceName: '肩颈康复评估',
        store: '海珠店',
        therapist: '李强',
        rating: 3,
        content: '评估过程还算仔细，但等待时间有点长，希望下次能准时一些。',
        images: [],
        reviewTime: '2026-11-24 16:40',
        status: 'shown',
        tags: ['等待时间长'],
        reply: '抱歉给您带来不好的体验，我们会优化排班。'
    },
    {
        id: 4,
        reviewNo: 'RV20261124004',
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        mobile: '13800138005',
        orderNo: 'GO20261121004',
        orderType: 'goods',
        serviceName: '热敷眼罩',
        store: '天河店',
        therapist: '',
        rating: 2.5,
        content: '眼罩效果一般，热敷时间不长，性价比不高。',
        images: ['评价图1'],
        reviewTime: '2026-11-24 09:15',
        status: 'hidden',
        tags: ['效果一般'],
        reply: ''
    },
    {
        id: 5,
        reviewNo: 'RV20261123005',
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        mobile: '13800138006',
        orderNo: 'SO20261121005',
        orderType: 'service',
        serviceName: '腰部舒缓护理',
        store: '越秀店',
        therapist: '王芳',
        rating: 5,
        content: '王芳老师手法很好，腰部酸痛缓解了很多，环境也很干净，下次还来。',
        images: ['评价图1', '评价图2', '评价图3'],
        reviewTime: '2026-11-23 14:50',
        status: 'shown',
        tags: ['手法专业', '环境干净'],
        reply: '谢谢您的支持！'
    },
    {
        id: 6,
        reviewNo: 'RV20261122006',
        avatarColor: '#409eff',
        nickname: '静待花开',
        mobile: '13800138004',
        orderNo: 'SO20261119006',
        orderType: 'service',
        serviceName: '体态评估',
        store: '海珠店',
        therapist: '陈杰',
        rating: 4,
        content: '评估很详细，给出了不少改善建议，整体体验不错。',
        images: [],
        reviewTime: '2026-11-22 10:30',
        status: 'shown',
        tags: ['评估详细'],
        reply: ''
    },
    {
        id: 7,
        reviewNo: 'RV20261121007',
        avatarColor: '#17a2b8',
        nickname: '岁月静好',
        mobile: '13800138007',
        orderNo: 'GO20261118007',
        orderType: 'goods',
        serviceName: '精油按摩套装',
        store: '天河店',
        therapist: '',
        rating: 3.5,
        content: '精油味道还可以，吸收一般，包装比较简陋。',
        images: ['评价图1'],
        reviewTime: '2026-11-21 17:05',
        status: 'shown',
        tags: ['包装简陋'],
        reply: ''
    },
    {
        id: 8,
        reviewNo: 'RV20261120008',
        avatarColor: '#607d8b',
        nickname: '前程似锦',
        mobile: '13800138008',
        orderNo: 'SO20261117008',
        orderType: 'service',
        serviceName: '全身经络理疗',
        store: '越秀店',
        therapist: '赵慧',
        rating: 1.5,
        content: '预约时间被临时调整，体验很差，希望改进。',
        images: [],
        reviewTime: '2026-11-20 13:25',
        status: 'hidden',
        tags: ['预约问题'],
        reply: ''
    }
]
