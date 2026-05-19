import { cn } from '@/lib/utils/cn'

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <h1 className="text-lg font-bold text-gray-900">科普漫步</h1>
        <nav className="hidden md:flex items-center gap-4">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">首页</a>
          <a href="/map" className="text-sm text-gray-600 hover:text-gray-900">资源地图</a>
          <a href="/ar" className="text-sm text-gray-600 hover:text-gray-900">AR探境</a>
          <a href="/profile" className="text-sm text-gray-600 hover:text-gray-900">我的</a>
        </nav>
      </div>
    </header>
  )
}
