import { SalesChart } from '@/components/dashboard/SalesChart';
import { AiChat } from '@/components/dashboard/AiChat';
import { InventoryAlerts } from '@/components/dashboard/InventoryAlerts';
import { MenuOptimization } from '@/components/dashboard/MenuOptimization';
import { TopMenuItems } from '@/components/dashboard/TopMenuItems';

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h1 className="text-3xl font-headline font-bold text-gray-800">
            Welcome, Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your AI-powered overview for today.
          </p>
        </div>

        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <div className="lg:row-span-2">
          <AiChat />
        </div>

        <div className="lg:col-span-1">
          <InventoryAlerts />
        </div>

        <div className="lg:col-span-1">
          <TopMenuItems />
        </div>
        
        <div className="lg:col-span-3">
          <MenuOptimization />
        </div>
      </div>
    </div>
  );
}
