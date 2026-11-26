/**
 * 分销等级演示数据
 * 后续可由后端接口替换
 */

export interface DistributionLevelItem {
    id: number
    name: string // 等级名称
    icon: string // 等级图标（图片 data URI）
    commissionRate: number // 佣金返利比例（%）
    pointRate: number // 积分返利比例（%）
    status: 'on' | 'off' // 状态
    sort: number // 排序值
}

// 生成等级图标占位图
const levelIcon = (label: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#1f2d5a"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g)"/><text x="32" y="34" font-size="22" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const distributionLevels: DistributionLevelItem[] = [
    { id: 1, name: '一级分销', icon: levelIcon('一', '#4A5DFF'), commissionRate: 10, pointRate: 5, status: 'on', sort: 30 },
    { id: 2, name: '二级分销', icon: levelIcon('二', '#67c23a'), commissionRate: 8, pointRate: 4, status: 'on', sort: 20 },
    { id: 3, name: '三级分销', icon: levelIcon('三', '#e6a23c'), commissionRate: 5, pointRate: 2, status: 'on', sort: 10 },
    { id: 4, name: '钻石分销', icon: levelIcon('钻', '#8e44ad'), commissionRate: 15, pointRate: 8, status: 'off', sort: 40 }
]
