/**
 * 用户列表 / 用户详情 / 康复档案 演示数据
 * 后续可由后端接口替换
 */

export type UserStatus = 'normal' | 'disabled'

export interface UserItem {
    id: number
    avatarColor: string
    nickname: string
    mobile: string
    level: string
    points: number
    status: UserStatus
    registerTime: string
    realName: string
    gender: string
    birthday: string
    height: number // 身高（cm）
    weight: number // 体重（kg）
    source: string
}

export interface PointRecord {
    time: string
    change: number
    balance: number
    reason: string
    remark: string
}

export interface OrderRecord {
    no: string
    type: '服务订单' | '商品订单'
    name: string
    store: string
    amount: number
    coupon: string
    couponAmount: number
    pointDeduct: string
    pointAmount: number
    discount: string
    discountAmount: number
    paid: number
    status: string
    time: string
}

export interface AppointmentRecord {
    name: string
    store: string
    therapist: string
    date: string
    timeslot: string
    status: string
    submitTime: string
}

export interface ServiceOrder {
    no: string
    name: string
    store: string
    used: number
    remain: number
    status: string
    valid: string
    submitTime: string
}

export interface ArchiveRecord {
    time: string
    type: '评估报告' | '康复纪要' | '康复小结'
    name: string
    content: string
    store: string
    therapist: string
    result: string
}

export interface UserDetailData {
    points: PointRecord[]
    orders: OrderRecord[]
    appointments: AppointmentRecord[]
    serviceOrders: ServiceOrder[]
    archives: ArchiveRecord[]
}

export const users: UserItem[] = [
    { id: 10001, avatarColor: '#4A5DFF', nickname: '健康同行者', mobile: '13800138001', level: '黄金会员', points: 2360, status: 'normal', registerTime: '2026-03-12 09:32', realName: '张敏', gender: '女', birthday: '1988-06-15', height: 162, weight: 54, source: '微信小程序' },
    { id: 10002, avatarColor: '#e6a23c', nickname: '春风化雨', mobile: '13800138002', level: '白银会员', points: 980, status: 'normal', registerTime: '2026-04-08 14:20', realName: '李强', gender: '男', birthday: '1979-11-02', height: 175, weight: 72, source: '官网注册' },
    { id: 10003, avatarColor: '#67c23a', nickname: '康养达人', mobile: '13800138003', level: '铂金会员', points: 5680, status: 'normal', registerTime: '2026-05-21 10:05', realName: '王芳', gender: '女', birthday: '1992-02-28', height: 160, weight: 52, source: '线下门店' },
    { id: 10004, avatarColor: '#409eff', nickname: '静待花开', mobile: '13800138004', level: '普通会员', points: 320, status: 'disabled', registerTime: '2026-06-03 16:48', realName: '陈杰', gender: '男', birthday: '1995-09-10', height: 178, weight: 75, source: '微信小程序' },
    { id: 10005, avatarColor: '#9b59b6', nickname: '阳光正好', mobile: '13800138005', level: '黄金会员', points: 1850, status: 'normal', registerTime: '2026-07-17 11:26', realName: '赵慧', gender: '女', birthday: '1985-04-19', height: 165, weight: 58, source: '朋友推荐' },
    { id: 10006, avatarColor: '#f56c6c', nickname: '安然自得', mobile: '13800138006', level: '白银会员', points: 760, status: 'normal', registerTime: '2026-08-29 15:13', realName: '刘洋', gender: '男', birthday: '1990-12-05', height: 172, weight: 68, source: '官网注册' }
]

const commonPoints: PointRecord[] = [
    { time: '2026-11-24 10:32', change: 200, balance: 2360, reason: '平台充值增加积分', remark: '充值 200 分' },
    { time: '2026-11-20 16:05', change: -150, balance: 2160, reason: '服务订单抵扣扣减积分', remark: '服务订单 SO20261120001' },
    { time: '2026-11-15 09:48', change: 60, balance: 2310, reason: '推广用户下单获得积分', remark: '邀请好友下单' },
    { time: '2026-11-08 14:22', change: -80, balance: 2250, reason: '商品订单抵扣扣减积分', remark: '商品订单 GO20261108002' },
    { time: '2026-11-01 11:10', change: -20, balance: 2330, reason: '平台扣除减少积分', remark: '违规扣除' }
]

