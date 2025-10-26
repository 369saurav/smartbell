# SmartBell Chrome Extension

A smart Chrome extension built with Manifest V3 that enhances your browsing experience with intelligent features and productivity tools.

## Features

- 🔔 **Smart Page Enhancement**: Automatically improves readability and user experience
- ⚡ **Intelligent Form Handling**: Enhanced form interactions with smart validation
- 🎯 **Visual Indicators**: Smart indicators for important page elements
- ⌨️ **Keyboard Shortcuts**: Quick access to features via keyboard shortcuts
- 📊 **Usage Statistics**: Track your productivity improvements
- 🔧 **Customizable Settings**: Personalize your experience

## Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartbell-chrome-extension.git
   cd smartbell-chrome-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the project folder
   - The SmartBell extension should now appear in your extensions

### Production Installation

1. Download the latest release from the [Releases page](https://github.com/yourusername/smartbell-chrome-extension/releases)
2. Extract the ZIP file
3. Follow the development setup steps 3-4 above

## Usage

### Basic Usage

1. **Enable Smart Features**: Click the SmartBell icon in your browser toolbar
2. **Toggle Features**: Use the toggle button in the popup or right-click context menu
3. **Keyboard Shortcuts**: Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac) to toggle features

### Advanced Features

- **Auto Mode**: Automatically enhance pages as you browse
- **Notifications**: Get notified when features are enabled/disabled
- **Statistics**: View how many pages have been enhanced

## Development

### Project Structure

```
smartbell/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for page enhancement
├── content.css            # Content script styles
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── package.json           # Project dependencies
```

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Start development mode
- `npm run package` - Package the extension for distribution
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run tests

### Key Features Implementation

#### Manifest V3 Compliance
- Uses service workers instead of background pages
- Implements proper permission handling
- Follows Chrome's security best practices

#### Content Script Features
- Smart page enhancement
- Form interaction improvements
- Visual indicators for important elements
- Keyboard shortcut support

#### Background Service Worker
- Context menu integration
- Notification handling
- Statistics tracking
- Tab update monitoring

## API Reference

### Content Script API

The content script provides the following functionality:

```javascript
// Toggle smart features
chrome.runtime.sendMessage({
    action: 'toggleFeature',
    enabled: true
});

// Enhance current page
chrome.runtime.sendMessage({
    action: 'enhancePage'
});
```

### Background Service Worker API

```javascript
// Get extension statistics
chrome.runtime.sendMessage({
    action: 'getStats'
}, (response) => {
    console.log('Page count:', response.pageCount);
    console.log('Feature enabled:', response.featureEnabled);
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues page](https://github.com/yourusername/smartbell-chrome-extension/issues)
2. Create a new issue with detailed information
3. Contact the maintainers

## Changelog

### Version 1.0.0
- Initial release
- Manifest V3 compliance
- Smart page enhancement features
- Popup interface
- Content script integration
- Background service worker
- Keyboard shortcuts
- Statistics tracking

## Roadmap

- [ ] Advanced customization options
- [ ] Integration with popular websites
- [ ] AI-powered enhancements
- [ ] Cross-browser support
- [ ] Mobile companion app
AI Powered in-browser smart notification manager
