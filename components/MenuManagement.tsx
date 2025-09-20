'use client'

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { AIChatAssistant } from "./ai-chat-assistant"

// The MenuItem interface now perfectly matches the Supabase table schema.
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  preparation_time: number
  rating: number
  is_available: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  // These fields are in the table but not actively used in the form; they can be added later.
  image?: string
  serving_size?: number
  allergens?: string[]
  created_at?: string
}

type NewMenuItem = Omit<MenuItem, "id" | "created_at">

const categories = ["Appetizer", "Main Course", "Dessert", "Beverages", "Specials"]

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch data directly from Supabase
        const { data, error } = await supabase.from("menu").select("*").order("name")
        if (error) throw error
        setMenuItems(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch menu items")
      } finally {
        setLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  const filteredItems = useMemo(() =>
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory),
    [menuItems, selectedCategory]
  );

  const handleSave = async (itemData: NewMenuItem | MenuItem) => {
    try {
      let result: MenuItem;
      if ("id" in itemData) {
        // Update existing item
        const { data, error } = await supabase.from("menu").update(itemData).eq("id", itemData.id).select().single()
        if (error) throw error
        result = data as MenuItem
        setMenuItems((prev) => prev.map((item) => (item.id === result.id ? result : item)))
        setEditingItem(null)
      } else {
        // Create new item
        const { data, error } = await supabase.from("menu").insert(itemData).select().single()
        if (error) throw error
        result = data as MenuItem
        setMenuItems((prev) => [...prev, result])
        setIsAddingItem(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item")
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return
    try {
      const { error } = await supabase.from("menu").delete().eq("id", id)
      if (error) throw error
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item")
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const { data, error } = await supabase
        .from('menu')
        .update({ is_available: !item.is_available })
        .eq('id', item.id)
        .select()
        .single()
      if (error) throw error
      setMenuItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle availability')
    }
  };

  if (loading) return <div className="p-6">Loading your menu...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Dashboard</h1>
          <p className="text-muted-foreground">A central place to manage your restaurant's offerings.</p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Menu Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl"><MenuItemForm onSave={handleSave} onCancel={() => setIsAddingItem(false)} /></DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6"><TabsTrigger value="All">All</TabsTrigger>{categories.map(c=><TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}</TabsList>
        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item=><MenuItemCard key={item.id} item={item} onEdit={()=>setEditingItem(item)} onDelete={()=>handleDeleteItem(item.id)} onToggleAvailability={()=>toggleAvailability(item)}/>)}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!editingItem} onOpenChange={(isOpen)=>!isOpen && setEditingItem(null)}>
        <DialogContent className="max-w-2xl">{editingItem && <MenuItemForm item={editingItem} onSave={handleSave} onCancel={()=>setEditingItem(null)}/>}</DialogContent>
      </Dialog>
      
      <div className="fixed bottom-4 right-4 z-50"><AIChatAssistant /></div>
    </div>
  )
}

function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: { item: MenuItem, onEdit: ()=>void, onDelete: ()=>void, onToggleAvailability: ()=>void }) {
  return (
    <Card className={`flex flex-col transition-all ${!item.is_available ? "bg-muted/50 opacity-70" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">{item.category}</Badge>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onEdit}><Edit className="h-4 w-4"/></Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="h-4 w-4"/></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground flex-grow line-clamp-2">{item.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="font-bold text-primary text-lg">${item.price.toFixed(2)}</div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1"><Clock className="h-4 w-4"/>{item.preparation_time}m</div>
            <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500"/>{item.rating.toFixed(1)}</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {item.is_vegetarian && <Badge variant="outline" className="border-green-500 text-green-700">Vegetarian</Badge>}
          {item.is_vegan && <Badge variant="outline" className="border-green-700 text-green-900">Vegan</Badge>}
          {item.is_gluten_free && <Badge variant="outline" className="border-blue-500 text-blue-700">Gluten-Free</Badge>}
          {!item.is_available && <Badge variant="destructive">Unavailable</Badge>}
        </div>
        <Button variant={item.is_available ? "secondary" : "default"} size="sm" onClick={onToggleAvailability} className="w-full mt-4">{item.is_available ? "Mark Unavailable" : "Mark Available"}</Button>
      </CardContent>
    </Card>
  )
}

function MenuItemForm({ item, onSave, onCancel }: { item?: MenuItem, onSave: (data: any)=>void, onCancel: ()=>void }) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "Main Course",
    preparation_time: item?.preparation_time || 15,
    rating: item?.rating || 4.0,
    is_vegetarian: item?.is_vegetarian || false,
    is_vegan: item?.is_vegan || false,
    is_gluten_free: item?.is_gluten_free || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = item ? { ...formData, id: item.id } : formData;
    onSave(dataToSave);
  };

  const handleCheckedChange = (field: keyof typeof formData) => (checked: boolean) => {
    setFormData(prev => ({...prev, [field]: checked}));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{item ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        <DialogDescription>{item ? "Update the details for this menu item." : "Fill out the form to create a new item for your menu."}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={e=>setFormData(p=>({...p, name: e.target.value}))} required/></div>
        <div className="space-y-2"><Label htmlFor="category">Category</Label><Select value={formData.category} onValueChange={v=>setFormData(p=>({...p, category:v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{categories.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e=>setFormData(p=>({...p, description: e.target.value}))}/></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={e=>setFormData(p=>({...p, price:parseFloat(e.target.value) || 0}))}/></div>
        <div className="space-y-2"><Label htmlFor="prepTime">Prep Time (min)</Label><Input id="prepTime" type="number" value={formData.preparation_time} onChange={e=>setFormData(p=>({...p, preparation_time:parseInt(e.target.value) || 0}))}/></div>
        <div className="space-y-2"><Label htmlFor="rating">Rating</Label><Input id="rating" type="number" step="0.1" max="5" value={formData.rating} onChange={e=>setFormData(p=>({...p, rating:parseFloat(e.target.value) || 0}))}/></div>
      </div>
      <div className="flex items-center space-x-4 pt-2">
        <div className="flex items-center space-x-2"><Checkbox id="is_vegetarian" checked={formData.is_vegetarian} onCheckedChange={handleCheckedChange("is_vegetarian")}/><Label htmlFor="is_vegetarian">Vegetarian</Label></div>
        <div className="flex items-center space-x-2"><Checkbox id="is_vegan" checked={formData.is_vegan} onCheckedChange={handleCheckedChange("is_vegan")}/><Label htmlFor="is_vegan">Vegan</Label></div>
        <div className="flex items-center space-x-2"><Checkbox id="is_gluten_free" checked={formData.is_gluten_free} onCheckedChange={handleCheckedChange("is_gluten_free")}/><Label htmlFor="is_gluten_free">Gluten-Free</Label></div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}><X className="mr-2 h-4 w-4"/>Cancel</Button>
        <Button type="submit"><Save className="mr-2 h-4 w-4"/>{item ? "Update Item" : "Add Item"}</Button>
      </div>
    </form>
  )
}
