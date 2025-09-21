import { menuItems, MenuItem } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Image from "next/image";

export function TopMenuItems() {
  const topItems = [...menuItems].sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-yellow-500 h-5 w-5" />
          Top Selling Items
        </CardTitle>
        <CardDescription>Your most popular items this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {topItems.map((item, index) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="font-bold text-lg text-primary w-4">{index + 1}</div>
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={48}
                height={48}
                className="rounded-md object-cover h-12 w-12"
                data-ai-hint={item.imageHint}
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.sales} sold</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
