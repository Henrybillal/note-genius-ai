"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Square, Plus, Calendar, Clock, Target, TrendingUp } from "lucide-react"
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

interface TaskManagerProps {
  notes: Note[]
  onUpdateNote: (note: Note) => void
  onCreateTask: (task: Note) => void
}

export function TaskManager({ notes, onUpdateNote, onCreateTask }: TaskManagerProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all")
  const [view, setView] = useState<"list" | "daily" | "weekly" | "monthly">("list")

  const parseTasksFromContent = (content: string) => {
    const lines = content.split("\n")
    const tasks = lines
      .filter((line) => line.match(/^- \[([ x])\]/))
      .map((line) => ({
        text: line.replace(/^- \[([ x])\] /, ""),
        completed: line.includes("[x]"),
      }))
    return tasks
  }

  const getTaskStats = () => {
    let totalTasks = 0
    let completedTasks = 0
    let overdueTasks = 0

    notes.forEach((note) => {
      const tasks = parseTasksFromContent(note.content)
      totalTasks += tasks.length
      completedTasks += tasks.filter((task) => task.completed).length

      if (note.reminder && note.reminder < new Date()) {
        const incompleteTasks = tasks.filter((task) => !task.completed)
        overdueTasks += incompleteTasks.length
      }
    })

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      overdue: overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    }
  }

  const stats = getTaskStats()

  const createNewTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Note = {
      id: Date.now().toString(),
      title: newTaskTitle,
      content: `- [ ] ${newTaskTitle}`,
      tags: ["task"],
      folder: "Tasks",
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
      isPrivate: false,
      type: "checklist",
    }

    onCreateTask(newTask)
    setNewTaskTitle("")
  }

  const toggleTask = (note: Note, taskIndex: number) => {
    const lines = note.content.split("\n")
    const taskLines = lines.map((line, index) => {
      if (line.match(/^- \[([ x])\]/) && taskIndex === 0) {
        taskIndex--
        return line.includes("[x]") ? line.replace("[x]", "[ ]") : line.replace("[ ]", "[x]")
      }
      if (line.match(/^- \[([ x])\]/)) {
        taskIndex--
      }
      return line
    })

    const updatedNote = {
      ...note,
      content: taskLines.join("\n"),
      updatedAt: new Date(),
    }

    onUpdateNote(updatedNote)
  }

  const filteredNotes = notes.filter((note) => {
    const tasks = parseTasksFromContent(note.content)
    if (tasks.length === 0) return false

    switch (filter) {
      case "pending":
        return tasks.some((task) => !task.completed)
      case "completed":
        return tasks.every((task) => task.completed) && tasks.length > 0
      case "overdue":
        return note.reminder && note.reminder < new Date() && tasks.some((task) => !task.completed)
      default:
        return true
    }
  })

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-6 w-6 text-green-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Manager</h2>
              <p className="text-sm text-gray-500">Organize and track your tasks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
              List
            </Button>
            <Button variant={view === "daily" ? "default" : "outline"} size="sm" onClick={() => setView("daily")}>
              Daily
            </Button>
          </div>
        </div>

        {/* Quick Add Task */}
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && createNewTask()}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button onClick={createNewTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Tasks</p>
                <p className="text-lg font-semibold">{stats.total}</p>
              </div>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-semibold text-green-600">{stats.completed}</p>
              </div>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-lg font-semibold">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm font-medium">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-2" />
      </div>

      {/* Filters */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All Tasks", count: stats.total },
            { key: "pending", label: "Pending", count: stats.pending },
            { key: "completed", label: "Completed", count: stats.completed },
            { key: "overdue", label: "Overdue", count: stats.overdue },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
              className="whitespace-nowrap"
            >
              {filterOption.label} ({filterOption.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Task Lists */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {filteredNotes.map((note) => {
          const tasks = parseTasksFromContent(note.content)
          const completedCount = tasks.filter((task) => task.completed).length
          const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

          return (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{note.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {note.reminder && (
                      <Badge variant={note.reminder < new Date() ? "destructive" : "secondary"} className="text-xs">
                        <Calendar className="h-2 w-2 mr-1" />
                        {note.reminder.toLocaleDateString()}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {completedCount}/{tasks.length}
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="h-1" />
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => toggleTask(note, taskIndex)}
                  >
                    {task.completed ? (
                      <CheckSquare className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm flex-1",
                        task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white",
                      )}
                    >
                      {task.text}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}

        {filteredNotes.length === 0 && (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tasks found for the selected filter.</p>
            <Button onClick={createNewTask} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
