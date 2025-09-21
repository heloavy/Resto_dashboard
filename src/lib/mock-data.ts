import type { InventoryAlertInput } from "@/ai/flows/inventory-alerts";
import type { PlaceHolderImages } from "./placeholder-images";

export const salesData = [
  { month: "Jan", historical: 1860, predicted: 2100 },
  { month: "Feb", historical: 3050, predicted: 2800 },
  { month: "Mar", historical: 2370, predicted: 2500 },
  { month: "Apr", historical: 2780, predicted: 2900 },
  { month: "May", historical: 1890, predicted: 2000 },
  { month: "Jun", historical: 2390, predicted: 2500 },
  { month: "Jul", historical: 3490, predicted: 3600 },
];

export const inventoryDataForAlerts: InventoryAlertInput = {
    inventoryItems: [
      {
        name: 'Coffee Beans',
        currentStock: 8,
        unit: 'kg',
        reorderPoint: 10,
        historicalUsage: [
          { date: '2023-10-01', quantity: 5 },
          { date: '2023-10-02', quantity: 6 },
        ],
      },
      {
        name: 'Milk',
        currentStock: 12,
        unit: 'liters',
        reorderPoint: 15,
        historicalUsage: [
          { date: '2023-10-01', quantity: 10 },
          { date: '2023-10-02', quantity: 8 },
        ],
      },
       {
        name: 'Croissants',
        currentStock: 25,
        unit: 'count',
        reorderPoint: 20,
        historicalUsage: [
          { date: '2023-10-01', quantity: 15 },
          { date: '2023-10-02', quantity: 18 },
        ],
      },
      {
        name: 'Avocado',
        currentStock: 5,
        unit: 'kg',
        reorderPoint: 8,
        historicalUsage: [
            { date: '2023-10-01', quantity: 4 },
            { date: '2023-10-02', quantity: 3 },
        ]
      }
    ],
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: 'Drink' | 'Bakery' | 'Breakfast' | 'Lunch' | 'Dinner';
  sales: number;
  imageUrl: string;
  imageHint: string;
};


export const menuItems: MenuItem[] = [
  { id: 'cappuccino', name: 'Cappuccino', price: 3.50, category: 'Drink', sales: 150, imageUrl: "https://picsum.photos/seed/101/200/200", imageHint: 'cappuccino coffee' },
  { id: 'croissant', name: 'Croissant', price: 2.75, category: 'Bakery', sales: 200, imageUrl: "https://picsum.photos/seed/102/200/200", imageHint: 'croissant pastry' },
  { id: 'avocado-toast', name: 'Avocado Toast', price: 8.50, category: 'Breakfast', sales: 90, imageUrl: "https://picsum.photos/seed/103/200/200", imageHint: 'avocado toast' },
  { id: 'cheeseburger', name: 'Cheeseburger', price: 12.00, category: 'Lunch', sales: 120, imageUrl: "https://picsum.photos/seed/104/200/200", imageHint: 'cheeseburger fries' },
  { id: 'margherita-pizza', name: 'Margherita Pizza', price: 14.00, category: 'Dinner', sales: 70, imageUrl: "https://picsum.photos/seed/105/200/200", imageHint: 'margherita pizza' },
];
