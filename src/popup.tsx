// Entry point for the popup UI
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'

function DevDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Morph Chrome Extension (DEV)</h1>
        <p className="mb-4 text-gray-600">This is a live preview of your popup UI, running in development mode.<br/>Any changes you make to your React components will show up here instantly.</p>
        <div className="border-t border-b py-4 mb-4">
          <App />
        </div>
        <div className="text-xs text-gray-400 mt-2">Edit <code>src/components/App.tsx</code> to change your popup UI.<br/>This page is only visible in <b>npm run dev</b> mode.</div>
      </div>
    </div>
  )
}

function renderApp() {
  const rootDiv = document.getElementById('root');
  if (!rootDiv) return;
  const root = createRoot(rootDiv);
  if (window.location.hostname === 'localhost') {
    root.render(<DevDashboard />);
  } else {
    root.render(<App />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// This is the extension popup UI. All state is internal for now.

// TODO: Add logic for initializing settings, etc. 