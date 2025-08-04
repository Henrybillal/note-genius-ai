"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  BarChart3,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Copy,
  Download,
  Share,
} from "lucide-react"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

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

interface AdvancedAIFeaturesProps {
  notes: Note[]
  onCreateNote: (note: Note) => void
}

export function AdvancedAIFeatures({ notes, onCreateNote }: AdvancedAIFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish")
  const [analysisType, setAnalysisType] = useState("comprehensive")
  const [creativityLevel, setCreativityLevel] = useState("balanced")

  const advancedFeatures = [
    {
      id: "smart-insights",
      title: "Smart Insights",
      description: "Get AI-powered insights from your note collection",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "productivity-coach",
      title: "Productivity Coach",
      description: "Personalized productivity recommendations",
      icon: Target,
      color: "from-green-500 to-teal-500",
    },
    {
      id: "content-optimizer",
      title: "Content Optimizer",
      description: "Optimize your writing for clarity and impact",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "research-assistant",
      title: "Research Assistant",
      description: "Generate research questions and outlines",
      icon: BookOpen,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "meeting-prep",
      title: "Meeting Prep",
      description: "Prepare agendas and talking points",
      icon: MessageCircle,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "creative-writer",
      title: "Creative Writer",
      description: "Generate creative content and stories",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  const processAdvancedAI = async (feature: string) => {
    setIsLoading(true)
    setAiResponse("")

    try {
      let prompt = ""
      const systemPrompt =
        "You are an advanced AI assistant specializing in productivity, creativity, and intelligent content analysis."

      switch (feature) {
        case "smart-insights":
          const recentNotes = notes
            .slice(0, 10)
            .map((note) => `${note.title}: ${note.content.substring(0, 200)}`)
            .join("\n\n")
          prompt = `Analyze the following collection of notes and provide intelligent insights about patterns, themes, productivity trends, and actionable recommendations:\n\n${recentNotes}`
          break

        case "productivity-coach":
          const taskNotes = notes.filter((note) => note.type === "checklist" || note.content.includes("[ ]"))
          const taskContent = taskNotes.map((note) => note.content).join("\n")
          prompt = `Based on the following tasks and notes, provide personalized productivity coaching advice, time management tips, and optimization strategies:\n\n${taskContent}\n\nAdditional context: ${input}`
          break

        case "content-optimizer":
          prompt = `Analyze and optimize the following content for clarity, impact, readability, and engagement. Provide the optimized version and explain the improvements:\n\n${input}`
          break

        case "research-assistant":
          prompt = `Act as a research assistant for the topic: "${input}". Generate comprehensive research questions, create an outline, suggest reliable sources, and provide a research methodology.`
          break

        case "meeting-prep":
          prompt = `Help prepare for a meeting about: "${input}". Create an agenda, suggest talking points, prepare potential questions, and recommend follow-up actions.`
          break

        case "creative-writer":
          prompt = `Using "${input}" as inspiration, create engaging creative content. Creativity level: ${creativityLevel}. Include multiple variations and creative approaches.`
          break

        default:
          prompt = input
      }

      const { text } = await generateText({
        model: google("gemini-1.5-pro", {
          apiKey: "AIzaSyDn3GSqmn_fCPldNulFa8nv1ZTRsRGmZIM",
        }),
        system: systemPrompt,
        prompt: prompt,
        maxTokens: 1500,
        temperature: feature === "creative-writer" ? 0.9 : 0.7,
      })

      setAiResponse(text)
    } catch (error) {
      console.error("Advanced AI Error:", error)
      setAiResponse("I encountered an error processing your request. Please try again or check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const createNoteFromAI = () => {
    if (!aiResponse) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: `AI ${activeFeature?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}: ${new Date().toLocaleDateString()}`,
      content: aiResponse,
      tags: ["ai-generated", "advanced-ai", activeFeature || "ai"],
      folder: "AI Insights",
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
      isPrivate: false,
      type: "note",
      aiGenerated: true,
    }

    onCreateNote(newNote)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced AI Features</h2>
            <p className="text-sm text-gray-500">Powered by Google Gemini AI</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advancedFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                activeFeature === feature.id ? "ring-2 ring-purple-500 shadow-lg" : ""
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-3">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}
                  >
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-xs text-gray-500 font-normal">{feature.description}</div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Feature Configuration */}
        {activeFeature && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                {advancedFeatures.find((f) => f.id === activeFeature)?.title} Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input based on feature type */}
              {(activeFeature === "content-optimizer" ||
                activeFeature === "research-assistant" ||
                activeFeature === "meeting-prep" ||
                activeFeature === "creative-writer") && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {activeFeature === "research-assistant"
                      ? "Research Topic"
                      : activeFeature === "meeting-prep"
                        ? "Meeting Topic"
                        : activeFeature === "creative-writer"
                          ? "Creative Prompt"
                          : "Content to Optimize"}
                  </label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      activeFeature === "research-assistant"
                        ? "Enter your research topic..."
                        : activeFeature === "meeting-prep"
                          ? "What's the meeting about?"
                          : activeFeature === "creative-writer"
                            ? "Describe what you want to create..."
                            : "Paste your content here..."
                    }
                    className="min-h-[100px]"
                  />
                </div>
              )}

              {activeFeature === "productivity-coach" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tell me about your current challenges, goals, or specific areas you'd like help with..."
                    className="min-h-[80px]"
                  />
                </div>
              )}

              {/* Creative Writer Options */}
              {activeFeature === "creative-writer" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Creativity Level</label>
                  <Select value={creativityLevel} onValueChange={setCreativityLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Analysis Type for Content Optimizer */}
              {activeFeature === "content-optimizer" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                      <SelectItem value="readability">Readability Focus</SelectItem>
                      <SelectItem value="engagement">Engagement Focus</SelectItem>
                      <SelectItem value="professional">Professional Tone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={() => processAdvancedAI(activeFeature)}
                disabled={
                  isLoading ||
                  ((activeFeature === "content-optimizer" ||
                    activeFeature === "research-assistant" ||
                    activeFeature === "meeting-prep" ||
                    activeFeature === "creative-writer") &&
                    !input.trim())
                }
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate AI Response
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Response */}
        {aiResponse && (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                  AI Response
                  <Badge variant="secondary" className="ml-2">
                    Powered by Gemini
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(aiResponse)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={createNoteFromAI}>
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {aiResponse}
                </pre>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={createNoteFromAI} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Download className="h-3 w-3 mr-1" />
                  Save as Note
                </Button>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(aiResponse)} size="sm">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Response
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              AI Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-xs text-gray-500">AI Requests Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">1.2k</div>
                <div className="text-xs text-gray-500">Words Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-xs text-gray-500">Notes Enhanced</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-xs text-gray-500">Accuracy Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
