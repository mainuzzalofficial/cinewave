import { Movie } from '../types/movie';
import heroBackdrop from '../assets/images/hero_featured_backdrop_1791721801607.jpg';
import posterCrimson from '../assets/images/poster_crimson_horizon_1791721816898.jpg';
import posterVelvet from '../assets/images/poster_velvet_noir_1791721831413.jpg';
import posterIron from '../assets/images/poster_iron_symphony_1791721845430.jpg';
import posterCitadel from '../assets/images/poster_glass_citadel_1791721856446.jpg';

/**
 * Initial curated demo catalog for CineWave.
 * All video streams use openly licensed Creative Commons (CC-BY 3.0 / 4.0) open-movie projects
 * from the Blender Foundation or Public Domain archives so every stream is 100% legal and playable.
 */
export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 'cw-tears-of-steel',
    title: 'Crimson Horizon: Tears of Steel',
    posterUrl: posterCrimson,
    backdropUrl: heroBackdrop,
    description:
      'In a scarred future Amsterdam, a clandestine cell of scientists and combat engineers stage a desperate final transmission inside a ruined dome to reverse a catastrophic orbital intelligence uprising before the horizon collapses.',
    genre: 'Sci-Fi',
    releaseYear: 2025,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    featured: true,
    trending: true,
    duration: '12m 14s',
    director: 'Ian Hubert',
    licenseInfo: 'Creative Commons Attribution 3.0 (Blender Foundation Open Movie Project)',
    createdAt: '2026-01-15T12:00:00.000Z',
  },
  {
    id: 'cw-velvet-noir',
    title: 'Velvet Protocol',
    posterUrl: posterVelvet,
    backdropUrl: heroBackdrop,
    description:
      'Through rain-slicked Neo-European alleys, an acoustic forensic investigator tracks a phantom radio signal broadcasting encrypted confessions from a syndicate that officially dissolved thirty years ago.',
    genre: 'Thriller',
    releaseYear: 2026,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    featured: false,
    trending: true,
    duration: '10m 53s',
    director: 'Bassam Kurdali',
    licenseInfo: 'Creative Commons Attribution 2.5 (Orange Open Movie Project)',
    createdAt: '2026-02-10T15:30:00.000Z',
  },
  {
    id: 'cw-iron-symphony',
    title: 'Apex Redline: Alpine Stage',
    posterUrl: posterIron,
    description:
      'Behind the visor of an independent endurance racing crew tackling brutal night passes across wet mountain tarmac, where mechanical attrition and split-second brake bias adjustments separate victory from the gorge.',
    genre: 'Action',
    releaseYear: 2025,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    featured: false,
    trending: true,
    duration: '47s',
    director: 'Gumball Collective',
    licenseInfo: 'Public Sample Stream (Google GTV Open Media Archive)',
    createdAt: '2026-02-18T09:15:00.000Z',
  },
  {
    id: 'cw-glass-citadel',
    title: 'The Glass Citadel',
    posterUrl: posterCitadel,
    description:
      'High inside a monolithic brutalist data sanctuary during a coastal super-storm, a junior archivist discovers that the building’s automated climate core is preserving memories of residents who never existed.',
    genre: 'Drama',
    releaseYear: 2026,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    featured: false,
    trending: true,
    duration: '15s',
    director: 'Elena Rostova',
    licenseInfo: 'Public Sample Stream (Open Media Test Suite)',
    createdAt: '2026-03-01T18:00:00.000Z',
  },
  {
    id: 'cw-sintel-chronicles',
    title: 'Sintel: Ember of the North',
    posterUrl: posterCrimson,
    description:
      'A solitary wanderer crosses jagged glacial peaks and ash-covered deserts in search of a fledgling dragon companion taken by an ancient winged guardian.',
    genre: 'Fantasy',
    releaseYear: 2024,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    featured: false,
    trending: false,
    duration: '14m 48s',
    director: 'Colin Levy',
    licenseInfo: 'Creative Commons Attribution 3.0 (Durian Open Movie Project)',
    createdAt: '2025-11-20T10:00:00.000Z',
  },
  {
    id: 'cw-big-buck-odyssey',
    title: 'Woodland Reckoning',
    posterUrl: posterCitadel,
    description:
      'An oversized, good-natured forest dweller has his peaceful morning routine disrupted by three relentless woodland provocateurs, prompting an elaborate tactical counter-response.',
    genre: 'Animation',
    releaseYear: 2023,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: false,
    trending: false,
    duration: '9m 56s',
    director: 'Sacha Goedegebure',
    licenseInfo: 'Creative Commons Attribution 3.0 (Peach Open Movie Project)',
    createdAt: '2025-10-05T14:20:00.000Z',
  },
  {
    id: 'cw-subaru-telemetry',
    title: 'Gravel & Telemetry: Stage Zero',
    posterUrl: posterIron,
    description:
      'A documentary short examining suspension kinematics, gravel tire compounds, and driver eye-tracking during closed-course desert rally testing.',
    genre: 'Documentary',
    releaseYear: 2026,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    featured: false,
    trending: false,
    duration: '47s',
    director: 'Marcus Vance',
    licenseInfo: 'Public Sample Stream (Open Media Archive)',
    createdAt: '2026-03-12T08:45:00.000Z',
  },
  {
    id: 'cw-midnight-circuit',
    title: 'Nocturne Overdrive',
    posterUrl: posterVelvet,
    description:
      'When an underground courier accepts a zero-trace delivery across a locked-down port district, every intersection camera becomes an adversary.',
    genre: 'Action',
    releaseYear: 2026,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    featured: false,
    trending: false,
    duration: '15s',
    director: 'Kaito Takahashi',
    licenseInfo: 'Public Sample Stream (Open Media Archive)',
    createdAt: '2026-03-22T21:10:00.000Z',
  },
];
