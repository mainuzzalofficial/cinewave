import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  Play,
  AlertTriangle,
  CheckCircle2,
  Database,
  Film,
} from 'lucide-react';
import { Movie, MOVIE_GENRES, MovieFormInput, MovieGenre, AppView } from '../types/movie';
import posterCrimson from '../assets/images/poster_crimson_horizon_1791721816898.jpg';
import posterVelvet from '../assets/images/poster_velvet_noir_1791721831413.jpg';
import posterIron from '../assets/images/poster_iron_symphony_1791721845430.jpg';
import posterCitadel from '../assets/images/poster_glass_citadel_1791721856446.jpg';

interface AdminPageProps {
  movies: Movie[];
  onAddMovie: (input: MovieFormInput) => Movie;
  onUpdateMovie: (id: string, input: MovieFormInput) => Movie;
  onDeleteMovie: (id: string) => void;
  onResetCatalog: () => void;
  onPlayMovie: (movieId: string) => void;
  onSelectMovie: (movieId: string) => void;
  onNavigate: (view: AppView) => void;
}

const PRESET_POSTERS = [
  { label: 'Crimson Eclipse (Sci-Fi)', url: posterCrimson },
  { label: 'Velvet Alley (Noir Thriller)', url: posterVelvet },
  { label: 'Alpine Redline (Action)', url: posterIron },
  { label: 'Glass Citadel (Drama)', url: posterCitadel },
];

const PRESET_LICENSED_VIDEOS = [
  {
    label: 'Tears of Steel (CC-BY Blender Sci-Fi)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    label: 'Sintel (CC-BY Blender Fantasy)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    label: 'Elephants Dream (CC-BY Experimental)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    label: 'Big Buck Bunny (CC-BY Animation)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    label: 'Broken / Invalid URL (Test Player Error Handling)',
    url: 'https://invalid.example.test/missing-stream.mp4',
  },
];

const INITIAL_FORM: MovieFormInput = {
  title: '',
  posterUrl: posterCrimson,
  description: '',
  genre: 'Sci-Fi',
  releaseYear: new Date().getFullYear(),
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  featured: false,
};

