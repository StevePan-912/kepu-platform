'use client'

import Link from 'next/link'
import { Play, Video, FileText } from 'lucide-react'
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
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">暂无相关内容</p>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Play className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'ar_model': return <span className="text-lg">📱</span>
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => {
        const categoryConfig = (RESOURCE_CATEGORIES as Record<string, { label: string; icon: string; color: string }>)[resource.category ?? '']

        return (
          <Link
            key={resource.id}
            href={`/resources/${resource.id}`}
            className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 ${categoryConfig.color} rounded-lg flex items-center justify-center`}>
                {getTypeIcon(resource.type ?? 'text')}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{resource.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{resource.source}</span>
                  {resource.duration && (
                    <span className="text-xs text-gray-400">
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