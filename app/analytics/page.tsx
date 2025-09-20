import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from 'next/dynamic'

const DynamicAnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard').then(mod => mod.AnalyticsDashboard),
  { ssr: false }
)

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <DynamicAnalyticsDashboard />
    </DashboardLayout>
  )
}
