export type MovieGenre =
  | 'Sci-Fi'
  | 'Thriller'
  | 'Action'
  | 'Animation'
  | 'Fantasy'
  | 'Drama'
  | 'Documentary';

export const MOVIE_GENRES: MovieGenre[] = [
  'Sci-Fi',
  'Thriller',
  'Action',
  'Animation',
  'Fantasy',
  'Drama',
  'Documentary',
];

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  description: string;
  genre: MovieGenre;
  releaseYear: number;
  videoUrl: string;
  featured: boolean;
  trending?: boolean;
  duration?: string;
  director?: string;
  licenseInfo?: string;
  createdAt: string;
}

export type MovieFormInput = {
  title: string;
  posterUrl: string;
  description: string;
  genre: MovieGenre;
  releaseYear: number;
  videoUrl: string;
  featured: boolean;
  duration?: string;
  director?: string;
  licenseInfo?: string;
};

export type AppView =
  | { page: 'home' }
  | { page: 'movies'; initialGenre?: string; initialQuery?: string }
  | { page: 'genres'; selectedGenre?: MovieGenre }
  | { page: 'watchlist' }
  | { page: 'details'; movieId: string }
  | { page: 'player'; movieId: string }
  | { page: 'admin' }
  | { page: 'deploy-guide' };

export interface StorageProviderStatus {
  mode: 'local-browser-storage' | 'cloudflare-d1-r2-worker';
  persistenceScope: string;
  workerEndpointConfigured: boolean;
  r2SignedUrlReady: boolean;
}
