/**
 * 提现记录演示数据
 * 后续可由后端接口替换
 */

export type WithdrawStatus = 'pending' | 'approved' | 'paid' | 'rejected'
// 待审核 / 待打款 / 已打款 / 已拒绝

export const withdrawStatusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '待打款', value: 'approved' },
    { label: '已打款', value: 'paid' },
    { label: '已拒绝', value: 'rejected' }
]

export interface WithdrawRecord {
    id: number
    serialNo: string // 提现单号
    nickname: string // 用户昵称
    phone: string // 手机号
    amount: number // 提现金额
    fee: number // 手续费
    actualAmount: number // 到账金额
    bank: string // 开户银行
    bankName: string // 开户姓名
    bankAccount: string // 银行账号
    applyTime: string // 申请时间
    status: WithdrawStatus // 状态
    rejectReason: string // 拒绝原因
    voucher?: string // 打款凭证（data URI）
}

export const withdrawList: WithdrawRecord[] = [
    {
        id: 1,
        serialNo: 'TX202611270001',
        nickname: '赵一鸣',
        phone: '13866886688',
        amount: 500,
        fee: 0,
        actualAmount: 500,
        bank: '中国工商银行',
        bankName: '赵一鸣',
        bankAccount: '6222023602012345678',
        applyTime: '2026-11-27 09:15',
        status: 'pending',
        rejectReason: ''
    },
    {
        id: 2,
        serialNo: 'TX202611260002',
        nickname: '孙晓丽',
        phone: '13912341234',
        amount: 1000,
        fee: 10,
        actualAmount: 990,
        bank: '中国建设银行',
        bankName: '孙晓丽',
        bankAccount: '6227003325012345679',
        applyTime: '2026-11-26 16:40',
        status: 'approved',
        rejectReason: ''
    },
    {
        id: 3,
        serialNo: 'TX202611260003',
        nickname: '周建国',
        phone: '13755665566',
        amount: 300,
        fee: 0,
        actualAmount: 300,
        bank: '中国农业银行',
        bankName: '周建国',
        bankAccount: '6228480018012345680',
        applyTime: '2026-11-26 14:20',
        status: 'paid',
        rejectReason: '',
        voucher: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27360%27%3E%3Crect width=%27600%27 height=%27360%27 fill=%27%23f5f7fa%27/%3E%3Crect x=%2720%27 y=%2720%27 width=%27560%27 height=%27320%27 fill=%27white%27 stroke=%27%23dcdfe6%27/%3E%3Ctext x=%27300%27 y=%27150%27 font-size=%2728%27 text-anchor=%27middle%27 fill=%27%23303333%27%3E%E6%89%93%E6%AC%BE%E5%87%AD%E8%AF%81%3C/text%3E%3Ctext x=%27300%27 y=%27200%27 font-size=%2716%27 text-anchor=%27middle%27 fill=%27%23606266%27%3E%E7%A4%BA%E4%BE%8B%E5%87%AD%E8%AF%81%E5%9B%BE%3C/text%3E%3C/svg%3E'
    },
    {
        id: 4,
        serialNo: 'TX202611250004',
        nickname: '吴雨桐',
        phone: '13688998899',
        amount: 2000,
        fee: 20,
        actualAmount: 1980,
        bank: '中国银行',
        bankName: '吴雨桐',
        bankAccount: '6216600100012345681',
        applyTime: '2026-11-25 11:05',
        status: 'paid',
        rejectReason: '',
        voucher: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27360%27%3E%3Crect width=%27600%27 height=%27360%27 fill=%27%23f5f7fa%27/%3E%3Crect x=%2720%27 y=%2720%27 width=%27560%27 height=%27320%27 fill=%27white%27 stroke=%27%23dcdfe6%27/%3E%3Ctext x=%27300%27 y=%27150%27 font-size=%2728%27 text-anchor=%27middle%27 fill=%27%23303333%27%3E%E6%89%93%E6%AC%BE%E5%87%AD%E8%AF%81%3C/text%3E%3Ctext x=%27300%27 y=%27200%27 font-size=%2716%27 text-anchor=%27middle%27 fill=%27%23606266%27%3E%E7%A4%BA%E4%BE%8B%E5%87%AD%E8%AF%81%E5%9B%BE%3C/text%3E%3C/svg%3E'
    },
    {
        id: 5,
        serialNo: 'TX202611240005',
        nickname: '郑浩',
        phone: '13543214321',
        amount: 800,
        fee: 8,
        actualAmount: 792,
        bank: '招商银行',
        bankName: '郑浩',
        bankAccount: '6225880212012345682',
        applyTime: '2026-11-24 10:30',
        status: 'rejected',
        rejectReason: '银行账号信息有误，请核对后重新提交'
    },
    {
        id: 6,
        serialNo: 'TX202611230006',
        nickname: '黄敏',
        phone: '13420882088',
        amount: 600,
        fee: 0,
        actualAmount: 600,
        bank: '中国工商银行',
        bankName: '黄敏',
        bankAccount: '6222023602012345683',
        applyTime: '2026-11-23 15:50',
        status: 'pending',
        rejectReason: ''
    },
    {
        id: 7,
        serialNo: 'TX202611220007',
        nickname: '赵一鸣',
        phone: '13866886688',
        amount: 1500,
        fee: 15,
        actualAmount: 1485,
        bank: '中国建设银行',
        bankName: '赵一鸣',
        bankAccount: '6227003325012345684',
        applyTime: '2026-11-22 09:40',
        status: 'paid',
        rejectReason: '',
        voucher: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27360%27%3E%3Crect width=%27600%27 height=%27360%27 fill=%27%23f5f7fa%27/%3E%3Crect x=%2720%27 y=%2720%27 width=%27560%27 height=%27320%27 fill=%27white%27 stroke=%27%23dcdfe6%27/%3E%3Ctext x=%27300%27 y=%27150%27 font-size=%2728%27 text-anchor=%27middle%27 fill=%27%23303333%27%3E%E6%89%93%E6%AC%BE%E5%87%AD%E8%AF%81%3C/text%3E%3Ctext x=%27300%27 y=%27200%27 font-size=%2716%27 text-anchor=%27middle%27 fill=%27%23606266%27%3E%E7%A4%BA%E4%BE%8B%E5%87%AD%E8%AF%81%E5%9B%BE%3C/text%3E%3C/svg%3E'
    },
    {
        id: 8,
        serialNo: 'TX202611210008',
        nickname: '孙晓丽',
        phone: '13912341234',
        amount: 450,
        fee: 0,
        actualAmount: 450,
        bank: '中国农业银行',
        bankName: '孙晓丽',
        bankAccount: '6228480018012345685',
        applyTime: '2026-11-21 17:25',
        status: 'approved',
        rejectReason: ''
    }
]
