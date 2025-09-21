"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  askMarketingIdeas,
  askRestockSuggestions,
  askSalesTrends,
} from "@/app/actions";
import { Bot, User, CornerDownLeft, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatMode = "sales" | "restock" | "marketing";

const modeConfig = {
  sales: {
    title: "Sales Trends",
    placeholder: "e.g., Show me sales trends from last week.",
    action: askSalesTrends,
  },
  restock: {
    title: "Restock Suggestions",
    placeholder: "e.g., What items should I restock today?",
    action: askRestockSuggestions,
  },
  marketing: {
    title: "Marketing Ideas",
    placeholder: "e.g., Today's special is Cappuccino.",
    action: askMarketingIdeas,
  },
};

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>("sales");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      const action = modeConfig[mode].action;
      const response = await action(input);
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    });
  };

  const currentModeConfig = modeConfig[mode];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Tabs value={mode} onValueChange={(value) => setMode(value as ChatMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="restock">Restock</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                 <Wand2 className="h-10 w-10 mx-auto mb-2 text-primary" />
                <p className="font-semibold">AI Assistant</p>
                <p className="text-sm">Ask me about {currentModeConfig.title.toLowerCase()}.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-sm md:max-w-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User size={18} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-secondary flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentModeConfig.placeholder}
                className="pr-12"
                disabled={isPending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 h-7 w-7"
                disabled={isPending || !input.trim()}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
