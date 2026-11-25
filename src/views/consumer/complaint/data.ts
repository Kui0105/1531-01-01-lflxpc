/**
 * 投诉反馈演示数据
 * 后续可由后端接口替换
 */

export type ComplaintStatus = 'pending' | 'processing' | 'done'

export interface ComplaintItem {
    id: number
    userId: number
    avatarColor: string
    nickname: string
    mobile: string
    store: string
    therapist: string
    type: string
    content: string
    status: ComplaintStatus
    deducted: boolean
    time: string
}

export const complaints: ComplaintItem[] = [
    {
        id: 1,
        userId: 10001,
        avatarColor: '#4A5DFF',
        nickname: '健康同行者',
        mobile: '13800138001',
        store: '天河店',
        therapist: '张敏',
        type: '服务态度',
        content: '服务过程中康复师态度冷淡，沟通不耐烦。',
        status: 'pending',
        deducted: false,
        time: '2026-11-24 15:32'
    },
    {
        id: 2,
        userId: 10002,
        avatarColor: '#e6a23c',
        nickname: '春风化雨',
        mobile: '13800138002',
        store: '越秀店',
        therapist: '王芳',
        type: '技师专业度',
        content: '理疗手法不专业，服务后症状没有改善。',
        status: 'processing',
        deducted: true,
        time: '2026-11-22 10:18'
    },
    {
        id: 3,
        userId: 10003,
        avatarColor: '#67c23a',
        nickname: '康养达人',
        mobile: '13800138003',
        store: '海珠店',
        therapist: '李强',
        type: '环境卫生',
        content: '服务区域卫生状况较差，器械未及时消毒。',
        status: 'done',
        deducted: true,
        time: '2026-11-18 09:45'
    },
    {
        id: 4,
        userId: 10005,
        avatarColor: '#9b59b6',
        nickname: '阳光正好',
        mobile: '13800138005',
        store: '天河店',
        therapist: '陈杰',
        type: '收费问题',
        content: '实际收费与宣传价格不符，未提前告知。',
        status: 'pending',
        deducted: false,
        time: '2026-11-15 16:20'
    },
    {
        id: 5,
        userId: 10006,
        avatarColor: '#f56c6c',
        nickname: '安然自得',
        mobile: '13800138006',
        store: '越秀店',
        therapist: '赵慧',
        type: '服务态度',
        content: '预约后等待时间过长，无人主动说明。',
        status: 'done',
        deducted: false,
        time: '2026-10-28 14:05'
    },
    {
        id: 6,
        userId: 10004,
        avatarColor: '#409eff',
        nickname: '静待花开',
        mobile: '13800138004',
        store: '海珠店',
        therapist: '刘洋',
        type: '其他',
        content: '对处理结果不满意，希望门店主动联系说明。',
        status: 'processing',
        deducted: false,
        time: '2026-10-12 11:30'
    }
]

export const storeOptions = ['天河店', '越秀店', '海珠店']

export const statusOptions = [
    { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'done' }
]
