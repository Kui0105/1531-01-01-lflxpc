/**
 * 人员列表演示数据
 * 后续可由后端接口替换
 */

export type WorkStatus = 'on' | 'off' // 上班 / 休息
export type StaffStatus = 'enabled' | 'disabled' // 启用 / 停用

// 人员绩效
export interface StaffPerformance {
    id: number
    staffId: number // 所属人员
    yearMonth: string // 年/月
    level: string // 绩效等级
    satisfaction: number // 客户满意度（%）
    complaintDeduct: number // 投诉扣分
    factor: number // 绩效系数
    completedCount: number // 完成人次
    targetCount: number // 月目标人次
}

// 人员
export interface StaffItem {
    id: number
    name: string // 姓名
    phone: string // 手机号
    photo: string // 人员照片（data URI 或 URL）
    title: string // 职称
    level: number // 职级
    store: string // 所属门店
    workStatus: WorkStatus // 上班状态
    status: StaffStatus // 状态
    services: string[] // 可预约服务关联
    createdAt: string // 创建时间
}

// 人员头像占位（内联 SVG）
const avatarSvg = (name: string, color: string) =>
    `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect width=%27100%27 height=%27100%27 fill=%27%23${color}%27/%3E%3Ctext x=%2750%27 y=%2762%27 font-size=%2736%27 text-anchor=%27middle%27 fill=%27%23fff%27%3E${encodeURIComponent(name)}%3C/text%3E%3C/svg%3E`

export const staffList: StaffItem[] = [
    {
        id: 1, name: '张伟', phone: '13800138001', photo: avatarSvg('张', '4A90E2'),
        title: '高级康复师', level: 2, store: '天河旗舰店', workStatus: 'on', status: 'enabled',
        services: ['肩颈理疗', '腰部推拿'], createdAt: '2026-01-15 09:30'
    },
    {
        id: 2, name: '李娜', phone: '13800138002', photo: avatarSvg('李', '67C23A'),
        title: '中级康复师', level: 1, store: '越秀店', workStatus: 'on', status: 'enabled',
        services: ['面部护理', '艾灸理疗'], createdAt: '2026-02-20 14:20'
    },
    {
        id: 3, name: '王强', phone: '13800138003', photo: avatarSvg('王', 'E6A23C'),
        title: '技术店长', level: 1, store: '天河旗舰店', workStatus: 'off', status: 'enabled',
        services: ['肩颈理疗', '腰部推拿', '面部护理'], createdAt: '2026-03-05 10:45'
    },
    {
        id: 4, name: '刘敏', phone: '13800138004', photo: avatarSvg('刘', '909399'),
        title: '初级康复师', level: 1, store: '海珠店', workStatus: 'on', status: 'disabled',
        services: ['基础推拿'], createdAt: '2026-04-12 16:00'
    },
    {
        id: 5, name: '陈杰', phone: '13800138005', photo: avatarSvg('陈', 'F56C6C'),
        title: '店长', level: 1, store: '越秀店', workStatus: 'on', status: 'enabled',
        services: [], createdAt: '2026-05-08 11:15'
    }
]

export const staffPerformanceList: StaffPerformance[] = [
    { id: 1, staffId: 1, yearMonth: '2026-11', level: 'A', satisfaction: 98, complaintDeduct: 0, factor: 1.2, completedCount: 156, targetCount: 140 },
    { id: 2, staffId: 1, yearMonth: '2026-10', level: 'B', satisfaction: 95, complaintDeduct: 2, factor: 1, completedCount: 132, targetCount: 140 },
    { id: 3, staffId: 1, yearMonth: '2026-09', level: 'A', satisfaction: 97, complaintDeduct: 0, factor: 1.2, completedCount: 148, targetCount: 140 },
    { id: 4, staffId: 2, yearMonth: '2026-11', level: 'B', satisfaction: 93, complaintDeduct: 1, factor: 1, completedCount: 118, targetCount: 160 },
    { id: 5, staffId: 2, yearMonth: '2026-10', level: 'C', satisfaction: 88, complaintDeduct: 5, factor: 0.8, completedCount: 102, targetCount: 160 },
    { id: 6, staffId: 3, yearMonth: '2026-11', level: 'A', satisfaction: 99, complaintDeduct: 0, factor: 1.2, completedCount: 205, targetCount: 220 },
    { id: 7, staffId: 4, yearMonth: '2026-11', level: 'C', satisfaction: 86, complaintDeduct: 6, factor: 0.8, completedCount: 88, targetCount: 120 },
    { id: 8, staffId: 5, yearMonth: '2026-11', level: 'B', satisfaction: 94, complaintDeduct: 1, factor: 1, completedCount: 198, targetCount: 250 }
]
