'use client'

import { HONOR_LEVELS } from '@/lib/constants/categories'

export function BadgeCollection() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">荣誉等级说明</h3>
      
      <div className="space-y-4">
        {Object.entries(HONOR_LEVELS).map(([key, config]) => (
          <div key={key} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{config.label}</p>
              <p className="text-sm text-gray-500">
                累计 {config.minPoints}+ 积分可获得
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">
          💡 通过播放音频、AR扫码、搜索、投稿等方式获取积分
        </p>
      </div>
    </div>
  )
}
