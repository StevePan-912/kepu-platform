'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ArModelCard, VoiceNarration, ArScanButton } from '@/components/ar'
import type { ArModel } from '@/components/ar'

// 动态加载 ModelViewer（需要访问 document，纯客户端）
const ModelViewer = dynamic(() => import('@/components/ar/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-bounce">🔮</div>
        <p className="text-sm text-indigo-400">3D模型加载中…</p>
      </div>
    </div>
  ),
})

// AR 探境 Mock 数据
const MODELS: ArModel[] = [
  {
    id: 'ar-1',
    title: '猎户座星云',
    description:
      '猎户座星云（M42）是距地球约1344光年的弥漫星云，是夜空中最明亮的星云之一。你可以在秋冬季节用肉眼看到它。',
    category: 'astronomy',
    modelUrl: null, // 真实项目替换为 .glb 文件 URL
    thumbnailEmoji: '🌌',
    location: '展览路科普点1号',
    isNew: true,
    narration:
      '欢迎探索猎户座星云！这片壮观的气体和尘埃云距离我们约1344光年，直径约24光年。它是一个活跃的恒星形成区，其中包含数百颗年轻恒星。在晴朗的夜晚，即使不借助望远镜，你也能在猎户腰带正下方看到这颗朦胧的天体。',
  },
  {
    id: 'ar-2',
    title: '三角龙骨架',
    description:
      '三角龙（Triceratops）生活在白垩纪晚期，距今约6800~6600万年前。它是最著名的食草恐龙之一，以三根角和颈盾著称。',
    category: 'paleontology',
    modelUrl: null,
    thumbnailEmoji: '🦕',
    location: '展览路科普点3号',
    narration:
      '你眼前的是三角龙的骨架模型！三角龙是白垩纪晚期的植食性恐龙，体长可达9米，体重约12吨。它那标志性的三根角中，鼻上一根，眼眶上方两根，最长可达1.2米。这些角不仅用于防御掠食者，也可能用于同类间的竞争和社交展示。',
  },
  {
    id: 'ar-3',
    title: '银杏叶细胞结构',
    description:
      '银杏是地球上现存最古老的树种之一，有"活化石"之称。其叶片的扇形叶脉结构独特，是辨认银杏的重要特征。',
    category: 'botany',
    modelUrl: null,
    thumbnailEmoji: '🍃',
    location: '展览路银杏道',
    narration:
      '这里展示的是银杏叶的细胞显微结构。银杏树已在地球上存活了约2.7亿年，历经冰河时期依然顽强生存。它的叶片呈独特的扇形，叶脉呈二叉分支，这是一种非常原始的叶脉类型。银杏树雌雄异株，秋季叶片变为金黄色，是城市中常见的景观树种。',
  },
  {
    id: 'ar-4',
    title: '展览路生态系统',
    description:
      '展览路街道依托"四层一体"智能科普服务体系，打造社区与自然和谐共生的生态科普示范区。',
    category: 'ecology',
    modelUrl: null,
    thumbnailEmoji: '🌿',
    location: '展览路社区中心',
    narration:
      '展览路街道的生态科普项目，融合了天文、古生物、植物等多学科知识，为居民打造了沉浸式的科普体验。通过AI智能设备、AR探境点和社区活动，让科学知识从书本走进生活，激发每一位居民探索自然的热情。',
  },
  {
    id: 'ar-5',
    title: '社区气象站',
    description:
      '了解展览路街道的实时气象数据，探索气温、湿度、风向等与社区生活的关系。',
    category: 'neighborhood',
    modelUrl: null,
    thumbnailEmoji: '🌡️',
    location: '展览路气象观测站',
    narration:
      '这里是展览路社区智能气象站的3D模型展示。气象站24小时监测气温、湿度、气压、风速风向等数据，结合大数据分析，为居民提供精准的本地天气预报。科学认识气象变化，有助于我们更好地应对极端天气，保护社区安全。',
  },
]

export default function ArPageClient() {
  const [activeModelId, setActiveModelId] = useState<string>(MODELS[0].id)
  const [showArAlert, setShowArAlert] = useState(false)

  const activeModel = MODELS.find((m) => m.id === activeModelId) ?? MODELS[0]

  const handleArScan = useCallback(() => {
    setShowArAlert(true)
    setTimeout(() => setShowArAlert(false), 3000)
  }, [])

  const arDeviceCount = MODELS.length

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <NavBar />

      {/* AR 扫描提示浮层 */}
      {showArAlert && (
        <div className="fixed top-16 left-4 right-4 z-50">
          <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-xl flex items-start gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-semibold text-sm">正在启动相机…</p>
              <p className="text-xs text-indigo-200 mt-0.5">
                WebAR功能需要相机权限，请在真实设备上体验最佳效果
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AR 探境</h1>
              <p className="text-xs text-gray-400">3D模型 · 沉浸式科普体验</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full">
            <span className="text-xs text-indigo-600 font-medium">{MODELS.length} 个模型</span>
          </div>
        </div>

        {/* AR 扫描入口 */}
        <ArScanButton onClick={handleArScan} deviceCount={arDeviceCount} />

        {/* 3D 模型预览区 */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* 模型展示 */}
          <div className="relative h-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            {activeModel.modelUrl ? (
              <ModelViewer
                src={activeModel.modelUrl}
                alt={activeModel.title}
                autoRotate
                cameraControls
              />
            ) : (
              /* 无模型文件时的占位展示 */
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-8xl mb-3 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.8))' }}>
                  {activeModel.thumbnailEmoji}
                </div>
                <p className="text-white/60 text-xs">3D 模型展示区</p>
                <p className="text-white/40 text-xs mt-1">（实机部署后加载 .glb 模型）</p>
              </div>
            )}

            {/* 模型标题覆盖 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
              <h2 className="text-white font-bold text-base">{activeModel.title}</h2>
              {activeModel.location && (
                <p className="text-white/70 text-xs">📍 {activeModel.location}</p>
              )}
            </div>

            {/* 操作提示 */}
            <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
              <p className="text-white text-xs">拖拽旋转 · 双指缩放</p>
            </div>
          </div>

          {/* 模型描述 */}
          <div className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed">{activeModel.description}</p>
          </div>
        </div>

        {/* 语音讲解 */}
        {activeModel.narration && (
          <VoiceNarration text={activeModel.narration} title={activeModel.title} />
        )}

        {/* 模型列表 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🗂️</span>
            <h2 className="font-bold text-gray-900">探境模型库</h2>
          </div>
          <div className="space-y-2">
            {MODELS.map((model) => (
              <ArModelCard
                key={model.id}
                model={model}
                isActive={model.id === activeModelId}
                onClick={() => setActiveModelId(model.id)}
              />
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold text-sm text-amber-800 mb-1">如何使用 AR 探境</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• 在地图上找到 <span className="font-medium">AR探境点</span>（📱 标记）</li>
                <li>• 到达现场后点击「<span className="font-medium">开启AR探境</span>」扫描周围</li>
                <li>• 对准设备上的 <span className="font-medium">AR标识贴纸</span> 即可触发3D模型</li>
                <li>• 可点击模型进行交互，并开启语音讲解</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 跳转地图 */}
        <Link
          href="/map"
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>🗺️</span>
          查看周边 AR 探境点位
          <span className="text-gray-400">→</span>
        </Link>
      </div>

      <MobileNav />
    </div>
  )
}
