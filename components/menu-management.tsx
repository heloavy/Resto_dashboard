"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, DollarSign, Clock, Star, Save, X } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  preparationTime: number
  servingSize: number
  rating: number
  isAvailable: boolean
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables",
    price: 28.99,
    category: "Main Course",
    preparationTime: 20,
    servingSize: 1,
    rating: 4.8,
    isAvailable: true,
    allergens: ["Fish"],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
  },
  {
    id: "2",
    name: "Truffle Pasta",
    description: "Handmade fettuccine with black truffle, parmesan, and wild mushrooms",
    price: 24.99,
    category: "Main Course",
    preparationTime: 15,
    servingSize: 1,
    rating: 4.6,
    isAvailable: true,
    allergens: ["Gluten", "Dairy"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, house-made croutons, parmesan, and classic Caesar dressing",
    price: 16.99,
    category: "Appetizer",
    preparationTime: 8,
    servingSize: 1,
    rating: 4.4,
    isAvailable: true,
    allergens: ["Gluten", "Dairy", "Eggs"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
  },
  {
    id: "4",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 12.99,
    category: "Dessert",
    preparationTime: 12,
    servingSize: 1,
    rating: 4.9,
    isAvailable: true,
    allergens: ["Gluten", "Dairy", "Eggs"],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
  },
]

const categories = ["Appetizer", "Main Course", "Dessert", "Beverages", "Specials"]

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)

  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
  }

  const handleSaveItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    }
    setMenuItems((prev) => [...prev, item])
    setIsAddingItem(false)
  }

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items, pricing, and availability</p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <MenuItemForm onSave={handleAddItem} onCancel={() => setIsAddingItem(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="All">All Items</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onToggleAvailability={() => toggleAvailability(item.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          {editingItem && (
            <MenuItemForm item={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
  onToggleAvailability: () => void
}

function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  return (
    <Card className={`transition-all ${!item.isAvailable ? "opacity-60" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              {!item.isAvailable && <Badge variant="destructive">Unavailable</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-primary">${item.price}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{item.preparationTime}min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span>{item.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.isVegetarian && (
            <Badge variant="outline" className="text-xs">
              Vegetarian
            </Badge>
          )}
          {item.isVegan && (
            <Badge variant="outline" className="text-xs">
              Vegan
            </Badge>
          )}
          {item.isGlutenFree && (
            <Badge variant="outline" className="text-xs">
              Gluten-Free
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={item.isAvailable ? "destructive" : "default"}
            size="sm"
            onClick={onToggleAvailability}
            className="flex-1"
          >
            {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface MenuItemFormProps {
  item?: MenuItem
  onSave: (item: MenuItem) => void
  onCancel: () => void
}

function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [formData, setFormData] = useState<Omit<MenuItem, "id">>({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "Main Course",
    preparationTime: item?.preparationTime || 15,
    servingSize: item?.servingSize || 1,
    rating: item?.rating || 4.0,
    isAvailable: item?.isAvailable ?? true,
    allergens: item?.allergens || [],
    isVegetarian: item?.isVegetarian || false,
    isVegan: item?.isVegan || false,
    isGlutenFree: item?.isGlutenFree || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (item) {
      onSave({ ...formData, id: item.id })
    } else {
      onSave(formData as MenuItem)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{item ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        <DialogDescription>
          {item ? "Update the details of this menu item" : "Create a new menu item for your restaurant"}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the menu item"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prepTime">Prep Time (min)</Label>
            <Input
              id="prepTime"
              type="number"
              value={formData.preparationTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, preparationTime: Number.parseInt(e.target.value) || 0 }))
              }
              placeholder="15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="servingSize">Serving Size</Label>
            <Input
              id="servingSize"
              type="number"
              value={formData.servingSize}
              onChange={(e) => setFormData((prev) => ({ ...prev, servingSize: Number.parseInt(e.target.value) || 1 }))}
              placeholder="1"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isVegetarian}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVegetarian: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm">Vegetarian</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isVegan}
              onChange={(e) => setFormData((prev) => ({ ...prev, isVegan: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm">Vegan</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isGlutenFree}
              onChange={(e) => setFormData((prev) => ({ ...prev, isGlutenFree: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm">Gluten-Free</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          {item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  )
}
