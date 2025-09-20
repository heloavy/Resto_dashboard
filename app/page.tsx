import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import dynamic from 'next/dynamic'

const DynamicDashboardOverview = dynamic(
  () => import('@/components/dashboard-overview').then(mod => mod.DashboardOverview),
  { ssr: false }
)

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DynamicDashboardOverview />
    </DashboardLayout>
  )
}
