'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { VoiceSearch, HotWords, ResourceList } from '@/components/voice'
import { getHotWords, getResources } from '@/lib/supabase/queries'
import type { HotWord, Resource } from '@/lib/supabase/types'

// Mock数据用于降级
const MOCK_HOT_WORDS: HotWord[] = [
  { id: '1', word: '黑洞', count: 1256, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '2', word: '恐龙', count: 1089, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '3', word: '火星', count: 987, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '4', word: '星座', count: 856, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '5', word: '望远镜', count: 743, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '6', word: '太阳系', count: 698, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '7', word: '植物', count: 654, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '8', word: '社区', count: 621, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '9', word: '星空', count: 589, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '10', word: '化石', count: 543, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '11', word: '极光', count: 512, period: 'weekly', updated_at: new Date().toISOString() },
  { id: '12', word: '生态', count: 487, period: 'weekly', updated_at: new Date().toISOString() },
]

const MOCK_RESOURCES: Resource[] = [
  {
    id: 'mock-1',
    title: '黑洞的秘密',
    category: 'astronomy',
    type: 'audio',
    content_url: null,
    duration_seconds: 300,
    description: '探索宇宙中最神秘的天体——黑洞的奥秘，了解黑洞是如何形成的，以及它如何影响周围的时空。',
    source_provider: '科普漫步',
    tags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: '恐龙的灭绝之谜',
    category: 'paleontology',
    type: 'video',
    content_url: null,
    duration_seconds: 600,
    description: '6500万年前，恐龙从地球上消失了。让我们一起探索可能导致恐龙灭绝的各种假说。',
    source_provider: '科普漫步',
    tags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: '火星：地球的红色邻居',
    category: 'astronomy',
    type: 'audio',
    content_url: null,
    duration_seconds: 420,
    description: '火星为什么是红色的？人类有机会移居火星吗？本期节目带你了解火星的奥秘。',
    source_provider: '科普漫步',
    tags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    title: '植物的光合作用',
    category: 'botany',
    type: 'text',
    content_url: null,
    duration_seconds: null,
    description: '植物是如何利用阳光、二氧化碳和水制造食物的？让我们深入了解光合作用的神奇过程。',
    source_provider: '科普漫步',
    tags: [],
    created_at: new Date().toISOString(),
  },
]

// 内部组件使用 useSearchParams
function VoiceContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [hotWords, setHotWords] = useState<HotWord[]>(MOCK_HOT_WORDS)
  const [resources, setResources] = useState<Resource[]>([])
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSearch, setCurrentSearch] = useState(initialSearch)

  // 加载热词
  useEffect(() => {
    async function loadHotWords() {
      try {
        const { data } = await getHotWords('weekly', 12)
        if (data && data.length > 0) {
          setHotWords(data)
        }
      } catch (error) {
        console.error('Failed to load hot words:', error)
      }
    }
    loadHotWords()
  }, [])

  // 加载推荐资源
  useEffect(() => {
    async function loadRecommended() {
      setIsLoading(true)
      try {
        const { data } = await getResources()
        if (data && data.length > 0) {
          setRecommendedResources(data.slice(0, 6))
        } else {
          setRecommendedResources(MOCK_RESOURCES)
        }
      } catch (error) {
        console.error('Failed to load resources:', error)
        setRecommendedResources(MOCK_RESOURCES)
      } finally {
        setIsLoading(false)
      }
    }
    loadRecommended()
  }, [])

  // 搜索处理
  const handleSearch = useCallback(async (keyword: string) => {
    setCurrentSearch(keyword)
    if (!keyword.trim()) {
      setResources([])
      return
    }

    setIsLoading(true)
    try {
      const { data } = await getResources()
      if (data && data.length > 0) {
        const filtered = data.filter(
          (r) =>
            r.title.includes(keyword) ||
            r.description?.includes(keyword) ||
            (r.tags as string[])?.some((t) => t.includes(keyword))
        )
        setResources(filtered.length > 0 ? filtered : MOCK_RESOURCES.filter(
          (r) =>
            r.title.includes(keyword) ||
            r.description?.includes(keyword)
        ))
      } else {
        setResources(
          MOCK_RESOURCES.filter(
            (r) =>
              r.title.includes(keyword) ||
              r.description?.includes(keyword)
          )
        )
      }
    } catch (error) {
      console.error('Search error:', error)
      setResources([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    if (initialSearch) {
      handleSearch(initialSearch)
    }
  }, [initialSearch, handleSearch])

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎤</span>
        <h1 className="text-xl font-bold text-gray-900">语音交互</h1>
      </div>

      {/* 搜索框 */}
      <VoiceSearch
        onSearch={handleSearch}
        isListening={isListening}
        setIsListening={setIsListening}
      />

      {/* 语音提示 */}
      {isListening && (
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2 animate-bounce">🎙️</div>
          <p className="text-blue-600 font-medium">正在聆听，请说出关键词...</p>
          <p className="text-sm text-blue-400 mt-1">说完后系统将自动搜索</p>
        </div>
      )}

      {/* 搜索结果或推荐 */}
      {currentSearch ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">搜索结果</h2>
            <button
              onClick={() => {
                setCurrentSearch('')
                setResources([])
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              清除搜索
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ResourceList resources={resources} keyword={currentSearch} />
          )}
        </>
      ) : (
        <>
          {/* 热门搜索 */}
          <HotWords hotWords={hotWords} onWordClick={handleSearch} />

          {/* 为你推荐 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">✨</span>
              <h2 className="font-bold text-gray-900">为你推荐</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ResourceList resources={recommendedResources} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

// 加载状态组件
function VoiceLoading() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎤</span>
        <h1 className="text-xl font-bold text-gray-900">语音交互</h1>
      </div>
      <div className="bg-white rounded-xl p-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-14 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoiceContent
