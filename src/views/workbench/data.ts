/**
 * 工作台「数据概览」演示数据
 * 后续接入后端时，可用接口返回值覆盖对应字段
 */

export interface StoreOption {
    id: string
    name: string
}

export interface TodayData {
    revenue: number
    output: number
    appointment: number
    serviceOrders: number
    serviceAmount: number
    goodsOrders: number
    goodsAmount: number
}

export interface TotalData {
    revenue: number
    output: number
    prepay: number
}

export interface RankItem {
    rank: number
    name: string
    amount: number
}

export interface OverviewData {
    stores: StoreOption[]
    platform: {
        today: TodayData
        total: TotalData
    }
    storeData: Record<string, { today: TodayData; total: TotalData }>
    trend: {
        date: string[]
        revenue: number[]
    }
    revenueRank: RankItem[]
    outputRank: RankItem[]
}

export const overviewData: OverviewData = {
    stores: [
        { id: 'th', name: '天河店' },
        { id: 'yx', name: '越秀店' },
        { id: 'hz', name: '海珠店' }
    ],
    platform: {
        today: {
            revenue: 128600,
            output: 96300,
            appointment: 86,
            serviceOrders: 42,
            serviceAmount: 78600,
            goodsOrders: 35,
            goodsAmount: 50000
        },
        total: {
            revenue: 3865200,
            output: 2896800,
            prepay: 1256000
        }
    },
    storeData: {
        th: {
            today: {
                revenue: 48600,
                output: 36200,
                appointment: 32,
                serviceOrders: 16,
                serviceAmount: 29800,
                goodsOrders: 12,
                goodsAmount: 18800
            },
            total: { revenue: 1526800, output: 1142600, prepay: 498000 }
        },
        yx: {
            today: {
                revenue: 39200,
                output: 28800,
                appointment: 25,
                serviceOrders: 13,
                serviceAmount: 24500,
                goodsOrders: 10,
                goodsAmount: 14700
            },
            total: { revenue: 1152400, output: 864300, prepay: 376000 }
        },
        hz: {
            today: {
                revenue: 40800,
                output: 31300,
                appointment: 29,
                serviceOrders: 13,
                serviceAmount: 24300,
                goodsOrders: 13,
                goodsAmount: 16500
            },
            total: { revenue: 1186000, output: 889900, prepay: 382000 }
        }
    },
    trend: {
        date: ['11-19', '11-20', '11-21', '11-22', '11-23', '11-24', '11-25'],
        revenue: [142000, 128000, 156000, 168000, 135000, 172000, 164000]
    },
    revenueRank: [
        { rank: 1, name: '天河店', amount: 586200 },
        { rank: 2, name: '海珠店', amount: 512800 },
        { rank: 3, name: '越秀店', amount: 468900 },
        { rank: 4, name: '番禺店', amount: 386500 },
        { rank: 5, name: '白云店', amount: 312700 }
    ],
    outputRank: [
        { rank: 1, name: '天河店', amount: 438600 },
        { rank: 2, name: '越秀店', amount: 392400 },
        { rank: 3, name: '海珠店', amount: 368900 },
        { rank: 4, name: '番禺店', amount: 296300 },
        { rank: 5, name: '白云店', amount: 245800 }
    ]
}
