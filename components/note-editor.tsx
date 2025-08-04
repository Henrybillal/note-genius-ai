"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Share,
  Download,
  Lock,
  Unlock,
  Tag,
  Brain,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  EyeOff,
  Strikethrough,
  Code,
  Quote,
  Link,
  ImageIcon,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Undo,
  Redo,
  Search,
  Replace,
  Type,
  Minus,
  CheckSquare,
  Clock,
  Zap,
  BookOpen,
} from "lucide-react"
import { AdvancedTextEditor } from "@/components/advanced-text-editor"
import { WritingAssistant } from "@/components/writing-assistant"

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

interface NoteEditorProps {
  note: Note
  onUpdate: (note: Note) => void
  onDelete: (noteId: string) => void
  onBack: () => void
}

export function NoteEditor({ note, onUpdate, onDelete, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags)
  const [newTag, setNewTag] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.5)
  const [showAdvancedToolbar, setShowAdvancedToolbar] = useState(false)
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false)
  const [showWritingAssistant, setShowWritingAssistant] = useState(false)

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    const characters = content.length
    setWordCount(words)
    setCharacterCount(characters)

    const updatedNote = {
      ...note,
      title,
      content,
      tags,
      updatedAt: new Date(),
    }
    onUpdate(updatedNote)
  }, [title, content, tags])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const saveToUndoStack = () => {
    setUndoStack((prev) => [...prev.slice(-19), content])
    setRedoStack([])
  }

  const undo = () => {
    if (undoStack.length > 0) {
      const lastContent = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [content, ...prev])
      setUndoStack((prev) => prev.slice(0, -1))
      setContent(lastContent)
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0]
      setUndoStack((prev) => [...prev, content])
      setRedoStack((prev) => prev.slice(1))
      setContent(nextContent)
    }
  }

  const insertTable = () => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`
    setContent((prev) => prev + tableMarkdown)
  }

  const insertLink = () => {
    const linkText = prompt("Enter link text:")
    const linkUrl = prompt("Enter URL:")
    if (linkText && linkUrl) {
      const linkMarkdown = `[${linkText}](${linkUrl})`
      setContent((prev) => prev + linkMarkdown)
    }
  }

  const insertImage = () => {
    const altText = prompt("Enter image description:")
    const imageUrl = prompt("Enter image URL:")
    if (altText && imageUrl) {
      const imageMarkdown = `![${altText}](${imageUrl})`
      setContent((prev) => prev + imageMarkdown)
    }
  }

  const findAndReplace = () => {
    if (findText && replaceText) {
      const newContent = content.replaceAll(findText, replaceText)
      setContent(newContent)
      setFindText("")
      setReplaceText("")
    }
  }

  const insertCurrentDateTime = () => {
    const now = new Date()
    const dateTime = now.toLocaleString()
    setContent((prev) => prev + `\n\n**${dateTime}**\n`)
  }

  const insertCheckbox = () => {
    setContent((prev) => prev + "\n- [ ] ")
  }

  const toggleCheckbox = (lineIndex: number) => {
    const lines = content.split("\n")
    const line = lines[lineIndex]
    if (line.includes("- [ ]")) {
      lines[lineIndex] = line.replace("- [ ]", "- [x]")
    } else if (line.includes("- [x]")) {
      lines[lineIndex] = line.replace("- [x]", "- [ ]")
    }
    setContent(lines.join("\n"))
  }

  const insertDivider = () => {
    setContent((prev) => prev + "\n\n---\n\n")
  }

  const insertCodeBlock = () => {
    const language = prompt("Enter programming language (optional):")
    const codeBlock = `\n\`\`\`${language || ""}\n// Your code here\n\`\`\`\n`
    setContent((prev) => prev + codeBlock)
  }

  const applyTextAlignment = (alignment: string) => {
    const alignmentMap = {
      left: '<div align="left">',
      center: '<div align="center">',
      right: '<div align="right">',
      justify: '<div align="justify">',
    }
    const selectedText = getSelectedText()
    if (selectedText) {
      const alignedText = `${alignmentMap[alignment]}${selectedText}</div>`
      replaceSelectedText(alignedText)
    }
  }

  const getSelectedText = () => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (!textarea) return ""
    return content.substring(textarea.selectionStart, textarea.selectionEnd)
  }

  const replaceSelectedText = (newText: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement
    if (!textarea) return

    saveToUndoStack()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ""
    switch (format) {
      case "bold":
        newText = `**${selectedText}**`
        break
      case "italic":
        newText = `*${selectedText}*`
        break
      case "underline":
        newText = `<u>${selectedText}</u>`
        break
      case "strikethrough":
        newText = `~~${selectedText}~~`
        break
      case "h1":
        newText = `# ${selectedText}`
        break
      case "h2":
        newText = `## ${selectedText}`
        break
      case "h3":
        newText = `### ${selectedText}`
        break
      case "ul":
        newText = `- ${selectedText}`
        break
      case "ol":
        newText = `1. ${selectedText}`
        break
      case "quote":
        newText = `> ${selectedText}`
        break
      case "code":
        newText = `\`${selectedText}\``
        break
      case "indent":
        newText = `    ${selectedText}`
        break
      case "outdent":
        newText = selectedText.replace(/^ {4}/, "")
        break
      default:
        newText = selectedText
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>")
  }

  const exportNote = (format: "txt" | "md" | "pdf") => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}>
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowWritingAssistant(!showWritingAssistant)}>
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onUpdate({ ...note, isLocked: !note.isLocked })}>
              {note.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportNote("md")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
          placeholder="Note title..."
        />

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
          <span>Created: {note.createdAt.toLocaleDateString()}</span>
          <span>Updated: {note.updatedAt.toLocaleDateString()}</span>
          {note.aiGenerated && (
            <Badge variant="secondary" className="text-xs">
              <Brain className="h-2 w-2 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
      </header>

      {/* Enhanced Formatting Toolbar */}
      {(showToolbar || showAdvancedToolbar) && !isPreviewMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {/* Basic Toolbar */}
          <div className="p-2 flex items-center gap-1 overflow-x-auto">
            <Button variant="ghost" size="sm" onClick={undo} disabled={undoStack.length === 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button variant="ghost" size="sm" onClick={() => insertFormatting("bold")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("italic")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("underline")}>
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("strikethrough")}>
              <Strikethrough className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button variant="ghost" size="sm" onClick={() => insertFormatting("h1")}>
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("h2")}>
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("h3")}>
              <Heading3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button variant="ghost" size="sm" onClick={() => insertFormatting("ul")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormatting("ol")}>
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={insertCheckbox}>
              <CheckSquare className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button variant="ghost" size="sm" onClick={() => setShowFindReplace(!showFindReplace)}>
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvancedToolbar(!showAdvancedToolbar)}>
              <Zap className="h-4 w-4" />
            </Button>
          </div>

          {/* Advanced Toolbar */}
          {showAdvancedToolbar && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center gap-1 overflow-x-auto">
                <Button variant="ghost" size="sm" onClick={() => insertFormatting("quote")}>
                  <Quote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertFormatting("code")}>
                  <Code className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertCodeBlock}>
                  <Code className="h-4 w-4" />
                  <span className="text-xs ml-1">Block</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={insertLink}>
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertImage}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertTable}>
                  <Table className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertDivider}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={insertCurrentDateTime}>
                  <Clock className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                <Button variant="ghost" size="sm" onClick={() => applyTextAlignment("left")}>
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyTextAlignment("center")}>
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyTextAlignment("right")}>
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyTextAlignment("justify")}>
                  <AlignJustify className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button variant="ghost" size="sm" onClick={() => insertFormatting("indent")}>
                  <Indent className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertFormatting("outdent")}>
                  <Outdent className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs">Font Size:</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs">{fontSize}px</span>

                <label className="text-xs ml-4">Line Height:</label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs">{lineHeight}</span>
              </div>
            </div>
          )}

          {/* Find and Replace */}
          {showFindReplace && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Find..."
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Replace..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={findAndReplace} size="sm">
                  <Replace className="h-3 w-3 mr-1" />
                  Replace All
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {showAdvancedEditor ? (
            <AdvancedTextEditor
              content={content}
              onChange={setContent}
              onSave={() => onUpdate({ ...note, title, content, tags, updatedAt: new Date() })}
            />
          ) : (
            <div className="p-4">
              {isPreviewMode ? (
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
                />
              ) : (
                <Textarea
                  id="content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setShowToolbar(true)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      if (e.key === "z" && !e.shiftKey) {
                        e.preventDefault()
                        undo()
                      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
                        e.preventDefault()
                        redo()
                      } else if (e.key === "f") {
                        e.preventDefault()
                        setShowFindReplace(true)
                      }
                    }
                  }}
                  className="min-h-[400px] border-none resize-none focus-visible:ring-0 text-base leading-relaxed"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                  placeholder="Start writing your note..."
                />
              )}
            </div>
          )}
        </div>

        {/* Writing Assistant Sidebar */}
        {showWritingAssistant && (
          <WritingAssistant
            content={content}
            onSuggestionApply={(suggestion) => {
              // Apply writing suggestions
              setContent((prev) => prev + "\n\n" + suggestion)
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{wordCount} words</span>
            <span>{characterCount} characters</span>
            <span>Line {content.substring(0, content.lastIndexOf("\n")).split("\n").length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{isPreviewMode ? "Preview" : "Edit"} Mode</span>
            {note.aiGenerated && (
              <Badge variant="secondary" className="text-xs">
                <Brain className="h-2 w-2 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              <Tag className="h-2 w-2 mr-1" />
              {tag}
              <span className="ml-1 text-xs">×</span>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            placeholder="Add tag..."
            className="flex-1"
          />
          <Button onClick={addTag} size="sm">
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
