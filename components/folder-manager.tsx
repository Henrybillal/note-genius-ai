"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, FolderPlus, FileText, MoreVertical, Edit, Move, Lock, Eye, EyeOff } from "lucide-react"
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

interface FolderManagerProps {
  notes: Note[]
  onUpdateNote: (note: Note) => void
}

export function FolderManager({ notes, onUpdateNote }: FolderManagerProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [showPrivate, setShowPrivate] = useState(false)

  const folders = Array.from(new Set(notes.map((note) => note.folder)))

  const getFolderStats = (folderName: string) => {
    const folderNotes = notes.filter((note) => note.folder === folderName)
    return {
      total: folderNotes.length,
      private: folderNotes.filter((note) => note.isPrivate).length,
      locked: folderNotes.filter((note) => note.isLocked).length,
      recent: folderNotes.filter((note) => {
        const dayAgo = new Date()
        dayAgo.setDate(dayAgo.getDate() - 1)
        return note.updatedAt > dayAgo
      }).length,
    }
  }

  const createFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      // Create a placeholder note for the new folder
      const placeholderNote: Note = {
        id: `folder-${Date.now()}`,
        title: "Welcome to your new folder",
        content: `This is your new folder: ${newFolderName}. Start adding notes here!`,
        tags: ["folder-placeholder"],
        folder: newFolderName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isLocked: false,
        isPrivate: false,
        type: "note",
      }
      onUpdateNote(placeholderNote)
      setNewFolderName("")
      setIsCreatingFolder(false)
    }
  }

  const moveNoteToFolder = (note: Note, targetFolder: string) => {
    const updatedNote = {
      ...note,
      folder: targetFolder,
      updatedAt: new Date(),
    }
    onUpdateNote(updatedNote)
  }

  const toggleNotePrivacy = (note: Note) => {
    const updatedNote = {
      ...note,
      isPrivate: !note.isPrivate,
      updatedAt: new Date(),
    }
    onUpdateNote(updatedNote)
  }

  const filteredNotes = selectedFolder
    ? notes.filter((note) => note.folder === selectedFolder && (showPrivate || !note.isPrivate))
    : []

  return (
    <div className="h-full flex bg-white dark:bg-gray-900">
      {/* Folders Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Folders
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCreatingFolder(true)}>
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>

          {isCreatingFolder && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createFolder()}
                placeholder="Folder name..."
                className="flex-1"
                autoFocus
              />
              <Button onClick={createFolder} size="sm">
                Create
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setShowPrivate(!showPrivate)} className="text-xs">
              {showPrivate ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {showPrivate ? "Hide Private" : "Show Private"}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto">
          {folders.map((folder) => {
            const stats = getFolderStats(folder)
            return (
              <Card
                key={folder}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedFolder === folder ? "ring-2 ring-blue-500" : "",
                )}
                onClick={() => setSelectedFolder(folder)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-blue-500" />
                      {folder}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <FileText className="h-2 w-2" />
                      <span>{stats.total} notes</span>
                    </div>
                    {stats.private > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-2 w-2" />
                        <span>{stats.private} private</span>
                      </div>
                    )}
                    {stats.locked > 0 && (
                      <div className="flex items-center gap-1">
                        <Lock className="h-2 w-2" />
                        <span>{stats.locked} locked</span>
                      </div>
                    )}
                    {stats.recent > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{stats.recent} recent</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Folder Content */}
      <div className="flex-1 overflow-hidden">
        {selectedFolder ? (
          <div className="h-full flex flex-col">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedFolder}</h3>
                  <p className="text-sm text-gray-500">{filteredNotes.length} notes</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Move className="h-3 w-3 mr-1" />
                    Move Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Rename Folder
                  </Button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-1 flex items-center gap-2">
                        {note.isLocked && <Lock className="h-3 w-3 text-gray-500" />}
                        {note.isPrivate && <Eye className="h-3 w-3 text-purple-500" />}
                        {note.title}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toggleNotePrivacy(note)}>
                          {note.isPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{note.updatedAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{note.type}</span>
                      {note.aiGenerated && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            AI
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {note.content.replace(/[#*\-[\]]/g, "").substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredNotes.length === 0 && (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedFolder ? `No notes in ${selectedFolder} folder.` : "This folder is empty."}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Folder</h3>
              <p className="text-gray-500">Choose a folder from the sidebar to view and manage its contents.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
