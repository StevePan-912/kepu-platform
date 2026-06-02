'use client'

import type { PointRecord } from '@/lib/supabase/types'
import { formatDateTime, formatPoints } from '@/lib/utils/format'

interface PointHistoryProps {
  records: PointRecord[]
}

export function PointHistory({ records }: PointHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground">
        暂无积分记录
      </div>
    )
  }

  return (
    <div className="bg-background rounded-lg ring-1 ring-border divide-y divide-border">
      {records.slice(0, 20).map((record) => (
        <div key={record.id} className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-foreground">{record.reason}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDateTime(record.created_at)}</p>
          </div>
          <span className={`font-bold ${
            record.points > 0 ? 'text-success' : 'text-destructive'
          }`}>
            {formatPoints(record.points)}
          </span>
        </div>
      ))}
    </div>
  )
}
