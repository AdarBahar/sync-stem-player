# 🎛️ Synchronized Stem Player

A modern web-based audio player built with React and TypeScript for synchronized playback of multiple audio stems (vocals, drums, bass, other instruments). Perfect for musicians, producers, and audio engineers who need precise control over individual audio tracks.

## Demo
See a working demo on https://www.bahar.co.il/player/

## 🚀 New React Version

This project has been upgraded to use modern web technologies:
- **React 18** with TypeScript for robust component architecture
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Advanced Audio Engine** with Web Audio API integration
- **Professional UI** with smooth animations and intuitive controls

## ✨ Features

### 🎵 Synchronized Playback
- **Perfect Sync**: All stems play in perfect synchronization
- **Master Controls**: Play, pause, stop, and seek all tracks together
- **Individual Control**: Mute, solo, and adjust volume for each stem independently
- **Progress Tracking**: Visual progress bars for master timeline and individual stems

### 🎚️ Professional Mixing Interface
- **Master Volume**: Global volume control for all stems
- **Individual Volume Sliders**: Fine-tune each stem's level (0-100%)
- **Mute/Solo Functions**: Isolate or silence specific stems
- **Real-time Updates**: Instant response to all control changes

### 🎹 Keyboard Controls
- **Spacebar**: Play/Pause toggle
- **R**: Reset/Stop all playback
- **M**: Toggle mute on focused stem
- **S**: Toggle solo on focused stem
- **Arrow Keys**: Seek forward/backward (5-second increments)
- **Number Keys (1-9)**: Quick volume presets (10%-90%)

### 📱 Modern Web Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Drag & Drop**: Easy file uploading
- **Multiple Formats**: Supports MP3, WAV, FLAC, M4A, OGG
- **Real-time Feedback**: Visual indicators for all player states

### 🎨 Visual Features
- **Waveform Display**: Visual representation of audio tracks
- **Progress Indicators**: Multiple progress visualization options
- **Color-coded Stems**: Easy identification of different tracks
- **Fullscreen Mode**: Immersive playback experience

## 🚀 Quick Start

### Prerequisites
- Modern web browser with Web Audio API support
- Node.js 18+ (for development)
- npm 8+ or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AdarBahar/sync-stem-player.git
   cd sync-stem-player
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build optimized production version
npm run build

# Preview production build locally
npm run preview

# Deploy to MAMP (if using MAMP)
npm run build:mamp
```

### Alternative Deployment Options

#### Option 1: Static Web Server
```bash
# After building
npm run build
# Serve the 'dist' folder with any static web server
```

#### Option 2: Docker
```bash
# Production build
docker-compose up

# Development with hot reload
docker-compose --profile development up dev-server
```

#### Option 3: MAMP Integration
```bash
# Build and copy to MAMP directory
npm run build:mamp
# Access at http://localhost:8888/sync-stem-player-ui/
```

## 📁 Supported File Formats

- **MP3** - Most common, good compression
- **WAV** - Uncompressed, highest quality
- **FLAC** - Lossless compression
- **M4A** - Apple format, good quality
- **OGG** - Open source format

## 🎯 Use Cases

### 🎤 Musicians & Singers
- Practice with backing tracks
- Learn individual instrument parts
- Create custom karaoke versions
- Study song arrangements

### 🎧 Audio Engineers & Producers
- Mix and balance stems
- A/B compare different versions
- Quality control and mastering
- Client presentations

### 🎓 Music Education
- Teach individual instrument parts
- Demonstrate mixing techniques
- Analyze song structures
- Interactive music lessons

### 🎪 Live Performance
- DJ sets with stem control
- Live remixing and mashups
- Backing track management
- Performance rehearsals

## 🔧 Technical Features

- **Web Audio API**: High-quality audio processing
- **No Server Required**: Runs entirely in the browser
- **Local Storage**: Saves player preferences
- **Progressive Loading**: Efficient audio file handling
- **Cross-browser**: Works in all modern browsers

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎛️ Player Interface

### Master Controls
- **Play/Pause Button**: Start/stop all stems
- **Stop Button**: Reset playback to beginning
- **Master Volume**: Control overall output level
- **Progress Bar**: Seek to any position (clickable)
- **Time Display**: Current time / Total duration

### Individual Stem Controls
- **Volume Slider**: 0-100% level control
- **Mute Button**: Silence individual stems
- **Solo Button**: Isolate single stems
- **Progress Indicator**: Visual playback position
- **Stem Name**: Customizable track labels

### Advanced Features
- **Fullscreen Mode**: Immersive player experience
- **Keyboard Shortcuts**: Professional workflow
- **Visual Feedback**: Real-time status indicators
- **Responsive Layout**: Adapts to screen size

## 🔄 Workflow

1. **Upload Stems**: Drag & drop or select audio files
2. **Organize**: Rename and arrange stems as needed
3. **Play**: Use synchronized playback controls
4. **Mix**: Adjust individual volumes and mute/solo
5. **Export**: Save mix settings for later use

## 🎨 Customization

- **Themes**: Light and dark mode options
- **Layout**: Compact and expanded views
- **Colors**: Customizable stem color coding
- **Shortcuts**: Configurable keyboard controls

## 📊 Performance

- **Low Latency**: Minimal audio delay
- **Efficient Memory**: Optimized for large files
- **Smooth Playback**: No audio dropouts
- **Fast Loading**: Progressive audio streaming

## 🔒 Security & Privacy

### Privacy First
- **Local Processing**: All audio stays in your browser
- **No Upload**: Files never leave your device
- **No Tracking**: No analytics or data collection
- **Offline Capable**: Works without internet connection

### Security Features
- **Input Sanitization**: All user inputs are validated and sanitized
- **XSS Prevention**: Protected against cross-site scripting
- **Content Security Policy**: Strict CSP headers implemented
- **File Validation**: MIME type and extension validation
- **No External Dependencies**: No CDN or external API calls
- **Memory Management**: Automatic cleanup of audio resources

### Security Headers (Production)
When deploying, ensure these headers are set by your web server:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

See [SECURITY.md](SECURITY.md) for detailed security information.

## 🛠️ Development

### Technology Stack
- **React 18**: Modern component-based UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Web Audio API**: Advanced audio processing
- **HTML5 Audio**: Native browser audio support
- **ESLint**: Code quality and consistency
- **PostCSS**: Advanced CSS processing

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run clean        # Clean build artifacts
```

## 📄 License

Open source - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

## 📞 Support

- 📖 Documentation: See `/docs` folder
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Contact: [Your contact info]

---

**🎵 Ready to mix your stems like a pro?**
