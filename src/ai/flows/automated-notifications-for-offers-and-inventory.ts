// A Genkit flow to send automatic email/SMS notifications for special offers or low inventory levels based on AI-tuned parameters.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotificationTuningInputSchema = z.object({
  specialOffers: z.array(
    z.object({
      item: z.string().describe('The name of the menu item on special offer.'),
      discount: z.number().describe('The discount percentage for the offer.'),
      startTime: z.string().datetime().describe('The start time of the offer.'),
      endTime: z.string().datetime().describe('The end time of the offer.'),
    })
  ).optional().describe('Details of any special offers currently running.'),
  lowInventory: z.array(
    z.object({
      item: z.string().describe('The name of the inventory item.'),
      quantity: z.number().describe('The current quantity of the item.'),
      threshold: z.number().describe('The threshold below which a notification should be sent.'),
    })
  ).optional().describe('Details of inventory items that are running low.'),
  historicalSalesData: z.string().describe('Historical sales data to help with tuning.'),
  customerFeedback: z.string().describe('Recent customer feedback to help with tuning.'),
});

export type NotificationTuningInput = z.infer<typeof NotificationTuningInputSchema>;

const NotificationTuningOutputSchema = z.object({
  notifications: z.array(
    z.object({
      type: z.enum(['email', 'sms']).describe('The type of notification to send.'),
      recipient: z.string().describe('The recipient of the notification (email address or phone number).'),
      message: z.string().describe('The content of the notification.'),
    })
  ).describe('A list of notifications to send.'),
});

export type NotificationTuningOutput = z.infer<typeof NotificationTuningOutputSchema>;

export async function generateNotifications(input: NotificationTuningInput): Promise<NotificationTuningOutput> {
  return generateNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'notificationTuningPrompt',
  input: {schema: NotificationTuningInputSchema},
  output: {schema: NotificationTuningOutputSchema},
  prompt: `You are an AI assistant that helps restaurant owners manage notifications for special offers and low inventory.

  Based on the following information, generate a list of notifications to send. Each notification should have a type (email or sms), a recipient (email address or phone number), and a message.

  Special Offers:
  {{#if specialOffers}}
    {{#each specialOffers}}
      - Item: {{item}}, Discount: {{discount}}%, Start Time: {{startTime}}, End Time: {{endTime}}
    {{/each}}
  {{else}}
    No special offers.
  {{/if}}

  Low Inventory:
  {{#if lowInventory}}
    {{#each lowInventory}}
      - Item: {{item}}, Quantity: {{quantity}}, Threshold: {{threshold}}
    {{/each}}
  {{else}}
    No low inventory items.
  {{/if}}

  Historical Sales Data: {{historicalSalesData}}
  Customer Feedback: {{customerFeedback}}

  Consider the historical sales data and customer feedback when deciding who to send notifications to and what the message should be. For example, if a customer frequently orders a particular item, they might be interested in a special offer for that item. Or, if a customer has complained about a particular item being out of stock, they should be notified when that item is back in stock.

  Prioritize SMS notifications for urgent low inventory situations and email notifications for special offers and less urgent situations.

  Format the response as a JSON object with a 'notifications' field containing an array of notification objects.
  `, 
});

const generateNotificationsFlow = ai.defineFlow(
  {
    name: 'generateNotificationsFlow',
    inputSchema: NotificationTuningInputSchema,
    outputSchema: NotificationTuningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
