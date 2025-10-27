# SmartBell Chrome Extension

A modern Chrome extension built with React, TypeScript, Vite, and TailwindCSS using Manifest V3.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Manifest**: Manifest V3

## Getting Started

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the extension**
   ```bash
   npm run build
   ```

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder
   - The SmartBell extension should now appear

### Development

```bash
npm run dev
```

This will start the development server with hot reload.

## Project Structure

```
smartbell/
├── src/
│   ├── App.tsx          # Main React component
│   ├── main.tsx         # Entry point
│   └── index.css        # TailwindCSS styles
├── icons/               # Extension icons
├── index.html           # HTML entry point
├── manifest.json        # Chrome extension manifest
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── package.json         # Project dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
