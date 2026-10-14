import { Movie, MovieFormInput, StorageProviderStatus } from '../types/movie';
import { SAMPLE_MOVIES } from '../data/sampleMovies';

const MOVIES_STORAGE_KEY = 'cinewave_movies_catalog_v1';
const WATCHLIST_STORAGE_KEY = 'cinewave_watchlist_ids_v1';
const PROGRESS_STORAGE_KEY = 'cinewave_playback_progress_v1';

/**
 * Storage Service Interface
 * ------------------------
 * Designed so CineWave runs out-of-the-box in the browser using localStorage for the initial demo,
 * while providing a clean async/sync contract that can be swapped to a Cloudflare Workers API +
 * Cloudflare D1 (SQLite metadata) + Cloudflare R2 (private object storage with presigned URLs)
 * without refactoring UI components.
 *
 * SECURITY NOTE:
 * - Never place Cloudflare R2 Access Key IDs, Secret Access Keys, or D1 API tokens in frontend code.
 * - When connecting a production backend, set `VITE_API_BASE_URL` to your Cloudflare Worker route
 *   (e.g. `/api/movies`) which authenticates admin mutations via Cloudflare Access / JWT and signs R2 URLs server-side.
 */
export interface IMovieStorageService {
  getProviderStatus(): StorageProviderStatus;
  getMovies(): Movie[];
  getMovieById(id: string): Movie | undefined;
  addMovie(input: MovieFormInput): Movie;
  updateMovie(id: string, input: MovieFormInput): Movie;
  deleteMovie(id: string): void;
  resetCatalogToDefaults(): Movie[];
  getWatchlistIds(): string[];
  toggleWatchlist(movieId: string): { added: boolean; ids: string[] };
  isInWatchlist(movieId: string): boolean;
  savePlaybackProgress(movieId: string, seconds: number): void;
  getPlaybackProgress(movieId: string): number;
}

class LocalDemoMovieService implements IMovieStorageService {
  getProviderStatus(): StorageProviderStatus {
    const workerUrl = import.meta.env.VITE_WORKER_API_URL;
    return {
      mode: workerUrl ? 'cloudflare-d1-r2-worker' : 'local-browser-storage',
      persistenceScope:
        'Browser LocalStorage only (stored locally on this device/browser; not synced to a remote database).',
      workerEndpointConfigured: Boolean(workerUrl),
      r2SignedUrlReady: false,
    };
  }