export const AdminPage: React.FC<AdminPageProps> = ({
  movies,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onResetCatalog,
  onPlayMovie,
  onSelectMovie,
  onNavigate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MovieFormInput>(INITIAL_FORM);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleEditClick = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      posterUrl: movie.posterUrl,
      description: movie.description,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      videoUrl: movie.videoUrl,
      featured: movie.featured,
      duration: movie.duration,
      director: movie.director,
      licenseInfo: movie.licenseInfo,
    });
    setStatusBanner(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setStatusBanner(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusBanner({ type: 'error', message: 'Movie title is required.' });
      return;
    }
    if (!formData.description.trim()) {
      setStatusBanner({ type: 'error', message: 'Movie description is required.' });
      return;
    }

    if (editingId) {
      const updated = onUpdateMovie(editingId, formData);
      setStatusBanner({
        type: 'success',
        message: `Updated "${updated.title}" in browser localStorage.`,
      });
      setEditingId(null);
      setFormData(INITIAL_FORM);
    } else {
      const created = onAddMovie(formData);
      setStatusBanner({
        type: 'success',
        message: `Added "${created.title}" to your local catalog.`,
      });
      setFormData(INITIAL_FORM);
    }
  };

  const handleConfirmDelete = (id: string, title: string) => {
    onDeleteMovie(id);
    setConfirmDeleteId(null);
    if (editingId === id) {
      setEditingId(null);
      setFormData(INITIAL_FORM);
    }
    setStatusBanner({
      type: 'success',
      message: `Removed "${title}" from local catalog.`,
    });
  };

  const handleConfirmReset = () => {
    onResetCatalog();
    setConfirmReset(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setStatusBanner({
      type: 'success',
      message: 'Restored default CineWave demo catalog in localStorage.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6] font-display tracking-tight">
            Catalog Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#9a9aa6] mt-1">
            Add, edit, or remove movie metadata. Changes update the live platform immediately.
          </p>
        </div>

        {/* Reset Demo Data Control */}
        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#131317] hover:bg-[#1c1c22] text-xs font-semibold text-[#9a9aa6] hover:text-[#f4f4f6] border border-white/[0.12] flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Demo Catalog</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#1a1114] border border-[#e50914]/50 p-1.5 rounded-xl">
              <span className="text-xs text-[#f4f4f6] px-2 font-medium">
                Reset all custom edits?
              </span>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[32px] px-3 py-1 rounded-lg bg-[#e50914] text-white text-xs font-semibold"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[32px] px-2.5 py-1 rounded-lg bg-[#131317] text-[#9a9aa6] text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Security & LocalStorage Disclosure Banner */}
      <div className="rounded-2xl bg-[#131317] border border-amber-500/30 p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Local Browser Sandbox Notice — Not a Production Auth Database</span>
        </div>
        <p className="text-xs text-[#d4d4dc] leading-relaxed">
          This admin workspace operates in <strong>Local Browser Demo Mode</strong> so you can test
          creating, editing, and deleting movies without a paid backend or account. All changes are
          saved exclusively in your current browser’s <code className="font-mono text-white">localStorage</code>.
          Never expose an unauthenticated admin panel in production—when deploying to Cloudflare
          Pages with Cloudflare D1 &amp; R2, protect <code className="font-mono text-white">/admin</code> and
          mutation Worker endpoints behind <strong>Cloudflare Zero Trust Access</strong> and keep R2
          storage keys strictly inside server-side Worker bindings.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'deploy-guide' })}
            className="text-xs font-semibold text-[#e50914] hover:underline inline-flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5" />
            <span>View Cloudflare D1 + Private R2 + Worker Architecture Blueprint</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusBanner && (
        <div
          role="status"
          className={`rounded-xl p-4 border flex items-center justify-between gap-4 text-xs sm:text-sm ${
            statusBanner.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split: Form on Left (5 cols), Catalog Table/List on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Movie Metadata Form (All 7 Required Fields) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-[#131317] border border-white/[0.08] rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-[#f4f4f6] font-display">
              {editingId ? 'Edit Movie Metadata' : 'Add New Movie'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-semibold text-[#9a9aa6] hover:text-[#f4f4f6]"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* 1. Title */}
          <div className="space-y-1.5">
            <label htmlFor="field-title" className="block text-xs font-semibold text-[#f4f4f6]">
              1. Movie Title *
            </label>
            <input
              id="field-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Orbital Meridian"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-sm text-[#f4f4f6] focus:outline-none focus:border-[#e50914]"
            />
          </div>

          {/* 2. Genre & 3. Release Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="field-genre" className="block text-xs font-semibold text-[#f4f4f6]">
                2. Genre *
              </label>
              <select
                id="field-genre"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value as MovieGenre })
                }
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-sm text-[#f4f4f6] focus:outline-none focus:border-[#e50914]"
              >
                {MOVIE_GENRES.map((g) => (
                  <option key={g} value={g} className="bg-[#131317]">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="field-year" className="block text-xs font-semibold text-[#f4f4f6]">
                3. Release Year *
              </label>
              <input
                id="field-year"
                type="number"
                min={1900}
                max={2035}
                required
                value={formData.releaseYear}
                onChange={(e) =>
                  setFormData({ ...formData, releaseYear: Number(e.target.value) })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-sm text-[#f4f4f6] font-mono tabular-nums focus:outline-none focus:border-[#e50914]"
              />
            </div>
          </div>

          {/* 4. Poster URL + Quick Preset Picker */}
          <div className="space-y-1.5">
            <label htmlFor="field-poster" className="block text-xs font-semibold text-[#f4f4f6]">
              4. Poster URL *
            </label>
            <input
              id="field-poster"
              type="text"
              required
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              placeholder="https://... or select an artwork preset below"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-xs font-mono text-[#f4f4f6] focus:outline-none focus:border-[#e50914]"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_POSTERS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, posterUrl: p.url })}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-[#9a9aa6] hover:text-[#f4f4f6] transition-colors"
                >
                  Use {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Video URL + Licensed Stream Presets */}
          <div className="space-y-1.5">
            <label htmlFor="field-video" className="block text-xs font-semibold text-[#f4f4f6]">
              5. Video URL (Public Domain / CC-BY MP4 or WebM) *
            </label>
            <input
              id="field-video"
              type="text"
              required
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://commondatastorage.googleapis.com/..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-xs font-mono text-[#f4f4f6] focus:outline-none focus:border-[#e50914]"
            />
            <div className="space-y-1 pt-1">
              <span className="text-[11px] text-[#9a9aa6] block">
                Quick-fill licensed sample streams (or test broken URL handling):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LICENSED_VIDEOS.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, videoUrl: v.url })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-[#9a9aa6] hover:text-[#f4f4f6] transition-colors text-left"
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Description */}
          <div className="space-y-1.5">
            <label htmlFor="field-desc" className="block text-xs font-semibold text-[#f4f4f6]">
              6. Description / Synopsis *
            </label>
            <textarea
              id="field-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a compelling synopsis for the movie details page..."
              className="w-full p-3.5 rounded-xl bg-[#0a0a0c] border border-white/[0.12] text-sm text-[#f4f4f6] focus:outline-none focus:border-[#e50914]"
            />
          </div>

          {/* 7. Featured Status Toggle */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0a0a0c] border border-white/[0.08] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-[#e50914] rounded cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#f4f4f6] block">
                7. Set as Featured Home Spotlight
              </span>
              <span className="text-[#9a9aa6]">
                Promotes this movie to the primary widescreen hero banner on the Home page.
              </span>
            </div>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/20 transition-colors"
          >
            {editingId ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Movie to Catalog</span>
              </>
            )}
          </button>
        </form>

        {/* Existing Catalog Management List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#f4f4f6] font-display">
              Current Catalog ({movies.length} Titles)
            </h2>
            <span className="text-xs text-[#9a9aa6] font-mono">
              Stored in localStorage
            </span>
          </div>

          <div className="space-y-3">
            {movies.map((movie) => {
              const isDeleting = confirmDeleteId === movie.id;
              const isEditingThis = editingId === movie.id;

              return (
                <div
                  key={movie.id}
                  className={`p-4 rounded-2xl bg-[#131317] border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isEditingThis
                      ? 'border-[#e50914]'
                      : 'border-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div
                      onClick={() => onSelectMovie(movie.id)}
                      className="w-14 h-20 rounded-lg bg-[#1a1a20] overflow-hidden shrink-0 border border-white/[0.08] cursor-pointer flex items-center justify-center"
                    >
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-5 h-5 text-[#9a9aa6]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#9a9aa6] tabular-nums">
                        <span className="text-[#f4f4f6] font-medium">{movie.genre}</span>
                        <span aria-hidden="true">·</span>
                        <span>{movie.releaseYear}</span>
                        {movie.featured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#e50914] font-semibold">Featured Hero</span>
                          </>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectMovie(movie.id)}
                        className="text-base font-bold text-[#f4f4f6] font-display truncate cursor-pointer hover:text-[#e50914] transition-colors"
                      >
                        {movie.title}
                      </h3>

                      <p className="text-xs text-[#9a9aa6] line-clamp-1">
                        {movie.description}
                      </p>

                      <p className="text-[11px] font-mono text-[#9a9aa6]/80 truncate">
                        Stream: {movie.videoUrl || '(Missing Video URL)'}
                      </p>
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onPlayMovie(movie.id)}
                      title="Test video playback"
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-xs font-medium text-[#f4f4f6] flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 text-[#e50914] fill-current" />
                      <span>Test</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClick(movie)}
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-xs font-medium text-[#f4f4f6] flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {!isDeleting ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(movie.id)}
                        aria-label={`Delete ${movie.title}`}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#1c1c22] hover:bg-red-950/60 text-xs font-medium text-[#9a9aa6] hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-500/40 px-2 py-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(movie.id, movie.title)}
                          className="text-xs font-semibold text-red-200 hover:text-white px-1.5 py-0.5"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-[#9a9aa6] hover:text-white px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
