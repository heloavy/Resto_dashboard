'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { salesData } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  historical: {
    label: "Historical",
    color: "hsl(var(--chart-3))",
  },
  predicted: {
    label: "AI Predicted",
    color: "hsl(var(--primary))",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg shadow-lg bg-card/90 border border-border/50 text-sm backdrop-blur-sm">
        <p className="font-bold text-foreground mb-2 text-base">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full mr-2 bg-[${entry.color}]`}/>
            <div className="flex justify-between w-full items-center">
              <span className="capitalize text-muted-foreground">{entry.name}:</span>
              <span className="ml-4 font-bold text-foreground">${(entry.value as number).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="bg-card/50 border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
           <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card/50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
          <TrendingUp className="h-5 w-5 text-primary" />
          Sales Forecasting
        </CardTitle>
        <CardDescription>Historical vs. AI-Predicted Sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                width={50}
              />
              <Tooltip
                cursor={{ fill: 'hsla(var(--primary) / 0.1)' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="historical" name="Historical" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} barSize={30} />
              <Area type="monotone" name="Predicted" dataKey="predicted" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
