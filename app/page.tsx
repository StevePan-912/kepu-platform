import Link from 'next/link'
import { Map, Smartphone, User, HeartHandshake, Trophy, Mic, ShoppingBag } from 'lucide-react'

const FEATURES = [
  {
    href: '/map',
    title: '资源地图',
    description: '查看周边科普设施点位、实时状态与导航',
    Icon: Map,
  },
  {
    href: '/ar',
    title: 'AR探境',
    description: '增强现实互动体验，沉浸式探索科学',
    Icon: Smartphone,
  },
  {
    href: '/voice',
    title: '语音导览',
    description: '智能语音交互，随时随地获取科普内容',
    Icon: Mic,
  },
  {
    href: '/volunteer',
    title: '志愿服务',
    description: '参与社区科普志愿活动，记录服务时长',
    Icon: HeartHandshake,
  },
  {
    href: '/honors',
    title: '荣誉殿堂',
    description: '查看季度榜单、荣誉等级与勋章收集',
    Icon: Trophy,
  },
  {
    href: '/mall',
    title: '积分商城',
    description: '使用积分兑换科普周边与体验券',
    Icon: ShoppingBag,
  },
  {
    href: '/profile',
    title: '个人中心',
    description: '积分、行为记录、兑换记录一站式管理',
    Icon: User,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 max-w-screen-md mx-auto">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          科普漫步
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-md">
          展览路街道智能科普服务平台
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          探索周边科普资源，参与社区互动
        </p>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-24 max-w-screen-md mx-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ href, title, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 p-5 rounded-xl bg-card ring-1 ring-border hover:ring-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="min-w-0">
                <h2 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
