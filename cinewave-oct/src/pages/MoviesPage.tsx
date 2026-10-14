import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Film } from 'lucide-react';
import { Movie, MOVIE_GENRES } from '../types/movie';
import { MovieCard } from '../components/MovieCard';

interface MoviesPageProps {
  movies: Movie[];
  watchlistIds: string[];
  initialGenre?: string;
  initialQuery?: string;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({
  movies,
  watchlistIds,
  initialGenre = 'All',
  initialQuery = '',
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'featured'>('featured');

  const filteredMovies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return movies
      .filter((movie) => {
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
        const matchesQuery =
          !q ||
          movie.title.toLowerCase().includes(q) ||
          movie.description.toLowerCase().includes(q) ||
          movie.genre.toLowerCase().includes(q) ||
          String(movie.releaseYear).includes(q);
        return matchesGenre && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return b.releaseYear - a.releaseYear;
        }
        if (sortBy === 'newest') {
          return b.releaseYear - a.releaseYear;
        }
        return a.title.localeCompare(b.title);
      });
  }, [movies, searchQuery, selectedGenre, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6] font-display tracking-tight">
            Browse Movies
          </h1>
          <p className="text-xs sm:text-sm text-[#9a9aa6] mt-1 tabular-nums">
            Showing {filteredMovies.length} of {movies.length} available titles in your catalog
          </p>
        </div>

        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-[#9a9aa6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, genre, year..."
              aria-label="Search movies"
              className="w-full min-h-[44px] pl-10 pr-9 py-2 bg-[#131317] border border-white/[0.12] rounded-xl text-sm text-[#f4f4f6] placeholder-[#9a9aa6] focus:outline-none focus:border-[#e50914] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#9a9aa6] hover:text-[#f4f4f6]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#131317] border border-white/[0.12] rounded-xl px-3 min-h-[44px]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9a9aa6] shrink-0" />
            <label htmlFor="movie-sort" className="text-xs text-[#9a9aa6] whitespace-nowrap">
              Sort:
            </label>
            <select
              id="movie-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'title' | 'featured')}
              className="bg-transparent text-xs font-semibold text-[#f4f4f6] focus:outline-none py-2 pr-1 cursor-pointer"
            >
              <option value="featured" className="bg-[#131317] text-[#f4f4f6]">
                Featured First
              </option>
              <option value="newest" className="bg-[#131317] text-[#f4f4f6]">
                Release Year (Newest)
              </option>
              <option value="title" className="bg-[#131317] text-[#f4f4f6]">
                Title (A–Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Genre Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-[#131317] rounded-xl border border-white/[0.08]">
        {['All', ...MOVIE_GENRES].map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#e50914] text-white shadow-sm'
                  : 'text-[#9a9aa6] hover:text-[#f4f4f6] hover:bg-white/[0.04]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Movie Grid or Empty State */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={watchlistIds.includes(movie.id)}
              onSelectMovie={onSelectMovie}
              onPlayMovie={onPlayMovie}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#131317] border border-white/[0.08] p-12 text-center max-w-lg mx-auto my-8 space-y-4">
          <Film className="w-10 h-10 text-[#e50914] mx-auto opacity-85" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#f4f4f6] font-display">
              No matching movies found
            </h2>
            <p className="text-xs sm:text-sm text-[#9a9aa6]">
              No titles matched your filter for{' '}
              <span className="text-[#f4f4f6] font-medium">
                {searchQuery ? `"${searchQuery}"` : selectedGenre}
              </span>
              . Try clearing filters or searching another keyword.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white text-xs font-semibold transition-colors"
          >
            Reset Search &amp; Filters
          </button>
        </div>
      )}
    </div>
  );
};
