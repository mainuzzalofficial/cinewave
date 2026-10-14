import React, { useState } from 'react';
import { ArrowLeft, Play, Plus, Check, Edit3, Film, ShieldCheck } from 'lucide-react';
import { Movie, AppView } from '../types/movie';
import { MovieCard } from '../components/MovieCard';

interface MovieDetailsPageProps {
  movie?: Movie;
  allMovies: Movie[];
  watchlistIds: string[];
  savedProgressSeconds: number;
  onNavigate: (view: AppView) => void;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  allMovies,
  watchlistIds,
  savedProgressSeconds,
  onNavigate,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const [posterError, setPosterError] = useState(false);

  if (!movie) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Film className="w-12 h-12 text-[#e50914] mx-auto" />
        <h1 className="text-2xl font-bold text-[#f4f4f6] font-display">Movie Not Found</h1>
        <p className="text-sm text-[#9a9aa6]">
          The requested movie could not be found in your local catalog. It may have been deleted.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'movies' })}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e50914] text-white text-xs font-semibold"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  const isInWatchlist = watchlistIds.includes(movie.id);
  const relatedMovies = allMovies
    .filter((m) => m.id !== movie.id && (m.genre === movie.genre || m.featured))
    .slice(0, 4);

  const formatProgress = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return mins > 0 ? `${mins}m ${rem}s` : `${rem}s`;
  };

  return (
    <div className="space-y-14 pb-10">
      {/* Top Hero Details Split */}
      <section className="relative bg-[#131317] border-b border-white/[0.08] overflow-hidden">
        {/* Ambient blurred backdrop */}
        {!posterError && (movie.backdropUrl || movie.posterUrl) && (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover blur-2xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/60" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Breadcrumb */}
          <button
            type="button"
            onClick={() => onNavigate({ page: 'movies' })}
            className="min-h-[40px] inline-flex items-center gap-2 text-xs font-semibold text-[#9a9aa6] hover:text-[#f4f4f6] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Poster Column (3:4 Vertical Aspect Ratio) */}
            <div className="md:col-span-4 lg:col-span-3 max-w-[280px] sm:max-w-[320px] mx-auto md:mx-0 w-full">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#1a1a20] border border-white/[0.12] shadow-2xl">
                {!posterError && movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    referrerPolicy="no-referrer"
                    onError={() => setPosterError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1c1c24] to-[#2a0c10]">
                    <Film className="w-12 h-12 text-[#e50914] mb-3" />
                    <span className="text-base font-bold text-[#f4f4f6] font-display">
                      {movie.title}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Metadata & Actions Column */}
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <div className="space-y-3">
                {/* Unboxed Clean Metadata Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#9a9aa6] tabular-nums">
                  <button
                    type="button"
                    onClick={() => onNavigate({ page: 'genres', selectedGenre: movie.genre })}
                    className="text-[#e50914] hover:underline font-semibold"
                  >
                    {movie.genre}
                  </button>
                  <span aria-hidden="true">·</span>
                  <span>{movie.releaseYear}</span>
                  {movie.duration && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-xs">{movie.duration}</span>
                    </>
                  )}
                  {movie.featured && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#f4f4f6]">Featured Spotlight</span>
                    </>
                  )}
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4f4f6] font-display tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {movie.title}
                </h1>
              </div>

              {/* Synopsis */}
              <p className="text-sm sm:text-base text-[#d4d4dc] leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {/* Primary CTA Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onPlayMovie(movie.id)}
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-[#e50914]/25 transition-transform active:scale-95 whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {savedProgressSeconds > 5
                      ? `Resume (${formatProgress(savedProgressSeconds)})`
                      : 'Play Movie'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => onToggleWatchlist(movie.id, e)}
                  className={`min-h-[48px] px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border transition-colors whitespace-nowrap ${
                    isInWatchlist
                      ? 'bg-[#1a1a20] text-[#f4f4f6] border-[#e50914]'
                      : 'bg-[#131317] text-[#f4f4f6] border-white/15 hover:border-white/35'
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-4 h-4 text-[#e50914]" />
                      <span>Saved in My List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to My List</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'admin' })}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-transparent hover:bg-white/[0.05] text-[#9a9aa6] hover:text-[#f4f4f6] border border-white/[0.08] text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Metadata in Admin</span>
                </button>
              </div>

              {/* Technical & Licensing Specifications */}
              <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[#9a9aa6] block">Director / Creator</span>
                  <span className="text-[#f4f4f6] font-medium">
                    {movie.director || 'Independent Open Cinema Collective'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#9a9aa6] block">Stream License &amp; Source</span>
                  <span className="text-[#f4f4f6] font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{movie.licenseInfo || 'Public Domain / Authorized Open Stream'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related / More Like This */}
      {relatedMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="border-b border-white/[0.08] pb-3">
            <h2 className="text-xl font-bold text-[#f4f4f6] font-display">More Like This</h2>
            <p className="text-xs text-[#9a9aa6] mt-0.5">
              Additional titles in {movie.genre} and featured picks
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedMovies.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                isInWatchlist={watchlistIds.includes(item.id)}
                onSelectMovie={onSelectMovie}
                onPlayMovie={onPlayMovie}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
