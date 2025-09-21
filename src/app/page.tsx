import { AiChat } from '@/components/dashboard/AiChat';
import { InventoryAlerts } from '@/components/dashboard/InventoryAlerts';
import { MenuOptimization } from '@/components/dashboard/MenuOptimization';
import { SalesChartLoader } from '@/components/dashboard/SalesChartLoader';
import { TopMenuItems } from '@/components/dashboard/TopMenuItems';

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your AI-powered overview for today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 xl:col-span-2">
          <SalesChartLoader />
        </div>

        <div className="xl:row-span-2">
          <AiChat />
        </div>
        
        <div className="md:col-span-1 xl:col-span-1">
          <InventoryAlerts />
        </div>

        <div className="md:col-span-1 xl:col-span-1">
          <TopMenuItems />
        </div>
        
        <div className="md:col-span-2 xl:col-span-3">
          <MenuOptimization />
        </div>
      </div>
    </div>
  );
}
