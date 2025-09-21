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
import { Bot, User, CornerDownLeft, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";

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
    <Card className="h-full flex flex-col bg-card/50 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <Tabs value={mode} onValueChange={(value) => setMode(value as ChatMode)}>
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="restock">Restock</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                 <Sparkles className="h-10 w-10 mx-auto mb-4 text-primary" />
                <p className="font-semibold text-lg text-foreground/90">AI Assistant</p>
                <p className="text-sm">Ask me about {currentModeConfig.title.toLowerCase()}.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-9 h-9 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-4 rounded-xl max-w-sm md:max-w-md shadow-md",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                 {message.role === "user" && (
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-secondary text-foreground"><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isPending && (
                <div className="flex items-start gap-4 justify-start">
                    <Avatar className="w-9 h-9 border-2 border-primary/50">
                        <AvatarFallback className="bg-primary/20 text-primary"><Bot size={20} /></AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-xl bg-secondary flex items-center shadow-md">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                </div>
             )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-secondary/80">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentModeConfig.placeholder}
                className="pr-12 h-11 bg-secondary/50 focus:bg-secondary rounded-full"
                disabled={isPending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 rounded-full"
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
