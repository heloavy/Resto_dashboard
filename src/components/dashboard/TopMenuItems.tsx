import { menuItems, MenuItem } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Image from "next/image";

export function TopMenuItems() {
  const topItems = [...menuItems].sort((a, b) => b.sales - a.sales).slice(0, 3);

  return (
    <Card className="bg-card/50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline tracking-tight">
          <Trophy className="text-amber-400 h-5 w-5" />
          Top Selling Items
        </CardTitle>
        <CardDescription>Your most popular items this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {topItems.map((item, index) => (
            <li key={item.id} className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-secondary/50">
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
      </CardContent>
    </Card>
  );
}
