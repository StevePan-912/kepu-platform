'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AdminDecisionSuggestion } from '@/lib/supabase/admin/types'
import {
  getDecisionSuggestions,
  updateSuggestionStatus,
} from '@/lib/supabase/admin/queries'

const TYPE_LABELS: Record<string, string> = {
  activity: '活动',
  content: '内容',
  location: '位置',
}

export function DecisionSuggestions() {
  const [suggestions, setSuggestions] = useState<AdminDecisionSuggestion[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const params: any = { page, pageSize }
    if (typeFilter !== 'all') params.type = typeFilter
    if (statusFilter !== 'all') params.status = statusFilter

    const { data, error } = await getDecisionSuggestions(params)
    if (!error && data) {
      setSuggestions(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, typeFilter, statusFilter])

  const handleToggle = async (id: string, currentActive: boolean) => {
    setActionLoading(id)
    const { error } = await updateSuggestionStatus(id, !currentActive)
    if (!error) {
      await fetchData()
    }
    setActionLoading(null)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">决策建议列表</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v || 'all'); setPage(1) }}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="activity">活动</SelectItem>
                <SelectItem value="content">内容</SelectItem>
                <SelectItem value="location">位置</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v || 'all'); setPage(1) }}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">已激活</SelectItem>
                <SelectItem value="inactive">未激活</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>建议内容</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      暂无建议数据
                    </TableCell>
                  </TableRow>
                ) : (
                  suggestions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {TYPE_LABELS[s.type] || s.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={s.suggestion}>
                          {s.suggestion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={
                          s.priority >= 8 ? 'text-red-600 font-semibold' :
                          s.priority >= 5 ? 'text-orange-600' : 'text-gray-600'
                        }>
                          {s.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.is_active ? 'default' : 'secondary'}>
                          {s.is_active ? '激活' : '停用'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                        {s.created_at ? new Date(s.created_at).toLocaleString('zh-CN') : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={s.is_active ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleToggle(s.id, s.is_active)}
                          disabled={actionLoading === s.id}
                        >
                          {actionLoading === s.id ? '处理中...' : s.is_active ? '停用' : '启用'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* 分页 */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>
                共 {total} 条，第 {page}/{totalPages || 1} 页
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
