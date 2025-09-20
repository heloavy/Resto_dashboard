'use server'

import { createAI, getMutableAIState, render } from 'ai/rsc'
import { createGroq } from "@ai-sdk/groq";
import { z } from 'zod'
import { Bot } from 'lucide-react';
import type { ReactNode } from 'react';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

const systemMessage = `
You are a creative and helpful chef's assistant. Your role is to provide inspiring and practical menu item suggestions for a restaurant.
When a user asks for a menu item, you must use the 'suggestMenuItem' tool you have been provided. You should generate creative and appealing names and descriptions.
- Name: The name should be catchy and descriptive.
- Description: Make it sound delicious, highlighting key ingredients and flavors.
- Category: Assign it to one of the available categories.
- Price: Suggest a realistic price.
If the user's query is unclear, ask for clarification. For example, if they say "something with chicken," you could ask if they want an appetizer or a main course.
Politely decline any requests that are not related to food, restaurant menus, or culinary ideas. Your purpose is to help build a great menu.
`.trim();

// Define the schema for the suggestMenuItem tool.
const suggestMenuItemSchema = z.object({
  name: z.string().describe('The creative name of the menu item.'),
  description: z.string().describe('A tantalizing description of the dish.'),
  category: z.enum(["Appetizer", "Main Course", "Dessert", "Beverages", "Specials"]).describe("The menu category."),
  price: z.number().describe('The suggested price for the menu item.'),
});

// Define the AI state and UI state types
export type AIState = Array<{
  role: 'user' | 'assistant' | 'system';
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: 'user' | 'assistant';
  display: ReactNode;
}>;

async function submitUserMessage(userInput: string): Promise<UIState[0]> {
  'use server'
  const aiState = getMutableAIState<typeof AI>()

  // Update AI state with user message.
  aiState.update([...aiState.get(), { role: 'user', content: userInput }])

  const ui = render({
    model: 'llama3-8b-8192', // A freely available model on Groq.
    provider: groq,
    messages: [{ role: 'system', content: systemMessage }, ...aiState.get()],
    text: ({ content, done }: { content: string, done: boolean }) => {
      if (done) {
        aiState.done([...aiState.get(), { role: 'assistant', content }])
      }
      return <div className="flex items-start gap-2"><Bot className="w-5 h-5 text-primary" /><p>{content}</p></div>
    },
    tools: {
      suggestMenuItem: {
        parameters: suggestMenuItemSchema,
        render: async function* ({ name, description, category, price }: z.infer<typeof suggestMenuItemSchema>) {
          yield <div className="p-4 bg-secondary rounded-lg text-sm">Generating suggestion...</div>
          // Update the final AI state.
          aiState.done([...aiState.get(), { role: 'assistant', content: `Suggested item: ${name}` }])

          return (
            <div className="p-4 bg-secondary rounded-lg border">
              <h4 className="font-bold text-md text-primary">AI Suggestion</h4>
              <p className="font-semibold">{name} ({category}) - ${price.toFixed(2)}</p>
              <p className="text-muted-foreground">{description}</p>
            </div>
          )
        },
      },
    },
  })

  return {
    id: Date.now(),
    role: 'assistant' as const,
    display: ui,
  }
}

// Define the initial states for the AI.
const initialAIState: AIState = []
const initialUIState: UIState = []

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
})
