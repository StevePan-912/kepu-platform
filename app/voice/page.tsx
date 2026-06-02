import { Suspense } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import VoiceContent from './VoiceContent'
import { Mic } from 'lucide-react'

// Loading skeleton
function VoiceLoading() {
  return (
    <div className="px-6 pt-4 space-y-4">
      <div className="flex items-center gap-2">
        <Mic className="w-6 h-6 text-foreground" />
        <h1 className="text-xl font-semibold text-foreground">语音交互</h1>
      </div>
      <div className="bg-card rounded-xl p-4 animate-pulse ring-1 ring-border">
        <div className="h-12 bg-muted rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl p-4 animate-pulse ring-1 ring-border">
            <div className="h-4 bg-muted rounded w-1/4 mb-3" />
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-14 bg-muted rounded-full" />
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
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      <Suspense fallback={<VoiceLoading />}>
        <VoiceContent />
      </Suspense>

      <MobileNav />
    </div>
  )
}
