/**
 * 广告列表演示数据
 * 后续可由后端接口替换
 */

export type AdStatus = 'on' | 'off' // 启用 / 停用

// 广告位置（启动页、首页轮播、商城轮播、首页导航）
export const adPositionOptions = ['启动页', '首页轮播', '商城轮播', '首页导航']

export interface AdItem {
    id: number
    adId: string // 广告ID
    image: string // 广告图片（data URI 或 URL）
    position: string // 广告位置
    status: AdStatus // 状态
    sort: number // 排序
    createdAt: string // 创建时间
}

// 示例广告图（内联 SVG）
const adSvg = (text: string, color: string) =>
    `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27200%27%3E%3Crect width=%27600%27 height=%27200%27 fill=%27%23${color}%27/%3E%3Ctext x=%27300%27 y=%27115%27 font-size=%2740%27 text-anchor=%27middle%27 fill=%27%23fff%27%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`

export const adList: AdItem[] = [
    { id: 1, adId: 'AD20260115001', image: adSvg('开业活动', '4A90E2'), position: '启动页', status: 'on', sort: 10, createdAt: '2026-01-15 09:30' },
    { id: 2, adId: 'AD20260220002', image: adSvg('春季理疗', '67C23A'), position: '首页轮播', status: 'on', sort: 20, createdAt: '2026-02-20 14:20' },
    { id: 3, adId: 'AD20260308003', image: adSvg('会员专享', 'E6A23C'), position: '商城轮播', status: 'off', sort: 30, createdAt: '2026-03-08 10:45' },
    { id: 4, adId: 'AD20260412004', image: adSvg('新客礼包', '909399'), position: '首页导航', status: 'on', sort: 40, createdAt: '2026-04-12 16:00' },
    { id: 5, adId: 'AD20260520005', image: adSvg('节日特惠', 'F56C6C'), position: '首页轮播', status: 'off', sort: 50, createdAt: '2026-05-20 11:15' }
]
