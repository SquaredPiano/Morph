// Entry point for the popup UI
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'

// Render the App component into the root div
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
// This is the extension popup UI. All state is internal for now.

// TODO: Add logic for initializing settings, etc. 