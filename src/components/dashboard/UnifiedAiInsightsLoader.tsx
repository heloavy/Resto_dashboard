'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

function InsightsSkeleton() {
  return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="w-full h-[380px] rounded-lg" />
          <Skeleton className="w-full h-[380px] rounded-lg" />
          <Skeleton className="w-full h-[380px] rounded-lg" />
      </div>
  );
}

export const UnifiedAiInsightsLoader = dynamic(
    () => import('./UnifiedAiInsights').then(mod => mod.UnifiedAiInsights), 
    {
        ssr: false,
        loading: () => <InsightsSkeleton />
    }
);
