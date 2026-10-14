import React, { useState } from 'react';
import { Play, Plus, Check, Film } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWatchlist,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      onClick={() => onSelectMovie(movie.id)}
      className="group relative flex flex-col bg-[#131317] rounded-xl overflow-hidden border border-white/[0.08] hover:border-white/[0.22] transition-all duration-200 cursor-pointer"
    >
      {/* 3:4 Vertical Movie Poster Container */}
      <div className="relative aspect-[3/4] w-full bg-[#1a1a20] overflow-hidden">
        {!imgError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200 ease-out"
          />
        ) : (
          /* Resilient Zero-Broken-Image Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-[#1c1c24] via-[#131317] to-[#2a0c10]">
            <Film className="w-10 h-10 text-[#e50914]/80 mb-3" />
            <span className="text-sm font-semibold text-[#f4f4f6] line-clamp-2 font-display">
              {movie.title}
            </span>
            <span className="text-xs text-[#9a9aa6] mt-1 tabular-nums">
              {movie.genre} · {movie.releaseYear}
            </span>
          </div>
        )}

        {/* Measured Scrim Overlay for Hover & Mobile Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-200" />

        {/* Top-Right Quick Watchlist Toggle Button (44x44px hit target for mobile ergonomics) */}
        <button
          type="button"
          onClick={(e) => onToggleWatchlist(movie.id, e)}
          aria-label={isInWatchlist ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
          title={isInWatchlist ? 'In My List' : 'Add to My List'}
          className={`absolute top-2 right-2 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center backdrop-blur-md transition-colors duration-150 ${
            isInWatchlist
              ? 'bg-[#e50914] text-white'
              : 'bg-black/65 text-[#f4f4f6] border border-white/20 hover:bg-black/90 hover:border-white/40'
          }`}
        >
          {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* Bottom Overlay Play Trigger */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayMovie(movie.id);
            }}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-transform duration-150 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play</span>
          </button>

          {movie.duration && (
            <span className="text-[11px] font-mono text-white/80 tabular-nums truncate">
              {movie.duration}
            </span>
          )}
        </div>
      </div>

      {/* Card Body — Clean Unboxed Typography (Zero-Pill Discipline) */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#f4f4f6] group-hover:text-white line-clamp-1 font-display">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#9a9aa6] mt-1 tabular-nums">
            <span>{movie.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.releaseYear}</span>
            {movie.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#e50914] font-medium">Featured</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
