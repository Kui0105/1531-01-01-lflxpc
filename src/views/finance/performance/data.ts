/**
 * 绩效薪资演示数据
 * 后续可由后端接口替换
 */

// 员工工资明细
export interface SalaryDetail {
    id: number
    billId: number // 所属账单
    name: string // 姓名
    title: string // 职称
    level: number // 职级
    performanceLevel: string // 绩效等级
    baseSalary: number // 基本薪资
    postAllowance: number // 岗位津贴
    performanceBonus: number // 绩效奖金
    overtimeFee: number // 超额工时费
    commission: number // 提成
    totalSalary: number // 合计工资
}

// 绩效薪资
export interface PerformanceBill {
    id: number
    billMonth: string // 账单时间（年月）
    store: string // 门店
    totalSalary: number // 工资合计
    staffCount: number // 门店人数
}

export const storeOptions = ['天河店', '越秀店', '海珠店', '番禺店']

export const performanceBills: PerformanceBill[] = [
    { id: 1, billMonth: '2026-11', store: '天河店', totalSalary: 68500, staffCount: 4 },
    { id: 2, billMonth: '2026-11', store: '越秀店', totalSalary: 52300, staffCount: 3 },
    { id: 3, billMonth: '2026-11', store: '海珠店', totalSalary: 41200, staffCount: 3 },
    { id: 4, billMonth: '2026-10', store: '天河店', totalSalary: 64800, staffCount: 4 },
    { id: 5, billMonth: '2026-10', store: '越秀店', totalSalary: 49600, staffCount: 3 },
    { id: 6, billMonth: '2026-10', store: '海珠店', totalSalary: 38900, staffCount: 3 },
    { id: 7, billMonth: '2026-09', store: '天河店', totalSalary: 61200, staffCount: 4 },
    { id: 8, billMonth: '2026-09', store: '越秀店', totalSalary: 47500, staffCount: 3 }
]

