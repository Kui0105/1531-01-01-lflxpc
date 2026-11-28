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

// 复测待办（管理端只展示，处理状态由用户端店长操作）
export interface RetestTodo {
    id: number
    avatarColor: string
    nickname: string
    realName: string
    retestTime: string
    store: string
    status: 'pending'
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
    retestTodos: RetestTodo[]
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
    ],
    retestTodos: [
        { id: 1, avatarColor: '#4A5DFF', nickname: '健康同行者', realName: '张敏', retestTime: '2026-11-28 10:00', store: '天河店', status: 'pending' },
        { id: 2, avatarColor: '#e6a23c', nickname: '春风化雨', realName: '李强', retestTime: '2026-11-28 14:30', store: '越秀店', status: 'pending' },
        { id: 3, avatarColor: '#67c23a', nickname: '康养达人', realName: '王芳', retestTime: '2026-11-29 09:00', store: '海珠店', status: 'pending' },
        { id: 4, avatarColor: '#409eff', nickname: '静待花开', realName: '陈杰', retestTime: '2026-11-29 15:20', store: '天河店', status: 'pending' },
        { id: 5, avatarColor: '#9b59b6', nickname: '阳光正好', realName: '赵慧', retestTime: '2026-11-30 11:10', store: '越秀店', status: 'pending' },
        { id: 6, avatarColor: '#f56c6c', nickname: '安然自得', realName: '刘洋', retestTime: '2026-12-01 16:40', store: '海珠店', status: 'pending' },
        { id: 7, avatarColor: '#13ce66', nickname: '健康守护者', realName: '孙丽', retestTime: '2026-12-02 09:30', store: '天河店', status: 'pending' },
        { id: 8, avatarColor: '#ff9d00', nickname: '元气满满', realName: '周婷', retestTime: '2026-12-02 13:15', store: '海珠店', status: 'pending' },
        { id: 9, avatarColor: '#6b8cff', nickname: '慢养生活', realName: '吴刚', retestTime: '2026-12-03 10:20', store: '越秀店', status: 'pending' },
        { id: 10, avatarColor: '#c0392b', nickname: '康健常伴', realName: '郑霞', retestTime: '2026-12-03 15:40', store: '天河店', status: 'pending' },
        { id: 11, avatarColor: '#8e44ad', nickname: '舒展人生', realName: '黄磊', retestTime: '2026-12-04 08:50', store: '海珠店', status: 'pending' },
        { id: 12, avatarColor: '#16a085', nickname: '活力每一天', realName: '林芳', retestTime: '2026-12-04 14:05', store: '越秀店', status: 'pending' },
        { id: 13, avatarColor: '#d35400', nickname: '稳态康复', realName: '何静', retestTime: '2026-12-05 11:30', store: '天河店', status: 'pending' },
        { id: 14, avatarColor: '#2980b9', nickname: '身心合一', realName: '高鹏', retestTime: '2026-12-05 16:20', store: '海珠店', status: 'pending' }
    ]
}
