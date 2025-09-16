"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Leaf,
  Globe,
  Clock,
  ChefHat,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface TrendData {
  id: string
  title: string
  category: string
  trend: "up" | "down" | "stable"
  percentage: number
  impact: "high" | "medium" | "low"
  timeframe: string
  description: string
  actionable: boolean
  recommendations: string[]
  marketData: {
    localDemand: number
    competitorAdoption: number
    seasonality: string
  }
}

const trendData: TrendData[] = [
  {
    id: "1",
    title: "Plant-Based Menu Options",
    category: "Menu Innovation",
    trend: "up",
    percentage: 34,
    impact: "high",
    timeframe: "Last 3 months",
    description:
      "Significant increase in demand for vegan and vegetarian options in your area. Local competitors have seen 23% increase in plant-based orders.",
    actionable: true,
    recommendations: [
      "Add 2-3 vegan main course options",
      "Create plant-based versions of popular dishes",
      "Partner with local organic suppliers",
      "Market health and sustainability benefits",
    ],
    marketData: {
      localDemand: 78,
      competitorAdoption: 45,
      seasonality: "Year-round growth",
    },
  },
  {
    id: "2",
    title: "Premium Comfort Food",
    category: "Menu Trends",
    trend: "up",
    percentage: 28,
    impact: "high",
    timeframe: "Last 2 months",
    description:
      "Elevated comfort food dishes are trending. Customers willing to pay 15-20% more for gourmet versions of classic comfort foods.",
    actionable: true,
    recommendations: [
      "Upgrade burger with premium ingredients",
      "Create artisanal mac and cheese variations",
      "Offer truffle-enhanced comfort dishes",
      "Position as 'elevated classics' on menu",
    ],
    marketData: {
      localDemand: 82,
      competitorAdoption: 38,
      seasonality: "Strong in fall/winter",
    },
  },
  {
    id: "3",
    title: "Contactless Dining Experience",
    category: "Technology",
    trend: "up",
    percentage: 42,
    impact: "medium",
    timeframe: "Last 6 months",
    description:
      "QR code menus and mobile ordering continue to grow. 67% of customers prefer contactless payment options.",
    actionable: true,
    recommendations: [
      "Implement QR code digital menus",
      "Add mobile payment options",
      "Enable online pre-ordering",
      "Train staff on contactless service",
    ],
    marketData: {
      localDemand: 67,
      competitorAdoption: 72,
      seasonality: "Consistent year-round",
    },
  },
  {
    id: "4",
    title: "Local Sourcing & Sustainability",
    category: "Sustainability",
    trend: "up",
    percentage: 31,
    impact: "medium",
    timeframe: "Last 4 months",
    description:
      "Growing consumer preference for locally sourced ingredients. 58% of diners consider sustainability when choosing restaurants.",
    actionable: true,
    recommendations: [
      "Partner with local farms and suppliers",
      "Highlight local ingredients on menu",
      "Create seasonal specials with local produce",
      "Communicate sustainability efforts to customers",
    ],
    marketData: {
      localDemand: 58,
      competitorAdoption: 34,
      seasonality: "Peak in spring/summer",
    },
  },
  {
    id: "5",
    title: "Craft Cocktail Programs",
    category: "Beverages",
    trend: "up",
    percentage: 25,
    impact: "high",
    timeframe: "Last 3 months",
    description:
      "Craft cocktails with unique ingredients are driving higher beverage revenue. Average cocktail price increased 18% in your market.",
    actionable: true,
    recommendations: [
      "Develop signature cocktail menu",
      "Use house-made syrups and bitters",
      "Train bartenders in craft techniques",
      "Create Instagram-worthy presentations",
    ],
    marketData: {
      localDemand: 71,
      competitorAdoption: 52,
      seasonality: "Strong year-round",
    },
  },
  {
    id: "6",
    title: "Traditional Fine Dining",
    category: "Dining Style",
    trend: "down",
    percentage: -18,
    impact: "medium",
    timeframe: "Last 6 months",
    description:
      "Formal dining experiences declining in favor of casual upscale. Customers prefer relaxed atmosphere with quality food.",
    actionable: false,
    recommendations: [
      "Consider casual upscale positioning",
      "Maintain food quality while relaxing service style",
      "Update decor for more casual feel",
      "Adjust pricing for casual market",
    ],
    marketData: {
      localDemand: 32,
      competitorAdoption: 28,
      seasonality: "Declining across seasons",
    },
  },
]

