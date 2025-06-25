import React, { useState, useEffect } from 'react'
import ToggleSwitch from './ToggleSwitch'

// BEGINNER NOTE: This is the main popup UI for your extension.
// You can edit this file to add more features and UI!
// This popup lets you configure Morph's behavior and settings.

interface Settings {
  enabled: boolean
  questionTypes: {
    who: boolean
    what: boolean
    where: boolean
    when: boolean
    why: boolean
    how: boolean
  }
  openaiApiKey: string
  autoReplace: boolean
  showPopup: boolean
  timerDelay?: number // ms
}

const App: React.FC = () => {
  // === STATE ===
  const [settings, setSettings] = useState<Settings>({
    enabled: true,
    questionTypes: {
      who: true,
      what: true,
      where: true,
      when: true,
      why: true,
      how: true
    },
    openaiApiKey: '',
    autoReplace: false,
    showPopup: true,
    timerDelay: 1000
  })

  // === LOAD SETTINGS FROM CHROME STORAGE ===
  useEffect(() => {
    chrome.storage.sync.get(['morphSettings'], (result) => {
      if (result.morphSettings) {
        setSettings(result.morphSettings)
      }
    })
  }, [])

  // === SAVE SETTINGS TO CHROME STORAGE ===
  const saveSettings = async (newSettings: Settings) => {
    try {
      await chrome.storage.sync.set({ morphSettings: newSettings })
    } catch {
      // Handle error
    }
  }

  // === HANDLERS ===
  const handleToggleQuestionType = (type: keyof Settings['questionTypes']) => {
    const newSettings = {
      ...settings,
      questionTypes: {
        ...settings.questionTypes,
        [type]: !settings.questionTypes[type]
      }
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleToggleSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleApiKeyChange = (apiKey: string) => {
    const newSettings = { ...settings, openaiApiKey: apiKey }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleTimerDelayChange = (delay: number) => {
    const newSettings = { ...settings, timerDelay: delay }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  // === UI ===
  return (
    <div className="w-96 min-h-[320px] min-w-[320px] p-4 bg-white border-4 border-blue-500 rounded-lg flex flex-col items-center justify-start" style={{ boxSizing: 'border-box' }}>
      {/* OBVIOUS HEADER FOR BEGINNERS */}
      <div className="w-full text-center mb-4">
        <h1 className="text-2xl font-extrabold text-blue-700">Morph Extension Loaded!</h1>
        <p className="text-base text-gray-700 font-semibold mt-2">You can now start developing your Chrome extension popup UI here.</p>
        <p className="text-xs text-gray-400 mt-1">(Edit <code>src/components/App.tsx</code> to change this screen.)</p>
      </div>
      {/* === SETTINGS UI === */}
      <div className="space-y-6 w-full">
        {/* Enable/Disable Toggle */}
        <ToggleSwitch
          id="enabled"
          label="Enable Morph"
          checked={settings.enabled}
          onChange={(checked) => handleToggleSetting('enabled', checked)}
          description="Turn Morph on/off globally"
        />
        {/* Question Type Toggles */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Question Types</h3>
          <div className="space-y-1">
            {Object.entries(settings.questionTypes).map(([type, enabled]) => (
              <ToggleSwitch
                key={type}
                id={`question-${type}`}
                label={`"${type}" questions`}
                checked={enabled}
                onChange={() => handleToggleQuestionType(type as keyof Settings['questionTypes'])}
                description={`Detect questions starting with "${type}"`}
              />
            ))}
          </div>
        </div>
        {/* Timer Setting */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Timer Delay (ms)</h3>
          <input
            type="number"
            min={100}
            max={10000}
            step={100}
            value={settings.timerDelay}
            onChange={e => handleTimerDelayChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">How long to wait after typing before checking for a question.</p>
        </div>
        {/* API Key Input */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">OpenAI API Key</h3>
          <input
            type="password"
            value={settings.openaiApiKey}
            onChange={e => handleApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">Your API key is stored locally and never shared.</p>
        </div>
        {/* Behavior Toggles */}
        <ToggleSwitch
          id="autoReplace"
          label="Auto-replace text"
          checked={settings.autoReplace}
          onChange={(checked) => handleToggleSetting('autoReplace', checked)}
          description="Automatically replace the question with the answer"
        />
        <ToggleSwitch
          id="showPopup"
          label="Show suggestion popup"
          checked={settings.showPopup}
          onChange={(checked) => handleToggleSetting('showPopup', checked)}
          description="Show a popup with AI suggestions"
        />
      </div>
      {/* === EXPLANATION FOR BEGINNERS === */}
      <div className="mt-4 text-xs text-gray-500 w-full">
        <b>How this works:</b><br />
        - The popup lets you configure Morph's settings.<br />
        - The content script tracks your typing and detects questions.<br />
        - The background script handles extension-wide logic.<br />
        - All settings are saved in Chrome storage and shared between scripts.<br />
        <span className="text-blue-600">// TODO: Add more features and connect to OpenAI!</span>
      </div>
    </div>
  )
}

export default App 