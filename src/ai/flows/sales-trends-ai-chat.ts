'use server';

/**
 * @fileOverview An AI agent that provides sales trends information based on user queries.
 *
 * - getSalesTrends - A function that handles the sales trends retrieval process.
 * - GetSalesTrendsInput - The input type for the getSalesTrends function.
 * - GetSalesTrendsOutput - The return type for the getSalesTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { menuItems } from '@/lib/mock-data';

const GetSalesTrendsInputSchema = z.object({
  query: z.string().describe('The user query about sales trends.'),
  menuItems: z.string().describe('JSON string of all menu items and their sales data.'),
});
export type GetSalesTrendsInput = z.infer<typeof GetSalesTrendsInputSchema>;

const GetSalesTrendsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query about sales trends. The response should be well-presented, structured, direct, and precise.'),
});
export type GetSalesTrendsOutput = z.infer<typeof GetSalesTrendsOutputSchema>;

export async function getSalesTrends(input: {query: string}): Promise<GetSalesTrendsOutput> {
  const menuData = JSON.stringify(menuItems, null, 2);
  return getSalesTrendsFlow({ query: input.query, menuItems: menuData });
}

const prompt = ai.definePrompt({
  name: 'getSalesTrendsPrompt',
  input: {schema: GetSalesTrendsInputSchema},
  output: {schema: GetSalesTrendsOutputSchema},
  prompt: `You are a helpful assistant for restaurant owners, specializing in sales data analysis.
  You can answer questions about sales trends based on the provided menu data.
  Your answers should be well-presented, structured, direct, and precise. Use markdown for formatting where appropriate (e.g., lists, bolding).

  Here is the menu and sales data:
  \`\`\`json
  {{{menuItems}}}
  \`\`\`

  Analyze the data and answer the user's query.

  User query: {{{query}}}`,
});

const getSalesTrendsFlow = ai.defineFlow(
  {
    name: 'getSalesTrendsFlow',
    inputSchema: GetSalesTrendsInputSchema,
    outputSchema: GetSalesTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
