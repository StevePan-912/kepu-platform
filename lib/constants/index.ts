// 资源分类
export const RESOURCE_CATEGORIES = {
  astronomy: '天文学',
  paleontology: '古生物学',
  botany: '植物学',
  ecology: '生态学',
  community: '社区科普',
} as const

// 资源类型
export const RESOURCE_TYPES = {
  audio: '音频',
  video: '视频',
  ar_model: 'AR模型',
  text: '图文',
} as const

// 设备类型
export const DEVICE_TYPES = {
  audio_station: '音频科普站',
  screen: '科普展示屏',
  ar_point: 'AR探索点',
  starlight_corner: '星空角',
} as const

// 设备状态
export const DEVICE_STATUS = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
} as const

// 用户角色
export const USER_ROLES = {
  resident: '居民',
  admin: '管理员',
  volunteer: '志愿者',
} as const

// 荣誉等级
export const HONOR_LEVELS = {
  explorer: '探索者',
  communicator: '传播者',
  leader: '领航者',
} as const

// 荣誉等级升级所需积分
export const HONOR_THRESHOLDS = {
  explorer: 0,
  communicator: 500,
  leader: 2000,
} as const

// 热词统计周期
export const HOT_WORD_PERIODS = {
  daily: '今日',
  weekly: '本周',
  monthly: '本月',
} as const

// 兑换状态
export const EXCHANGE_STATUS = {
  pending: '待处理',
  completed: '已完成',
  cancelled: '已取消',
} as const

// 志愿任务状态
export const VOLUNTEER_TASK_STATUS = {
  open: '报名中',
  in_progress: '进行中',
  completed: '已完成',
} as const

// API 统一响应码
export const API_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const
