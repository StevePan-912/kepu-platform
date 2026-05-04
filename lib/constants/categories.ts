export const RESOURCE_CATEGORIES = {
  astronomy: { label: '天文', icon: '🌟', color: 'bg-blue-100 text-blue-700' },
  paleontology: { label: '古生物', icon: '🦕', color: 'bg-green-100 text-green-700' },
  botany: { label: '植物', icon: '🌿', color: 'bg-emerald-100 text-emerald-700' },
  ecology: { label: '生态', icon: '🔬', color: 'bg-purple-100 text-purple-700' },
  neighborhood: { label: '邻里', icon: '🏘️', color: 'bg-orange-100 text-orange-700' },
} as const

export const DEVICE_TYPES = {
  audio_station: { label: '科普点播盒', icon: '🔊' },
  screen: { label: '智慧资讯屏', icon: '📺' },
  ar_point: { label: 'AR探境点', icon: '📱' },
  star_corner: { label: '星空角', icon: '🌌' },
} as const

export const DEVICE_STATUS = {
  online: { label: '在线', color: 'bg-green-500' },
  offline: { label: '离线', color: 'bg-red-500' },
  maintenance: { label: '维护中', color: 'bg-yellow-500' },
} as const

export const HONOR_LEVELS = {
  explorer: { label: '科普探索者', icon: '🥉', minPoints: 0 },
  communicator: { label: '科普传播者', icon: '🥈', minPoints: 200 },
  leader: { label: '科普领航者', icon: '🥇', minPoints: 500 },
} as const