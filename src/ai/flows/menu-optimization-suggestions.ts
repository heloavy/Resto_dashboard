'use server';

/**
 * @fileOverview Menu optimization AI agent.
 *
 * - getMenuOptimizationSuggestions - A function that handles the menu optimization process.
 * - MenuOptimizationInput - The input type for the getMenuOptimizationSuggestions function.
 * - MenuOptimizationOutput - The return type for the getMenuOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MenuOptimizationInputSchema = z.object({
  menuData: z
    .string()
    .describe('A stringified JSON array containing menu item objects, each with properties like name, price, and sales data.'),
});
export type MenuOptimizationInput = z.infer<typeof MenuOptimizationInputSchema>;

const MenuOptimizationOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      item: z.string().describe('The name of the menu item.'),
      suggestionType: z
        .string()
        .describe(
          'The type of suggestion, such as "price_adjustment" or "item_removal".'
        ),
      details: z.string().describe('Detailed explanation of the suggestion.'),
    })
  ).describe('An array of menu optimization suggestions.'),
});
export type MenuOptimizationOutput = z.infer<typeof MenuOptimizationOutputSchema>;

export async function getMenuOptimizationSuggestions(
  input: MenuOptimizationInput
): Promise<MenuOptimizationOutput> {
  return menuOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'menuOptimizationPrompt',
  input: {schema: MenuOptimizationInputSchema},
  output: {schema: MenuOptimizationOutputSchema},
  prompt: `You are a restaurant consultant specializing in menu optimization.

You will analyze the provided menu data and provide specific, actionable suggestions for improving profitability. Suggestions may include price adjustments, item removals, or other changes.

Consider sales data, item popularity, and potential cost savings when making your recommendations.

Menu Data:
{{menuData}}

Format your response as a JSON array of suggestions.
Each suggestion should include the item name, suggestion type (e.g., "price_adjustment", "item_removal"), and a detailed explanation.
`,
});

const menuOptimizationFlow = ai.defineFlow(
  {
    name: 'menuOptimizationFlow',
    inputSchema: MenuOptimizationInputSchema,
    outputSchema: MenuOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

