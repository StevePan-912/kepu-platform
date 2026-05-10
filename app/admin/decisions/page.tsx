import { DecisionStats, DecisionGenerator, DecisionSuggestions, HotAreaAnalysis, UserPreferenceAnalysis } from '@/components/admin/decisions'

export const dynamic = 'force-dynamic'

export default function DecisionsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">🧠 智能决策中心</h1>
        <p className="text-gray-500 text-sm mt-1">
          AI 辅助决策建议 · 数据驱动的区域与用户偏好分析
        </p>
      </div>

      {/* KPI 卡片 */}
      <DecisionStats />

      {/* AI 生成区域 */}
      <DecisionGenerator
        onCreated={() => window.location.reload()}
      />

      {/* 建议列表 */}
      <DecisionSuggestions />

      {/* 数据分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotAreaAnalysis />
        <UserPreferenceAnalysis />
      </div>
    </div>
  )
}