export const salaryDetails: SalaryDetail[] = [
    // 天河店 2026-11（4人，合计 68500）
    { id: 1, billId: 1, name: '张伟', title: '高级康复师', level: 2, performanceLevel: 'A', baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, overtimeFee: 450, commission: 8200, totalSalary: 15250 },
    { id: 2, billId: 1, name: '王强', title: '技术店长', level: 1, performanceLevel: 'A', baseSalary: 6000, postAllowance: 800, performanceBonus: 1200, overtimeFee: 0, commission: 11800, totalSalary: 19800 },
    { id: 3, billId: 1, name: '李静', title: '中级康复师', level: 1, performanceLevel: 'B', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 320, commission: 6850, totalSalary: 12370 },
    { id: 4, billId: 1, name: '赵敏', title: '初级康复师', level: 1, performanceLevel: 'B', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 180, commission: 7200, totalSalary: 11080 },
    // 越秀店 2026-11（3人）
    { id: 5, billId: 2, name: '陈杰', title: '店长', level: 1, performanceLevel: 'B', baseSalary: 7000, postAllowance: 1000, performanceBonus: 1500, overtimeFee: 0, commission: 9200, totalSalary: 18700 },
    { id: 6, billId: 2, name: '林芳', title: '中级康复师', level: 1, performanceLevel: 'A', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 260, commission: 6400, totalSalary: 11860 },
    { id: 7, billId: 2, name: '刘洋', title: '初级康复师', level: 1, performanceLevel: 'C', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 120, commission: 6020, totalSalary: 9840 },
    // 海珠店 2026-11（3人）
    { id: 8, billId: 3, name: '周慧', title: '高级康复师', level: 1, performanceLevel: 'B', baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, overtimeFee: 200, commission: 7600, totalSalary: 14400 },
    { id: 9, billId: 3, name: '吴磊', title: '中级康复师', level: 1, performanceLevel: 'C', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 150, commission: 5800, totalSalary: 11150 },
    { id: 10, billId: 3, name: '郑洁', title: '初级康复师', level: 1, performanceLevel: 'B', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 100, commission: 6850, totalSalary: 10650 },
    // 天河店 2026-10（4人）
    { id: 11, billId: 4, name: '张伟', title: '高级康复师', level: 2, performanceLevel: 'A', baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, overtimeFee: 380, commission: 7900, totalSalary: 14880 },
    { id: 12, billId: 4, name: '王强', title: '技术店长', level: 1, performanceLevel: 'B', baseSalary: 6000, postAllowance: 800, performanceBonus: 1200, overtimeFee: 0, commission: 11200, totalSalary: 19200 },
    { id: 13, billId: 4, name: '李静', title: '中级康复师', level: 1, performanceLevel: 'B', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 280, commission: 6500, totalSalary: 11980 },
    { id: 14, billId: 4, name: '赵敏', title: '初级康复师', level: 1, performanceLevel: 'C', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 140, commission: 6900, totalSalary: 10740 },
    // 越秀店 2026-10（3人）
    { id: 15, billId: 5, name: '陈杰', title: '店长', level: 1, performanceLevel: 'A', baseSalary: 7000, postAllowance: 1000, performanceBonus: 1500, overtimeFee: 0, commission: 9500, totalSalary: 19000 },
    { id: 16, billId: 5, name: '林芳', title: '中级康复师', level: 1, performanceLevel: 'B', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 220, commission: 6100, totalSalary: 11520 },
    { id: 17, billId: 5, name: '刘洋', title: '初级康复师', level: 1, performanceLevel: 'B', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 100, commission: 6280, totalSalary: 10080 },
    // 海珠店 2026-10（3人）
    { id: 18, billId: 6, name: '周慧', title: '高级康复师', level: 1, performanceLevel: 'C', baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, overtimeFee: 180, commission: 7200, totalSalary: 13980 },
    { id: 19, billId: 6, name: '吴磊', title: '中级康复师', level: 1, performanceLevel: 'B', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 120, commission: 5600, totalSalary: 10920 },
    { id: 20, billId: 6, name: '郑洁', title: '初级康复师', level: 1, performanceLevel: 'B', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 80, commission: 6500, totalSalary: 10280 },
    // 天河店 2026-09（4人）
    { id: 21, billId: 7, name: '张伟', title: '高级康复师', level: 2, performanceLevel: 'B', baseSalary: 5000, postAllowance: 600, performanceBonus: 1000, overtimeFee: 300, commission: 7500, totalSalary: 14400 },
    { id: 22, billId: 7, name: '王强', title: '技术店长', level: 1, performanceLevel: 'A', baseSalary: 6000, postAllowance: 800, performanceBonus: 1200, overtimeFee: 0, commission: 10600, totalSalary: 18600 },
    { id: 23, billId: 7, name: '李静', title: '中级康复师', level: 1, performanceLevel: 'A', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 240, commission: 6200, totalSalary: 11640 },
    { id: 24, billId: 7, name: '赵敏', title: '初级康复师', level: 1, performanceLevel: 'B', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 100, commission: 6560, totalSalary: 10360 },
    // 越秀店 2026-09（3人）
    { id: 25, billId: 8, name: '陈杰', title: '店长', level: 1, performanceLevel: 'B', baseSalary: 7000, postAllowance: 1000, performanceBonus: 1500, overtimeFee: 0, commission: 8800, totalSalary: 18300 },
    { id: 26, billId: 8, name: '林芳', title: '中级康复师', level: 1, performanceLevel: 'B', baseSalary: 4000, postAllowance: 400, performanceBonus: 800, overtimeFee: 180, commission: 5900, totalSalary: 11280 },
    { id: 27, billId: 8, name: '刘洋', title: '初级康复师', level: 1, performanceLevel: 'C', baseSalary: 3000, postAllowance: 200, performanceBonus: 500, overtimeFee: 80, commission: 5420, totalSalary: 9200 }
]
