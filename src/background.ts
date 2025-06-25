// Background script for Morph Chrome Extension
// Handles extension-wide logic, config, and messaging

// === CONFIGURATION ===
let bgSettings = {
  enabled: true,
  questionTypes: {
    who: true, what: true, where: true, when: true, why: true, how: true
  },
  timerDelay: 1000,
};

// === LOAD SETTINGS FROM CHROME STORAGE ===
chrome.storage.sync.get(['morphSettings'], (result) => {
  if (result.morphSettings) bgSettings = { ...bgSettings, ...result.morphSettings };
});

// === LISTEN FOR MESSAGES FROM CONTENT SCRIPT ===
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'QUESTION_DETECTED') {
    // TODO: Handle question detected (e.g., log, call OpenAI, notify popup, etc.)
    console.log('Question detected:', request.text);
    sendResponse({ received: true });
  }
  // TODO: Handle other message types (e.g., config updates)
});

// === HANDLE CONFIGURATION UPDATES ===
chrome.storage.onChanged.addListener((changes) => {
  if (changes.morphSettings) {
    bgSettings = { ...bgSettings, ...changes.morphSettings.newValue };
    // TODO: Notify content scripts or popup if needed
  }
});

// === HANDLE EXTENSION INSTALLATION ===
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    const defaultSettings = {
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
      showPopup: true
    }

    chrome.storage.sync.set({ morphSettings: defaultSettings }, () => {
      console.log('Morph: Default settings initialized')
    })

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    })
  }
})

// === HANDLE MESSAGES FROM CONTENT SCRIPT ===
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['morphSettings'], (result) => {
      sendResponse(result.morphSettings || {})
    })
    return true // Keep message channel open for async response
  }

  if (request.type === 'UPDATE_SETTINGS') {
    chrome.storage.sync.set({ morphSettings: request.settings }, () => {
      sendResponse({ success: true })
    })
    return true
  }

  if (request.type === 'TEST_API_KEY') {
    testOpenAIKey(request.apiKey).then((isValid) => {
      sendResponse({ isValid })
    })
    return true
  }
})

// === TEST OPENAI API KEY ===
async function testOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch (error) {
    console.error('Error testing OpenAI API key:', error)
    return false
  }
}

// === HANDLE EXTENSION ICON CLICK ===
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Toggle the extension on/off for the current tab
    chrome.storage.sync.get(['morphSettings'], (result) => {
      const settings = result.morphSettings || {}
      const newEnabled = !settings.enabled
      
      chrome.storage.sync.set({
        morphSettings: { ...settings, enabled: newEnabled }
      }, () => {
        // Update the icon to reflect the state
        updateIcon(newEnabled)
        
        // Notify content script of the change
        chrome.tabs.sendMessage(tab.id!, {
          type: 'SETTINGS_UPDATED',
          settings: { ...settings, enabled: newEnabled }
        }).catch(() => {
          // Content script might not be loaded yet, that's okay
        })
      })
    })
  }
})

// === UPDATE EXTENSION ICON BASED ON ENABLED STATE ===
function updateIcon(enabled: boolean) {
  const iconPath = enabled 
    ? { 16: 'icons/icon-16.png', 32: 'icons/icon-32.png', 48: 'icons/icon-48.png', 128: 'icons/icon-128.png' }
    : { 16: 'icons/icon-disabled-16.png', 32: 'icons/icon-disabled-32.png', 48: 'icons/icon-disabled-48.png', 128: 'icons/icon-disabled-128.png' }
  
  chrome.action.setIcon({ path: iconPath })
  
  const title = enabled ? 'Morph - AI Question Assistant (Enabled)' : 'Morph - AI Question Assistant (Disabled)'
  chrome.action.setTitle({ title })
}

// === INITIALIZE ICON STATE ===
chrome.storage.sync.get(['morphSettings'], (result) => {
  const settings = result.morphSettings || {}
  updateIcon(settings.enabled !== false) // Default to enabled if not set
})

// === LISTEN FOR SETTINGS CHANGES TO UPDATE ICON ===
chrome.storage.onChanged.addListener((changes) => {
  if (changes.morphSettings) {
    const newSettings = changes.morphSettings.newValue
    updateIcon(newSettings?.enabled !== false)
  }
})

// TODO: Add more background logic as needed (e.g., analytics, advanced settings sync, etc.)

// TODO: Add timer/alarms logic if you want background timers
// TODO: Add OpenAI API call logic if you want to keep API key out of content script 