const marketInsights = [
  {
    title: "Local Market Analysis",
    icon: MapPin,
    data: [
      { label: "Average Order Value", value: "$28.50", trend: "+5.2%" },
      { label: "Peak Dining Hours", value: "7-9 PM", trend: "Stable" },
      { label: "Weekend vs Weekday", value: "65% / 35%", trend: "+3%" },
      { label: "Delivery Orders", value: "32%", trend: "+12%" },
    ],
  },
  {
    title: "Seasonal Patterns",
    icon: Calendar,
    data: [
      { label: "Spring Menu Interest", value: "Fresh, Light", trend: "Growing" },
      { label: "Summer Beverages", value: "Cold, Refreshing", trend: "Peak Season" },
      { label: "Fall Comfort Food", value: "Warm, Hearty", trend: "Approaching" },
      { label: "Holiday Specials", value: "Premium, Festive", trend: "Plan Ahead" },
    ],
  },
]

export function TrendInsights() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeframe, setTimeframe] = useState("3m")

  const filteredTrends =
    selectedCategory === "all"
      ? trendData
      : trendData.filter((trend) => trend.category.toLowerCase().includes(selectedCategory.toLowerCase()))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-accent" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Trend Insights</h1>
          <p className="text-muted-foreground">
            Data-driven recommendations based on local market trends and industry analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Target className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {marketInsights.map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <insight.icon className="h-5 w-5 text-primary" />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insight.data.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <div className="text-right">
                      <span className="font-medium">{item.value}</span>
                      <div className="text-xs text-accent">{item.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Analysis */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Trends</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="beverages">Beverages</TabsTrigger>
          <TabsTrigger value="dining">Dining Style</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-6">
            {filteredTrends.map((trend) => (
              <Card key={trend.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{trend.title}</CardTitle>
                        {getTrendIcon(trend.trend)}
                        <Badge variant="outline">{trend.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {trend.timeframe}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(trend.impact)}`}>
                          {trend.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="flex items-center gap-1">
                          {trend.actionable ? (
                            <CheckCircle className="h-4 w-4 text-accent" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          {trend.actionable ? "Actionable" : "Monitor"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${trend.trend === "up" ? "text-accent" : "text-destructive"}`}
                      >
                        {trend.trend === "up" ? "+" : ""}
                        {trend.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">Change</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{trend.description}</p>

                  {/* Market Data */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Local Demand</span>
                        <span className="font-medium">{trend.marketData.localDemand}%</span>
                      </div>
                      <Progress value={trend.marketData.localDemand} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Competitor Adoption</span>
                        <span className="font-medium">{trend.marketData.competitorAdoption}%</span>
                      </div>
                      <Progress value={trend.marketData.competitorAdoption} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span>Seasonality</span>
                      </div>
                      <div className="text-sm font-medium text-primary">{trend.marketData.seasonality}</div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {trend.actionable && (
                    <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                      <h4 className="font-medium text-accent mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        AI Recommendations
                      </h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {trend.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Implement Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Priority Actions This Month
          </CardTitle>
          <CardDescription>Based on high-impact trends with strong local demand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Add Plant-Based Options</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">High demand (78%) with low competitor adoption (45%)</p>
              <Badge className="bg-primary text-primary-foreground">High Priority</Badge>
            </div>

            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat className="h-5 w-5 text-accent" />
                <h4 className="font-medium">Premium Comfort Food</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Strong local demand (82%) with pricing power</p>
              <Badge className="bg-accent text-accent-foreground">High Priority</Badge>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-medium">Contactless Experience</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Customer preference (67%) for convenience</p>
              <Badge variant="outline">Medium Priority</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
