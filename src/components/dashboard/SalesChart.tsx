'use client';

import React, { useState, useEffect } from 'react';
import { Bar, ComposedChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// --- UI & Data Mocks (for standalone demonstration) ---
// In a real app, these would be imported from a UI library like shadcn/ui.

const Card = ({ children, className }: any) => <div className={`rounded-2xl border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className }: any) => <div className={`p-6 pt-2 ${className}`}>{children}</div>;
const ChartContainer = ({ children, className, config }: any) => <div className={className}>{children}</div>;

const MoreHorizontal = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
    </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// --- Chart Data & Config ---

const funnelData = [
  { stage: 'Initiated Payments', value: 65200 },
  { stage: 'Authorized Payments', value: 54800 },
  { stage: 'Successful Payments', value: 48600, conversion: 89, dropOff: -11 },
  { stage: 'Payouts to Merchants', value: 38300 },
  { stage: 'Completed Transactions', value: 32900 },
];

const chartConfig = {
  payments: {
    label: "Payments",
    color: "hsl(var(--chart-1))",
  },
};


// --- Custom Components ---

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Special styling for the 'Successful Payments' tooltip as shown in the image
    if (data.stage === 'Successful Payments') {
        return (
             <div className="p-2 rounded-md shadow-lg bg-gray-900 text-white text-xs animate-in fade-in-0 zoom-in-95">
                <p>
                    <span className="font-bold">{`${(data.value / 1000).toFixed(1)}k transactions`}</span>
                    <span className="text-gray-400"> | </span>
                    <span>Conversion: {data.conversion}%</span>
                    <span className="text-gray-400"> | </span>
                    <span>Drop-off: {data.dropOff}%</span>
                </p>
             </div>
        )
    }
    // Default tooltip for other bars
    return (
      <div className="p-3 rounded-lg shadow-lg bg-card border border-border/50 text-sm animate-in fade-in-0 zoom-in-95">
        <p className="font-bold text-foreground mb-1">{`${data.value.toLocaleString()} transactions`}</p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
    // Add a guard to prevent errors if payload is not structured as expected during render
    if (!payload || typeof payload.payload === 'undefined') {
        return null;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12}>
          <tspan x="0" dy="0em">{payload.value}</tspan>
          <tspan x="0" dy="1.2em" className="font-semibold text-foreground">{`${(payload.payload.value / 1000).toFixed(1)}k`}</tspan>
        </text>
      </g>
    );
};


// --- Main Chart Component ---

export function SalesChart() {
    return (
        <Card className="shadow-sm w-full max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <CardTitle className="tracking-tight text-xl font-bold">Payments</CardTitle>
            </div>
            <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <ComposedChart data={funnelData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }} barCategoryGap="20%">
                  <defs>
                     <linearGradient id="fillPaymentsBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    </linearGradient>
                    <pattern id="pattern-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="1" height="6" fill="#3b82f6" fillOpacity="0.4"></rect>
                    </pattern>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="hsl(var(--border) / 0.7)" />
                  <XAxis
                    dataKey="stage"
                    tickLine={false}
                    axisLine={false}
                    tick={<CustomXAxisTick />}
                    height={50}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 75000]}
                    ticks={[30000, 40000, 50000, 60000, 70000]}
                    tickFormatter={(value) => `${Number(value) / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={50}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsla(221, 83%, 90%, 0.2)' }}
                    content={<CustomTooltip />}
                  />
                   <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#pattern-stripe)" />
                  <Bar dataKey="value" fill="url(#fillPaymentsBar)" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
             <div className="mt-4 p-4 border-t border-border/70">
                <div className="flex items-center gap-3">
                    <SearchIcon className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">What would you like to explore next?</p>
                </div>
                <p className="text-sm mt-3">
                    <span className="text-muted-foreground">I want to know what caused the drop-off from authorized to </span>
                    <a href="#" className="text-primary font-semibold hover:underline">/successful payments</a>
                </p>
             </div>
          </CardContent>
        </Card>
      );
}

// --- Placeholder for Server/Initial Render ---
const SalesChartPlaceholder = () => (
    <div className="shadow-sm w-full max-w-3xl mx-auto rounded-2xl border bg-card p-6" style={{height: '550px'}}>
        <div className="flex flex-row items-start justify-between">
            <div className="tracking-tight text-xl font-bold">Payments</div>
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="h-[300px] w-full flex items-center justify-center mt-2">
            <p className="text-muted-foreground">Loading chart...</p>
        </div>
    </div>
);


// --- Page Wrapper & Client-Side Rendering Fix ---
export default function SalesChartPage() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return (
        <div className="bg-background text-foreground min-h-screen p-8 flex items-center justify-center">
            <style>{`
                :root {
                    --background: 240 10% 98%;
                    --foreground: 240 10% 3.9%;
                    --card: 255 100% 100%;
                    --card-foreground: 240 10% 3.9%;
                    --primary: 221 83% 53%;
                    --primary-foreground: 0 0% 100%;
                    --muted-foreground: 240 3.8% 46.1%;
                    --border: 240 5.9% 90%;
                    --chart-1: 221 83% 53%;
                    --red-500: #ef4444;
                }
                body {
                     background-color: hsl(var(--background));
                     color: hsl(var(--foreground));
                     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                }
                .bg-card { background-color: hsl(var(--card)); }
                .text-card-foreground { color: hsl(var(--card-foreground)); }
                .border { border: 1px solid hsl(var(--border)); }
                .text-muted-foreground { color: hsl(var(--muted-foreground)); }
                .text-primary { color: hsl(var(--primary)); }
                .text-foreground { color: hsl(var(--foreground)); }
                .text-red-500 { color: var(--red-500); }
                .font-semibold { font-weight: 600; }
                .hover\\:underline:hover { text-decoration: underline; }
                .bg-gray-900 { background-color: #111827; }
                .text-white { color: #fff; }
                .text-gray-400 { color: #9ca3af; }

                /* Animation classes for tooltip */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }
                .animate-in { animation: fadeIn 0.3s ease-out, zoomIn 0.3s ease-out; }
            `}</style>
            
            {hasMounted ? <SalesChart /> : <SalesChartPlaceholder />}

        </div>
    );
}

