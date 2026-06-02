'use client'

import { Lightbulb } from 'lucide-react'
import { HONOR_LEVELS } from '@/lib/constants/categories'

export function BadgeCollection() {
  return (
    <div className="bg-background rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-foreground mb-4">荣誉等级说明</h3>

      <div className="space-y-4">
        {Object.entries(HONOR_LEVELS).map(([key, config]) => (
          <div key={key} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <config.Icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{config.label}</p>
              <p className="text-sm text-muted-foreground">
                累计 {config.minPoints}+ 积分可获得
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-accent rounded-lg">
        <p className="text-sm text-primary flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          通过播放音频、AR扫码、搜索、投稿等方式获取积分
        </p>
      </div>
    </div>
  )
}
