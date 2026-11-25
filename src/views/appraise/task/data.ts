/**
 * 互评任务 - 任务列表演示数据
 * 按年月归档，后续可由后端接口替换
 */

export interface MemberItem {
    id: number
    name: string
    title: string
    avatarColor: string
    special: boolean
    pending: number
    evaluated: number
    total: number
}

export interface EvaluationItem {
    id: number
    name: string
    title: string
    avatarColor: string
    score: number
    comment: string
    time: string
}

export interface StoreItem {
    id: number
    name: string
    joinCount: number
    doneCount: number
    pendingCount: number
    status: 'ongoing' | 'done'
    average: number
    members: MemberItem[]
    evaluations: EvaluationItem[]
}

export interface TaskInfo {
    name: string
    period: string
    progress: string
    storeCount: number
    memberCount: number
    pendingCount: number
}

export interface MonthData {
    task: TaskInfo
    stores: StoreItem[]
}

export const taskData: Record<string, MonthData> = {
    '2026-11': {
        task: {
            name: '11月门店服务质量互评',
            period: '2026-11-01 ~ 2026-11-30',
            progress: '72%',
            storeCount: 3,
            memberCount: 14,
            pendingCount: 5
        },
        stores: [
            {
                id: 1,
                name: '天河店',
                joinCount: 5,
                doneCount: 4,
                pendingCount: 1,
                status: 'ongoing',
                average: 9.2,
                members: [
                    { id: 11, name: '张敏', title: '保健师 / 三级', avatarColor: '#4A5DFF', special: false, pending: 1, evaluated: 9, total: 10 },
                    { id: 12, name: '李强', title: '康复专家 / 高级', avatarColor: '#e6a23c', special: true, pending: 0, evaluated: 5, total: 5 },
                    { id: 13, name: '王芳', title: '门店店长 / 二级', avatarColor: '#67c23a', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 14, name: '陈杰', title: '保健师 / 一级', avatarColor: '#409eff', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 15, name: '周慧', title: '总经理 / 高级', avatarColor: '#f56c6c', special: true, pending: 0, evaluated: 5, total: 5 }
                ],
                evaluations: [
                    { id: 101, name: '张敏', title: '保健师 / 三级', avatarColor: '#4A5DFF', score: 9, comment: '服务态度良好，手法专业。', time: '2026-11-23 14:32' },
                    { id: 102, name: '李强', title: '康复专家 / 高级', avatarColor: '#e6a23c', score: 5, comment: '康复方案细致，沟通充分。', time: '2026-11-22 10:15' },
                    { id: 103, name: '王芳', title: '门店店长 / 二级', avatarColor: '#67c23a', score: 10, comment: '门店管理规范，响应及时。', time: '2026-11-21 16:48' }
                ]
            },
            {
                id: 2,
                name: '越秀店',
                joinCount: 5,
                doneCount: 3,
                pendingCount: 2,
                status: 'ongoing',
                average: 8.8,
                members: [
                    { id: 21, name: '刘洋', title: '保健师 / 二级', avatarColor: '#9b59b6', special: false, pending: 1, evaluated: 9, total: 10 },
                    { id: 22, name: '黄丽', title: '康复专家 / 中级', avatarColor: '#e6a23c', special: true, pending: 1, evaluated: 4, total: 5 },
                    { id: 23, name: '吴磊', title: '门店店长 / 二级', avatarColor: '#67c23a', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 24, name: '郑欣', title: '保健师 / 一级', avatarColor: '#409eff', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 25, name: '孙浩', title: '总经理 / 高级', avatarColor: '#f56c6c', special: true, pending: 0, evaluated: 5, total: 5 }
                ],
                evaluations: [
                    { id: 201, name: '吴磊', title: '门店店长 / 二级', avatarColor: '#67c23a', score: 9, comment: '团队协作顺畅。', time: '2026-11-24 09:20' },
                    { id: 202, name: '孙浩', title: '总经理 / 高级', avatarColor: '#f56c6c', score: 5, comment: '整体运营符合标准。', time: '2026-11-23 11:05' }
                ]
            },
            {
                id: 3,
                name: '海珠店',
                joinCount: 4,
                doneCount: 2,
                pendingCount: 2,
                status: 'ongoing',
                average: 9.0,
                members: [
                    { id: 31, name: '何静', title: '保健师 / 三级', avatarColor: '#4A5DFF', special: false, pending: 1, evaluated: 9, total: 10 },
                    { id: 32, name: '高鹏', title: '康复专家 / 高级', avatarColor: '#e6a23c', special: true, pending: 1, evaluated: 4, total: 5 },
                    { id: 33, name: '马婷', title: '门店店长 / 一级', avatarColor: '#67c23a', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 34, name: '林峰', title: '保健师 / 二级', avatarColor: '#409eff', special: false, pending: 0, evaluated: 10, total: 10 }
                ],
                evaluations: [
                    { id: 301, name: '马婷', title: '门店店长 / 一级', avatarColor: '#67c23a', score: 9, comment: '服务流程执行到位。', time: '2026-11-22 15:36' },
                    { id: 302, name: '林峰', title: '保健师 / 二级', avatarColor: '#409eff', score: 9, comment: '手法规范，顾客反馈好。', time: '2026-11-21 17:10' }
                ]
            }
        ]
    },
    '2026-10': {
        task: {
            name: '10月门店环境互评',
            period: '2026-10-01 ~ 2026-10-31',
            progress: '100%',
            storeCount: 2,
            memberCount: 9,
            pendingCount: 0
        },
        stores: [
            {
                id: 4,
                name: '天河店',
                joinCount: 5,
                doneCount: 5,
                pendingCount: 0,
                status: 'done',
                average: 9.5,
                members: [
                    { id: 41, name: '张敏', title: '保健师 / 三级', avatarColor: '#4A5DFF', special: false, pending: 0, evaluated: 10, total: 10 },
                    { id: 42, name: '王芳', title: '门店店长 / 二级', avatarColor: '#67c23a', special: false, pending: 0, evaluated: 10, total: 10 }
                ],
                evaluations: [
                    { id: 401, name: '王芳', title: '门店店长 / 二级', avatarColor: '#67c23a', score: 10, comment: '环境卫生保持良好。', time: '2026-10-28 10:22' }
                ]
            },
            {
                id: 5,
                name: '越秀店',
                joinCount: 4,
                doneCount: 4,
                pendingCount: 0,
                status: 'done',
                average: 9.3,
                members: [
                    { id: 51, name: '吴磊', title: '门店店长 / 二级', avatarColor: '#67c23a', special: false, pending: 0, evaluated: 10, total: 10 }
                ],
                evaluations: [
                    { id: 501, name: '吴磊', title: '门店店长 / 二级', avatarColor: '#67c23a', score: 9, comment: '环境整理及时。', time: '2026-10-27 14:50' }
                ]
            }
        ]
    }
}
