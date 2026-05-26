'use client'

import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'

interface ArModel {
  id: string
  title: string
  description: string
  category: keyof typeof RESOURCE_CATEGORIES
  modelUrl: string | null
  thumbnailEmoji: string
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
        ${isActive
          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
          : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* 缩略图区域 */}
        <div
          className={`
            w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0
            ${isActive ? 'bg-blue-100' : 'bg-gray-50'}
          `}
        >
          {model.thumbnailEmoji}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`font-semibold text-sm truncate ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
              {model.title}
            </h3>
            {model.isNew && (
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full shrink-0">新</span>
            )}
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{model.description}</p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryInfo.color}`}>
              {categoryInfo.icon} {categoryInfo.label}
            </span>
            {model.location && (
              <span className="text-xs text-gray-400">📍 {model.location}</span>
            )}
          </div>
        </div>

        {/* 箭头 */}
        <div className={`text-lg shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-300'}`}>
          {isActive ? '▶' : '›'}
        </div>
      </div>
    </button>
  )
}

export type { ArModel }
