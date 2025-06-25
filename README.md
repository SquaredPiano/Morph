# Morph - AI Question Assistant

A Chrome extension that automatically detects when you're about to ask a common question and uses AI to provide helpful answers before you hit send.

## Features

- 🤖 **AI-Powered Answers**: Uses OpenAI GPT-4o to generate intelligent responses
- 🔍 **Smart Detection**: Automatically detects questions starting with "who", "what", "where", "when", "why", or "how"
- ⚙️ **Customizable**: Toggle which question types to detect and how to respond
- 🎯 **Universal**: Works on any website with input fields, textareas, or contenteditable elements
- 🔒 **Privacy-First**: Your API key is stored locally and never shared

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome browser
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd morph-chrome-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder
   - The Morph extension should now appear in your extensions list

5. **Configure the extension**
   - Click the Morph icon in your browser toolbar
   - Enter your OpenAI API key (get one at [OpenAI Platform](https://platform.openai.com/api-keys))
   - Customize your settings as needed

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm run preview` - Preview the built extension

### Project Structure

```
src/
├── components/
│   ├── App.tsx          # Main settings UI
│   ├── Popup.tsx        # Suggestion popup component
│   └── ToggleSwitch.tsx # Reusable toggle component
├── content/
│   └── monitorInputs.ts # Content script for input monitoring
├── utils/
│   ├── openai.ts        # OpenAI API integration
│   └── popup.ts         # Popup management utilities
├── background.ts        # Extension background script
├── popup.tsx           # Popup entry point
├── popup.html          # Popup HTML template
└── index.css           # Tailwind CSS styles
```

### Key Components

#### Input Monitor (`src/content/monitorInputs.ts`)
- Monitors all input fields, textareas, and contenteditable elements
- Detects questions using configurable patterns
- Debounces input to avoid excessive API calls
- Manages popup display and text replacement

#### Settings UI (`src/components/App.tsx`)
- Toggle switches for different question types
- OpenAI API key configuration
- Behavior settings (auto-replace, show popup)
- Real-time settings validation

#### OpenAI Integration (`src/utils/openai.ts`)
- Handles API calls to OpenAI GPT-4o
- Configurable prompt engineering
- Error handling and validation

## Configuration

### Question Types
You can enable/disable detection for specific question types:
- **Who** - Person identification questions
- **What** - Object/action identification questions  
- **Where** - Location questions
- **When** - Time/date questions
- **Why** - Reason/cause questions
- **How** - Method/process questions

### Behavior Settings
- **Auto-replace**: Automatically replace questions with AI answers
- **Show popup**: Display suggestion popup for manual review
- **Enable/Disable**: Global on/off toggle

## Privacy & Security

- Your OpenAI API key is stored locally in Chrome's sync storage
- Questions are sent to OpenAI's servers to generate answers
- No data is logged or stored by the extension
- All communication with OpenAI is encrypted

## Troubleshooting

### Common Issues

1. **Extension not detecting questions**
   - Check that the extension is enabled
   - Verify your OpenAI API key is valid
   - Ensure the question type is enabled in settings

2. **API key errors**
   - Make sure your OpenAI API key is correct
   - Check that you have sufficient credits in your OpenAI account
   - Verify the key has the necessary permissions

3. **Popup not appearing**
   - Check that "Show suggestion popup" is enabled
   - Ensure the input field is not in an iframe
   - Try refreshing the page

### Debug Mode

To enable debug logging, open the browser console and run:
```javascript
localStorage.setItem('morph-debug', 'true')
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem

---

Made with ❤️ for better communication
