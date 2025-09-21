import { getMenuOptimizationSuggestions } from "@/ai/flows/menu-optimization-suggestions";
import { menuItems } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, TrendingDown, Trash2 } from "lucide-react";

const suggestionTypeIcons = {
  price_adjustment: <TrendingUp className="h-4 w-4 text-green-600" />,
  item_removal: <Trash2 className="h-4 w-4 text-red-600" />,
  promotion: <TrendingDown className="h-4 w-4 text-blue-600" />,
  default: <Lightbulb className="h-4 w-4 text-yellow-500" />
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

export async function MenuOptimization() {
  const { suggestions } = await getMenuOptimizationSuggestions({
    menuData: JSON.stringify(menuItems),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary h-5 w-5" />
          AI Menu Optimization
        </CardTitle>
        <CardDescription>
          Actionable suggestions to boost profitability and performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Menu Item</TableHead>
                  <TableHead className="w-[200px]">Suggestion</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((suggestion, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{suggestion.item}</TableCell>
                    <TableCell>
                      <Badge variant={getSuggestionBadgeVariant(suggestion.suggestionType)} className="capitalize">
                        {suggestion.suggestionType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{suggestion.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
           <div className="text-center text-muted-foreground py-8">
            <p>No optimization suggestions at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
