/**
 * 预约列表演示数据
 * 后续可由后端接口替换
 */

export type AppointmentStatus = 'pending' | 'serving' | 'done' | 'canceled'

export interface OperationLog {
    time: string
    operator: string
    action: string
}

export interface AppointmentItem {
    id: number
    no: string
    avatarColor: string
    nickname: string
    realName: string
    mobile: string
    store: string
    therapist: string
    therapistTitle: string
    service: string
    serviceTitle: 'all' | 'chief'
    date: string
    timeslot: string
    source: string
    status: AppointmentStatus
    submitTime: string
    orderNo: string
    logs: OperationLog[]
}

export interface TherapistOption {
    name: string
    title: string
}

export const statusTabs = [
    { label: '全部', value: '' },
    { label: '待到店', value: 'pending' },
    { label: '服务中', value: 'serving' },
    { label: '已完成', value: 'done' },
    { label: '已取消', value: 'canceled' }
] as const

export const statusLabels: Record<AppointmentStatus, string> = {
    pending: '待到店',
    serving: '服务中',
    done: '已完成',
    canceled: '已取消'
}

export const statusTagTypes: Record<AppointmentStatus, 'warning' | 'primary' | 'success' | 'info'> = {
    pending: 'warning',
    serving: 'primary',
    done: 'success',
    canceled: 'info'
}

export const storeOptions = ['天河店', '越秀店', '海珠店']

export const therapists: TherapistOption[] = [
    { name: '张敏', title: '首席康复师' },
    { name: '李强', title: '首席康复师' },
    { name: '王芳', title: '康复师' },
    { name: '陈杰', title: '康复师' },
    { name: '赵慧', title: '康复师' }
]

export const appointments: AppointmentItem[] = [
    {
        id: 1,
        no: 'YY202611250001',
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        realName: '陈健康',
        mobile: '13800138001',
        store: '天河店',
        therapist: '张敏',
        therapistTitle: '首席康复师',
        service: '康复评估服务',
        serviceTitle: 'chief',
        date: '2026-11-26',
        timeslot: '10:00',
        source: '微信小程序',
        status: 'pending',
        submitTime: '2026-11-25 09:40',
        orderNo: 'SO20261125003',
        logs: [
            { time: '2026-11-25 09:40', operator: '用户', action: '提交预约' },
            { time: '2026-11-25 10:05', operator: '系统', action: '预约时段锁定成功' }
        ]
    },
    {
        id: 2,
        no: 'YY202611250002',
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        realName: '李春雨',
        mobile: '13800138002',
        store: '越秀店',
        therapist: '王芳',
        therapistTitle: '康复师',
        service: '全身经络理疗',
        serviceTitle: 'all',
        date: '2026-11-25',
        timeslot: '15:00',
        source: '官网',
        status: 'serving',
        submitTime: '2026-11-24 16:20',
        orderNo: 'SO20261124001',
        logs: [
            { time: '2026-11-24 16:20', operator: '用户', action: '提交预约' },
            { time: '2026-11-25 14:58', operator: '店长/刘敏', action: '用户到店，开始服务' }
        ]
    },
    {
        id: 3,
        no: 'YY202611230003',
        avatarColor: '#67c23a',
        nickname: '康养达人',
        realName: '王康',
        mobile: '13800138003',
        store: '海珠店',
        therapist: '李强',
        therapistTitle: '首席康复师',
        service: '肩颈康复评估',
        serviceTitle: 'chief',
        date: '2026-11-23',
        timeslot: '14:00',
        source: '线下门店',
        status: 'done',
        submitTime: '2026-11-22 11:10',
        orderNo: 'SO20261122002',
        logs: [
            { time: '2026-11-22 11:10', operator: '用户', action: '提交预约' },
            { time: '2026-11-23 14:35', operator: '康复师/李强', action: '服务完成' }
        ]
    },
    {
        id: 4,
        no: 'YY202611220004',
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        realName: '刘养正',
        mobile: '13800138005',
        store: '天河店',
        therapist: '陈杰',
        therapistTitle: '康复师',
        service: '腰部舒缓护理',
        serviceTitle: 'all',
        date: '2026-11-22',
        timeslot: '11:00',
        source: '朋友推荐',
        status: 'canceled',
        submitTime: '2026-11-21 10:05',
        orderNo: 'SO20261121004',
        logs: [
            { time: '2026-11-21 10:05', operator: '用户', action: '提交预约' },
            { time: '2026-11-21 15:20', operator: '用户', action: '取消预约' }
        ]
    },
    {
        id: 5,
        no: 'YY202611260005',
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        realName: '赵安泰',
        mobile: '13800138006',
        store: '越秀店',
        therapist: '赵慧',
        therapistTitle: '康复师',
        service: '体态评估',
        serviceTitle: 'all',
        date: '2026-11-26',
        timeslot: '16:30',
        source: '微信小程序',
        status: 'pending',
        submitTime: '2026-11-25 11:32',
        orderNo: 'SO20261125005',
        logs: [
            { time: '2026-11-25 11:32', operator: '用户', action: '提交预约' },
            { time: '2026-11-25 11:33', operator: '系统', action: '预约时段锁定成功' }
        ]
    },
    {
        id: 6,
        no: 'YY202611250006',
        avatarColor: '#409eff',
        nickname: '静待花开',
        realName: '孙调理',
        mobile: '13800138004',
        store: '海珠店',
        therapist: '王芳',
        therapistTitle: '康复师',
        service: '全身经络理疗',
        serviceTitle: 'all',
        date: '2026-11-25',
        timeslot: '18:00',
        source: '官网',
        status: 'pending',
        submitTime: '2026-11-25 08:15',
        orderNo: 'SO20261125006',
        logs: [{ time: '2026-11-25 08:15', operator: '用户', action: '提交预约' }]
    }
]
