import React, { useState } from 'react'

interface PopupProps {
  question: string
  answer: string
  onAccept: () => void
  onReject: () => void
  onModify: (modifiedAnswer: string) => void
  position: { x: number; y: number }
}

const Popup: React.FC<PopupProps> = ({
  question,
  answer,
  onAccept,
  onReject,
  onModify,
  position
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [modifiedAnswer, setModifiedAnswer] = useState(answer)

  const handleAccept = () => {
    onAccept()
  }

  const handleReject = () => {
    onReject()
  }

  const handleModify = () => {
    onModify(modifiedAnswer)
  }

  return (
    <div
      className="morph-popup"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '400px'
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Morph AI Suggestion</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Question detected:</p>
        <p className="text-sm text-gray-800 italic">"{question}"</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Suggested answer:</p>
        {isExpanded ? (
          <textarea
            value={modifiedAnswer}
            onChange={(e) => setModifiedAnswer(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
            rows={4}
            placeholder="Modify the answer..."
          />
        ) : (
          <div className="morph-suggestion">
            <p className="text-sm text-gray-800">{answer}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="morph-button morph-button-primary flex-1"
        >
          Use Answer
        </button>
        {isExpanded && (
          <button
            onClick={handleModify}
            className="morph-button morph-button-primary"
          >
            Apply Changes
          </button>
        )}
        <button
          onClick={handleReject}
          className="morph-button morph-button-secondary"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

export default Popup 