'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { recordActivity } from '@/lib/supabase/queries'
import { useUser } from '@/lib/hooks/useUser'

interface VoiceSearchProps {
  onSearch: (keyword: string) => void
  isListening: boolean
  setIsListening: (value: boolean) => void
}

export function VoiceSearch({ onSearch, isListening, setIsListening }: VoiceSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const { searchKeyword, setSearchKeyword } = useAppStore()
  const { user } = useUser()
  const recognitionRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'zh-CN'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setSearchKeyword(transcript)
        onSearch(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [onSearch, setSearchKeyword, setIsListening])

  const handleVoiceClick = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (e) {
        console.error('Voice recognition error:', e)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchKeyword(inputValue.trim())
      onSearch(inputValue.trim())
      // 记录搜索行为
      if (user) {
        recordActivity({
          user_id: user.id,
          action: 'search',
          keyword: inputValue.trim(),
        } as any)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="输入关键词搜索科普内容..."
        className="w-full px-4 py-3 pr-12 bg-white rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
      />
      <button
        type="button"
        onClick={handleVoiceClick}
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </form>
  )
}
