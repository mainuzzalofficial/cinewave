import React, { useState } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { Movie, MOVIE_GENRES, MovieGenre, AppView } from '../types/movie';
import { MovieCard } from '../components/MovieCard';

interface GenresPageProps {
  movies: Movie[];
  watchlistIds: string[];
  initialSelectedGenre?: MovieGenre;
  onNavigate: (view: AppView) => void;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

const GENRE_DESCRIPTIONS: Record<MovieGenre, string> = {
  'Sci-Fi': 'Speculative futures, orbital horizons, cybernetic architecture, and synthetic intelligence.',
  Thriller: 'High-stakes tension, neo-noir mysteries, acoustic surveillance, and covert protocols.',
  Action: 'Precision motorsport, endurance stages, and kinetic high-speed sequences.',
  Animation: 'Stylized open-movie 3D animation crafted by independent studio collectives.',
  Fantasy: 'Mythic journeys across glacial peaks, ancient guardians, and ember-lit realms.',
  Drama: 'Character-driven stories exploring memory, isolation, and human resilience.',
  Documentary: 'Real-world telemetry, engineering breakdowns, and field cinematography.',
};

export const GenresPage: React.FC<GenresPageProps> = ({
  movies,
  watchlistIds,
  initialSelectedGenre,
  onNavigate,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const [activeGenre, setActiveGenre] = useState<MovieGenre>(
    initialSelectedGenre || MOVIE_GENRES[0]
  );

  const genreCounts = MOVIE_GENRES.reduce<Record<MovieGenre, number>>((acc, g) => {
    acc[g] = movies.filter((m) => m.genre === g).length;
    return acc;
  }, {} as Record<MovieGenre, number>);

  const activeGenreMovies = movies.filter((m) => m.genre === activeGenre);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f6] font-display tracking-tight">
          Genres &amp; Categories
        </h1>
        <p className="text-xs sm:text-sm text-[#9a9aa6] mt-1">
          Select a genre below to inspect available films or add new titles to any category
        </p>
      </div>

      {/* Genre Directory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOVIE_GENRES.map((genre) => {
          const isSelected = activeGenre === genre;
          const count = genreCounts[genre] || 0;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              className={`text-left p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-4 min-h-[124px] ${
                isSelected
                  ? 'bg-[#1a1114] border-[#e50914] shadow-lg shadow-[#e50914]/10'
                  : 'bg-[#131317] border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <h2 className="text-lg font-bold text-[#f4f4f6] font-display">{genre}</h2>
                <span className="text-xs font-mono text-[#9a9aa6] tabular-nums">
                  {count} {count === 1 ? 'title' : 'titles'}
                </span>
              </div>
              <p className="text-xs text-[#9a9aa6] line-clamp-2 leading-relaxed">
                {GENRE_DESCRIPTIONS[genre]}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Genre Spotlight List */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#9a9aa6] tabular-nums">
              <Layers className="w-3.5 h-3.5 text-[#e50914]" />
              <span>Selected Category</span>
              <span aria-hidden="true">·</span>
              <span>{activeGenreMovies.length} movies</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] font-display mt-1">
              {activeGenre} Collection
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'movies', initialGenre: activeGenre })}
            className="text-xs font-semibold text-[#e50914] hover:text-[#f6121d] flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>Open in Full Search Browser</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeGenreMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeGenreMovies.map((movie) => (
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
          <div className="rounded-xl bg-[#131317] border border-white/[0.08] p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-[#f4f4f6]">
              No movies in {activeGenre} yet
            </p>
            <p className="text-xs text-[#9a9aa6] max-w-md mx-auto">
              Want to populate the {activeGenre} shelf? Open Catalog Admin to add a movie with
              custom metadata and a licensed stream URL.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'admin' })}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#e50914] text-white text-xs font-semibold hover:bg-[#f6121d] transition-colors"
            >
              Add {activeGenre} Movie
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
