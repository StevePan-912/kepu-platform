'use client'

import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'
import { MapPin, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ArModel {
  id: string
  title: string
  description: string
  category: keyof typeof RESOURCE_CATEGORIES
  modelUrl: string | null
  sketchfabId?: string
  ThumbnailIcon: LucideIcon
  location?: string
  isNew?: boolean
  narration?: string
}

interface ArModelCardProps {
  model: ArModel
  isActive: boolean
  onClick: () => void
}

export default function ArModelCard({ model, isActive, onClick }: ArModelCardProps) {
  const categoryInfo = RESOURCE_CATEGORIES[model.category]

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl p-4 transition-all duration-200 border-2
        ${
          isActive
            ? 'border-primary bg-accent shadow-lg'
            : 'border-border bg-background hover:border-primary/30 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          className={`
            w-16 h-16 rounded-xl flex items-center justify-center shrink-0
            ${isActive ? 'bg-primary/10' : 'bg-muted'}
          `}
        >
          <model.ThumbnailIcon
            className={`w-7 h-7 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className={`font-semibold text-sm truncate ${isActive ? 'text-primary' : 'text-foreground'}`}
            >
              {model.title}
            </h3>
            {model.isNew && (
              <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full shrink-0">
                新
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{model.description}</p>
          <div className="flex items-center gap-2">
            {categoryInfo && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent text-foreground">
                <categoryInfo.Icon className="h-3 w-3" />
                {categoryInfo.label}
              </span>
            )}
            {model.location && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {model.location}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </button>
  )
}

export type { ArModel }
