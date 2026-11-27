/**
 * 营养评估题目配置演示数据
 * 后续可由后端接口替换
 */

export type FieldType = 'radio' | 'checkbox' | 'text' // 单选 / 多选 / 填写
export type QuestionStatus = 'on' | 'off' // 启用 / 停用

// 选项（可启用补充说明）
export interface QuestionOption {
    id: number
    label: string // 选项文本
    withRemark: boolean // 是否需要补充说明
    remarkTip: string // 补充说明提示
}

// 题组（如 神经系统-心理状况），组内题目按 1-5 分评分
export interface QuestionGroup {
    id: number
    name: string // 题组名称
    category: string // 分类（如 神经系统）
    description: string // 说明
    scoreMin: number // 最低分（默认1）
    scoreMax: number // 最高分（默认5）
}

// 题目
export interface QuestionItem {
    id: number
    fieldName: string // 字段名称
    fieldType: FieldType // 字段类型
    groupId?: number // 所属题组（不填表示独立题）
    options: QuestionOption[] // 选择项（单选/多选）
    useScore: boolean // 是否按分值评分（题组内题目用）
    required: boolean // 是否必填
    remark: string // 备注
    sort: number // 排序
    status: QuestionStatus // 状态
}

export const fieldTypeLabels: Record<FieldType, string> = {
    radio: '单选',
    checkbox: '多选',
    text: '填写'
}

// 题组数据
export const questionGroups: QuestionGroup[] = [
    { id: 1, name: '心理状况', category: '神经系统', description: '评估心理状态相关题目，按 1-5 分评分', scoreMin: 1, scoreMax: 5 },
    { id: 2, name: '睡眠质量', category: '神经系统', description: '评估睡眠情况相关题目，按 1-5 分评分', scoreMin: 1, scoreMax: 5 },
    { id: 3, name: '消化吸收', category: '消化系统', description: '评估消化吸收能力相关题目，按 1-5 分评分', scoreMin: 1, scoreMax: 5 }
]

// 题目数据
export const questionList: QuestionItem[] = [
    {
        id: 1, fieldName: '您的性别', fieldType: 'radio', groupId: undefined,
        options: [
            { id: 1, label: '男', withRemark: false, remarkTip: '' },
            { id: 2, label: '女', withRemark: false, remarkTip: '' }
        ],
        useScore: false, required: true, remark: '基础信息', sort: 10, status: 'on'
    },
    {
        id: 2, fieldName: '您的年龄', fieldType: 'text', groupId: undefined,
        options: [], useScore: false, required: true, remark: '填写数字', sort: 20, status: 'on'
    },
    {
        id: 3, fieldName: '是否存在食物过敏', fieldType: 'checkbox', groupId: undefined,
        options: [
            { id: 1, label: '海鲜', withRemark: true, remarkTip: '请说明过敏食物' },
            { id: 2, label: '坚果', withRemark: true, remarkTip: '请说明过敏食物' },
            { id: 3, label: '乳制品', withRemark: false, remarkTip: '' },
            { id: 4, label: '无', withRemark: false, remarkTip: '' }
        ],
        useScore: false, required: true, remark: '可多选', sort: 30, status: 'on'
    },
    {
        id: 4, fieldName: '近期是否感到焦虑或紧张', fieldType: 'radio', groupId: 1,
        options: [], useScore: true, required: true, remark: '神经系统-心理状况，按1-5分', sort: 40, status: 'on'
    },
    {
        id: 5, fieldName: '是否容易情绪低落', fieldType: 'radio', groupId: 1,
        options: [], useScore: true, required: true, remark: '神经系统-心理状况，按1-5分', sort: 50, status: 'on'
    },
    {
        id: 6, fieldName: '注意力是否容易分散', fieldType: 'radio', groupId: 1,
        options: [], useScore: true, required: false, remark: '神经系统-心理状况，按1-5分', sort: 60, status: 'on'
    },
    {
        id: 7, fieldName: '入睡是否困难', fieldType: 'radio', groupId: 2,
        options: [], useScore: true, required: true, remark: '神经系统-睡眠质量，按1-5分', sort: 70, status: 'on'
    },
    {
        id: 8, fieldName: '夜间是否易醒', fieldType: 'radio', groupId: 2,
        options: [], useScore: true, required: false, remark: '神经系统-睡眠质量，按1-5分', sort: 80, status: 'off'
    },
    {
        id: 9, fieldName: '餐后是否腹胀', fieldType: 'radio', groupId: 3,
        options: [], useScore: true, required: true, remark: '消化系统-消化吸收，按1-5分', sort: 90, status: 'on'
    }
]
