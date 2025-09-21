'use server';

/**
 * @fileOverview Inventory management alerts and reorder suggestions.
 *
 * - generateInventoryAlert - A function that generates an inventory alert with reorder suggestions.
 * - InventoryAlertInput - The input type for the generateInventoryAlert function.
 * - InventoryAlertOutput - The return type for the generateInventoryAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InventoryItemSchema = z.object({
  name: z.string().describe('The name of the inventory item.'),
  currentStock: z.number().describe('The current stock level of the item.'),
  unit: z.string().describe('The unit of measure for the item (e.g., kg, lb, count).'),
  reorderPoint: z.number().describe('The reorder point for the item.'),
  historicalUsage: z
    .array(z.object({date: z.string(), quantity: z.number()}))
    .describe('Historical usage data for the item.'),
});

const InventoryAlertInputSchema = z.object({
  inventoryItems: z.array(InventoryItemSchema).describe('The list of inventory items to check.'),
});
export type InventoryAlertInput = z.infer<typeof InventoryAlertInputSchema>;

const InventoryAlertOutputSchema = z.object({
  alerts: z.array(
    z.object({
      itemName: z.string().describe('The name of the item that is low in stock.'),
      currentStock: z.number().describe('The current stock level.'),
      reorderQuantity: z.number().describe('The suggested reorder quantity.'),
      unit: z.string().describe('The unit of the mentioned item'),
      reason: z.string().describe('The reasoning behind the reorder suggestion.'),
    })
  ),
});
export type InventoryAlertOutput = z.infer<typeof InventoryAlertOutputSchema>;

export async function generateInventoryAlert(input: InventoryAlertInput): Promise<InventoryAlertOutput> {
  return inventoryAlertFlow(input);
}

const inventoryAlertPrompt = ai.definePrompt({
  name: 'inventoryAlertPrompt',
  input: {schema: InventoryAlertInputSchema},
  output: {schema: InventoryAlertOutputSchema},
  prompt: `You are an AI assistant designed to generate inventory alerts and reorder suggestions for restaurant owners.

  Given the current inventory levels, reorder points, and historical usage data, identify items that are running low and suggest appropriate reorder quantities.

  Here is the inventory information:
  {{#each inventoryItems}}
    - Item Name: {{this.name}}
      Current Stock: {{this.currentStock}} {{this.unit}}
      Reorder Point: {{this.reorderPoint}} {{this.unit}}
      Historical Usage Data:
      {{#each this.historicalUsage}}
        - Date: {{this.date}}, Quantity: {{this.quantity}} {{../this.unit}}
      {{/each}}
  {{/each}}

  Only include items in the alert if the current stock is below the reorder point.

  Provide a clear and concise reason for each reorder suggestion.
  Strictly adhere to the output schema provided. The output should be a JSON object that is parseable by Typescript. Only include alerts for items that are below their reorder point.
  Make sure the units are attached to the values.
  `,
});

const inventoryAlertFlow = ai.defineFlow(
  {
    name: 'inventoryAlertFlow',
    inputSchema: InventoryAlertInputSchema,
    outputSchema: InventoryAlertOutputSchema,
  },
  async input => {
    const {output} = await inventoryAlertPrompt(input);
    return output!;
  }
);
