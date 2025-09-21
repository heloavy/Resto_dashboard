'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { UnifiedAiInsights } from './UnifiedAiInsights';

function InsightsSkeleton() {
  return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="w-full h-[380px] rounded-lg" />
          <Skeleton className="w-full h-[380px] rounded-lg" />
          <Skeleton className="w-full h-[380px] rounded-lg" />
      </div>
  );
}

export function UnifiedAiInsightsLoader() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <InsightsSkeleton />;
  }

  return <UnifiedAiInsights />;
}
