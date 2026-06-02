'use client'

import Link from 'next/link'
import { Play, Video, FileText, Smartphone } from 'lucide-react'
import type { Resource } from '@/lib/supabase/types'
import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'

interface ContentListProps {
  resources: Resource[]
  loading: boolean
}

export function ContentList({ resources, loading }: ContentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">暂无相关内容</p>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Play className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'ar_model': return <Smartphone className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => {
        const categoryConfig = RESOURCE_CATEGORIES[resource.category ?? '']

        return (
          <Link
            key={resource.id}
            href={`/resources/${resource.id}`}
            className="block bg-card rounded-xl p-4 ring-1 ring-border hover:ring-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                {getTypeIcon(resource.type ?? 'text')}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 truncate">{resource.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  {categoryConfig && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <categoryConfig.Icon className="w-3 h-3" />
                      {categoryConfig.label}
                    </span>
                  )}
                  {resource.duration && (
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(resource.duration / 60)}分钟
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
