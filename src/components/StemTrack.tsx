import { memo } from 'react';
import { Volume2, VolumeX, Mic, Music, Drum, Guitar, Piano, Headphones } from 'lucide-react';
import { Stem } from '../hooks/useAudioStemsCreator';

interface StemTrackProps {
  stem: Stem;
  /** ID of the currently soloed stem, or null if none */
  soloedStemId: string | null;
  onVolumeChange: (stemId: string, volume: number) => void;
  onMute: (stemId: string) => void;
  onSolo: (stemId: string) => void;
}

const StemTrack = memo(({ stem, soloedStemId, onVolumeChange, onMute, onSolo }: StemTrackProps) => {
  // Determine if this stem is effectively muted (either by user or by another stem being soloed)
  const isEffectivelyMuted = stem.muted || (soloedStemId !== null && soloedStemId !== stem.id);

  // Compute the displayed/effective volume (for the slider visual)
  // Per the logic: slider always shows baseVolume, but we could dim it when muted
  const displayVolume = stem.volume;
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'bass':
        return <Guitar className="w-5 h-5" />;
      case 'drums':
        return <Drum className="w-5 h-5" />;
      case 'vocals':
        return <Mic className="w-5 h-5" />;
      case 'piano':
        return <Piano className="w-5 h-5" />;
      default:
        return <Music className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          icon: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
          accent: 'text-emerald-400',
          button: 'bg-emerald-600 hover:bg-emerald-500',
          track: 'border-l-emerald-400'
        };
      case 'blue':
        return {
          icon: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
          accent: 'text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-500',
          track: 'border-l-blue-400'
        };
      case 'orange':
        return {
          icon: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
          accent: 'text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-500',
          track: 'border-l-orange-400'
        };
      case 'purple':
        return {
          icon: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
          accent: 'text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-500',
          track: 'border-l-purple-400'
        };
      case 'pink':
        return {
          icon: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
          accent: 'text-pink-400',
          button: 'bg-pink-600 hover:bg-pink-500',
          track: 'border-l-pink-400'
        };
      case 'amber':
        return {
          icon: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          accent: 'text-amber-400',
          button: 'bg-amber-600 hover:bg-amber-500',
          track: 'border-l-amber-400'
        };
      default:
        return {
          icon: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
          accent: 'text-slate-400',
          button: 'bg-slate-600 hover:bg-slate-500',
          track: 'border-l-slate-400'
        };
    }
  };

  const colorClasses = getColorClasses(stem.color);

  // Stem track - adjust /30 for transparency
  return (
    <div className={`bg-slate-900/30 backdrop-blur-xl rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all duration-300 border-l-4 ${colorClasses.track} group`}>
      <div className="flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses.icon} group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}>
            {getIcon(stem.icon)}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm mb-0.5 truncate">{stem.name}</h3>
            <span className={`text-xs font-medium capitalize ${colorClasses.accent}`}>
              {stem.instrument}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className={`flex items-center gap-2 flex-shrink-0 ${isEffectivelyMuted ? 'opacity-50' : ''}`}>
          <span className="text-slate-400 font-medium text-xs">Volume</span>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={displayVolume}
              onChange={(e) => onVolumeChange(stem.id, parseInt(e.target.value))}
              className="w-20 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer volume-slider"
            />
            <span className={`font-semibold text-xs w-8 text-right ${colorClasses.accent}`}>
              {displayVolume}%
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onMute(stem.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
              isEffectivelyMuted
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isEffectivelyMuted ? (
              <div className="flex items-center gap-1">
                <VolumeX className="w-3 h-3" />
                <span>Muted</span>
              </div>
            ) : (
              'Mute'
            )}
          </button>
          
          <button
            onClick={() => onSolo(stem.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
              stem.solo 
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {stem.solo ? (
              <div className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                <span>Solo</span>
              </div>
            ) : (
              'Solo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

StemTrack.displayName = 'StemTrack';

export default StemTrack;