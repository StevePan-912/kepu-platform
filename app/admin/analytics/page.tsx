import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview'
import { ActivityTrendChart } from '@/components/admin/analytics/ActivityTrendChart'
import { CategoryDistributionChart } from '@/components/admin/analytics/CategoryDistributionChart'
import { UserGrowthChart } from '@/components/admin/analytics/UserGrowthChart'
import { ResourceRankingChart } from '@/components/admin/analytics/ResourceRankingChart'

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">数据分析</h1>
        <p className="text-gray-500 text-sm mt-1">
          用户行为、资源使用与增长趋势一览
        </p>
      </div>

      {/* KPI 卡片 */}
      <AnalyticsOverview days={7} />

      {/* 第一行图表：活动趋势 + 分类分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTrendChart />
        </div>
        <div>
          <CategoryDistributionChart />
        </div>
      </div>

      {/* 第二行图表：用户增长 + 资源排行 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div>
          <ResourceRankingChart />
        </div>
      </div>
    </div>
  )
}
