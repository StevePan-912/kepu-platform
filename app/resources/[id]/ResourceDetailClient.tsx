'use client'

import { useState, useEffect } from 'react'
import type { Resource } from '@/lib/supabase/types'
import { getResourceById, getResources } from '@/lib/supabase/queries'
import { useUser } from '@/lib/hooks/useUser'
import { recordActivity } from '@/lib/supabase/queries'
import { RESOURCE_CATEGORIES } from '@/lib/constants/categories'
import {
  ArrowLeft,
  Clock,
  Headphones,
  Video,
  BookOpen,
  Box,
  Play,
  Share2,
  Heart,
  Loader2,
  ExternalLink,
} from 'lucide-react'

// 资源类型图标映射
const typeIcons: Record<string, { icon: typeof Headphones; label: string; color: string }> = {
  audio: { icon: Headphones, label: '音频', color: 'text-blue-500 bg-blue-50' },
  video: { icon: Video, label: '视频', color: 'text-purple-500 bg-purple-50' },
  ar_model: { icon: Box, label: 'AR模型', color: 'text-emerald-500 bg-emerald-50' },
  text: { icon: BookOpen, label: '图文', color: 'text-orange-500 bg-orange-50' },
}

// 演示数据
const DEMO_RESOURCES: Resource[] = [
  {
    id: 'demo-1', title: '太阳系的奥秘', category: 'astronomy', type: 'video',
    content_url: null, duration: 480,
    description: '从水星到海王星，探索太阳系八大行星的独特魅力。了解每颗行星的大小、距离、温度等关键信息，感受宇宙的壮阔。',
    source: null, tags: [] as any, view_count: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2', title: '恐龙时代的植物', category: 'paleontology', type: 'audio',
    content_url: null, duration: 300,
    description: '回到侏罗纪和白垩纪时期，了解恐龙与古代植物之间密不可分的关系。',
    source: null, tags: [] as any, view_count: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3', title: '社区常见野花图鉴', category: 'botany', type: 'text',
    content_url: null, duration: null,
    description: '认识展览路街道周边常见的野生花卉，从迎春花到蒲公英，用图文并茂的方式介绍它们的特征和习性。',
    source: null, tags: [] as any, view_count: 0,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export default function ResourceDetailClient({ id }: { id: string }) {
  const { user } = useUser()
  const [resource, setResource] = useState<Resource | null>(null)
  const [relatedResources, setRelatedResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    loadResource()
  }, [id])

  const loadResource = async () => {
    setLoading(true)
    const { data, error } = await getResourceById(id)
    if (!error && data) {
      setResource(data)
      // 加载同分类资源
      const { data: related } = await getResources(data.category) as unknown as { data: Resource[] | null; error: any }
      if (related) {
        setRelatedResources(related.filter(r => r.id !== data.id).slice(0, 3))
      }
    } else {
      // 演示数据
      const demo = DEMO_RESOURCES.find(r => r.id === id)
      if (demo) {
        setResource(demo)
        setRelatedResources(DEMO_RESOURCES.filter(r => r.id !== id))
      }
    }
    setLoading(false)
  }

  const handlePlay = async () => {
    if (!user || !resource) return
    setPlaying(true)
    // 记录行为
    await recordActivity({
      user_id: user.id,
      action: resource.type === 'audio' ? 'play_audio' : 'search',
      resource_id: resource.id,
      duration: resource.duration,
    } as any)
    // 模拟播放完成
    if (resource.duration) {
      setTimeout(() => setPlaying(false), Math.min(resource.duration * 1000, 5000))
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: resource?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  const handleLike = () => setLiked(!liked)

  const typeConfig = resource ? (typeIcons[resource.type ?? 'text'] ?? typeIcons.text) : typeIcons.text
  const categoryConfig = resource ? (RESOURCE_CATEGORIES as Record<string, { label: string; icon: string }>)[resource.category ?? ''] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <BookOpen className="mb-4 h-16 w-16 text-gray-200" />
        <h2 className="text-lg font-bold text-gray-700">资源未找到</h2>
        <p className="mt-1 text-sm text-gray-400">该资源可能已被移除或链接无效</p>
        <a href="/" className="mt-6 text-sm text-emerald-500 hover:underline">返回首页</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-white/90 px-4 py-3 backdrop-blur-md border-b border-gray-100">
        <a href="/" className="rounded-full p-1 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </a>
        <h1 className="flex-1 truncate text-base font-semibold text-gray-900">资源详情</h1>
        <button onClick={handleShare} className="rounded-full p-1 hover:bg-gray-100">
          <Share2 className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* 资源内容区 */}
      <div className="mx-4 mt-4">
        {/* 资源卡片 */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          {/* 分类 + 类型标签 */}
          <div className="mb-3 flex items-center gap-2">
            {categoryConfig && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                <span>{categoryConfig.icon}</span>
                {categoryConfig.label}
              </span>
            )}
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${typeConfig.color}`}>
              <typeConfig.icon className="h-3.5 w-3.5" />
              {typeConfig.label}
            </span>
          </div>

          {/* 标题 */}
          <h2 className="text-xl font-bold text-gray-900">{resource.title}</h2>

          {/* 元信息 */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            {resource.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.ceil(resource.duration / 60)} 分钟
              </span>
            )}
            {resource.content_url && (
              <span className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                有在线资源
              </span>
            )}
          </div>

          {/* 描述 */}
          {resource.description && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{resource.description}</p>
          )}

          {/* 操作按钮区 */}
          <div className="mt-5 flex gap-3">
            {(resource.type === 'audio' || resource.type === 'video') && (
              <button
                onClick={handlePlay}
                disabled={playing || !user}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition ${
                  playing
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                }`}
              >
                {playing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> 播放中...</>
                ) : (
                  <><Play className="h-4 w-4" /> {resource.type === 'audio' ? '播放音频' : '播放视频'}</>
                )}
              </button>
            )}
            {resource.type === 'ar_model' && (
              <a
                href="/ar"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600 active:scale-95 transition"
              >
                <Box className="h-4 w-4" />
                在AR中查看
              </a>
            )}
            <button
              onClick={handleLike}
              className={`flex items-center justify-center rounded-xl px-4 py-3 transition ${
                liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {!user && (
            <p className="mt-3 text-center text-xs text-gray-400">
              登录后可播放内容和收藏资源
            </p>
          )}
        </div>

        {/* 相关推荐 */}
        {relatedResources.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">相关推荐</h3>
            <div className="space-y-2">
              {relatedResources.map(r => {
                const rType = typeIcons[r.type ?? 'text'] ?? typeIcons.text
                const rCat = (RESOURCE_CATEGORIES as Record<string, { label: string; icon: string }>)[r.category ?? '']
                return (
                  <a
                    key={r.id}
                    href={`/resources/${r.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${rType.color}`}>
                      <rType.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                        {rCat && <span>{rCat.icon} {rCat.label}</span>}
                        {r.duration && <span>{Math.ceil(r.duration / 60)}分钟</span>}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {relatedResources.length === 0 && (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-200" />
            <p className="text-sm text-gray-400">暂无相关推荐</p>
          </div>
        )}
      </div>
    </div>
  )
}
