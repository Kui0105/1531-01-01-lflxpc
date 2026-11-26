/**
 * 会员等级演示数据
 * 后续可由后端接口替换
 */

export interface MemberLevelItem {
    id: number
    name: string // 等级名称
    levelValue: number // 等级数值（数字越大等级越高）
    background: string // 会员等级背景（图片 data URI）
    discount: number // 会员折扣（如 9.5 表示 9.5 折）
    growthValue: number // 所需成长值
    enabled: boolean // 状态
    benefits: string[] // 权益内容
    createdAt: string // 创建时间
}

// 生成渐变背景 SVG 占位图
const levelBackground = (label: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="90"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#1f2d5a"/></linearGradient></defs><rect width="240" height="90" rx="8" fill="url(#g)"/><text x="18" y="52" font-size="26" font-weight="bold" fill="#fff" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const memberLevelList: MemberLevelItem[] = [
    {
        id: 1,
        name: '普通会员',
        levelValue: 1,
        background: levelBackground('普通会员', '#8c9bb5'),
        discount: 10,
        growthValue: 0,
        enabled: true,
        benefits: ['基础咨询服务', '积分累计'],
        createdAt: '2026-01-05 10:30'
    },
    {
        id: 2,
        name: '银卡会员',
        levelValue: 2,
        background: levelBackground('银卡会员', '#7f8c9a'),
        discount: 9.5,
        growthValue: 500,
        enabled: true,
        benefits: ['95 折专属折扣', '积分 1.2 倍', '生日礼券'],
        createdAt: '2026-01-18 14:20'
    },
    {
        id: 3,
        name: '金卡会员',
        levelValue: 3,
        background: levelBackground('金卡会员', '#d4a017'),
        discount: 9,
        growthValue: 2000,
        enabled: true,
        benefits: ['9 折专属折扣', '积分 1.5 倍', '优先预约', '专属客服'],
        createdAt: '2026-02-02 09:15'
    },
    {
        id: 4,
        name: '钻石会员',
        levelValue: 4,
        background: levelBackground('钻石会员', '#4a5dff'),
        discount: 8.5,
        growthValue: 5000,
        enabled: true,
        benefits: ['85 折专属折扣', '积分 2 倍', '免费配送', '专属活动'],
        createdAt: '2026-03-11 16:45'
    },
    {
        id: 5,
        name: '至尊会员',
        levelValue: 5,
        background: levelBackground('至尊会员', '#8e44ad'),
        discount: 8,
        growthValue: 10000,
        enabled: false,
        benefits: ['8 折专属折扣', '积分 3 倍', '一对一顾问', 'VIP 专属权益'],
        createdAt: '2026-04-20 11:00'
    }
]
