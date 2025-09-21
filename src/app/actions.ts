"use server";

import { getMarketingIdeas } from "@/ai/flows/marketing-ideas-ai-chat";
import { getRestockSuggestions } from "@/ai/flows/restock-suggestions-ai-chat";
import { getSalesTrends } from "@/ai/flows/sales-trends-ai-chat";
import { revalidatePath } from "next/cache";

export async function askSalesTrends(query: string): Promise<string> {
  try {
    const result = await getSalesTrends({ query });
    revalidatePath("/");
    return result.answer;
  } catch (error) {
    console.error(error);
    return "Sorry, I encountered an error while analyzing sales trends.";
  }
}

export async function askRestockSuggestions(query: string): Promise<string> {
  try {
    const result = await getRestockSuggestions({ query });
    revalidatePath("/");
    return result.suggestions;
  } catch (error) {
    console.error(error);
    return "Sorry, I couldn't generate restock suggestions at the moment.";
  }
}

export async function askMarketingIdeas(todaysSpecial: string): Promise<string> {
  try {
    const result = await getMarketingIdeas({ todaysSpecial });
    revalidatePath("/");
    return result.marketingIdeas;
  } catch (error) {
    console.error(error);
    return "Sorry, I'm out of marketing ideas right now.";
  }
}
