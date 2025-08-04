"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Settings,
  Moon,
  Sun,
  Cloud,
  Bell,
  Palette,
  Shield,
  Download,
  Upload,
  Smartphone,
  Monitor,
  Fingerprint,
  Key,
  Database,
} from "lucide-react"

interface SettingsPanelProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function SettingsPanel({ isDarkMode, onToggleDarkMode }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    autoSync: true,
    biometricLock: false,
    notificationsEnabled: true,
    dailySummary: true,
    aiSuggestions: true,
    fontSize: 16,
    lineHeight: 1.5,
    autoBackup: true,
    encryptNotes: true,
    offlineMode: false,
    accentColor: "blue",
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const accentColors = [
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
    { name: "Teal", value: "teal", color: "bg-teal-500" },
  ]

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-sm text-gray-500">Customize your NoteGenius AI experience</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onToggleDarkMode} className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {isDarkMode ? "Dark" : "Light"}
              </Button>
            </div>

            <div>
              <p className="font-medium mb-3">Accent Color</p>
              <div className="grid grid-cols-3 gap-2">
                {accentColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={settings.accentColor === color.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting("accentColor", color.value)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-3 h-3 rounded-full ${color.color}`} />
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Font Size: {settings.fontSize}px</p>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting("fontSize", value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <p className="font-medium mb-2">Line Height: {settings.lineHeight}</p>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={(value) => updateSetting("lineHeight", value[0])}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Biometric Lock</p>
                <p className="text-sm text-gray-500">Use fingerprint or face ID to unlock app</p>
              </div>
              <Switch
                checked={settings.biometricLock}
                onCheckedChange={(checked) => updateSetting("biometricLock", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Encrypt Notes</p>
                <p className="text-sm text-gray-500">Encrypt notes stored locally</p>
              </div>
              <Switch
                checked={settings.encryptNotes}
                onCheckedChange={(checked) => updateSetting("encryptNotes", checked)}
              />
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Key className="h-4 w-4 mr-2" />
                Change App PIN
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Fingerprint className="h-4 w-4 mr-2" />
                Manage Biometric Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync & Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Sync & Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Sync</p>
                <p className="text-sm text-gray-500">Automatically sync notes across devices</p>
              </div>
              <Switch checked={settings.autoSync} onCheckedChange={(checked) => updateSetting("autoSync", checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-sm text-gray-500">Daily backup to cloud storage</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Offline Mode</p>
                <p className="text-sm text-gray-500">Work without internet connection</p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => updateSetting("offlineMode", checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-3 w-3 mr-1" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive reminders and updates</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-gray-500">Get daily overview of pending tasks</p>
              </div>
              <Switch
                checked={settings.dailySummary}
                onCheckedChange={(checked) => updateSetting("dailySummary", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Suggestions</p>
                <p className="text-sm text-gray-500">Receive AI-powered productivity tips</p>
              </div>
              <Switch
                checked={settings.aiSuggestions}
                onCheckedChange={(checked) => updateSetting("aiSuggestions", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used Storage</span>
                <span>2.4 GB / 5 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "48%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Database className="h-3 w-3 mr-1" />
                Clear Cache
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-3 w-3 mr-1" />
                Upgrade Storage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About NoteGenius AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Version</span>
              <Badge variant="secondary">v2.1.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Build</span>
              <span className="text-sm">2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Platform</span>
              <div className="flex gap-1">
                <Smartphone className="h-3 w-3" />
                <Monitor className="h-3 w-3" />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Check for Updates
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Privacy Policy
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
