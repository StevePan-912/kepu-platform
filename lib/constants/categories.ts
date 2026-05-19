export const RESOURCE_CATEGORIES = {
  astronomy: { label: '天文', icon: '🌟', color: 'blue' },
  paleontology: { label: '古生物', icon: '🦕', color: 'green' },
  botany: { label: '植物', icon: '🌿', color: 'emerald' },
  ecology: { label: '生态', icon: '🔬', color: 'purple' },
  neighborhood: { label: '邻里', icon: '🏘️', color: 'orange' },
}

export const DEVICE_TYPES = {
  audio_station: { label: '科普点播盒', icon: '🔊' },
  screen: { label: '智慧资讯屏', icon: '📺' },
  ar_point: { label: 'AR探境点', icon: '📱' },
  star_corner: { label: '星空角', icon: '🌌' },
}

export const DEVICE_STATUS = {
  online: { label: '在线', color: 'green' },
  offline: { label: '离线', color: 'red' },
  maintenance: { label: '维护中', color: 'yellow' },
}

export const HONOR_LEVELS = {
  explorer: { label: '科普探索者', icon: '🥉', minPoints: 0 },
  communicator: { label: '科普传播者', icon: '🥈', minPoints: 200 },
  leader: { label: '科普领航者', icon: '🥇', minPoints: 500 },
}
