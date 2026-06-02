'use client'

import Link from 'next/link'
import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'
import type { Resource } from '@/lib/supabase/types'
import { BookOpen, Search, Headphones, Video, Smartphone, FileText, File, Clock, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ResourceListProps {
  resources: Resource[]
  keyword?: string
}

function highlightKeyword(text: string, keyword?: string) {
  if (!keyword) return text
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-accent text-inherit px-0.5 rounded">{part}</mark>
    ) : part
  )
}

const typeIcons: Record<string, LucideIcon> = {
  audio: Headphones,
  video: Video,
  ar_model: Smartphone,
  text: FileText,
}
const DefaultIcon = File

export function ResourceList({ resources, keyword }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="bg-background rounded-xl p-8 text-center shadow-sm border border-border">
        <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">暂无相关科普内容</p>
        <p className="text-sm text-muted-foreground mt-1">试试其他关键词吧</p>
      </div>
    )
  }

  return (
    <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-foreground" />
          <h3 className="font-bold text-foreground">
            {keyword ? `搜索"${keyword}"的结果` : '为你推荐'}
          </h3>
          <span className="text-sm text-muted-foreground">({resources.length})</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {resources.map((resource) => {
          const categoryInfo = RESOURCE_CATEGORIES[resource.category as keyof typeof RESOURCE_CATEGORIES]
          const TypeIcon = (resource.type ? typeIcons[resource.type] : null) ?? DefaultIcon

          return (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="block px-4 py-3 hover:bg-muted transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <TypeIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {highlightKeyword(resource.title, keyword)}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {highlightKeyword(resource.description || '', keyword)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-accent text-foreground">
                      {categoryInfo?.Icon && <categoryInfo.Icon className="h-3 w-3" />}
                      {categoryInfo?.label}
                    </span>
                    {resource.duration && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {Math.ceil(resource.duration / 60)}分钟
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
