"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock, Bell, FileText, CheckSquare, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  folder: string
  createdAt: Date
  updatedAt: Date
  isLocked: boolean
  isPrivate: boolean
  reminder?: Date
  type: "note" | "checklist" | "task"
  aiGenerated?: boolean
}

interface CalendarViewProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
}

export function CalendarView({ notes, onSelectNote }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getNotesForDate = (date: Date | null) => {
    if (!date) return []

    return notes.filter((note) => {
      if (note.reminder) {
        const reminderDate = new Date(note.reminder)
        return reminderDate.toDateString() === date.toDateString()
      }
      return note.createdAt.toDateString() === date.toDateString()
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h2>
              <p className="text-sm text-gray-500">View notes and reminders by date</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
              Week
            </Button>
            <Button variant={view === "day" ? "default" : "outline"} size="sm" onClick={() => setView("day")}>
              Day
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {view === "month" && (
        <div className="flex-1 p-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {days.map((day, index) => {
              const dayNotes = getNotesForDate(day)
              const isToday = day && day.toDateString() === today.toDateString()
              const hasReminders = dayNotes.some((note) => note.reminder)

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg",
                    day
                      ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      : "bg-gray-50 dark:bg-gray-900",
                    isToday && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20",
                  )}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white",
                          )}
                        >
                          {day.getDate()}
                        </span>
                        {hasReminders && <Bell className="h-3 w-3 text-orange-500" />}
                      </div>
                      <div className="space-y-1">
                        {dayNotes.slice(0, 3).map((note) => (
                          <div
                            key={note.id}
                            className="text-xs p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectNote(note)
                            }}
                          >
                            <div className="flex items-center gap-1">
                              {note.type === "checklist" ? (
                                <CheckSquare className="h-2 w-2 text-green-500" />
                              ) : (
                                <FileText className="h-2 w-2 text-blue-500" />
                              )}
                              <span className="truncate">{note.title}</span>
                            </div>
                          </div>
                        ))}
                        {dayNotes.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">+{dayNotes.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === "day" && (
        <div className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getNotesForDate(currentDate).map((note) => (
                <div
                  key={note.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onSelectNote(note)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium flex items-center gap-2">
                      {note.type === "checklist" ? (
                        <CheckSquare className="h-4 w-4 text-green-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-500" />
                      )}
                      {note.title}
                    </h4>
                    {note.reminder && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-2 w-2 mr-1" />
                        {note.reminder.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {note.content.replace(/[#*\-[\]]/g, "").substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {getNotesForDate(currentDate).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notes or reminders for this date.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
