import { Suspense } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import VoiceContent from './VoiceContent'

// Loading 状态组件
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

export { VoiceLoading }

export default function VoicePage() {
  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <NavBar />

      <Suspense fallback={<VoiceLoading />}>
        <VoiceContent />
      </Suspense>

      <MobileNav />
    </div>
  )
}
