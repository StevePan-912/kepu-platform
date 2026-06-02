import {
  Sparkles,
  Dna,
  Leaf,
  Microscope,
  Building2,
  Headphones,
  Monitor,
  Smartphone,
  Star,
  Medal,
  Award,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const RESOURCE_CATEGORIES: Record<
  string,
  { label: string; Icon: LucideIcon; color: string }
> = {
  astronomy: { label: '天文', Icon: Sparkles, color: 'info' },
  paleontology: { label: '古生物', Icon: Dna, color: 'success' },
  botany: { label: '植物', Icon: Leaf, color: 'success' },
  ecology: { label: '生态', Icon: Microscope, color: 'chart-4' },
  neighborhood: { label: '邻里', Icon: Building2, color: 'chart-3' },
}

export const DEVICE_TYPES: Record<
  string,
  { label: string; Icon: LucideIcon }
> = {
  audio_station: { label: '科普点播盒', Icon: Headphones },
  screen: { label: '智慧资讯屏', Icon: Monitor },
  ar_point: { label: 'AR探境点', Icon: Smartphone },
  star_corner: { label: '星空角', Icon: Star },
}

export const DEVICE_STATUS: Record<
  string,
  { label: string; color: string }
> = {
  online: { label: '在线', color: 'success' },
  offline: { label: '离线', color: 'destructive' },
  maintenance: { label: '维护中', color: 'warning' },
}

export const HONOR_LEVELS: Record<
  string,
  { label: string; Icon: LucideIcon; minPoints: number }
> = {
  explorer: { label: '科普探索者', Icon: Medal, minPoints: 0 },
  communicator: { label: '科普传播者', Icon: Award, minPoints: 200 },
  leader: { label: '科普领航者', Icon: Trophy, minPoints: 500 },
}
