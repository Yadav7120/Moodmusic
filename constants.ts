import { Emotion, Playlist, Song } from './types';

export const EMOTION_COLORS: Record<Emotion, string> = {
  [Emotion.Happy]: 'bg-amber-100', 
  [Emotion.Sad]: 'bg-blue-100',    
  [Emotion.Angry]: 'bg-rose-100',   
  [Emotion.Surprised]: 'bg-pink-100', 
  [Emotion.Neutral]: 'bg-slate-200', 
  [Emotion.Fearful]: 'bg-indigo-100', 
  [Emotion.Disgusted]: 'bg-emerald-100', 
};

export const EMOTION_GRADIENTS: Record<Emotion, string> = {
  [Emotion.Happy]: 'from-amber-50/10 to-amber-200/5',
  [Emotion.Sad]: 'from-blue-50/10 to-blue-200/5',
  [Emotion.Angry]: 'from-rose-50/10 to-rose-200/5',
  [Emotion.Surprised]: 'from-pink-50/10 to-pink-200/5',
  [Emotion.Neutral]: 'from-slate-50/10 to-slate-200/5',
  [Emotion.Fearful]: 'from-indigo-50/10 to-indigo-200/5',
  [Emotion.Disgusted]: 'from-emerald-50/10 to-emerald-200/5',
};

const lyricsTemplates: Record<Emotion, string[]> = {
  [Emotion.Happy]: ["Woke up to the sun on my face", "Everything is falling into place", "Singing loud like no one's around", "Feet are barely touching the ground"],
  [Emotion.Sad]: ["Gray skies and a hollow sound", "The silence is the loudest thing I've found", "Tracing lines on the window pane", "Waiting for the end of the rain"],
  [Emotion.Neutral]: ["Steady rhythm, simple flow", "Watching how the shadows grow", "Neither here nor really there", "Breath of cold and quiet air"],
  [Emotion.Angry]: ["Fire rising in the dark", "Looking for a single spark", "Walls are closing, heart is tight", "Gonna break through into light"],
  [Emotion.Surprised]: ["A sudden turn in the open road", "Lighter now, a shifting load", "Eyes wide at the morning light", "What a strange and lovely sight"],
  [Emotion.Fearful]: ["Shadows dancing on the wall", "Waiting for the leaves to fall", "Safe within this quiet space", "Searching for a familiar face"],
  [Emotion.Disgusted]: ["Bitter taste of a faded dream", "Tearing at the silver seam", "Turning over a brand new leaf", "Finding solace in the brief"],
};

// Expanded Audio Sources pool (SoundHelix provides dozens of indexed MP3s)
const AUDIO_SOURCES = Array.from({ length: 30 }, (_, i) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`);

const generateSong = (id: string, title: string, artist: string, emotion: Emotion, genre: string, year: string, isTopTier = false): Song => {
  // Use a more complex hash that includes the ID and artist to ensure unique selection
  const key = `${id}-${artist}-${title}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0; 
  }
  const sourceIndex = Math.abs(hash) % AUDIO_SOURCES.length;
  
  return {
    id,
    title,
    artist,
    albumArt: `https://picsum.photos/seed/${id}/600/600`,
    duration: 180 + (hash % 60), // Semi-unique duration for the UI
    url: AUDIO_SOURCES[sourceIndex],
    emotion,
    genre,
    year,
    isTopTier,
    description: `A ${isTopTier ? 'premier' : 'soulful'} ${genre} masterpiece that perfectly resonates with a ${emotion} state of mind.`,
    lyrics: lyricsTemplates[emotion],
  };
};

