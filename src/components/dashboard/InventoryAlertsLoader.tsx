'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const InventoryAlertsLoader = dynamic(() => import('./InventoryAlerts').then(mod => mod.InventoryAlerts), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px] rounded-lg" />
});
