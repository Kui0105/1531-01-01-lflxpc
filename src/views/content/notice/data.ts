/**
 * 平台公告演示数据
 * 后续可由后端接口替换
 */

export interface NoticeItem {
    id: number
    title: string // 公告标题
    summary: string // 公告简介
    content: string // 富文本内容
    publishedAt: string // 发布时间
}

export const noticeList: NoticeItem[] = [
    {
        id: 1,
        title: '平台服务升级公告',
        summary: '为进一步优化用户体验，平台将于本周日凌晨进行系统升级维护。',
        content: '<p>尊敬的用户：</p><p>为进一步优化用户体验，平台将于本周日 00:00-06:00 进行系统升级维护，期间部分功能可能短暂不可用。给您带来的不便敬请谅解，感谢您的支持！</p>',
        publishedAt: '2026-11-24 10:00'
    },
    {
        id: 2,
        title: '关于新用户注册送好礼活动的通知',
        summary: '新用户注册即送专属礼包，数量有限，先到先得。',
        content: '<p>活动期间，新用户完成注册即可领取专属新客礼包，包含多张服务体验券。数量有限，先到先得！</p>',
        publishedAt: '2026-11-20 09:30'
    },
    {
        id: 3,
        title: '门店营业时间调整说明',
        summary: '部分门店营业时间调整，请用户预约前留意公告。',
        content: '<p>因门店运营需要，部分门店营业时间有所调整，具体以各门店页面展示为准。请用户预约前留意相关公告。</p>',
        publishedAt: '2026-11-15 16:20'
    }
]
