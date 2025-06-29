# 🎛️ Synchronized Stem Player

A standalone web-based audio player for synchronized playback of multiple audio stems (vocals, drums, bass, other instruments). Perfect for musicians, producers, and audio engineers who need precise control over individual audio tracks.

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

### Option 1: Simple Web Server
```bash
cd stem-player
python -m http.server 8080
# Open http://localhost:8080
```

### Option 2: Node.js Development Server
```bash
cd stem-player
npm install
npm start
# Open http://localhost:3000
```

### Option 3: Docker
```bash
cd stem-player
docker-compose up
# Open http://localhost:8080
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

## 🔒 Privacy

- **Local Processing**: All audio stays in your browser
- **No Upload**: Files never leave your device
- **No Tracking**: No analytics or data collection
- **Offline Capable**: Works without internet connection

## 🛠️ Development

Built with modern web technologies:
- **HTML5 Audio**: Native browser audio support
- **Web Audio API**: Advanced audio processing
- **JavaScript ES6+**: Modern language features
- **CSS Grid/Flexbox**: Responsive layouts
- **Progressive Web App**: Installable on devices

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
