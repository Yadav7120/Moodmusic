import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Info, X, MessageSquareText, Settings2, Sparkles } from 'lucide-react';
import { Song, Emotion, AudioQuality } from '../types';
import { EMOTION_COLORS } from '../constants';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isFavorited: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (id: string) => void;
  emotion: Emotion;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  isFavorited,
  onPlayPause, 
  onNext, 
  onPrev,
  onToggleFavorite,
  emotion
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'art' | 'details' | 'lyrics'>('art');
  const [quality, setQuality] = useState<AudioQuality>('High');
  const [showSettings, setShowSettings] = useState(false);

  // Critical Sync: Reset audio when song identity changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      // Force reload the source
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.oncanplay = () => {
          audioRef.current?.play().catch(err => console.log("Playback interrupted/blocked:", err));
          if (audioRef.current) audioRef.current.oncanplay = null;
        };
      }
    }
  }, [currentSong?.id]); // Strictly bound to ID to prevent mismatches

  // Separate play/pause control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) return null;

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl w-full max-w-md mx-auto relative overflow-hidden group transition-all duration-1000">
      {/* Background Glow */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-10 transition-colors duration-1000 pointer-events-none ${EMOTION_COLORS[emotion]}`} />
      
      {/* Audio element MUST have a unique key to force reset on song change */}
      <audio 
        key={currentSong.id}
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
        muted={isMuted}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-10">
           <div className="flex gap-2">
              <button 
                onClick={() => setViewMode(viewMode === 'details' ? 'art' : 'details')}
                className={`p-3 rounded-2xl transition-all ${viewMode === 'details' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white bg-white/5'}`}
                title="Details"
              >
                <Info size={18} />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'lyrics' ? 'art' : 'lyrics')}
                className={`p-3 rounded-2xl transition-all ${viewMode === 'lyrics' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white bg-white/5'}`}
                title="Lyrics"
              >
                <MessageSquareText size={18} />
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-2xl transition-all ${showSettings ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-white bg-white/5'}`}
                title="Quality Settings"
              >
                <Settings2 size={18} />
              </button>
           </div>
           <button 
            onClick={() => onToggleFavorite(currentSong.id)}
            className={`p-3 rounded-2xl transition-all ${isFavorited ? 'text-rose-400 scale-110 bg-rose-400/10' : 'text-slate-500 hover:text-rose-400 bg-white/5'}`}
           >
             <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
           </button>
        </div>

        {/* Quality Settings Panel */}
        {showSettings && (
          <div className="absolute top-24 left-10 right-10 bg-slate-950/90 backdrop-blur-2xl rounded-2xl p-6 z-30 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Audio Quality</h4>
               <button onClick={() => setShowSettings(false)}><X size={14} className="text-slate-500" /></button>
            </div>
            <div className="flex gap-2">
               {(['Low', 'Medium', 'High'] as AudioQuality[]).map(q => (
                 <button
                   key={q}
                   onClick={() => {setQuality(q); setShowSettings(false);}}
                   className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${quality === q ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                 >
                   {q}
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="relative aspect-square w-full mb-10">
           {/* Album Art View */}
           <div className={`absolute inset-0 transition-all duration-700 ${viewMode === 'art' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
              <div className="h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-950/40 border border-white/5 relative">
                <img src={currentSong.albumArt} alt="Album Art" className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                {currentSong.isTopTier && (
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-300" />
                    <span className="text-[10px] font-black uppercase text-white/70">Top Tier</span>
                  </div>
                )}
              </div>
           </div>

           {/* Details View */}
           <div className={`absolute inset-0 transition-all duration-700 ${viewMode === 'details' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="h-full w-full bg-slate-950/20 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col justify-center">
                 <div className="space-y-6">
                    <div className="flex gap-3">
                       <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">{currentSong.genre}</span>
                       <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">{currentSong.year}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium italic opacity-80 text-base">"{currentSong.description}"</p>
                    <div className="pt-6 border-t border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Streaming Quality</p>
                       <p className="text-sm font-semibold text-slate-300">{quality} Fidelity</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Lyrics View */}
           <div className={`absolute inset-0 transition-all duration-700 ${viewMode === 'lyrics' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className="h-full w-full bg-slate-950/20 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-10 flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar">
                 <div className="space-y-4">
                    {currentSong.lyrics?.map((line, i) => (
                      <p key={i} className={`text-xl font-bold tracking-tight transition-all duration-500 ${i === Math.floor((currentTime / duration) * currentSong.lyrics!.length) ? 'text-white scale-105' : 'text-slate-700'}`}>
                        {line}
                      </p>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Title & Artist */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white truncate tracking-tight mb-2 px-4">{currentSong.title}</h3>
          <p className="text-slate-500 truncate text-lg font-medium">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 px-4 group/progress relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-x-4 top-0 h-1.5 w-[calc(100%-32px)] opacity-0 cursor-pointer z-20"
          />
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out relative shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 mt-5 px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || currentSong.duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between px-2">
            <button 
              className={`p-3 rounded-2xl transition-all ${isMuted ? 'text-rose-400 bg-rose-400/5' : 'text-slate-600 hover:text-white bg-white/5'}`} 
              onClick={() => setIsMuted(!isMuted)}
            >
               {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className="flex items-center gap-10">
              <button onClick={onPrev} className="p-3 text-slate-500 hover:text-white transition-all active:scale-90 hover:bg-white/5 rounded-2xl">
                <SkipBack size={26} fill="currentColor" />
              </button>

              <button 
                onClick={onPlayPause}
                className="h-20 w-20 bg-white text-slate-900 rounded-[2.2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1.5" />}
              </button>

              <button onClick={onNext} className="p-3 text-slate-500 hover:text-white transition-all active:scale-90 hover:bg-white/5 rounded-2xl">
                <SkipForward size={26} fill="currentColor" />
              </button>
            </div>
            
             <div className="w-12" />
        </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
