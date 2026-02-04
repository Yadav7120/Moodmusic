import React from 'react';
import { Emotion } from '../types';
import { EMOTION_GRADIENTS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  emotion: Emotion;
}

export const Layout: React.FC<LayoutProps> = ({ children, emotion }) => {
  const gradient = EMOTION_GRADIENTS[emotion] || 'from-slate-800 to-slate-900';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 transition-colors duration-1000 ease-in-out relative overflow-hidden flex flex-col">
      {/* Dynamic Background Gradient Overlay - Very subtle pastels */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 transition-all duration-1000`} />
      
      {/* Animated Orbs - Softer blur */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-slate-100/5 blur-[140px] animate-float opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[140px] animate-float opacity-30 pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
