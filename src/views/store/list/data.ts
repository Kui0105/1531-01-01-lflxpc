/**
 * 门店列表演示数据
 * 后续可由后端接口替换
 */

export type StoreStatus = 'open' | 'closed' // 营业中 / 已停用

export const regionOptions = ['广东省广州市天河区', '广东省广州市越秀区', '广东省广州市海珠区', '广东省广州市番禺区']

export interface StoreItem {
    id: number
    name: string // 门店名称
    cover: string // 封面图（data URI 或 URL）
    slides: string[] // 轮播图
    phone: string // 联系电话
    businessHours: string // 营业时间
    region: string // 省市区
    address: string // 详细地址
    latitude: number // 纬度
    longitude: number // 经度
    account: string // 门店账户（第三方资料待确认）
    status: StoreStatus // 营业状态
    // 门店信息
    restArea: string // 休息区域
    features: string // 特色设备
    bookingMethod: string // 预约方式
    // 门店目标
    outputTarget: number // 产值目标
    revenueTarget: number // 营收目标
    profitTarget: number // 每月净利润目标
    createdAt: string // 创建时间
}

// 示例封面图（内联 SVG）
const coverSvg = (name: string, color: string) =>
    `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27240%27%3E%3Crect width=%27400%27 height=%27240%27 fill=%27%23${color}%27/%3E%3Ctext x=%27200%27 y=%27130%27 font-size=%2736%27 text-anchor=%27middle%27 fill=%27%23fff%27%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`

export const storeItemList: StoreItem[] = [
    {
        id: 1,
        name: '天河旗舰店',
        cover: coverSvg('天河旗舰店', '4A90E2'),
        slides: [],
        phone: '020-38888888',
        businessHours: '09:00-21:00',
        region: '广东省广州市天河区',
        address: '天河路 208 号天河城 5 楼',
        latitude: 23.1301,
        longitude: 113.3234,
        account: '待确认',
        status: 'open',
        restArea: '贵宾休息室、茶水间',
        features: '频谱仪、艾灸仪、理疗床',
        bookingMethod: '线上预约、电话预约',
        outputTarget: 200000,
        revenueTarget: 180000,
        profitTarget: 50000,
        createdAt: '2026-01-10 09:30'
    },
    {
        id: 2,
        name: '越秀店',
        cover: coverSvg('越秀店', '67C23A'),
        slides: [],
        phone: '020-83333333',
        businessHours: '09:00-20:30',
        region: '广东省广州市越秀区',
        address: '中山四路 228 号',
        latitude: 23.1289,
        longitude: 113.2686,
        account: '待确认',
        status: 'open',
        restArea: '休息等候区',
        features: '推拿床、热敷设备',
        bookingMethod: '线上预约',
        outputTarget: 150000,
        revenueTarget: 130000,
        profitTarget: 35000,
        createdAt: '2026-02-15 14:20'
    },
    {
        id: 3,
        name: '海珠店',
        cover: coverSvg('海珠店', 'E6A23C'),
        slides: [],
        phone: '020-84444444',
        businessHours: '10:00-21:00',
        region: '广东省广州市海珠区',
        address: '江南大道中 88 号',
        latitude: 23.0841,
        longitude: 113.3174,
        account: '待确认',
        status: 'closed',
        restArea: '休息区',
        features: '基础理疗设备',
        bookingMethod: '电话预约',
        outputTarget: 120000,
        revenueTarget: 100000,
        profitTarget: 25000,
        createdAt: '2026-03-08 10:45'
    }
]
