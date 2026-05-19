'use client'

import type { PointRecord } from '@/lib/supabase/types'
import { formatDateTime, formatPoints } from '@/lib/utils/format'

interface PointHistoryProps {
  records: PointRecord[]
}

export function PointHistory({ records }: PointHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        暂无积分记录
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
      {records.slice(0, 20).map((record) => (
        <div key={record.id} className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-gray-900">{record.reason}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDateTime(record.created_at)}</p>
          </div>
          <span className={`font-bold ${
            record.points > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatPoints(record.points)}
          </span>
        </div>
      ))}
    </div>
  )
}
