interface PopupCallbacks {
  onAccept: () => void
  onReject: () => void
  onModify: (modifiedAnswer: string) => void
}

export function createPopup(
  question: string,
  answer: string,
  position: { x: number; y: number },
  callbacks: PopupCallbacks
): HTMLElement {
  // Remove any existing popups
  removeAllPopups()

  const popup = document.createElement('div')
  popup.className = 'morph-popup'
  popup.style.cssText = `
    position: fixed;
    left: ${position.x}px;
    top: ${position.y}px;
    z-index: 10000;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

  let isExpanded = false
  let modifiedAnswer = answer

  const createContent = () => `
    <div style="margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">Morph AI Suggestion</h3>
        <button id="expand-btn" style="background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 16px;">+</button>
      </div>
    </div>

    <div style="margin-bottom: 12px;">
      <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Question detected:</p>
      <p style="margin: 0; font-size: 14px; color: #374151; font-style: italic;">"${question}"</p>
    </div>

    <div style="margin-bottom: 16px;">
      <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">Suggested answer:</p>
      <div id="answer-content">
        ${isExpanded ? `
          <textarea id="answer-textarea" style="width: 100%; padding: 8px; font-size: 14px; border: 1px solid #d1d5db; border-radius: 4px; resize: none; font-family: inherit;" rows="4" placeholder="Modify the answer...">${modifiedAnswer}</textarea>
        ` : `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1e293b;">${answer}</p>
          </div>
        `}
      </div>
    </div>

    <div style="display: flex; gap: 8px;">
      <button id="accept-btn" style="flex: 1; padding: 6px 12px; font-size: 14px; font-weight: 500; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer; transition: background-color 0.2s;">Use Answer</button>
      ${isExpanded ? `
        <button id="modify-btn" style="padding: 6px 12px; font-size: 14px; font-weight: 500; border-radius: 6px; border: none; background: #2563eb; color: white; cursor: pointer; transition: background-color 0.2s;">Apply Changes</button>
      ` : ''}
      <button id="reject-btn" style="padding: 6px 12px; font-size: 14px; font-weight: 500; border-radius: 6px; border: none; background: #f3f4f6; color: #374151; cursor: pointer; transition: background-color 0.2s;">Dismiss</button>
    </div>
  `

  popup.innerHTML = createContent()

  // Add event listeners
  const expandBtn = popup.querySelector('#expand-btn') as HTMLButtonElement

  expandBtn?.addEventListener('click', () => {
    isExpanded = !isExpanded
    expandBtn.textContent = isExpanded ? '−' : '+'
    
    if (isExpanded) {
      const textarea = popup.querySelector('#answer-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.value = modifiedAnswer
      }
    } else {
      const textarea = popup.querySelector('#answer-textarea') as HTMLTextAreaElement
      if (textarea) {
        modifiedAnswer = textarea.value
      }
    }
    
    popup.innerHTML = createContent()
    // Re-attach event listeners after content update
    attachEventListeners()
  })

  const attachEventListeners = () => {
    const newAcceptBtn = popup.querySelector('#accept-btn') as HTMLButtonElement
    const newRejectBtn = popup.querySelector('#reject-btn') as HTMLButtonElement
    const newModifyBtn = popup.querySelector('#modify-btn') as HTMLButtonElement

    newAcceptBtn?.addEventListener('click', callbacks.onAccept)
    newRejectBtn?.addEventListener('click', callbacks.onReject)
    newModifyBtn?.addEventListener('click', () => {
      const textarea = popup.querySelector('#answer-textarea') as HTMLTextAreaElement
      if (textarea) {
        callbacks.onModify(textarea.value)
      }
    })
  }

  attachEventListeners()

  // Add hover effects
  const buttons = popup.querySelectorAll('button')
  buttons.forEach(button => {
    if (button.id === 'accept-btn' || button.id === 'modify-btn') {
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#1d4ed8'
      })
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#2563eb'
      })
    } else if (button.id === 'reject-btn') {
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#e5e7eb'
      })
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#f3f4f6'
      })
    }
  })

  // Add to page
  document.body.appendChild(popup)

  // Auto-remove after 30 seconds
  setTimeout(() => {
    if (document.body.contains(popup)) {
      removePopup(popup)
    }
  }, 30000)

  return popup
}

export function removePopup(popup: HTMLElement): void {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup)
  }
}

export function removeAllPopups(): void {
  const existingPopups = document.querySelectorAll('.morph-popup')
  existingPopups.forEach(popup => {
    if (document.body.contains(popup)) {
      document.body.removeChild(popup)
    }
  })
} 