'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Volume2, Square, Play } from 'lucide-react'

interface VoiceNarrationProps {
  text: string
  title?: string
}

export default function VoiceNarration({ text, title }: VoiceNarrationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [supported, setSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const estimatedDuration = Math.ceil(text.length / 3.5) * 1000 // 中文~3.5字/秒

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false)
    }
    return () => {
      window.speechSynthesis?.cancel()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 切换讲解内容时停止播放
  useEffect(() => {
    handleStop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const handleStop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsPlaying(false)
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handlePlay = useCallback(() => {
    if (!supported) return

    if (isPlaying) {
      handleStop()
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1
    utteranceRef.current = utterance

    utterance.onstart = () => {
      setIsPlaying(true)
      setProgress(0)
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const pct = Math.min((elapsed / estimatedDuration) * 100, 99)
        setProgress(pct)
      }, 200)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setProgress(100)
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeout(() => setProgress(0), 800)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setProgress(0)
      if (timerRef.current) clearInterval(timerRef.current)
    }

    window.speechSynthesis.speak(utterance)
  }, [text, isPlaying, supported, estimatedDuration, handleStop])

  if (!supported) {
    return (
      <div className="bg-muted rounded-xl p-3 text-center text-xs text-muted-foreground">
        当前浏览器不支持语音朗读
      </div>
    )
  }

  return (
    <div className="bg-accent rounded-2xl p-4">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {title ? `${title} — 语音讲解` : '语音讲解'}
          </span>
        </div>
        <button
          onClick={handlePlay}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${isPlaying
              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
              : 'bg-primary text-white hover:bg-primary/90 shadow-sm'
            }
          `}
        >
          {isPlaying ? (
            <>
              <Square className="h-3 w-3" /> 停止
            </>
          ) : (
            <>
              <Play className="h-3 w-3" /> 播放
            </>
          )}
        </button>
      </div>

      {/* 进度条 */}
      {isPlaying && (
        <div className="mb-3">
          <div className="bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 讲解文本预览 */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {text}
      </p>
    </div>
  )
}
