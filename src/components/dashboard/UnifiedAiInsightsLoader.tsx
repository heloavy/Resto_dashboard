'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const UnifiedAiInsightsLoader = dynamic(() => import('./UnifiedAiInsights').then(mod => mod.UnifiedAiInsights), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Skeleton className="w-full h-[350px] rounded-lg" />
        <Skeleton className="w-full h-[350px] rounded-lg" />
        <Skeleton className="w-full h-[350px] rounded-lg" />
    </div>
  )
});
