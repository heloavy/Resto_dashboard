import { generateInventoryAlert } from "@/ai/flows/inventory-alerts";
import { inventoryDataForAlerts } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TriangleAlert, Package, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function InventoryAlerts() {
  const { alerts } = await generateInventoryAlert(inventoryDataForAlerts);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TriangleAlert className="text-destructive h-5 w-5" />
          Inventory Alerts
        </CardTitle>
        <CardDescription>Items running low that need your attention.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.itemName} className="p-3 bg-secondary rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{alert.itemName}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-destructive">{alert.currentStock} {alert.unit}</span> left
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span>Suggested Reorder: <strong className="font-semibold">{alert.reorderQuantity} {alert.unit}</strong></span>
                  </div>
                  <p className="text-xs text-muted-foreground italic pt-1">
                    {alert.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Package className="h-10 w-10 mx-auto mb-2" />
            <p>Inventory levels look good!</p>
            <p className="text-xs">No alerts to show right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
