export function MobileNav() {
  const navItems = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/map', label: '地图', icon: '🗺️' },
    { href: '/ar', label: 'AR', icon: '📱' },
    { href: '/volunteer', label: '志愿', icon: '🤝' },
    { href: '/profile', label: '我的', icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs text-gray-600"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
