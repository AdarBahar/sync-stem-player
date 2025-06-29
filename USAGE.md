# 🎛️ Usage Guide - Synchronized Stem Player

## Getting Started

### 1. Loading Audio Files

#### Drag & Drop
1. Open the Stem Player in your browser
2. Drag audio files from your computer onto the drop zone
3. Files will be automatically validated and loaded

#### File Selection
1. Click "Select Audio Files" button
2. Choose multiple audio files from your computer
3. Click "Open" to load them

#### Supported Formats
- **MP3** - Most common, good compression
- **WAV** - Uncompressed, highest quality  
- **FLAC** - Lossless compression
- **M4A** - Apple format, good quality
- **AAC** - Advanced audio compression
- **OGG** - Open source format

### 2. Player Interface

#### Master Controls
- **Play/Pause Button** (▶️/⏸️): Start or pause all stems
- **Stop Button** (⏹️): Stop playback and return to beginning
- **Progress Bar**: Shows current position, click to seek
- **Time Display**: Current time / Total duration
- **Master Volume**: Controls overall output level

#### Individual Stem Controls
Each loaded stem has its own control panel:
- **Volume Slider**: Adjust individual stem level (0-100%)
- **Mute Button**: Silence this stem while others play
- **Solo Button**: Play only this stem, mute all others
- **Progress Indicator**: Visual playback position for this stem

## Basic Operations

### Playing Audio
1. Load your stem files
2. Click the **Play** button (▶️) or press **Spacebar**
3. All stems will play in perfect synchronization
4. Use **Pause** (⏸️) to temporarily stop, **Stop** (⏹️) to reset

### Volume Control
- **Master Volume**: Affects all stems equally
- **Individual Volume**: Adjust each stem independently
- **Quick Presets**: Press number keys 1-9 for 10%-90% volume

### Mixing Stems
- **Mute**: Click mute button or press **M** (with stem focused)
- **Solo**: Click solo button or press **S** (with stem focused)
- **Balance**: Adjust individual volumes to create your perfect mix

### Navigation
- **Seeking**: Click anywhere on the progress bar to jump to that position
- **Keyboard**: Use ← → arrow keys to seek backward/forward 5 seconds

## Advanced Features

### Keyboard Shortcuts

#### Playback Control
- **Spacebar**: Play/Pause toggle
- **R**: Stop and reset to beginning
- **← →**: Seek backward/forward 5 seconds

#### Volume Control
- **1-9**: Set master volume to 10%-90%
- **+ -**: Increase/decrease master volume by 5%

#### Stem Control (requires focused stem)
- **M**: Toggle mute on focused stem
- **S**: Toggle solo on focused stem

#### Interface Control
- **F**: Toggle fullscreen mode
- **T**: Toggle light/dark theme
- **H**: Show/hide keyboard shortcuts help
- **C**: Switch to compact view
- **E**: Switch to expanded view
- **Esc**: Close modals or cancel actions

### View Modes

#### Expanded View (Default)
- Full-size controls for each stem
- Maximum visibility and control
- Best for detailed mixing work

#### Compact View
- Smaller, condensed controls
- More stems visible at once
- Good for overview and quick adjustments

### Theme Options
- **Dark Theme**: Default, easy on the eyes
- **Light Theme**: High contrast, good for bright environments
- Toggle with theme button (🌙/☀️) or press **T**

## Workflow Examples

### Basic Listening Session
1. Load your stem files
2. Press **Spacebar** to play
3. Adjust master volume as needed
4. Use progress bar to navigate through the song

### Creating a Custom Mix
1. Load all stems
2. Start playback
3. Adjust individual stem volumes
4. Use mute/solo to isolate specific elements
5. Find your perfect balance

### Learning Individual Parts
1. Load stems for a song you want to learn
2. Solo the instrument you want to focus on
3. Use the progress bar to repeat difficult sections
4. Gradually add other stems back in

### A/B Comparison
1. Load different versions of the same song
2. Use solo to switch between versions
3. Compare arrangements, mixes, or performances

