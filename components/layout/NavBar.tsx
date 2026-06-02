'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Map, Smartphone, User, Home } from 'lucide-react'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/', label: '首页', Icon: Home },
  { href: '/map', label: '资源地图', Icon: Map },
  { href: '/ar', label: 'AR探境', Icon: Smartphone },
  { href: '/profile', label: '我的', Icon: User },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="flex items-center justify-between px-6 h-14 max-w-screen-xl mx-auto">
        <Link href="/" className="text-base font-semibold text-foreground tracking-tight">
          科普漫步
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'text-foreground bg-accent font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
