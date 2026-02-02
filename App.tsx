import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { WebcamFeed } from './components/WebcamFeed';
import { MusicPlayer } from './components/MusicPlayer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EmotionBadge } from './components/EmotionBadge';
import { AccountModal } from './components/AccountModal';
import { Button } from './components/Button';
import { Emotion, Song, User } from './types';
import { PLAYLISTS } from './constants';
import { Smile, User as UserIcon, ChevronRight, PlayCircle, Settings, Music2, MessageSquareHeart, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'moodmelody_user_v2';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.Neutral);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Song[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [showLogin, setShowLogin] = useState(!user);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (user) { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user)); }
  }, [user]);

  const handleLogin = (name: string) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: name || 'Explorer',
      email: `${(name || 'guest').toLowerCase().replace(/\s/g, '.')}@moodmelody.co`,
      description: 'Searching for the perfect soundscape to match life\'s moments.',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      favorites: []
    };
    setUser(newUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
    setShowLogin(true);
    setIsAccountModalOpen(false);
  };

  const handleToggleFavorite = (songId: string) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return prev;
      const isFav = prev.favorites.includes(songId);
      const newFavs = isFav ? prev.favorites.filter(id => id !== songId) : [...prev.favorites, songId];
      return { ...prev, favorites: newFavs };
    });
  };

  const handleEmotionDetected = useCallback((emotion: Emotion, confidence: number) => {
    if (confidence > 0.7) {
      if (emotion !== currentEmotion) {
        setCurrentEmotion(emotion);
        setShowFeedback(true);
        // Fade out feedback nudge after 12s
        setTimeout(() => setShowFeedback(false), 12000);
      }
    }
  }, [currentEmotion]);

  useEffect(() => {
    if (user && isStreaming && !isPrivacyMode) {
      const playlist = PLAYLISTS[currentEmotion];
      if (playlist && playlist.songs.length > 0) {
        const needsUpdate = queue.length === 0 || queue[0].emotion !== currentEmotion;
        if (needsUpdate) {
            // Recommendation Logic: Prioritize Top Tier songs by sorting them to the front half
            const sortedSongs = [...playlist.songs].sort((a, b) => {
              if (a.isTopTier && !b.isTopTier) return -1;
              if (!a.isTopTier && b.isTopTier) return 1;
              return Math.random() - 0.5;
            });
            setQueue(sortedSongs);
            if (!currentSong) playSong(sortedSongs[0]);
        }
      }
    }
  }, [currentEmotion, isStreaming, user, isPrivacyMode, currentSong, queue]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setHistory(prev => (prev.length > 0 && prev[prev.length - 1].id === song.id) ? prev : [...prev, song]);
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const idx = queue.findIndex(s => s.id === currentSong?.id);
      playSong(queue[(idx + 1) % queue.length]);
    } else {
      const p = PLAYLISTS[currentEmotion];
      if (p.songs.length > 0) playSong(p.songs[0]);
    }
  };

  const handlePrev = () => {
    if (queue.length > 0 && currentSong) {
      const idx = queue.findIndex(s => s.id === currentSong.id);
      playSong(queue[(idx - 1 + queue.length) % queue.length]);
    }
  };

  const setManualEmotion = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
    setShowFeedback(false);
    const p = PLAYLISTS[emotion];
    const nq = [...p.songs].sort((a, b) => (a.isTopTier ? -1 : 1) + (Math.random() - 0.5));
    setQueue(nq);
    if (nq.length > 0) playSong(nq[0]);
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-rose-200 opacity-20" />
          <div className="mb-12 relative inline-block">
             <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-10 rounded-full" />
             <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-white/5 relative z-10 shadow-inner">
                <Smile size={64} className="text-slate-200" />
             </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">MoodMelody</h1>
          <p className="text-slate-400 mb-12 text-lg leading-relaxed font-medium">Gentle music, tuned to your emotions.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin((e.currentTarget.elements.namedItem('username') as HTMLInputElement).value); }}>
            <div className="space-y-4">
              <input 
                name="username"
                type="text" 
                placeholder="What should we call you?" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-300/30 focus:outline-none transition-all text-center text-lg"
                autoFocus
                required
              />
              <Button type="submit" size="lg" className="w-full py-5 rounded-[2rem] shadow-none bg-white text-slate-900 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all">
                Let's Begin <ChevronRight size={22} className="ml-2" />
              </Button>
            </div>
          </form>
          <p className="mt-10 text-xs text-slate-600 leading-relaxed font-medium">
            Your privacy matters. Camera analysis stays local on your device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout emotion={currentEmotion}>
      <header className="flex items-center justify-between py-10 px-8 lg:px-20 max-w-[1600px] mx-auto w-full z-[80] relative">
        <div className="flex items-center gap-5 group cursor-pointer transition-transform active:scale-95">
          <div className="bg-white/5 p-3.5 rounded-[1.5rem] backdrop-blur-2xl border border-white/5 group-hover:bg-white/10 transition-all shadow-sm">
             <Smile size={28} className="text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight hidden sm:block">MoodMelody</h1>
        </div>

        <div className="flex items-center gap-6 px-8 py-3.5 rounded-[2rem] bg-slate-950/10 backdrop-blur-3xl border border-white/5 shadow-2xl">
           <div className="relative h-11 w-11 flex items-center justify-center">
             <div className="absolute inset-0 bg-white/5 rounded-[1.2rem] animate-pulse-slow" />
             <Music2 size={26} className="text-slate-400 relative z-10" />
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-black tracking-[0.5em] text-white uppercase leading-none opacity-60">Session</span>
             <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-none mt-2">Personal AI</span>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-5 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-[1.5rem] border border-white/5 transition-all group shadow-sm"
          >
            <div className="h-10 w-10 rounded-[1rem] bg-slate-800 flex items-center justify-center border border-white/5">
              <UserIcon size={20} className="text-slate-400" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-none mb-1.5">Welcome</p>
              <p className="text-base font-semibold text-slate-200 leading-none">{user?.name}</p>
            </div>
            <Settings size={20} className="text-slate-600 group-hover:text-slate-200 transition-colors ml-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 lg:px-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-7 flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <WebcamFeed 
              isStreaming={isStreaming} 
              onEmotionDetected={handleEmotionDetected}
              currentEmotion={currentEmotion}
              isPrivacyMode={isPrivacyMode}
              togglePrivacy={() => setIsPrivacyMode(!isPrivacyMode)}
            />
            
            {!isStreaming && (
              <div className="text-center p-16 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-xl">
                <div className="mb-6 flex justify-center">
                  <Sparkles size={40} className="text-indigo-400 opacity-40 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Discover Your Soundtrack</h3>
                <p className="text-slate-400 mb-10 text-lg font-medium max-w-sm mx-auto leading-relaxed">Let our AI sense your current state of being and recommend the perfect harmony.</p>
                <Button onClick={() => setIsStreaming(true)} size="lg" className="rounded-[1.5rem] px-14 py-5 bg-white text-slate-900 font-bold hover:scale-105 transition-transform shadow-2xl shadow-white/5">
                  <PlayCircle size={24} className="mr-3" /> Start Tuning In
                </Button>
              </div>
            )}

            {showFeedback && isStreaming && !isPrivacyMode && (
              <div className="bg-white/5 border border-indigo-500/10 backdrop-blur-3xl rounded-[2rem] p-8 flex items-center justify-between animate-in slide-in-from-top-6 duration-700 shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl">
                    <MessageSquareHeart size={24} className="text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white/90 tracking-tight">Gentle Check-in</p>
                    <p className="text-sm text-slate-500 mt-1">We're sensing a <span className="text-indigo-300 capitalize font-black">{currentEmotion}</span> vibe. Is this accurate?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setShowFeedback(false)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all hover:scale-105">Yes, perfectly</button>
                   <button onClick={() => setShowFeedback(false)} className="px-6 py-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-xs font-bold transition-all hover:scale-105">Not quite</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-12 shadow-inner">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">Manual Mood Control</h3>
              <EmotionBadge emotion={currentEmotion} />
            </div>
            <div className="flex flex-wrap gap-5">
              {Object.values(Emotion).map(em => (
                <button
                  key={em}
                  onClick={() => setManualEmotion(em)}
                  className={`px-8 py-4 rounded-[1.5rem] text-sm font-bold transition-all border ${currentEmotion === em ? 'bg-white text-slate-900 border-white shadow-2xl scale-105' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10 hover:translate-y-[-2px]'}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-10">
           {currentSong ? (
             <MusicPlayer 
                currentSong={currentSong}
                isPlaying={isPlaying}
                isFavorited={user?.favorites.includes(currentSong.id) || false}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrev={handlePrev}
                onToggleFavorite={handleToggleFavorite}
                emotion={currentEmotion}
             />
           ) : (
             <div className="bg-white/5 border border-white/5 rounded-[3rem] p-12 text-center h-[520px] flex flex-col items-center justify-center backdrop-blur-3xl shadow-xl">
                <MusicIconPlaceholder />
                <p className="text-slate-600 mt-10 font-bold tracking-[0.2em] uppercase text-xs">Awaiting Presence...</p>
             </div>
           )}

           <div className="flex-1 min-h-[450px]">
             <HistoryDrawer 
                history={history} 
                onSelectSong={playSong}
                currentSongId={currentSong?.id}
             />
           </div>
        </div>
      </main>

      {user && (
        <AccountModal 
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={user}
          history={history}
          onUpdateUser={setUser}
          onLogout={handleLogout}
        />
      )}
    </Layout>
  );
};

const MusicIconPlaceholder = () => (
  <div className="relative h-32 w-32">
    <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] animate-pulse-slow" />
    <div className="absolute inset-4 bg-white/5 rounded-[2rem] animate-pulse delay-500" />
    <div className="absolute inset-0 flex items-center justify-center text-slate-800">
       <PlayCircle size={64} />
    </div>
  </div>
);

export default App;