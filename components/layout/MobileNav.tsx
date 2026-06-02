'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Map, Smartphone, HeartHandshake, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: '首页', Icon: Home },
  { href: '/map', label: '地图', Icon: Map },
  { href: '/ar', label: 'AR', Icon: Smartphone },
  { href: '/volunteer', label: '志愿', Icon: HeartHandshake },
  { href: '/profile', label: '我的', Icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-[10px] leading-tight ${isActive ? 'font-medium text-primary' : ''}`}>
                {label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
