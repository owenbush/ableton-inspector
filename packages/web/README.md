# Ableton Inspector - Web App

A modern, privacy-first web application for extracting information from Ableton Live Set files.

## 🌐 Live Demo

Visit [https://ableton-inspector.online](https://ableton-inspector.online)

## ✨ Features

- **100% Browser-Based** - All processing happens in your browser
- **Maximum Privacy** - Your files never leave your device
- **No Server Required** - Hosted on GitHub Pages
- **Modern UI** - Built with React, Tailwind CSS, and Framer Motion
- **Instant Results** - Extract tempo, scale, and samples in milliseconds

## 🔒 Privacy

This web application prioritizes your privacy:

- Files are processed entirely in your browser using WebAssembly
- No data is sent to any server
- No files are stored or logged
- No tracking or analytics
- 100% open source

## 🛠️ Development

### Prerequisites

- Node.js >= 20
- npm

### Local Development

```bash
# From the monorepo root
npm install

# Build the core library
npm run build --workspace=@owenbush/ableton-inspector-core

# Start the web dev server
npm run dev --workspace=@owenbush/ableton-inspector-web
```

Visit http://localhost:5173

### Build for Production

```bash
npm run build --workspace=@owenbush/ableton-inspector-web
```

The built files will be in `dist/` directory.

## 🚀 Deployment

This app is automatically deployed to GitHub Pages when a new release is published.

### Release Deployment

1. Create a new release on GitHub
2. GitHub Actions automatically:
   - Builds the core library
   - Builds the web application
   - Deploys to GitHub Pages
3. Site goes live at: https://ableton-inspector.online

### Development Builds

- Development changes are built and tested on every push
- Build artifacts are uploaded for testing
- No automatic deployment (keeps production stable)

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **react-dropzone** - File upload
- **lucide-react** - Icons
- **pako** - Gzip decompression (browser-compatible)
- **@owenbush/ableton-inspector-core** - Core extraction logic

## 🔗 Related

- [CLI Tool](../cli/) - Command-line interface
- [Core Library](../core/) - Shared extraction logic

## 📄 License

MIT © Owen Bush
