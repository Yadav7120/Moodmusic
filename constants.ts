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

// Expanded Audio Sources to ensure unique playback per metadata
const AUDIO_SOURCES = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
];

const generateSong = (id: string, title: string, artist: string, emotion: Emotion, genre: string, year: string, isTopTier = false): Song => {
  // Use a stable deterministic index for the URL to prevent mismatches
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sourceIndex = hash % AUDIO_SOURCES.length;
  return {
    id,
    title,
    artist,
    albumArt: `https://picsum.photos/seed/${id}/600/600`,
    duration: 160 + Math.floor(Math.random() * 80),
    url: AUDIO_SOURCES[sourceIndex],
    emotion,
    genre,
    year,
    isTopTier,
    description: `A ${isTopTier ? 'high-energy' : 'soulful'} ${genre} track that resonates with ${emotion} feelings.`,
    lyrics: lyricsTemplates[emotion],
  };
};

export const PLAYLISTS: Record<Emotion, Playlist> = {
  [Emotion.Happy]: {
    emotion: Emotion.Happy,
    title: "Vibrant Energy",
    description: "Uplifting beats and Malayalam blockbusters.",
    songs: [
      generateSong('ml-h-minnal', 'Thee Minnal', 'Minnal Murali', Emotion.Happy, 'Malayalam Pop', '2021', true),
      generateSong('ml-h-kudu', 'Kudukku', 'Love Action Drama', Emotion.Happy, 'Malayalam Dance', '2019', true),
      generateSong('ml-h-illu', 'Illuminati', 'Aavesham (Sushin Shyam)', Emotion.Happy, 'Malayalam Rap', '2024', true),
      generateSong('ml-h-premalu', 'Mini Maharani', 'Premalu', Emotion.Happy, 'Malayalam Indie', '2024', true),
      generateSong('ml-h-vibe', 'Jaada', 'Aavesham', Emotion.Happy, 'Malayalam Pop', '2024', true),
      generateSong('h-global-1', 'Sunlight', 'Elias Thorne', Emotion.Happy, 'Indie', '2023'),
      generateSong('h-global-2', 'Golden fields', 'Aria Bloom', Emotion.Happy, 'Folk', '2024', true),
    ]
  },
  [Emotion.Sad]: {
    emotion: Emotion.Sad,
    title: "Quiet Solace",
    description: "Melodious ballads and deep reflections.",
    songs: [
      generateSong('ml-s-uyire', 'Uyire', 'Gauthamante Radham', Emotion.Sad, 'Malayalam Ballad', '2020', true),
      generateSong('ml-s-kanmizhi', 'Kanmizhi', 'Charlie', Emotion.Sad, 'Malayalam Classic', '2015', true),
      generateSong('ml-s-malare', 'Malare', 'Premam', Emotion.Sad, 'Malayalam Romance', '2015', true),
      generateSong('ml-s-nilav', 'Pavizha Mazha', 'Athiran', Emotion.Sad, 'Malayalam Melody', '2019', true),
      generateSong('s-global-1', 'Fading Light', 'Nocturne', Emotion.Sad, 'Ambient', '2023'),
      generateSong('s-global-2', 'Echoes', 'Sora', Emotion.Sad, 'Neo-Classical', '2022', true),
    ]
  },
  [Emotion.Neutral]: {
    emotion: Emotion.Neutral,
    title: "Inner Balance",
    description: "Ambient sounds for focus and calm.",
    songs: [
      generateSong('ml-n-kumbalangi', 'Cherathukal', 'Kumbalangi Nights', Emotion.Neutral, 'Malayalam Soul', '2019', true),
      generateSong('ml-n-manjummel', 'Kanmani Anbodu (Cover)', 'Manjummel Boys', Emotion.Neutral, 'Malayalam Classic', '2024', true),
      generateSong('ml-n-ambili', 'Aaradhike', 'Ambili', Emotion.Neutral, 'Malayalam Indie', '2019', true),
      generateSong('n-global-1', 'Steady Pulse', 'Ohm', Emotion.Neutral, 'Minimal', '2023'),
      generateSong('n-global-2', 'Paper Planes', 'The Middles', Emotion.Neutral, 'Soft Rock', '2024'),
    ]
  },
  [Emotion.Angry]: {
    emotion: Emotion.Angry,
    title: "Release & Ground",
    description: "Hard-hitting rhythms to channel energy.",
    songs: [
      generateSong('ml-a-galatta', 'Galatta', 'Aavesham', Emotion.Angry, 'Malayalam Rock', '2024', true),
      generateSong('ml-a-fire', 'The Fire Within', 'Action Hits', Emotion.Angry, 'Malayalam Alternative', '2023', true),
      generateSong('a-global-1', 'Thunderclap', 'Forge', Emotion.Angry, 'Alternative Rock', '2024', true),
      generateSong('a-global-2', 'Breaking Point', 'Viper', Emotion.Angry, 'Industrial', '2023'),
    ]
  },
  [Emotion.Surprised]: {
    emotion: Emotion.Surprised,
    title: "Spark of Wonder",
    description: "Playful and experimental sounds.",
    songs: [
      generateSong('ml-su-kannil', 'Kannil Pettole', 'Thallumaala', Emotion.Surprised, 'Malayalam Electronic', '2022', true),
      generateSong('su-global-1', 'The Reveal', 'Magic Mirror', Emotion.Surprised, 'Experimental', '2024'),
      generateSong('su-global-2', 'Neon Dream', 'Spark', Emotion.Surprised, 'Hyperpop', '2023', true),
    ]
  },
  [Emotion.Fearful]: {
    emotion: Emotion.Fearful,
    title: "Safe Haven",
    description: "Enveloping cinematic textures for comfort.",
    songs: [
      generateSong('ml-f-2018', 'Bhoomi', '2018 Movie', Emotion.Fearful, 'Atmospheric', '2023', true),
      generateSong('f-global-1', 'Guardian', 'Soft Whispers', Emotion.Fearful, 'Choral', '2023'),
      generateSong('f-global-2', 'Enclosure', 'The Fortress', Emotion.Fearful, 'Cinematic', '2024', true),
    ]
  },
  [Emotion.Disgusted]: {
    emotion: Emotion.Disgusted,
    title: "Mental Reset",
    description: "Pure tones to wash away the noise.",
    songs: [
      generateSong('d-global-1', 'Citrus Bloom', 'Verde', Emotion.Disgusted, 'Modern Classical', '2024', true),
      generateSong('d-global-2', 'Washing Away', 'Aquifer', Emotion.Disgusted, 'Chillout', '2023'),
    ]
  },
};

export const ALL_SONGS: Song[] = Object.values(PLAYLISTS).flatMap(p => p.songs);
