// Content script: Monitors user input and detects questions
// This runs on every page as specified in manifest.json

// === CONFIGURATION ===
const QUESTION_WORDS = ['who', 'what', 'where', 'when', 'why', 'how'];
let contentSettings: {
  enabled: boolean;
  questionTypes: { [key: string]: boolean };
  timerDelay: number;
} = {
  enabled: true,
  questionTypes: {
    who: true, what: true, where: true, when: true, why: true, how: true
  },
  timerDelay: 1000, // ms
};

// === LOAD SETTINGS FROM CHROME STORAGE ===
chrome.storage.sync.get(['morphSettings'], (result) => {
  if (result.morphSettings) contentSettings = { ...contentSettings, ...result.morphSettings };
});

// === TRACK INPUTS ===
function monitorInputs() {
  // Listen to all input, textarea, and contenteditable fields
  const selector = 'input[type="text"], textarea, [contenteditable="true"]';
  document.querySelectorAll(selector).forEach((el) => setupListeners(el as HTMLElement));

  // Listen for new elements added to the DOM
  const observer = new MutationObserver(() => {
    document.querySelectorAll(selector).forEach((el) => setupListeners(el as HTMLElement));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

const timers = new WeakMap<HTMLElement, number>();

function setupListeners(el: HTMLElement) {
  if ((el as any)._morphListenerAttached) return;
  (el as any)._morphListenerAttached = true;
  el.addEventListener('input', (e: Event) => handleInput(e, el));
}

function handleInput(_e: Event, el: HTMLElement) {
  if (!contentSettings.enabled) return;
  clearTimeout(timers.get(el));
  timers.set(el, window.setTimeout(() => {
    const text = (el as HTMLInputElement).value || el.textContent || '';
    if (isQuestion(text)) {
      // Send message to background
      chrome.runtime.sendMessage({ type: 'QUESTION_DETECTED', text });
      // TODO: Show popup or highlight input
    }
  }, contentSettings.timerDelay));
}

function isQuestion(text: string) {
  if (!text) return false;
  const firstWord = text.trim().split(' ')[0].toLowerCase();
  return QUESTION_WORDS.includes(firstWord) && !!contentSettings.questionTypes[firstWord];
}

// === START ===
monitorInputs();
// TODO: Add more robust error handling, popup display, and AI integration. 