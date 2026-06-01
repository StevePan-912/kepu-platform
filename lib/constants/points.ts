export const POINT_RULES = {
  play_audio: { points: 10, label: '播放科普音频' },
  scan_ar: { points: 20, label: 'AR扫码互动' },
  search: { points: 5, label: '搜索科普内容' },
  feedback: { points: 15, label: '提交反馈意见' },
  join_activity: { points: 30, label: '报名线下活动' },
  content_submit: { points: 50, label: '内容投稿奖励' },
  volunteer_hour: { points: 20, label: '志愿服务（每小时）' },
} as const

export function calculateHonorLevel(points: number): 'explorer' | 'communicator' | 'leader' {
  if (points >= 500) return 'leader'
  if (points >= 200) return 'communicator'
  return 'explorer'
}
