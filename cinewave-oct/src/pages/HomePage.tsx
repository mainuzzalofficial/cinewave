import React, { useState } from 'react';
import { Play, Info, Plus, Check, ArrowRight, Film } from 'lucide-react';
import { Movie, MOVIE_GENRES, MovieGenre, AppView } from '../types/movie';
import { MovieCard } from '../components/MovieCard';
import heroBackdropFallback from '../assets/images/hero_featured_backdrop_1791721801607.jpg';

interface HomePageProps {
  movies: Movie[];
  watchlistIds: string[];
  onNavigate: (view: AppView) => void;
  onSelectMovie: (movieId: string) => void;
  onPlayMovie: (movieId: string) => void;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  movies,
  watchlistIds,
  onNavigate,
  onSelectMovie,
  onPlayMovie,
  onToggleWatchlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [heroImgError, setHeroImgError] = useState(false);

  const featuredMovie = movies.find((m) => m.featured) || movies[0];
  const trendingMovies = movies.filter((m) => m.trending || m.featured).slice(0, 4);
  const latestReleases = [...movies]
    .sort((a, b) => b.releaseYear - a.releaseYear || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  const categoryFilteredMovies =
    selectedCategory === 'All'
      ? movies
      : movies.filter((m) => m.genre === selectedCategory);

  const isFeaturedInWatchlist = featuredMovie
    ? watchlistIds.includes(featuredMovie.id)
    : false;

  return (
    <div className="space-y-12 pb-8">
      {/* 1. Featured Movie Hero Banner */}
      {featuredMovie && (
        <section className="relative w-full min-h-[460px] md:min-h-[540px] lg:min-h-[600px] flex items-end bg-[#131317] overflow-hidden border-b border-white/[0.08]">
          {/* Background Widescreen Still */}
          <div className="absolute inset-0">
            {!heroImgError ? (
              <img
                src={featuredMovie.backdropUrl || featuredMovie.posterUrl || heroBackdropFallback}
                alt={featuredMovie.title}
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover object-center opacity-65 scale-102"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2a0c10] via-[#131317] to-[#0a0a0c]" />
            )}
            {/* Measured Contrast Scrims for WCAG AA Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/75 to-transparent" />
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pb-14">
            <div className="max-w-2xl space-y-4">
              {/* Quiet 1-line text kicker (Unboxed, Zero-Pill) */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#9a9aa6] tabular-nums">
                <span className="text-[#e50914] font-semibold">Featured Selection</span>
                <span aria-hidden="true">·</span>
                <span>{featuredMovie.genre}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredMovie.releaseYear}</span>
                {featuredMovie.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-xs">{featuredMovie.duration}</span>
                  </>
                )}
              </div>

              <h1
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#f4f4f6] tracking-tight font-display leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                {featuredMovie.title}
              </h1>

              <p className="text-sm sm:text-base text-[#d4d4dc] leading-relaxed line-clamp-3 max-w-xl">
                {featuredMovie.description}
              </p>

              {/* Hero Action Buttons (48px mobile-friendly touch targets) */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onPlayMovie(featuredMovie.id)}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#f6121d] text-white font-semibold text-sm flex items-center gap-2.5 shadow-lg shadow-[#e50914]/25 transition-transform active:scale-95 whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectMovie(featuredMovie.id)}
                  className="min-h-[48px] px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#f4f4f6] border border-white/15 font-semibold text-sm flex items-center gap-2 backdrop-blur-md transition-colors whitespace-nowrap shrink-0"
                >
                  <Info className="w-4 h-4" />
                  <span>Details</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => onToggleWatchlist(featuredMovie.id, e)}
                  className={`min-h-[48px] px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 border transition-colors whitespace-nowrap shrink-0 ${
                    isFeaturedInWatchlist
                      ? 'bg-[#1a1a20] text-[#f4f4f6] border-[#e50914]'
                      : 'bg-black/50 text-[#f4f4f6] border-white/15 hover:border-white/35'
                  }`}
                >
                  {isFeaturedInWatchlist ? (
                    <>
                      <Check className="w-4 h-4 text-[#e50914]" />
                      <span>In My List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>My List</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Local Demo Transparency Callout (Subtle all-around hairline border, no thick left bar) */}
        <div className="rounded-xl bg-[#131317] border border-white/[0.08] p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-[#f4f4f6]">
              Instant Browser Demo Mode · No Account or Paid API Required
            </p>
            <p className="text-xs text-[#9a9aa6]">
              Your custom movies and Watchlist are saved in this browser’s{' '}
              <code className="text-[#f4f4f6] font-mono">localStorage</code>. All streams are
              openly licensed Creative Commons &amp; public-domain videos.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'admin' })}
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#1c1c22] hover:bg-[#25252d] text-xs font-medium text-[#f4f4f6] border border-white/[0.08] transition-colors whitespace-nowrap"
            >
              Manage Catalog
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'deploy-guide' })}
              className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium text-[#9a9aa6] hover:text-[#f4f4f6] transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>Cloudflare Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Trending Movies Section */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] font-display tracking-tight">
                Trending Now
              </h2>
              <p className="text-xs text-[#9a9aa6] mt-0.5">
                High-bitrate open cinema selections popular on CineWave
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'movies' })}
              className="text-xs font-semibold text-[#e50914] hover:text-[#f6121d] flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingMovies.map((movie) => (
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
        </section>

        {/* 3. Latest Releases Section */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] font-display tracking-tight">
                Latest Releases
              </h2>
              <p className="text-xs text-[#9a9aa6] mt-0.5">
                Recently added films and remastered open shorts
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'movies' })}
              className="text-xs font-semibold text-[#e50914] hover:text-[#f6121d] flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestReleases.map((movie) => (
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
        </section>

        {/* 4. Categories / Interactive Genre Explorer */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f4f4f6] font-display tracking-tight">
                Explore by Category
              </h2>
              <p className="text-xs text-[#9a9aa6] mt-0.5">
                Filter the streaming catalog by genre or open the dedicated genre index
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate({
                  page: 'genres',
                  selectedGenre:
                    selectedCategory !== 'All' ? (selectedCategory as MovieGenre) : undefined,
                })
              }
              className="text-xs font-semibold text-[#9a9aa6] hover:text-[#f4f4f6] flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>Open Full Genre Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Segmented Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-[#131317] rounded-xl border border-white/[0.08]">
            {['All', ...MOVIE_GENRES].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#e50914] text-white shadow-sm'
                      : 'text-[#9a9aa6] hover:text-[#f4f4f6] hover:bg-white/[0.04]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {categoryFilteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categoryFilteredMovies.map((movie) => (
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
              <Film className="w-8 h-8 text-[#9a9aa6] mx-auto" />
              <p className="text-sm font-medium text-[#f4f4f6]">
                No movies currently listed in {selectedCategory}
              </p>
              <p className="text-xs text-[#9a9aa6]">
                You can add a new {selectedCategory} title via the Catalog Admin page.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-[#1c1c22] text-xs font-semibold text-[#f4f4f6] hover:bg-[#25252d] transition-colors"
              >
                Show All Categories
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