const commonOrders: OrderRecord[] = [
    { no: 'SO20261120001', type: '服务订单', name: '全身经络理疗', store: '天河店', amount: 680, coupon: '满500减50', couponAmount: 50, pointDeduct: '150分', pointAmount: 150, discount: '会员9折', discountAmount: 68, paid: 412, status: '已完成', time: '2026-11-20 16:05' },
    { no: 'GO20261108002', type: '商品订单', name: '艾草礼盒', store: '越秀店', amount: 268, coupon: '无', couponAmount: 0, pointDeduct: '80分', pointAmount: 80, discount: '会员95折', discountAmount: 13.4, paid: 174.6, status: '已完成', time: '2026-11-08 14:22' },
    { no: 'SO20261125003', type: '服务订单', name: '康复评估服务', store: '海珠店', amount: 380, coupon: '无', couponAmount: 0, pointDeduct: '无', pointAmount: 0, discount: '无', discountAmount: 0, paid: 380, status: '待服务', time: '2026-11-25 09:40' }
]

const commonAppointments: AppointmentRecord[] = [
    { name: '全身经络理疗', store: '天河店', therapist: '张敏', date: '2026-11-20', timeslot: '14:00-15:00', status: '已完成', submitTime: '2026-11-18 10:12' },
    { name: '康复评估服务', store: '海珠店', therapist: '李强', date: '2026-11-26', timeslot: '10:00-11:00', status: '待服务', submitTime: '2026-11-25 09:40' },
    { name: '肩颈舒缓护理', store: '越秀店', therapist: '王芳', date: '2026-11-12', timeslot: '16:00-17:00', status: '已取消', submitTime: '2026-11-10 15:30' }
]

const commonServiceOrders: ServiceOrder[] = [
    { no: 'SO20261120001', name: '全身经络理疗（5次卡）', store: '天河店', used: 2, remain: 3, status: '服务中', valid: '2026-12-31', submitTime: '2026-11-20 16:05' },
    { no: 'SO20261125003', name: '康复评估服务', store: '海珠店', used: 0, remain: 1, status: '待核销', valid: '2026-12-25', submitTime: '2026-11-25 09:40' }
]

const commonArchives: ArchiveRecord[] = [
    {
        time: '2026-11-25 10:30',
        type: '评估报告',
        name: '康复评估报告',
        content: '完成肩颈功能评估，活动度较上月提升 15%。',
        store: '海珠店',
        therapist: '李强',
        result: '评估结论：颈椎活动度良好，肩部肌力较前期改善明显。建议继续每周 2 次康复训练，配合居家拉伸。评估得分：92 分（优秀）。'
    },
    {
        time: '2026-11-20 17:20',
        type: '康复小结',
        name: '全身经络理疗小结',
        content: '本次服务完成经络疏通与穴位按压，顾客反馈舒适。',
        store: '天河店',
        therapist: '张敏',
        result: '本次服务小结：肩颈僵硬症状有所缓解，建议保持规律作息，避免长时间低头。下次服务重点：背部膀胱经疏通。'
    },
    {
        time: '2026-11-12 15:40',
        type: '康复纪要',
        name: '康复服务纪要',
        content: '康复师记录本次服务过程与顾客反馈。',
        store: '越秀店',
        therapist: '王芳',
        result: '康复纪要：顾客主诉腰部酸胀，服务后疼痛评分由 6 分降至 3 分，局部活动度改善。已安排后续三次跟进服务。'
    },
    {
        time: '2026-10-28 11:15',
        type: '评估报告',
        name: '体态评估报告',
        content: '完成体态与脊柱评估，存在轻微骨盆前倾。',
        store: '天河店',
        therapist: '李强',
        result: '评估结论：轻度骨盆前倾，建议加强核心肌群训练，避免久坐。评估得分：85 分（良好）。'
    }
]

export const detailData: Record<number, UserDetailData> = {
    10001: { points: commonPoints, orders: commonOrders, appointments: commonAppointments, serviceOrders: commonServiceOrders, archives: commonArchives },
    10002: { points: commonPoints.slice(0, 3), orders: commonOrders.slice(0, 2), appointments: commonAppointments, serviceOrders: commonServiceOrders.slice(0, 1), archives: commonArchives.slice(1) },
    10003: { points: commonPoints, orders: commonOrders, appointments: commonAppointments.slice(0, 2), serviceOrders: commonServiceOrders, archives: commonArchives },
    10004: { points: commonPoints.slice(2), orders: commonOrders.slice(1), appointments: [], serviceOrders: [], archives: [] },
    10005: { points: commonPoints.slice(0, 4), orders: commonOrders, appointments: commonAppointments, serviceOrders: commonServiceOrders, archives: commonArchives.slice(0, 3) },
    10006: { points: commonPoints.slice(1, 4), orders: commonOrders.slice(0, 2), appointments: commonAppointments.slice(1), serviceOrders: commonServiceOrders.slice(1), archives: commonArchives.slice(2) }
}
