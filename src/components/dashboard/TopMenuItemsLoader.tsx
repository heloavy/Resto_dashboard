'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const TopMenuItemsLoader = dynamic(() => import('./TopMenuItems').then(mod => mod.TopMenuItems), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />
});
