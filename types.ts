export enum Emotion {
  Happy = 'happy',
  Sad = 'sad',
  Angry = 'angry',
  Surprised = 'surprised',
  Neutral = 'neutral',
  Fearful = 'fearful',
  Disgusted = 'disgusted',
}

export type AudioQuality = 'Low' | 'Medium' | 'High';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // in seconds
  url: string; // audio source url
  emotion: Emotion;
  genre?: string;
  year?: string;
  description?: string;
  lyrics?: string[];
  isTopTier?: boolean; // Flag to prioritize better songs
}

export interface User {
  id: string;
  name: string;
  email: string;
  description: string;
  joinedDate: string;
  favorites: string[]; // Song IDs
}

export interface Playlist {
  emotion: Emotion;
  title: string;
  description: string;
  songs: Song[];
}

export type ThemeMode = 'light' | 'dark';