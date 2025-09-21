'use client';

import dynamic from 'next/dynamic';

export const SalesChartLoader = dynamic(() => import('./SalesChart').then(mod => mod.SalesChart), {
  ssr: false,
  loading: () => <div className="w-full max-w-3xl mx-auto rounded-2xl border bg-card p-6 h-[468px] animate-pulse" />
});
