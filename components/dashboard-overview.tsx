'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  ChefHat,
  MessageSquare,
  BarChart3,
  Calendar,
  CheckCircle2,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Helper function to get days in a month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get the starting day of the month
const getStartDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay()
}

export function DashboardOverview() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const today = currentDate.getDate()

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const startDay = getStartDayOfMonth(currentMonth, currentYear)

  const calendarDays = Array.from({ length: startDay }, (_, i) => (
    <div key={`empty-${i}`} className="text-center text-xs sm:text-sm text-gray-400"></div>
  ))

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <div
        key={day}
        className={`text-center text-xs sm:text-sm ${day === today ? "font-bold text-gray-900" : "text-gray-600"}`}
      >
        {day}
      </div>
    )
  }

  const todayEvents = [
    {
      title: "Staff Meeting",
      description: "Discuss weekly progress",
      avatars: ["bg-purple-400", "bg-violet-400", "bg-pink-400"],
      bgColor: "bg-gray-900",
      textColor: "text-white",
    },
    {
      title: "Supplier Delivery",
      description: "Fresh ingredients arrival",
      avatars: ["bg-blue-400", "bg-green-400"],
      bgColor: "bg-purple-50",
      textColor: "text-gray-900",
    },
  ]

  return (
    <div className="container-responsive space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Welcome back, Chef Marco</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">Today</div>
            <div className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium">85%</div>
            <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">This Week</div>
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">127</div>
              <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Orders
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">89</div>
              <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Reviews
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">$2.8k</div>
              <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Revenue
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">Marco's Bistro</h3>
                <p className="text-xs sm:text-sm text-gray-600">Italian Cuisine</p>
                <div className="mt-2 px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium inline-block">
                  $2,847 Today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Daily Progress</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">6.2h</div>
                <div className="text-xs sm:text-sm text-gray-600">Operating Time</div>
                <div className="mt-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block">
                  Peak: 2h 15m
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>
                <div className="flex space-x-1">
                  {[40, 60, 80, 90, 70, 85, 95].map((height, i) => (
                    <div key={i} className="flex-1 bg-gray-200 rounded-sm relative h-12 sm:h-16">
                      <div
                        className={`bg-purple-400 rounded-sm ${i === 6 ? "bg-purple-500" : ""}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Kitchen Timer</CardTitle>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#a855f7"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset="75.36"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold">02:35</div>
                  <div className="text-xs text-gray-600">Avg Time</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gray-900 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-white">Daily Tasks</CardTitle>
              <div className="text-xl sm:text-2xl font-bold">4/6</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Prep Work</span>
                <div className="flex space-x-1">
                  <div className="w-6 sm:w-8 h-2 bg-purple-400 rounded-full" />
                  <div className="w-6 sm:w-8 h-2 bg-gray-700 rounded-full" />
                  <div className="w-6 sm:w-8 h-2 bg-gray-700 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-xs sm:text-sm">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                  <span className="flex-1">Morning Inventory</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">Sep 15, 08:30</span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:text-sm">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                  <span className="flex-1">Staff Briefing</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">Sep 15, 10:30</span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:text-sm">
                  <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-600 rounded-full" />
                  <span className="flex-1 text-gray-400">Menu Updates</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">Sep 15, 14:00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <CardTitle className="text-base sm:text-lg">Today's Schedule</CardTitle>
                <div className="flex space-x-2 text-xs sm:text-sm text-gray-600">
                  <span>{monthNames[(currentMonth - 1 + 12) % 12]}</span>
                  <span className="font-medium">{`${monthNames[currentMonth]} ${currentYear}`}</span>
                  <span>{monthNames[(currentMonth + 1) % 12]}</span>
                </div>
              </div>
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm text-gray-600 mb-4">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                {calendarDays}
              </div>
              <div className="space-y-2">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 ${event.bgColor} rounded-lg`}>
                      <div>
                        <div className={`font-medium text-xs sm:text-sm ${event.textColor}`}>{event.title}</div>
                        <div className={`text-xs ${event.textColor} opacity-80`}>{event.description}</div>
                      </div>
                      <div className="flex -space-x-2">
                        {event.avatars.map((avatar, j) => (
                          <div
                            key={j}
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${avatar} rounded-full border-2 border-white`}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">No events scheduled for today.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/menu" passHref>
              <Button className="w-full justify-start bg-transparent hover:bg-purple-50" variant="outline">
                <ChefHat className="mr-2 h-4 w-4" />
                Update Menu
              </Button>
            </Link>
            <Link href="/analytics" passHref>
              <Button className="w-full justify-start bg-transparent hover:bg-purple-50" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
            <Link href="/ai-chat" passHref>
              <Button className="w-full justify-start bg-transparent hover:bg-purple-50" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI Assistant
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:tsext-lg">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm font-medium text-red-900">Low Stock</p>
                <p className="text-xs text-red-700">Salmon (3 portions left)</p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-900">Peak Hours</p>
                <p className="text-xs text-purple-700">Lunch rush in 30 min</p>
              </div>
              <Badge className="bg-purple-500 text-white text-xs">Info</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
