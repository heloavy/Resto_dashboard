'use client';

import React from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { TrendingUp } from 'lucide-react';

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
        <div className="p-3 rounded-lg shadow-lg bg-card border border-border/50 text-sm animate-in fade-in-0 zoom-in-95" style={{ background: 'hsl(var(--card) / 0.9)', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}>
            <p className="text-lg font-bold text-primary mb-2">{label}</p>
            {payload.map((pld: any, index: number) => {
                const name = pld.dataKey as 'historical' | 'predicted';
                const value = pld.value;
                return (
                    <div key={index} className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${name === 'predicted' ? 'bg-primary' : 'bg-chart-3'}`}/>
                        <div className="flex justify-between w-full items-center">
                            <span className="capitalize text-muted-foreground">{chartConfig[name].label}:</span>
                            <span className="ml-4 font-bold text-foreground">${Number(value).toLocaleString()}</span>
                        </div>
                    </div>
                )
            })}
        </div>
      );
    }
  
    return null;
};

export function SalesChart() {
    const [isClient, setIsClient] = React.useState(false);
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <Card className="bg-card/50 border-0 shadow-lg h-[432px] w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Sales Forecasting
                </CardTitle>
                <CardDescription>Historical vs. AI-Predicted Sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <p className="text-muted-foreground">Loading chart...</p>
                </div>
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
              <Bar dataKey="historical" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} barSize={30} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
