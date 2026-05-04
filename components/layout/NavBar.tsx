'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          <span className="font-bold text-lg text-gray-900">科普漫步</span>
        </Link>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  )
}