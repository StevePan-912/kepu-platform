import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">科普漫步</h1>
      <p className="text-gray-600 mb-8">智能科普服务平台</p>
      
      <div className="grid gap-4">
        <Link 
          href="/profile" 
          className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
        >
          <h2 className="font-bold">个人中心</h2>
          <p className="text-sm text-gray-600">查看积分、行为记录、兑换记录</p>
        </Link>
        
        <Link 
          href="/volunteer" 
          className="p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition"
        >
          <h2 className="font-bold">志愿者入口</h2>
          <p className="text-sm text-gray-600">参与志愿服务、记录志愿时长</p>
        </Link>
        
        <Link 
          href="/honors" 
          className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition"
        >
          <h2 className="font-bold">荣誉展示</h2>
          <p className="text-sm text-gray-600">查看季度/年度榜单、荣誉等级</p>
        </Link>
      </div>
    </main>
  )
}
