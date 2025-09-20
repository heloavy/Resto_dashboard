'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import type { PostgrestSingleResponse } from "@supabase/supabase-js"

// Define the shape of a menu item
interface MenuItem {
  name: string;
  description: string;
  category: string;
  price: number;
}

export function AddNewMenuItem() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = parseFloat(formData.get("price") as string)

    const menuItem: MenuItem = { name, description, category, price };

    try {
      const result: PostgrestSingleResponse<null> = await supabase.from("menu_items").insert([menuItem])
      if (result.error) {
        console.error("Error inserting data:", result.error.message)
        alert(`Error: ${result.error.message}`)
      } else {
        console.log("Data inserted successfully:", result.data)
        alert("Menu item added successfully!")
        event.currentTarget.reset()
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
      alert("An unexpected error occurred. Check the console for details.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Add a New Dish</CardTitle>
        <CardDescription>Expand your menu with a new culinary creation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g., Spicy Tuna Roll" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Describe the dish" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appetizer">Appetizer</SelectItem>
                  <SelectItem value="Main Course">Main Course</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Specials">Specials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="e.g., 12.99" required />
            </div>
          </div>
          <Button type="submit" className="w-full">Add to Menu</Button>
        </form>
      </CardContent>
    </Card>
  )
}
