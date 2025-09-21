'use server';
/**
 * @fileOverview A unified flow to generate insights for the main dashboard.
 * This combines menu optimization, inventory alerts, and top items into a single AI call
 * to avoid hitting rate limits.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const UnifiedDashboardInputSchema = z.object({
  menuData: z
    .string()
    .describe('A stringified JSON array of all menu items, including name, price, and sales data.'),
  inventoryData: z
    .string()
    .describe('A stringified JSON array of inventory items, including current stock, reorder points, and units.'),
});
export type UnifiedDashboardInput = z.infer<typeof UnifiedDashboardInputSchema>;

// Output Schema
const MenuSuggestionSchema = z.object({
  item: z.string().describe('The name of the menu item.'),
  suggestionType: z
    .string()
    .describe('The type of suggestion, such as "price_adjustment" or "item_removal".'),
  details: z.string().describe('Detailed explanation of the suggestion.'),
});

const InventoryAlertSchema = z.object({
  itemName: z.string().describe('The name of the item that is low in stock.'),
  currentStock: z.number().describe('The current stock level.'),
  unit: z.string().describe('The unit of the mentioned item'),
  reorderQuantity: z.number().describe('The suggested reorder quantity.'),
  reason: z.string().describe('The reasoning behind the reorder suggestion.'),
});

const TopMenuItemSchema = z.object({
  name: z.string().describe('The name of the menu item.'),
  sales: z.number().describe('The number of sales for this item.'),
  imageUrl: z.string().describe('URL for an image of the item.'),
  imageHint: z.string().describe('A hint for AI image generation, e.g., "cappuccino coffee".'),
});

const UnifiedDashboardOutputSchema = z.object({
  menuSuggestions: z.array(MenuSuggestionSchema).describe('An array of menu optimization suggestions.'),
  inventoryAlerts: z.array(InventoryAlertSchema).describe('An array of inventory alerts for items low in stock.'),
  topMenuItems: z.array(TopMenuItemSchema).describe('The top 3 best-selling menu items.'),
});
export type UnifiedDashboardOutput = z.infer<typeof UnifiedDashboardOutputSchema>;


// The exported function that will be called from the component
export async function getUnifiedDashboardInsights(input: UnifiedDashboardInput): Promise<UnifiedDashboardOutput> {
  return unifiedDashboardInsightsFlow(input);
}


// The Genkit Prompt
const prompt = ai.definePrompt({
  name: 'unifiedDashboardPrompt',
  input: { schema: UnifiedDashboardInputSchema },
  output: { schema: UnifiedDashboardOutputSchema },
  prompt: `You are a restaurant consultant AI. Your task is to analyze menu and inventory data to provide a unified set of insights for a restaurant owner's dashboard.

  1.  **Menu Optimization:** Analyze the provided menu data. Provide 2-3 specific, actionable suggestions for improving profitability. Suggestions may include price adjustments, item removals, or promotions. Consider sales data and item popularity.
  2.  **Inventory Alerts:** Analyze the inventory data. Identify items where the current stock is below the reorder point. For each, suggest a reorder quantity and provide a brief reason.
  3.  **Top Selling Items:** From the menu data, identify the top 3 best-selling items based on their 'sales' number.

  Here is the data:
  Menu Data (includes sales):
  {{{menuData}}}

  Inventory Data:
  {{{inventoryData}}}

  Format your response strictly as a single JSON object adhering to the specified output schema.
  `,
});

// The Genkit Flow
const unifiedDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'unifiedDashboardInsightsFlow',
    inputSchema: UnifiedDashboardInputSchema,
    outputSchema: UnifiedDashboardOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
