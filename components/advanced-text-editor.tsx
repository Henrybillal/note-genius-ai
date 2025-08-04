"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Highlighter,
  FileText,
  Save,
  Download,
  Maximize,
  Minimize,
  Focus,
  Mic,
  MicOff,
  Hash,
  Calendar,
  Eye,
  Clock,
  CheckSquare,
  Minus,
} from "lucide-react"

interface AdvancedTextEditorProps {
  content: string
  onChange: (content: string) => void
  onSave?: () => void
}

export function AdvancedTextEditor({ content, onChange, onSave }: AdvancedTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [selectedTheme, setSelectedTheme] = useState("default")
  const [highlightColor, setHighlightColor] = useState("#ffeb3b")
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [autoSave, setAutoSave] = useState(true)
  const [showMinimap, setShowMinimap] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(false)
  const [textStats, setTextStats] = useState({
    words: 0,
    characters: 0,
    paragraphs: 0,
    readingTime: 0,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  const fonts = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Monaco", value: "Monaco, monospace" },
    { name: "Roboto", value: "Roboto, sans-serif" },
  ]

  const themes = [
    { name: "Default", value: "default", bg: "bg-white", text: "text-gray-900" },
    { name: "Dark", value: "dark", bg: "bg-gray-900", text: "text-white" },
    { name: "Sepia", value: "sepia", bg: "bg-amber-50", text: "text-amber-900" },
    { name: "High Contrast", value: "contrast", bg: "bg-black", text: "text-white" },
    { name: "Blue Light", value: "blue-light", bg: "bg-blue-50", text: "text-blue-900" },
    { name: "Green", value: "green", bg: "bg-green-50", text: "text-green-900" },
  ]

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characters = content.length
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    const readingTime = Math.ceil(words / 200) // Average reading speed

    setTextStats({ words, characters, paragraphs, readingTime })
  }, [content])

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        onSave?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [content, autoSave, onSave])

  const initVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          onChange(content + " " + finalTranscript)
        }
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      initVoiceRecognition()
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const insertSmartContent = (type: string) => {
    const currentDate = new Date()
    let insertText = ""

    switch (type) {
      case "date":
        insertText = currentDate.toLocaleDateString()
        break
      case "time":
        insertText = currentDate.toLocaleTimeString()
        break
      case "datetime":
        insertText = currentDate.toLocaleString()
        break
      case "signature":
        insertText = "\n\nBest regards,\n[Your Name]"
        break
      case "divider":
        insertText = "\n\n" + "─".repeat(50) + "\n\n"
        break
      case "template-meeting":
        insertText = `
# Meeting Notes - ${currentDate.toLocaleDateString()}

## Attendees
- 

## Agenda
1. 
2. 
3. 

## Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
- 
`
        break
      case "template-todo":
        insertText = `
# To-Do List - ${currentDate.toLocaleDateString()}

## High Priority
- [ ] 
- [ ] 

## Medium Priority
- [ ] 
- [ ] 

## Low Priority
- [ ] 
- [ ] 

## Completed
- [x] 
`
        break
    }

    onChange(content + insertText)
  }

  const applyHighlight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    if (selectedText) {
      const highlightedText = `<mark style="background-color: ${highlightColor}">${selectedText}</mark>`
      const newContent = content.substring(0, start) + highlightedText + content.substring(end)
      onChange(newContent)
    }
  }

  const exportDocument = (format: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentTheme = themes.find((t) => t.value === selectedTheme) || themes[0]
  const currentFont = fonts.find((f) => f.name === selectedFont) || fonts[0]

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : "h-full"} flex flex-col ${currentTheme.bg} ${currentTheme.text} transition-all duration-300`}
    >
      {/* Advanced Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.name} value={font.name}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <Button variant="ghost" size="sm" onClick={applyHighlight}>
                <Highlighter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceRecognition}
              className={isListening ? "bg-red-100 text-red-600" : ""}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsFocusMode(!isFocusMode)}>
              <Focus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!isFocusMode && (
          <div className="flex items-center gap-1 overflow-x-auto">
            <Button variant="ghost" size="sm" onClick={() => insertSmartContent("date")}>
              <Calendar className="h-3 w-3 mr-1" />
              Date
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertSmartContent("time")}>
              <Clock className="h-3 w-3 mr-1" />
              Time
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertSmartContent("template-meeting")}>
              <FileText className="h-3 w-3 mr-1" />
              Meeting
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertSmartContent("template-todo")}>
              <CheckSquare className="h-3 w-3 mr-1" />
              Todo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertSmartContent("divider")}>
              <Minus className="h-3 w-3 mr-1" />
              Divider
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportDocument("txt")}>
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        {/* Line Numbers */}
        {showLineNumbers && !isFocusMode && (
          <div className="w-12 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 font-mono">
            {content.split("\n").map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-full border-none resize-none focus-visible:ring-0 ${currentTheme.bg} ${currentTheme.text} leading-relaxed`}
            style={{
              fontFamily: currentFont.value,
              fontSize: "16px",
              lineHeight: "1.6",
              padding: isFocusMode ? "2rem" : "1rem",
            }}
            placeholder="Start writing your masterpiece..."
          />

          {/* Voice Recognition Indicator */}
          {isListening && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              🎤 Listening...
            </div>
          )}
        </div>

        {/* Minimap */}
        {showMinimap && !isFocusMode && (
          <div className="w-32 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-2">
            <div className="text-xs text-gray-500 mb-2">Minimap</div>
            <div className="text-xs leading-tight opacity-60 overflow-hidden">{content.substring(0, 500)}...</div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {!isFocusMode && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{textStats.words} words</span>
              <span>{textStats.characters} characters</span>
              <span>{textStats.paragraphs} paragraphs</span>
              <span>{textStats.readingTime} min read</span>
              {autoSave && <Badge variant="secondary">Auto-save ON</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={showLineNumbers ? "bg-blue-100" : ""}
              >
                <Hash className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMinimap(!showMinimap)}
                className={showMinimap ? "bg-blue-100" : ""}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoSave(!autoSave)}
                className={autoSave ? "bg-green-100" : ""}
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
