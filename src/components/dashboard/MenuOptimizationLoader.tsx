'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const MenuOptimizationLoader = dynamic(() => import('./MenuOptimization').then(mod => mod.MenuOptimization), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[250px] rounded-lg" />
});
