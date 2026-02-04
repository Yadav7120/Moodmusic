import React from 'react';
import { Emotion } from '../types';
import { EMOTION_COLORS } from '../constants';

interface EmotionBadgeProps {
  emotion: Emotion;
  className?: string;
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion, className = '' }) => {
  const colorClass = EMOTION_COLORS[emotion];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`h-3 w-3 rounded-full ${colorClass} animate-pulse`} />
      <span className="capitalize font-semibold text-white tracking-wide">
        {emotion}
      </span>
    </div>
  );
};