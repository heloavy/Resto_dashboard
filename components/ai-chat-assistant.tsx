"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Users,
  ChefHat,
  Clock,
  Star,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  suggestions?: string[]
}

const quickPrompts = [
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    prompt: "How can I increase my restaurant's revenue this month?",
    category: "Business Growth",
  },
  {
    icon: DollarSign,
    title: "Menu Pricing",
    prompt: "Help me optimize my menu pricing strategy",
    category: "Pricing",
  },
  {
    icon: Users,
    title: "Customer Retention",
    prompt: "What are the best ways to improve customer retention?",
    category: "Customer Service",
  },
  {
    icon: ChefHat,
    title: "Menu Planning",
    prompt: "Suggest seasonal menu items for this time of year",
    category: "Menu",
  },
  {
    icon: Clock,
    title: "Operations",
    prompt: "How can I improve kitchen efficiency during peak hours?",
    category: "Operations",
  },
  {
    icon: Star,
    title: "Reviews",
    prompt: "How should I respond to negative customer reviews?",
    category: "Reputation",
  },
]

const aiResponses = {
  "How can I increase my restaurant's revenue this month?": {
    content:
      "Here are several proven strategies to boost your restaurant revenue this month:\n\n**1. Optimize Your Menu**\n- Highlight high-margin items with visual cues\n- Create limited-time seasonal specials\n- Bundle complementary items (appetizer + main + drink)\n\n**2. Enhance Customer Experience**\n- Train staff on upselling techniques\n- Improve table turnover during peak hours\n- Implement a loyalty program\n\n**3. Digital Marketing**\n- Promote on social media with food photography\n- Partner with delivery apps for wider reach\n- Send targeted email campaigns to past customers\n\n**4. Operational Efficiency**\n- Reduce food waste through better inventory management\n- Optimize staff scheduling based on peak hours\n- Negotiate better rates with suppliers\n\nBased on your current metrics, I'd recommend starting with menu optimization and staff training, as these typically show results within 2-3 weeks.",
    suggestions: [
      "Show me menu optimization techniques",
      "Help me create a staff training plan",
      "Analyze my current pricing strategy",
    ],
  },
  "Help me optimize my menu pricing strategy": {
    content:
      "Let me help you develop an effective pricing strategy based on restaurant industry best practices:\n\n**Current Analysis:**\nBased on your menu data, here are key observations:\n- Your pasta dishes are priced 15% below market average\n- Seafood items have healthy margins (65%+)\n- Appetizers could be bundled more effectively\n\n**Pricing Recommendations:**\n\n**1. Cost-Plus Pricing**\n- Target 28-35% food cost ratio\n- Your current average: 31% (good range)\n\n**2. Competitive Analysis**\n- Grilled Salmon: Increase to $31.99 (+10%)\n- Truffle Pasta: Increase to $27.99 (+12%)\n- Keep appetizers competitive for upselling\n\n**3. Psychological Pricing**\n- Remove dollar signs from menu\n- Use charm pricing (.99, .95)\n- Position premium items strategically\n\n**4. Menu Engineering**\n- Promote high-margin 'Stars' (popular + profitable)\n- Redesign 'Dogs' (unpopular + unprofitable)\n\nImplement changes gradually over 2-3 weeks to gauge customer response.",
    suggestions: ["Calculate new profit margins", "Create a menu redesign plan", "Analyze competitor pricing"],
  },
  "What are the best ways to improve customer retention?": {
    content:
      "Customer retention is crucial for restaurant profitability. Here's a comprehensive strategy:\n\n**1. Personalized Service**\n- Remember regular customers' preferences\n- Train staff to use customers' names\n- Offer personalized recommendations\n\n**2. Loyalty Programs**\n- Points-based system (1 point per $1 spent)\n- Birthday rewards and special occasion offers\n- VIP tier for frequent diners\n\n**3. Consistent Quality**\n- Standardize recipes and portion sizes\n- Regular staff training on food preparation\n- Quality control checks during service\n\n**4. Feedback Management**\n- Actively seek customer feedback\n- Respond promptly to reviews (positive and negative)\n- Implement suggested improvements\n\n**5. Community Engagement**\n- Host special events (wine tastings, chef's table)\n- Support local causes and charities\n- Create Instagram-worthy moments\n\n**Retention Metrics to Track:**\n- Repeat visit rate (target: 40-50%)\n- Customer lifetime value\n- Net Promoter Score (NPS)\n\nYour current retention rate of 68% is above average - let's aim for 75%!",
    suggestions: ["Design a loyalty program", "Create a feedback system", "Plan community events"],
  },
}

export function AIChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI restaurant business assistant. I'm here to help you optimize operations, increase revenue, improve customer satisfaction, and grow your business. What would you like to discuss today?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: ["How can I increase revenue?", "Help with menu pricing", "Improve customer service"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = aiResponses[content as keyof typeof aiResponses] || {
        content:
          "I understand you're asking about restaurant management. Let me provide some general guidance:\n\nFor specific business challenges, I recommend:\n1. Analyzing your current performance metrics\n2. Identifying key areas for improvement\n3. Implementing changes gradually\n4. Monitoring results and adjusting as needed\n\nCould you provide more specific details about your situation so I can give more targeted advice?",
        suggestions: [
          "Tell me about your current challenges",
          "Show me your performance metrics",
          "Help me create an action plan",
        ],
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Business Assistant</h1>
          <p className="text-muted-foreground">Get expert guidance for your restaurant operations and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <Badge className="bg-accent text-accent-foreground">Online</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Quick Prompts
              </CardTitle>
              <CardDescription>Common restaurant management topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 text-left bg-transparent"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                >
                  <div className="flex items-start gap-3">
                    <prompt.icon className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium text-sm">{prompt.title}</div>
                      <div className="text-xs text-muted-foreground">{prompt.category}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Business Consultation
              </CardTitle>
              <CardDescription>
                Ask me anything about restaurant management, operations, or growth strategies
              </CardDescription>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        </div>

                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-2 text-xs text-left justify-start bg-accent/10 hover:bg-accent/20"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about your restaurant business..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
