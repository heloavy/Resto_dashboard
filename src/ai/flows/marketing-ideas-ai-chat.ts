'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating marketing ideas for today's special.
 *
 * The flow takes no input and returns a string containing marketing ideas for the special.
 * It uses the `ai.definePrompt` to interact with the LLM.
 *
 * @interface MarketingIdeasOutput - The output type for the marketing ideas flow.
 * @function getMarketingIdeas - A function that calls the marketing ideas flow and returns the result.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingIdeasInputSchema = z.object({
  todaysSpecial: z.string().describe("Today's special menu item"),
});

const MarketingIdeasOutputSchema = z.object({
  marketingIdeas: z.string().describe('Creative marketing ideas for today\'s special.'),
});

export type MarketingIdeasOutput = z.infer<typeof MarketingIdeasOutputSchema>;

async function getMarketingIdeas(
  input: z.infer<typeof MarketingIdeasInputSchema>
): Promise<MarketingIdeasOutput> {
  return marketingIdeasFlow(input);
}

export {getMarketingIdeas};

const marketingIdeasPrompt = ai.definePrompt({
  name: 'marketingIdeasPrompt',
  input: {schema: MarketingIdeasInputSchema},
  output: {schema: MarketingIdeasOutputSchema},
  prompt: `You are a marketing expert for restaurants and cafes. Generate creative marketing ideas for today's special. Consider current trends, popular promotions, and effective strategies to attract more customers. The ideas should be engaging and actionable.

  Today's special is {{todaysSpecial}}.
  `,
});

const marketingIdeasFlow = ai.defineFlow(
  {
    name: 'marketingIdeasFlow',
    inputSchema: MarketingIdeasInputSchema,
    outputSchema: MarketingIdeasOutputSchema,
  },
  async (input) => {
    const {
      output,
    } = await marketingIdeasPrompt(input);
    return output!;
  }
);
