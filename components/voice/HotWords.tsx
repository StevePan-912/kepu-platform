'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import type { HotWord } from '@/lib/supabase/types'

interface HotWordsProps {
  hotWords: HotWord[]
  onWordClick: (word: string) => void
}

export function HotWords({ hotWords, onWordClick }: HotWordsProps) {
  const { setSearchKeyword } = useAppStore()

  const handleClick = (word: string) => {
    setSearchKeyword(word)
    onWordClick(word)
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔥</span>
        <h3 className="font-bold text-gray-900">热门搜索</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {hotWords.slice(0, 12).map((item, index) => (
          <Link
            key={item.id}
            href={`/voice?search=${encodeURIComponent(item.word)}`}
            onClick={() => handleClick(item.word)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <span className={`font-bold ${
              index === 0 ? 'text-red-500' :
              index === 1 ? 'text-orange-500' :
              index === 2 ? 'text-yellow-500' :
              'text-gray-400'
            }`}>
              {index + 1}
            </span>
            <span>{item.word}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
