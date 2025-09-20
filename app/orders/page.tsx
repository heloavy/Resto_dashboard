import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from 'next/dynamic'

const DynamicOrdersPage = dynamic(
  () => import('@/components/orders-page').then(mod => mod.OrdersPage),
  { ssr: false }
)

export default function Orders() {
  return (
    <DashboardLayout>
      <DynamicOrdersPage />
    </DashboardLayout>
  )
}