  getMovies(): Movie[] {
    try {
      const raw = window.localStorage.getItem(MOVIES_STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(SAMPLE_MOVIES));
        return [...SAMPLE_MOVIES];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [...SAMPLE_MOVIES];
      }
      return parsed;
    } catch {
      return [...SAMPLE_MOVIES];
    }
  }

  private saveMovies(movies: Movie[]): void {
    try {
      window.localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies));
    } catch (err) {
      console.error('Failed to persist movies to localStorage:', err);
    }
  }

  getMovieById(id: string): Movie | undefined {
    return this.getMovies().find((m) => m.id === id);
  }

  addMovie(input: MovieFormInput): Movie {
    const current = this.getMovies();
    const newMovie: Movie = {
      id: `cw-custom-${Date.now()}`,
      title: input.title.trim(),
      posterUrl: input.posterUrl.trim(),
      description: input.description.trim(),
      genre: input.genre,
      releaseYear: Number(input.releaseYear) || new Date().getFullYear(),
      videoUrl: input.videoUrl.trim(),
      featured: Boolean(input.featured),
      trending: Boolean(input.featured),
      duration: input.duration?.trim() || 'Full Feature',
      director: input.director?.trim() || 'Independent Studio',
      licenseInfo: input.licenseInfo?.trim() || 'User-Provided / Authorized Stream',
      createdAt: new Date().toISOString(),
    };

    // If the newly added movie is marked featured, optionally unmark other featured movies
    // so the Home Hero spotlight updates immediately as expected by the user.
    const updated = newMovie.featured
      ? [newMovie, ...current.map((m) => ({ ...m, featured: false }))]
      : [newMovie, ...current];

    this.saveMovies(updated);
    return newMovie;
  }

  updateMovie(id: string, input: MovieFormInput): Movie {
    const current = this.getMovies();
    let updatedMovie: Movie | undefined;

    const next = current.map((movie) => {
      if (movie.id === id) {
        updatedMovie = {
          ...movie,
          title: input.title.trim(),
          posterUrl: input.posterUrl.trim(),
          description: input.description.trim(),
          genre: input.genre,
          releaseYear: Number(input.releaseYear) || movie.releaseYear,
          videoUrl: input.videoUrl.trim(),
          featured: Boolean(input.featured),
          duration: input.duration?.trim() || movie.duration,
          director: input.director?.trim() || movie.director,
          licenseInfo: input.licenseInfo?.trim() || movie.licenseInfo,
        };
        return updatedMovie;
      }
      // If the edited movie is set as featured, clear previous featured flag so the new selection takes spotlight
      if (input.featured) {
        return { ...movie, featured: false };
      }
      return movie;
    });

    if (!updatedMovie) {
      throw new Error(`Movie with ID "${id}" not found.`);
    }

    // Ensure at least one movie remains featured
    if (!next.some((m) => m.featured) && next.length > 0) {
      next[0] = { ...next[0], featured: true };
    }

    this.saveMovies(next);
    return updatedMovie;
  }

  deleteMovie(id: string): void {
    const current = this.getMovies();
    const filtered = current.filter((m) => m.id !== id);
    if (filtered.length > 0 && !filtered.some((m) => m.featured)) {
      filtered[0] = { ...filtered[0], featured: true };
    }
    this.saveMovies(filtered);
  }

  resetCatalogToDefaults(): Movie[] {
    this.saveMovies(SAMPLE_MOVIES);
    return [...SAMPLE_MOVIES];
  }

  getWatchlistIds(): string[] {
    try {
      const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  toggleWatchlist(movieId: string): { added: boolean; ids: string[] } {
    const current = this.getWatchlistIds();
    const exists = current.includes(movieId);
    const next = exists
      ? current.filter((id) => id !== movieId)
      : [movieId, ...current];

    try {
      window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error('Failed to persist watchlist to localStorage:', err);
    }

    return { added: !exists, ids: next };
  }

  isInWatchlist(movieId: string): boolean {
    return this.getWatchlistIds().includes(movieId);
  }

  savePlaybackProgress(movieId: string, seconds: number): void {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      const map: Record<string, number> = raw ? JSON.parse(raw) : {};
      map[movieId] = Math.floor(seconds);
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore quota errors
    }
  }

  getPlaybackProgress(movieId: string): number {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return 0;
      const map: Record<string, number> = JSON.parse(raw);
      return Number(map[movieId]) || 0;
    } catch {
      return 0;
    }
  }
}

/**
 * Reference Cloudflare Worker + D1 + R2 Adapter Blueprint
 * -------------------------------------------------------
 * When deploying with Cloudflare Pages Functions (`/functions/api/movies.ts`),
 * your server-side Worker binds `env.DB` (Cloudflare D1) and `env.MEDIA_BUCKET` (Cloudflare R2)
 * without ever exposing credentials to the client.
 */
export const CLOUDFLARE_ARCHITECTURE_BLUEPRINT = {
  d1SchemaSql: `CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  description TEXT NOT NULL,
  genre TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  r2_object_key TEXT NOT NULL,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);`,
  workerSignedStreamExample: `// functions/api/stream/[id].ts (Cloudflare Pages Function)
export const onRequestGet: PagesFunction<{ DB: D1Database; MEDIA_BUCKET: R2Bucket }> = async (ctx) => {
  const movieId = ctx.params.id as string;
  const row = await ctx.env.DB.prepare("SELECT r2_object_key FROM movies WHERE id = ?").bind(movieId).first();
  if (!row) return new Response("Not found", { status: 404 });

  // Stream private R2 object with HTTP Range support for mobile HTML5 video scrubbing
  const object = await ctx.env.MEDIA_BUCKET.get(row.r2_object_key as string, {
    range: ctx.request.headers,
  });
  if (!object) return new Response("Video object missing in R2", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Accept-Ranges", "bytes");
  return new Response(object.body, {
    status: ctx.request.headers.has("range") ? 206 : 200,
    headers,
  });
};`,
};

export const movieService: IMovieStorageService = new LocalDemoMovieService();
