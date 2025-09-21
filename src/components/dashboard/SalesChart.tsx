"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, ComposedChart, AreaChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { salesData } from "@/lib/mock-data";

const chartConfig = {
  historical: {
    label: "Historical",
    color: "hsl(var(--chart-3))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--primary))",
  },
};

export function SalesChart() {
  return (
    <Card className="bg-card/50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">Sales Forecasting</CardTitle>
        <CardDescription>Historical vs. AI-Predicted Sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <AreaChart data={salesData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                 <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
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
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 bg-${name === 'predicted' ? 'primary' : 'chart-3'}`}/>
                      <div className="flex justify-between w-full items-center">
                        <span className="capitalize">{name}:</span>
                        <span className="ml-4 font-bold text-foreground">${(value as number).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                 />}
                 wrapperStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
              />
              <Area type="monotone" dataKey="historical" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorHistorical)" strokeWidth={2} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
