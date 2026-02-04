import React from 'react';
import { Song } from '../types';
import { Clock, Music } from 'lucide-react';

interface HistoryDrawerProps {
  history: Song[];
  onSelectSong: (song: Song) => void;
  currentSongId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ history, onSelectSong, currentSongId }) => {
  return (
    <div className="bg-slate-800/20 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-white flex items-center gap-3">
          <Clock size={20} className="text-slate-500" />
          Recent Sounds
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{history.length} tracks</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center text-slate-600 py-16">
            <Music size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm font-medium">Your journey starts here.</p>
          </div>
        ) : (
          history.slice().reverse().map((song, idx) => (
            <div 
              key={`${song.id}-${idx}`}
              onClick={() => onSelectSong(song)}
              className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group ${currentSongId === song.id ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}`}
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-900/40 flex-shrink-0 shadow-sm border border-white/5">
                <img src={song.albumArt} alt="" className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-sm font-bold truncate ${currentSongId === song.id ? 'text-white' : 'text-slate-200'}`}>
                  {song.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{song.artist}</p>
              </div>
              <div className={`h-2 w-2 rounded-full transition-colors ${currentSongId === song.id ? 'bg-white animate-pulse' : 'bg-transparent'}`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
