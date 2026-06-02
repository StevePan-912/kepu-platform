'use client'

import { useState } from 'react'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import type { Device } from '@/lib/supabase/types'
import { Headphones, Monitor, Smartphone, Star, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface MapFilterProps {
  devices: Device[]
  onFilterChange: (filtered: Device[]) => void
}

const ALL_TYPES = Object.keys(DEVICE_TYPES) as string[]
const ALL_STATUSES = Object.keys(DEVICE_STATUS) as string[]

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  audio_station: Headphones,
  screen: Monitor,
  ar_point: Smartphone,
  star_corner: Star,
}

export default function MapFilter({ devices, onFilterChange }: MapFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(ALL_TYPES))
  const [selectedStatus, setSelectedStatus] = useState<Set<string>>(new Set(ALL_STATUSES))
  const [isOpen, setIsOpen] = useState(false)

  function applyFilter(types: Set<string>, statuses: Set<string>) {
    const filtered = devices.filter(
      (d) => types.has(d.type ?? '') && statuses.has(d.status)
    )
    onFilterChange(filtered)
  }

  function toggleType(type: string) {
    const next = new Set(selectedTypes)
    next.has(type) ? next.delete(type) : next.add(type)
    setSelectedTypes(next)
    applyFilter(next, selectedStatus)
  }

  function toggleStatus(status: string) {
    const next = new Set(selectedStatus)
    next.has(status) ? next.delete(status) : next.add(status)
    setSelectedStatus(next)
    applyFilter(selectedTypes, next)
  }

  const onlineCount = devices.filter((d) => d.status === 'online').length
  const totalCount = devices.length

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      {/* Stats badge */}
      <div className="glass rounded-2xl shadow-sm px-3 py-2 mb-2 flex items-center gap-2 ring-1 ring-border">
        <span className="text-success font-bold text-sm">{onlineCount}</span>
        <span className="text-muted-foreground text-xs">/ {totalCount} 在线</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
        >
          <Filter className="w-3 h-3" />
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Filter panel */}
      {isOpen && (
        <div className="glass rounded-2xl shadow-md p-4 w-56 space-y-3 ring-1 ring-border">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">设备类型</p>
            <div className="space-y-1.5">
              {ALL_TYPES.map((type) => {
                const Icon = TYPE_ICONS[type]
                const typeInfo = DEVICE_TYPES[type]
                return (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(type)}
                      onChange={() => toggleType(type)}
                      className="rounded accent-primary"
                    />
                    {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                    <span className="text-sm text-foreground">{typeInfo?.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">设备状态</p>
            <div className="space-y-1.5">
              {ALL_STATUSES.map((status) => {
                const statusInfo = DEVICE_STATUS[status]
                return (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.has(status)}
                      onChange={() => toggleStatus(status)}
                      className="rounded accent-primary"
                    />
                    <span className="text-sm text-foreground">{statusInfo?.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
