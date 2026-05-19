'use client'

import type { VolunteerRecord } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils/format'

interface HourRecordProps {
  records: VolunteerRecord[]
}

export function HourRecord({ records }: HourRecordProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        暂无志愿记录
      </div>
    )
  }

  const totalHours = records.reduce((sum, r) => sum + (r.hours || 0), 0)

  return (
    <div>
      {/* 总时长统计 */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">累计志愿时长</span>
          <span className="text-2xl font-bold text-purple-500">{totalHours} 小时</span>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {records.map((record) => (
          <div key={record.id} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900">志愿服务</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(record.created_at)}</p>
              </div>
              <span className="font-medium text-purple-500">{record.hours} 小时</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
