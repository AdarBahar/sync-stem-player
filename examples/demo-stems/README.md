# 🎵 Demo Stems

This folder contains example audio stems for testing the Synchronized Stem Player.

## What are Stems?

Audio stems are individual tracks or groups of instruments from a song that have been separated or isolated. Common stem types include:

- **Vocals** - Lead and backing vocals
- **Drums** - Kick, snare, hi-hats, cymbals
- **Bass** - Bass guitar, synth bass
- **Other** - Guitars, keyboards, strings, etc.

## Demo Files

### Option 1: Use Your Own Files
The best way to test the stem player is with your own audio files:

1. **From Music Production**: If you produce music, export individual tracks
2. **From DAW Projects**: Export stems from Logic Pro, Ableton, Pro Tools, etc.
3. **AI Separation**: Use tools like Spleeter, LALAL.AI, or similar to separate existing songs

### Option 2: Create Test Files
For testing purposes, you can create simple test files:

1. **Record Simple Tracks**: Record yourself humming, tapping, etc.
2. **Use Free Samples**: Download royalty-free samples online
3. **Generate Tones**: Use audio software to create simple sine waves or beats

### Option 3: Download Free Stems
Several websites offer free stem downloads:

- **Splice**: Free stems with account
- **Looperman**: Community-uploaded stems
- **Freesound**: Creative Commons audio
- **LANDR**: Some free stem packs
- **BandLab**: Community stems

## File Naming Conventions

For best results, name your files clearly:

```
SongName_Vocals.mp3
SongName_Drums.wav
SongName_Bass.flac
SongName_Other.m4a
```

Or:

```
Track01_Lead_Vocal.mp3
Track01_Backing_Vocals.mp3
Track01_Kick_Drum.wav
Track01_Snare_Drum.wav
Track01_Bass_Guitar.flac
Track01_Electric_Guitar.mp3
Track01_Piano.m4a
```

## Technical Requirements

### File Formats
- **MP3**: Most compatible, good compression
- **WAV**: Uncompressed, best quality
- **FLAC**: Lossless compression
- **M4A**: Good quality, smaller size
- **AAC**: Efficient compression
- **OGG**: Open source format

### Recommendations
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Depth**: 16-bit minimum, 24-bit preferred
- **Length**: All stems should be the same duration
- **Sync**: Stems should start at the same time point

## Creating Your Own Stems

### From DAW (Digital Audio Workstation)
1. **Solo Each Track**: Mute all but one track
2. **Export Audio**: Render/bounce to audio file
3. **Repeat**: Do this for each track/group
4. **Name Clearly**: Use descriptive filenames

### Using AI Separation Tools

#### Spleeter (Free)
```bash
pip install spleeter
spleeter separate -p spleeter:4stems-16kHz audio.mp3
```

#### LALAL.AI (Web-based)
1. Upload your audio file
2. Choose separation type (vocals, drums, etc.)
3. Download the separated stems

#### Audacity (Free)
1. Import stereo track
2. Use vocal isolation effects
3. Export individual channels

## Testing the Player

### Basic Test
1. Load 2-4 stem files
2. Press play to ensure sync
3. Test individual volume controls
4. Try mute/solo functions

### Advanced Test
1. Load complex multi-stem project
2. Test seeking/scrubbing
3. Verify sync across all stems
4. Test keyboard shortcuts

### Performance Test
1. Load large files (>10MB each)
2. Test with many stems (8+)
3. Check browser performance
4. Test on mobile devices

## Troubleshooting

### Sync Issues
- **Check Sample Rates**: All files should match
- **Verify Start Times**: Stems should begin simultaneously
- **File Quality**: Use high-quality source material

### Loading Problems
- **File Size**: Very large files may timeout
- **Format Support**: Ensure browser supports the format
- **Corruption**: Try re-exporting the files

### Performance Issues
- **File Compression**: Use compressed formats for large files
- **Browser Memory**: Close other tabs/applications
- **Hardware**: Ensure adequate system resources

## Legal Considerations

### Copyright
- **Own Content**: Use only music you own or have rights to
- **Fair Use**: Educational/personal use may be permitted
- **Commercial Use**: Requires proper licensing
- **Attribution**: Credit original artists when required

### Sharing
- **Personal Use**: Keep stems for personal use only
- **Public Sharing**: Ensure you have distribution rights
- **Collaboration**: Share only with authorized collaborators

## Resources

### Free Audio Sources
- **Freesound.org**: Creative Commons audio
- **Zapsplat**: Free with account
- **BBC Sound Effects**: Public domain
- **YouTube Audio Library**: Royalty-free music

### Stem Creation Tools
- **Audacity**: Free, open-source
- **GarageBand**: Free on Mac
- **Reaper**: Affordable DAW
- **Logic Pro**: Professional Mac DAW
- **Ableton Live**: Popular for electronic music

### AI Separation Services
- **LALAL.AI**: Web-based, high quality
- **Spleeter**: Open source, command line
- **iZotope RX**: Professional audio repair
- **Steinberg SpectraLayers**: Advanced spectral editing

## Contributing Demo Content

If you have high-quality stems you'd like to share:

1. **Ensure Rights**: Verify you can legally share
2. **Quality Check**: Test files in the player
3. **Documentation**: Include track information
4. **Submit**: Create pull request or issue

## Support

For help with demo stems or the player:

1. **Check Documentation**: Read USAGE.md and README.md
2. **Browser Console**: Check for error messages
3. **File Validation**: Ensure files meet requirements
4. **Community**: Ask questions in project discussions

---

**Note**: This folder is for demonstration purposes. Add your own audio files here to test the Synchronized Stem Player.
