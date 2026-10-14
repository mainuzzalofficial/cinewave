import React from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Movie, AppView } from '../types/movie';
import { MovieCard } from '../components/MovieCard';

interface WatchlistPageProps {
  movies: Movie[];
  watchlistIds: string[];
  onNavigate: (view: AppView) => void;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  movies,
  watchlistIds,
  onNavigate,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const watchlistMovies = watchlistIds
    .map((id) => movies.find((m) => m.id === id))
    .filter((m): m is Movie => Boolean(m));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6] font-display tracking-tight">
            My List
          </h1>
          <p className="text-xs sm:text-sm text-[#9a9aa6] mt-1 tabular-nums">
            {watchlistMovies.length} {watchlistMovies.length === 1 ? 'movie' : 'movies'} saved in
            this browser’s localStorage
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate({ page: 'movies' })}
          className="text-xs font-semibold text-[#e50914] hover:text-[#f6121d] flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <span>Browse More Movies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Watchlist Grid or Empty State */}
      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={true}
              onSelectMovie={onSelectMovie}
              onPlayMovie={onPlayMovie}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#131317] border border-white/[0.08] p-12 text-center max-w-lg mx-auto my-8 space-y-4">
          <Bookmark className="w-10 h-10 text-[#e50914] mx-auto opacity-85" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#f4f4f6] font-display">
              Your Watchlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9aa6] leading-relaxed">
              Tap the <span className="text-[#f4f4f6] font-semibold">+</span> button on any movie
              poster to save titles for quick access. Your list is stored locally in your current
              browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'movies' })}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-semibold transition-colors"
          >
            Explore Movies
          </button>
        </div>
      )}
    </div>
  );
};
