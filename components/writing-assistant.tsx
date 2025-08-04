"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Eye,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Brain,
} from "lucide-react"

interface WritingAssistantProps {
  content: string
  onSuggestionApply: (suggestion: string) => void
}

export function WritingAssistant({ content, onSuggestionApply }: WritingAssistantProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "suggestions" | "goals">("stats")

  // Analyze content
  const analyzeContent = () => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)

    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0
    const avgSentencesPerParagraph = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0
    const readabilityScore = Math.max(0, Math.min(100, 100 - avgWordsPerSentence * 2))

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 10) / 10,
      readabilityScore: Math.round(readabilityScore),
      estimatedReadingTime: Math.ceil(words.length / 200),
    }
  }

  const stats = analyzeContent()

  const suggestions = [
    {
      type: "readability",
      icon: Eye,
      title: "Improve Readability",
      description: "Some sentences are quite long. Consider breaking them down.",
      severity: "medium",
      suggestion: "Break long sentences into shorter, clearer ones.",
    },
    {
      type: "engagement",
      icon: Lightbulb,
      title: "Add More Examples",
      description: "Your content could benefit from concrete examples.",
      severity: "low",
      suggestion: "Include specific examples to illustrate your points.",
    },
    {
      type: "structure",
      icon: Target,
      title: "Improve Structure",
      description: "Consider adding subheadings to organize your content.",
      severity: "medium",
      suggestion: "Add subheadings to break up large sections of text.",
    },
    {
      type: "tone",
      icon: Brain,
      title: "Tone Consistency",
      description: "Maintain a consistent tone throughout your writing.",
      severity: "low",
      suggestion: "Review your writing for consistent tone and voice.",
    },
  ]

  const writingGoals = [
    { name: "Daily Word Count", target: 500, current: stats.wordCount, icon: Target },
    { name: "Reading Time", target: 5, current: stats.estimatedReadingTime, icon: Clock },
    { name: "Readability Score", target: 80, current: stats.readabilityScore, icon: TrendingUp },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-orange-600 bg-orange-100"
      case "low":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return AlertCircle
      case "medium":
        return Info
      case "low":
        return CheckCircle
      default:
        return Info
    }
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Writing Assistant
        </h3>
        <div className="flex gap-1 mt-2">
          {["stats", "suggestions", "goals"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab as any)}
              className="text-xs"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "stats" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Content Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.wordCount}</div>
                    <div className="text-xs text-gray-500">Words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.sentenceCount}</div>
                    <div className="text-xs text-gray-500">Sentences</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.paragraphCount}</div>
                    <div className="text-xs text-gray-500">Paragraphs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{stats.estimatedReadingTime}</div>
                    <div className="text-xs text-gray-500">Min Read</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Readability Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Readability Score</span>
                    <span>{stats.readabilityScore}/100</span>
                  </div>
                  <Progress value={stats.readabilityScore} className="h-2" />
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Avg words per sentence: {stats.avgWordsPerSentence}</div>
                  <div>Avg sentences per paragraph: {stats.avgSentencesPerParagraph}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const SeverityIcon = getSeverityIcon(suggestion.severity)
              return (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <suggestion.icon className="h-4 w-4" />
                      {suggestion.title}
                      <Badge variant="secondary" className={`text-xs ${getSeverityColor(suggestion.severity)}`}>
                        <SeverityIcon className="h-2 w-2 mr-1" />
                        {suggestion.severity}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSuggestionApply(suggestion.suggestion)}
                      className="text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Apply Suggestion
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {activeTab === "goals" && (
          <div className="space-y-4">
            {writingGoals.map((goal, index) => {
              const progress = Math.min(100, (goal.current / goal.target) * 100)
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <goal.icon className="h-4 w-4" />
                      {goal.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        {goal.current} / {goal.target}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {progress >= 100 && (
                      <Badge variant="secondary" className="text-xs mt-2 bg-green-100 text-green-800">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Goal Achieved!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
