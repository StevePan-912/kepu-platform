'use client'

import { Award } from 'lucide-react'
import { HONOR_LEVELS } from '@/lib/constants/categories'

interface PointsBadgeProps {
  level: 'explorer' | 'communicator' | 'leader' | null
}

export function PointsBadge({ level }: PointsBadgeProps) {
  if (!level) return null

  const config = HONOR_LEVELS[level]

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
      <Award className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{config.label}</span>
    </div>
  )
}
