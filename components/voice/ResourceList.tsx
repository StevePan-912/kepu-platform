'use client'

import Link from 'next/link'
import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'
import type { Resource } from '@/lib/supabase/types'

interface ResourceListProps {
  resources: Resource[]
  keyword?: string
}

function highlightKeyword(text: string, keyword?: string) {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-inherit px-0.5 rounded">{part}</mark>
    ) : part
  )
}

export function ResourceList({ resources, keyword }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500">暂无相关科普内容</p>
        <p className="text-sm text-gray-400 mt-1">试试其他关键词吧</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">📚</span>
          <h3 className="font-bold text-gray-900">
            {keyword ? `搜索"${keyword}"的结果` : '为你推荐'}
          </h3>
          <span className="text-sm text-gray-400">({resources.length})</span>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {resources.map((resource) => {
          const categoryInfo = RESOURCE_CATEGORIES[resource.category as keyof typeof RESOURCE_CATEGORIES]
          const typeIcon = {
            audio: '🎧',
            video: '🎬',
            ar_model: '📱',
            text: '📖'
          }[resource.type] || '📄'

          return (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {typeIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {highlightKeyword(resource.title, keyword)}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                    {highlightKeyword(resource.description || '', keyword)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${categoryInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                      {categoryInfo?.icon} {categoryInfo?.label}
                    </span>
                    {resource.duration_seconds && (
                      <span className="text-xs text-gray-400">
                        ⏱️ {Math.ceil(resource.duration_seconds / 60)}分钟
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
