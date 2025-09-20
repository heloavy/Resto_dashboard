'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, User, CornerDownLeft } from "lucide-react"
import { useActions, useUIState } from "ai/rsc"
import type { AI } from "@/app/actions"
import type { ReactNode } from "react"

// Define the shape of a message in the UI
interface UIMessage {
  id: number;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export function AIChatAssistant() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions<typeof AI>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const messageContent = inputValue.trim()
    setInputValue("")

    // Add user message to the UI state
    setMessages((currentMessages: UIMessage[]) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: "user",
        display: <div className="flex items-center gap-2 font-semibold"><User className="w-5 h-5" />{messageContent}</div>,
      },
    ])

    try {
      // Submit user message to the AI action
      const responseMessage = await submitUserMessage(messageContent)
      setMessages((currentMessages: UIMessage[]) => [...currentMessages, responseMessage])
    } catch (error) {
      console.error("AI submission failed:", error)
      const errorMessage: UIMessage = {
        id: Date.now(),
        role: "assistant",
        display: <div className="text-red-500">Sorry, I encountered an error.</div>,
      };
      setMessages((currentMessages: UIMessage[]) => [...currentMessages, errorMessage]);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="w-6 h-6 text-primary"/>AI Menu Assistant</CardTitle>
        <CardDescription>Get suggestions for new menu items.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-64 overflow-y-auto pr-4 border-t pt-4">
          {messages.length === 0 && <div className="text-center text-muted-foreground">No messages yet.</div>}
          {messages.map((message: UIMessage) => (
            <div key={message.id}>{message.display}</div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 border-t pt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Suggest a vegan appetizer..."
            className="flex-1"
          />
          <Button type="submit" size="icon"><CornerDownLeft className="w-4 h-4"/></Button>
        </form>
      </CardContent>
    </Card>
  )
}
