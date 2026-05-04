'use client'

import Link from 'next/link'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { PointsBadge } from '@/components/common/PointsBadge'
import { useUser } from '@/lib/hooks/useUser'

export default function HomePage() {
  const { user, loginDemo } = useUser()

  return (
    <div className="min-h-screen pb-20">
      <NavBar />

      {/* 顶部 Banner */}
      <section className="px-4 pt-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">今日推荐</p>
          <h3 className="text-xl font-bold mt-1">黑洞的秘密</h3>
          <p className="text-sm mt-2 opacity-90">探索宇宙中最神秘的天体...</p>
          <Link href="/voice" className="inline-flex items-center gap-1 text-sm mt-4 hover:underline">
            立即收听 →
          </Link>
        </div>
      </section>

      {/* 用户积分区域 */}
      <section className="px-4 pt-4">
        {user ? (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">欢迎，{user.nickname}</p>
              <p className="text-lg font-bold text-gray-900">积分: {user.points}</p>
            </div>
            <PointsBadge level={user.honor_level} />
          </div>
        ) : (
          <button
            onClick={() => loginDemo()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            登录体验（演示模式）
          </button>
        )}
      </section>

      {/* 四大模块入口 */}
      <section className="px-4 pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">探索科普</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/map" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white text-lg">📍</span>
            </div>
            <h3 className="font-medium text-gray-900">资源地图</h3>
            <p className="text-xs text-gray-500 mt-1">发现身边科普点位</p>
          </Link>

          <Link href="/ar" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white text-lg">📱</span>
            </div>
            <h3 className="font-medium text-gray-900">AR探境</h3>
            <p className="text-xs text-gray-500 mt-1">沉浸式科普体验</p>
          </Link>

          <Link href="/voice" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white text-lg">🎤</span>
            </div>
            <h3 className="font-medium text-gray-900">语音交互</h3>
            <p className="text-xs text-gray-500 mt-1">智能科普问答</p>
          </Link>

          <Link href="/mall" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white text-lg">🎁</span>
            </div>
            <h3 className="font-medium text-gray-900">积分商城</h3>
            <p className="text-xs text-gray-500 mt-1">兑换精美礼品</p>
          </Link>
        </div>
      </section>

      {/* 今日热词 */}
      <section className="px-4 pt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">热门话题</h2>
        <div className="flex flex-wrap gap-2">
          {['黑洞', '恐龙', '火星', '星座', '望远镜', '太阳系', '植物', '社区'].map((word) => (
            <Link
              key={word}
              href={`/voice?search=${word}`}
              className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200"
            >
              {word}
            </Link>
          ))}
        </div>
      </section>

      {/* 底部导航 */}
      <MobileNav />
    </div>
  )
}