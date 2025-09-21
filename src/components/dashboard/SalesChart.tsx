"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
    color: "hsl(var(--chart-1))",
  },
};

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Forecasting</CardTitle>
        <CardDescription>Historical vs. Predicted Sales for the Year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={salesData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 bg-[${chartConfig[name as keyof typeof chartConfig].color}]`}/>
                      <div className="flex justify-between w-full">
                        <span>{chartConfig[name as keyof typeof chartConfig].label}:</span>
                        <span className="ml-4 font-bold">${value.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                 />}
              />
              <Bar dataKey="historical" fill="var(--color-historical)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted" fill="var(--color-predicted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
