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

const GetSalesTrendsInputSchema = z.object({
  query: z.string().describe('The user query about sales trends.'),
});
export type GetSalesTrendsInput = z.infer<typeof GetSalesTrendsInputSchema>;

const GetSalesTrendsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query about sales trends.'),
});
export type GetSalesTrendsOutput = z.infer<typeof GetSalesTrendsOutputSchema>;

export async function getSalesTrends(input: GetSalesTrendsInput): Promise<GetSalesTrendsOutput> {
  return getSalesTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSalesTrendsPrompt',
  input: {schema: GetSalesTrendsInputSchema},
  output: {schema: GetSalesTrendsOutputSchema},
  prompt: `You are a helpful assistant for restaurant owners.
You can answer questions about sales trends.

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
