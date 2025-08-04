"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Send,
  Sparkles,
  FileText,
  CheckSquare,
  Mail,
  Lightbulb,
  Search,
  Wand2,
  MessageSquare,
  Copy,
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

interface AIAssistantProps {
  notes: Note[]
  onCreateNote: (note: Note) => void
}

export function AIAssistant({ notes, onCreateNote }: AIAssistantProps) {
  const [input, setInput] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const aiFeatures = [
    {
      id: "summarize",
      title: "Smart Summary",
      description: "Get intelligent summaries with key insights",
      icon: FileText,
      requiresNote: true,
    },
    {
      id: "todo",
      title: "Task Generator",
      description: "Convert text into prioritized action items",
      icon: CheckSquare,
      requiresNote: true,
    },
    {
      id: "email",
      title: "Email Composer",
      description: "Transform notes into professional emails",
      icon: Mail,
      requiresNote: true,
    },
    {
      id: "expand",
      title: "Idea Expander",
      description: "Elaborate concepts with examples and details",
      icon: Lightbulb,
      requiresNote: false,
    },
    {
      id: "keywords",
      title: "Keyword Extractor",
      description: "Find and categorize important terms",
      icon: Search,
      requiresNote: true,
    },
    {
      id: "grammar",
      title: "Writing Assistant",
      description: "Improve grammar, style, and clarity",
      icon: Wand2,
      requiresNote: true,
    },
    {
      id: "title",
      title: "Title Generator",
      description: "Create engaging titles and headlines",
      icon: Sparkles,
      requiresNote: true,
    },
    {
      id: "translate",
      title: "Smart Translator",
      description: "Translate text while preserving meaning",
      icon: MessageSquare,
      requiresNote: true,
    },
    {
      id: "analyze",
      title: "Content Analyzer",
      description: "Analyze sentiment, tone, and themes",
      icon: Brain,
      requiresNote: true,
    },
    {
      id: "brainstorm",
      title: "Brainstorm Assistant",
      description: "Generate creative ideas and suggestions",
      icon: Lightbulb,
      requiresNote: false,
    },
    {
      id: "chat",
      title: "AI Chat",
      description: "Have intelligent conversations",
      icon: MessageSquare,
      requiresNote: false,
    },
  ]

  const processAIRequest = async (feature: string, noteContent?: string) => {
    setIsLoading(true)
    setAiResponse("")

    try {
      let prompt = ""
      let systemPrompt =
        "You are NoteGenius AI, an advanced AI assistant for a premium note-taking app. Provide helpful, accurate, and well-formatted responses."

      switch (feature) {
        case "summarize":
          prompt = `Please provide a comprehensive summary of the following note, highlighting key points and main ideas:\n\n${noteContent}`
          break
        case "todo":
          prompt = `Analyze the following text and create a detailed, actionable to-do list with priorities and estimated time requirements:\n\n${noteContent}`
          break
        case "email":
          prompt = `Transform the following note into a professional, well-structured email with appropriate subject line, greeting, body, and closing:\n\n${noteContent}`
          break
        case "expand":
          prompt = `Expand on the following idea with detailed explanations, examples, practical applications, and related concepts:\n\n${input || noteContent}`
          break
        case "keywords":
          prompt = `Extract and categorize key terms, topics, and important keywords from the following text. Organize them by relevance and provide brief explanations:\n\n${noteContent}`
          break
        case "grammar":
          prompt = `Please review and improve the grammar, spelling, style, and clarity of the following text. Provide the corrected version and explain major changes:\n\n${noteContent}`
          break
        case "title":
          prompt = `Suggest 5 creative, engaging, and SEO-friendly titles for the following content. Make them catchy and descriptive:\n\n${noteContent}`
          break
        case "chat":
          prompt = input
          systemPrompt +=
            " Answer questions about productivity, note-taking, organization, and help users be more efficient with their work."
          break
        case "translate":
          prompt = `Translate the following text to ${input || "Spanish"} while maintaining the original meaning and tone:\n\n${noteContent}`
          break
        case "analyze":
          prompt = `Analyze the following text for sentiment, tone, key themes, and provide insights about the content:\n\n${noteContent}`
          break
        case "brainstorm":
          prompt = `Based on the following topic or idea, generate creative brainstorming suggestions, related concepts, and actionable next steps:\n\n${input || noteContent}`
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
        maxTokens: 1000,
        temperature: 0.7,
      })

      setAiResponse(text)
    } catch (error) {
      console.error("AI Error:", error)
      setAiResponse(
        "Sorry, I encountered an error processing your request. Please check your internet connection and try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const createNoteFromAI = () => {
    if (!aiResponse) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: `AI Generated: ${activeFeature?.charAt(0).toUpperCase()}${activeFeature?.slice(1)}`,
      content: aiResponse,
      tags: ["ai-generated", activeFeature || "ai"],
      folder: "AI Generated",
      createdAt: new Date(),
      updatedAt: new Date(),
      isLocked: false,
      isPrivate: false,
      type: "note",
      aiGenerated: true,
    }

    onCreateNote(newNote)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
            <p className="text-sm text-gray-500">Enhance your notes with AI-powered features</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiFeatures.map((feature) => (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeFeature === feature.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-blue-500" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 dark:text-gray-300">{feature.description}</p>
                {feature.requiresNote && (
                  <Badge variant="outline" className="text-xs mt-2">
                    Requires note selection
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note Selection */}
        {activeFeature && aiFeatures.find((f) => f.id === activeFeature)?.requiresNote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Select a Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notes.slice(0, 5).map((note) => (
                <div
                  key={note.id}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{note.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {note.folder}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{note.content.substring(0, 100)}...</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        {activeFeature && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{aiFeatures.find((f) => f.id === activeFeature)?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(!aiFeatures.find((f) => f.id === activeFeature)?.requiresNote ||
                activeFeature === "expand" ||
                activeFeature === "chat") && (
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeFeature === "chat"
                      ? "Ask me anything about your notes or productivity..."
                      : "Enter your text or question..."
                  }
                  className="min-h-[100px]"
                />
              )}
              <Button
                onClick={() => processAIRequest(activeFeature, selectedNote?.content)}
                disabled={isLoading || (aiFeatures.find((f) => f.id === activeFeature)?.requiresNote && !selectedNote)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Response */}
        {aiResponse && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  AI Response
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={createNoteFromAI}>
                    <FileText className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{aiResponse}</pre>
              </div>
              <div className="flex gap-2 mt-3">
                <Button onClick={createNoteFromAI} size="sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Save as Note
                </Button>
                <Button variant="outline" onClick={copyToClipboard} size="sm">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
