'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Smartphone, Mic, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { href: '/map', icon: MapPin, label: '资源地图' },
  { href: '/ar', icon: Smartphone, label: 'AR探境' },
  { href: '/voice', icon: Mic, label: '语音交互' },
  { href: '/mall', icon: ShoppingBag, label: '积分商城' },
  { href: '/profile', icon: User, label: '个人中心' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}