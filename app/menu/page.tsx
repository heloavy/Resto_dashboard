'use client'

import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from 'next/dynamic'

const DynamicMenuManagement = dynamic(
  () => import('@/components/menu-management').then(mod => mod.MenuManagement),
  { ssr: false }
)

export default function Menu() {
  return (
    <DashboardLayout>
      <DynamicMenuManagement />
    </DashboardLayout>
  )
}
