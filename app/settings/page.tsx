import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from 'next/dynamic'

const DynamicSettingsPage = dynamic(
  () => import('@/components/settings-page').then(mod => mod.SettingsPage),
  { ssr: false }
)

export default function Settings() {
  return (
    <DashboardLayout>
      <DynamicSettingsPage />
    </DashboardLayout>
  )
}
