import React, { useState } from 'react';
import { User, Song } from '../types';
import { ALL_SONGS } from '../constants';
import { X, User as UserIcon, Heart, Mail, Calendar, Edit3, History, LogOut } from 'lucide-react';
import { Button } from './Button';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  history: Song[];
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, user, history, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'library' | 'favorites'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, description: user.description });

  if (!isOpen) return null;

  const favoriteSongs = ALL_SONGS.filter(s => user.favorites.includes(s.id));

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: editData.name,
      description: editData.description
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <UserIcon size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <p className="text-slate-400 text-sm">Manage your profile and collections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-white/5">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'library', label: 'History', icon: History },
            { id: 'favorites', label: 'Favorites', icon: Heart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Your Information</h3>
                <button 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  <Edit3 size={14} />
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <UserIcon size={18} className="text-slate-400" />
                    {isEditing ? (
                      <input 
                        className="bg-transparent w-full focus:outline-none text-white font-medium" 
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                    ) : (
                      <span className="font-medium">{user.name}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 opacity-60">
                    <Mail size={18} className="text-slate-400" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Bio / Description</label>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 min-h-[100px] flex gap-3">
                  <Edit3 size={18} className="text-slate-400 shrink-0" />
                  {isEditing ? (
                    <textarea 
                      className="bg-transparent w-full focus:outline-none text-slate-300 leading-relaxed resize-none"
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows={4}
                    />
                  ) : (
                    <p className="text-slate-300 leading-relaxed">{user.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={16} />
                  <span>Member since {user.joinedDate}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {history.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <History size={48} className="mx-auto mb-4" />
                  <p>Your history is empty. Start listening to tracks!</p>
                </div>
              ) : (
                history.slice().reverse().map((song, idx) => (
                  <div key={`${song.id}-${idx}`} className="group p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md">
                      <img src={song.albumArt} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{song.title}</h4>
                      <p className="text-xs text-slate-400">{song.artist} • {song.emotion}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-colors uppercase">
                      {song.genre}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {favoriteSongs.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <Heart size={48} className="mx-auto mb-4" />
                  <p>You haven't favorited any songs yet.</p>
                </div>
              ) : (
                favoriteSongs.map(song => (
                  <div key={song.id} className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-4 hover:bg-red-500/10 transition-colors group">
                    <div className="h-12 w-12 rounded-xl overflow-hidden">
                      <img src={song.albumArt} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{song.title}</h4>
                      <p className="text-xs text-slate-400">{song.artist}</p>
                    </div>
                    <Heart size={16} className="text-red-500 fill-current group-hover:scale-110 transition-transform" />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-950/50">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};