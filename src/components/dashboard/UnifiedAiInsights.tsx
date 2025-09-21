'use client';

import { useEffect, useState } from 'react';
import { getUnifiedDashboardInsights, type UnifiedDashboardOutput } from "@/ai/flows/unified-dashboard-insights";
import { inventoryDataForAlerts, menuItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TriangleAlert, Trophy, ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import { Skeleton } from '@/components/ui/skeleton';

const mockInsights: UnifiedDashboardOutput = {
    menuSuggestions: [
      {
        item: 'Cappuccino',
        suggestionType: 'price_adjustment',
        details: 'High sales volume suggests a small price increase could boost profitability without impacting demand.',
      },
      {
        item: 'Avocado Toast',
        suggestionType: 'promotion',
        details: 'Sales are moderate. Consider a "combo" offer with a coffee to increase sales.',
      },
    ],
    inventoryAlerts: [
      {
        itemName: 'Coffee Beans',
        currentStock: 8,
        unit: 'kg',
        reorderQuantity: 10,
        reason: 'Stock is below reorder point of 10kg. Reordering now prevents a potential shortage during peak hours.',
      },
      {
        itemName: 'Avocado',
        currentStock: 5,
        unit: 'kg',
        reorderQuantity: 5,
        reason: 'Nearing the reorder point of 8kg. Demand is consistent, better to restock soon.',
      },
    ],
    topMenuItems: [
      {
        name: 'Croissant',
        sales: 200,
        imageUrl: 'https://picsum.photos/seed/102/200/200',
        imageHint: 'croissant pastry',
      },
      {
        name: 'Cappuccino',
        sales: 150,
        imageUrl: 'https://picsum.photos/seed/101/200/200',
        imageHint: 'cappuccino coffee',
      },
      {
        name: 'Cheeseburger',
        sales: 120,
        imageUrl: 'https://picsum.photos/seed/104/200/200',
        imageHint: 'cheeseburger fries',
      },
    ],
};


const getSuggestionBadgeVariant = (suggestionType: string) => {
    switch (suggestionType) {
        case 'price_adjustment':
            return 'default';
        case 'item_removal':
            return 'destructive';
        case 'promotion':
            return 'secondary';
        default:
            return 'outline';
    }
}

function InsightsSkeleton() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Skeleton className="w-full h-[380px] rounded-lg" />
            <Skeleton className="w-full h-[380px] rounded-lg" />
            <Skeleton className="w-full h-[380px] rounded-lg" />
        </div>
    );
}

export function UnifiedAiInsights() {
  const [insights, setInsights] = useState<UnifiedDashboardOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      setIsLoading(true);
      try {
        const result = await getUnifiedDashboardInsights({
          menuData: JSON.stringify(menuItems),
          inventoryData: JSON.stringify(inventoryDataForAlerts.inventoryItems),
        });
        setInsights(result);
      } catch (e: any) {
        console.error("Failed to load live AI insights, falling back to mock data:", e);
        // Fallback to mock data on error
        setInsights(mockInsights);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  if (isLoading) {
    return <InsightsSkeleton />;
  }
  
  if (!insights) {
     return (
        <div className="text-center text-muted-foreground bg-secondary/30 p-8 rounded-lg">
            <TriangleAlert className="h-10 w-10 mx-auto mb-4 text-primary" />
            <p className="font-semibold">Could not load AI insights.</p>
            <p className="text-sm">There was an issue fetching data. Please try again later.</p>
        </div>
     )
  }

  const { menuSuggestions, inventoryAlerts, topMenuItems } = insights;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Menu Items */}
        <Card className="bg-card/50 border-0 shadow-lg xl:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
                <Trophy className="text-amber-400 h-5 w-5" />
                Top Selling Items
                </CardTitle>
                <CardDescription>Your most popular items this month.</CardDescription>
            </CardHeader>
            <CardContent>
                {topMenuItems && topMenuItems.length > 0 ? (
                <ul className="space-y-4">
                    {topMenuItems.map((item, index) => (
                    <li key={item.name} className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-secondary/50">
                        <div className="font-bold text-lg text-primary w-6 text-center">{index + 1}</div>
                        <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="rounded-md object-cover h-14 w-14 border-2 border-secondary"
                        data-ai-hint={item.imageHint}
                        />
                        <div className="flex-1">
                        <p className="font-semibold text-foreground/90">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sales} sold</p>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center text-muted-foreground py-8">
                    <Trophy className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">No best-sellers yet!</p>
                    <p className="text-xs">Sales data is just getting started.</p>
                </div>
                )}
            </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="bg-card/50 border-0 shadow-lg xl:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
                <TriangleAlert className="text-destructive h-5 w-5" />
                Inventory Alerts
                </CardTitle>
                <CardDescription>Items running low that need your attention.</CardDescription>
            </CardHeader>
            <CardContent>
                {inventoryAlerts && inventoryAlerts.length > 0 ? (
                <div className="space-y-4">
                    {inventoryAlerts.map((alert) => (
                    <div key={alert.itemName} className="p-4 bg-secondary/50 rounded-lg transition-all hover:bg-secondary/80">
                        <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{alert.itemName}</h3>
                            <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-destructive">{alert.currentStock} {alert.unit}</span> left
                            </p>
                        </div>
                        <Badge variant="destructive" className="shadow-md">Low Stock</Badge>
                        </div>
                        <div className="mt-3 text-sm space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <ShoppingCart className="h-4 w-4" />
                            <span>Suggested Reorder: <strong className="font-semibold text-foreground/90">{alert.reorderQuantity} {alert.unit}</strong></span>
                        </div>
                        <p className="text-xs text-muted-foreground italic pt-1 border-t border-border pt-2">
                            {alert.reason}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center text-muted-foreground py-8">
                    <Package className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Inventory levels look good!</p>
                    <p className="text-xs">No alerts to show right now.</p>
                </div>
                )}
            </CardContent>
        </Card>

        {/* Menu Optimization */}
        <Card className="bg-card/50 border-0 shadow-lg xl:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
                <Lightbulb className="text-primary h-5 w-5" />
                AI Menu Optimization
                </CardTitle>
                <CardDescription>
                Actionable suggestions to boost profitability.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {menuSuggestions && menuSuggestions.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-secondary/80">
                        <TableHead>Menu Item</TableHead>
                        <TableHead>Suggestion</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuSuggestions.map((suggestion, index) => (
                        <TableRow key={index} className="border-b-secondary/50 hover:bg-secondary/40">
                            <TableCell className="font-medium">{suggestion.item}</TableCell>
                            <TableCell>
                            <Badge variant={getSuggestionBadgeVariant(suggestion.suggestionType)} className="capitalize shadow-md">
                                {suggestion.suggestionType.replace('_', ' ')}
                            </Badge>
                             <p className="text-xs text-muted-foreground mt-2">{suggestion.details}</p>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                ) : (
                <div className="text-center text-muted-foreground py-8">
                    <Lightbulb className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">No optimization suggestions.</p>
                    <p className="text-xs">Your menu is performing well!</p>
                </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
