'use client';

import React from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const salesData = [
  { month: "Jan", historical: 18600, predicted: 22000 },
  { month: "Feb", historical: 30500, predicted: 29000 },
  { month: "Mar", historical: 23700, predicted: 25000 },
  { month: "Apr", historical: 27300, predicted: 28000 },
  { month: "May", historical: 20900, predicted: 24000 },
  { month: "Jun", historical: 21400, predicted: 23000 },
  { month: "Jul", historical: null, predicted: 31000 },
  { month: "Aug", historical: null, predicted: 33000 },
  { month: "Sep", historical: null, predicted: 35000 },
];

const TrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);


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

export function SalesChart() {
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
                content={<ChartTooltipContent
                  formatter={(value: number, name: 'historical' | 'predicted') => (
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${name === 'predicted' ? 'bg-primary' : 'bg-chart-3'}`}/>
                      <div className="flex justify-between w-full items-center">
                        <span className="capitalize">{chartConfig[name].label}:</span>
                        <span className="ml-4 font-bold text-foreground">${value.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  labelClassName="text-lg font-bold text-primary"
                  wrapperStyle={{ background: 'hsl(var(--card) / 0.9)', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}
                />}
              />
              <Bar dataKey="historical" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} barSize={30} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
