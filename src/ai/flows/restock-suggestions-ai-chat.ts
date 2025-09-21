'use server';

/**
 * @fileOverview Provides restock suggestions via AI chat.
 *
 * - getRestockSuggestions - A function that returns restock suggestions.
 * - GetRestockSuggestionsInput - The input type for the getRestockSuggestions function.
 * - GetRestockSuggestionsOutput - The return type for the getRestockSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRestockSuggestionsInputSchema = z.object({
  query: z.string().describe('The query for restock suggestions.'),
});
export type GetRestockSuggestionsInput = z.infer<
  typeof GetRestockSuggestionsInputSchema
>;

const GetRestockSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('The restock suggestions based on the query.'),
});
export type GetRestockSuggestionsOutput = z.infer<
  typeof GetRestockSuggestionsOutputSchema
>;

export async function getRestockSuggestions(
  input: GetRestockSuggestionsInput
): Promise<GetRestockSuggestionsOutput> {
  return getRestockSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRestockSuggestionsPrompt',
  input: {schema: GetRestockSuggestionsInputSchema},
  output: {schema: GetRestockSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping restaurant staff manage inventory.
  Based on the user's query, provide intelligent restock suggestions.

  Query: {{{query}}}
  `,
});

const getRestockSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRestockSuggestionsFlow',
    inputSchema: GetRestockSuggestionsInputSchema,
    outputSchema: GetRestockSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
