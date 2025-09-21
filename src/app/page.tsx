import { AiChat } from '@/components/dashboard/AiChat';
import { SalesChartLoader } from '@/components/dashboard/SalesChartLoader';
import { UnifiedAiInsightsLoader } from '@/components/dashboard/UnifiedAiInsightsLoader';

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChartLoader />
        </div>
        <div className="lg:row-span-2">
          <AiChat />
        </div>
        <div className="lg:col-span-3">
          <UnifiedAiInsightsLoader />
        </div>
      </div>
    </div>
  );
}
