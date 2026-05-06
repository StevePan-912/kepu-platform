'use client'

import { useState } from 'react'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import type { Device } from '@/lib/supabase/types'

interface MapFilterProps {
  devices: Device[]
  onFilterChange: (filtered: Device[]) => void
}

const ALL_TYPES = Object.keys(DEVICE_TYPES) as Device['type'][]
const ALL_STATUSES = Object.keys(DEVICE_STATUS) as Device['status'][]

const TYPE_EMOJI: Record<string, string> = {
  audio_station: '🔊',
  screen: '📺',
  ar_point: '🔮',
  star_corner: '⭐',
}

export default function MapFilter({ devices, onFilterChange }: MapFilterProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(ALL_TYPES))
  const [selectedStatus, setSelectedStatus] = useState<Set<string>>(new Set(ALL_STATUSES))
  const [isOpen, setIsOpen] = useState(false)

  function applyFilter(types: Set<string>, statuses: Set<string>) {
    const filtered = devices.filter(
      (d) => types.has(d.type) && statuses.has(d.status)
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
      {/* 统计徽章 */}
      <div className="bg-white rounded-2xl shadow-lg px-3 py-2 mb-2 flex items-center gap-2">
        <span className="text-green-600 font-bold text-sm">{onlineCount}</span>
        <span className="text-gray-400 text-xs">/ {totalCount} 在线</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
        >
          筛选 {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* 筛选面板 */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl p-4 w-52 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">设备类型</p>
            <div className="space-y-1.5">
              {ALL_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.has(type)}
                    onChange={() => toggleType(type)}
                    className="rounded accent-green-600"
                  />
                  <span className="text-sm">{TYPE_EMOJI[type]} {DEVICE_TYPES[type].label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">设备状态</p>
            <div className="space-y-1.5">
              {ALL_STATUSES.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatus.has(status)}
                    onChange={() => toggleStatus(status)}
                    className="rounded accent-green-600"
                  />
                  <span className="text-sm">{DEVICE_STATUS[status].label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
