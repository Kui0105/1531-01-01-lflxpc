/**
 * 职称管理演示数据
 * 后续可由后端接口替换
 */

export type StaffType = '店员' | '店长' // 人员类型（可多选）
export type TitleStatus = 'on' | 'off' // 启用 / 停用

// 绩效评分项
export interface PerformanceScore {
    id: number
    level: string // 绩效等级
    minScore: number // 得分区间起
    maxScore: number // 得分区间止
    factor: number // 绩效系数
}

// 职级项（工资计算关联配置）
export interface TitleLevel {
    id: number
    titleId: number // 所属职称
    level: number // 职级（数字越高等级越高）
    baseSalary: number // 基础薪资
    postAllowance: number // 岗位津贴
    performanceBonus: number // 绩效奖金
    monthTargetCount: number // 月目标人次
    overtimeFee: number // 超额工时费
    newCustomerRate: number // 新客提成比例（%）
    oldCustomerRate: number // 老客提成比例（%）
    storeNewRate: number // 门店提成（新客）（%）
    storeOldRate: number // 门店提成（老客）（%）
    outputRate: number // 产值提成（%）
    quarterBonus: number // 季度奖金
}

// 职称
export interface TitleItem {
    id: number
    name: string // 职称名称
    staffTypes: StaffType[] // 人员类型
    sort: number // 排序
    status: TitleStatus // 状态
    createdAt: string // 创建时间
}

export const titleList: TitleItem[] = [
    { id: 1, name: '初级康复师', staffTypes: ['店员'], sort: 10, status: 'on', createdAt: '2026-01-10 09:30' },
    { id: 2, name: '中级康复师', staffTypes: ['店员'], sort: 20, status: 'on', createdAt: '2026-02-15 14:20' },
    { id: 3, name: '高级康复师', staffTypes: ['店员'], sort: 30, status: 'on', createdAt: '2026-03-08 10:45' },
    { id: 4, name: '技术店长', staffTypes: ['店长', '店员'], sort: 40, status: 'on', createdAt: '2026-04-12 16:00' },
    { id: 5, name: '店长', staffTypes: ['店长'], sort: 50, status: 'off', createdAt: '2026-05-20 11:15' }
]

export const performanceScores: PerformanceScore[] = [
    { id: 1, level: 'A', minScore: 90, maxScore: 100, factor: 1.2 },
    { id: 2, level: 'B', minScore: 75, maxScore: 89, factor: 1 },
    { id: 3, level: 'C', minScore: 60, maxScore: 74, factor: 0.8 },
    { id: 4, level: 'D', minScore: 0, maxScore: 59, factor: 0.6 }
]

export const titleLevels: TitleLevel[] = [
    { id: 1, titleId: 1, level: 1, baseSalary: 3000, postAllowance: 200, performanceBonus: 500, monthTargetCount: 120, overtimeFee: 15, newCustomerRate: 8, oldCustomerRate: 5, storeNewRate: 3, storeOldRate: 2, outputRate: 10, quarterBonus: 500 },
    { id: 2, titleId: 1, level: 2, baseSalary: 3500, postAllowance: 300, performanceBonus: 600, monthTargetCount: 140, overtimeFee: 18, newCustomerRate: 9, oldCustomerRate: 6, storeNewRate: 3, storeOldRate: 2, outputRate: 11, quarterBonus: 600 },
    { id: 3, titleId: 2, level: 1, baseSalary: 4000, postAllowance: 400, performanceBonus: 800, monthTargetCount: 160, overtimeFee: 20, newCustomerRate: 10, oldCustomerRate: 7, storeNewRate: 4, storeOldRate: 3, outputRate: 12, quarterBonus: 800 },
    { id: 4, titleId: 2, level: 2, baseSalary: 4500, postAllowance: 500, performanceBonus: 900, monthTargetCount: 180, overtimeFee: 22, newCustomerRate: 11, oldCustomerRate: 8, storeNewRate: 4, storeOldRate: 3, outputRate: 13, quarterBonus: 900 },
    { id: 5, titleId: 3, level: 1, baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, monthTargetCount: 200, overtimeFee: 25, newCustomerRate: 12, oldCustomerRate: 9, storeNewRate: 5, storeOldRate: 4, outputRate: 15, quarterBonus: 1000 },
    { id: 6, titleId: 4, level: 1, baseSalary: 6000, postAllowance: 800, performanceBonus: 1200, monthTargetCount: 220, overtimeFee: 30, newCustomerRate: 13, oldCustomerRate: 10, storeNewRate: 5, storeOldRate: 4, outputRate: 16, quarterBonus: 1200 },
    { id: 7, titleId: 5, level: 1, baseSalary: 7000, postAllowance: 1000, performanceBonus: 1500, monthTargetCount: 250, overtimeFee: 35, newCustomerRate: 15, oldCustomerRate: 12, storeNewRate: 6, storeOldRate: 5, outputRate: 18, quarterBonus: 1500 }
]