export const PLAYLISTS: Record<Emotion, Playlist> = {
  [Emotion.Happy]: {
    emotion: Emotion.Happy,
    title: "Vibrant Vibes",
    description: "Uplifting Malayalam hits and bright global rhythms.",
    songs: [
      generateSong('ml-h-illu', 'Illuminati', 'Sushin Shyam (Aavesham)', Emotion.Happy, 'Malayalam Rap', '2024', true),
      generateSong('ml-h-mini', 'Mini Maharani', 'Premalu', Emotion.Happy, 'Malayalam Indie', '2024', true),
      generateSong('ml-h-jaada', 'Jaada', 'Aavesham', Emotion.Happy, 'Malayalam Pop', '2024', true),
      generateSong('ml-h-olele', 'Olele', 'Thallumaala', Emotion.Happy, 'Malayalam Dance', '2022', true),
      generateSong('ml-h-kudu', 'Kudukku', 'Love Action Drama', Emotion.Happy, 'Malayalam Dance', '2019', true),
      generateSong('h-g-1', 'Sunlight', 'Elias Thorne', Emotion.Happy, 'Indie Pop', '2023'),
      generateSong('h-g-2', 'Skyward', 'Aria Bloom', Emotion.Happy, 'Folk', '2024', true),
    ]
  },
  [Emotion.Sad]: {
    emotion: Emotion.Sad,
    title: "Soulful Rain",
    description: "Soothing tracks for reflective and quiet moments.",
    songs: [
      generateSong('ml-s-uyire', 'Uyire', 'Gauthamante Radham', Emotion.Sad, 'Malayalam Ballad', '2020', true),
      generateSong('ml-s-malare', 'Malare', 'Premam', Emotion.Sad, 'Malayalam Classic', '2015', true),
      generateSong('ml-s-kanmizhi', 'Kanmizhi', 'Charlie', Emotion.Sad, 'Malayalam Soul', '2015', true),
      generateSong('ml-s-kamini', 'Kamini', 'Anugraheethan Antony', Emotion.Sad, 'Malayalam Melody', '2021', true),
      generateSong('s-g-1', 'Afterglow', 'Nocturne', Emotion.Sad, 'Ambient', '2023'),
      generateSong('s-g-2', 'Quiet Room', 'Sora', Emotion.Sad, 'Neo-Classical', '2022', true),
    ]
  },
  [Emotion.Neutral]: {
    emotion: Emotion.Neutral,
    title: "Balanced Flow",
    description: "Steady Malayalam melodies for focused concentration.",
    songs: [
      generateSong('ml-n-cherat', 'Cherathukal', 'Kumbalangi Nights', Emotion.Neutral, 'Malayalam Soul', '2019', true),
      generateSong('ml-n-kanmani', 'Kanmani Anbodu (Cover)', 'Manjummel Boys', Emotion.Neutral, 'Malayalam Indie', '2024', true),
      generateSong('ml-n-aaradh', 'Aaradhike', 'Ambili', Emotion.Neutral, 'Malayalam Indie', '2019', true),
      generateSong('n-g-1', 'Steady State', 'Ohm', Emotion.Neutral, 'Minimalist', '2023'),
      generateSong('n-g-2', 'Midday', 'The Middles', Emotion.Neutral, 'Soft Rock', '2024'),
    ]
  },
  [Emotion.Angry]: {
    emotion: Emotion.Angry,
    title: "Inner Fire",
    description: "Hard-hitting rhythms and powerful vocal layers.",
    songs: [
      generateSong('ml-a-galatta', 'Galatta', 'Aavesham', Emotion.Angry, 'Malayalam Rock', '2024', true),
      generateSong('ml-a-fire', 'The Fire Within', 'Malayalam Rock Ensemble', Emotion.Angry, 'Rock', '2023', true),
      generateSong('a-g-1', 'Thunderclap', 'Forge', Emotion.Angry, 'Alternative Rock', '2024', true),
      generateSong('a-g-2', 'Vortex', 'Viper', Emotion.Angry, 'Industrial', '2023'),
    ]
  },
  [Emotion.Surprised]: {
    emotion: Emotion.Surprised,
    title: "Sonic Shock",
    description: "Playful electronic textures and unexpected shifts.",
    songs: [
      generateSong('ml-su-kannil', 'Kannil Pettole', 'Thallumaala', Emotion.Surprised, 'Electronic', '2022', true),
      generateSong('su-g-1', 'Neon Pulse', 'Magic Mirror', Emotion.Surprised, 'Experimental', '2024'),
      generateSong('su-g-2', 'Flicker', 'Neon Dream', Emotion.Surprised, 'Hyperpop', '2023', true),
    ]
  },
  [Emotion.Fearful]: {
    emotion: Emotion.Fearful,
    title: "Safe Harbor",
    description: "Ambient cinematic scores to provide comfort and security.",
    songs: [
      generateSong('ml-f-2018', 'Bhoomi', '2018 Movie', Emotion.Fearful, 'Atmospheric', '2023', true),
      generateSong('f-g-1', 'Shield', 'Guardian', Emotion.Fearful, 'Choral', '2023'),
      generateSong('f-g-2', 'Sanctuary', 'The Fortress', Emotion.Fearful, 'Cinematic', '2024', true),
    ]
  },
  [Emotion.Disgusted]: {
    emotion: Emotion.Disgusted,
    title: "Pure Reset",
    description: "Clean tones and minimalist compositions to reset the mind.",
    songs: [
      generateSong('d-g-1', 'Crystal Morning', 'Verde', Emotion.Disgusted, 'Modern Classical', '2024', true),
      generateSong('d-g-2', 'Aquatic', 'Aquifer', Emotion.Disgusted, 'Chillout', '2023'),
    ]
  },
};

export const ALL_SONGS: Song[] = Object.values(PLAYLISTS).flatMap(p => p.songs);