## Tips and Best Practices

### File Organization
- **Naming**: Use clear, descriptive names (e.g., "Song_Vocals.mp3")
- **Grouping**: Load related stems together
- **Quality**: Use high-quality source files for best results

### Performance Tips
- **File Size**: Larger files take longer to load
- **Browser**: Use modern browsers for best performance
- **Memory**: Close other tabs if experiencing issues
- **Audio**: Use headphones or good speakers for accurate monitoring

### Mixing Guidelines
- **Start Low**: Begin with all volumes low, then bring up
- **Reference**: Compare to original mixes
- **Take Breaks**: Rest your ears periodically
- **Save Settings**: Browser remembers your preferences

## Troubleshooting

### Common Issues

#### Files Won't Load
- **Check Format**: Ensure files are supported audio formats
- **File Size**: Very large files may take time to load
- **Browser**: Try refreshing the page
- **Permissions**: Check if browser blocks file access

#### Audio Not Playing
- **Browser Policy**: Click play button to enable audio
- **Volume**: Check master and individual volumes
- **Mute**: Ensure stems aren't muted
- **Solo**: Check if only one stem is soloed

#### Sync Issues
- **Auto-Sync**: Enable auto-sync in player options
- **File Quality**: Use files with consistent sample rates
- **Browser**: Refresh if sync problems persist

#### Performance Problems
- **Close Tabs**: Free up browser memory
- **File Size**: Use smaller/compressed files
- **Hardware**: Ensure adequate system resources

### Browser Compatibility
- ✅ **Chrome 60+**: Full support, recommended
- ✅ **Firefox 55+**: Full support
- ✅ **Safari 11+**: Full support
- ✅ **Edge 79+**: Full support
- ❌ **Internet Explorer**: Not supported

### Mobile Usage
- **Touch Controls**: All buttons work with touch
- **Gestures**: Swipe on progress bar to seek
- **Orientation**: Works in both portrait and landscape
- **Performance**: May be slower on older devices

## Privacy and Security

### Data Handling
- **Local Only**: All audio files stay in your browser
- **No Upload**: Files are never sent to any server
- **No Tracking**: No analytics or data collection
- **Offline**: Works without internet connection

### File Security
- **Temporary**: Files are only loaded temporarily
- **No Storage**: Files aren't permanently stored
- **Memory Only**: Audio data exists only in browser memory
- **Clean Exit**: Data cleared when page is closed

## Integration and API

### External Control
The player exposes a JavaScript API for external control:

```javascript
// Basic playback control
StemPlayerAPI.play();
StemPlayerAPI.pause();
StemPlayerAPI.stop();

// Volume control
StemPlayerAPI.setMasterVolume(0.8);
StemPlayerAPI.setStemVolume('stem_id', 0.5);

// State information
const isPlaying = StemPlayerAPI.isPlaying();
const currentTime = StemPlayerAPI.getCurrentTime();
const stems = StemPlayerAPI.getLoadedStems();
```

### Events
Listen for player events:

```javascript
StemPlayerAPI.addEventListener('timeupdate', (e) => {
    console.log('Current time:', e.detail.currentTime);
});

StemPlayerAPI.addEventListener('playstate', (e) => {
    console.log('Playing:', e.detail.isPlaying);
});
```

## Support and Resources

### Getting Help
- **Documentation**: Check this guide and README.md
- **Console**: Open browser developer tools for error messages
- **Issues**: Report bugs on the project repository
- **Community**: Join discussions for tips and tricks

### Learning Resources
- **Audio Engineering**: Learn mixing fundamentals
- **Web Audio**: Understand browser audio capabilities
- **Music Theory**: Enhance your listening and mixing skills
- **Production**: Study professional mixing techniques

### Contributing
- **Feedback**: Share your experience and suggestions
- **Bug Reports**: Help improve the player
- **Feature Requests**: Suggest new capabilities
- **Code**: Contribute to the open source project
