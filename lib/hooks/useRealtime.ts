'use client'

import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// ============================================================
// 类型定义
// ============================================================

/** Realtime 订阅事件类型 */
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

/** Realtime 订阅配置 */
export interface UseRealtimeOptions<T extends Record<string, unknown>> {
  /** 订阅的表名 */
  table: string
  /** 监听的事件类型，默认 '*' */
  event?: RealtimeEvent
  /** 过滤条件（Postgres 格式），如 "status=eq.online" */
  filter?: string
  /** 数据变更回调 */
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void
  /** 统一回调（监听所有事件） */
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void
  /** 是否启用（默认 true） */
  enabled?: boolean
}

// ============================================================
// Hook: useRealtime
// ============================================================

/**
 * Supabase Realtime 通用订阅 Hook
 *
 * @example
 * // 监听资源表的所有变更
 * useRealtime({
 *   table: 'resources',
 *   onChange: (payload) => console.log('资源变更:', payload),
 * })
 *
 * @example
 * // 监听在线设备的状态更新
 * useRealtime({
 *   table: 'devices',
 *   event: 'UPDATE',
 *   filter: 'status=eq.online',
 *   onUpdate: (payload) => updateDeviceList(payload.new),
 * })
 */
export function useRealtime<T extends Record<string, unknown>>(
  options: UseRealtimeOptions<T>
) {
  const {
    table,
    event = '*',
    filter,
    onInsert,
    onUpdate,
    onDelete,
    onChange,
    enabled = true,
  } = options

  const channelRef = useRef<RealtimeChannel | null>(null)

  // 稳定的回调引用（避免重建订阅）
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete, onChange })
  callbacksRef.current = { onInsert, onUpdate, onDelete, onChange }

  useEffect(() => {
    if (!enabled) return

    // 构建频道名称（唯一，避免重复订阅）
    const filterSuffix = filter ? `:${filter}` : ''
    const channelName = `realtime:${table}:${event}${filterSuffix}`

    // 创建频道
    let channel = supabase.channel(channelName)

    // 构建 PostgresChanges 配置
    const pgConfig: {
      event: RealtimeEvent
      schema: string
      table: string
      filter?: string
    } = {
      event,
      schema: 'public',
      table,
    }
    if (filter) pgConfig.filter = filter

    channel = channel.on(
      'postgres_changes' as never,
      pgConfig as never,
      (payload: RealtimePostgresChangesPayload<T>) => {
        const cb = callbacksRef.current
        // 统一回调
        cb.onChange?.(payload)

        // 按事件类型分发
        switch (payload.eventType) {
          case 'INSERT':
            cb.onInsert?.(payload)
            break
          case 'UPDATE':
            cb.onUpdate?.(payload)
            break
          case 'DELETE':
            cb.onDelete?.(payload)
            break
        }
      }
    )

    // 订阅
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Realtime] 已订阅 ${channelName}`)
      }
      if (status === 'CHANNEL_ERROR') {
        console.error(`[Realtime] 订阅失败 ${channelName}`)
      }
    })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, filter, enabled])

  /** 手动取消订阅 */
  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  return { unsubscribe }
}

// ============================================================
// 导出的频道创建工具（用于复杂场景）
// ============================================================

/**
 * 创建 Presence 频道（在线状态追踪）
 * 用于实时显示在线用户数、设备状态等
 */
export function createPresenceChannel<T extends Record<string, unknown>>(
  channelName: string,
  presenceKey: string,
  onSync?: () => void,
  onJoin?: (presence: T) => void,
  onLeave?: (presence: T) => void
) {
  const channel = supabase.channel(channelName, {
    config: {
      presence: { key: presenceKey },
    },
  })

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<T>()
      onSync?.()
      console.log('[Presence] 在线用户:', Object.keys(state).length)
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }: never) => {
      onJoin?.(newPresences as T)
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }: never) => {
      onLeave?.(leftPresences as T)
    })
    .subscribe()

  return channel
}

/**
 * 创建 Broadcast 频道（客户端间实时消息广播）
 * 用于实时通知、即时通讯等场景
 */
export function createBroadcastChannel<T extends Record<string, unknown>>(
  channelName: string,
  eventName: string,
  onMessage: (payload: T) => void
) {
  const channel = supabase.channel(channelName)

  channel
    .on('broadcast', { event: eventName }, (payload: never) => {
      onMessage(payload as T)
    })
    .subscribe()

  return {
    channel,
    send: (payload: T) =>
      channel.send({
        type: 'broadcast',
        event: eventName,
        payload: payload as never,
      }),
  }
}
