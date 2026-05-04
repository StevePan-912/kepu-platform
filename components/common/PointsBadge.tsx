import { HONOR_LEVELS } from '@/lib/constants/categories'

interface PointsBadgeProps {
  level: 'explorer' | 'communicator' | 'leader' | null
}

export function PointsBadge({ level }: PointsBadgeProps) {
  if (!level) return null

  const config = HONOR_LEVELS[level]

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
      <span className="text-lg">{config.icon}</span>
      <span className="text-sm font-medium text-gray-700">{config.label}</span>
    </div>
  )
}